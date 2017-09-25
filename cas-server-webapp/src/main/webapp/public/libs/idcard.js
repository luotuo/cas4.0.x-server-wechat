/**
 * <pre>
 * 1.类命名首字母大写
 * 2.公共函数驼峰式命名
 * 3.属性函数驼峰式命名
 * 4.变量/参数驼峰式命名
 * 5.操作符之间必须加空格
 * 6.注释都在行首写
 * 7.后续人员开发保证代码格式一致
 * @file: 身份证号码验证
 * @author: 陈宣宇
 * @date:2012-12-17
 * </pre>
*/

function ValidCard(obj){
	this.txt = obj.txt || "";
	this.init.apply(this,arguments);
}
ValidCard.prototype = {
	powers:["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],
	parityBit:["1","0","X","9","8","7","6","5","4","3","2"],
	sex:"male",
	init:function(){
		
	},
	valid:function(){
		var b = false;
		var card = this.txt;
		if(card == ""){
			return b;
		}
		if(card.length == 15){
			b = this.validId15(card);
		}
		else if(card.length == 18){
			b = this.validId18(card);
		}
		return b;
	},
	//校验18位的身份证号码
	validId18:function(card){
		var num = card.substr(0,17);
		var parityBit = card.substr(17).toUpperCase();
		var power = 0;
		for(var i=0;i< 17;i++){
			//校验每一位的合法性
			if(num.charAt(i) < '0' || num.charAt(i) > '9'){
				return false;
				break;
			}
			else{
				//加权
				power += parseInt(num.charAt(i)) * parseInt(this.powers[i]);
				//设置性别
				if(i == 16 && parseInt(num.charAt(i))%2 == 0){
					sex = "female";
				}
				else{
					sex="male";
				}
			}
		}
		//取模
		var mod = parseInt(power) % 11;
		if(this.parityBit[mod] == parityBit){
			return true;
		}
		return false;
	},
	//校验15位的身份证号码 
	validId15:function(card){
		for(var i = 0; i < card.length; i++){
			//校验每一位的合法性
			if(card.charAt(i) < '0' || card.charAt(i) > '9'){
				return false;
				break;
			}
		}
		var year = card.substr(6,2);
		var month = card.substr(8,2);
		var day = card.substr(10,2);
		var sexBit = card.substr(14);
		//校验年份位
		if(year < '01' || year >'90'){
			return false;
		}
		//校验月份
		if(month < '01' || month > '12'){
			return false;
		}
		//校验日
		if(day < '01' || day > '31'){
			return false;
		}
		//设置性别
		if(sexBit%2 == 0){
			sex="female";
		}
		else{ 
			sex="male";
		}
		return true;
	}
};
