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

        var $uncheckTaskTable = $("#uncheckTaskTable");
        var uncheckDatatable = $uncheckTaskTable.DataTable({
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
                    d.state = 61;
                    delete d.columns;
                    delete d.order;
                },
                dataSrc: function(json) {
                    resetData(json.data, '61');
                    return json.data;
                }
            },
            sortClasses: false,
            drawCallback: function(settings, json) {
                bindBtnEvent();
            }
        });

        var $recheckTaskTable = $("#recheckTaskTable");
        var recheckDatatable = $recheckTaskTable.DataTable({
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
                    d.state = 62;
                    delete d.columns;
                    delete d.order;
                },
                dataSrc: function(json) {
                    resetData(json.data, '62');
                    return json.data;
                }
            },
            sortClasses: false,
            drawCallback: function(settings, json) {
                bindBtnEvent();
            }
        });

        function resetData(data, state) {
            for(var i = 0; i < data.length; i++) {
                data[i]['clinicId'] = i + 1 + '<input type="hidden" value="' + data[i]['clinicId'] + '">';
                if(state == '61') {
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="check">审核</a>';
                } else {
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="recheck">审核</a>';
                }
                data[i]['addTime'] = moment(parseFloat(data[i]['addTime'])).format('YYYY-MM-DD HH:mm');
            }
        }

        function bindBtnEvent() {
            // 处理"初审审核"按钮事件
            var $linkCheck = $('[data-link="check"]');
            $linkCheck.unbind();
            $linkCheck.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/clinic/censorDetail?id=' + id + '&state=6';
            });

            // 处理"重审审核"按钮事件
            var $linkRecheck = $('[data-link="recheck"]');
            $linkRecheck.unbind();
            $linkRecheck.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/clinic/censorDetail?id=' + id + '&state=6';
            });
        }
    });
});
