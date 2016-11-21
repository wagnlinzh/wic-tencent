
//解锁
var showDotWin = function(callback){
  var dotUp = $('.up-dot');
  var dotLeft = $('.left-dot');
  var dotRight = $('.right-dot');
  var dotPosition = [];
  var dotList = [dotUp, dotRight, dotLeft];
  var dotClicked = [];
  var index = -1;
  var oldLine = null;
  var dotStartEvent = function(e){
    e.preventDefault();
    //把点的位置存到变量
    var tp;
    for (var i = 0; i < dotList.length; i++) {
      tp = dotList[i];
      dotPosition.push({
        x: tp.offset().left,
        y: tp.offset().top,
        w: tp.width(),
        h: tp.height()
      });
    }
    //判断起点位置是否在第一个点
    var dotOne = dotPosition[0];
    var evt = e.touches[0];
    if (evt.clientX >= dotOne.x && evt.clientX <= dotOne.w + dotOne.x && evt.clientY >= dotOne.y && evt.clientY <= dotOne.h + dotOne.y) {
      dotList[0].addClass('active');
      dotClicked.push(dotList[0]);
      oldLine = $('.line-box').filter('[data-class='+ dotList[0].attr('data-class') +']').addClass('active');
      dotList[0].removeClass('shank');
      index = 1;
      $(document).on('touchmove', dotMoveEvent);
      $(document).on('touchend', dotEndEvent);
    }
  };
  var dotMoveEvent = function(e){
    if (index == dotList.length) {
      return;
    }
    var dotN = dotPosition[index];
    var evt = e.touches[0];
    if (evt.clientX >= dotN.x && evt.clientX <= dotN.w + dotN.x && evt.clientY >= dotN.y && evt.clientY <= dotN.h + dotN.y) {
      dotList[index].addClass('active');
      dotClicked.push(dotList[index]);
      oldLine.addClass('show').removeClass('active');
      oldLine = $('.line-box').filter('[data-class='+ dotList[index].attr('data-class') +']').addClass('active');
      index++;
    }
    if (index == dotList.length) {
      oldLine.addClass('show').removeClass('active');
      //滑动成功
      $('.t-deblocking .txt-1').addClass('fadeInUp');
      $('.t-deblocking .txt-3').addClass('fadeInDown');
      $(document).off('touchstart', dotStartEvent);
      callback && callback();


        setTimeout(function(){
          $('.t-deblocking').addClass('fadeOut');
          setTimeout(function(){
            $('.t-deblocking').remove();
            setTimeout(function(){
              $('.t-guide').hide();
          }, 2000);
        }, 2000);
      },2000);

    }
  };
  var dotEndEvent = function(e){
    if (index != dotList.length) {
      for (var i = 0; i < dotClicked.length; i++) {
        dotClicked[i].removeClass('active');
      }
      dotClicked = [];
      index = -1;
      oldLine = null;
      $('.up-dot').addClass('shank');
      $('.line-box').removeClass('active show');
      $('.line-1').addClass('active');
    }
    $(document).off('touchmove', dotMoveEvent);
    $(document).off('touchend', dotEndEvent);
  };
  $(document).on('touchstart', dotStartEvent);
};


showDotWin();
