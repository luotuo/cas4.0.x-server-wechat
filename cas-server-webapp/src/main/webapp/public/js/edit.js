$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	//g.id = Utils.getQueryString("id") || "";
	g.httpTip = new Utils.httpTip({});
	g.id = getString('id') || Utils.getQueryString("id");
	g.copy = getString('copy') || '';//识别是复制
	g.newone = getString('newone') || '';//识别是新建
	g.edit = getString('edit') || '';//识别是编辑
	g.shenhe = getString('shenhe') || '';//识别是审核
	g.print = getString('print') || Utils.getQueryString("print");//识别是打印
	g.ss = ['1/5','6/8','9/13','14/22','23/31','32/35','36/40','41/42'];
	g.nowCity = '';
	g.role = 'viewer';//admin 管理员//user 商务部普通用户//viewer 未登录的用户//reviewer 审核员
	g.state = '';
	
/* --------------------------load---------------------------------------- */
	//if(g.login_token == ''){parent.window.location.href="login.html";}//判断登录
	getShenBanFang();//获取申办方列表
	setSook();
	editGetProject();
	getUsrInfo();
	setTimeout(function(){isPrint()},1000);
	getCity();
	$('#new_project').on('click',saveProject);
	$('#printGo').on('click',printFunc);
	$('#printGo2').on('click',printFunc2);
	$('#printGo3').on('click',printFunc3);
	$('#printGo4').on('click',printFunc4);
	$('#printGo5').on('click',printFunc5);
	$('#addCity').on('click',addCity);
	$('#addbingli').on('click',bingliFunc);
	$('#addbingli2').on('click',bingliFunc2);
	if(g.newone != '' || g.edit == '' && g.print == ''){$('.danjiacommon').val($('.danjiabz').val());}
	


