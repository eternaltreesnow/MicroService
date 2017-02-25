define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $clinicId = $("#id");
        var $state = $("#state");
        var $name = $("#name");
        var $gender = $("#gender");
        var $birth = $("#birth");
        var $height = $("#height");
        var $weight = $("#weight");
        var $addTime = $("#addTime");
        var $techName = $("#techName");
        var $reportTime = $("#reportTime");
        var $description = $("#description");
        var $file = $("#file");
        var $report = $("#report");
        var $errorType = $("#errorType");
        var $feedback = $("#feedback");

        $.ajax({
            type: 'GET',
            url: 'http://localhost:10002/clinic',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                clinicId: $clinicId.val(),
                state: $state.val()
            },
            success: function(res) {
                if(res.code == 200) {
                    $name.text(res.data.name);
                    $gender.text(res.data.gender);
                    $birth.text(moment(parseFloat(res.data.birth)).format('YYYY-MM-DD hh:mm'));
                    $height.text(res.data.height);
                    $weight.text(res.data.weight);
                    $addTime.text(moment(parseFloat(res.data.addTime)).format('YYYY-MM-DD hh:mm'));
                    $techName.text(res.data.techName);
                    $reportTime.text(moment(parseFloat(res.data.reportTime)).format('YYYY-MM-DD hh:mm'));
                    $description.text(res.data.description);
                    $file.text(res.data.file);
                    $report.text(res.data.report);
                } else {
                    setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
                }
            },
            error: function(error) {
                console.log(error);
                setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
            }
        });

        var $errorContainer = $("#errorContainer");
        $errorContainer.hide();
        $("input:radio[name='censorOption']").on('change', function() {
            if ($("input:radio[name='censorOption']:checked").attr('id') === "censorOption1") {
                $errorContainer.hide();
            } else if ($("input:radio[name='censorOption']:checked").attr('id') === "censorOption2") {
                $errorContainer.show();
            }
        });

        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10002/censor',
                data: {
                    id: $clinicId.val(),
                    state: $state.val(),
                    censorOption: $('input[name="censorOption"]:checked').val(),
                    errorType: $errorType.val(),
                    feedback: $feedback.val()
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if (data.code == 200) {
                        setAlert.alert('审核成功', 'success', 3000);
                        // setTimeout(function() {
                        //     document.location = '/clinic/censorTask';
                        // }, 1000);
                    } else {
                        console.log(data);
                        setAlert.alert('审核失败, 请稍后重试', 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误...", 'danger', 3000);
                }
            });
        });
    });
});
