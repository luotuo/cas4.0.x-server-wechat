/**
 * file:全局变量
 * author:ToT
 * date:2014-08-17
*/

(function(window) {
	if (typeof Base === "undefined") {
		Base = {};
	}
	//正式URL端口号为21290,测试URL端口号为8008
	var urlPort = 21290;
	//蒙版效果等待时间
	var maskTimeOut = 1000;
	//跳转延迟
	var eventDelay = 100;
	//用户名
	var userName = "";
	//用户手机号
	var phoneNumber = "";

	//请求服务地址
	var serverUrl = "http://118.190.132.68:83/budget/";
    // var serverUrl = "http://localhost/budget/";
	var imgUrl = "/api/public/api/image";
	var imgUrl2 = "/api/public/api/image2";
	
	
	Base.http = 'http://127.0.0.1/';
	Base.userName = userName;
	Base.phoneNumber = phoneNumber;
	Base.urlPort = urlPort;
	Base.maskTimeOut = maskTimeOut;
	Base.serverUrl = serverUrl;
	Base.imgUrl = imgUrl;
	Base.imgUrl2 = imgUrl2;
}(window));












