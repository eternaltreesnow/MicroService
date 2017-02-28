define(function(require) {
    var setAlert = require('alert');

    $(document).ready(function() {
        var $teamId = $("#teamId");
        var $isLeader = $("#isLeader");
        var $teamName = $("#teamName");
        var $partnerName = $("#partnerName");
        var $status = $("#status");
        var $clinicId = $("#id");
        var $clinicId = $("#id");
        var $clinicId = $("#id");
        var $clinicId = $("#id");
        var $clinicId = $("#id");
        var $clinicId = $("#id");

        // 获取团队基本信息
        $.ajax({
            type: 'GET',
            url: teamManage + '/getTeamInfo',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                teamId: $teamId.val()
            },
            success: function(res) {
                if(res.code == 200) {
                    $teamName.text(res.data.name);
                    $partnerName.text(res.data.realName);
                    if(res.data.state == 1) {
                        $status.text('正常使用');
                    } else {
                        $status.text('已停用');
                    }
                } else {
                    setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
                }
            },
            error: function(error) {
                console.log(error);
                setAlert.alert('数据获取失败, 请刷新页面重试', 'danger', 3000);
            }
        });

        var userColumn = [{
            "data": "userId"
        }, {
            "data": "realName"
        }, {
            "data": "workId"
        }, {
            "data": "idCode"
        }, {
            "data": "telephone"
        }, {
            "data": "address"
        }, {
            "data": "email"
        }, {
            "data": "major"
        }, {
            "data": "status"
        }, {
            "data": "edit"
        }];

        // 获取医生列表
        var $doctorTable = $("#doctorTable");
        var doctorDatatable = $doctorTable.DataTable({
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
            columns: userColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: teamManage + '/getMemberList',
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: function(d) {
                    d.teamId = $teamId.val();
                    d.roleId = 1;
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

        // 获取技师列表
        var $techTable = $("#techTable");
        var techDatatable = $techTable.DataTable({
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
            columns: userColumn,
            pagingType: "full_numbers",
            dom: 'rtl<"ecg-table-paginate"p>',
            serverSide: true,
            ajax: {
                url: teamManage + '/getMemberList',
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: function(d) {
                    d.teamId = $teamId.val();
                    d.roleId = 2;
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
                data[i]['userId'] = i + 1 + '<input type="hidden" value="' + data[i]['userId'] + '">';
                let status = data[i]['status'];
                if(status == 1) {
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-warning btn-xs" data-link="stop">停用</a>'
                                    + '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="detail">查看</a>'
                                    + '<a href="javascript:void(0);" class="btn btn-danger btn-xs" data-link="delete">删除</a>';
                    data[i]['status'] = '正常使用';
                } else {
                    data[i]['edit'] = '<a href="javascript:void(0);" class="btn btn-success btn-xs" data-link="start">启用</a>'
                                    + '<a href="javascript:void(0);" class="btn btn-primary btn-xs" data-link="detail">查看</a>'
                                    + '<a href="javascript:void(0);" class="btn btn-danger btn-xs" data-link="delete">删除</a>';
                    data[i]['status'] = '已停用';
                }
            }
        }

        function bindBtnEvent() {
            // 处理"查看"按钮事件
            var $linkDetail = $('[data-link="detail"]');
            $linkDetail.unbind();
            $linkDetail.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                document.location = '/team/memberDetail?id=' + id;
            });
        }
    });
});
