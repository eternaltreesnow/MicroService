define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $clinicId = $("#id");
        var $state = $("#state");
        // 病人信息
        var $name = $("#name");
        var $gender = $("#gender");
        var $birth = $("#birth");
        var $height = $("#height");
        var $weight = $("#weight");
        var $addTime = $("#addTime");
        // 审核信息
        var $doctorName = $("#doctorName");
        var $censorTime = $("#censorTime");
        var $errorType = $("#errorType");
        var $feedback = $("#feedback");
        // 心电数据与报告
        var $file = $("#file");
        var $report = $("#report");
        var $description = $("#description");

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
                    // 病人信息
                    $name.text(res.data.name);
                    $gender.text(res.data.gender);
                    $birth.text(moment(parseFloat(res.data.birth)).format('YYYY-MM-DD hh:mm'));
                    $height.text(res.data.height);
                    $weight.text(res.data.weight);
                    $addTime.text(moment(parseFloat(res.data.addTime)).format('YYYY-MM-DD hh:mm'));
                    // 审核信息
                    $doctorName.text(res.data.realName);
                    $censorTime.text(moment(parseFloat(res.data.censorTime)).format('YYYY-MM-DD hh:mm'));
                    $errorType.text(res.data.errorType);
                    $feedback.text(res.data.feedback);
                    // 心电数据和报告
                    $file.text(res.data.file);
                    $report.text(res.data.report);
                    $description.text(res.data.description);
                } else {
                    setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
                }
            },
            error: function(error) {
                console.log(error);
                setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
            }
        });

        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            var formdata = new FormData($("#taskForm")[0]);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10002/report',
                cache: false,
                data: formdata,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if (data.code == 200) {
                        setAlert.alert('心电分析报告上传成功', 'success', 3000);
                        setTimeout(function() {
                            document.location = '/clinic/reanalysisTask';
                        }, 1000);
                    } else {
                        console.log(data.desc);
                        setAlert.alert('心电分析报告上传失败', 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误...", 'danger', 3000);
                }
            });
        });
    });

});
