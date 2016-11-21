
/*
*	userSupport
*/

function UserSupport(){

  this.listeners = [];
  this.user = {};

}

UserSupport.prototype = {

  constructor: UserSupport,

  post:function(type){

    //	For each listener
    for(var i = 0; i < this.listeners.length; i++){

      if(this.listeners[i].type===type){

        switch(type){
          case 'supportStatusUpdate':
          this.listeners[i].callback.call(this, this.user);
          break;
          default:
          return false;
          break;

        }
      }
    }
  },

  addEventListener:function(type, callback){
    //	Listener list
    this.listeners.push({
      type:type,
      callback:callback
    });
  },

  test:function(){

    var self = this;
    var user = self.user;
    //	Set support (Default)
    user.supported = true;
    //	Set locale
    user.locale = 'zh';
    //	Set device
    user.device = deviceDetect();
    //	Set prefix
    user.prefix = getPrefix();
    //	Test MS as it doesn't currently support 'preserve-3d' and should be booted if so. This application is dependent on 'preserve-3d'.
    if(user.prefix.js.toLowerCase()==='ms'){

      //	Create test element
      var element = document.createElement('LINK');

      //	Append to DOM
      document.getElementsByTagName('HEAD')[0].insertBefore(element, null);

      //	Set test style
      element.style[user.prefix.js+'TransformStyle'] = 'preserve-3d';

      //	Get the test elements computed styels
      var cs = window.getComputedStyle(element, null),

      //	Extract the transformStyle style
      transformStyle = cs.getPropertyValue(user.prefix.css+'transform-style');

      //	Test its content
      user.supported = (transformStyle!=='preserve-3d') ? false : true;

      //	Remove the test element
      element.parentNode.removeChild(element);
    }


    //	测试陀螺仪的支持度
    var orientationSupport = function(callBack){
      if (window.DeviceOrientationEvent){
        //	Test signal
        var _i = null;
        var _e = null;
        var _c = 0;
        //	Signal listener
        var _updateDegree = function(e){
          _e = e;
        };
        //	Add listner
        window.addEventListener('deviceorientation', _updateDegree, false);
        //深入检查支持度
        _i = window.setInterval(function(){
          //如果能获取到事件e，callback返回true
          if(_e !== null && _e.alpha !== null){
            //	Clear interval
            clearInterval(_i);
            //	Remove listener
            window.removeEventListener('deviceorientation', _updateDegree);
            //	Return user
            callBack.call(this, true);
          }
          //如果连续10次都获取不到，callback返回false
          else{
            //	Increment the counter
            _c++;
            //	If the counter === 10
            if(_c === 10){
              //	Clear interval
              clearInterval(_i);
              //	Remove listener
              window.removeEventListener('deviceorientation', _updateDegree);
              //	Return user
              callBack.call(this, false);
            }
          }
          //	Repeat the test every 200th of a second
        }, 200);
      }
      else{
        //如果不支持，callback返回false
        callBack.call(this, false);
      }
    };
    //	Add callBack for the Gyro (orientationEvent) test
    var callBack = function(hasGyro){
      //为true就是支持
      user.gyro = hasGyro;
      //
      self.post('supportStatusUpdate');
    };
    	// Test Gyro (orientationEvent)
    orientationSupport(callBack);

  }
};
