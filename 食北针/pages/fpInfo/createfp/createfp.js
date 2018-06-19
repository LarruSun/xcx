// createfp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tempVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
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
  //新增发票信息
  addReceipt:function(e) {
    var that = this
    if (that.data.receiptTitle == null || that.data.receiptTitle.length == 0) {
      wx.showToast({
        title: '发票抬头不能为空',
        icon: 'loading',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/addReceipt.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        receiptTitle: that.data.receiptTitle,
        taxNum: that.data.taxNum
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        if (pageData.msgCode == "success") {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function () {

      }
    })
  },
  titleInputEvent:function(e) {
    this.setData({
      receiptTitle: e.detail.value
    })
  },
  taxNumInputEvent:function(e) {
    this.setData({
      taxNum: e.detail.value
    })
  },
})