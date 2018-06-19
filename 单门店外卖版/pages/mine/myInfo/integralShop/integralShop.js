/* pages/mine/score */
var app = getApp();
var arr = [];
var page = 1;
var pages;
Page({
  data: {
    hidden: 'none',
    dialog: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData: function(){
    var shopId = app.shopId,
        that = this;
    wx.request({
      url: getApp().data.pathApi + '/utils/getNewcouponListByShopId.do',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        shopId: shopId,
        pageNum: page,
        pageSize: 10
      },
      success: function (data) {
        var score = data.data.data;
        pages = score.pages;
        
        console.log(pages)
        console.log(score);
        for (var i = 0; i < score.list.length; i++) {
          arr.push(score.list[i])
        }
        console.log(arr)
        that.setData({
          score: arr
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
    console.log(app)
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
    arr = [];
    page = 1;
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
    page = page + 1;
    if (page > pages || pages == 0) {
      return;
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    this.getData();
    wx.hideLoading();
  },
  change: function(e){
    var index = e.target.dataset.id;
    var data = arr[index];
    this.setData({
      hidden: 'block',
      data: data
    })
  },
  close: function(){
    this.setData({
      hidden: 'none'
    })
  },
  changeIntegral: function(e){
    var shopId = app.shopId,
        openId = app.openId,
        id = e.target.dataset.id,
        that = this;
    wx.request({
      url: getApp().data.pathApi + '/utils/IntegralExchageCoupon.do',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        shopId: shopId,
        openId: openId,
        integerExchangeId: id
      },
      success: function (data) {
        var logData = data.data;
        console.log(logData);
        that.setData({
          dialog: 'block',
          logData: logData
        })
        setTimeout(function () {
          that.setData({
            dialog: 'none',
            hidden: 'none'
          })
        }.bind(that), 2000)

      },
      fail: function () {
        wx.navigateBack()
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})