// pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valuble: 0,
    currentId: '0',
    section: [
      { name: '未使用', id: '0', num: '0' },
      { name: '使用记录', id: '1', num: '0' },
      { name: '已过期', id: '2', num: '0' }
    ],
    //未使用
    discount_Coupon2: {

    },
    //使用记录
    discount_Couponed: {

    },
    //已过期
    stale_DatedCouponed: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("onLoad")
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
    console.log('onShow')
    this.couponTab()
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
  //横向导航
  handleTap: function (e) {
    let id = e.currentTarget.id;
    if (id) {
      this.setData({ currentId: id })
      this.couponTab(id);
    }
  },
  //页面标签切换及数据加载基础
  couponTab: function (params) {
    var that = this
    if (!params) {
      params = that.data.currentId
    }
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      that.getUserCouponData(userInfo.openId, params)
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  //获取优惠券数据
  getUserCouponData: function (openId, i) {
    var that = this
    wx.request({
      url: "https://www.eaqul.com/smallRoutineUser/utils/getUserCouponData.do",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        couponType: i
      },
      success: function (data) {
        var coupons = data.data
        coupons = coupons[0]
        that.setData({
          section: [
            { name: '未使用', id: '0', num: coupons.useCoupon.length },
            { name: '使用记录', id: '1', num: coupons.isuseCoupon.length },
            { name: '已过期', id: '2', num: coupons.lostCoupon.length }
          ],
          //未使用
          discount_Coupon2: {
            small_bg: '/images/small_redBg.png',
            coupon_logo: '/images/logo_stort.png',
            coupon: coupons.useCoupon
          },
          //使用记录
          discount_Couponed: {
            small_bg: '/images/been_bg.png',
            coupon_logo: '/images/been_used.png',
            coupon: coupons.isuseCoupon
          },
          //已过期
          stale_DatedCouponed: {
            small_bg: '/images/been_bg.png',
            coupon_logo: '/images/been_used.png',
            coupon: coupons.lostCoupon
          }
        })
      }
    })
  },
  Coupon_href: function (e) {
    var couponId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../coupon/coupon_href/coupon_href?couponId=' + couponId
    })
  }
})

