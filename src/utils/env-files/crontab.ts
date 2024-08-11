export const crontab =async () =>{
    return`
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
}