// pages/mine/indent/indent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageTF: '',
    pageTF_other: 'true',
    cancel: '',
    currentId: '1001',
    dynamic_height: 50,
    dynamic_TF: false,
    section: [
      { name: '订单', id: '1001', num: '12' },
      { name: '订单已取消', id: '1002', num: '13' },
    ],
    orderList: {}
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
    this.setData({
      page: 1,
      orderList: {}
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
      that.toMyOrder()
      //console.log(params)
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //获取我的订单数据
  toMyOrder: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/toMyOrder.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        page: that.data.page,
        openId: that.data.userInfo.openId,
        cancel: that.data.cancel
      },
      success: function (data) {
        if (data.statusCode == 200) {
          var pageData = data.data
          var orderList = []
          if (that.data.orderList != null && that.data.orderList.length > 0) {
            orderList = that.data.orderList
          }
          for (var i = 0; i < pageData.orderList.length; i++) {
            orderList.push(pageData.orderList[i])
          }
          for (var i = 0; i < orderList.length; i++) {
            orderList[i].isShowAll = '';
          }
          console.log(pageData)
          that.setData({
            logo: pageData.logo,
            total: pageData.total,
            orderList: orderList
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          that.interation()
        }
      },
      fail: function () {
        that.interation()
      }
    })
  },
  toPay: function (e) {
    var orderId = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '/pages/pay/pay?orderId=' + orderId,
    })
  },
  //横向导航
  handleTap: function (e) {
    let id = e.currentTarget.id;
    if (id) {
      this.setData({ currentId: id })
    }
    if (id == 1002) {
      this.setData({
        page: 1,
        cancel: 'cancel',
        orderList: {},
      })
    } else {
      this.setData({
        page: 1,
        orderList: {},
        cancel: ''
      })
    }
    this.toMyOrder()
  },
  message_data_checked: function (e) {
    // var data_sum = this.data.indent_content;//订单数
    // var dynamic_ = this.data.dynamic_height;//两条数据的高度
    // var tf = this.data.dynamic_TF;//判断显示掩藏
    // for (var i = 0; i < data_sum.length; i++) {
    //   var shuju = data_sum[i].message_data.length

    //   //console.log(dynamic_);
    //   if (tf == false) {
    //     if (shuju > 2) {
    //       dynamic_ = data_sum.length * 28;
    //       this.setData({
    //         dynamic_height: dynamic_,
    //         dynamic_TF: true
    //       })
    //     } else {
    //       //console.log("小于两条数据")
    //     }
    //   }
    //   if (tf == true) {
    //     this.setData({
    //       dynamic_height: 50,
    //       dynamic_TF: false
    //     })
    //   }
    // }
    var orderList = this.data.orderList;
    var ind = e.currentTarget.dataset.ind;
    var ter;
    ter = orderList[ind].isShowAll == 'showAll' ? '' : 'showAll';
    orderList[ind].isShowAll = ter;
    this.setData({
      orderList: orderList
    })
  },
  //订单详情
  orderInfo: function (e) {
    var orderId = e.currentTarget.dataset.id
    if (orderId != null) {
      wx.navigateTo({
        url: '../indent/line_item/line_item?orderId=' + orderId,
      })
    }
  },
  //再来一单
  takeAgain: function (e) {
    var orderId = e.currentTarget.dataset.id
    var shopId = e.currentTarget.dataset.shop
    if (orderId != null) {
      wx.navigateTo({
        url: '../../index_order/index?shopId=' + shopId + '&orderId=' + orderId
      })
    }
  },
  //催单
  reminder: function (e) {
    var orderId = e.currentTarget.dataset.id
    if (orderId != null) {
      wx.request({
        url: 'https://www.eaqul.com/smallRoutineUser/utils/reminder.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          orderId: orderId
        },
        success: function (data) {
          var pageData = data.data
          if (data.statusCode == 200 && pageData.msgCode == "1") {
            wx.showToast({
              title: pageData.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {

        }
      })
    }

  },
  //删除订单
  deleteOrder: function (e) {
    var that = this
    var orderId = e.currentTarget.dataset.id
    if (orderId != null) {
      wx.request({
        url: 'https://www.eaqul.com/smallRoutineUser/utils/deleteOrder.do',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          orderId: orderId
        },
        success: function (data) {
          var pageData = data.data
          if (data.statusCode == 200 && pageData.msgCode == "1") {
            wx.showToast({
              title: pageData.message,
              icon: 'success',
              duration: 2000
            })
            var orderList = that.data.orderList
            for (var i = 0; i < orderList.length; i++) {
              if (orderId == orderList[i].orderId) {
                orderList[i].orderId = ''
                that.setData({
                  orderList: orderList
                })
              }
            }
          }
        },
        fail: function () {

        }
      })
    }
  },
  //申请售后
  cancelOrder: function (e) {
    var that = this
    var orderId = e.currentTarget.dataset.id
    var order = ''
    for (var i = 0; i < that.data.orderList.length; i++) {
      if (orderId == that.data.orderList[i].orderId) {
        order = JSON.stringify(that.data.orderList[i]);
      }
    }
    if (orderId != null) {
      wx.showModal({
        title: '提示',
        content: '建议你优先联系商家协商处理,如因您自身原因导致的退款申请,商家及客服有权拒绝。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../indent/cancellationOrder/cancellationOrder?order=' + order + '&logo=' + that.data.logo,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //确认收货
  confirmCompleteOrder: function (e) {
    var that = this
    var orderId = e.currentTarget.dataset.id
    if (orderId != null) {
      wx.showModal({
        title: '提示',
        content: '确认收货。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'https://www.eaqul.com/smallRoutineUser/utils/confirmCompleteOrder.do',//自己的服务接口地址
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              data: {
                orderId: orderId
              },
              success: function (data) {
                var pageData = data.data
                if (data.statusCode == 200 && pageData.msgCode == "0") {
                  wx.showToast({
                    title: pageData.message,
                    icon: 'success',
                    duration: 2000
                  })
                  var orderList = that.data.orderList
                  for (var i = 0; i < orderList.length; i++) {
                    if (orderId == orderList[i].orderId) {
                      orderList[i].status = "HASDONE"
                      that.setData({
                        orderList: orderList
                      })
                    }
                  }
                  that.toMyOrder()
                }
              },
              fail: function () {

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  //取消售后
  cancelAfterSale:function (e) {
    var that = this
    var orderId = e.currentTarget.dataset.id
    if (orderId != null) {
      wx.showModal({
        title: '提示',
        content: '确认取消售后（取消后无法再次申请售后服务）。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'https://www.eaqul.com/smallRoutineUser/utils/cancelAfterSale.do',//自己的服务接口地址
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              data: {
                orderId: orderId
              },
              success: function (data) {
                var pageData = data.data
                if (data.statusCode == 200 && pageData.msgCode == "0") {
                  wx.showToast({
                    title: pageData.message,
                    icon: 'success',
                    duration: 2000
                  })
                  var orderList = that.data.orderList
                  for (var i = 0; i < orderList.length; i++) {
                    if (orderId == orderList[i].orderId) {
                      orderList[i].afterSaleStatus = "cancelSalStatus"
                      that.setData({
                        orderList: orderList
                      })
                    }
                  }
                  that.toMyOrder()
                }
              },
              fail: function () {

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //取消订单
  refundOrder: function (e) {
    var orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '取消订单将直接退款至您的会员卡账户，是否确定取消订单。',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://www.eaqul.com/smallRoutineUser/utils/refundOrder.do',//自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
              orderId: orderId
            },
            success: function (data) {
              var pageData = data.data
              if (data.statusCode == 200 && pageData.msgCode == "0") {
                wx.showToast({
                  title: pageData.message,
                  icon: 'success',
                  duration: 2000
                })
                var orderList = that.data.orderList
                for (var i = 0; i < orderList.length; i++) {
                  if (orderId == orderList[i].orderId) {

                  }
                }
              }
            },
            fail: function () {

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //联系商家
  contactShop:function(e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  },
  interation: function () {
    wx.hideLoading()
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

  // reload: function (e) {
  //   this.pageTab()
  // }
  reload: function (e) {
    this.setData({
      page: 1,
      orderList: {},
      pageTF: '',
      pageTF_other: 'true'
    })
    this.onShow()
  },
  onPullDownRefresh: function () {
    this.setData({
      orderList: {},
      pageTF: '',
      pageTF_other: 'true'
    })
    this.setData({
      page: 1
    })
    this.onShow()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    if (this.data.orderList.length > 0) {
      if (this.data.page < this.data.total) {
        var int = this.data.page + 1
        this.setData({
          page: int
        })
        this.toMyOrder()
      }
    }
  }
})