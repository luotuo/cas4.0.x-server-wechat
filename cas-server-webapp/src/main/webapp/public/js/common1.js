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

	
	
	
	/*......................lodding.......................................*/
	menuFunction();//公共左侧菜单展开与收
	$('#slideLmenu').on('click',shouFunc);
	$('#login_out').on('click',loginOut);
	//loadF();
	
	
	
	
	
	/*......................setting.......................................*/
	
	//页面加载
	function loadF(){
		var name = $('.userName') || '';
		if(name == ''){return false;}
		name.html(g.login_token);
		
	}
	//退出登录
	function loginOut(){
		if(!confirm('确定要退出吗？')){return false;}
		location.href = Base.serverUrl + "logout";
		return false;
		var condi = {};
		var url = Base.serverUrl + "logout";
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
					
				}
				else{
					var msg = data.message || "退出失败";
					//Utils.alert(msg);
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
	
	
	//左侧菜单的展开收起
	function shouFunc(){
		var _this = $(this) || {};
		if(!_this){return false;}
		if(_this.hasClass('shou')){//展开操作
			$('.logo_div').animate({'width':'13%'},'slow','swing',function(){
				$('.logo_div').css({"background":"url('../public/img/logo.png') no-repeat scroll 32% center / auto 60%","background-color":"#2a323f"});
			});
			$('#common_menu').animate({'left':'0'},'slow');
			$('.frame_div').animate({'left':'13%'},'slow');
			$('#menu_show_t').animate({'width':'86%'},'slow');
			
		}else{//收起操作
			$('.logo_div').animate({'width':'30px'},'slow','swing',function(){
				
			});
			$('#common_menu').animate({'left':'-13%'},'slow');
			$('.logo_div').css({"background":"#2a323f"});
			var _w = $(window).width() - 45;
			$('#menu_show_t').animate({'width':_w+'px'},'slow');
			$('.frame_div').animate({'left':'0%'},'slow');
		}
		_this.toggleClass('shou');
	}
	
	//公共左侧菜单展开与收
	function menuFunction(){
		var obj = $('#common_menu') || {};
		if(!obj){Utils.alert("左侧公共菜单ID不存在"); return false;}
		//判断当前菜单有否有子菜单
		$('.mm').each(function(){
			var _is = $(this) || {};
			if(_is.hasClass('c1') && _is.next().hasClass('c2') || _is.hasClass('c2') && _is.next().hasClass('c3') ){
				_is.addClass('has');
			}else{
				_is.removeClass('has');
			}
			
		});
		//一级菜单点击
		obj.find('.c1').on('click',function(){
			var _this = $(this) || {};
			var _id = _this.attr('id') || '';
			var _e = _this.find('.text_c').html() || '';
			var _url = _this.attr('url') || '';
			$('#menu_show_t .ss').removeClass('active');
			$('#menu_show_t .ss').html('');
			$('#menu_show_t .s0').html(_e).addClass('active');
			if(_id == ''){Utils.alert("当前菜单ID不存在"); return false;}
			if(!_this.next().hasClass('c2')){//判断当前菜单为直接链接地址
				$('.mm').removeClass('active');
				_this.addClass('active');
				if(_url != ''){document.getElementById("iframeObj").src = _url ;}//跳转
				return false;
			}
			obj.find('.c2').each(function(n){
				var _t = $(this) || {};
				var _pid = _t.attr('pid') || '';
				if(_pid == _id){
					if(_this.hasClass('down')){
						_t.slideUp(200);
					}
					else{
						_t.slideDown(200);
					}
					if(_t.hasClass('c2') && _t.next().hasClass('c3')){//判断是当前菜单的是否有子元素
						var _id2 = _t.attr('id') || '';
						obj.find('.c3').each(function(n){
							var _t2 = $(this) || {};
							var _pid2 = _t2.attr('pid') || '';
							if(_pid2 == _id2 && _this.hasClass('down')){_t2.slideUp(200);}
						});
					}
				}
			});
			_this.toggleClass('down');
		});
		//二级菜单点击
		obj.find('.c2').on('click',function(){
			var _this = $(this) || {};
			var _id = _this.attr('id') || '';
			var _pid = _this.attr('pid') || '';
			var _e = _this.find('.text_c').html() || '';
			var _e2 = $('#'+_pid).find('.text_c').html() || '';
			var _url = _this.attr('url') || '';
			$('#menu_show_t .ss').removeClass('active');
			$('#menu_show_t .ss').html('');
			$('#menu_show_t .s0').html(_e2);
			$('#menu_show_t .s1').html(' > '+_e).addClass('active');
			if(_id == ''){Utils.alert("当前菜单ID不存在"); return false;}
			if(!_this.next().hasClass('c3')){
				$('.mm').removeClass('active');
				_this.addClass('active');
				if(_url != ''){document.getElementById("iframeObj").src = _url ;}//跳转
				return false;
			}
			if(_this.next().hasClass('c3')){//判断是当前菜单的是否有子元素
				obj.find('.c3').each(function(n){
					var _t2 = $(this) || {};
					var _pid2 = _t2.attr('pid') || '';
					if(_pid2 == _id){_t2.slideToggle(200);}
				});
			}
			_this.toggleClass('down');
		});
		//三级菜单点击
		obj.find('.c3').on('click',function(){
			var _this = $(this) || {};
			var _pid = _this.attr('pid') || '';
			var _pid2 = $('#'+_pid).attr('pid') || '';
			var _e = _this.find('.text_c').html() || '';
			var _e2 = $('#'+_pid).find('.text_c').html() || '';
			var _e3 = $('#'+_pid2).find('.text_c').html() || '';
			var _url = _this.attr('url') || '';
			$('#menu_show_t .ss').removeClass('active');
			$('#menu_show_t .ss').html('');
			$('#menu_show_t .s0').html(_e3);
			$('#menu_show_t .s1').html(' > '+_e2);
			$('#menu_show_t .s2').html(' > '+_e).addClass('active');
			$('.mm').removeClass('active');_this.addClass('active');
			if(_url != ''){document.getElementById("iframeObj").src = _url ;}//跳转
		});
	}
	
	
});

