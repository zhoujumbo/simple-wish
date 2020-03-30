;(function($,window) {
    /**工具方法扩展***/
    /**
     * 时间对象的格式化;
     */
    Date.prototype.format = function(format) { //给日期添加format原型
      /*
       * 使用例子:format="yyyy-MM-dd hh:mm:ss";
       */
      var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
          // millisecond
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    };
    /**
     *  替换字符串中指定内容
     *  s1 被替换字符串
     *  s2 替换字符串
     */
    String.prototype.replaceAll=function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    };
    /**
     *  替换的指定标签中的内容
     *  destSource 替换字符串
     *  tag 指定替换的标签
     *  例如："ab<u>123</u>dd".replaceBlank("&nbps","u") 结果：ab<u>&nbps&nbps&nbps</u>dd
     */
    String.prototype.replaceBlank=function(destSource,tag){
        var regex=new RegExp("\<"+tag+"\>(.*?)\<\/"+tag+"\>","g");
        return this.replace(regex,function(s1,s2){
            var destBlankStr="";
            var len=RegExp.$1.length;
            while(len>0){
                len--;
                destBlankStr+=destSource;
            }
            return s1.replace(s2,destBlankStr);
        });
    };
    /**
     * 获取字符串的长度
     * @param font
     */
    String.prototype.strWidth = function(font) {
      var f = font || '12px arial',
        o = $('<div>' + this + '</div>')
        .css({
          'position': 'absolute',
          'float': 'left',
          'white-space': 'nowrap',
          'visibility': 'hidden',
          'font': f
        }).appendTo($('body')),
        w = o.width();

      o.remove();
      return w;
    };
    /**
     *  数据绑定工具  用对应数据替换匹配到某一格式的参数
     *  data 替换字符串
     *  pattern 范型 支持 {{}}  @() ${} </>形式
     *  例如：   var a = 'ASJ{{aaa}}K{{eee}}H@(bbb)AJK${ccc}S<a/>FA<ddd/>';
     *          a = a.replace2Data({ aaa: '111', bbb: '222',ccc:'333',ddd:'<input/>'},'{{}}');
     *          a = a.replace2Data({ aaa: '111', bbb: '222',ccc:'333',ddd:'<input/>'},'@()');
     *          a = a.replace2Data({ aaa: '111', bbb: '222',ccc:'333',ddd:'<input/>'},'${}');
     *          a = a.replace2Data({ aaa: '111', bbb: '222',ccc:'333',ddd:'<input/>'},'</>');
     *          alert(a)
     */
    String.prototype.replace2Data=function(data,pattern,callBack){
        var regex = '';
        if(pattern === '\{\{\}\}'){
            regex = /\{\{(\w+)\}\}/g;
        }else
        if(pattern === '\@\(\)'){
            regex = /\@\((\w+)\)/g;
        }else
        if(pattern === '\$\{\}'){
            regex = /\$\{(\w+)\}/g;
        }else
        if(pattern === '\<\/\>'){
            regex = /\<(\w+)\/\>/g;
        }
        else{return;};
        return this.replace(regex,function(match, key){
            //console.log(match+'   '+key +'  '+data[key]);
            if(!callBack){
                if(pattern === '\<\/\>'){
                    return (typeof data[key] === "undefined" || !data[key]) ? match : data[key];
                }else{
                    return (typeof data[key] === "undefined" || !data[key]) ? '' : data[key];
                }
            }
            return callBack(match, key, data[key],data);
        });
    };

    $.prototype.serializeObject = function () {
        var obj=new Object();
        $.each(this.serializeArray(),function(index,param){
            if(!(param.name in obj)){
                if(param.name.indexOf(".") === -1){
                    obj[param.name]=param.value;
                }else{
                    var o = (param.name+'').split('.');
                    if(typeof o[0] != 'undefined' && typeof o[1] != 'undefined'){
                        if(typeof obj[o[0]] === 'undefined'){
                            obj[o[0]] = new Object();
                            obj[o[0]][o[1]] = param.value;
                        }else{
                            obj[o[0]][o[1]] = param.value;
                        }
                    }
                }
            }
        });
        return obj;

        // var a,o,h,i,e;
        // a = this.serializeArray();
        // o={};
        // h=o.hasOwnProperty;
        // for(i=0;i<a.length;i++){
        //     e=a[i];
        //     if(!h.call(o,e.name)){
        //         o[e.name]=e.value;
        //     }
        // }
        // return o;
    };

    /***
     * $.extend
     * Description：jquery扩展对象
     */
    $.extend({

      /*************************************************************************************
       * Title: parseTime
       * Description：将Date对象的时间格式进行转化
       **************************************************************************************/
      'parseTime': function(time, cFormat) {
        if (arguments.length === 0) {
          return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
          date = time
        } else {
          if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          }
          if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
          }
          date = new Date(time)
        }
        const formatObj = {
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
          h: date.getHours(),
          i: date.getMinutes(),
          s: date.getSeconds(),
          a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
          let value = formatObj[key]
          // Note: getDay() returns 0 on Sunday
          if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
          if (result.length > 0 && value < 10) {
            value = '0' + value
          }
          return value || 0
        })
        return time_str
      },

      /*************************************************************************************
       * Title: baseUrl
       * Description：将数组中的对象按属性转为对象
       **************************************************************************************/
      'arrayProSplit': function(arr) {
        var obj = {}
        for (var i = 0; i < arr.length; i++) {
          for (key in arr[i]) {
            if (obj[key]) {
              obj[key].push(arr[i][key])
            } else {
              obj[key] = []
              obj[key].push(arr[i][key])
            }

          }
        }
        return obj;
      },
      /*************************************************************************************
       * Title: baseUrl
       * Description：获取网页当前url的基础部分
       **************************************************************************************/
      'baseUrl': function() {
        return _urlCommon;
      },

      /*************************************************************************************
       *Title: getQueryStr
       *Description: 获取url传参中某个参数的值
       **************************************************************************************/
      'getQueryStr': function(str) {
        var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)");
        var r = decodeURIComponent(window.location.search).substr(1).match(reg);
        return r != null ? unescape(r[2]) : null;
      },

      /*************************************************************************************
       *Title: getIndex
       *Description: 获取一个字符串 str 中 第 len 个字符 char 的位置
       **************************************************************************************/
      'getIndex': function(str, char, len) {
        var index = 0;
        for (var i = 0; i < len; i++) {
          index = str.indexOf(char, index + 1);
        }
        return index;
      },

      /*************************************************************************************
       * Title: myBrowser
       * Description: 获取浏览器类型并返回
       * Return： String ：Opera、FF、Chrome、Safari、iPad、iPhone、Android、IE
       **************************************************************************************/
      'myBrowser':function () {
          if (!!window.ActiveXObject || "ActiveXObject" in window){
              return "IE";
          }else {
              var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
              if (userAgent.indexOf("Opera") > -1) { //判断是否Opera浏览器
                  return "Opera"
              };
              if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
                  return "FF";
              };
              if (userAgent.indexOf("Chrome") > -1) { //google
                  return "Chrome";
              };
              if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
                  return "Safari";
              };
              if (userAgent.indexOf("iPad") > -1) { //iPad
                  return "iPad";
              };
              if (userAgent.indexOf("iPhone") > -1) { //iPhone
                  return "iPhone";
              };
              if (userAgent.indexOf("Android") > -1) { //Android
                  return "Android";
              };
              if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
                  return "IE";
              };
          }
      },

      /*************************************************************************************
       * Title: amountFormCheck
       * Description: 判断是否符合金额格式  （ps：最多两位小数）
       * Return： boolean
       **************************************************************************************/
      'amountFormCheck':function (str) {
          if($.trim(str) == ''){
              return false;
          }
          if(str.length!=0){
              var reg=/(^[0]+(\.\d{1,2})?$)|(^[1-9]{1}(\.\d{1,2})?$)|(^([1-9]\d{1}){1}(\.\d{1,2})?$)|(^100{1}(\.[0]{1,2})?$)/;
              if(!reg.test(str)){
                  $(this).val(0);
                  return false;
              }else{
                  if(str.indexOf('.') == -1){
                      str+='.00';
                  }
                  $(this).val(parseFloat(str).toFixed(2));
                  return true;
              }
          }else{
              return false;
          }
      },

      /*************************************************************************************
       * Title: positiveIntFromCheck
       * Description: 正整数（或  非零开头的数字）
       * Return： boolean
       **************************************************************************************/
      'positiveIntFromCheck':function (str) {
          if(!str || $.trim(str) == '' || str.length==0){
              return false;
          }
          var reg=/(^([1-9][0-9]*)$)/;
          if(reg.test(str)){
              return true;
          }
          return false;
      },
      /*************************************************************************************
       * Title: replaceNull
       * Description: 格式化值为undefined、null的参数
       * Return： ‘’
       **************************************************************************************/
      'replaceNull':function (data) {
          if(typeof (data) == 'undefined' || data==null || data=='null'){
              return '';
          }else{
              return data;
          }
      },
      /**************************************************
       *Title: headRemove
       *Description: 删除head里面是否引用某js文件或者css文件
       *author: zhoujumbo
       *date: 2018/10/03
       ***************************************************/
      'headRemove':function (name) {
          var js = /js$/i.test(name);
          var es = document.getElementsByTagName(js?'script':'link');
          for(var i=0;i < es.length;i++){
              if(es[i][js?'src':'href'].indexOf(name) != -1){
                  es[i].remove();
              }
          }
          return false;
      },
      /**************************************************
       *Title: isHeadInclude
       *Description: 判断head里面是否引用某js文件或者css文件
       *author: zhoujumbo
       *date: 2018/10/03
       ***************************************************/
      'isHeadInclude':function (name) {
          var js = /js$/i.test(name);
          var es = document.getElementsByTagName(js?'script':'link');
          for(var i=0;i < es.length;i++){
              if(es[i][js?'src':'href'].indexOf(name) != -1){
                  return true;
              }
          }
          return false;
      },
      /*************************************************************************************
       *Title: randomString
       *Description: 随机生成字符串
       *@params {int}  生成字符串位数，不传默认16
       *author:zhoujumbo
       *date: 2017/08/26
       **************************************************************************************/
      'randomString':function(len){
          len = len || 16;
          var $chars ='ABCDEFGHJKMNPQRSTWXYZabcdefghijkmnprstwxyz2345678';
          var maxPos = $chars.length;
          var pwd = "";
          for(var i =0;i<len;i++){
              pwd += $chars.charAt(Math.floor(Math.random()*maxPos));
          }
          return pwd;
      },
      /*************************************************************************************
       *Title:mouseCoords
       *Description: 鼠标当前坐标
       *author: zhoujumbo
       *date: 2016/12/23
       **************************************************************************************/
      'mouseCoords': function(ev) {
          if (ev.pageX || ev.pageY) {
              return { x: ev.pageX, y: ev.pageY };
          }
          return {
              x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
              y: ev.clientY + document.body.scrollTop - document.body.clientTop
          };
      },
      /*************************************************************************************
       * @Title: loadjscssfile
       * @Description: 加载js css 文件
       * @Param {string} filename:filename/url  filetype: js/css
       * @Author: zhoujumbo
       * @Date: 2018/12/06
       **************************************************************************************/
      'loadJsCssFile': function (filename,filetype,callBack){
          try{
              if(filetype == "js"){
                  var fileref = document.createElement('script');
                  fileref.setAttribute("type","text/javascript");
                  fileref.setAttribute("src",filename);
                  if(typeof fileref != "undefined"){
                      document.getElementsByTagName("body")[0].append(fileref);
                  }
              }else if(filetype == "css"){

                  var fileref = document.createElement('link');
                  fileref.setAttribute("rel","stylesheet");
                  fileref.setAttribute("type","text/css");
                  fileref.setAttribute("href",filename);
                  if(typeof fileref != "undefined"){
                      document.getElementsByTagName("head")[0].append(fileref);
                  }
              }
              callBack && callBack();
          }catch(error){
              console.error("加载文件:"+filename,"错误，类型："+filetype,error);
          }
      },
      /*************************************************************************************
       * @Title:loadStyleString
       * @Description: 动态加载css脚本
       * @param {string} cssText css样式
       * @author: zhoujumbo
       * @date: 2018/12/06
       * @demo: var css = "body{color:blue;}"; loadStyleString(css);
       **************************************************************************************/
      'loadStyleString': function (cssText) {
          var style = document.createElement("style");
          style.type = "text/css";
          try{
              // firefox、safari、chrome和Opera
              style.append(document.createTextNode(cssText));
          }catch(ex) {
              // IE早期的浏览器 ,需要使用style元素的stylesheet属性的cssText属性
              style.styleSheet.cssText = cssText;
          }
          document.getElementsByTagName("head")[0].append(style);
      },
      /*************************************************************************************
       * @Title:loadScriptString
       * @Description: 动态加载js脚本
       * @param {string} code js脚本
       * @author: zhoujumbo
       * @date: 2018/12/06
       * @demo: var text = "function test(){alert('test');}"; loadScriptString(text); test();
       **************************************************************************************/
      'loadScriptString': function (code) {
          var script = document.createElement("script");
          script.type = "text/javascript";
          try{
              // firefox、safari、chrome和Opera
              script.append(document.createTextNode(code));
          }catch(ex) {
              // IE早期的浏览器 ,需要使用script的text属性来指定javascript代码。
              script.text = code;
          }
          document.getElementsByTagName("body")[0].append(script);
      },
      /*************************************************************************************
       * @Title: queryString
       * @Description: 对象转URL query参数
       * @param {object}参数对象
       * @author: zhoujumbo
       * @date: 2018/12/06
       * @demo: $.queryString('http://192.168.1.32:3638/checkout',{abc:123})
       **************************************************************************************/
      'obj2UrlQueryString': function (url, query) {
          var str = [];
          for (var key in query) {
              str.push(key + '=' + query[key]);
          }
          var paramStr = str.join('&');
          return paramStr ? url+'?'+paramStr: url;
      },
      /*************************************************************************************
       * @Title: funcRetry
       * @Description: 对某个方法添加异常重试功能
       * @param func 需要监听的方法
       * @param timeout 重试间隔时间
       * @param times 重试次数
       * @author: zhoujumbo
       * @date: 2018/12/06
       * @demo: $.funcRetry(function，500，5)
       **************************************************************************************/
      'funcRetry': function (func, timeout, times) {
          if(!func){return;}
          var _timeout = !timeout?500:timeout;
          var _times = !times?5:times;
          var listenerName = func.name+'retry';
          if(!window[listenerName]){
              window[listenerName] = 0;
          }
          try{
              func();
              window[listenerName] = null;
          }catch(Exp){
              window[listenerName]++;
              console.warn(listenerName+'>'+window[listenerName]+Exp);
              if(window[listenerName]<_times){
                  setTimeout(function(){
                      $.funcRetry(func, timeout, times);
                    //arguments.callee(func, timeout, times);
                  },_timeout);
              }else{return;}
          }
      },
      /**
       * 判断结果是否为空
       * @param val
       * @returns {boolean} true 不为空
       */
      'isNoEmpty3': function(val){
          var reg = /\s+/g//正则表达式用于判斷是否有空格或空字符串 !reg.test(val)
          return (typeof val != 'undefined' && val != null && val!="");
      },

      /**
       * 字符串判空 “” null  undefined
       * @return {Object}
       */
      'izNotEmpty' : function(val){
          var reg = /\s+/g;  //正则表达式用于判斷是否有空格或空字符串 !reg.test(val)
          if(val == '0'){
              return true;
          }
          return (typeof val != 'undefined' && val != null && val!="");
      },
      /**
       * 随机生成uuid
       *
       * @param len
       * @returns {string}
       */
      'uuid' : function(len, radix){
          var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
          var uuid = [], i;
          radix = radix || chars.length;

          if (len) {
              // Compact form
              for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
          } else {
              // rfc4122, version 4 form
              var r;

              // rfc4122 requires these characters
              uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
              uuid[14] = '4';

              // Fill in random data. At i==19 set the high bits of clock sequence as
              // per rfc4122, sec. 4.1.5
              for (i = 0; i < 36; i++) {
                  if (!uuid[i]) {
                      r = 0 | Math.random()*16;
                      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                  }
              }
          }

          return uuid.join('');
      },
      /***********
       * js 动态向样式规则表汇总添加样式
       * addCSSRule(document.styleSheets[0], "header", "float: left");
       * **************************/
      'addCSSRule' : function (sheet, selector, rules, index) {
        if("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    },
      /***********
       * 复制内容到粘贴板
       *
       * **************************/
      'copyToClipboard': function($selector) {
          if(typeof $selector == 'undefined' || $selector==''){
              return '';
          }
        var elem = $selector;
        var targetId = "_hiddenCopyText_";
        var isInput = elem[0].tagName === "INPUT" || elem[0].tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // 复制选择内容
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // 必须有一个临时的元素存储复制的内容
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.text();
        }
        // 选择内容
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        // 复制内容
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }
        // 恢复焦点
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        if (isInput) {
            // 恢复之前的选择
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // 清除临时内容
            target.textContent = "";
        }
        // console.log("复制成功");
        return succeed;
    },
  });


  $.fn.extend({


  });


})(jQuery,window);

