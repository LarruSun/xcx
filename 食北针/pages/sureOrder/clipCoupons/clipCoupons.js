// pages/sureOrder/clipCoupons/clipCoupons.js
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
      shopId: options.shopId
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
  radioHref: function () {
    console.log("使用优惠券")
  },
  Nocoupons: function () {
    console.log("不使用优惠券")
  },
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  //页面标签切换及数据加载基础
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      this.getMyCouponsByShop()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //根据门店获取用户领取的优惠券
  getMyCouponsByShop: function (e) {
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/getMyCouponsByShop.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        shopId: that.data.shopId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        that.setData({
          pageData: pageData
        })
      },
      fail: function () {

      }
    })
  },
  //选择优惠券
  chooseCoupon: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var data_ = that.data.pageData
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    for(var i = 0; i < data_.length; i++) {
      if(data_[i].id == id) {
        var couponsName = data_[i].couponsName
        var couponId = data_[i].id
        var couponAmount = data_[i].vouchers.toFixed(2)
        var lowestConsume = data_[i].lowestConsume
        var couponName = data_[i].couponsName
        var couponType = 0
        if (data_[i].couponsType != null) {
          couponType = data_[i].couponsType
        }
        wx.request({
          url: 'https://www.eaqul.com/smallRoutineUser/utils/chooseCoupon.do',//自己的服务接口地址
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            couponId: data_[i].couponsId,
          },
          success: function (data) {
            var pageData = data.data
            if(pageData.msgCode == "success") {
              prevPage.setData({
                yhq: couponsName,
                couponId: couponId,
                couponAmount: couponAmount,
                couponName: couponsName,
                lowestConsume: lowestConsume,
                couponType: couponType
              })
              wx.navigateBack({
                delta: 1
              })
            }else {
              wx.showModal({
                title: '提示',
                content: pageData.message,
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
    }
  },
  //不使用优惠券
  noCoupon:function(e) {
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2]; 
    prevPage.setData({
      yhq: '选择优惠券',
      couponId: '',
      couponAmount: '',
      lowestConsume: ''
    })
    wx.navigateBack({
      delta: 1
    })
  }
})