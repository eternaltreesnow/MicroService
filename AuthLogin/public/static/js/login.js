$(function() {
    var $loginBtn;
    var $inputUserName, $inputPassword;
    var timeOut;

    var $infoAlert, $infoAlertText;
    $infoAlert = $("#infoAlert");
    $infoAlertText = $("#infoAlertText");

    $loginBtn = $("#loginBtn");
    $inputUserName = $("#inputUserName");
    $inputPassword = $("#inputPassword");
    $inputSrc = $("#inputSrc");

    $loginBtn.on('click', function() {
        $.ajax({
            type: 'POST',
            url: "/login",
            data: {
                username: $inputUserName.val(),
                password: $inputPassword.val(),
                src: $inputSrc.val()
            },
            success: function(data) {
                if(data.code == 1004) {
                    if(data.uri && data.uri !== '' && data.uri.length > 0) {
                        setAlert("登录成功, 即将自动跳转", "success", 3000);
                        setTimeout(function() {
                            document.location = data.uri;
                        }, 3000);
                    } else {
                        setAlert("登录成功", "success", 3000);
                    }
                } else if(data.code == 1001 || data.code == 1002 || data.code == 1003 || data.code == 406) {
                    setAlert("用户名或密码错误", "danger", 3000);
                } else {
                    setAlert("登录失败，请稍后重试...", "danger", 3000);
                }
            },
            error: function(error) {
                setAlert("网络错误，请重试...", "danger", 3000);
            }
        });
    });

    // bind Enter event
    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            $loginBtn.click();
        }
    }

    function setAlert(text, type, time) {
        $infoAlertText.text(text);
        $infoAlert.removeClass("alert-success");
        $infoAlert.removeClass("alert-warning");
        $infoAlert.removeClass("alert-danger");
        $infoAlert.addClass("alert-" + type + " in");
        if (timeOut) {
            window.clearTimeout(timeOut);
        }
        timeOut = setTimeout(function() {
            $infoAlert.removeClass("in");
        }, time);
    }
});
