(function(){
	function $(id){
		return document.getElementById(id);
	}
	function $$(cls){
		if(document.querySelectorAll){return document.querySelectorAll("."+cls);}
		var a=[],
			reg=new RegExp("(//s|^)" + cls + "($|//s)"),
			aElem=document.getElementsByTagName("*");
		for (var i=0;i<aElem.length;i++){reg.test(aElem[i].className)&&a.push(aElem[i]);}
		return a;
	}
	function on(el,type,handler){
		if(el.addEventListener){
			el.addEventListener(type,handler,false);
		}else{
			if(el.attachEvent){
				el.attachEvent("on"+type,handler);
			}else{
				el["on"+type]=handler;
			}
		}
	}
	function un(el,type,handler){
		if(el.removeEventListener){
			el.removeEventListener(type,handler,false);
		}else{
			if(el.detachEvent){
				el.detachEvent("on"+type,handler);
			}else{
				el["on"+type]=null;
			}
		}
	}
	function hasClass(ele,cls){
		return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}

	function addClass(ele,cls){
		if(!this.hasClass(ele,cls)) ele.className += " "+cls;
	}
	function removeClass(ele,cls){
		if(hasClass(ele,cls)) {
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			ele.className = ele.className.replace(reg,' ');
		}
	}
	function getWindowHeight(){
		var pageHeight=window.innerHeight;
		if(typeof pageHeight!="number"){
			pageHeight=(document.compatMode=="CSS1Compat")?document.documentElement.clientHeight:document.body.clientHeight;
		}
		return pageHeight;
	}
	function getWindowWidth(){
		var pageWidth=window.innerWidth;
		if(typeof pageWidth!="number"){
			pageWidth=(document.compatMode=="CSS1Compat")?document.documentElement.clientWidth:document.body.clientWidth;
		}
		return pageWidth;
	}
	var isIE6=/msie 6/i.test(navigator.userAgent);
	
	Array.prototype.map || (Array.prototype.map = function(e, t) {
	    var n, r, i;
	    if (this == null) return !1;
	    var s = Object(this), o = s.length >>> 0;
	    if ({}.toString.call(e) != "[object Function]") return !1;
	    t && (n = t), r = new Array(o), i = 0;
	    while (i < o) {
	        var u, a;
	        i in s && (u = s[i], a = e.call(n, u, i, s), r[i] = a), i++;
	    }
	    return r;
	});
	var js100=function(fun){
		on(window,"load",fun);
	};
	window["js100"]=js100;

	var Javascript100={
		addFavorite:function(opt){
			var url=(opt.url)?"http://"+opt.url:location.href,
				title=opt.title,
				o=$(opt.id);
			if(o){
				on(o,"click",function(){
					try{
						window.external.addFavorite(url,title);
					}catch(e){
						try{
							window.sidebar.addPanel(title,url,"");
						}catch(e){
							return false;	
						}
					}
					return false;
				});
			}
		},
		setHomePage:function(opt){
			var url=(opt.url)?"http://"+opt.url:location.href,
				o=$(opt.id);
			if(o){
				on(o,"click",function(){
					if(document.all){
						document.body.style.behavior="url(#default#homepage)";
						document.body.setHomePage(url);
					}
					return false;
				});
			}
		},
		fixPng:function(opt){
			if(isIE6){
				var imgs=$$(opt.cls);
				imgs.map(function(img){
					var imgName=img.src.toUpperCase();
					if(imgName.substring(imgName.length-3,imgName.length)=="PNG"){
						var imgID=(img.id)?"id='"+img.id+"'":"";
						var imgClass=(img.className)?"class='"+img.className+"' ":"";
						var imgTitle=(img.title)?"title='"+img.title+"' ":"title='"+img.alt+"' ";
						var imgStyle="display:inline-block;"+img.style.cssText;
						if(img.parentElement.href){
							imgStyle="cursor:hand;"+imgStyle;
						}
						var strNewHTML="<span "+imgID+imgClass+imgTitle+' style="'+"width:"+img.width+"px; height:"+img.height+"px;"+imgStyle+"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"+"(src='"+img.src+"', sizingMethod='scale');\"></span>";
						img.outerHTML=strNewHTML;
					}
				});
			}
		},
		floatDiv:function(opt){
			var id=$(opt.id);
			var top=parseInt(opt.top,10);
			var winWidth=getWindowWidth();
			var mouseoverTarget=0;
			var mouseoutTarget=0;
			var hidenPx=0;
			var timer=null;
			var scrollTimer=null;
			var scrollBarWidth=(document.body.offsetHeight>=getWindowHeight())?15:0;
			id.style.position=(isIE6)?"absolute":"fixed";
			id.style.top=top+"px";
			if(opt.left){
				hidenPx=parseInt(opt.left,10);
				id.style.left=hidenPx+"px";
				mouseoverTarget=0;
				mouseoutTarget=hidenPx;
			}else{
				hidenPx=parseInt(opt.right,10);
				id.style.right=hidenPx+"px";
				mouseoverTarget=winWidth-id.offsetWidth-scrollBarWidth;
				mouseoutTarget=winWidth+hidenPx;
			}
			if(hidenPx<0){
				on(id,"mouseover",function(){
					move(mouseoverTarget);
				});
				on(id,"mouseout",function(){
					move(mouseoutTarget);
				});
			}
			function move(target){
				clearInterval(timer);
				timer=setInterval(function(){
					var speed=(id.offsetLeft-target)/5;
					speed=speed>0?Math.ceil(speed):Math.floor(speed);
					id.offsetLeft==target?clearInterval(timer):id.style.left=id.offsetLeft-speed+"px";
				},30);
			}
			if(isIE6){
				on(window,"scroll",function(){
					clearTimeout(scrollTimer);
					var scrollTimer=setTimeout(function(){
						id.style.top=((document.documentElement.scrollTop||document.body.scrollTop)+top)+"px";
					},1);
				});
			}
		},
		linkage:function(opt){
			var data=opt.data,
				id1=$(opt.id1),
				id2=$(opt.id2);
			var newOption,selectIndex,tempArr,tempLen;
			for(var i=0;i<data[0].length;i++){
				newOption=new Option(data[0][i],data[0][i]);
				id2.add(newOption,undefined);
			}
			on(id1,"change",function(){
				selectIndex=id1.options[id1.selectedIndex].index;
				tempArr=data[selectIndex];
				tempLen=id2.options.length;
				for(i=0;i<data[selectIndex].length;i++){
					newOption=new Option(tempArr[i],tempArr[i]);
					id2.add(newOption,undefined);
				}
				for(i=0;i<tempLen;i++){
					id2.remove(0);
				}
			});
		},
		tab:function(opt){
			var btns=opt.btns;
			var tabs=opt.tabs;
			var handler=null;
			var cls=opt.activeClassName;
			var eventType=opt.eventType||1;
			var reg=null;
			var delay=opt.delay||150;
			switch(eventType){
				case 1:
					eventType="mouseover";
					break;
				case 2:
					eventType="click";
					break;
			}
			for(var i=0;i<btns.length;i++){
				$(tabs[i]).style.display="none";
				on($(btns[i]),eventType,function(num){
					return function(){
						clearTimeout(handler);
						handler=setTimeout(function(){
							for(var j=0;j<btns.length;j++){
								if(num==j){
									$(btns[j]).className+=(" "+cls);
									$(tabs[j]).style.display="block";
								}else{
									reg=eval("/(^"+cls+")|((\\s)"+cls+")/g");
									$(btns[j]).className=$(btns[j]).className.replace(reg,"");
									$(tabs[j]).style.display="none";
								}
							}
							return false;
						},delay);
					};
				}(i));
			}
			$(tabs[0]).style.display="block";
		},
		downMenu:function(opt){
			var id=$(opt.id);
			var pe=(opt.pElement||"LI").toUpperCase();
			var ce=(opt.cElement||"UL").toUpperCase();
			var cls=opt.cls;
			var list=id.getElementsByTagName(pe);
			for(var i=0;i<list.length;i++){
				on(list[i],"mouseover",function(num){
					return function(){
						if(list[num].parentNode.parentNode.id!=opt.id){
							list[num].parentNode.parentNode.className=cls;
						}
						var childList=list[num].childNodes;
						for(var j=0;j<childList.length;j++){
							if(childList[j].tagName==ce){
								childList[j].style.display="block";
							}
						}
					};
				}(i));
				on(list[i],"mouseout",function(num){
					return function(){
						if(list[num].parentNode.parentNode.id!=opt.id){
							list[num].parentNode.parentNode.className="";
						}
						var childList=list[num].childNodes;
						for(var j=0;j<childList.length;j++){
							if(childList[j].tagName==ce){
								childList[j].style.display="none";
							}
						}
					};
				}(i));
			}
		},
		scroll:function(opt){
			if(!opt.box||!opt.list){return false;}
			var _this=this;
			var box=$(opt.box);
			var list=$(opt.list);
			var padding=0;
			var items=list.children;
			var timer=null;
			var autoTimer=null;
			var len=0;
			var direction=opt.direction||"top";
			var cssDirection="top";
			var jsDirection="offsetTop";
			var aArrow=$(opt.advanceArrow);
			var rArrow=$(opt.retreatArrow);
			var spacing=opt.spacing||4000;
			box.style.position="relative";
			list.style.position="relative";
			if(direction==="top"||direction==="bottom"){
				len=items[1].offsetTop-items[0].offsetTop;
				cssDirection="top";
				padding=list.offsetTop;
				jsDirection="offsetTop";
			}else{
				if(direction==="left"||direction==="right"){
					len=items[1].offsetLeft-items[0].offsetLeft;
					cssDirection="left";
					padding=list.offsetLeft;
					jsDirection="offsetLeft";
				}
			}
			if(aArrow){
				on(aArrow,"click",function(){
					clearInterval(autoTimer);
					up();
					autoTimer=setInterval(function(){
						direct();
					},spacing);
				});
			}
			if(rArrow){
				on(rArrow,"click",function(){
					clearInterval(autoTimer);
					down();
					autoTimer=setInterval(function(){
						direct();
					},spacing);
				});
			}
			autoTimer=setInterval(function(){
				direct();
			},spacing);
			on(list,"mouseover",function(){
				clearInterval(autoTimer);
			});
			on(list,"mouseout",function(){
				autoTimer=setInterval(function(){
					direct();
				},spacing);
			});
			function direct(){
				if(direction==="top"||direction==="left"){
					down();
				}else{
					if(direction==="bottom"||direction==="right"){
						up();
					}
				}
			}
			function up(){
				list.insertBefore(items[items.length-1],list.firstChild);
				list.style[cssDirection]=-len+"px";
				move(0);
			}
			function down(){
				move(-len,function(){
					list.appendChild(items[0]);
					list.style[cssDirection]="0px";
				});
			}
			function move(target,callBack){
				clearInterval(timer);
				timer=setInterval(function(){
					var speed=(target-list[jsDirection]+padding)/5;
					speed=speed>0?Math.ceil(speed):Math.floor(speed);
					(target+padding)==list[jsDirection]?(clearInterval(timer),callBack&&callBack.apply(_this)):list.style[cssDirection]=(speed+list[jsDirection]-padding)+"px";
				},30);
			}
		},
		slider:function(opt){
			var _this=this;
			var box=$(opt.box);
			var list=$(opt.list);
			var type=opt.type||1;
			var imgList=list.getElementsByTagName("img");
			var imgSrc=[];
			var len=0;
			var cssDirection="top";
			var jsDirection="offsetTop";
			var items=list.children;
			var btnList=null;
			var btns=null;
			var timer=null;
			var autoTimer=null;
			var textHiddenTimer=null;
			var textShowTimer=null;
			var textHeight=0;
			var index=0;
			var padding=0;
			var spacing=opt.spacing||4000;
			var btnListClass=opt.btnListClass;
			var btnClass=opt.btnClass;
			var showText=opt.showText;
			box.style.position="relative";
			list.style.position="relative";
			for(var i=0;i<imgList.length;i++){
				imgSrc.push(imgList[i].src);
			}
			if(opt.direction==="top"){
				len=items[1].offsetTop-items[0].offsetTop;
				cssDirection="top";
				padding=list.offsetTop;
				jsDirection="offsetTop";
			}else{
				len=items[1].offsetLeft-items[0].offsetLeft;
				cssDirection="left";
				padding=list.offsetLeft;
				jsDirection="offsetLeft";
			}
			showText&&createText();
			createBtn();
			if($(showText)){
				textHeight=$(showText).offsetHeight;
			}
			btns=btnList.getElementsByTagName("li");
			for(var i=0;i<btns.length;i++){
				on(btns[i],"click",function(ii){
					return function(){
						clearInterval(autoTimer);
						moveIndex(ii);
						doing(type,ii);
						index=ii;
						showText&&changeText(index);
					};
				}(i));
			}
			autoTimer=setInterval(function(){
				index=(index>=items.length-1)?0:++index;
				moveIndex(index);
				doing(type,index);
				showText&&changeText(index);
			},spacing);
			on(box,"mouseover",function(){
				clearInterval(autoTimer);
			});
			on(box,"mouseout",function(){
				autoTimer=setInterval(function(){
					index=(index>=items.length-1)?0:++index;
					moveIndex(index);
					doing(type,index);
					showText&&changeText(index);
				},spacing);
			});
			function createText(){
				var div=document.createElement("div");
				div.style.overflow = "hidden";
				div.id=showText;
				div.innerHTML=imgList[0].title;
				box.appendChild(div);
			}
			function createBtn(){
				var s="";
				btnList=document.createElement("ul");
				btnList.className=btnListClass;
				for(var i=0;i<items.length;i++){
					s+="<li>"+(i+1)+"</li>";
				}
				btnList.innerHTML = s;
				btnList.children[0].className=btnClass;
				box.appendChild(btnList);
			}
			function changeText(index){
				clearInterval(textHiddenTimer);
				clearInterval(textShowTimer);
				var text=$(showText);
				if(!text){return false;}
				textHiddenTimer=setInterval(function(){
					var speed=Math.ceil(text.offsetHeight/5);
					text.style.height=(text.offsetHeight-speed)+"px";
					if(text.offsetHeight==0){
						clearInterval(textHiddenTimer);
						text.innerHTML=imgList[index].title;
						textShowTimer=setInterval(function(){
							var speed=Math.ceil((textHeight-text.offsetHeight)/5);
							text.style.height=(text.offsetHeight+speed)+"px";
							(text.offsetHeight>=textHeight)&&clearInterval(textShowTimer);
						},20);
					}},30);
			}
			function moveIndex(index){
				for(var i=0;i<btns.length;i++){
					btns[i].className=(index===i)?btnClass:"";
				}
			}
			function doing(type,index){
				switch(type){
					case 1:
						move(index);
						break;
					case 2:
						fadeIn(index);
						break;
					default:
						fadeIn(index);
						break;
				}
			}
			function move(i,callBack){
				var target=-len*i;
				clearInterval(timer);
				timer=setInterval(function(){
					var speed=(target-list[jsDirection]+padding)/5;
					speed=speed>0?Math.ceil(speed):Math.floor(speed);
					(target+padding)==list[jsDirection]?(clearInterval(timer),callBack&&callBack.apply(_this)):list.style[cssDirection]=(speed+list[jsDirection]-padding)+"px";
				},30);
			}
			function fadeIn(j){
				var i=imgList[0],op;
				i.style.opacity=0;
				i.style.filter="alpha(opacity=0);";
				i.src=imgSrc[j];
				var timer=setInterval(function(){
					op=parseInt((i.style.opacity||0)*100);
					speed=Math.ceil((100-op)/5);
					i.style.filter="alpha(opacity="+(op+speed)+");";
					i.style.opacity=(op+speed)/100;
					(op>=100)&&clearInterval(timer);
				},100);
			}
		},
		foldMenu:function(opt){
			var foldMenuBox=$(opt.id);
			var foldElement=opt.foldElement&&opt.foldElement.toLowerCase()||"UL";
			var foldChildElement=opt.foldChildElement||"LI";
			var cls=opt.afterClassName;
			var reg=null;
			on(foldMenuBox,"click",function(event){
				e=window.event||event;
				var target=e.srcElement||e.target;
				while(target.tagName != foldChildElement && target != foldMenuBox && target.tagName != "BODY"){
					target = target.parentNode;
				}
				if(target.getElementsByTagName(foldElement).length>0){
					target.getElementsByTagName(foldElement)[0].style.display=(target.getElementsByTagName(foldElement)[0].style.display==="block")?"none":"block";
					if(cls){
						reg=eval("/(^"+cls+")|((\\s)"+cls+")/g");
						(target.getElementsByTagName(foldElement)[0].style.display==="block")?target.className+=" "+cls:target.className=target.className.replace(reg,"");
					}
				}
			});
		}
	};
	window["Javascript100"]=Javascript100;
})();