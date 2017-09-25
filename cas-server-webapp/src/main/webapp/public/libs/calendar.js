"use strict";
var _show_calendar = "";
(function(){

/* eui 命名空间  */
var _eui = window.eui;
var eui = window.eui = {};

eui.noConflict = function () {
    window.eui = _eui;
};

eui.addHandler = function (elem, type, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, handler);
    } else {
        elem['on' + type] = handler;
    }
};

// 卸载监听器
eui.removeHandler = function (elem, type, handler) {
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, handler);
    } else {
        elem['on' + type] = null;
    }
};

eui.getEvent = function (e) {
    return e ? e : window.event;
};


eui.getTarget = function (e) {
    return e.target || e.srcElement;
};

eui.getElemLeft = function (element) {
    var currentLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current) {
        currentLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return currentLeft;
};


eui.getElemTop = function (element) {
    var currentTop = element.offsetTop;
    var current = element.offsetParent;

    while (current) {
        currentTop += current.offsetTop;
        current = current.offsetParent;
    }

    return currentTop;
};

eui.isContent = function(elem, content){
    while(elem){
        if(elem === content) {
            return true;
        }
        elem = elem.parentNode;
    }
    return false;
};

})();


(function () {

// 判断y年是不是闰年
function _isLeapYear(y){
    return (y > 0) && !(y % 4) && ((y % 100) || !(y % 400));
}

// 判断当前月份从星期几开始
function _getDayofWeek(y, m, daynum) {
    var days = 1;
    for (var i = 1, len = m; i < len; i++) {
        days += daynum[i - 1];
    }

    var w = (y - 1) + Math.floor((y - 1) / 4) - Math.floor((y - 1) / 100) +
                Math.floor((y - 1) / 400) + days;
    w = w % 7;
    return w;
}

// class Calendar
// 日历数据仓库
var Calendar = {};

// 初始化，设定当前年、月、日期
Calendar.initialize = function(o){
    var currentYear = o.currentYear,
        currentMonth = o.currentMonth;

    this.change(currentYear, currentMonth);
};

// 更新日历数据库的数据
// 需要提供年、月
Calendar.change = function (year, month) {
    this.currentYear = year;
    this.currentMonth = month;
    this.daynums = [31, _isLeapYear(year) ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var currentDaynum = this.daynums[month - 1];
    this.currentDays = [];
    for (var i = 0; i < currentDaynum; i++) {
        this.currentDays.push(i + 1);
    }
};

// 获取当前月从星期几开始
Calendar.getWeekday = function(){
    var currentYear = this.currentYear,
        currentMonth = this.currentMonth,
        currentDaynums = this.daynums;

    return _getDayofWeek(currentYear, currentMonth, currentDaynums);
};

// 获取当前年
Calendar.getCurrentYear = function(){
    return this.currentYear;
};

// 获取当前月
Calendar.getCurrentMonth = function(){
    return this.currentMonth;
};

// 获取当前日期
Calendar.getCurrentDays = function(){
    return this.currentDays;
};


// class CalendarWidget
// 日历控件的UI
var CalendarWidget = {};

CalendarWidget.initialize = function (o) {
    var self = this;

    // 提取配置参数
    var now = new Date();
    var currentYear = parseInt(o.currentYear || now.getFullYear()),
        currentMonth = parseInt(o.currentMonth || now.getMonth() + 1),
        startYear = parseInt(o.startYear || 1900),
        endYear = parseInt(o.endYear || now.getFullYear()),
        input = o.input;

this.id = o.id;
    this.input = input;

    // 日历控件容器
    var content = document.createElement('div');
    content.className = 'eui-calendar';

    // 设置年、月选择UI
    var selectContent = document.createElement('ul'),
        yearHTML = '',
        monthHTML = '';

    yearHTML += '<li><select data-calendar="year">';
    for (var j = startYear; j <= endYear; j++) {
        yearHTML += '<option value="' + j + '">' + j + '年</option>';
    }
    yearHTML += '</select></li>';

    monthHTML += '<li><select data-calendar="month">';
    for (var i = 1, MONTHS_LENGTH = 12; i <= MONTHS_LENGTH; i++) {
        monthHTML += '<option value="' + i + '">' + i + '月</option>';
    }
    monthHTML += '</select></li>';

    selectContent.innerHTML = yearHTML + monthHTML;
    selectContent.className = 'eui-calendar-selectcontent';

    var yearSelect = selectContent.getElementsByTagName('select')[0],
        monthSelect = selectContent.getElementsByTagName('select')[1];

    yearSelect.selectedIndex = currentYear - startYear;
    monthSelect.selectedIndex = currentMonth - 1;

    // 星期UI
    var weekContent = document.createElement('ul'),
        weeks = ['日', '一', '二', '三', '四', '五', '六'],
        weekHTML = '';

    for (var m = 0, len = weeks.length; m < len; m++) {
        weekHTML += '<li class="eui-calendar-weekday">' + weeks[m] + '</li>';
    }

    weekContent.innerHTML = weekHTML;
    weekContent.className = 'eui-calendar-week';

    // 初始化日历数据仓库，并建立日期UI
    this.calendar = Calendar;
    this.calendar.initialize({
        currentYear: currentYear,
        currentMonth: currentMonth
    });

    this.dateContent = document.createElement('ul');
    this.dateContent.className = 'eui-calendar-datecontent';

    this.resetDateContent();

    // 添加控件到HTML文档
    content.appendChild(selectContent);
    content.appendChild(weekContent);
    content.appendChild(this.dateContent);
    document.body.appendChild(content);

    _setPosition(content, input);

    function onchange(e) {
        self.change(yearSelect.value, monthSelect.value);
    }

    function onputdate(e) {
        e = eui.getEvent(e);

        var target = eui.getTarget(e),
            data = target.getAttribute('data-calendar');

        if (data === 'day') {
            var date = self.getDate(target.innerHTML);
            var  m = date.month - 0;
            m = m > 9 ? m : ("0" + m);
            var d = date.date - 0;
            d = d > 9 ? d : ("0" + d);
            document.getElementById(_show_calendar).value = date.year + '-' + m + '-' + d;
           //input.value = date.year + '-' + m + '-' + d;
            _hide(content);
        }

        if (!eui.isContent(target, content) && target !== input) {
            _hide(content);
        }
    }

    function onshow(evt) {
	 _show_calendar = evt.currentTarget.id;
        _show(content);
    }
    eui.addHandler(yearSelect, 'change', onchange);
    eui.addHandler(monthSelect, 'change', onchange);
    eui.addHandler(document, 'click', onputdate);
    eui.addHandler(input, 'focus', onshow);
};

// 设置日期控件
CalendarWidget.resetDateContent = function () {
    var now = new Date(),
        todayYear = now.getFullYear(),
        todayMonth = now.getMonth() + 1,
        todayDate = now.getDate(),
        currentYear = this.calendar.getCurrentYear(),
        currentMonth = this.calendar.getCurrentMonth();

    var currentDays = this.calendar.getCurrentDays(),
        weekdays = this.calendar.getWeekday(),
        dateHTML = '';

    for (var i = 0; i < weekdays; i++) {
        dateHTML += '<li class="eui-calendar-lastmonthdate"></li>'
    }

    for (var n = 0, daysLength = currentDays.length; n < daysLength; n++) {
        if (todayYear == currentYear && todayMonth == currentMonth
                && todayDate == n + 1) {
            dateHTML += '<li class="eui-calendar-date eui-calendar-today" data-calendar="day">' +
                    currentDays[n] + '</li>';
        } else {
            dateHTML += '<li class="eui-calendar-date" data-calendar="day">' +
                    currentDays[n] + '</li>';
        }
    }

    this.dateContent.innerHTML = dateHTML;
};

CalendarWidget.change = function (year, month) {
    this.calendar.change(parseInt(year), parseInt(month));
    this.resetDateContent();
};

CalendarWidget.getDate = function (date) {
    return {
        year:this.calendar.getCurrentYear(),
        month:this.calendar.getCurrentMonth(),
        date:date
    };
};

function _setPosition(elem, input){
    var left = eui.getElemLeft(input),
        top = eui.getElemTop(input),
        height = input.offsetHeight;

    elem.style.left = left + 'px';
    elem.style.top = top + height + 5 + 'px';
}

function _show (elem) {
    elem.style.display = 'block';
};

function _hide (elem) {
    elem.style.display = 'none';
};


eui.calendar = function (o) {
    var calendarWidget = CalendarWidget;
    calendarWidget.initialize(o);
};

})();


(function () {
	/*
    eui.addHandler(window, 'load', function () {
        eui.calendar({
            startYear: 1900,
            input: document.getElementById('birthday')
        });
         eui.calendar({
            startYear: 1900,
            input: document.getElementById('birthday2')
        });
    });
    */
})();