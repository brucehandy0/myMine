/*
mylib v1.0
http://brucehandy.cn/lib/mylib.js
date: 2016-09-18 
*/

/*
？？类型
检查数据类型
*/
//(function(){})();
var myLib = {
	//学习仿照jquery来写
	//先检查mylib存不存在，是否被覆盖等
	//需要初始化函数
	self:this,
	checkType:function(obj){
		var b=2;
		//var o = Object.prototype.toString.apply(obj);
		var o = toString.apply(obj);
		switch(o){
			case '[object Function]':
				o = 'isfunction';
				break;
			case '[object Object]':
				o = 'isObject';
				break;
			case '[object RegExp]':
				o = 'isRegExp';
				break;
			case '[object Array]':
				o = 'isArray';
				break;
			case '[object JSON]':
				o = 'isJSON';
				break;
			case '[object String]':
				o = 'isString';	
				break;			
			case '[object Number]':
				o = 'isNumber';		
				break;
			case '[object Boolean]':
				o = 'isBoolean';
				break;
			case '[object ArrayBuffer]':
				o = 'isArrayBuffer'
				break;
			case '[object Window]':
				o = 'isWindow';
				break;
			default:
				alert("not of them");
		}
		return o;
	},
	/*
	console函数的简写
	*/
	con:function(str,type){
		type = type||'log';
		switch(type){
			case 'log':
				console.log(str);
				break;
			case 'info':
				console.info(str);
				break;
			case 'warn':
				console.warn(str);
				break;
			case 'dir':
				console.dir(str);
				break;
		}
	},
	/*
	添加,移除事件监听
	*/
	addEvent:function(target,type,fn){
	
		if(target.addEventListener){
			//默认false，在事件向上冒泡中触发
			target.addEventListener(type,fn,false);
		}else if(target.attachEvent){
			target.attachEvent('on'+type,fn)
		}else{
			target['on'+type] = fn;
		}

	},
	removeEvent:function(target,type,fn){
		if(target.removeEventListener){
			target.removeEventListener(type,fn,false);
		}else if(target.detachEvent){
			target.detachEvent('on'+type,fn)
		}else{
			target['on'+type] = null;
		}
	},
	/*
	通过父元素和类名，查找元素
	*/
	getElementByClass:function(oParent,target){
		var aEle = oParent.getElementsByTagName('*');
		var aResult = [];
		//?感觉不对
		var reg = new RegExp('\\b'+target+'\\b','i');
		var i = 0,len = aEle.length;
		for(;i<len;i++){
			if(reg.test(aEle[i].className)){
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	},
	
	
	/*
	简单实现元素查找器
	*/
	// myQuery:function(obj){
		// this.children = [];
		// switch(typeof obj){
			// case 'function':
				// break;
		// }
	// }
	/*
	加载状态, 参数时Ext对象，或是dom对象
	*/
    createMask:function (el)
    {	
		//el = el||document.body;//默认参数
        var sW = 100;
        var sH = 100;
        var elTemp;
		
        if(el)
        {	
			//是对象，这里并没有判断是否为Ext对象，还是js对象， 这个库不依赖Ext
			if(el.toString()=='[object Object]'){
				elTemp = el;
				sW = el.dom.offsetWidth/2 - 20;
				sH = el.dom.offsetHeight/2 - 20;

			//判定它为dom对象
			}else{
				elTemp = el;
				sW = el.offsetWidth/2 - 20;
				sH = el.offsetHeight/2 - 20;
			}
        }
        else
        {
            sW = document.documentElement.scrollWidth/2 - 20;
            sH = document.documentElement.scrollHeight/2 - 20;
            elTemp = document.body;
        }	
		
		
        var className = "x-mask-large-msg";
        var divMask = document.createElement('div');
        divMask.style.left = sW + 'px';
        divMask.style.top = sH + 'px';
        divMask.style.height = '40px';
        divMask.style.width = '40px';
        divMask.style.zIndex = 20000;
        divMask.className = className;

        var divMaskInner = document.createElement('div');
        divMaskInner.className = className + "-inner";
        divMaskInner.style.height = '40px';
        divMaskInner.style.width = '40px';
        divMask.appendChild(divMaskInner);

        var divMaskText = document.createElement('IMG');
		
        //divMaskText.src = TabAlertMarkImage.srcBlank;
        //divMaskText.src = 'gray.png';
		
        divMaskText.className = className + "-text";
        divMaskText.style.height = '40px';
        divMaskText.style.width = '40px';
        divMaskInner.appendChild(divMaskText);

        elTemp.appendChild(divMask);
    },
	/*
	取消加载状态
	*/
	clearMask:function (el)
    {
        var elTemp;
        if(el)
        {
            elTemp = el;
        }
        else
        {
            elTemp = document.body;
        }

        var delDiv = elTemp.getElementsByClassName("x-mask-large-msg");
        for(var i = delDiv.length - 1;i >= 0 ;i--)
        {
            elTemp.removeChild(delDiv[i]);
        }
    },
	/*
	本来想用extend来继承，还是用inherit吧
	*/
	// inherit:function(d,b,a){
		// var p = null,
			// o = 
	// }
	
	
	
}

