/**
 * file:jquery扩展
 * author:ToT
 * date:2015-05-13
*/

jQuery.fn.extend({
	eachonbind: function( type,fn, scope,date ) {
		return this.each(function(){
			$(this).bind(type,date, $.proxy(fn,scope));
		});
	},
	visible: function() {
	  return this.each(function(){
			$(this).css('visibility', 'visible');
		});
	},
	hidden: function() {
		return this.each(function(){
			$(this).css('visibility', 'hidden');
		});
	},
	onbind: function( type,fn, scope,date ) {
		return  $(this).bind(type,date, $.proxy(fn,scope));
	},
	onclick: function(fn, scope ) {
		return  $(this).click($.proxy(fn,scope));
	}
});