var _urlCommon = window.location.href;
_urlCommon = _urlCommon.substring(0, $.getIndex(_urlCommon, '/', 4) + 1);

/*************************************************************************************
 *Title:  getIndex
 *Description:  获取一个字符串 str 中 第 len 个字符 char 的位置
 *params:
 *methods:
 *fixed:
 *change: 新增String类型的getIndex(char,len)原型方法，即可以直接 'hello word'.getIndex('o',1)这样来调用
 *date: 2016/11/3
 **************************************************************************************/
;(function($){
    $.getIndex = function(str, char, len){
        var index = 0;
        for (var i = 0; i < len; i++) {
            index = str.indexOf(char, index + 1);
        }
        return index;
    };
    String.prototype.getIndex = function( char, len){
        var index = 0;
        for (var i = 0; i < len; i++) {
            index = this.indexOf(char, index + 1);
        }
        return index;
    };
})(jQuery);


;(function ($) {
    /*************************************************************************************
     *Title: $.getDateFromString  日期工具
     *Description: 将字符串日期转换为Date类型
     *params:{string} strDate 字符串日期
     *author: zhoujumbo
     *date: 2018/12/06
     **************************************************************************************/
    $.getDateFromString = function (strDate){
        strDate = strDate.replace(" ", "-").replace(new RegExp(":","g"), "-");
        var arrYmd = strDate.split("-");
        for(var i=0;i<arrYmd.length;i++){
            if(arrYmd[i].length>1 && arrYmd[i].indexOf("0")==0)
                arrYmd[i]= arrYmd[i].substring(1);
        }
        var numYear = parseInt(arrYmd[0]);
        var numMonth = parseInt(arrYmd[1]) - 1;
        var numDay = parseInt(arrYmd[2]);
        if(arrYmd.length > 3){
            var numHours,numMinutes,numSeconds;
            numHours = parseInt(arrYmd[3])
            numMinutes = parseInt(arrYmd[4])
            numSeconds = parseInt(arrYmd[5])
            return new Date(numYear, numMonth, numDay, numHours, numMinutes, numSeconds);
        }
        return new Date(numYear, numMonth, numDay);
    };
    /*************************************************************************************
     *Title: $.getTwoDaysDiff
     *Description: 计算时间差
     *params: {string} beginDay 开始日期 endDay 结束日期  levle 精确度（参数只允许：D、H、M、S）相差的天 小时 分钟 秒
     *author: zhoujumbo
     *date: 2018/8/22
     *PS：
     **************************************************************************************/
    $.getTwoDaysDiff = function(beginDay,endDay,levle){
        if(!beginDay || !endDay || !levle || levle.length>1 || 'DHMS'.indexOf(levle)==-1){
            return -999999;
        }
        var oDate1, oDate2, iDays;
        var S_TIMES = {
            'D':24*3600000,
            'H':60*60*1000,
            'M':60*1000,
            'S':1000
        }
        oDate1 = $.getDateFromString(beginDay);
        oDate2 = $.getDateFromString(endDay);
        //把相差的毫秒数转换为天数
        iDays = parseInt((oDate2 - oDate1)/S_TIMES[levle]);
        return iDays;
    };


})(jQuery);

