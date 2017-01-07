'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');

let KeyDefine = new Define();
let RoleType = KeyDefine.ROLE_TYPE;

let ActionFunc = {
    "allocateClinic": () => {

    },
    "analyzeClinicDoc": (clinicData, actionData, userData) => {

    },
    "analyzeClinicTech": (clinicData, actionData, userData) => {

    },
    "revokeClinicTech": (clinicData, actionData, userData) => {

    },
    "publishReportDoc": () => {

    },
    "submitReportTech": () => {

    },
    "auditFailedDoc": (clinicData, actionData, userData) => {

    },
    "reanalyzeTech": (clinicData, actionData, userData) => {

    },
    "auditSuccessDoc": (clinicData, actionData, userData) => {

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
