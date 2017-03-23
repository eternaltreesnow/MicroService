let baseUrl = 'https://4wpf56tmg1.execute-api.ap-northeast-1.amazonaws.com/ecg_cloud/';
module.exports = {
    "AuthLogin" : baseUrl + 'AuthLogin', // AuthLogin服务Uri
    "ClinicService" : baseUrl + 'ClinicService', // ClinicService服务Uri
    "UserManage" : baseUrl + 'UserManage', // UserManage服务Uri
    "TeamManage" : baseUrl + 'TeamManage', // TeamManage服务Uri
    "DoctorCli" : baseUrl + 'DoctorCli', // DoctorCli服务Uri
    "TechnicianCli" : baseUrl + 'TechnicianCli', // TechnicianCli服务Uri
    "HospitalCli" : baseUrl + 'HospitalCli', // HospitalCli服务Uri
    "PartnerCli" : baseUrl + 'PartnerCli', // PartnerCli服务Uri
}
