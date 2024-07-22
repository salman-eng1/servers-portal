import { createFile } from "@portal/services/create-file";
import { execute } from "@portal/services/non-streamed-command";
import { logger } from "@portal/utils/logging";

export const setupQmscripts = async (msaIP: string): Promise<void> => {
    const crontab = `
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
00 07 * * *    root bash /home/zeour/QMS/cronemail.sh
*/1 * * * *    root bash /home/zeour/QMS/cronconv.sh
05 *  * * *    root bash /home/zeour/QMS/checkinbranch.sh
59 23 * * *    root bash /home/zeour/QMS/cronsendemailreport.sh
*/1 * * * *    root bash /home/zeour/QMS/fix_redis.sh
*/1 * * * *    root bash /home/zeour/QMS/reset.sh
10 00 * * *    root bash /home/zeour/scripts/exportDB.sh
59 23 * * *    root bash /home/zeour/scripts/rotate_logs.sh
`;

    const fix_redis = `
#! /bin/bash
if lsof -Pi :6003 -sTCP:LISTEN -t >/dev/null ; then
    echo "running" > /home/zeour/redisstatus.log
else
    sleep 4s
    tmux kill-session -t branch1
    tmux new-session -d -s branch1
    tmux send-keys -t branch ENTER
    tmux send-keys -t branch 'bash' ENTER
    tmux send-keys -t branch 'cd /var/www/QMS' ENTER
    tmux send-keys -t branch 'laravel-echo-server start --force' ENTER
fi
`;

    const reset = `
#!/bin/bash

branches=\$(curl http://${msaIP}:8070/check_reset)

# Check if the first line of the response starts with '<!DOCTYPE html>'
if echo "\$branches" | head -n 1 | grep -q '^<!DOCTYPE html>'; then
    exit 1
fi
newstr=\${branches:2:-1}
IFS=, read -r -a myarray <<< "\$newstr"
declare -a successful_indices
while true; do
    if [ \${#myarray[@]} -eq 0 ]; then
        echo "All requests successful. Exiting loop."
        break
    else
        echo "Array is not empty. Commenting crontab line."
        sed -i '/reset.sh/s/^/#/' /etc/crontab
        sleep 80s
    fi
    successful_indices=()
    # Create an array to track indices of successful requests

    for index in "\${!myarray[@]}"; do
        echo "this is branches needs to be reset >>>> \${myarray[@]}"
        response=\$(curl -s -o /dev/null -w "%{http_code}" -X POST http://${msaIP}:8070/reset/\${myarray[index]} --header 'Content-Length:0' --header 'Accept:application/json')

        # Check if the response indicates success
        if [ "\$response" == "200" ]; then
            successful_indices+=("\$index")
            echo "\$response ... branch \${myarray[index]} reset successfully"
        fi
    done

    # Remove successful indices from myarray
    for index in "\${successful_indices[@]}"; do
        echo  "\${successful_indices[index]} will be removed from \${myarray[index]}"
        unset "myarray[index]"
    done
    # Re-index myarray
    myarray=("\${myarray[@]}")

    echo "reset failed for branches with IDs >>> \${myarray[@]} "

    if [ \${#myarray[@]} -eq 0 ]; then
        echo "All requests successful. Exiting loop."
        sed -i '/reset.sh/s/^#//' /etc/crontab
        break
    fi
done
echo "ok" > /home/zeour/testcron.txt
`;

    const exportDB = `
#!/bin/bash
#author : Shadi Yousef <shadiyousef0@gmail.com>
#--------------------------------------------------------------------start------------------------------------------------------------------

BackUpDIR="/home/zeour/backups/";
DateStamp=\$(date +"%Y%m%d-%H%M%S");
DateStampPrint=\$(date +"%Y-%m-%d %H:%M:%S");

#threshold for backup time
threshold=\$(awk "BEGIN {printf \\"%.2f\\", 2}")
host=\$(hostname)

#connection parameters
DBUser="root";
DBPwd="zeUOr@suLY"
cd \$BackUpDIR;

declare -a StringArray=("zeuor_DB" "central_DB" )
# Iterate the string array using for loop
start=\$(date +%s)
for DB in \${StringArray[@]}; do
    mysqldump -u\$DBUser -p\$DBPwd \$DB > \$BackUpDIR\$DateStamp.\$DB.sql;
    if [ \$? -eq 0 ]; then
        echo "\$DateStampPrint        \$DB               BackUp Success :)  [OK]" >> /home/zeour/backup-log/MySql.log;
        find \$BackUpDIR -name "*.zip" -ctime +10 | xargs rm -f;
    else
        echo "\$DateStampPrint        \$DB             Backup#=1       BackUp Failed :(   [ERROR]" >> /home/zeour/backup-log/MySql.log;
        echo "\$DateStampPrint        \$DB             Backup#=1       BackUp Error :(" >> /home/zeour/backup-log/MySql.Error;
    fi

    tar zcf "\$BackUpDIR\$DateStamp.DB.\$DB.tar.gz" -P \$BackUpDIR\$DateStamp.\$DB.sql;

    if [ \$? -eq 0 ]; then
        echo "\$DateStampPrint        \$DB                Tar Success :)             [OK]" >> /home/zeour/backup-log/MySql.log;
    else
        echo "\$DateStampPrint        \$DB             Backup#=1       Tar Failed :(              [ERROR]" >> /home/zeour/backup-log/MySql.log;
        echo "\$DateStampPrint        \$DB             Backup#=1       Tar Error :(" >> /home/zeour/backup-log/MySql.Error;
    fi

    rm -rf \$BackUpDIR\$DateStamp.\$DB.sql;

    if [ \$? -eq 0 ]; then
        echo "\$DateStampPrint        \$DB            RM Success :)              [OK]" >> /home/zeour/backup-log/MySql.log;
    else
        echo "\$DateStampPrint        \$DB             Backup#=1       RM Failed :(               [ERROR]" >> /home/zeour/backup-log/MySql.log;
        echo "\$DateStampPrint        \$DB             Backup#=1       RM Error :(" >> /home/zeour/backup-log/MySql.Error;
    fi
done
zip -r backup_DB_\$DateStamp.zip *.gz
rm *central*
rm *zeuor*
end=\$(date +%s)
let runtime=end-start
runtimem=\$(awk "BEGIN {printf \\"%.2f\\", \$runtime/60}")
echo "---------------------------------------------------" >> /home/zeour/backup-log/MySql.log;
echo "runtime-for-Backup-operation=\$runtimem minutes" >> /home/zeour/backup-log/MySql.log;
echo "***********************************************************" >> /home/zeour/backup-log/MySql.log;
#--------------------------------------------------------------------end--------------------------------------------------------------------
sshpass -p PUK@@zeOur@www666rd ssh -o StrictHostKeyChecking=no zeour@127.0.0.1 -p 5050 uptime
sshpass -p PUK@@zeOur@www666rd scp -P 5050 backup_DB_\$DateStamp.zip zeour@127.0.0.1:/home/zeour/backups
`;

    const checkinbranch = `
valueinc=\`mysql -uzeuor -pzeUOr@suLY -s -N -e "SELECT increment_time FROM branch1_DB.temp"\`
zero=0;
if [[ \$valueinc -eq \$zero ]]; then
    sed -i "/\\b\\(cronincb.sh\\)\\b/d" /etc/crontab
else
    sed -i "/\\b\\(cronincb.sh\\)\\b/d" /etc/crontab
    echo "*/\$valueinc *   * * *   root bash /home/zeour/QMS/cronincb.sh" >> /etc/crontab
fi

cat /etc/crontab > tempcron
`;

    const cronconv = `
#!/bin/bash
curl http://${msaIP}:8070/update_conversion_time
`;

    const cronemail = `
#!/bin/bash
curl http://${msaIP}:8070/send_reminder_email
`;

    const cronsendemailreport = `
#!/bin/bash
curl http://${msaIP}:8070/send_email_report
`;

const permission=`
#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: Project path not provided. Usage: ./fix_permissions.sh <project_path> <projectname>"
    exit 1
fi

if [ -z "$2" ]; then
    echo "Error: Project name not provided. Usage: ./fix_permissions.sh <project_path> <projectname>"
    exit 1
fi

project_path="$1"
projectname="$2"

sudo chown -R zeour:www-data "$project_path/$projectname"
sudo find "$project_path/$projectname" -type f -exec chmod 664 {} \;
sudo find "$project_path/$projectname" -type d -exec chmod 775 {} \;
sudo chgrp -R www-data "$project_path/$projectname/storage" "$project_path/$projectname/bootstrap/cache"
sudo chmod -R ug+rwx "$project_path/$projectname/storage" "$project_path/$projectname/bootstrap/cache"

echo "Fixed permissions for $projectname"

`


const changeEnvIP=
`
#!/bin/bash

SEARCH_DIR=$3

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 search_pattern replacement"
  exit 1
fi

SEARCH_PATTERN=$1
REPLACEMENT=$2

# Find all .env files and execute sed command on each
find "$SEARCH_DIR" -type f -name ".env" | while read -r env_file; do
  echo "changing IPs at $env_file"
  sed -i "s/$SEARCH_PATTERN/$REPLACEMENT/g" "$env_file"
done

echo "Finished processing all .env files."
`

    try {
        await execute(`rm /home/zeour/QMS/* && rm /home/zeour/scripts/*`, 'terminal');
        await execute(`echo "${crontab}" > /etc/crontab`, 'terminal');
        await createFile(fix_redis,'/home/zeour/QMS/fix_redis.sh',0o755);
        await createFile(reset,'/home/zeour/QMS/reset.sh',0o755);
        await createFile(checkinbranch,'/home/zeour/QMS/checkinbranch.sh',0o755);
        await createFile(cronconv,'/home/zeour/QMS/cronconv.sh',0o755);
        await createFile(cronemail,'/home/zeour/QMS/cronemail.sh',0o755);
        await createFile(changeEnvIP,'/home/zeour/scripts/changeEnvIP.sh',0o755);
        await createFile(exportDB,'/home/zeour/scripts/exportDB.sh',0o755);
        await createFile(cronsendemailreport,'/home/zeour/QMS/cronsendemailreport.sh',0o755);
        await createFile(permission,'/home/zeour/QMS/permission.sh',0o755);

    } catch (err) {
        logger.log('error', 'error in setupQmscripts() Method',err);
    }
};
