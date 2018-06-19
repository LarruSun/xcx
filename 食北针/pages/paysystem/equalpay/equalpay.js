// equalpay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipPayPwd: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        orderId: options.orderId,
        shopId: options.shopId
      })
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })

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
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: this.data.userInfo.openId,
      authContent: '使用指纹密码进行支付',
      success(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: res,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
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
      this.getVipPayData()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  getVipPayData: function () {
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/getVipPayData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        orderId: that.data.orderId,
        shopId: that.data.shopId
      },
      success: function (data) {
        if (data.statusCode == 404) {

        }
        var pageData = data.data
        pageData.order.payTotal = (pageData.order.payTotal / 100).toFixed(2)
        pageData.order.soTotal = (pageData.order.soTotal / 100).toFixed(2)
        var youhui = (pageData.order.soTotal - pageData.order.payTotal).toFixed(2)
        console.log(pageData)
        that.setData({
          pageData: pageData,
          youhui: youhui
        })
      },
      fail: function () {

      }
    })
  },
  getthisPwd: function (e) {

    var thisPwd = e.currentTarget.dataset.val;
    var vipPayPwd = this.data.vipPayPwd;
    if (thisPwd < 0) {
      if (vipPayPwd.length > 0) {
        vipPayPwd.pop();
      }
    }
    if (thisPwd >= 0 && vipPayPwd.length < 6) {
      vipPayPwd.push(thisPwd);
    }
    this.setData({
      vipPayPwd: vipPayPwd
    })
    if (vipPayPwd.length == 6) {
      console.log("可以拿去比对密码了")
      var pwd = ''
      for (var i = 0; i < vipPayPwd.length; i++) {
        pwd += vipPayPwd[i]
      }
      console.log(pwd)
      wx.showLoading({
        title: '正在请求...',
      })
      wx.request({
        url: 'https://www.eaqul.com/smallRoutineUser/utils/checkPassword.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          openId: this.data.userInfo.openId,
          orderId: this.data.orderId,
          pwd: pwd
        },
        success: function (data) {
          if (data.statusCode == 404) {

          }
          var pageData = data.data
          if (pageData.errorMsg == '密码错误') {
            wx.hideLoading()
            wx.showModal({
              showCancel:false,
              title: '提示',
              content: pageData.errorMsg,
              success: function (res) {
                if (res.confirm) {
                  if (thisPwd >= 0 && vipPayPwd.length < 6) {
                    vipPayPwd.push();
                  }
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  if (thisPwd >= 0 && vipPayPwd.length < 6) {
                    vipPayPwd.push();
                  }
                  console.log('用户点击取消')
                }
              }
            })
          }
          if (pageData.errorMsg == '支付成功') {
            wx.hideLoading()
            wx.switchTab({
              url: '../../mine/indent/indent'
            })
          }else {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: pageData.errorMsg,
              success: function (res) {
                if (res.confirm) {
                  if (thisPwd >= 0 && vipPayPwd.length < 6) {
                    vipPayPwd.push();
                  }
                  console.log('用户点击确定')

                } else if (res.cancel) {
                  if (thisPwd >= 0 && vipPayPwd.length < 6) {
                    vipPayPwd.push();
                  }
                  console.log('用户点击取消')
                }
              }
            })
          }
          console.log(pageData)
        },
        fail: function () {
          wx.hideLoading()
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '会员扣款发送错误,请重试',
            success: function (res) {
              if (res.confirm) {
                if (thisPwd >= 0 && vipPayPwd.length < 6) {
                  vipPayPwd.push();
                }
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../../mine/indent/indent'
                })

              } else if (res.cancel) {
                if (thisPwd >= 0 && vipPayPwd.length < 6) {
                  vipPayPwd.push();
                }
                console.log('用户点击取消')
                wx.switchTab({
                  url: '../../mine/indent/indent'
                })
              }
            }
          })
        }
      })
    }
  },
  toeditpwd: function (e) {
    wx.redirectTo({
      url: '../../mine/myInfo/personaRecharge/personaRecharge',
    })
  }
})