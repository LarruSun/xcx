// bussinessInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount_Coupon2: {
      // small_bg: '../../../images/small_redBg.png',
      // coupon_logo: '../../../images/img/eq.png',
      // coupon: [{
      //   full_available: '满80可用',
      //   full_available_money: '10',
      //   logo_name: '鲍鱼火锅',
      //   hotpot_messageCoupon: '鲍鱼火锅10元代金券',
      //   coupon_startDate: '2016-10-21',
      //   coupon_endDate: '2016-12-03',
      // }]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId: options.shopId,
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
    this.pageTab()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
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
      that.getShopInfo()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  getShopInfo: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        wx.request({
          url: getApp().data.pathApi+'/utils/getShopInfo.do',//自己的服务接口地址
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            openId: that.data.userInfo.openId,
            shopId: that.data.shopId,
            longitude: that.data.location.longitude,
            latitude: that.data.location.latitude
          },
          success: function (data) {
            var pageData = data.data
            console.log(pageData)
            that.setData({
              address:pageData
            })
          },
          fail: function () {

          }
        })
      }
    })

  },
  bindCoupon:function(e) {
    //领取优惠券
    wx.request({
      url: getApp().data.pathApi+'/utils/receiveCoupon.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        couponId: e.currentTarget.dataset.id,
        openId: this.data.userInfo.openId,
      },
      success: function (data) {
        if (data.data.msgCode == "fail") {
          wx.showToast({
            title: data.data.message,
            icon: 'loading',
            duration: 1000
          })
        }else {
          wx.showToast({
            title: data.data.message,
            icon: 'success',
            duration: 1000
          })
        }
        
      },
      fail: function () {
        wx.showToast({
          title: '系统错误,请稍后重试',
          icon: 'loading'
        })
      }
    })
  }
})