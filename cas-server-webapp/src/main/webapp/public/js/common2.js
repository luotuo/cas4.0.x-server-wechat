/**
 * file:page
 * author:lixianqi
 * date:2017-5-3
*/

//页面初始化
$(function(){
	var g = {};
	g.login_token = Utils.offLineStore.get("token",false) || "";
	g.f_id = Utils.getQueryString("f_id") || "";
	g.httpTip = new Utils.httpTip({});
	var _th,_nu;//存放选中的输入框
	/*......................lodding.......................................*/
	
	
	
	
	
	/*......................setting.......................................*/
	

	//获取iframe 参数
	window.getString = function(name){
		var name = name || '';
		var iframe = parent.document.getElementById("iframeObj") || {};
		var _href = iframe.src || '';
		if(_href == '' || _href.indexOf('?') < 0){return false;}
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = _href.split('?')[1].match(reg);
		if (r != null && typeof r != "undefined"){
			return unescape(r[2]);
		}
		else{
			return "";
		}
	}
	//公共返回方法
	$('.goback').on('click',function(){
		var page = $(this).attr('back') || '';
		if(page == ''){window.history.go(-1);return false;}
		parent.document.getElementById("iframeObj").src = page;
		
	});
	
	//公共复选框
	$('.check_box').on('click',function(){
		var _this = $(this) || {};
		if(_this.hasClass('active')){_this.removeClass('active')}else{_this.addClass('active')}
	});
	
	/* 防止冒泡 */
	function stopPropagation(e) {  
		e = e || window.event;  
		if(e.stopPropagation) { //W3C阻止冒泡方法  
			e.stopPropagation();  
		} else {  
			e.cancelBubble = true; //IE阻止冒泡方法  
		}  
	}
	
	
	window.stopPropagation = stopPropagation;
});

