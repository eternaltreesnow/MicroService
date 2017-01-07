'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const multer = require('../util/multer-util');

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
                defer.resolve(result);
            });
    }
    return defer.promise;
};

Clinic.setClinic = function(clinic) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
    };

    if(!clinic) {
        result.desc = 'Clinic Control: Empty Clinic';
        defer.resolve(result);
    } else {
        clinicModel.set(clinic)
            .then(clinicResult => {
                Logger.console(clinicResult);
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                defer.resolve(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Clinic Model Error';
                defer.resolve(result);
            });
    }

    return defer.promise;
};

Clinic.addClinic = function(req, res) {
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
        data: null
    };

    let upload = multer('ecg-file').single('ecg-file');
    upload(req, res, (err) => {
        if(err) {
            Logger.console(err);
            res.send(err);
        }
        let clinic = {
            patientId: req.body.patientId,
            addTime: Date.now(),
            file: req.file.filename,
            hospitalId: req.body.hospitalId,
            state: 2
        };
        clinicModel.add(clinic)
            .then(clinicResult => {
                Logger.console(clinicResult);
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.data = clinicResult.data;
                }
                res.send(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Clinic Model error';
                res.send(result);
            });
    });
};

module.exports = Clinic;