/*************************************************************************************
 *Title: tooltip  cTooltip
 *Description: 鼠标移入提示框
 *params:zIndex:设置z-index值，isLeft：是否左边显示
 *author: zhoujumbo
 *date: 2018/8/22
 *PS：
 * 依赖： $自定义方法 $.addCSSRule
 * 使用： $selector.tooltip({title: '文本'});
 **************************************************************************************/
;(function($){
    'use strict';
    var Tooltip = function(el,opts){
        this.element = el;
        this.sTitle = '';
        this.opts = opts?opts:{};
        this.oTooltip;
        this.bShow=false;

    };
    Tooltip.prototype.init = function(){
        var _this = this,
            _el = this.element,
            _opt = this.opts;

        if(_el.prop('title')){
            _this.sTitle = _el.prop('title');
            _el.prop('title', '');
        }
        if(_opt.title){
            _this.sTitle = _opt.title;
        }
        _el.off('mouseover.zh.tooltip mouseout.zh.tooltip mousemove.zh.tooltip');
        _el.on({
            'mouseover.zh.tooltip': function(e) {
                var iTop = e.pageY + 20;
                var iLeft = e.pageX + 20;

                if(!_this.oTooltip){
                    _this.oTooltip = $('<div class="zh_tooltip" ><div></div></div>').appendTo('body');
                }
                if(_opt.zIndex){
                    _this.oTooltip.css("z-index", _opt.zIndex);
                }
                _this.oTooltip.children().empty().html(_this.sTitle);
                _this.oTooltip.show();
                if (_this.oTooltip.outerWidth() + iLeft >= $('body').width()) {
                    iLeft = $('body').width() - _this.oTooltip.outerWidth() - 50;
                }
                if (_this.oTooltip.outerHeight() + iTop >= $('body').height()) {
                    iTop = $('body').height() - _this.oTooltip.outerHeight() - 50;
                }
                _this.oTooltip.hide();
                _this.bShow = true;
                _this.oTooltip.siblings('.zh_tooltip').slideUp('fast');
                setTimeout(function() {
                    if(_this.bShow){
                        _this.oTooltip.css({
                            left: iLeft,
                            top: iTop,
                        });
                        _this.oTooltip.slideDown('fast');
                    }
                }, 100);
            },
            'mouseout.zh.tooltip': function() {
                _this.bShow = false;
                if (_this.oTooltip) {
                    _this.oTooltip.slideUp('fast');
                }
            },
            'mousemove.zh.tooltip': function(e) {
                var iTop = e.pageY + 20;
                var iLeft = e.pageX + 20;

                if (_opt.isLeft) {
                    iLeft = iLeft - _this.oTooltip.outerWidth() - 50;
                }

                if (_this.oTooltip && _this.oTooltip.outerWidth() + iLeft >= $('body').width()) {
                    iLeft = $('body').width() - _this.oTooltip.outerWidth() - 50;
                }
                if (_this.oTooltip && _this.oTooltip.outerHeight() + iTop >= $('body').height()) {
                    iTop = $('body').height() - _this.oTooltip.outerHeight() - 50;
                }
                if (_this.oTooltip) {
                    _this.oTooltip.css({
                        left: iLeft,
                        top: iTop,
                    });
                }

            },
        });
    };

    function Plugin(option,methdOpt){
        var data =  $(this).data('zh.tooltip');
        if(typeof option == 'string') {
            return data[option].call(data,methdOpt);
        }
        return this.each(function(){
            var _this = $(this);
            var data = _this.data('zh.tooltip');
            var options = typeof option == 'object' && option;
            if(!data){
                _this.data('zh.tooltip',(data = new Tooltip(_this,options)));
                data.init();
            } else {
                data.opts = options?options:{};
                data.init();
            }
        });
    }
    var old = $.fn.tooltip;
    $.fn.zTooltip = Plugin;
    $.fn.zTooltip.Constructor = Tooltip;

    //解决冲突
    $.fn.zTooltip.noConflect = function(){
        $.fn.zTooltip = old;
        return this;
    };

    $.addCSSRule(document.styleSheets[0],
        '.zh_tooltip',
        'position: absolute; max-width: 10rem; padding: 0.5rem;' +
        ' border-radius: 0.04rem; color: #000; background: rgba(198,198,198, 0.9);' +
        ' box-shadow: 0 0 0.05rem #ccc; z-index: 99999990;');

})(jQuery);



