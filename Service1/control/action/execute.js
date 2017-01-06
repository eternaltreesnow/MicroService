'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');

let KeyDefine = new Define();
let RoleType = KeyDefine.ROLE_TYPE;

let ActionFunc = {
    "allocateClinic": () => {

    },
    "analyzeClinicDoc": () => {

    },
    "analyzeClinicTech": () => {

    },
    "revokeClinicTech": () => {

    },
    "publishReportDoc": () => {

    },
    "submitReportTech": () => {

    },
    "auditFailedDoc": () => {

    },
    "reanalyzeTech": () => {

    },
    "auditSuccessDoc": () => {

    },
    "initConsulAudit": () => {

    },
    "initConsulAnalysis": () => {

    },
    "publishReportConsul": () => {

    }
};

module.exports = function(clinicData, actionData, userData) {
    let defer = Q.defer();

    ActionFunc[actionData.name](clinicData, actionData, userData)
        .then(actionResult => {

        }).catch(error => {

        })

    return defer.promise;
};
