// pages/mine/mine.js
var app = getApp()

Page({
  data: {
    pageTF:'',
    pageRegister:false,
    pageTF_other: 'true',
    mine_top: {
      mine_one_img: '',
      mine_one_messageson: '',
      mine_one_phone: '',
      mine_one_card: '',
      mine_one_img_right: ''
    },
    mine_user_Message: [
      {
        mine_balance: '',
        mine_integral: '',
        mine_coupon: '',
        mine_number: '',
      }
    ],
    mine_list_message: [
      {
        mine_list_img: '/images/mine/mine1.png',
        mine_list_name: '会员卡',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine2.png',
        mine_list_name: '会员活动',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine4.png',
        mine_list_name: '在线充值',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {

        mine_list_img: '/images/mine/mine5.png',
        mine_list_name: '个人信息',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
    ]
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
    var that = this
    var appid = ''
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log(res.extConfig)
          appid = res.extConfig.appid
        }
      })
    }
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        appid: appid
      })
    })
    that.pageTab()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
    var userInfo = wx.getStorageSync('userInfo_')
    console.log(userInfo.phone)
    
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
    //console.log(userInfo.phone)
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      this.minePageData()
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
  minePageData: function (e) {
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/minePageData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        // appid: that.data.appid
      },
      success: function (data) {
        if (data.statusCode == 200){
          var pageData = data.data
          console.log(pageData)
          if (pageData.consumptionNum != null && pageData.consumptionNum != '') {
            that.setData({
              pageRegister: true
            })
          } else {
            that.setData({
              pageRegister: false
            })
          }
          that.setData({
            mine_top: {
              mine_one_img: that.data.userInfo.avatarUrl,
              mine_one_messageson: that.data.userInfo.nickName,
              mine_one_phone: pageData.memberCardPhone,
              mine_one_card: pageData.memberCardName,
              mine_one_cardNum: pageData.memberCardNum,
            },
            mine_user_Message: [
              {
                mine_balance: pageData.balance,
                mine_integral: pageData.integral,
                mine_coupon: pageData.couponNum,
                mine_number: pageData.consumptionNum
              }
            ],
            mine_list_message: [
              {
                mine_list_img: '/images/mine/mine1.png',
                mine_list_name: '会员卡',
                mine_list_num: pageData.memberCardsNum + '张',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/mine2.png',
                mine_list_name: '会员活动',
                mine_list_num: pageData.activityNum + '个',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/mine4.png',
                mine_list_name: '在线充值',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {

                mine_list_img: '/images/mine/mine5.png',
                mine_list_name: '个人信息',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
            ]
          })
        }else{
          that.interation()
        }
      },
      fail: function () {
        that.interation()
      }
    })
    
  },
  register:function(){
    wx.navigateTo({
      url: '../mine/register/register',
    })
  },
  balance_href: function () {
    wx.navigateTo({
      url: '../mine/balance/balance',
    })
  },
  balance_integral: function () {
    wx.navigateTo({
      url: '../mine/integral/integral',
    })
  },
  balance_number: function () {
    wx.navigateTo({
      url: '../mine/number/number'
    })
  },
  balance_coupon: function () {
    wx.navigateTo({//关闭所有页面，打开到应用内的某个页面
      url: '../coupon/coupon',
    })
  },
  mine_href: function (e) {
    //console.log(e.currentTarget.dataset.ind);
    if (e.currentTarget.dataset.ind == 0) {
      wx.navigateTo({
        url: '../mine/membershipCard/membershipCard',
      })
    } else if (e.currentTarget.dataset.ind == 1) {
      wx.navigateTo({
        url: '../mine/memberActivity/memberActivity',
      })
    } else if (e.currentTarget.dataset.ind == 2) {
      wx.navigateTo({
        url: '../mine/onlineTopup/onlineTopup?cardName=' + this.data.mine_top.mine_one_card,
      })
    } else if (e.currentTarget.dataset.ind == 3) {
      wx.navigateTo({
        url: '../mine/myInfo/myInfo',
      })
      //console.log('个人信息')
    }
  },
//生成二维码
  getQRCode:function(e) {
    wx.navigateTo({
      url: '../mine/QRCode/QRCode?cardNum=' + this.data.mine_top.mine_one_cardNum
    })
  },
  interation: function () {
    var that = this
    // wx.showModal({
    //   title: '网络错误！',
    //   content: '当前网络不佳，数据请求失败',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
    that.setData({
      pageTF: true,
      pageTF_other: false
    })
    console.log('状态码非200，数据请求失败')
  },

  reload:function(e) {
    this.setData({
      pageTF: '',
      pageTF_other: 'true'
    })
    this.pageTab()
  },
  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh()
  }
})