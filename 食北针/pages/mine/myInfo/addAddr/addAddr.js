// addAddr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: false,//true=女,false=男
    gender: '先生',
    editId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id != null) {
      this.setData({
        editId: options.id
      })
    }
    this.pageTab()
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
    if (userInfo != null && userInfo.openId != null && that.data.editId != null) {
      wx.request({
        url: "https://www.eaqul.com/smallRoutineUser/utils/getEditAddressDetail.do",
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: {
          openId: that.data.userInfo.openId,
          id: that.data.editId
        },
        success: function (data) {
          var detail = data.data
          if(detail.sex == '先生'){
            that.setData({
              sex:false,
              gender:detail.sex
            })
          }else {
            that.setData({
              sex: true,
              gender: '女士'
            })
          }
          that.setData({
            name: detail.name,
            phone: detail.phone,
            address: detail.province,
            detialed: detail.address,
            latitude: detail.latitude,
            longitude: detail.longitude
          })
        }
      })
    }
  },
  toselectAddr: function () {
    var that = this
    if (that.data.editId != null && that.data.editId != ""){
      var url = "https://www.eaqul.com/smallRoutineUser/utils/ediAddress.do"
    }else {
      var url = "https://www.eaqul.com/smallRoutineUser/utils/addAddress.do"
    }
    wx.request({
      url: url,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        id: that.data.editId,
        name: that.data.name,
        phone: that.data.phone,
        gender: that.data.gender,
        province: that.data.address,
        address: that.data.detialed,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      success: function (data) {
        wx.navigateBack({
          delta: 1
        })
      }
    })

  },
  towxmap: function () {
    wx.navigateTo({
      url: '../../wxmap/wxmap',
    })
  },
  chooseLocation: function (e) {
    console.log(e);
    var that = this
    wx.chooseLocation({
      success: function (res) {
        if (res.address == null) {
          console.log("卧槽")
        }
        that.setData({
          address: res.address,
          detialed: res.name,
          longitude: res.longitude,//经度
          latitude: res.latitude,//纬度
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  setsex: function (e) {
    var sexCode = e.currentTarget.dataset.sex;
    var sex = sexCode == 0 ? false : true;
    if (sex == false) {
      var gender = '先生'
    } else {
      var gender = '女士'
    }
    this.setData({
      sex: sex,
      gender: gender
    })
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  }
})