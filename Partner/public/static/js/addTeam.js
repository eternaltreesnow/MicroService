define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $teamName = $("#teamName");
        var $leaderId = $("#leaderId");

        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            $.ajax({
                type: 'POST',
                url: teamManage + '/addTeam',
                data: {
                    teamName: $teamName.val(),
                    leaderId: $leaderId.val()
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if (data.code == 200) {
                        setAlert.alert("添加团队成功....", 'success', 3000);
                        setTimeout(function() {
                            document.location = '/';
                        }, 1000);
                    } else {
                        setAlert.alert("添加团队失败....", 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误...", 'danger', 3000);
                }
            });
        });
    });
});
