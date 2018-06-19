/* pages/mine/score */
var app = getApp()

Page({
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopId = app.shopId,
        name = app.name,
        that = this;
    wx.request({
      url: getApp().data.pathApi + '/utils/getMemberIntegralSettingByShopId.do',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        shopId: shopId
      },
      success: function (data) {
        console.log(data);
        var amount = data.data.data.memberIntegralSetting.amount;
        that.setData({
          amount: amount,
          name: name
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

  }
})