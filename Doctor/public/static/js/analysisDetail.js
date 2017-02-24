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
        var $file = $("#file");
        var $description = $("#description");

        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            $.ajax({
                type: 'GET',
                url: '//localhost:10002/clinic',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: {
                    clinicId: $clinicId,
                    state: $state
                },
                success: function(res) {
                    if(res.code == 200) {
                        $name.text(res.data.name);
                        $gender.text(res.data.gender);
                        $birth.text(res.data.birth);
                        $height.text(res.data.height);
                        $weight.text(res.data.weight);
                        $addTime.text(res.data.addTime);
                        $file.text(res.data.file);
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
        });
    });
});
