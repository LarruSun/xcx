// pages/mine/balance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance_header: {
      balance_header_money: '0.00',
      top_doing: '2'
    },
    Online_body: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var that = this

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
  //页面标签切换及数据加载基础
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      that.toBalanceRecord()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  toBalanceRecord: function () {
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/toBalanceRecord.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {        
        if(data.statusCode == 200) {
          var pageData = data.data
          console.log(pageData)
          that.setData({
            balance_header: {
              balance_header_money: pageData.balance,
            },
            Online_body: pageData.record
          })
        }else {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function () {

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toOnlineRecharge: function () {
    wx.navigateTo({
      url: '../onlineTopup/onlineTopup',
    })
  }
})