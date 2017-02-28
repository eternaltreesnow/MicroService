define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var contractColumn = [{
            "data": "userId"
        }, {
            "data": "username"
        }, {
            "data": "realName"
        }, {
            "data": "chargeName"
        }, {
            "data": "state"
        }, {
            "data": "edit"
        }];

        var $contractTable = $("#contractTable");
        var contractDatatable = $contractTable.DataTable({
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
            columns: contractColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: userManage + '/getHospList',
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

        function resetData(data, state) {
            for(var i = 0; i < data.length; i++) {
                let userId = data[i]['userId'];
                data[i]['userId'] = i + 1 + '<input type="hidden" value="' + userId + '">';
                data[i]['edit'] = '<a href="/team/editTeam?id=' + userId + '" class="btn btn-primary btn-xs">编辑</a>'
                                + '<a href="javascript:void(0);" class="btn btn-warning btn-xs" data-link="delete">删除</a>';
                if(data[i]['status'] == 1) {
                    data[i]['state'] = '正常使用';
                } else {
                    data[i]['state'] = '已停用';
                }
            }
        }

        function bindBtnEvent() {
            // 处理"删除"按钮事件
            var $linkDelete = $('[data-link="delete"]');
            $linkDelete.unbind();
            $linkDelete.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                $.ajax({
                    type: 'POST',
                    url: userManage + '/deleteHosp',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            setAlert.alert('团队删除成功...', 'danger', 3000);
                            teamDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            console.log(data.desc);
                            setAlert.alert('团队删除失败...', 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });
        }
    });
});
