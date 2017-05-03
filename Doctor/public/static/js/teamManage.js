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

        var $addMemModal = $("#addMemModal");
        var $addDocBtn = $("#addDocBtn");
        $addDocBtn.on('click', function() {
            $.ajax({
                type: 'GET',
                url: userManage + '/getDocList?draw=1&start=0&length=20',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if(data.status == 200) {
                        $("#searchResultBody").html('');
                        initialResultBody(data.data);
                        bindBtnEvent();
                        $addMemModal.modal('show');
                    } else {
                        setAlert.alert("搜索错误...", 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误, 请稍后重试...", 'danger', 3000);
                }
            })
        });

        var $addTechBtn = $("#addTechBtn");
        $addTechBtn.on('click', function() {
            $.ajax({
                type: 'GET',
                url: userManage + '/getTechList?draw=1&start=0&length=20',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data) {
                    if(data.status == 200) {
                        $("#searchResultBody").html('');
                        initialResultBody(data.data);
                        bindBtnEvent();
                        $addMemModal.modal('show');
                    } else {
                        setAlert.alert("搜索错误...", 'danger', 3000);
                    }
                },
                error: function(error) {
                    setAlert.alert("网络错误, 请稍后重试...", 'danger', 3000);
                }
            })
        });

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
                    td0.innerHTML = data.userId;
                    var td1 = document.createElement('td');
                    td1.innerHTML = data.idCode;
                    var td2 = document.createElement('td');
                    td2.innerHTML = data.realName;
                    var td3 = document.createElement('td');
                    td3.innerHTML = data.telephone;
                    var td4 = document.createElement('td');
                    td4.innerHTML = data.email;
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

            // 处理"停用"按钮事件
            var $linkStop = $('[data-link="stop"]');
            $linkStop.unbind();
            $linkStop.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                $.ajax({
                    type: 'POST',
                    url: userManage + '/stopUser',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            setAlert.alert('停用成功', 'success', 3000);
                            doctorDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                            techDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            setAlert.alert(data.info, 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });

            // 处理"启用"按钮事件
            var $linkStart = $('[data-link="start"]');
            $linkStart.unbind();
            $linkStart.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').children('input').val();
                $.ajax({
                    type: 'POST',
                    url: userManage + '/startUser',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            setAlert.alert('停用成功', 'success', 3000);
                            doctorDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                            techDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            setAlert.alert(data.info, 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });

            // 处理"选择"按钮事件
            $chooseResult = $('[data-link="choose"]');
            $chooseResult.unbind();
            $chooseResult.on('click', function() {
                var $this = $(this);
                var id = $this.parents('tr').children(':first').text();
                $.ajax({
                    type: 'POST',
                    url: userManage + '/addMember',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                        userId: id,
                        teamId: $teamId.val()
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            $addMemModal.modal('hide');
                            setAlert.alert('添加成功', 'success', 3000);
                            doctorDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                            techDatatable.ajax.reload(function(json) {
                                bindBtnEvent();
                            });
                        } else {
                            $addMemModal.modal('hide');
                            setAlert.alert(data.info, 'danger', 3000);
                        }
                    },
                    error: function(error) {
                        $addMemModal.modal('hide');
                        setAlert.alert('网络错误, 请稍后重试...', 'danger', 3000);
                    }
                });
            });
        }
    });
});
