define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var clinicColumn = [{
            "data": "clinicId"
        }, {
            "data": "medicareNum"
        }, {
            "data": "idCode"
        }, {
            "data": "name"
        }, {
            "data": "description"
        }, {
            "data": "status"
        }, {
            "data": "edit"
        }];

        var $clinicTable = $("#clinicTable");
        var clinicDatatable = $clinicTable.DataTable({
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
            columns: clinicColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: '//localhost:10002/getHospList',
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
            var clinicId;
            for(var i = 0; i < data.length; i++) {
                clinicId = data[i]['clinicId'];
                data[i]['clinicId'] = i + 1 + '<input type="hidden" value="' + clinicId + '">';
                data[i]['edit'] = '';
                if(data[i]['state'] == 2) {
                    data[i]['status'] = '未处理';
                } else if(data[i]['state'] == 9) {
                    data[i]['status'] = '已完成';
                    data[i]['edit'] = '<a href="http://localhost:10002/report?id=' + clinicId + '" target="blank" class="btn btn-primary btn-xs" data-link="download">下载报告</a>';
                } else {
                    data[i]['status'] = '处理中';
                }
            }
        }

        function bindBtnEvent() {
            // 处理"下载报告"按钮事件
            var $linkDownload = $('[data-link="download"]');
            $linkDownload.unbind();
            $linkDownload.on('click', function() {
                var $this = $(this);
                var id = $this.parent('tr').children(':first').children(':first').val();
            });
        }
    });
});
