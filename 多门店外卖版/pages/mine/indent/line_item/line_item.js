// pages/mine/indent/line_item/line_item.js
const app = getApp();
Page({
  data: {
    orederNo: '',
    discountmoney: ''
  },

  onLoad: function (options) {
    var orderId = options.orderId
    if (orderId != null) {
      this.setData({
        orderId: options.orderId,
        type: options.type,
        orderNo: options.orderNo
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
  onShow: function () {
    this.pageTab()
  },
  call(event){
    app.callPhone(event.currentTarget.dataset.phone)
  },
  //页面标签切换及数据加载基础
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
        that.getOrderDetail()
      })
    } else {
      that.getOrderDetail()
    }
  },
  getOrderDetail: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/getOrderDetail.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        orderId: that.data.orderId
      },
      success: function (data) {
        wx.hideLoading()
        let pageData = data.data;
        that.setData({
          pageData: pageData
        })
        if(that.data.type == 'TSCATERING') {
          that.setData({
            eatInremark: JSON.parse(pageData.CyOrder.surcharge)
          })
        }
        if(pageData.order.summaryOrderDiscounts && pageData.order.summaryOrderDiscounts.length != 0) {
          that.setData({
            discountmoney: pageData.order.summaryOrderDiscounts[0].discountmoney
          })
        }
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