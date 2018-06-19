// pages/mine/integral/integral_ctivities/integral_ctivities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container_discounta: [
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
      that.toJifenActive()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  toJifenActive: function () {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/toJifenActive.do',//自己的服务接口地址
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
          logo: pageData.logo,
          name: pageData.name,
          container_discounta: pageData.activityList
        })
      },
      fail: function () {

      }
    })
  },
  //活动详细兑换页面
  toChange:function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    for (var i = 0; i < that.data.container_discounta.length; i++) {
      if (id == that.data.container_discounta[i].id) {
        var aData = JSON.stringify(that.data.container_discounta[i]);
        wx.navigateTo({
          url: '../../Change_Settings/Change_Settings?aData=' + aData
        })
      }
    }
  },
})