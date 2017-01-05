'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const clinicModel = require('../model/clinic');

let KeyDefine = new Define();

let Clinic = {};

Clinic.getClinic = function(req, res) {
    let clinicId = req.query.id;
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: null,
        data: null
    };

    if(!clinicId) {
        res.send(result);
    }

    clinicModel.get(clinicId)
        .then(clinicResult => {
            result.code = clinicResult.code;
            result.desc = clinicResult.desc;
            if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = clinicResult.data;
            }
            res.send(result);
        }, error => {
            result.desc = 'Clinic Model Error';
            res.send(result);
        });
};

module.exports = Clinic;
