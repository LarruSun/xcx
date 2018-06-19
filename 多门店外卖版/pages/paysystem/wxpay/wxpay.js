// wxpay.js
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
      orderId: options.orderId,
      type: options.type
    })
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: wx.getStorageSync('storage_bg'),
  })
  this.pageTab()
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
    // this.pageTab()
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
      this.toWxPay()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  toWxPay:function(e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/getVipPayData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        orderId: that.data.orderId,
        shopId: that.data.shopId
      },
      success: function (data) {
        if (data.statusCode == 404) {

        }
        var pageData = data.data
        pageData.order.payTotal = (pageData.order.payTotal / 100).toFixed(2)
        pageData.order.soTotal = (pageData.order.soTotal / 100).toFixed(2)
        var youhui = (pageData.order.soTotal - pageData.order.payTotal).toFixed(2)
        console.log(pageData)
        that.setData({
          pageData: pageData,
          youhui: youhui
        })
      },
      fail: function () {

      }
    })
  },

  //微信支付
  primary:function(e) {
    var that = this
    if(that.data.type == 'eatIn') {
      wx.request({
        url: getApp().data.pathApi +'/order/utils/wxPayByOrder',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          openId: that.data.userInfo.openId,
          orderId: that.data.pageData.order.id,
          body: that.data.pageData.order.orderName,
  
        },
        success: function (data) {
          if (data.statusCode == 200) {
            var pageData = data.data
            console.log(pageData)
  
            //发起支付
            var timeStamp = pageData.data.timeStamp
            console.log("timeStamp:" + timeStamp)
            var packages = pageData.data.package
            console.log("package:" + packages)
            var paySign = pageData.data.sign
            console.log("paySign:" + paySign)
            var nonceStr = pageData.data.nonce_str
            console.log("nonceStr:" + nonceStr)
            var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
            that.pay(param)
          } else {
            wx.showModal({
              title: '提示',
              content: '支付失败',
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
        fail: function () {
  
        }
      })
    }else {
      wx.request({
        url: getApp().data.pathApi +'/utils/wxPayByOrder.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          openId: that.data.userInfo.openId,
          orderId: that.data.pageData.order.id,
          body: that.data.pageData.order.orderName,
  
        },
        success: function (data) {
          if (data.statusCode == 200) {
            var pageData = data.data
            console.log(pageData)
  
            //发起支付
            var timeStamp = pageData.data.timeStamp
            console.log("timeStamp:" + timeStamp)
            var packages = pageData.data.package
            console.log("package:" + packages)
            var paySign = pageData.data.sign
            console.log("paySign:" + paySign)
            var nonceStr = pageData.data.nonce_str
            console.log("nonceStr:" + nonceStr)
            var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
            that.pay(param)
          } else {
            wx.showModal({
              title: '提示',
              content: '支付失败',
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
        fail: function () {
  
        }
      })
    }
  },
  /* 支付   */
  pay: function (param) {
    console.log("支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        console.log("支付")
        console.log(res)
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: function (res) {
            wx.switchTab({
              url: '../../mine/indent/indent'
            })
            wx.removeStorageSync('shoppingList');
            wx.removeStorageSync('shoppingSum');
            wx.removeStorageSync('shoppingNum');
          }
        })
      },
      fail: function (res) {
        // fail
        console.log("支付失败")
        console.log(res)
      },
      complete: function () {
        // complete
        console.log("pay complete")
      }
    })
  }
})