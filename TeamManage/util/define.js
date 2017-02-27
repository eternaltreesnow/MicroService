module.exports = function define() {
    this.ACTION_QUERY = '101';
    this.ACTION_UPDATE = '102';
    this.ACTION_INSERT = '103';
    this.ACTION_DELETE = '104';
    this.RESULT_FAILED = '400';
    this.RESULT_SUCCESS = '200';
    this.RESULT_REDIRECT = '302';
    this.NOT_FOUND = '404';
    this.RESULT_PERMISSION_DENY = '401';
    this.RESULT_SERVER_FAILED = '402';
    this.RESULT_LOGIN_REQUESTED = '403';
    this.RESULT_ADD_NONE = '405';
    this.RESULT_EMPTY = '406';
    this.RESULT_DELETE_FAILED = '407';
    this.RESULT_UPDATE_FAILED = '408';
    this.SERVER_FAILED = '500';
    this.SERVER_AGENT_FAILED = '501';
    this.VALID_SUCCESS = '600';
    this.VALID_LACK_PARAM = '601';
    this.VALID_PARAM_TYPE_ERROR = '602';
    this.VALID_EMPTY_CACHE = '603';
    this.VALID_INVALID_OPERATION = '604';
    this.VALID_INVALID_SERVICE = '605';
    this.VALID_INVALID_TOKEN = '606';
    this.VALID_INVALID_EXPIRED = '607';
    this.ROLE_TYPE = {
        'none': 0,
        'hospital': 1,
        'doctor': 2,
        'technician': 3
    };
    this.AuthLogin = 'http://localhost:10001'; // AuthLogin服务Uri
    this.ClinicService = 'http://localhost:10002'; // ClinicService服务Uri
    this.UserManage = 'http://localhost:10003'; // UserManage服务Uri
    this.TeamManage = 'http://localhost:10004'; // TeamManage服务Uri
    this.DoctorCli = 'http://localhost:10005'; // DoctorCli服务Uri
    this.TechnicianCli = 'http://localhost:10006'; // TechnicianCli服务Uri
    this.HospitalCli = 'http://localhost:10007'; // HospitalCli服务Uri
    this.PartnerCli = 'http://localhost:10008'; // PartnerCli服务Uri
}
