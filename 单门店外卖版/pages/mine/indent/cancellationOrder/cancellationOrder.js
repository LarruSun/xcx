 /**
   * 页面的初始数据
   */
Page({
  data: {
    itemList: ['买错了,买多了', '地址电话填写有误', '计划有变,不想要了', '商品质量有问题', '没有给承诺的优惠'],
    refundReason:"",
    refundResult:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order = JSON.parse(options.order);
    this.setData({
      order: order,
      logo: options.logo
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
  top_img: function () {
    var that = this
    count: 3 // 默认9
    sizeType: ['original', 'compressed'] // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
    var tempFilePaths
    wx.chooseImage({
      success: function (res) {
        tempFilePaths = res.tempFilePaths
        //console.log(res)
        that.setData({
          describe_img_img: tempFilePaths[0]

        })
        console.log(tempFilePaths)
      },
    })

    //
  },
  //取消订单
  commitCancel: function (e) {
    var that = this
    if (that.data.describe_img_img == null) {
      wx.showModal({
        title: '提示',
        content: '请添加一张退款依据照片',
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
    wx.showLoading({
      title: '正在提交...',
    })
    
    //上传图片
    wx.uploadFile({
      url: getApp().data.pathApi +'/utils/unLoadImg.do', //
      filePath: that.data.describe_img_img,
      header: {
        "Content-Type": "multipart/form-data"
      },
      name: 'smallRoutinePic', 
      formData: {
        phone: that.data.userInfo.phone
      },
      success: function (res) {
        var result = JSON.parse(res.data)
        console.log(result)
        var imgUrl = result.data;
        //取消订单
        if (result.type == "success"){
          wx.request({
            url: getApp().data.pathApi +'/utils/cancelOrder.do',//自己的服务接口地址
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
              orderId: that.data.order.orderId,
              refundReason: that.data.refundReason,
              refundResult: that.data.refundResult,
              refundAmount: that.data.order.payTotal * 100,
              refundPay: 'ORIGINAL',
              refundType: 'ALLREFUND',
              imgUrl: imgUrl
            },
            success: function (data) {
              wx.hideLoading();
              var pageData = data.data
              console.log(pageData)
              if (pageData.type == "success") {
                wx.navigateBack({
                  delta: 1
                })
              }
            },
            fail: function () {
              wx.hideLoading();

            }
          })
        }
      }
    })

  },
  //退款原因
  refundReason:function(e) {
    var that = this
    wx.showActionSheet({
      itemList: that.data.itemList,
      success: function (res) {
        console.log(that.data.itemList[res.tapIndex])
        that.setData({
          refundReason: that.data.itemList[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //描述退款原因
  refundResultInputEvent: function (e) {
    this.setData({
      refundResult: e.detail.value
    })
  },
})