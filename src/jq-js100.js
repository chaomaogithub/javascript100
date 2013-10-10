;(function(){

	$.js100 = $.js100 || {};

	var isIE6 = /msie 6/i.test(navigator.userAgent);

	/**
     * 添加收藏
     * @param opt {object} 配置参数
     */
	$.js100.addFav = function (opt) {

		var url = (opt.url) ? location.protocol + "//" + opt.url : location.href,
			title = (opt.title) ? opt.title : document.title,
			obj = $("#" + opt.id);

		obj.click(function(event) {
			try {
				window.external.addFavorite(url, title);
			} catch (e) {
				try {
					window.sidebar.addPanel(title, url, "");
				} catch (e) {
					return false;
				}
			}
			event.stopPropagation();
			event.preventDefault();
		});
	};

	// 设为首页
	$.js100.setHomePage = function (opt) {

		var url = (opt.url) ? location.protocol + "//" + opt.url:location.href,
			obj = $("#" + opt.id);

		obj.click(function(event) {
			try {
				document.body.style.behavior = "url(#default#homepage)";
				document.body.setHomePage(url);
			} catch (e) {
				return false;
			}
			event.stopPropagation();
			event.preventDefault();
		});
	};

	// 浮动层
	$.js100.floatDiv = function (opt) {

		var obj = $("#" + opt.id),
			top = parseInt(opt.top, 10),
			hideWidth = 0,
			amParams = {},
			direction;

		obj.css({
			"position": (isIE6 ? "absolute" : "fixed"),
			"top": top + "px"
		});
		if (opt.left) {
			hideWidth = parseInt(opt.left, 10);
			direction = "left";
			obj.css("left", hideWidth + "px");
		} else {
			hideWidth = parseInt(opt.right, 10);
			direction = "right";
			obj.css("right", hideWidth + "px");
		}
		if (hideWidth < 0) {
			obj.mouseover(function(){
				amParams[direction] = "0px";
				obj.animate(amParams, "slow", "swing");
			}).mouseout(function(){
				amParams[direction] = hideWidth + "px";
				obj.animate(amParams, "slow", "swing");
			});
		}
		if (isIE6) {
			$(window).scroll(function(){
				obj.stop().animate({"top": ($(window).scrollTop() + top) + "px"}, "slow", "swing");
			});
		}
	};

	// 二级联动
	$.js100.linkage = function(opt) {

		var data = opt.data,
			obj1 = $("#" + opt.id1),
			obj2 = $("#" + opt.id2),
			i,
			newOption,
			selectIndex,
			tempArr,
			tempLen;

		for (i = 0; i < data[0].length; i++) {
			newOption = new Option(data[0][i], data[0][i]);
			obj2.get(0).add(newOption, undefined);
		}

		obj1.change(function() {
			selectIndex = id1.get(0).options[obj1.selectedIndex].index;
			tempArr = data[selectIndex];
			tempLen = obj2.get(0).options.length;
			for (i = 0; i < data[selectIndex].length; i++) {
				newOption = new Option(tempArr[i], tempArr[i]);
				obj2.get(0).add(newOption, undefined);
			}
			for (i = 0; i < tempLen; i++) {
				obj2.get(0).remove(0);
			}
		});
	};

	$.js100.tab = function(opt) {

		var navCls = opt.navCls,
			tabCls = opt.tabCls,
			navItems = $("." + navCls),
			tabItems = $("." + tabCls),
			len = navItems.length,
			activeCls = opt.activeCls,
			eventType = opt.eventType || 1,
			auto = opt.auto || false,
			delay = opt.delay || 100,
			timer = null,
			i;

		var run = function (index) {
			clearTimeout(timer);
			timer = null;
			timer = setTimeout(function () {
				for (i = 0; i < len; i++) {
					if (index === i) {
						navItems.eq(i).addClass(activeCls);
						tabItems.eq(i).show();
					} else {
						navItems.eq(i).removeClass(activeCls);
						tabItems.eq(i).hide();
					}
				}
			}, delay);
		};

		$("." + tabCls + ":gt(0)").hide();
		if (eventType === 1) {
			eventType = "mouseover";
		} else {
			eventType = "click";
		}

		navItems.each(function(index, item){
			$(item).on(eventType, function(){
				run(index);
			});
		});
	};

	$.js100.menu = function(opt){
		var box = $("#" + opt.id),
			items = box.find("li"),
			eventType = opt.eventType || 1,
			cls = opt.activeCls;

		if (eventType === 2) {
			items.click(function() {
				var me = $(this);
				if (me.children("ul").length > 0) {
					me.siblings("." + cls).removeClass(cls).find(" > ul").slideUp();
					me.toggleClass(cls).find(" > ul").slideToggle();
				}
			});
		} else {
			items.hover(function() {
				if ($(this).children("ul").length > 0) {
					$(this).addClass(cls).find(" > ul").show();
				}
			}, function(){
				if ($(this).children("ul").length > 0) {
					$(this).removeClass(cls).find(" > ul").hide();
				}
			});
		}
	};

	$.js100.scroll = function(opt) {
		var defaults = {
	        auto: true,
	        interval: 3000,
	        direction: 'forward',
	        speed: 500,
	        showNum: 1,
	        stepLen: 1,
	        type: 'horizontal',
	        prevElement: null,
	        nextElement: null,
	        pauseElement: null,
	        resumeElement: null
	    };

	   	var Marquee, marquee;

	    Marquee = (function() {
	        function Marquee(options) {
	            this.elements = {
	                wrap: options.boxId,
	                ul: $("#" + options.boxId).children(),
	                li: $("#" + options.boxId).children().children()
	            };
	            this.settings = $.extend({}, defaults, options);
	            this.cache = {
	                allowMarquee: true
	            };
	            return;
	        }

	        Marquee.prototype.init = function() {
	            this.setStyle();
	            this.move();
	            this.bind();
	        };

	        Marquee.prototype.setStyle = function() {
	            var floatStyle, liMargin, liOuterH, liOuterW, ulH, ulW, wrapH, wrapW;

	            liOuterW = this.elements.li.outerWidth(true);
	            liOuterH = this.elements.li.outerHeight(true);
	            liMargin = Math.max(parseInt(this.elements.li.css('margin-top'), 10), parseInt(this.elements.li.css('margin-bottom'), 10));
	            switch (this.settings.type) {
	                case 'horizontal':
	                    wrapW = this.settings.showNum * liOuterW;
	                    wrapH = liOuterH;
	                    ulW = 9999;
	                    ulH = 'auto';
	                    floatStyle = 'left';
	                    this.cache.stepW = this.settings.stepLen * liOuterW;
	                    this.cache.prevAnimateObj = {
	                        left: -this.cache.stepW
	                    };
	                    this.cache.nextAnimateObj = {
	                        left: 0
	                    };
	                    this.cache.leftOrTop = 'left';
	                    break;
	                case 'vertical':
	                    wrapW = liOuterW;
	                    wrapH = this.settings.showNum * liOuterH - liMargin;
	                    ulW = 'auto';
	                    ulH = 9999;
	                    floatStyle = 'none';
	                    this.cache.stepW = this.settings.stepLen * liOuterH - liMargin;
	                    this.cache.prevAnimateObj = {
	                        top: -this.cache.stepW
	                    };
	                    this.cache.nextAnimateObj = {
	                        top: 0
	                    };
	                    this.cache.leftOrTop = 'top';
	            }
	            this.elements.wrap.css({
	                position: 'static' ? 'relative' : this.elements.wrap.css('position'),
	                width: wrapW,
	                height: wrapH,
	                overflow: 'hidden'
	            });
	            this.elements.ul.css({
	                position: 'relative',
	                width: ulW,
	                height: ulH
	            });
	            this.elements.li.css({
	                float: floatStyle
	            });
	        };

	        Marquee.prototype.bind = function() {
	            var _ref, _ref1, _ref2, _ref3, _ref4, _this;

	            _this = this;
	            if ((_ref = this.settings.prevElement) != null) {
	                _ref.click(function(ev) {
	                    ev.preventDefault();
	                    _this.prev();
	                });
	            }
	            if ((_ref1 = this.settings.nextElement) != null) {
	                _ref1.click(function(ev) {
	                    ev.preventDefault();
	                    _this.next();
	                });
	            }
	            if ((_ref2 = this.settings.pauseElement) != null) {
	                _ref2.click(function(ev) {
	                    ev.preventDefault();
	                    _this.pause();
	                });
	            }
	            if ((_ref3 = this.settings.resumeElement) != null) {
	                _ref3.click(function(ev) {
	                    ev.preventDefault();
	                    _this.resume();
	                });
	            }
	            if ((_ref4 = this.elements.wrap) != null) {
	                _ref4.hover(function() {
	                    _this.pause();
	                }, function() {
	                    _this.resume();
	                });
	            }
	        };

	        Marquee.prototype.move = function() {
	            var interval, moveEvent, _this;

	            _this = this;
	            if (this.settings.auto) {
	                switch (this.settings.direction) {
	                    case 'forward':
	                        moveEvent = _this.prev;
	                        break;
	                    case 'backward':
	                        moveEvent = _this.next;
	                }
	                interval = _this.settings.interval;
	                setTimeout(function() {
	                    moveEvent.call(_this);
	                    setTimeout(arguments.callee, interval);
	                }, interval);
	            } else {
	                this.cache.moveBefore = function() {
	                    return _this.cache.allowMarquee = false;
	                };
	                this.cache.moveAfter = function() {
	                    return _this.cache.allowMarquee = true;
	                };
	            }
	        };

	        Marquee.prototype.prev = function() {
	            var preEls, ul, _this;

	            _this = this;
	            if (this.cache.allowMarquee) {
	                ul = this.elements.ul;
	                preEls = ul.children().slice(0, this.settings.stepLen);
	                preEls.clone().appendTo(ul);
	                ul.animate(this.cache.prevAnimateObj, this.settings.speed, function() {
	                    ul.css(_this.cache.leftOrTop, 0);
	                    preEls.remove();
	                });
	            }
	        };

	        Marquee.prototype.next = function() {
	            var sufEls, ul, _this;

	            _this = this;
	            if (this.cache.allowMarquee) {
	                ul = this.elements.ul;
	                sufEls = ul.children().slice(-this.settings.stepLen);
	                sufEls.clone().prependTo(ul);
	                ul.css(_this.cache.leftOrTop, -this.cache.stepW).animate(this.cache.nextAnimateObj, this.settings.speed, function() {
	                    sufEls.remove();
	                });
	            }
	        };

	        Marquee.prototype.pause = function() {
	            this.cache.allowMarquee = false;
	        };

	        Marquee.prototype.resume = function() {
	            this.cache.allowMarquee = true;
	        };

	        return Marquee;
	    })();

        marquee = new Marquee(options);
        marquee.init();
	};

	$.js100.slider = function (opt) {
		
	}

}());