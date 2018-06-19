// pages/mine/number/number.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance_header: {
      balance_header_money: '23.00',
      top_doing: '2'
    },
    Online_body: [
      {
        Online_name: '线上消费',
        Online_balance: '50.00',
        Online_time: '2016-12-13',
        Online_down: '-50.00',
      },
      {
        Online_name: '红包支出',
        Online_balance: '150.00',
        Online_time: '2016-12-13',
        Online_down: '-50.00',
      },
      {
        Online_name: '线上充值',
        Online_balance: '50.00',
        Online_time: '2016-12-13',
        Online_down: '+50.00'
      },
      {
        Online_name: '线下消费',
        Online_balance: '50.00',
        Online_time: '2016-12-13',
        Online_down: '-50.00',
      },
      {
        Online_name: '线下充值',
        Online_balance: '50.00',
        Online_time: '2016-12-13',
        Online_down: '+50.00',
        Online_money: "on"
      },
      {
        Online_name: '红包收入',
        Online_balance: '50.00',
        Online_time: '2016-12-13',
        Online_down: '+50.00',
        Online_money: "on"
      }
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
  integral_ctivities: function () {
    wx.navigateTo({
      url: '../integral/integral_ctivities/integral_ctivities',
    })
  }
})