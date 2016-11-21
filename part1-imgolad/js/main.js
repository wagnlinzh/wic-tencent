

//LoadImages 使用

//Step 1 new 一个实例
var imageLoader = new LoadImages();

//Step2 添加其他loading的内容
var preloadimgs = [
	'./img/s.jpg',
	'./img/d.jpg',
	'./img/n.jpg',
	'./img/w.jpg',
	'./img/e.jpg',
	'./img/u.jpg',
	'./img/main.jpg'
];

// Step 3 :loading 完成之后的动作
imageLoader.addEventListener('onLoad', function(){

	$('.t-load').hide();
	$('.t-deblocking').show();
	//初始化rotate
	// showDotWin(_initRotate);
});

imageLoader.load(preloadimgs);
