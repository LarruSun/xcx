// pages/mine/mine.js
var app = getApp()

Page({
  data: {
    pageTF: '',
    pageRegister: false,
    pageTF_other: 'true',
    sendCode:false,
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
        mine_coupon: ''
      }
    ],
    mine_list_message: [
      {
        mine_list_img: '/images/mine/mine1.png',
        mine_list_name: '收货地址',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine2.png',
        mine_list_name: '余额充值',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine4.png',
        mine_list_name: '支付密码设置',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine5.png',
        mine_list_name: '个人信息',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      },
      {
        mine_list_img: '/images/mine/mine5.png',
        mine_list_name: '积分商城',
        mine_list_num: '',
        mine_list_RightImg: '/images/mine/right.png'
      }
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
    var that = this;
    console.log(this.data)
    app.openId = this.data.userInfo.openId;
    wx.request({
      url: getApp().data.pathApi +'/utils/minePageData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        // appid: that.data.appid
      },
      success: function (data) {
        if (data.statusCode == 200) {
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
          if (pageData.memberCardPhone != null && pageData.memberCardPhone != "") {
            var phone = pageData.memberCardPhone
            var myphone = phone.substr(3, 4)
            var lphone = phone.replace(myphone, "****");
            var mine_one_phone = lphone
          }
          that.setData({
            mine_top: {
              mine_one_img: that.data.userInfo.avatarUrl,
              mine_one_messageson: that.data.userInfo.nickName,
              mine_one_phone: mine_one_phone,
              mine_one_card: pageData.memberCardName,
              mine_one_cardNum: pageData.memberCardNum,
              mine_one_cardId: pageData.membercardId,
              min_one_integral: pageData.integral
            },
            mine_user_Message: [
              {
                mine_balance: pageData.balance,
                mine_coupon: pageData.couponNum
              }
            ],
            mine_list_message: [
              {
                mine_list_img: '/images/mine/mine1.png',
                mine_list_name: '收货地址',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/mine2.png',
                mine_list_name: '余额充值',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/mine4.png',
                mine_list_name: '支付密码设置',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/mine5.png',
                mine_list_name: '个人信息',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              },
              {
                mine_list_img: '/images/mine/integral.png',
                mine_list_name: '积分商城',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              }
              /*{
                mine_list_img: '/images/mine/ticket.png',
                mine_list_name: '领券中心',
                mine_list_num: '',
                mine_list_RightImg: '/images/mine/right.png'
              }*/
            ]
          })
        } else {
          that.interation()
        }
      },
      fail: function () {
        that.interation()
      }
    })

  },
  register: function () {
    wx.navigateTo({
      url: '../mine/register/register',
    })
  },
  memberCard:function() {
    wx.navigateTo({
      url: '../mine/membershipCard/membershipdDetails/membershipdDetails?cardId=' + this.data.mine_top.mine_one_cardId,
    })
  },

  jumpIntegral: function(){
    wx.navigateTo({
      url: '../mine/score/score'
    })
  },

  balance_href: function () {
    var that = this
    if (this.data.mine_top.mine_one_card == "暂未绑定会员卡" && (this.data.userInfo.phone == "" || this.data.userInfo.phone == null)) {
      wx.navigateTo({
        url: '../mine/register/register',
      })
    } else {
      wx.navigateTo({
        url: '../mine/balance/balance',
      })
    }

  },
  balance_coupon: function () {
    var that = this
    if (this.data.mine_top.mine_one_card == "暂未绑定会员卡" && (this.data.userInfo.phone == "" || this.data.userInfo.phone == null)) {
      wx.navigateTo({
        url: '../mine/register/register',
      })
    } else {
      wx.navigateTo({//关闭所有页面，打开到应用内的某个页面
        url: '../coupon/coupon',
      })
    }
  },
  mine_href: function (e) {
    //console.log(e.currentTarget.dataset.ind);
    if (this.data.mine_top.mine_one_card == "暂未绑定会员卡" && (this.data.userInfo.phone == "" || this.data.userInfo.phone == null)) {
      wx.navigateTo({
        url: '../mine/register/register',
      })
    }else {
      if (e.currentTarget.dataset.ind == 0) {
        var fromWhere = "myInfo"
        wx.navigateTo({
          url: '../mine/myInfo/selectAddr/selectAddr?fromWhere=' + fromWhere,
        })
      } else if (e.currentTarget.dataset.ind == 1) {
        wx.navigateTo({
          url: '../mine/onlineTopup/onlineTopup?cardName=' + this.data.mine_top.mine_one_card,
        })
      } else if (e.currentTarget.dataset.ind == 2) {
        wx.navigateTo({
          url: '../mine/myInfo/personaRecharge/personaRecharge',
        })
      } else if (e.currentTarget.dataset.ind == 3) {
        wx.navigateTo({
          url: '../mine/myInfo/myInfo?cardNum=' + this.data.mine_top.mine_one_cardNum
        })
        //console.log('个人信息')
      } else if (e.currentTarget.dataset.ind == 4){
        console.log('积分商城')
        wx.navigateTo({
          url: '../mine/myInfo/integralShop/integralShop'
        })
      } else if (e.currentTarget.dataset.ind == 5) {
        console.log('领券中心')
        wx.navigateTo({
          url: '../mine/myInfo/integralCenter/integralCenter'
        })
      }
    }
    
  },
  //生成二维码
  getQRCode: function (e) {
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

  reload: function (e) {
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