/* ---------------------------set----------------------------------------- */
	
	
	//判断是不是 用户身份
	function shenhe(){
		if(g.shenhe != '' || g.role == 'reviewer' ){//判断是审核
			$('#printGo4,#printGo5').show();
			$('#new_project,#printGo,#printGo2,#printGo3').hide().unbind();
			$('.json1,.json2,.json3,.json5,.json6,input').attr('readonly','true').off();//锁死所有input
			$('#toggBox,#toggBox2,.choiseDanwei').remove();//隐藏上面部分
			//$('a').off();
		}else if(g.role == 'user'){//普通用户
			$('#printGo4,#printGo5').hide().unbind();
			if(g.state == '审核通过'){//审核通过才显示打印
				$('#printGo,#printGo2').show();
			}
			$('#new_project,#printGo3').show();
		}else if(g.role == 'admin'){//超级管理员
			if(g.shenhe != ''){$('#printGo4,#printGo5').show();}
			if(g.state == '审核通过'){//审核通过才显示打印
				$('#printGo,#printGo2').show();
			}
			$('#new_project,#printGo3').show();
		}else{//未登录
			$('.json1,.json2,.json3,.json5,.json6,input').attr('readonly','true').off();//锁死所有input
			$('#toggBox,#toggBox2,.choiseDanwei').remove();//隐藏上面部分
			$('#printGo4,#printGo5').hide();
			$('#new_project,#printGo,#printGo2,#printGo3').hide().unbind();
		}
		
	}
	//审核驳回
	function printFunc5(){
		if(!confirm('确定审核驳回吗？')){return false;}
		var condi = {};
		condi.id = g.id;
		var url = Base.serverUrl + "reject";
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
					Utils.alert('审核驳回成功！');
				}
				else{
					var msg = data.message || "审核失败";
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
	//审核通过
	function printFunc4(){
		if(!confirm('确定审核通过吗？')){return false;}
		var condi = {};
		condi.id = g.id;
		var url = Base.serverUrl + "passaudit";
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
					Utils.alert('审核通过成功！');
				}
				else{
					var msg = data.message || "审核失败";
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
	//提交审核
	function printFunc3(){
		if(!confirm('确定要提交审核吗？')){return false;}
		var condi = {};
		condi.id = g.id;
		var url = Base.serverUrl + "submit";
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
					Utils.alert('提交审核成功，请耐心等待！');
				}
				else{
					var msg = data.message || "提交失败";
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
	//获取申办方列表
	function getShenBanFang(){
		var condi = {};
		var url = Base.serverUrl + "getSponsors";
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
					var data = data.result || [];
					var html = '';
					for(var i=0,len=data.length;i<len;i++){
						var d = data[i] || [];
						var id = d.id || '';
						var name = d.name || '';
						var code = d.code || '';
						html += '<li tip="'+code+'">'+name+'</li>';
					}
					$('.choiseDanwei4').html(html);
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
					if(g.role == 'reviewer'){//审核员 显示左侧审核菜单 隐藏预算管理
						$('#1',parent.document).hide();
						$('#2',parent.document).show();
					}
					if(g.role == 'user'){//普通用户 隐藏左侧审核菜单 显示预算管理
						$('#2',parent.document).hide();
						$('#1',parent.document).show();
					}
					shenhe();
					
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
	//输入时搜索申办方
	$("#sponsor").keyup(function(){
		var _vth = $(this);
		var _li = $('.choiseDanwei4 li');
		var _val = _vth.val() || '';
		if(_val == '' || _li.length <= 0){return false;}
		_li.show();
		_li.each(function(){//循环搜索
			var _tt = $(this);
			var _val2 = _tt.html() || '';
			var _if = _val2.indexOf(_val);
			if(_if <= -1){//不符合
				_tt.hide();
			}else{_tt.show();}
		});
	});
	//选择申办方
	$("#sponsor").click(function(e){
		var _is = $(this);
		var xx = _is.offset().left || 0;
        var yy = _is.offset().top || 0;
		var _top = yy + _is.height() -9;
        $('.choiseDanwei4 li').show();
		$('.choiseDanwei').hide();
		$('.choiseDanwei4').show().css({"left":xx,"top":_top});
		$('.choiseDanwei4 li').on('click',function(e){
			var _tis = $(this);
			var _vdan= _tis.html() || '';
			var _vtip= _tis.attr('tip') || '';
			_is.val(_vdan).parents('td').attr('title',_vtip);
			_tis.parents('.choiseDanwei').hide();
			stopPropagation(e);
		});
		stopPropagation(e);
    });
	//选择稽查类型
	$(".choisejichaleix").click(function(e){
		var _is = $(this);
		var xx = _is.offset().left || 0;
        var yy = _is.offset().top || 0;
		var _top = yy + _is.height() -9;
        $('.choiseDanwei').hide();
		$('.choiseDanwei2').show().css({"left":xx,"top":_top});
		$('.choiseDanwei2 li').on('click',function(e){
			var _tis = $(this);
			var _vdan= _tis.html() || '';
			_is.val(_vdan);
			_tis.parents('.choiseDanwei').hide();
			stopPropagation(e);
		});
		stopPropagation(e);
    });
	//选择期别
	$(".choiseqibie").click(function(e){
		var _is = $(this);
		var xx = _is.offset().left || 0;
        var yy = _is.offset().top || 0;
		var _top = yy + _is.height() -9;
        $('.choiseDanwei').hide();
		$('.choiseDanwei3').show().css({"left":xx,"top":_top});
		$('.choiseDanwei3 li').on('click',function(e){
			var _tis = $(this);
			var _vdan= _tis.html() || '';
			_is.val(_vdan);
			_tis.parents('.choiseDanwei').hide();
			stopPropagation(e);
		});
		stopPropagation(e);
    });

	//显示选择单位
	$(".dowchoice").click(function(e){
        _th = $(this);
		var xx = $(this).offset().left || 0;
        var yy = $(this).offset().top || 0;
		var _top = yy + $(this).height() -9;
        $('.choiseDanwei').hide();
		$('.choiseDanwei1').show().css({"left":xx,"top":_top});
		stopPropagation(e);
    });
	//关闭弹窗
	$(document).click(function(e){
		$('.choiseDanwei').hide();
		stopPropagation(e);
	});
	//选择单位
	$('.choiseDanwei1 li').on('click',function(e){
		var _dan = $(this).html() || '';
		if(_th){
			var _value = _th.val() || '';
			var va = _value.replace(/[^0-9]/g,'');//获取数字部分
			var ht = va + _dan;
			_th.val(ht).focus();
			setVal();
		}
		$('.choiseDanwei1').hide();
		stopPropagation(e);
	});
	//打印总表
	function printFunc(){
		if(g.id == ''){Utils.alert('当前项目id为空！');} 
		var _href = 'print.html?id='+g.id+'&print=print1';
		window.open(_href);
	}
	//打印明细
	function printFunc2(){
		if(g.id == ''){Utils.alert('当前项目id为空！');} 
		var _href = 'edit.html?id='+g.id+'&print=print2';
		window.open(_href);
	}
	//给打印页面的表二赋值
	function setTable2Val(){
		var danjia = $('.danjiabz').val() || '0';
		var sa = $('.totalTime').val() || '0';
		var sz = $('.totalMoney').val() || '0';
		$('.ffdanjiacommon').val(danjia);
		$('.ffdanjiazongj').val(sa);
		$('.ffzongjinezongj').val(sz);
		
		$('.zonyutt').each(function (n){
			var a = n + 1;
			var v = $('.zonyutt'+a).val() || '0';
			var g = $('.feyutt'+a).val() || '0';
			if(a == 4 || a == 5){
				var v1 = parseInt($('.zonyutt'+4).val() || '0');
				var v2 = parseInt($('.zonyutt'+5).val() || '0');
				var g1 = parseInt($('.feyutt'+4).val() || '0');
				var g2 = parseInt($('.feyutt'+5).val() || '0');
				v = v1 + v2;
				g = g1 + g2;
			}
			$('.ffetime'+a).val(v);
			$('.ffttmoney'+a).val(g);
		})
		
	}
	//给打印页面的表三赋值
	function setTable3Val(){
		var zongji = $('.chailvmeimoney').val() || '0';
		$('.chailvmeimoney').val(zongji);
		$('.ccdiqucommon').each(function (n){
			var a = n + 1;
			var v = $('.ccdiqu'+a).val() || '0';//目的地
			//var g = $('.ccwangfan'+a).val() || '0';//往返预计费用
			var h = $('.ccchuchacb'+a).val() || '0';//一行费用总计
			var w = $('.ccpinci'+a).val() || '0';//往返次数
			//var k = (parseInt(h)-parseInt(g)).toFixed(0);
			
			$('.ggmudi'+a).val(v);
			//$('.ggwaymoney'+a).val(g);
			//$('.ggqitafei'+a).val(k);
			$('.ggxiaoji'+a).val(h);
			$('.ggwangfan'+a).val(w);
		})
		
	}
	//更新表二病例数据
	function bingliFunc(){
		$('.binglieach').each(function(n){
			var bb = [1,4,7,10,13];
			var a = n + 1;
			var val = $('.binglivalue'+a).val() || '';
			var val2 = parseFloat($('.binglivalue'+a).val() || '0') || 0;
			if(bb.indexOf(a) > -1 && val != ''){
				val = (val2/60).toFixed(2);
			}
			$(this).val(val);
		});
		Utils.alert("保存成功！");
		runAll();
		
	}
	//清空病例窗口数据
	function bingliFunc2(){
		$('#toggBox2 .com_input').val('');
	}
	//公共blur更新对应数据 _self 自己的class名 _obj 对方的class名
	window.blr = function(_self,_obj){
		var _self = _self || "";
		var _obj = _obj || "";
		if(_self == '' || _obj == ''){return false;}
		var _val = $(_self).val() || '';
		$(_obj).val(_val);
	}
	//获取城市列表	
	function getCity(){
		var condi = {};
		var url = Base.serverUrl + "getAll";
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
					var data = data.result || [];
					var html = '<option disabled selected>选择城市</option>';
					for(var i=0,len=data.length;i<len;i++){
						var dd = data[i] || [];
						var name = dd[0] || '';
						var price = dd[1] || 0;
						var by = dd[2] || '';
						//if(by == '飞机'){continue;}
						html+='<option price="'+price+'" by="'+by+'" value="'+name+'">'+name+'</option>';
					}
					$('#cityChoice').html(html);
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
	
	//根据选择的城市变化 表三
	function setCloTable(city,price,pinci,by){
		var city = city || '';
		var price = price || '';
		var pinci = pinci || '';
		var by = by || '';
		var str = g.nowCity.split('<city>') || [];
		if(str.length <= 0){return false;}
		var html1 = '',html2 = '',html3 = '',html4 = '';
		var da = parseInt($('.ccdays').val() || '1');
		var da2 = da*parseInt(pinci || '1');
		var days = da2;
		for(var i=0,len=str.length;i<len;i++){
			var sas = i ;
			var ste = i,ste2 = i+100;
			var html1 = '<tr>'
		    +'  <td width="922" align="center"><input value="'+city+'" ste="'+ste+'" class="json3 ccdiqucommon ccdiqu'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="'+by+'" class="json3 ccchuxingcommon ccchuxing'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="'+price+'" class="json3 ccwangfancommon ccwangfan'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="'+pinci+'" class="json3 ccpincicommon ccpinci'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="'+days+'" class="json3 cczstscommon cczsts'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="350" class="json3 ccdanjiacommon ccdanjia'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input class="json3 ccpxiaojicommon ccpxiaoji'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="100" class="json3 ccjishujlcommon ccjishujl'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="50" class="json3 cccanybzcommon cccanybz'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="20" class="json3 cctongxbzcommon cctongxbz'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input value="60" class="json3 ccjiaotbzcommon ccjiaotbz'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input class="json3 ccsxiaojicommon ccsxiaoji'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input class="json3 ccchuchacbcommon ccpingjuncc1 ccchuchacb'+ste+'" type="text" /></td>'
	        +'</tr>';
			var html2 = '<tr>'
		    +'  <td width="922" align="center"><input value="'+ste+'" ste="'+ste+'" class="json6 ggxuhaocommon ggxuhao'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input  class="json6 ggmudicommon ggmudi'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input  class="json6 ggwangfancommon ggwangfan'+ste+'" type="text" /></td>'
		    //+'  <td width="922" align="center"><input value="'+price+'" class="json3 ggwaymoneycommon ggwaymoney'+ste+'" type="text" /></td>'
		    //+'  <td width="922" align="center"><input value="'+pinci+'" class="json3 ggqitafeicommon ggqitafei'+ste+'" type="text" /></td>'
		    +'  <td width="922" align="center"><input class="json6 ggxiaojicommon ggxiaoji'+ste+'" type="text" /></td>'
	        +'</tr>';
			if(city == '' && price == '' && by == ''){//判断是在加载的时候
				if(str[i] == ''){continue;}
				html3 += html1;
				html4 += html2;
			}else{
				html3 = html1;
				html4 = html2;
			}
			//console.log(g.nowCity);
		}
		$('#tableInsert1').after(html3);
		$('#tableInsert2').after(html4);
	}
	
	//配置打印参数
	function isPrint(){
		if(g.print == ''){return false;}
		$('.json1,.json2,.json3,.json5,.json6').attr('readonly','true').off();//锁死所有input
		$('.hideForPrint').remove();//隐藏上面部分
		//隐藏表格二的备注部分
		var trs = document.getElementById("table2").rows;
		 for(var i = 0, len = trs.length; i < len; i++){
			 var k = trs[i].cells.length;
			 if(k <= 3 && i != 0){continue;}
			 var obj = trs[i].cells[k-1];
			 //$(obj).remove();
			 obj.style.display = 'none';
			 obj.parentNode.removeChild(obj);
		 }
		 //表二删除空行 或者全是零的行
		var tLen = $('.zonyutt').length || 0;//获取表二有几个模块
		if(tLen > 0){
			for(var i = 0, len = tLen; i < len; i++){
				var w = i + 1;
				var a = parseInt($('.zonyutt'+w).val() || '0');
				var b = parseInt($('.zonshtt'+w).val() || '0');
				var c = parseInt($('.feyutt'+w).val() || '0');
				var d = parseInt($('.feshtt'+w).val() || '0');
				if(a == 0 && b == 0 && c == 0 && d == 0 ){//总和为零 则隐藏整个模块
					$('.tablecell'+w).hide();
					//console.log(a+'/'+b+'/'+c+'/'+d);
				}else{//分别判断 为零项
					var sd = g.ss[i] || '';
					var sa = parseInt(sd.split('/')[0] || '');
					var sb = parseInt(sd.split('/')[1] || '');
					for(var f=sa,lens=sb;f<=lens;f++){
						var ff = f;
						var ra = parseInt($('.zonyu'+ff).val() || '0');
						var rb = parseInt($('.zonsh'+ff).val() || '0');
						var rc = parseInt($('.feyu'+ff).val() || '0');
						var rd = parseInt($('.fesh'+ff).val() || '0');
						if(ra == 0 && rb == 0 && rc == 0 && rd == 0){
							$('.zonyu'+ff).parents('tr').hide();
						}
					}
				}

			}
		}
		//配置表二 编号顺序
		$('.nbs').each(function(g){
			var gg = g + 1;
			$(this).html(gg);
		})
		var res = myBrowser();
		//if(res != 'Chrome'){alert('当前所使用的是'+res+'浏览器,建议使用谷歌浏览器或者360浏览器！');}
		//setTimeout(function(){window.print()},3000);
	}
	function myBrowser(){
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1;
		if (isOpera) {
			return "Opera"
		}; //判断是否Opera浏览器
		if (userAgent.indexOf("Firefox") > -1){
			return "火狐";
		} //判断是否Firefox浏览器
		if (userAgent.indexOf("Chrome") > -1){
		  return "Chrome";
		 }
		if (userAgent.indexOf("Safari") > -1) {
			return "苹果";
		} //判断是否Safari浏览器
		if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
			return "IE";
		}; //判断是否IE浏览器
	}

	//生成城市数据
	function setCity(data){
		var data = data || '';
		var cenNum = 0,zonpinci = 0;
		//if(data == ''){return false;}
		var str1 = data.split('<city>') || [];
		var html = '<table class="table1">'
					+'<tr>'
						+'<th>城市名</th>'
						+'<th>城市稽查中心数</th>'
						+'<th>稽查次数</th>'
						+'<th>操作</th>'
					+'</tr>';
		for(var i=0,len=str1.length;i<len;i++){
			var dd = str1[i] || '';
			if(dd == ''){continue;}
			var _city = dd.split('/')[0] || '';
			var _cen = dd.split('/')[1] || '';
			var pinci = dd.split('/')[2] || '';
			var c = parseInt( _cen || '0') || 0;
			var d = parseInt( pinci || '0') || 0;
			cenNum += c;
			zonpinci += d;
			html +='<tr>'
				+'<td>'+_city+'</td>'
				+'<td>'+_cen+'</td>'
				+'<td>'+pinci+'</td>'
				+'<td class="last">'
				+'	<a href="javascript:;" onclick="deleteCity(\''+i+'\')" class="cao_btn cao_btn3">删除</a>'
				+'</td>'
			+'</tr>';
		}
		html +='</table>';
		$('#cityList').html(html);
		$('.yanjiuzhongxinshu').val(cenNum);
		$('.jichacishu').val(zonpinci);
	}
	//添加城市
	function addCity(){
		var _city = $('#cityChoice option:selected').val() || '';
		var _cen = $('#cenNum').val() || '';
		var jicipin = $('#jicipin').val() || '';
		var price = $('#cityChoice option:selected').attr('price') || '';
		var by = $('#cityChoice option:selected').attr('by') || '';
		if(_city == ''){Utils.alert('请选择城市！');return false;}
		if(_cen == ''){Utils.alert('城市中心数不能为空');return false;}
		if(jicipin == ''){Utils.alert('稽查次数不能为空');return false;}
		var str1 = g.nowCity.split('<city>') || [];
		var clo = _city + '/' + _cen + '/' + jicipin;
		str1.push(clo);
		g.nowCity = str1.join('<city>');
		setCity(g.nowCity);
		setCloTable(_city,price,jicipin,by);
		runAll();//按顺序计算所有表
	}
	//删除城市
	window.deleteCity = function(n){
		var n = n || '';
		var a = n + 1;
		if(n == ''){Utils.alert('标识id不能为空！');return false;}
		var str1 = g.nowCity.split('<city>') || [];
		str1.splice(n,1);
		g.nowCity = str1.join('<city>');
		setCity(g.nowCity);
		$('.ccpingjuncc1').each(function(s){
			var k = $('.ccpingjuncc1').length - s;
			if(n == k){$(this).parents('tr').remove();}
		});
		$('.ccpingjuncc2').each(function(s){
			var k = $('.ccpingjuncc2').length - s;
			if(n == k){$(this).parents('tr').remove();}
		});
		runAll();//按顺序计算所有表
	}
	//blur 重新按顺序计算
	$('#xdoc_body').on('blur','.danjiabz,.danbinglifangshicishu,.jichacishu,.yanjiuzhongxinshu,.binglishu,.shiyanzhouqi,.ccdiqucommon,.ccchuxingcommon,.ccwangfancommon,.ccpincicommon,.cczstscommon,.ccdanjiacommon,.ccpxiaojicommon,.ccjishujlcommon,.cccanybzcommon,.cctongxbzcommon,.ccjiaotbzcommon,.ccsxiaojicommon,.ccchuchacbcommon',function(){
		runAll();//按顺序计算所有表
	});
	
	//所有表的计算
	function runAll(){
		setTimeout(function(){everyCaw();},500);//根据单位费用明细表每一项赋值
		setTimeout(function(){eachsetVal();},500);//根据单位 费用明细表 每一项赋值2
		setTimeout(function(){getAllsum();},500);//计算费用明细表
		setTimeout(function(){getDays();},500);//计算差旅天数
		setTimeout(function(){refrashChailv();},500);//计算差旅费表 所有值
		setTimeout(function(){getProTTMoney();},500);//计算表一 总费用行
	}
	//刷新差旅费表的计算值
	function refrashChailv(){
		var dat = parseInt($('.ccdays').val() || '0');//获取公共天数
		$('.ccpingjuncc1').each(function(s){
			var _num = $(this).parents('tr').find('.ccdiqucommon').attr('ste') || '';
			//循环 计算每行住宿天数 出差天数*每个频次 
			var pici = parseInt($('.ccpinci'+_num).val() || '0');//获取这行的频次
			var thisday = (dat*pici).toFixed(0) || 0;
			$('.cczsts'+_num).val(thisday);
			//计算每行数值和总值
			setFeiNum(_num);
		});
		/* $('.ccpingjuncc2').each(function(s){
			var _num = $(this).parents('tr').find('.ccdiqucommon').attr('ste') || '';
			setFeiNum(_num);
		}); */
		getttcc();
	}
	//保存当前id
	function setSook(){
		if(g.newone != ''){//判断是新建 清空id值
			g.id == '';
			Utils.offLineStore.remove("nowid",false);
			return false;
		}
		if(g.id == ''){
			g.id = Utils.offLineStore.get("nowid",false) || "";
		}else{
			Utils.offLineStore.set("nowid",g.id,false);
		}
	}
	//保存数据
	function saveProject(){
		var serial_number = $('#serial_number').val() || '';
		var version = $('#version').val() || '';
		if(serial_number == ''){Utils.alert('预算项目编号不能为空');return false;}
		if(version == ''){Utils.alert('预算版本号不能为空');return false;}
		var pricez = parseInt($('#xiangmuzongji').val() || '0');
		var bb = format(pricez);
		var name = $('#name').val() || '';
		var center_number = $('#center_number').val() || '';
		var budget_price = bb;
		var sponsor = $('#sponsor').val() || '';

		var condi = {};
		condi.id = g.id;
		condi.serial_number = serial_number;
		condi.version = version;
		condi.name = name;
		condi.center_number = center_number;
		condi.budget_price = budget_price;
		condi.sponsor = sponsor;
		condi.json1 = getSetInput('json1');
		condi.json2 = getSetInput('json2');
		condi.json3 = getSetInput('json3');
		condi.json4 = g.nowCity;
		var url = Base.serverUrl + "update";
		if(g.copy != ''){//判断是复制
			condi.id = '-1';
			url = Base.serverUrl + "save";
		}
		if(g.newone != ''){//判断是新建
			condi.id = '0';
			url = Base.serverUrl + "save";
		}
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
					var data = data.result || [];
					var id = data.id || '';
					Utils.alert("保存成功！");
					if(id != ''){
						g.id = id;
						Utils.offLineStore.set("nowid",g.id,false);
					}
				}
				else{
					var msg = data.message || "获取项目信息失败";
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
	
	
	//编辑 获取数据
	function editGetProject(){
		if(g.id == ''){return false;}
		var condi = {};
		condi.id = g.id;
		var url = Base.serverUrl + "edit";
		if(g.copy != ''){
			url = Base.serverUrl + "copy";
		}
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
					var version = d.version || '';
					var pversion = d.pversion || '';
					var serial_number = d.serial_number || '';//项目编号
					var sponsor = d.sponsor || '';//申办方
					var json1 = d.json1 || '';//
					var json2 = d.json2 || '';//
					var json3 = d.json3 || '';//
					var json4 = d.json4 || '';//
					var isDelete = d.isDelete || '';//
					g.state = d.state || '';//状态
					//审核通过 将审核按钮改变
					if(g.state == '审核通过'){
						$('#printGo4').html('已审核').off();
					}
					$('#version,.version').val(version);
					if(g.edit != ''){$('#version').attr('readonly',true);}
					$('#serial_number').val(serial_number);
					g.nowCity = json4;
					setCity(json4);
					setCloTable();
					getSetInput('json1',json1);
					getSetInput('json2',json2);
					getSetInput('json3',json3);
					if(g.copy != ''){$('.version').val(version);}
					if(g.print == 'print1'){//打印的时候 给表二 表三赋值 隐藏其他表
						setTable2Val();
						$('#table2').hide();
						setTable3Val();
						$('#chailvTable').hide();
					}else if(g.print == 'print2'){//判断是打印明细表
						
						
					}
					setBinglData();//给病例数据反向赋值
					
				}
				else{
					var msg = data.message || "获取项目信息失败";
					//Utils.alert(msg);
				}
				//g.httpTip.hide();
			},
			error:function(data,status){
				//g.httpTip.hide();
				if(status=='timeout'){
		　　　　　  //Utils.alert("超时");
		　　　　}
			}
		});
	}
	//给病例数据反向赋值
	function setBinglData(){
		$('.binglieach').each(function(n){
			var bb = [1,4,7,10,13];
			var a = n + 1;
			var val = $(this).val() || '';
			var val2 = parseFloat($(this).val() || '0') || 0;
			if(bb.indexOf(a) > -1 && val != ''){
				val = val2*60;
			}
			$('.binglivalue'+a).val(val);
		});
		
	}
	
	//获取或输入 表格的input值  非空则是 传值  为空则是 获取值
	function getSetInput(json,data){
		var json = json || '';//名字
		var data = data || '';//data
		if(data != ''){//非空则是 传值
			var data1 = data.split('/tableStar/');
			var len = data1.length || 0;
			if(len > 0){
				$('.'+json).each(function(n){
					var a = n + 1;
					if(a > len){return false;}//精准赋值
					var _th = $(this) || {};
					var value = data1[n] || '';
					_th.val(value);
				});
			}
		}else{//为空则是 获取值
			var _result = '';
			if($('.'+json).length > 0){
				$('.'+json).each(function(n){
					var a = n + 1;
					var _th = $(this) || {};
					var value = _th.val() || '';
					if(a == 1){
						_result = value;
					}else{
						_result = _result + '/tableStar/' + value;
					}
				});
			}
			return _result;
		}
	}
	
	
	//选择城市
	$('#toggShow').on('click',function(){
		$('#toggBox2').slideUp();
		$('#toggBox').slideToggle();
	});
	//选择稽查病例 
	$('#toggShow2').on('click',function(){
		$('#toggBox').slideUp();
		$('#toggBox2').slideToggle();
	});
	//flash、pdf、docx、html、png
	$('#done').on('click',function(){
		var format = $('#type').val() || '';
		var html1 = $('#xdoc_body').val();
		//var html = document.getElementById("xdoc_body").value;
		XDoc.run(html1, format, {}, "_blank");
		
		//恢复样式
		
	})
    //表一生成 项目总计
	$('#xdoc_body').on('blur','.chalv',function(){
		getProTTMoney();//计算第一个表的 总费用
	});
	//计算第一个表的 总费用
	function getProTTMoney(){
		var a = Number($('#chailvchengbenfei').val() || '');
		var b = Number($('#jishufuwufei').val() || '');
		var c = Number($('#shuifei').val().replace(/,/g,''));
		var tt = a + b + c;
		var bb = format(tt);
		$('#xiangmuzongji').val(tt);
		$('#budget_price').val(' ¥ '+bb);
		
	}
	//千分分割
	function format(num){
		return (num.toFixed(0) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	}
	//预算管理 中心管理
	$('#top_menu .ss').each(function(n){
		$(this).click(function(){
			$(this).addClass('active').siblings('.ss').removeClass('active');
			$('.page_common').hide();
			$('#page'+n).show();
		})
	});	
	//blur 计算差旅费表 数据
	$('#xdoc_body').on('blur','.ccdiqucommon,.ccchuxingcommon,.ccwangfancommon,.ccpincicommon,.cczstscommon,.ccdanjiacommon,.ccpxiaojicommon,.ccjishujlcommon,.cccanybzcommon,.cctongxbzcommon,.ccjiaotbzcommon,.ccsxiaojicommon,.ccchuchacbcommon',function(){
		var _num = $(this).parents('tr').find('.ccdiqucommon').attr('ste') || '';
		if(_num == ''){return false;}
		setFeiNum(_num);
		getttcc();
	});
	//计算差旅平均 和 总的平均
	function getttcc(){
		var ccmoney1 = 0,ccmoney2 = 0;
		var sum1 = 0,sum2 = 0,zon = 0;
		$('.ccpingjuncc1').each(function(n){
			var _m = parseInt($(this).val() || "0");
			if($(this).val() != '' && $(this).val() != 0){
				ccmoney1 += _m;sum1++;
			}
		});
		/* $('.ccpingjuncc2').each(function(n){
			var _m = parseInt($(this).val() || "0");
			if($(this).val() != '' && $(this).val() != 0){
				ccmoney2 += _m;sum2++;
			}
		}); */
		//sum1 = sum1 == 0 ? 1 : sum1;
		//sum2 = sum2 == 0 ? 1 : sum2;
		//ccmoney1 = (ccmoney1/sum1).toFixed(0) || 0;
		//ccmoney2 = (ccmoney2/sum2).toFixed(0) || 0;
		//var a = parseInt(ccmoney1) + parseInt(ccmoney2);
		//zon = ccmoney1 == 0 || ccmoney2 == 0 ? a : (a/2).toFixed(0);
		//$('.ccpingjx1').val(ccmoney1);
		//$('.ccpingjx2').val(ccmoney2);
		zon = ccmoney1.toFixed(0);
		$('.chailvmeimoney').val(zon);
		
		
	}
	
	
	//计算差旅费用表 小计及出差成本
	function setFeiNum(num){
		var num = num || '';
		if(num == ''){return false;}
		//小计1
		var a = $('.cczsts'+num).val() == '' ? 1 : parseFloat($('.cczsts'+num).val());//
		var b = parseInt($('.ccdanjia'+num).val() || '1');//
		var tou = (a*b).toFixed(0);
		if($('.cczsts'+num).val() == '' && $('.ccdanjia'+num).val() == ''){
			tou = '';
		}
		//小计二
		var a2 = parseInt($('.ccjishujl'+num).val() || '0');//
		var b2 = parseInt($('.cccanybz'+num).val() || '0');//
		var c2 = parseInt($('.cctongxbz'+num).val() || '0');//
		var d2 = parseInt($('.ccjiaotbz'+num).val() || '0');//
		var tou2 = (a2+b2+c2+d2).toFixed(0) || 0;
		if($('.ccjishujl'+num).val() == '' && $('.cccanybz'+num).val() == '' && $('.cctongxbz'+num).val() == '' && $('.ccjiaotbz'+num).val() == ''){
			tou2 = '';
		}
		$('.ccpxiaoji'+num).val(tou);
		$('.ccsxiaoji'+num).val(tou2);
		//出差成本
		var a3 = parseInt($('.ccwangfan'+num).val() || '0');//往返
		var d3 = parseInt($('.ccpinci'+num).val() || '0');//频次
		var b3 = parseInt($('.ccpxiaoji'+num).val() || '0');//小计一
		var c3 = parseInt($('.ccsxiaoji'+num).val() || '0');//小计二
		var tou3 = (a3*d3+b3+c3*a).toFixed(0) || 0;
		
		$('.ccchuchacb'+num).val(tou3);
		
	}
	
	//计算差旅费用表出差天数
	function getDays(){
		var a = parseInt($('.zonyutt5').val() || '0');//4.稽查实施 预期总时间
		var b = parseInt($('.zonyutt6').val() || '0');//5.稽查原始资料 预期总时间
		var c = parseInt($('.yanjiuzhongxinshu').val() || '1');//研究中心数
		var d = parseInt($('.jichacishu').val() || '1');//稽查次数
		if(a == 0 && b == 0){return false;}
		//var tou = ((a+b)/2/8/c/d) || 0;
		var tou = ((a+b)/8/d) || 0;
		//不到半天算半天 不到一天算一天
		tou = Math.ceil(tou);
		$('.ccdays').val(tou);//
		refrashChailv();
	}
	

	//计算总时间列
	function setTTtime(num){
		var num = num || '';
		if(num == ''){return false;}
		//预期
		var a = parseFloat($('.dy'+num).val());
		var b = parseInt($('.cayu'+num).val() || '1');
		var c = parseInt($('.py'+num).val() || '1');
		var tou = (a*b*c).toFixed(0) || 0;
		//如果相乘的三项都为空 结果清零
		if($('.dy'+num).val() == '' && $('.cayu'+num).val() == '' && $('.py'+num).val() == ''){
			tou = '';
		}
		$('.zonyu'+num).val(tou);
		//实际
		var a2 = parseInt($('.dash'+num).val() || '1');
		var b2 = parseInt($('.cash'+num).val() || '1');
		var c2 = parseInt($('.pish'+num).val() || '1');
		var tou2 = (a2*b2*c2).toFixed(0) || 0;
		//如果相乘的三项都为空 结果清零
		if($('.dash'+num).val() == '' && $('.cash'+num).val() == '' && $('.pish'+num).val() == ''){
			tou2 = '';
		}
		$('.zonsh'+num).val(tou2);
		setTTmoney(num);
		
	}
	//计算费用
	function setTTmoney(num){
		var num = num || '';
		if(num == ''){return false;}
		var a = parseInt($('.zonyu'+num).val() || '1');
		var b = parseInt($('.danjia'+num).val() || '1');
		var tou = (a*b).toFixed(0) || 0;
		//如果相乘的项都为空 结果清零
		//if($('.zonyu'+num).val() == '' && $('.danjia'+num).val() == ''){
		if($('.zonyu'+num).val() == ''){
			tou = '';
		}
		$('.feyu'+num).val(tou);
		var a2 = parseInt($('.zonsh'+num).val() || '0');
		var tou2 = (a2*b).toFixed(0) || 0;
		//console.log(tou2);
		//如果相乘的项都为空 结果清零
		//if($('.zonsh'+num).val() == '' || $('.danjia'+num).val() == ''){
		if($('.zonsh'+num).val() == ''){
			tou2 = '';
		}
		$('.fesh'+num).val(tou2);
	}
	//更新数据
	$('#xdoc_body').on('blur','.shiyanzhouqi',function(){
		resetVal('h/月',$(this).val());
		resetVal('h/项目','1');
	});
	$('#xdoc_body').on('blur','.jichacishu',function(){
		resetVal('h/次',$(this).val());
		resetVal('h/项目','1');
	});
	$('#xdoc_body').on('blur','.danbinglifangshicishu',function(){
		resetVal('分钟/访视/例',$(this).val());
		resetVal('h/项目','1');
	});
	//给表二 每项赋值
	function everyCaw(){
		resetVal('h/月',$('.shiyanzhouqi').val());
		resetVal('h/次',$('.jichacishu').val());
		resetVal('分钟/访视/例',$('.danbinglifangshicishu').val());
		resetVal('h/项目','1');
	}
	//判断更新哪个
	function resetVal(str,val){
		var str = str || '';
		var val = val || '';
		//if(str == ''){return false;}
		$('.dowchoice').each(function(){//遍历所有表二 行
			var _value = $(this).val() || '';
			var _num = $(this).attr('ste') || '';
			if(_num == ''){return false;}
			if(_value.indexOf('h/月') > -1 && str == 'h/月'){
				$('.py'+_num).val(val);
				//setTTtime(_num);
			}else if(_value.indexOf('h/次') > -1 && str == 'h/次'){
				$('.py'+_num).val(val);
				//setTTtime(_num);
			}else if(_value.indexOf('h/项目') > -1 && str == 'h/项目'){
				$('.py'+_num).val('1');
				//setTTtime(_num);
			}else if(_value.indexOf('分钟/访视/例') > -1 && str == '分钟/访视/例'){
				//$('.py'+_num).val(val);
				//setTTtime(_num);
			}
			setTTtime(_num);
		});
	}
	
	$('#xdoc_body').on('blur','.yanjiuzhongxinshu,.jichacishu,.danbinglifangshicishu,.binglishu,.shiyanzhouqi,.dycommon,.dowchoice,.dashcommon,.cayucommon,.cashcommon,.pycommon,.pishcommon,.zonyucommon,.zonshcommon,.danjiacommon',function(){
		var _num = $(this).parents('tr').find('.dowchoice').attr('ste') || '';
		//console.log(_num);
		getAllsum(_num);//计算费用明细表 每一行总值和后面总值
	});
	
	
	//计算费用明细表 每一行总值和后面总值
	function getAllsum(num){
		var _num = num || '';
		if(_num == ''){
			$('.dowchoice').each(function(){
				var _num = $(this).attr('ste') || '';
				setTTtime(_num);
				getTT(_num,'zonyu');//获取总时间预期
				getTT(_num,'zonsh');//获取总时间实际
				getTT(_num,'feyu');//获取费用预期
				getTT(_num,'fesh');//获取费用实际
				//console.log(_num);
			});
		}else{
			setTTtime(_num);
			getTT(_num,'zonyu');//获取总时间预期
			getTT(_num,'zonsh');//获取总时间实际
			getTT(_num,'feyu');//获取费用预期
			getTT(_num,'fesh');//获取费用实际
		}
		getTotalTT();//获取 费用明细表 时间的总 费用的总和
	}
	//计算费用明细表最后一行总和 差旅成本
	//$('#xdoc_body').on('blur','.yanjiuzhongxinshu,.danbinglifangshicishu,.binglishu,.shiyanzhouqi,.bbchailvyqyuan,.bbchailvyqyuans,.bbsite,.bbsites,.bbchailvmyq,.bbchailvmyqs,.bbfashengc,.jichacishu',function(){
	//	jisuanzong();//计算费用明细 最后一行两个总值 
	//});
	
	//计算费用明细表最后一行总和 差旅成本
	/* function jisuanzong(){
		//预期
		setTimeout(function(){//延时费用明细表计算总额
		var a = parseInt($('.bbchailvyqyuan').val() || '1');
		var b = parseInt($('.bbsite').val() || '1');
		var c = parseInt($('.bbchailvmyq').val() || '1');
		var d = parseInt($('.bbfashengc').val() || '1');
		var tou = (a*b*c*d).toFixed(0) || 0;
		//如果相乘的三项都为空 结果清零
		if($('.bbchailvyqyuan').val() == '' && $('.bbsite').val() == '' && $('.bbchailvmyq').val() == '' && $('.bbfashengc').val() == ''){
			tou = 0;
		}
		//实际
		var a2 = parseInt($('.bbchailvyqyuans').val() || '1');
		var b2 = parseInt($('.bbsites').val() || '1');
		var c2 = parseInt($('.bbchailvmyqs').val() || '1');
		//var tou2 = (a2*b2*c2*d).toFixed(0) || 0;
		var tou2 = (a2*b2*c2).toFixed(0) || 0;
		//如果相乘的三项都为空 结果清零
		if($('.bbchailvyqyuans').val() == '' && $('.bbsites').val() == '' && $('.bbchailvmyqs').val() == ''){
			tou2 = 0;
		}
		
		$('.bbyuqizong').val(tou);//预期
		$('.bbyuqizongs').val(tou2);//实际
		getDays();//计算差旅天数
		getProTTMoney();//重新计算费用总表 数据
		},1000);
	} */
	//获取 费用明细表 时间的总 费用的总和
	function getTotalTT(){
		var tttime = 0,ttmoney = 0;
		$('.zonyutt').each(function(n){
			var _m = parseInt($(this).val() || "0");
			tttime += _m;
		});
		$('.jisuantt').each(function(n){
			var _m = parseInt($(this).val() || "0");
			ttmoney += _m;
		});
		$('.totalTime').val(tttime);
		$('.totalMoney').val(ttmoney);
		//税费
		var shui = (parseInt(ttmoney)*0.07).toFixed(0);
		$('#shuifei').val(shui);
		//getProTTMoney();
	}
	
	//计算总费用
	//总时间预期1
	function getTT(_num,cla){//a 开始 b 结束 cla class前缀
		var _tt=0,ss = g.ss;
		var sta=0,sto=0,clas;
		for(var k=0,le=ss.length;k<le;k++){
			var v = k +1;
			var d = ss[k] || '';
			var a = parseInt(d.split('/')[0] || '');
			var b = parseInt(d.split('/')[1] || '');
			if(_num >= a && _num <= b){
				sta = a;sto = b;clas = v;
			}
		}
		for(var i=sta,len=sto;i<=len;i++){
			var _v = $('.'+cla+i).val() || '';
			if(_v == ''){continue;}
			_tt += parseInt(_v);
		}
		$('.'+cla+'tt'+clas).val(_tt);
		
	}
	
	$('#xdoc_body').on('blur',".dowchoice",function(){
		setVal();
	});
	//表二 修改单位时间 自动变化 任务时间
	$('#xdoc_body').on('blur',".dycommon",function(){
			var val = $(this).val() || '';
			var pva = parseFloat(val) || '';
			var _str = $(this).parents('tr').find('.dowchoice').val() || '';
			var nu = $(this).parents('tr').find('.dowchoice').attr('ste') || '';
			var _val3 = $('.danbinglifangshicishu').val() || '';//获取单病例访视次数数值
			var _val4 = $('.binglishu').val() || '';//病例数
			var str = _str.replace(/[^0-9]/g,'');//获取数字部分
			var st = _str.split(str).join('');
			var res = val+st;
			if(_str.indexOf('h/月') > -1){
				res = val + 'h/月';
			}else if(_str.indexOf('h/次') > -1){
				res = val + 'h/次';
			}else if(_str.indexOf('h/项目') > -1){
				res = val + 'h/项目';
			}else if(_str.indexOf('分钟/访视/例') > -1){
				res = (pva*60).toFixed(0) + '分钟/访视/例';
			}else if(_str.indexOf('分钟/例') > -1){
				$('.py'+nu).val(_val3);
				$('.cayu'+nu).val(_val4);
				return true;
			}
			$(this).parents('tr').find('.dowchoice').val(res);	
	});
	//用单位时间 同步任务时间 自动所有
	function eachsetVal(){
		$('.dycommon').each(function(){
			var val = $(this).val() || '';
			var pva = parseFloat(val) || '';
			var _str = $(this).parents('tr').find('.dowchoice').val() || '';
			var nu = $(this).parents('tr').find('.dowchoice').attr('ste') || '';
			var _val3 = $('.danbinglifangshicishu').val() || '';//获取单病例访视次数数值
			var _val4 = $('.binglishu').val() || '';//病例数
			var str = _str.replace(/[^0-9]/g,'');//获取数字部分
			var st = _str.split(str).join('');
			var res = val+st;
			if(_str.indexOf('h/月') > -1){
				res = val + 'h/月';
			}else if(_str.indexOf('h/次') > -1){
				res = val + 'h/次';
			}else if(_str.indexOf('h/项目') > -1){
				res = val + 'h/项目';
			}else if(_str.indexOf('分钟/访视/例') > -1){
				res = (pva*60).toFixed(0) + '分钟/访视/例';
			}else if(_str.indexOf('分钟/例') > -1){
				$('.py'+nu).val(_val3);
				$('.cayu'+nu).val(_val4);
				return true;
			}
			$(this).parents('tr').find('.dowchoice').val(res);	
		});
		
	}

	//自动给预期单位时间 和 频次赋值
	function setVal(){
		if(!_th || _th == ''){return false;}
		var _num = _th.attr('ste') || '';
		var _value = _th.val() || '';
		var _val1 = $('.shiyanzhouqi').val() || '';//获取实验周期数值
		var _val2 = $('.jichacishu').val() || '';//获取稽查次数数值
		var _val3 = $('.danbinglifangshicishu').val() || '';//获取单病例访视次数数值
		var va = _value.replace(/[^0-9]/g,'');//获取数字部分
		//$('.dy'+_num).val(va);
		if(_value.indexOf('h/月') > -1){
			$('.py'+_num).val(_val1);
		}else if(_value.indexOf('h/次') > -1){
			$('.py'+_num).val(_val2);
		}else if(_value.indexOf('h/项目') > -1){
			$('.py'+_num).val('1');
		}else if(_value.indexOf('分钟/访视/例') > -1){
			var _tt = (va/60).toFixed(2);
			//$('.py'+_num).val(_val3);
			//$('.dy'+_num).val(_tt);
		}else if(_value.indexOf('分钟/例') > -1){
			$('.py'+_num).val(_val3);
		}
		setTTtime(_num);
		getTT(_num,'zonyu');//获取总时间预期
		getTT(_num,'zonsh');//获取总时间实际
		getTT(_num,'feyu');//获取费用预期
		getTT(_num,'fesh');//获取费用实际
		getTotalTT();
	}

	
	
	
});

