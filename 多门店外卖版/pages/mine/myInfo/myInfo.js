// pages/mine/myInfo/myInfo.js
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
    this.setData({
      cardNum: options.cardNum
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
        var phone = that.data.userInfo.phone
        var myphone = phone.substr(3, 4)
        var lphone = phone.replace(myphone, "****");
        var mine_one_phone = lphone
      that.setData({
        name: that.data.userInfo.nickName,
        cardNum: that.data.cardNum,
        phone: mine_one_phone,
        avatarUrl: that.data.userInfo.avatarUrl,
      })
      wx.setStorageSync('UserImage', that.data.userInfo.avatarUrl)
      //console.log(that.data.userInfo.avatarUrl)
    } else {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  address: function () {
    var fromWhere = "myInfo"
    wx.navigateTo({
      url: '../myInfo/selectAddr/selectAddr?fromWhere=' + fromWhere,
    })
  },
  personalData: function () {
    if(this.data.userInfo.phone != null) {
      wx.navigateTo({
        url: '../myInfo/personalData/personalData',
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '尚未绑定手机号！',
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
  changePwd: function () {
    wx.navigateTo({
      url: '../myInfo/personaRecharge/personaRecharge',
    })
  },
})