;(function ($) {
    function UUID(){
        this.id = this.createUUID();
    }
    // When asked what this Object is, lie and return it's value
    UUID.prototype.valueOf = function(){ return this.id; };
    UUID.prototype.toString = function(){ return this.id; };
    // INSTANCE SPECIFIC METHODS
    UUID.prototype.createUUID = function(){
        // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
        // since JavaScript doesn't allow access to internal systems, the last 48 bits
        // of the node section is made up using a series of random numbers (6 octets long).
        var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
        var dc = new Date();
        var t = dc.getTime() - dg.getTime();
        var tl = UUID.getIntegerBits(t,0,31);
        var tm = UUID.getIntegerBits(t,32,47);
        var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
        var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
        var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);

        // since detection of anything about the machine/browser is far to buggy,
        // include some more random numbers here
        // if NIC or an IP can be obtained reliably, that should be put in
        // here instead.
        var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
            UUID.getIntegerBits(UUID.rand(8191),8,15) +
            UUID.getIntegerBits(UUID.rand(8191),0,7) +
            UUID.getIntegerBits(UUID.rand(8191),8,15) +
            UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
        return tl + tm  + thv  + csar + csl + n;
    };

    //Pull out only certain bits from a very large integer, used to get the time
    //code information for the first part of a UUID. Will return zero's if there
    //aren't enough bits to shift where it needs to.
    UUID.getIntegerBits = function(val,start,end){
        var base16 = UUID.returnBase(val,16);
        var quadArray = new Array();
        var quadString = '';
        var i = 0;
        for(i=0;i<base16.length;i++){
            quadArray.push(base16.substring(i,i+1));
        }
        for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
            if(!quadArray[i] || quadArray[i] == '') quadString += '0';
            else quadString += quadArray[i];
        }
        return quadString;
    };
    //Replaced from the original function to leverage the built in methods in
    //JavaScript. Thanks to Robert Kieffer for pointing this one out
    UUID.returnBase = function(number, base){
        return (number).toString(base).toUpperCase();
    };
    //pick a random number within a range of numbers
    //int b rand(int a); where 0 <= b <= a
    UUID.rand = function(max){
        return Math.floor(Math.random() * (max + 1));
    };

    window.uuid = new UUID();

})(jQuery);
