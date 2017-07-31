~ function() {
	var myEffect = {
		Linear: function(t, b, c, d) {
			return c * t / d + b;
		}
	};
	//实现多方向的move动画
	/*
	 * curEle：当前要运动的元素
	 * target:当前动画的目标位置
	 * duration:动画持续的时间
	 */
	function move(curEle, target, duration) {
		//在每一次执行这个方法之前，首先把当前元素正在运行的动画结束掉
		clearInterval(curEle.timer);
		//根据target来获取每一个方向的起始值begin和总距离change {}
		var begin = {},
			change = {};
		for(var key in target) {
			/*
			 * 在for-in循环的时候，默认会把私有的和所属类原型上扩展的属性和方法
			 * 都遍历到，但是我们遍历一个对象的时候通常只需要遍历私有的属性和方法即可
			 * 
			 */
			if(target.hasOwnProperty(key)) {
				//key -》方向：例如：top，left
				begin[key] = utils.css(curEle, key);
				change[key] = target[key] - begin[key];
			}
		}
		var time = 0; //当前已经运动的时间
		curEle.timer = setInterval(function() {
			time += 10;
			//到达目标，结束动画，让当前元素的样式等于目标样式值
			if(time >= duration) {
				utils.css(curEle, target);
				clearInterval(curEle.timer);
				return;
			}
			//没到达目标，分别获取每一个方向的当前样式，给当前元素设置样式即可
			for(var key in target) {
				if(target.hasOwnProperty(key)) {
					var curPos = myEffect.Linear(time, begin[key], change[key], duration);
					utils.css(curEle, key, curPos);
				}
			}
		}, 10);
	}
	window.myAnimate = move;
}();