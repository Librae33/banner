window.onload=function(){
	var val = null; //ajax请求回来的数据
	var data=null;
		var banner = document.getElementById("banner"); //图片轮播区域
		var inner = document.getElementById("inner"); //图片区域
		var tip = document.getElementById("tip"); //提示的焦点
		var oLis = tip.getElementsByTagName("li");
		var divList= inner.getElementsByTagName("div"); 
		var imgList = inner.getElementsByTagName("img"); //图片列表
		var count = null; //当前图片的总数(加上了第一张拼接到最后的)
		var btnLeft = document.getElementsByClassName("btnLeft")[0];
		var btnRight = document.getElementsByClassName("btnRight")[0];
	//1.ajax请求数据
	~function(){
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
	//2.数据绑定
			~ function() {
			var str = "";
			var l = data.length;
			//绑定图片
			if(data) {
				for(var i = 0; i < l; i++) {
					var curData = data[i];
					str += '<div><img src="" trueImg="' + curData["img"] + '" /></div>';
				}
			}
			inner.innerHTML = str;
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
						if(i===0){//只对第一张图片进行处理
							var curDiv=curImg.parentNode;
							curDiv.style.zIndex=1;
							//curImg.style.opacity=1;
							myAnimate(curDiv, {
							opacity: 1
						}, 500);
						}
						oImg = null;
						
					};
				}(i);
			}

		}
		window.setTimeout(lazyLoad, 500);
		
		//4.自动轮播
		var index = 0; //记录的是当前已经播放到哪张图片了
		function autoPlay() {
			if(index==(data.length-1)){
				index=-1;
			}
			index++;
			setBanner();
			changeTip();
		}
		function setBanner(){//实现轮播图切换效果
			for(var i=0;i<divList.length;i++){
				var curDiv=divList[i];
				if(i===index){
					utils.css(curDiv,"zIndex",1);
					//让当前的透明度从0变到1，当动画结束，让其他的div的透明度的值变为0
					myAnimate(curDiv, {
							opacity: 1
						}, 500,function(){
							var curDivSib=utils.siblings(this);
							for(var k=0;k<curDivSib.length;k++){
								curDivSib[k].style.opacity=0;
							}
						});
					continue;
				}
				utils.css(curDiv,"zIndex",0);
			}
		}
		var timer = null; //开一个定时器
		timer = setInterval(function() {
			autoPlay();

		}, 3000);
		
		//5.焦点对齐
		function changeTip() {
			for(var i = 0, l = oLis.length; i < l; i++) {
				var curLi = oLis[i];
				i === index ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
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
				curLi.onmouseover = function() {
					index = this.liIndex;
					setBanner();
					changeTip();
					
				}
			}
		}();
		
				//8.实现左右切换
		~ function() {
			btnLeft.onclick = function() {
				if(index === 0) {
					index=data.length;
					
				} 
				index--;
				changeTip();
				setBanner();

			};
			btnRight.onclick = autoPlay;
		}();
};
