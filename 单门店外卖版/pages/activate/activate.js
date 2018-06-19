// pages/activate/activate.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({

      couponId: options.id,
      couponName: options.name

    })
    this.pageTab()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

    //页面标签切换及数据加载基础
  pageTab: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    }) 
  },

  mobileInputEvent: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  verifyCodeEvent: function (e) {
    if (this.data.buttonDisable) return false;
    var mobile = this.data.mobile;
    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号有误！',
        showCancel: false,
      })
      return false;
    }
    var that = this;
    var c = 60;
    var intervalId = setInterval(function () {
      c = c - 1;
      that.setData({
        verifyCodeTime: c + 's后重发',
        buttonDisable: true
      })
      if (c == 0) {
        clearInterval(intervalId);
        that.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
    }, 1000)
    app.sendVerifyCode(mobile);//获取短信验证码接口
  },

  //
  submitGet: function(e) {
    if (this.data.submitDisable) return false;
    var mobile = this.data.mobile;
    var code = this.data.code;
    var openId = this.data.userInfo.openId;
    var couponName = this.data.couponName;
    var couponId = this.data.couponId;
    var regMobile = /^1\d{10}$/;
    var regCode = /^\d{4}$/;
    var that = this
    if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码！'
      })
      return false;
    }
    if (!regCode.test(code)) {
      wx.showToast({
        title: '请输入4位有效验证码数字！'
      })
      return false;
    }
    //检查验证码是否正确
    wx.request({
      url: getApp().data.pathApi+'/utils/submitGet.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        contactPhone: mobile,
        code: code,
         userId: '获取优惠券,无userId' ,
         typeId: 20
         },
      success: function (data) {
        //绑定优惠券
        wx.request({
          url: getApp().data.pathApi+'/utils/receiveCoupon.do',//自己的服务接口地址
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          data: {
            contactPhone: mobile,
            couponId: couponId,
            couponName: couponName,
            openId: openId,
            getType: "小程序领取"
          },
          success: function (data) {
            wx.switchTab({
              url: '../coupon/coupon',
            })
          },
          fail: function () {
            wx.showToast({
              title: '系统错误,请稍后重试',
              icon: 'loading'
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统错误,请稍后重试',
          icon: 'loading'
        })
      }
    })
  },
  
})