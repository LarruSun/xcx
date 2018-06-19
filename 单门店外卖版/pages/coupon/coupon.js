// pages/coupon/coupon.js
var app = getApp();
var section = [], arr1 = [], arr2 = [], arr3 = [], page1 = 1, pages;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    valuble: 0,
    currentId: '0',
    handleTapData: [
      {
        name: '未使用', id: '0', num: 0, page: 1, pages
      },
      {
        name: '使用记录', id: '1', num: 0, page: 1, pages
      },
      {
        name: '已过期', id: '2', num: 0, page: 1, pages
      }
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg')
    })
    this.getCouponData(0);
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
    //this.couponTab()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //var section = [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    arr1 = [];
    arr2 = [];
    arr3 = [];
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
    page = page + 1;
    if (page > pages || pages == 0) {
      return;
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    this.id = this.id ? this.id : 0;
    if (this.id == 0) {
      this.getNoUsedCouponData(0);
    } else if (this.id == 1) {
      this.getUsedCouponData(1);
    } else {
      this.getExpiredCouponData(2);
    }
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //横向导航
  handleTap: function (e) {
    var id = e.currentTarget.id;
    this.id = id;
    this.setData({ currentId: id })
    //this.couponTab(id);
    if (id == 0 && arr1.length == 0) {
      this.getCouponData(id);
    } else if (id == 1 && arr2.length == 0) {
      this.getCouponData(id);
    } else if (id == 2 && arr3.length == 0) {
      this.getCouponData(id);
    }

  },
  //页面标签切换及数据加载基础
  /*couponTab: function (params) {
    var that = this;
    if (!params) {
      params = that.data.currentId
    }
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },*/

  //获取未使用优惠券数据
  getCouponData: function (id) {
    console.log(section);
    var that = this,
    openId = app.openId;
    var page = that.data.handleTapData[id].page
    wx.request({
      url: getApp().data.pathApi + "/utils/getCouponReceiveuseByOpenId",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        statu: id,
        pageNum: page,
        pageSize: 10
      },
      success: function (data) {
        if (data.statusCode == 200 && data.data.type == "success") {
          var coupons = data.data.data;
          pages = coupons.pageInfo.pages;
          var tapData = that.data.handleTapData
          tapData[0].num = coupons.canUseNum
          tapData[1].num = coupons.useNum
          tapData[2].num = coupons.outDateNum
          tapData[id].pages = coupons.pageInfo.pages
          if (id == 0) {

            for (var i = 0; i < coupons.pageInfo.list.length; i++) {
              arr1.push(coupons.pageInfo.list[i])
            }
          } else if (id == 1) {
            for (var i = 0; i < coupons.pageInfo.list.length; i++) {
              arr2.push(coupons.pageInfo.list[i])
            }
          } else if (id == 2) {
            for (var i = 0; i < coupons.pageInfo.list.length; i++) {
              arr3.push(coupons.pageInfo.list[i])
            }
          }

          console.log(section);
          that.setData({
            handleTapData: tapData,
            //未使用
            discount_Coupon2: {
              coupon: arr1
            },
            discount_Couponed: {
              coupon: arr2
            },
            stale_DatedCouponed: {
              coupon: arr3
            },
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: true,
            content: data.data.message,
          })
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var tapData = this.data.handleTapData
    for (var i = 0; i < 2; i++) {
      tapData[i].page = 1
    }
    this.setData({
      handleTapData: tapData,
    })
    arr1 = [], arr2 = [], arr3 = []
    this.getCouponData(this.data.currentId);
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom: function () {
    var id = this.data.currentId
    var p = this.data.handleTapData[id].page
    var ps = this.data.handleTapData[id].pages
    if (p < ps) {
      var tapData = this.data.handleTapData
      tapData[id].page = p + 1
      this.getCouponData(id);
      this.setData({
        handleTapData: tapData,
      })
    }
  }
})

