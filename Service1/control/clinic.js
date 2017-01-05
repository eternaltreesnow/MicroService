'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const clinicModel = require('../model/clinic');

let KeyDefine = new Define();

let Clinic = {};

Clinic.getClinic = function(clinicId) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
        data: null
    };

    if(!clinicId) {
        result.desc = 'Clinic Control: Null clinicId';
        defer.resolve(result);
    } else {
        clinicModel.get(clinicId)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.data = clinicResult.data;
                }
                defer.resolve(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Clinic Model Error';
                defer.reject(result);
            });
    }
    return defer.promise;
};

module.exports = Clinic;
