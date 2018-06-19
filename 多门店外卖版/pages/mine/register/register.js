// pages/mine/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonDisable: true,
    verifyCodeTime: '获取验证码',
    attention: "未注册本餐厅的手机号，登录时将自动注册，且代表您同意《用户服务协议》。",
    getCodeClass:'',
    vliCodeTrue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.pageTab()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
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
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {

    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //手机号输入获取
  phoneInputEvent: function (e) {
    if (e.detail.value.length < 11) {
      this.setData({
        buttonDisable: true,
        getCodeClass: ''
      })
    }
    if (e.detail.value.length == 11) {
      var mobile = e.detail.value;
      var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!regMobile.test(mobile)) {
        this.setData({
          buttonDisable: true,
          getCodeClass: ''
        })
        wx.showToast({
          title: '手机号有误！'
        })
      }else {
        this.setData({
          buttonDisable: false,
          phone: e.detail.value,
          getCodeClass:'canTap'
        })
        console.log(89)
      }
    }
  },
  //验证码输入获取
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value,
      vliCodeTrue:false
    })
  },
  //获取验证码
  verifyCodeEvent: function (e) {
    if (this.data.buttonDisable) return false;
    var mobile = this.data.phone;
    var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '手机号有误！'
      })
      return false;
    }
    var that = this;
    var c = 60;
    var intervalId = setInterval(function () {
      c = c - 1;
      that.setData({
        verifyCodeTime: c + 'S',
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
    app.sendVerifyCode(mobile, that.data.userInfo.openId, "20");//获取短信验证码接口
  },
  //绑定用户手机号
  bindMemberPhone: function (e) {
    if (this.data.submitDisable) return false;
    var mobile = this.data.phone;
    var code = this.data.code;
    var openId = this.data.userInfo.openId;
    var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var regCode = /^\d{4}$/;
    var that = this
    if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'loading'
      })
      return false;
    }
    if (!regCode.test(code)) {
      wx.showToast({
        title: '请输入4位有效验证码数字！',
        icon: 'loading'
      })
      that.setData({
        vliCodeTrue: true
      })
      return false;
    }
    //检查验证码是否正确
    //绑定手机号
    wx.request({
      url: getApp().data.pathApi +'/utils/bindMemberPhone.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        contactPhone: mobile,
        code: code,
        openId: openId,
        typeId: 20
      },
      success: function (data) {
        console.log(data);
        if (data.data.type == "success") {
          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })
          wx.showToast({
            title: data.data.message,
            icon: 'success',
            success: function () {
              wx.switchTab({
                url: '../../mine/mine'
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: data.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          
        }
      },
      fail: function () {
        wx.showToast({
          title: '系统错误,请稍后重试',
          icon: 'loading'
        })
      }
    })
  }
})