/**
 * file:工具类
 * author:ToT
 * date:2015-05-13
*/

//格式化日期
Date.prototype.format = function(format){
	var o = {
		//month
		"M+" : this.getMonth()+1,
		//day
		"d+" : this.getDate(),
		//hour
		"h+" : this.getHours(),
		//minute
		"m+" : this.getMinutes(),
		//second
		"s+" : this.getSeconds(),
		//quarter
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		//millisecond
		"S" : this.getMilliseconds()
	};
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o)if(new RegExp("(" + k + ")").test(format))
	format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};

Array.prototype.remove = function(n){
	//n表示第几项，从0开始算起。
	//prototype为对象原型，注意这里为对象增加自定义方法的方法。
	if(n < 0){
		//如果n<0，则不进行任何操作。
		return this;
	}
	else{
		return this.slice(0,n).concat(this.slice(n+1,this.length));
	}
	/*
	concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
	这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
	组成的新数组，这中间，刚好少了第n项。
	slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
	*/
};

if(typeof console == "undefined"){
	var console = {};
	console.log = function(){};
}


(function(window){
	if (typeof Utils === "undefined") {
		Utils = {};
	}

	//拼接URL参数
	function param(obj){
		var arr = [];
		for(var a in obj){
			var s = a + "=" + obj[a];
			arr.push(s);
		}
		return encodeURI(arr.join("&"));
	};

	//js 生成 guid 编码
	function getGuid(){
		var guid = "";
		for (var i = 1; i <= 32; i++){
			var n = Math.floor(Math.random()*16.0).toString(16);
			guid += n;
			if((i==8)||(i==12)||(i==16)||(i==20)){
				guid += "-";
			}
		}
		return guid;
	};

	//判断手机平台
	//手机平台
	var mobilePlatform = {
		android: /android/i.test(navigator.userAgent),
		ipad: /ipad/i.test(navigator.userAgent),
		iphone: /iphone/i.test(navigator.userAgent),
		wphone: /Windows Phone/i.test(navigator.userAgent)
	};

	function getPlatform(){
		var plat = "";
		plat = mobilePlatform.android || "android";
		plat = mobilePlatform.ipad || "ipad";
		plat = mobilePlatform.iphone || "iphone";
		plat = mobilePlatform.wphone || "Windows Phone";
		return plat;
	};

	//判断是否移动平台true/false
	function isMobile(){
		var plat = false;
		var mobilePlatform = {
			android: /android/i.test(navigator.userAgent),
			ipad: /ipad/i.test(navigator.userAgent),
			iphone: /iphone/i.test(navigator.userAgent),
			wphone: /Windows Phone/i.test(navigator.userAgent)
		};
		plat = mobilePlatform.android || mobilePlatform.ipad || mobilePlatform.iphone || mobilePlatform.wphone;
		return plat;
	}

	//根据秒换算天/小时/分钟/秒
	function secondToDate(second){
		if(second >= 0){
			var day = Math.floor(second / 86400);
			var hs = second % 86400;
			var h = Math.floor(hs / 3600);
			var ms = hs % 3600;
			var m = Math.floor(ms / 60);
			var s = ms % 60;

			var obj = {};
			obj.day = day;
			obj.hour = h;
			obj.minute = m;
			obj.second = s;
			return obj;
		}
	}

	/**
	* 预加载图片资源
	* @param  {Zepto} imgElem Img元素对象
	* @param  {String} imgUrl 图片资源URL
	* @param  {Object} opts 可选参数
	* opts属性：
	* success ：图片加载成功后的回调函数
	* fail ：图片加载失败后的回调函数
	* scope ：回调函数的作用域
	*/
	function imageLoaded(imgElem, imgUrl, opts) {
		if (!imgElem) {
			return;
		}
		var imgObj = new Image(),
		me = this,
		success = emptyFn,
		fail = emptyFn,
		scope = me;
		if (opts) {
			success = opts.success ? opts.success : emptyFn;
			fail = opts.fail ? opts.fail : emptyFn;
			scope = opts.scope ? opts.scope : me;
		}

		if (imgUrl) {
			imgObj.onload = function() {
				imgElem.attr("src", imgUrl);
				success.call(scope);
				imgObj.onload = null;
				imgObj.onerror = null;
				imgObj = null;
			};
			imgObj.onerror = function() {
				fail.call(scope);
				imgObj.onload = null;
				imgObj.onerror = null;
				imgObj = null;
			}
			imgObj.src = imgUrl;
		} else {
			fail.call(scope);
		}
	};

	//获取url参数
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null && typeof r != "undefined"){
			return unescape(r[2]);
		}
		else{
			return "";
		}
	};
	function getQueryStringArr(urlString) {
		var reg = /(?:\?|&)(.*?)=(.*?)(?=&|$)/g,
			temp, args = {};
		while ((temp = reg.exec(urlString)) != null) args[temp[1]] = decodeURIComponent(temp[2]);
		return args;
	};
	function getScript(url,dom,callback,scope){
		dom = dom || document.getElementsByTagName('head')[0];
		if(typeof dom.appendChild != "function"){
			dom = document.getElementsByTagName('head')[0];
		}

		//动态加载js
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', url);

		dom.appendChild(js);

		if (document.all) {
			//IE
			js.onreadystatechange = function() {
				if (js.readyState == 'loaded' || js.readyState == 'complete') {
					if(typeof callback === 'function'){
						//执行回调
						callback.apply(scope || this);
					}
				}
			}
		}
		else{
			js.onload = function() {
				//执行回调
				callback.apply(scope || this);
			}
		}
	};

	function setCookie(c_name,value,expiredays){
		var exdate = new Date();
		exdate.setTime(exdate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
		document.cookie = c_name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
	}

	//取回cookie
	function getCookie(name){
		var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return unescape(arr[2]);
		}
		else{
			return "";
		}
	}

	//删除cookies
	function delCookie(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if(cval != null){
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		}
	}


	//var undefinedType = void 0;
	//var isEnableStore = "localStorage" in window && localStore !== null && localStore !== undefinedType;
	//离线存储控制器
	var offLineStore = {
		/**
		* 离线存储某值
		* @param {String} key 存储的值索引
		* @param {String} value 存储的值
		* @forever{Boolean} 是否永久保存
		* @private
		*/
		set: function(key, value,forever) {
			var localStorage = window.localStorage || "";
			if (localStorage !== null && localStorage !== "") {
				//删除本地以前存储的JS模块信息，先removeItem后setItem防止在iphone浏览器上报错
				for (var name = key, len = localStorage.length, id; len--;) {
					id = localStorage.key(len);
					- 1 < id.indexOf(name) && localStorage.removeItem(id);
				}
				try {
					if(forever){
						//永久保存
						localStorage.setItem(key, value);
					}
					else{
						//浏览器关闭清除数据
						sessionStorage.setItem(key,value);
					}
				}
				catch (error) {
					localStorage.clear();
				}
			}
			else{
				setCookie(key,value,0);
			}
		},
		//清楚本地缓存
		remove: function(key,forever){
			var localStorage = window.localStorage || "";
			if (localStorage !== null && localStorage !== "") {
				if(forever){
					//删除永久保存数据
					localStorage.removeItem(key);
				}
				else{
					//删除临时保存数据
					sessionStorage.removeItem(key);
					delCookie(key);
				}
			}
			else{
				delCookie(key);
			}
		},
		/**
		* 根据关键字获取某值
		* @param {String} key 关键字
		* @return {*}
		* @private
		*/
		get: function(key,forever) {
			var localStorage = window.localStorage || "";
			if (localStorage !== null && localStorage !== "") {
				if(forever){
					return localStorage.getItem(key) || "";
					//return isEnableStore && this.isExist(key) ? localStore.getItem(key) : "";
				}
				else{
					return sessionStorage.getItem(key) || "";
				}
			}
			else{
				return getCookie(key);
			}
		},
		/**
		* 根据关键字判断是否有本地存储
		* @param {String} key 关键字
		* @return {Boolean}
		* @private
		*/
		isExist: function(key) {
			var localStorage = window.localStorage || "";
			if(localStorage !== "" && localStorage !== null){
				return !!localStorage[key];
			}
		}
	};


	//小联网load提示
	function httpTip(obj){
		this.scope = obj.scope || this;
		this.bg = obj.bg || false;
		this.hasClose = obj.hasClose === false ? false : true;
		this.text = obj.text || "正在加载...";
		this.init.apply(this,arguments);
	};
	httpTip.prototype = {
		constructor:httpTip,
		id:"_httptip",
		closeid:"_closehttptip",
		moved:false,
		init:function(obj){
			var tip = $("#_httptip");
			if(tip.length === 0){
				var html = [];
				var bgcss = this.bg == true ? "" : "transparentbg";
				html.push('<div id="_httptip" class="prompt_mask ' + bgcss + '" style="display:none;background:none;">');
				html.push('<div class="p_load" >');
				html.push('<div class="loadimg"><span></span></div>');
				/*
				html.push('<div id="_httptext" class="loadtext">' + this.text + '</div>');
				if(this.hasClose){
					html.push('<div id="_closehttptip" class="loadqx"></div>');
				}
				*/
				html.push('</div></div>');
				var $tip = $("#" + this.id);
				if($tip.length == 1){
					$tip.html(html.join(''));
				}
				else{
					$(document.body).append(html.join(''));
				}
				this.bindEvent();
			}
		},
		bindEvent:function(){
			//$("#" + this.id).onbind("touchmove",this.tipMove,this);
			//$("#" + this.closeid).onbind("touchstart",this.btnDown,this);
			//$("#" + this.closeid).onbind("touchend",this.closeBtnUp,this);
		},
		tipMove:function(evt){
			//evt.preventDefault();
			this.moved = true;
		},
		btnDown:function(evt){
			//evt.preventDefault();
			this.moved = false;
		},
		closeBtnUp:function(evt){
			if(!this.moved){
				if(this.scope != null && this.scope != undefined){
					if(typeof this.scope.closeHttpTip == "function"){
						this.scope.closeHttpTip(evt);
					}
				}
			}
		},
		show:function(txt){
			if(txt != "" && txt != null && typeof(txt) != "undefined"){
				$("#_httptext").text(txt);
			}
			$("#_httptip").show();
		},
		hide:function(){
			$("#_httptip").hide();
		},
		isHide:function(){
			var b = true;
			var dp = $("#_httptip").css("display");
			if(dp == "block"){
				b = false;
			}
			return b;
		}
	};

	/*
	 * 弹出提示框
	*/
	var tout = null;
	function alert(msg,b){
		//如果页面引入了layer,采用layer弹出提示
		if(typeof(layer) != "undefined"){
			layer.msg(msg);
			return;
		}

		var box = $("#message-alert");
		if(box.length == 0){
			box = $("<div id='message-alert' class='rp_tishi' ><span>"+msg+"</span></div>");
			$(document.body).append(box);
		}
		else{
			if(b){
				box.append("<span>"+msg+"</span>");
			}
			else{
				box.html("<span>"+msg+"</span>");
			}
		}
		var dp = box.css("display");
		if(dp != "block"){
			box.show();
		}
		clearTimeout(tout);
		tout = setTimeout(function(){
			box.hide();
			box.html("");
		},3000);
	};

	//判断是否已登录
	function getUserInfo(){
		var info = Utils.offLineStore.get("user_info",false) || "";
		var token = Utils.offLineStore.get("token",false) || "";
		var name=Utils.offLineStore.get("name",false) || "";
		var head=Utils.offLineStore.get("head",false) || "";
		if(token !== "" && info !== ""){
			var obj = JSON.parse(info) || {};
			var phone = obj.phone || "";
			//var name = obj.name || "";
			//var head = obj.head || "";
			//保存用户手机号
			Base.phone = phone;
			$('#userNameShow').html(name);
			//$('#loginstatic').show();
			//$('#loginstatic2').hide();
			//if(head != ""){
				$('#loginstatic.user_logo').css({'background':'url("'+Base.serverUrl+'api/image'+head+'") no-repeat center center/100% 100%','background-size':'100%　100%'});
				$('#loginstatic.user_logo img').fadeOut(0);
				$('#usrTouxiang').attr('src',Base.serverUrl+'api/image'+head);
				$('#usrTouxiang').siblings('em').html(name);
			//}
			
			/* console.log(info); */
			//已登录
			/* var html = [];
			html.push('<i class="ico"></i>'+phone+'&nbsp;<a id="loginout_common_btn" class="login">退出</a>');
			$('#loginstatic',parent.document).html(html.join(''));
			$('#loginstatic .ico',parent.document).css({'background':'url("../common/img/'+head+'") no-repeat center center','background-size':'contain'});
			console.log('user');
			 */
			return true;
		}
		else{
			/* var html = [];
			html.push('<a id="login_common_btn" class="login">登录</a><a id="regist_common_btn" class="regist">注册</a>');
			
			$('#loginstatic',parent.document).html(html.join(''));
			console.log('login');
			 */
			$('#userNameShow').html('我');
			$('#loginstatic.user_logo img').fadeIn(0);
			$('#loginstatic.user_logo').css({'background':'none'});
			$('#usrTouxiang').attr('src','../common/img/mine.png');
			$('#usrTouxiang').siblings('em').html('我的');
			return false;
		}
		
	}

	//安全退出
	function loginOut(isanon){
		var token = Utils.offLineStore.get("token",false);
		/* var condi = {};
		condi.login_token = token;
		var url = Base.serverUrl + "api.php/User/logout";
		$.ajax({
			url:url,
			data:condi,
			type:"POST",
			dataType:"json",
			context:this,
			success: function(data){
				console.log("loginout",data);
			},
			error:function(data){
			}
		}); */
		Utils.offLineStore.remove("userinfo",false);
		Utils.offLineStore.remove("token",false);
		Utils.offLineStore.remove("user_info",false);
		Utils.offLineStore.remove("user_phone",false);
		/* var html = [];
		html.push('<a id="login_common_btn" class="login">登录</a><a id="regist_common_btn" class="regist">注册</a>');
		
		$('#loginstatic',parent.document).html(html.join(''));
		console.log('loginOut');
		 */
		
		/* if(!isanon){
			location.href = "login.html";
		} */

		//Utils.offLineStore.remove("login_userprofile",false);
		/*
		var page = location.href.indexOf("/center/");
		if(page > -1){
			location.href = "../index.html";
		}
		else{
			location.href = "index.html";
		}
		*/
	}

	function gotoCenter(){
		var info = offLineStore.get("userinfo",false) || "";
		if(info !== ""){
			var token = Utils.offLineStore.get("token",false) || "";
			var str = "";
			if(token !== ""){
				str = "?token=" + token + "&p=0";
			}
			var page = location.href.indexOf("/center/");
			if(page > -1){
				location.href = "center.html" + str;
			}
			else{
				location.href = "center/center.html" + str;
			}
		}
		else{
			var page = location.href.indexOf("/center/");
			if(page > -1){
				location.href = "login.html";
			}
			else{
				location.href = "center/login.html";
			}
		}
	}

	Utils.offLineStore = offLineStore;
	Utils.secondToDate = secondToDate;
	Utils.getScript = getScript;
	Utils.getQueryString = getQueryString;
	Utils.getQueryStringArr = getQueryStringArr;
	Utils.param = param;
	Utils.getGuid = getGuid;
	Utils.httpTip = httpTip;
	Utils.alert = alert;
	Utils.getPlatform = getPlatform;
	Utils.isMobile = isMobile;
	Utils.getUserInfo = getUserInfo;
	Utils.loginOut = loginOut;
	Utils.gotoCenter = gotoCenter;
}(window));

