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

        var $reanalysisTaskTable = $("#reanalysisTaskTable");
        var reanalysisDatatable = $reanalysisTaskTable.DataTable({
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
                    d.state = 7;
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
                data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="analysis">开始分析</a>';
                data[i]['addTime'] = moment(parseFloat(data[i]['addTime'])).format('YYYY-MM-DD HH:mm');
            }
        }

        function bindBtnEvent() {
            // 处理"接单"按钮事件
            var $linkAnalysis = $('[data-link="analysis"]');
            $linkAnalysis.unbind();
            $linkAnalysis.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/clinic/reanalysisDetail?id=' + id + '&state=7';
            });
        }
    });
});
