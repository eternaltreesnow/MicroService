define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var taskColumn = [{
            "data": "clinicId"
        }, {
            "data": "name"
        }, {
            "data": "gender"
        }, {
            "data": "addTime"
        }, {
            "data": "description"
        }, {
            "data": "edit"
        }];

        var $unoccupiedTaskTable = $("#unoccupiedTaskTable");
        var unoccupiedDatatable = $unoccupiedTaskTable.DataTable({
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
            columns: taskColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: 'http://localhost:10002/getTechList',
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: function(d) {
                    d.state = 3;
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
                data[i]['clinicId'] = i + 1 + '<input type="hidden" value="' + data[i]['clinicId'] + '">';
                data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="accept">接单</a>';
                data[i]['addTime'] = moment(parseFloat(data[i]['addTime'])).format('YYYY-MM-DD HH:mm');
            }
        }

        function bindBtnEvent() {
            // 处理"接单"按钮事件
            var $linkAccept = $('[data-link="accept"]');
            $linkAccept.unbind();
            $linkAccept.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:10002/occupyClinic',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            $submitModalTaskId.val(id);
                            $submitModal.modal({
                                'show': true,
                                'backdrop': 'static'
                            });
                            unoccupiedDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            $submitModal.modal('hide');
                            setAlert.alert(data.info, 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        $submitModal.modal('hide');
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });

            // "接单"模态框事件
            var $submitModalTaskId = $("#submitModalTaskId");
            var $submitModal = $("#submitModal");
            var $submitModalBtn = $("#submitModalBtn");
            $submitModalBtn.unbind();
            $submitModalBtn.on('click', function() {
                var id = $submitModalTaskId.val();
                location.href = '/clinic/analysisTaskDetail?id=' + id;
            });
        }
    });
});
