/* pages/mine/score */
var app = getApp();
var arr = [];
var page = 1;
Page({
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getData();
  },

  getData: function(){
    var that = this,
        shopId = app.shopId,
        openId = app.openId;
    wx.request({
      url: getApp().data.pathApi + '/utils/getIntegralRecordList.do',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        shopId: shopId,
        openId: openId,
        pageNum: page,
        pageSize: 12
      },
      success: function (data) {
        var scoreList = data.data.data.memberIntegralRecordList;
        for (var i = 0; i < scoreList.length; i++){
          arr.push(scoreList[i])
        }
        that.setData({
          scoreList: arr
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
  score_rule: function(){
    wx.navigateTo({
      url: '../scoreRule/scoreRule',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("我再下拉")
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page = page + 1; 
    wx.showLoading({
      title: '玩命加载中',
    })  
    this.getData();
    wx.hideLoading();  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})