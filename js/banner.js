window.onload = function() {
	~(function() {
		//1.实现数据绑定-》ajax请求数据， 使用字符串拼接的方式
		var val = null; //ajax请求回来的数据
		var banner = document.getElementById("banner"); //图片轮播区域
		var inner = document.getElementById("inner"); //图片区域
		var tip = document.getElementById("tip"); //提示的焦点
		var oLis = tip.getElementsByTagName("li");
		var imgList = inner.getElementsByTagName("img"); //图片列表
		var count = null; //当前图片的总数(加上了第一张拼接到最后的)
		var btnLeft = document.getElementsByClassName("btnLeft")[0];
		var btnRight = document.getElementsByClassName("btnRight")[0];
		//ajax请求数据
		~ function() {
			var xhr = new XMLHttpRequest;
			//false表示同步请求（如果数据没有请求回来将不进行下面的操作）
			xhr.open("get", "json/data.txt?_=" + Math.random(), false);
			//监听ajax请求的状态
			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 300)) {
					val = xhr.responseText; //ajax请求回来的是json格式的字符串
					data = JSON.parse(val); //需要将json格式的字符串转化为json格式的对象
					//console.log(data);
				}
			};
			xhr.send(null);
		}();

		//2.字符串拼接（使用这种方法可以减少dom的回流，只引发一次回流）
		~ function() {
			var str = "";
			var l = data.length;
			count = l + 1;
			//绑定图片
			if(data) {
				for(var i = 0; i < l; i++) {
					var curData = data[i];
					str += '<div><img src="" trueImg="' + curData["img"] + '" /></div>';
				}
				//这样做是为了实现无缝拼接-》将第一张图片复制一份拼到最后一张图片的末尾
				str += '<div><img src="" trueImg="' + data[0]["img"] + '" /></div>';
			}

			inner.innerHTML = str;
			utils.css(inner, "width", 600 * count);
			//绑定tip
			str = "";
			if(data) {
				for(var i = 0; i < l; i++) {
					if(i === 0) {
						str += '<li class="bg"></li>';
					} else {
						str += '<li></li>';
					}

				}
			}
			tip.innerHTML = str;

		}();
		//3.实现图片的延迟加载
		function lazyLoad() {
			for(var i = 0, l = imgList.length; i < l; i++) {
				~ function(i) {
					var curImg = imgList[i];
					var oImg = new Image;
					oImg.src = curImg.getAttribute("trueImg");
					oImg.onload = function() {
						curImg.src = this.src;
						curImg.style.display = "block";
						oImg = null;
						myAnimate(curImg, {
							opacity: 1
						}, 300);
					};
				}(i);
			}

		}
		window.setTimeout(lazyLoad, 500);
		//4.自动轮播
		var index = 0; //记录的是当前已经播放到哪张图片了
		function autoPlay() {
			if(index >= (count - 1)) {
				index = 0;
				inner.style.left = 0;
				return;
			}
			index++;
			myAnimate(inner, {
				left: -index * 600
			}, 1000);
			changeTip();
		}
		var timer = null; //开一个定时器
		timer = setInterval(function() {
			autoPlay();

		}, 3000);

		//5.焦点对齐
		function changeTip() {
			for(var i = 0, l = oLis.length; i < l; i++) {
				var curLi = oLis[i];
				var tempIndex = index > (oLis.length - 1) ? 0 : index;
				i === tempIndex ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
			}
		}
		//6.鼠标放上banner停止录播
		~ function() {
			banner.onmouseover = function() {
				clearInterval(timer);
			};
			banner.onmouseout = function() {
				timer = setInterval(function() {
					autoPlay();
					changeTip();
				}, 3000);
			};
		}();

		//7. 焦点轮播
		~ function() {
			for(var i = 0, l = oLis.length; i < l; i++) {
				var curLi = oLis[i];
				curLi.liIndex = i;
				curLi.onclick = function() {
					index = this.liIndex;
					changeTip();
					myAnimate(inner, {
						left: -index * 600
					}, 500);
				}
			}
		}();
		//8.实现左右切换
		~ function() {
			btnLeft.onclick = function() {
				index--;
				if(index <= 0) {
					index = count - 1;
					myAnimate(inner, {
						left: -index * 600
					}, 0);
				} else {
					myAnimate(inner, {
						left: -index * 600
					}, 1000);
				}
				/*index=index<=0?(count-1):index;*/
				changeTip();

			};
			btnRight.onclick = autoPlay;
		}();
	})();
};