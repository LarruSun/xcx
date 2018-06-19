// pages/mine/indent/line_item/line_item.js
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
    var orderId = options.orderId
    if (orderId != null) {
      this.setData({
        orderId: options.orderId
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '数据错误',
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
      that.getOrderDetail()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  getOrderDetail: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/getOrderDetail.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        orderId: that.data.orderId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        for (var i = 0; i < pageData.CyOrder.cyOrderProdes.length; i++) {
          pageData.CyOrder.cyOrderProdes[i].prodAllPrice = parseFloat(pageData.CyOrder.cyOrderProdes[i].prodAllPrice / 100).toFixed(2)
        }
        pageData.CyOrder.deliveryFee = parseFloat(pageData.CyOrder.deliveryFee / 100).toFixed(2)
        for (var i = 0; i < pageData.SummaryOrderDiscount.length; i++) {
          pageData.SummaryOrderDiscount[i].discountmoney = parseFloat(pageData.SummaryOrderDiscount[i].discountmoney / 100).toFixed(2)
        }
        pageData.payTotal = parseFloat(pageData.payTotal / 100).toFixed(2)
        that.setData({
          pageData: pageData
        })
        wx.hideLoading()
      },
      fail: function () {

      }
    })
  },
  //进入对应餐饮外卖
  goToTakeOut: function (e) {
    wx.redirectTo({
      url: '../../../index_order/index?shopId=' + this.data.pageData.shop.id
    })
  },
  //再来一单
  takeAgain: function(e) {
    wx.redirectTo({
      url: '../../../index_order/index?shopId=' + this.data.pageData.shop.id + '&orderId=' + this.data.orderId
      })
  }
})