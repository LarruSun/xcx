// pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txton: "txton",
    rote: "rote",
    showSelectPayMethod: false,
    disabled: '',
    clock: '',
    timStr: '',
    timeTemp: '',
    timer: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(this.count_down())
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
    if (options.orderId) {
      this.setData({
        orderId: options.orderId,
        shopId: options.shopId,
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
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
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
      this.toPay()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  toPay: function () {
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/toPay.do',//自己的服务接口地址
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
        console.log(pageData)
        pageData.bAmount = (pageData.bAmount * 0.01).toFixed(2)
        pageData.payTotal = (pageData.payTotal * 0.01).toFixed(2)
        that.setData({
          pageData: pageData
        })
        that.count_down(pageData.order.createDate);
      },
      fail: function () {

      }
    })
  },
  isshowAll: function (e) {
    var txton = this.data.txton == "" ? "txton" : "";
    var rote = txton == "" ? "" : "rote";
    this.setData({
      txton: txton,
      rote: rote
    })
  },
  selectPayMethod: function (e) {
    var that = this
    console.log(that.data.pageData.checkPay)
    if (that.data.pageData.checkPay == 0) {
      that.setData({
        disabled: 'disabled'
      })
    } else {
      that.setData({
        disabled: ''
      })
    }
    var showSelectPayMethod = this.data.showSelectPayMethod ? false : true;
    this.setData({
      showSelectPayMethod: showSelectPayMethod
    })
  },
  hideSelectPayMethod: function (e) {
    this.setData({
      showSelectPayMethod: false
    })
  },
  towxpay: function (e) {
    wx.navigateTo({
      url: '../paysystem/wxpay/wxpay?orderId=' + this.data.orderId,
    })
  },
  toequalpay: function (e) {
    wx.navigateTo({
      url: '../paysystem/equalpay/equalpay?orderId=' + this.data.orderId,
    })
  },

  // 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数

  /* 毫秒级倒计时 */
  count_down: function (timeTemp) {//倒计时：接收以毫秒为单位的时间段
    var that = this;
    var zhifuTottime = 15 * 60 * 1000;//支付总时间毫秒数
    var shengyu = Date.parse(new Date()) - timeTemp
    var date = zhifuTottime - shengyu
    if (date > 0) {  //有效支付时间段
      that.data.timer = setInterval(function () {
        // 放在最后--
        if (date < 0) {
          clearInterval(that.data.timer);
        } else {
          date -= 1000;
          var s = that.date_format(date);
          that.setData({
            timeTemp: s
          })
        }
        console.log(that.date_format(date))
        // }          
      }, 1000)
    } else {
      //订单时间已超过15分钟
      that.setData({
        timeTemp: '支付时间已过期',
        timeDisabled: 'disabled'
      })
    }

  },

  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format: function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = this.fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return min + "分" + sec + "秒";
  },

  // 位数不足补零
  fill_zero_prefix: function (num) {
    return num < 10 ? "0" + num : num
  }



})