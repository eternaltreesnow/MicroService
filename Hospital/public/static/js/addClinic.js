define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $submitModal = $("#submitModal");
        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            var formdata = new FormData($("#checklistForm")[0]);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10002/clinic',
                cache: false,
                data: formdata,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    console.log(data);
                    if (data.status == 200) {
                        $submitModal.modal({
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

        var $cancerBtn = $("#cancerBtn");
        $cancerBtn.on('click', function() {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:10002/',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    console.log(data);
                },
                error: function(error) {
                    console.error(error);
                }
            });
        });
    });
});
