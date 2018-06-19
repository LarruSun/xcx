/* pages/mine/score */
var app = getApp()
var arr = [];
Page({
  data: {
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var list = JSON.parse(options.shopList);
    this.list = list;
    for (var i = 0; i < list.length; i++) {
      arr.push(list[i].branchName)
    }
    if (options.shopList != null) {
      this.setData({
        shopList: list
      })
    }
  },

  searchStore: function (e) {
    var reg = e.detail.value.toUpperCase();
    var list = this.list;
    var listArr = [], a;
    if(reg == ''){
      this.setData({
        shopList: list
      })
      return;
    } 
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(reg) > -1) {
        a = i
      }
    }
    if (list[a] == undefined){
      this.setData({
        shopList: ''
      })
      return
    }
    listArr.push(list[a])
    this.setData({
      shopList: listArr
    })
  },


  getValue: function (reg) {

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

  },

  goToTakeOut: function (e) {
    const shopId = e.currentTarget.dataset.id;
    const isKy = e.currentTarget.dataset.ky;
    wx.navigateTo({
      url: '../index?shopId=' + shopId
    })
  }
})