// pages/mine/membershipCard/membershipCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // membershipCard_top: {
    //   mine_one_img: '/../images/mine/logo.png',
    //   logo_name: '宋江',
    //   logo_phone: '13989286110',
    //   vip_message: 3,
    // },
    // membershipCard_content: [
    //   {
    //     content_son_title: '高级会员',
    //     defCard: '/../images/mine/defCard.png',
    //     defCard_text: '默认卡',
    //     discount: '9.9',
    //     discount_user: '使用中',
    //   },
    //   {
    //     content_son_title: '高级会员',
    //     discount: '9.9',
    //     discount_user: '使用中',
    //   },
    //   {
    //     content_son_title: '高级会员',
    //     discount: '9.9',
    //     discount_user: '待激活',
    //   }
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      this.cardListPageData()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //页面基础数据
  cardListPageData: function (e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/cardListPageData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {
        var card = data.data
        that.setData({
          membershipCard_top: {
            mine_one_img: that.data.userInfo.avatarUrl,
            logo_name: that.data.userInfo.nickName,
            logo_phone: that.data.userInfo.phone,
            vip_message: card.length + '张',
          },
          membershipCard_content: card
        })
      },
      fail: function () {
        that.setData({
          membershipCard_top: {
            mine_one_img: that.data.userInfo.avatarUrl,
            logo_name: that.data.userInfo.nickName,
            logo_phone: that.data.userInfo.phone,
            vip_message: '',
          },
        })
      },
    })
  },
      membershipCard_href:function (e) {
        var cardId = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '../membershipCard/membershipdDetails/membershipdDetails?cardId=' + cardId,
        })
      }
})