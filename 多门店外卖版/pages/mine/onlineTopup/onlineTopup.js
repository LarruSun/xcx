// pages/mine/onlineTopup/onlineTopup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeData: {
      payType: '会员在线充值',
      settingId: '',
      sumMoney: '',
      giftMoney: '',
      type: 'mobilePay'
    },
    balance_header: {

    },
    keyBord: [
      
    ],
    items: [
      { name: 'czxy', value: '《易快》充值协议', checked: 'true' },
    ],
    agreement:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        cardName: options.cardName
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
      this.payOnlineData()
    } else {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  //页面基础数据
  payOnlineData: function (e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/payOnlineData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        var id = pageData.PayOnline[0].id
        var sumMoney = pageData.PayOnline[0].sumMoney
        var giftMoney = pageData.PayOnline[0].giftMoney
        that.setData({
          balance_header: {
            balance_header_money: pageData.balance,
            top_doing: ''
          },
          rechargeData: {
            cardName: that.data.cardName,
            payType: '会员在线充值',
            settingId: id,
            sumMoney: sumMoney,
            giftMoney: giftMoney,
            type: 'mobilePay'
          },
          keyBord: pageData.PayOnline,

        })
      },
      fail: function () {
        // wx.navigateTo({
        //   url: '../activate/activate?id=' + id + '&name=' + name
        // }) 
        wx.switchTab({
          url: '../index/index',
        })
      }
    })
  },
  recharge_Online: function (e) {
    var keyBord = this.data.keyBord;
    var ind = e.currentTarget.dataset.amount;
    for (var i = 0; i < keyBord.length; i++) {
      keyBord[i].onclass = '';
    }
    keyBord[ind].onclass = 'on_active';
    this.setData({
      keyBord: keyBord,
      rechargeData: {
        cardName: this.data.cardName,
        payType: '会员在线充值',
        settingId: e.currentTarget.dataset.id,
        sumMoney: e.currentTarget.dataset.summoney,
        giftMoney: e.currentTarget.dataset.giftmoney,
        type: 'mobilePay'
      }
    })
  },
  recharge: function () {
    var that = this
    if (that.data.agreement == false) {
      wx.showModal({
        title: '提示',
        content: '请确认同意《易快》充值协议内容，谢谢。',
        showCancel:false
      })
  return false
    }else {
      var payData = JSON.stringify(that.data.rechargeData)
      wx.navigateTo({
        url: '../onlineTopup/WeChat_pays/WeChat_pays?payData=' + payData,
      })
    }
  },
  otherMoney: function (e) {
    //console.log(e)
    //console.log(this.data)

  },

  checkboxChange: function (e) {
    var that = this
    var agreement
    if (that.data.agreement == true) {
      agreement = false
    } else {
      agreement = true
    }
    that.setData({
      agreement: agreement
    })
  }
})