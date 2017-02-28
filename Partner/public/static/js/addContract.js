define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $username = $("#username");
        var $password = $("#password");
        var $realName = $("#realName");
        var $grade = $("#grade");
        var $level = $("#level");
        var $chargeName = $("#chargeName");
        var $idCode = $("#idCode");
        var $telephone = $("#telephone");
        var $address = $("#address");
        var $email = $("#email");

        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            $.ajax({
                type: 'POST',
                url: userManage + '/addContract',
                data: {
                    username: $username.val(),
                    password: $password.val(),
                    realName: $realName.val(),
                    grade: $grade.val(),
                    level: $level.val(),
                    chargeName: $chargeName.val(),
                    idCode: $idCode.val(),
                    telephone: $telephone.val(),
                    address: $address.val(),
                    email: $email.val()
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if (data.code == 200) {
                        setAlert.alert("添加契约成功....", 'success', 3000);
                        setTimeout(function() {
                            document.location = '/contract/contractManage';
                        }, 1000);
                    } else {
                        setAlert.alert("添加契约失败....", 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误...", 'danger', 3000);
                }
            });
        });
    });
});
