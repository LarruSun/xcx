// selectAddr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAddr: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromWhere: options.fromWhere
    })
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
      that.getAddressList()
    } else {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  getAddressList: function (e) {
    var that = this
    wx.request({
      url: "https://www.eaqul.com/smallRoutineUser/utils/getAddressList.do",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {
        console.log(data.data)
        that.setData({
          hasAddr: data.data
        })
      }
    })
  },
  /***
   * 设置默认地址
   */
  issetThisDefault: function (e) {//设置默认
    var pid = e.currentTarget.dataset.pid;
    var that = this
    wx.request({
      url: "https://www.eaqul.com/smallRoutineUser/utils/setThisDefault.do",
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        addressId: pid
      },
      success: function (data) {
        var addrItems = that.data.hasAddr;
        for (var i = 0; i < addrItems.length; i++) {
          addrItems[i].default = false;
          if (addrItems[i].id == pid) {
            addrItems[i].default = true;
            // var pages = getCurrentPages();             //  获取页面栈
            // var prevPage = pages[pages.length - 2];    // 上一个页面
            // prevPage.setData({
            //   address: addrItems[i]
            // })
            // if (that.data.fromWhere == "order") {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }
          }
          that.setData({
            hasAddr: addrItems
          })
        }
      }
    })
  },
  /**
   * 使用地址,不修改默认
   */
  isUseThis: function (e) {
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    var addrItems = this.data.hasAddr;
    var pid = e.currentTarget.dataset.pid;
    for (var i = 0; i < addrItems.length; i++) {
      addrItems[i].isUseing = false;
      if (addrItems[i].id == pid) {
        addrItems[i].isUseing = true;
        prevPage.setData({
          address: addrItems[i]
        })
        if (this.data.fromWhere == "order") {
          wx.navigateBack({
            delta: 1
          })
        }
      }

    }
  },
  /**
   * 删除地址
   */
  delAddress: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认删除此收货地址吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var pid = e.currentTarget.dataset.pid;
          var id = e.currentTarget.dataset.id;
          var that = this
          wx.request({
            url: "https://www.eaqul.com/smallRoutineUser/utils/delAddress.do",
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
              addressId: pid
            },
            success: function (data) {
              var pageData = data.data
              if (pageData.msgCode == "success") {
                var addrItems = that.data.hasAddr;
                addrItems.splice(id, 1)
                that.setData({
                  hasAddr: addrItems
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toeditAddr: function (e) {
    var pid = e.currentTarget.dataset.pid;
    wx.redirectTo ({
      url: '../../myInfo/addAddr/addAddr?id=' + pid,
    })
  },
  addAddress: function () {
    wx.redirectTo ({
      url: '../../myInfo/addAddr/addAddr',
    })
  }

})