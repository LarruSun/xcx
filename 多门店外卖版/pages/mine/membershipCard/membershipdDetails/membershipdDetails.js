// pages/mine/membershipCard/membershipdDetails/membershipdDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      showMust:false, //使用须知显示影藏
      rote:'rote180'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageTab()
    console.log(options.cardId)
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/cardDetailData.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        cardId: options.cardId
      },
      success: function (data) {

        var detial = data.data
        
        that.setData({
          detial: detial
        })
      },
      fail: function () {
        wx.navigateBack
      },
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

    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  /**
   * 删除卡
   */
  deleCard:function(e) {
    var that = this
    if (that.data.detial.default == "1" || that.data.detial.default == 1) {
      wx.showModal({
        title: '提示',
        content: '不允许删除默认卡!',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确认删除会员卡(此操作不可逆转)',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.pathApi +'/utils/deleCard.do',//自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
              openId: that.data.userInfo.openId,
              cardId: that.data.detial.id,
            },
            success: function (data) {
              if(data.data.msgCode == "success") {
                wx.navigateBack({
                  delta: 1
                })
              }
            },
            fail: function () {
              wx.navigateBack
            },
          })
        } else if (res.cancel) {
          return 
        }
      }
    })
  },
  /**
 * 设置默认卡
 */
  toBeDefault: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认设置默认会员卡',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.pathApi +'/utils/toBeDefault.do',//自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
              openId: that.data.userInfo.openId,
              cardId: that.data.detial.id,
            },
            success: function (data) {
              if (data.data.msgCode == "success") {
                wx.navigateBack({
                  delta: 1
                })
              }
            },
            fail: function () {
              wx.navigateBack
            },
          })
        } else if (res.cancel) {
          return
        }
      }
    })
  },
  //会员卡二维码
  goToQRCode:function(e) {
    wx.navigateTo({
      url: '../../../mine/QRCode/QRCode?cardNum=' + this.data.detial.cardNo
    })
  },
  showhidden:function(){
    var isshow=this.data.showMust?false:true;
    var isrote = isshow ? '':'rote180';
    console.log(isshow + '===' + isrote)
    this.setData({
      showMust: isshow,
      rote: isrote
    })
  }
})