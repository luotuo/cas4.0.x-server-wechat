/**
 * file:zepto扩展
 * author:ToT
 * date:2015-05-13
*/

if(typeof(Zepto) != "undefined"){
	(function($) {
		//方法用途：需要一次绑定事件的时候用此方法
		$.fn.onbind = function(type,fn,scope,data) {
			var browser = {"tap":"click","touchstart":"mousedown","touchmove":"mousemove","touchend":"mouseup","doubleTap":"dblclick","longTap":"dblclick"};
			var agent = navigator.userAgent.toLowerCase();
			var i = agent.indexOf("android");
			var j = agent.indexOf("iphone");
			var evt = type;
			if(i == -1 && j == -1){
				evt = browser[type];
			}
			if(evt == undefined){
				evt = type;
			}
			return $(this).bind(evt,
				function(){
					return function(fn,scope,data){
						fn.apply(scope,[event,data]);
					}(fn,scope,data);
				}
			);
		};
		//方法用途：需要多次绑定的时候用此方法，比如动态加载。
		//写这个方法的原因：因为有很多情况下需要重复绑定，所以在绑定之前需要先解除绑定，为了方便，也为了避免忘记解除绑定，所以写了rebind方法。
		//使用方法：在需要多次绑定的事件的时候直接使用rebind，不需要unbind和onbind。
		//方法用例：$(this.reBind).rebind("touchstart",this.rebindDown,this);
		//		  $(this.reBind).rebind("touchend",this.rebindUp1,this);
		//	 	  $(this.reBind).rebind("touchend",this.rebindUp2,this);
		//方法缺陷：在用例中，此方法会解除掉本 DOM 结构（this.reBind）下所有的同类型事件（touchend）。
		//		  也就是rebindUp1的touchend会被rebindUp2的rebind方法解除掉，从而rebindUp1不能执行。
		$.fn.rebind = function(type,fn,scope,data) {
			var browser = {"tap":"click","touchstart":"mousedown","touchmove":"mousemove","touchend":"mouseup","doubleTap":"dblclick","longTap":"dblclick"};
			var agent = navigator.userAgent.toLowerCase();
			var i = agent.indexOf("android");
			var j = agent.indexOf("iphone");
			var evt = type;
			if(i == -1 && j == -1){
				evt = browser[type];
			}
			if(evt == undefined){
				evt = type;
			}
			//解除绑定
			$(this).unbind(evt);
			return $(this).bind(evt,
				function(){
					return function(fn,scope,data){
						fn.apply(scope,[event,data]);
					}(fn,scope,data);
				}
			);
		};

		$.Ajax = function(option){
			if(typeof option === "object" && option != null){
				var dataType = option.dataType || "json";
				if(dataType === "jsonp"){
					//jsonp请求
					var url = option.url || "";
					if(url !== ""){
						option.url = url + "?callback=?&timer=" + new Date().getTime();
						$.ajax(option);
					}
					else{
						return false;
					}
				}
				else{
					//调用zepto-ajax请求
					$.ajax(option);
				}
			}
			else{
				return false;
			}

			/*
			//拼接jsonp请求参数
			function jsonpCondi(data) {
				var strs = ["?"];
				if (data) {
					for (var key in data) {
						strs.push(key + "=" + data[key] + "&");
					}
				}
				var timer = "callback=?&timer=" + new Date().getTime();
				strs.push(timer);
				return strs.join("");
			}
			*/
		};

	})(Zepto);
}

