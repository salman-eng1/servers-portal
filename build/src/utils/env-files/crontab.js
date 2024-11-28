"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crontabCreate = exports.crontab = void 0;
const crontab = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    if (systemName === 'QMS') {
        return `
        00 07 * * *    root    bash /home/zeuor/QMS/cronemail.sh
        */1 * * * *    root    bash /home/zeuor/QMS/cronconv.sh
        05 *  * * *    root    bash /home/zeuor/QMS/checkinbranch.sh
        59 23 * * *    root    bash /home/zeuor/QMS/cronsendemailreport.sh
        */1 * * * *    root    bash /home/zeuor/QMS/runqueuework/runqueuework.sh
        */1 * * * *    root    bash /home/zeuor/QMS/fix_redis.sh
        */1 * * * *    root    bash /home/zeuor/QMS/reset.sh
        `;
    }
    else if (systemName === 'DGSN') {
        return `
    #######################${systemName}#######################
    `;
    }
    else if (systemName === 'VMS') {
        return `
    */3 * * * *    root bash /home/zeuor/VMS/vms-reset.sh
    `;
    }
    else if (systemName === 'RMS') {
        return `
    #######################${systemName}#######################
    `;
    }
    else if (systemName === 'GLARUS_CONFIG') {
        return `
    #######################${systemName}#######################
    `;
    }
    else {
        throw Error('error in creating crontab');
    }
});
exports.crontab = crontab;
const crontabCreate = () => __awaiter(void 0, void 0, void 0, function* () {
    return `
    SHELL=/bin/sh
    PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
    # m h dom mon dow user  command
    17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
    25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
    47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
    52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
    */5 * * * *    root bash /home/logging_system/logging_script.sh
    10 00 * * *    root    bash /home/zeuor/scripts/exportDB.sh
    59 23 * * *    root    bash /home/zeuor/scripts/rotate_logs.sh
    `;
});
exports.crontabCreate = crontabCreate;
//# sourceMappingURL=crontab.js.map