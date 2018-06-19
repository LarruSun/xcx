/* pages/mine/score */
var app = getApp();
var arr = [];

Page({
  data: {
    hidden: 'none'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene);
    this.scene = scene;
    this.getData();
  },
  getData: function(){
    var that = this;
    wx.request({
      url: getApp().data.pathApi + '/utils/getCouponListByPosterId',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        posterId: this.scene
        //posterId: 'b3dfa1063efc410bb3b79c7974e9f988'
      },
      success: function (data) {
        var score = data.data.data;
        arr = score;
        that.setData({
          score: score
        })
        
      },
      fail: function () {
        wx.navigateBack
      },
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
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  use: function(){
    wx.reLaunch({
      url: '../../../index/index',
    })
  },
  look: function(){
    wx.navigateTo({
      url: '../../../coupon/coupon',
    })
  },
  change: function (e) {
    var index = e.target.dataset.id; 
    var data = arr[index];
    var putId = data.putId,
        openId = wx.getStorageSync('userInfo_').openId,
        couponId = data.id,
        that = this;
    wx.request({
      url: getApp().data.pathApi + '/utils/receiveCoupon',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: openId,
        couponId: couponId,
        putId: putId
      },
      success: function (data) {
        var log = data.data;
        that.setData({
          log: log,
          hidden: 'block'
        })
      },
      fail: function () {
        wx.navigateBack
      },
    })
  },
  close: function () {
    this.setData({
      hidden: 'none'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})