// pages/coupon/coupon_href/coupon_href.js
var wxbarcode = require('../../../utils/index.js');
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
    wx.getStorageSync('storage_bg')
    this.setData({
      couponId: options.couponId
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
      that.couponInfo()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //优惠券详细信息
  couponInfo:function(e) {
    var that = this
    wx.request({
      url: "https://www.eaqul.com/smallRoutineUser/utils/couponInfo.do",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        couponId: that.data.couponId,
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        that.setData({
          pageData: pageData
        })
        wxbarcode.barcode('barcode', pageData.receiveCode, 500, 150);
      }
    })
  },
})