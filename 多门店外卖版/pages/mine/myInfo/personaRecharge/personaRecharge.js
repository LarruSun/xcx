// pages/activate/activate.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    userInfo: {},
    pwd: '',
    pwdAgain: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      var phone = userInfo.phone
      var myphone = phone.substr(3, 4)
      var lphone = phone.replace(myphone, "****");
      that.setData({
        myphone: lphone
      })
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
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
  pwdInputEvent: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  pwdAgainInputEvent: function (e) {
    this.setData({
      pwdAgain: e.detail.value
    })
  },
  verifyCodeEvent: function (e) {
    if (this.data.buttonDisable) return false;
    var mobile = this.data.userInfo.phone;
    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '手机号有误！'
      })
      return false;
    }
    var that = this;
    var c = 60;
    //获取短信验证码接口
      wx.request({
        url: getApp().data.pathApi + '/utils/smallRoutineGetCode.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          contactPhone: mobile,
          openId: that.data.userInfo.openId,
          code: "20"
        },
        success: function (data) {
          if (data.data.type == "success") {
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
            wx.showToast({
              title: data.data.message,
              icon: 'success'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: "短信发送失败",
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

        }
      })

  },

  //
  submitGet: function (e) {
    if (this.data.submitDisable) return false;
    var mobile = this.data.userInfo.phone;
    var code = this.data.code;
    var openId = this.data.userInfo.openId;
    var pwd = this.data.pwd;
    var pwdAgain = this.data.pwdAgain;
    var regMobile = /^1\d{10}$/;
    var regCode = /^\d{4}$/;
    var regPwd = /^\d{6}$/;
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
      return false;
    }
    if (!regPwd.test(pwd)) {
      wx.showToast({
        title: '请输入6位有效数字！',
        icon: 'loading'
      })
      return false;
    }
    if (!regPwd.test(pwdAgain)) {
      wx.showToast({
        title: '请输入6位有效数字！',
        icon: 'loading'
      })
      return false;
    }
    if (pwd != pwdAgain) {
      wx.showToast({
        title: '密码不一致,请重新输入！',
        icon: 'loading'
      })
      return false;
    }
    //检查验证码是否正确
    wx.request({
      url: getApp().data.pathApi +'/utils/submitGet.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        contactPhone: mobile,
        code: code,
        openId: openId,
        typeId:20
      },
      success: function (data) {
        if (data.data.type == "success") {
          //修改支付密码
          wx.request({
            url: getApp().data.pathApi +'/utils/changePwd.do',//自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
              openId: openId,
              pwd: pwd,
              pwdAgain: pwdAgain
            },
            success: function (data) {
              var pageData = data.data
              if (pageData.type == "success") {
                wx.showModal({
                  title: '提示',
                  content: '修改支付密码成功!',
                  showCancel:false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
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
        }else {
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
  },

})