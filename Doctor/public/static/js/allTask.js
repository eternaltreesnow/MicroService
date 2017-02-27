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
            "data": "state"
        }, {
            "data": "edit"
        }];

        var $allTaskTable = $("#allTaskTable");
        var allDatatable = $allTaskTable.DataTable({
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
                url: 'http://localhost:10002/getDocList',
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: function(d) {
                    d.state = 0;
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
                var clinicId = data[i]['clinicId'];
                data[i]['clinicId'] = i + 1 + '<input type="hidden" value="' + clinicId + '">';
                data[i]['edit'] = '';
                if(data[i]['state'] == '4') {
                    data[i]['state'] = '分析中';
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="analysis">开始分析</a>'
                                    + '<a href="javascript:void(0);" class="btn btn-warning btn-xs" data-link="cancel">取消任务</a>';
                } else if(data[i]['state'] == '5') {
                    data[i]['state'] = '技师分析中';
                } else if(data[i]['state'] == '6') {
                    data[i]['state'] = '等待审核';
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="censor">审核</a>';
                } else if(data[i]['state'] == '7') {
                    data[i]['state'] = '重分析中';
                } else if(data[i]['state'] == '9') {
                    data[i]['state'] = '已完成';
                    data[i]['edit'] = '<a href="http://localhost:10002/report?id=' + clinicId + '" target="blank" class="btn btn-primary btn-xs">下载报告</a>';
                }
                data[i]['addTime'] = moment(parseFloat(data[i]['addTime'])).format('YYYY-MM-DD HH:mm');
            }
        }

        function bindBtnEvent() {
            // 处理"开始分析"按钮事件
            var $linkAnalysis = $('[data-link="analysis"]');
            $linkAnalysis.unbind();
            $linkAnalysis.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/clinic/analysisDetail?id=' + id + '&state=4';
            });

            // 处理"取消任务"按钮事件
            var $linkCancel = $('[data-link="cancel"]');
            $linkCancel.unbind();
            $linkCancel.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                $.ajax({
                    type: 'POST',
                    url: '/cancelTask',
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.status == 200) {
                            setAlert.alert("取消任务成功...", 'success', 3000);
                            allDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            console.log(data);
                            setAlert.alert('取消任务失败...', 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });

            // 处理"审核"按钮事件
            var $linkCensor = $('[data-link="censor"]');
            $linkCensor.unbind();
            $linkCensor.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/clinic/censorDetail?id=' + id + '&state=6';
            });
        }
    });
});
