define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $successModal = $("#successModal");
        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            $.ajax({
                type: 'POST',
                url: clinicService + '/patient',
                cache: true,
                data: $("#patientForm").serialize(),
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        $successModal.modal({
                            backdrop: 'static',
                            show: true
                        });
                    } else {
                        setAlert.alert(data, 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误...", 'danger', 3000);
                }
            });
        });
    });
});
