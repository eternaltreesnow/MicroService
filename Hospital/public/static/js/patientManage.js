define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var patientColumn = [{
            "data": "patientId"
        }, {
            "data": "medicareNum"
        }, {
            "data": "idCode"
        }, {
            "data": "name"
        }, {
            "data": "gender"
        }, {
            "data": "edit"
        }];

        var $patientTable = $("#patientTable");
        var patientDatatable = $patientTable.DataTable({
            searching: false,
            processing: true,
            language: {
                "processing": "数据加载中, 请稍后...",
                "zeroRecords": "记录数为0...",
                "emptyTable": "记录数为0...",
                "paginate": {
                    "first": "首页",
                    "previous": "上一页",
                    "next": "下一页",
                    "last": "尾页"
                },
                "lengthMenu": '每页显示 _MENU_ 条记录'
            },
            columns: patientColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: '//localhost:10002/getPatientList',
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: function(d) {
                    delete d.columns;
                    delete d.order;
                },
                dataSrc: function(json) {
                    resetData(json.data);
                    return json.data;
                }
            },
            sortClasses: false,
            drawCallback: function(settings, json) {
                bindBtnEvent();
            }
        });

        function resetData(data) {
            for(var i = 0; i < data.length; i++) {
                data[i]['patientId'] = i + 1 + '<input type="hidden" value="' + data[i]['patientId'] + '">';
                data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="edit">编辑</a>'
                                + '<a href="javascript:void(0);" class="btn btn-danger btn-xs" data-link="delete">删除</a>';
            }
        }

        function bindBtnEvent() {
            // 处理"删除"按钮事件
            var $linkDelete = $('[data-link="delete"]');
            $linkDelete.unbind();
            $linkDelete.on('click', function() {
                var $this = $(this);
                var id = $this.parent('tr').children(':first').children(':first').val();
                $deleteId.val(id);
                $deleteModal.modal('show');
            });

            // 处理"编辑"按钮事件
            var $linkEdit = $('[data-link="edit"]');
            $linkEdit.unbind();
            $linkEdit.on('click', function() {
                var $this = $(this);
                var id = $this.parent('tr').children(':first').children(':first').val();
                document.location = '/patient/editPatient?id=' + id;
            });

            // "删除病人"模态框事件
            var $deleteModal = $("#deleteModal");
            var $deleteId = $("#deleteId");
            var $deleteModalBtn = $("#deleteModalBtn");
            $deleteModalBtn.unbind();
            $deleteModalBtn.on('click', function() {
                $.ajax({
                    type: 'POST',
                    url: '//localhost:10002/deletePatient',
                    data: {
                        id: $deleteId.val()
                    },
                    success: function(data) {
                        if (data.status == 200) {
                            $deleteModal.modal('hide');
                            setAlert.alert("删除病人成功...", 'success', 3000);
                            patientDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            $deleteModal.modal('hide');
                            setAlert.alert(data.info, 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        $deleteModal.modal('hide');
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });
        }
    });
});
