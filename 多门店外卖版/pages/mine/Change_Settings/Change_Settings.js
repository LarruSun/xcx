// pages/mine/integral/integral_ctivities/Change_Settings/Change_Settings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aData = JSON.parse(options.aData);
    console.log(aData);
    this.setData({
      aData: aData
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
      this.changeActive()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  changeActive: function (e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/changeActive.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        that.setData({
          pageData: pageData
        })
      },
      fail: function () {

      }
    })
  },
  jifenNum: function (e) {
    var that = this
    var num = e.detail.value * (that.data.aData.convertRate / 100)
    that.setData({
      chuzhi: num,
      jifen: e.detail.value
    })
  },

  //确认兑换
  primary: function (e) {
    var that = this
    var integral = parseInt(that.data.jifen)
    var minIntegral = that.data.aData.minIntegral
    var maxIntegral = that.data.aData.maxIntegral
    var myIntegral = parseInt(that.data.pageData.integral)
    var convertScene = 0
    var convertId = that.data.aData.id
    if (integral >= minIntegral && integral <= maxIntegral && integral <= myIntegral) {
      wx.request({
        url: getApp().data.pathApi +'/utils/jifenExchange.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          openId: that.data.userInfo.openId,
          integral: integral,
          convertScene: convertScene,
          convertId: convertId
        },
        success: function (data) {
          var pageData = data.data
          if (pageData.msgCode == true || pageData.msgCode == "true") {
            wx.navigateBack({
              delta: 2
            })
          }
        },
        fail: function () {

        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您输入的积分不满足兑换要求',
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
})