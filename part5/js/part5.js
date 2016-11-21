
(function(){

  //	Create new User for device/lang/prefix detection //检查设备支持情况
  var user = new UserSupport();

  //	3D vector object 3D矢量对象
  var vec3 = new Vector3();

  //	Motion var to hold the motion type depending on user support (inertia, gyro) 运动变量，根据用户支持（惯性，陀螺仪）保持运动类型
  var motion = null;

   //	Inertia container 惯性容器
  var inertia = null;

  //	Gyro container  陀螺容器 part6
  // var gyro = null;


  //	Initiation boolean
  var initialised = false;

  //	Should we use the gyro? part6
  // var useGyro = null;

  //	Blocker to control the degree of the 360˚ view the user can access  阻挡程度控制360°视图的用户可以访问的程度
  var blocker = new Blocker();

  //	The range on degrees the user can view before being blocked by the blocker 用户在被阻止程序阻止之前可以查看的度数范围
  var range = null;

  //	Has the motion been cancelled. We should cancel the motion the save on CPU usage when viewing video etc. 运动已取消。我们应该在观看视频时取消对CPU使用的保存动作
  var motionCancelled = false;



  /*
  *
  *	Support event
  *
  */
  var onSupportUpdate = function (e) {

    //对象e是UserSupport对象的测试结果
    //重置user
    user = e;


    //
    if (e.supported) {

      if (!initialised) {

        //惯性容器
        inertia = new Inertia('easeOutQuad', 29, 10);


        // motion 运动变量  来自于 惯性容器
        motion = inertia;

        motion.addEventListener('onMotionUpdate', onMotion);

      }

      initialised = true;

      range = {
        y: 180
      };

      if (range) {

        // 阻尼
        blocker.set(range);

      }

      // if (!useGyro) {
      //   motion.reset();
      //   onMotion({
      //     vec3: motion.vec3
      //   });
      // }

    } else {
      alert('User unsupported');
    }
  };


  /*
  *
  *	Motion event
  *
  */
  var onMotion = function (e) {
    // console.log(vec3);

    vec3.set(e.vec3.x, e.vec3.y, e.vec3.z);

    if (range) {
      //阻尼
      vec3 = blocker.block(vec3);
    }
    rotate(vec3);

  };

  var box=document.querySelector('.t-ios-main .box');


  var rotateStr = 'translate3d(0, 0, 100px) rotateZ({2}deg) rotateX(-90deg) rotateX({0}deg) rotateY({1}deg) rotateY(0deg)';

  // var trackStr = 'rotateX({0}deg) rotate({1}deg)';

  var rotate = function (e) {
    //旋转动画, 在手指移动的反向 ,位移->转换为 角度 deg

    var rotateEnd = rotateStr.replace('{1}', e.x * -1).replace('{0}', e.y).replace('{2}', (e.z % 3600000) * -1);


    box.style.webkitTransform = rotateEnd;


  };



  var onKillMotion = function () {

    if (!motionCancelled) {
      /*
      *	Remove current motion event
      */
      motion.removeEventListener('onMotionUpdate', onMotion);
      /*
      *	Clear the motion variable
      */
      motion = null;
      /*
      *
      */
      motionCancelled = true;
    } else {
      /*
      *	Set the motion variable to its new type
      */
      // motion = (useGyro) ? gyro : inertia;
      motion= inertia;
      /*
      *	Listen to new motion type
      */
      motion.addEventListener('onMotionUpdate', onMotion);
      /*
      *
      */
      motionCancelled = false;
    }
  };




  function _initRotate() {

    //设备完成测试时，会触发自定义事件supportStatusUpdate :2
    user.addEventListener('supportStatusUpdate', onSupportUpdate);

    //图片加载完成之后，执行设备测试:1
    user.test();

  }


  //
  _initRotate();


})();
