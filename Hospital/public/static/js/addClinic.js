define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $submitModal = $("#submitModal");
        var $submitBtn = $("#submitBtn");
        $submitBtn.on('click', function() {
            var formdata = new FormData($("#checklistForm")[0]);
            $.ajax({
                type: 'POST',
                url: clinicService + '/clinic',
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
                    if (data.code == 200) {
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

        var $searchModal = $("#searchModal");
        var $searchBtn = $("#searchBtn");
        $searchBtn.on('click', function() {
            $.ajax({
                type: 'GET',
                url: clinicService + '/getPatientList?draw=1&start=0&length=10',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if(data.status == 200) {
                        initialResultBody(data.data);
                        bindBtnEvent();
                        $searchModal.modal('show');
                    } else {
                        setAlert.alert("搜索错误...", 'danger', 3000);
                    }
                }
            })
        });

        function bindBtnEvent() {
            $patientId = $("#patientId");
            $inputIdCard = $("#inputIdCard");
            $inputName = $("#inputName");
            $inputNumber = $("#inputNumber");
            $inputGender = $("#inputGender");

            $chooseResult = $('[data-link="choose"]');
            $chooseResult.unbind();
            $chooseResult.on('click', function() {
                var $this = $(this);
                $patientId.val($this.parents('tr').children()[0].innerHTML);
                $inputIdCard.val($this.parents('tr').children()[1].innerHTML);
                $inputNumber.val($this.parents('tr').children()[2].innerHTML);
                $inputName.val($this.parents('tr').children()[3].innerHTML);
                $inputGender.val($this.parents('tr').children()[4].innerHTML);
                $searchModal.modal('hide');
            });
        }

        function initialResultBody(result) {
            var tr, td0, td1, td2, td3, td4, td5;
            if (result.length == 0) {
                tr = document.createElement('tr');
                td1 = document.createElement('td');
                td1.innerHTML = "无数据";
                td1.setAttribute('colspan', 5);
                tr.appendChild(td1);
                document.getElementById('searchResultBody').appendChild(tr);
            } else {
                result.map(function(data) {
                    var tr = document.createElement('tr');
                    var td0 = document.createElement('td');
                    td0.innerHTML = data.patientId;
                    var td1 = document.createElement('td');
                    td1.innerHTML = data.idCode;
                    var td2 = document.createElement('td');
                    td2.innerHTML = data.medicareNum;
                    var td3 = document.createElement('td');
                    td3.innerHTML = data.name;
                    var td4 = document.createElement('td');
                    td4.innerHTML = data.gender;
                    var td5 = document.createElement('td');
                    td5.innerHTML = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="choose">选择</a>';
                    tr.appendChild(td0);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    document.getElementById('searchResultBody').appendChild(tr);
                });
            }
        }
    });
});
