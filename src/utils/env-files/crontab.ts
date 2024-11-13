export const crontab = async (systemName: string): Promise<string> => {
    if (systemName === 'QMS') {
        return `
        SHELL=/bin/sh
        PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
        # m h dom mon dow user  command
        17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
        25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
        47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
        52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
        00 07 * * *    root    bash /home/zeuor/QMS/cronemail.sh
        */1 * * * *    root    bash /home/zeuor/QMS/cronconv.sh
        05 *  * * *    root    bash /home/zeuor/QMS/checkinbranch.sh
        59 23 * * *    root    bash /home/zeuor/QMS/cronsendemailreport.sh
        */1 * * * *    root    bash /home/zeuor/QMS/fix_redis.sh
        */1 * * * *    root    bash /home/zeuor/QMS/reset.sh
        10 00 * * *    root    bash /home/zeuor/scripts/exportDB.sh
        59 23 * * *    root    bash /home/zeuor/scripts/rotate_logs.sh
        `;
    }else{
    // Handle other cases or return an error if needed
    throw new Error('Unsupported system name');
}};
