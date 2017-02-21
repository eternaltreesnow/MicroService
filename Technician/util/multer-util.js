'use strict'

const multer = require('multer');

module.exports = function(type) {
    let filename;
    let folder;
    switch(type) {
        case 'ecg-file':
            filename = '心电数据';
            folder = 'ecg_file';
            break;
        case 'report':
            filename = '心电报告';
            folder = 'report';
            break;
    }

    let storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './uploads/' + folder);
        },
        filename: (req, file, callback) => {
            let fileFormat = file.originalname.split('.');
            callback(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
        }
    });

    return multer({
        storage: storage,
        limits: {}
    });
};
