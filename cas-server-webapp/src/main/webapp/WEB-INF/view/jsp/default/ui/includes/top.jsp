
<!DOCTYPE html>

<%@ page pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta content="IE=Edge,chrome=1" http-equiv="X-UA-Compatible">
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
	<meta content="yes" name="apple-mobile-web-app-capable">
	<meta content="black" name="apple-mobile-web-app-status-bar-style">
	<meta name="format-detection" content="telephone=no"/>
	<link rel="stylesheet" href="/cas-server/public/audit/common.css" />
	<title>管理系统</title>
	<style>
		body{position:relative;}
		.login_div1{height:60%;position:relative;min-height:400px;background:url('/cas-server/public/img/2.jpg') no-repeat center center;background-size:cover;}
		.login_div1 .ld1_img1{width:30%;max-width:100%;position:absolute;left:35%;margin-left:-200px;bottom:13%;}
		.login_box{z-index:999;top:45%;margin-top:-165px;width:280px;height:400px;padding:0 20px;background-color:#fff;position:absolute;margin-right:-140px;right:30%;box-shadow: 0 0 11px 0 rgba(0,0,0,0.18);}
		.login_box .lb_title{text-align:center;margin-bottom:30px;padding:30px 0 25px;border-bottom: 1px solid #DDDDDD;font-size:18px;color: #000000;}
		.login_box .lb_input{border-radius:2px;background-color:#F4F4F4;padding-left:5%;width:94%;display:block;margin:0 auto 20px;border:1px solid #DDDDDD;font-size: 14px;color: #000000;height:42px;line-height:42px;}
		.login_box .login_btn{text-decoration:none;transition:all .25s ease-in-out;text-align:center;background-color:#2D8CF0;width:100%;display:block;margin:30px auto 0px;font-size: 18px;color: #ffffff;height:42px;line-height:42px;border:none;border-radius: 4px;}
		.login_box .login_btn_wechat{text-decoration:none;transition:all .25s ease-in-out;text-align:center;width:100%;display:block;margin:30px auto 0px;font-size: 18px;color: #19BE6B;height:42px;line-height:42px;border:1px solid #19BE6B;border-radius: 4px;}
		.login_box .login_btn:hover{background-color:#1372d6;border:none;border-radius: 4px;}
		.login_box .login_btn_wechat:hover{border:1px solid #19BE6B;border-radius: 4px;}
		.indexFooter{position:absolute;bottom:0;left:0;right:0;background-color:#ffffff;padding:75px 0 10px;}
		.indexFooter .nf_content{width:800px;margin:0 auto;}
		.indexFooter .ove{overflow:hidden;}
		.indexFooter .nf_content .nf_top{overflow:hidden;margin:37px 0 6px;font-size:16px;color:#333333;width:470px;}
		.indexFooter .nf_content .nf_img1{margin-top:0px;margin-right:0px;display:inline-block;vertical-align:bottom;}
		.indexFooter .nf_content .nf_mess{line-height:20px;margin-bottom:6px;font-size:12px;color:#333333;}
		.indexFooter .nf_content .mar{margin-top:30px;padding-left:118px;display:block;color:#333333;font-size:12px;}
		.indexFooter .nf_erweima{vertical-align:top;margin-right:20px;font-size:14px;color:#333333;display:inline-block;float:left;text-align:center;}
		.indexFooter .nf_right{padding-right:57px;vertical-align:top;display:inline-block;float:left;}
		.indexFooter .inlineRight{vertical-align:top;display:inline-block;float:left;}

	</style>
</head>
<body class="body_bg">
<div class="login_div1">
	<%--<img class="ld1_img1" src="/cas-server/public/audit/lico.png" />--%>
</div>