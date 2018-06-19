// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance_header: {
      balance_header_money: '',
      top_doing: ''
    },
    Online_body: [
    ]
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
      that.toIntegral()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  toIntegral: function () {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/toIntegral.do',//自己的服务接口地址
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
          balance_header: {
            balance_header_money: pageData.integral,
            top_doing: pageData.activeNum,
          },
          Online_body: pageData.records
        })
      },
      fail: function () {

      }
    })
  },
  integral_ctivities: function () {
    wx.navigateTo({
      url: '../integral/integral_ctivities/integral_ctivities',
    })
  }
})