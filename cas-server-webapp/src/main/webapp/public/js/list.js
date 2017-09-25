$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	//g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});
	g.totalPage = 1;//存总页数
	g.nowPage = 0;//存当前页 0 是第一页
	g.role = 'viewer';//admin 管理员//user 商务部普通用户//viewer 未登录的用户//reviewer 审核员
	
	/* ----------------------------load------------------------------ */
	//if(g.login_token == ''){parent.window.location.href="login.html";}//判断登录
	$('#srBtn,#srAllBtn').on('click',getProjectList);
	$('#new_project').on('click',newProject);
	getUsrInfo();
	getProjectList(1);
	/* ----------------------------set-------------------------------- */
	
	
	//获取当前用户信息 及 角色
	function getUsrInfo(){
		var condi = {};
		var url = Base.serverUrl + "getUserInfo";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var d = data.result || [];
					var name = d.name || '';
					g.role = d.role || '';
					//g.role = 'admin';//测试
					Utils.offLineStore.set("token",name,false);
					//用户名
					var userName = $('.userName',parent.document) || '';
					if(userName != ''){userName.html(name);}
					if(g.role == 'viewer' || g.role == ''){$('#login_out',parent.document).hide();}
					//判断是审核员 隐藏新建报价 按钮
					if(g.role == 'reviewer'){//审核员
						$('#new_project').hide();
						$('#1',parent.document).hide();
						$('#2',parent.document).show();
					}
					if(g.role == 'user'){//普通用户
						$('#2',parent.document).hide();
						$('#1',parent.document).show();
					}
				}
				else{
					var msg = data.message || "登录失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	//关闭弹窗
	$(document).click(function(e){
		$('.choiseDanwei').hide();
		stopPropagation(e);
	});
	//选择状态
	$("#static").click(function(e){
		var _is = $(this);
		var xx = _is.offset().left || 0;
        var yy = _is.offset().top || 0;
		var _top = yy + _is.height() -9;
        $('.choiseDanwei5 li').show();
		$('.choiseDanwei').hide();
		$('.choiseDanwei5').show().css({"left":xx,"top":_top});
		$('.choiseDanwei5 li').on('click',function(e){
			var _tis = $(this);
			var _vdan= _tis.html() || '';
			var _vtip= _tis.attr('tip') || '';
			_is.val(_vdan).parents('td').attr('title',_vtip);
			_tis.parents('.choiseDanwei').hide();
			stopPropagation(e);
		});
		stopPropagation(e);
    });
	//新建项目
	function newProject(){
		var newone = 'newone';//标记是复制
		parent.document.getElementById("iframeObj").src = 'edit.html?newone='+newone;
	}	
	//获取所有项目列表
	function getProjectList(is){
		var is = is || '';
		var mark = $(this).attr('mark') || '';
		var condi = {};
		condi.page = g.nowPage;//第几页 0 是第一页
		condi.number = 8;//每页显示多少个
		if(mark == ''){
			condi.serial = $('#serial').val() || '';
			condi.name = $('#name').val() || '';
			condi.sponsor = $('#sponsor').val() || '';
			condi.user = $('#maker').val() || '';
			condi.state = $('#static').val() || '';
			condi.start = $('#start_time').val() || '';
			condi.end = $('#end_time').val() || '';
		}else{
			$('#serial,#name,#sponsor,#user,#state,#start_time,#end_time').val('');
			condi.serial = '';
			condi.name = '';
			condi.user = '';
			condi.state = '';
			condi.sponsor = '';
			condi.start = '';
			condi.end = '';
		}
		var url = Base.serverUrl + "searchPage";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					var ds = data.result || [];
					var data = ds.content || [];
					var totalPages = ds.totalPages || 0;//总页数
					g.totalPage = totalPages;
					var totalElements = ds.totalElements || 0;
					var html = '<table class="table1 tables">'
								+'<tr>'
									+'<th style="min-width:85px;">预算项目编号</th>'
									+'<th>项目名称</th>'
									+'<th>申办方</th>'
									+'<th style="min-width:45px;">中心数</th>'
									+'<th style="min-width:91px;">预算费用(元)</th>'
									+'<th style="min-width:102px;">项目创建时间</th>'
									+'<th style="min-width:66px;">项目创建人</th>'
									+'<th style="min-width:55px;">状态</th>'
									+'<th style="min-width:60px;">预算版本</th>'
									+'<th>备注</th>'
									+'<th style="min-width:206px;">操作</th>'
								+'</tr>';
					for(var i=0,len=data.length;i<len;i++){
						var ss = i;
						var d = data[i] || [];
						var id = d.id || '';
						var serial_number = d.serial_number || '';
						var version = d.version || '';
						var pversion = d.pversion || '';
						var name = d.name || '';
						var center_number = d.center_number || '';
						var budget_price = d.budget_price || '';
						var sponsor = d.sponsor || '';
						var remarks = d.remarks || '';
						var create_time = d.create_time || '';
						var newDate = new Date();
						newDate.setTime(create_time);
						var time = newDate.format('yyyy-MM-dd h:m:s') || '';
						var json1 = d.json1 || '';
						var json2 = d.json2 || '';
						var json3 = d.json3 || '';
						var json4 = d.json4 || '';
						var isDelete = d.isDelete || '';
						var state = d.state || '';
						var user = d.user || '';
						//if(isDelete || isDelete == '1'){continue;}
						html +='<tr>'
							+'<td class="snum">'+serial_number+'</td>'
							+'<td class="proName">'+name+'</td>'
							+'<td class="spons">'+sponsor+'</td>'
							+'<td>'+center_number+'</td>'
							+'<td>'+budget_price+'</td>'
							+'<td>'+time+'</td>'
							+'<td>'+user+'</td>'
							+'<td>'+state+'</td>'
							+'<td>'+version+'</td>'
							+'<td class="text_content"><textarea id="mark'+ss+'" onblur="updateMark(\''+id+'\',\''+ss+'\')" class="bz bz2">'+remarks+'</textarea></td>'
							+'<td class="last">';
							//g.role = 'admin';//测试用
							if(g.role == 'reviewer'){
								html +='	<a href="javascript:;" onclick="shenheProject(\''+id+'\')" class="cao_btn cao_btn1">审核</a>';
							}else if(g.role == 'user'){
								html +='	<a href="javascript:;" onclick="editProject(\''+id+'\')" class="cao_btn cao_btn1">编辑</a>'
								+'	<a href="javascript:;" onclick="copyProject(\''+id+'\')" class="cao_btn cao_btn2">复制</a>'
								+'	<a href="javascript:;" onclick="deleteProject(\''+id+'\')" class="cao_btn cao_btn3">删除</a>';
							}else if(g.role == 'admin'){
								html +='<a href="javascript:;" onclick="shenheProject(\''+id+'\')" class="cao_btn shenheyuan cao_btn1">审核</a>'
								+'	<a href="javascript:;" style="margin-left:0px;" onclick="editProject(\''+id+'\')" class="cao_btn removeClass cao_btn1">编辑</a>'
								+'	<a href="javascript:;" onclick="copyProject(\''+id+'\')" class="cao_btn removeClass cao_btn2">复制</a>'
								+'	<a href="javascript:;" onclick="deleteProject(\''+id+'\')" class="cao_btn removeClass cao_btn3">删除</a>';
							}
							html +='</td>'
						+'</tr>';
					}
					html +='</table>';
					$('#listTable').html(html).find('.shenheyuan').remove();
					$('#listTable2').html(html).find('.removeClass').remove();
					if(is == 1){setPages();}
				}
				else{
					var msg = data.message || "获取失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
	}
	//分页
	function setPages(){
		$("#Pagination").pagination(g.totalPage,{
			callback: PageCallback,            
			 prev_text: '上一页',             
			 next_text: '下一页'
		});
		$('.allPage').html(g.totalPage);
	}
	function PageCallback(index, jq){
		  g.nowPage = index || 0;
		  getProjectList();
	 }
	
	
	//复制某个项目
	window.copyProject = function(id){
		var id = id || '';
		if(id == ''){Utils.alert('项目id不能为空！');return false;}
		var copy = 'copy';//标记是复制
		parent.document.getElementById("iframeObj").src = 'edit.html?id='+id+'&copy='+copy;
	}	
	//存储备注信息
	window.updateMark = function(id,ss){
		var id = id || '';
		var ss = ss || '';
		var remark = $('#mark'+ss).val() || '';
		if(id == ''){Utils.alert('项目id不能为空！');return false;}
		var condi = {};
		condi.id = id;
		condi.remark = remark;
		var url = Base.serverUrl + "updateRemark";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					//Utils.alert('备注成功！');
				}
				else{
					var msg = data.message || "备注失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
					
	}	
	//删除某个项目
	window.deleteProject = function(id){
		var id = id || '';
		if(id == ''){Utils.alert('项目id不能为空！');return false;}
		if(!confirm('确认删除吗？')){return false;}
		var condi = {};
		condi.id = id;
		var url = Base.serverUrl + "delete";
		//g.httpTip.show();
		$.ajax({
			url:url,
			data:condi,
			timeout: 30000, //超时时间设置，单位毫秒
			type:"POST",
			dataType:'json',
			context:this,
			success: function(data){
				var status = data.success || false;
				if(status){
					Utils.alert('删除成功！');
					getProjectList();
				}
				else{
					var msg = data.message || "获取失败";
					Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  Utils.alert("超时");
		　　　　}
			}
		});
					
	}
	//编辑某个项目
	window.editProject = function(id){
		var id = id || '';
		if(id == ''){Utils.alert('项目id不能为空！');return false;}
		var edit = 'edit';
		parent.document.getElementById("iframeObj").src = 'edit.html?id='+id+'&edit='+edit;
	}
	//审核某个项目
	window.shenheProject = function(id){
		var id = id || '';
		if(id == ''){Utils.alert('项目id不能为空！');return false;}
		var shenhe = 'shenhe';
		parent.document.getElementById("iframeObj").src = 'edit.html?id='+id+'&shenhe='+shenhe;
	}

	
	//加载顶部标题
	//$('#menu_show_t .ss',parent.document).removeClass('active').html('');
	//$('#menu_show_t .s0',parent.document).html('预算管理').addClass('active');

	//加载时间控件
	var start = {
	  elem: '#start_time',
	  format: 'YYYY-MM-DD hh:mm:ss',
	  //min: laydate.now(), //设定最小日期为当前日期
	  max: '2099-06-16', //最大日期
	  istime: true,
	  istoday: false,
	  choose: function(datas){
		 //end.min = datas; //开始日选好后，重置结束日的最小日期
		 //end.start = datas //将结束日的初始值设定为开始日
	  }
	};
	var end = {
	  elem: '#end_time',
	  format: 'YYYY-MM-DD hh:mm:ss',
	  //min: laydate.now(),
	  max: '2099-06-16',
	  istime: true,
	  istoday: false,
	  choose: function(datas){
		start.max = datas; //结束日选好后，重置开始日的最大日期
	  }
	};
	laydate(start);
	laydate(end);

	
	
	
	
	
});
