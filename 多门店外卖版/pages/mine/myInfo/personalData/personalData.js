// pages/mine/myInfo/personalData/personalData.js
var util = require("../../../../utils/util.js");
var tcity = require("../../../../utils/citys.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    page_gender: ['未知','男', '女'],
    name: '',
    gender: '',
    birthday: '',
    area: '',
    endDate: util.formatTime2(new Date()),
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
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    if (userInfo != null && userInfo.openId != null) {
      that.setData({
        name: that.data.userInfo.nickName,
        gender: that.data.page_gender[that.data.userInfo.gender],
        gender_index: that.data.userInfo.gender,
        provinces: provinces,
        birthday: that.data.userInfo.birthday,
        citys: citys,
        county: that.data.userInfo.area,
        countys: countys,
        province: that.data.userInfo.province,
        city: that.data.userInfo.city,
        region: [that.data.userInfo.province,that.data.userInfo.city,that.data.userInfo.area]
      })
    } else {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  //性别选择
  genderPickerChange: function (e) {
    this.setData({
      gender: this.data.page_gender[e.detail.value],
      gender_index: e.detail.value
    })
  },
  //生日选择
  datePickerBindchange: function (e) {
    this.setData({
      birthday: e.detail.value,
      
    })
  },
  nameInputEvent:function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindChange: function (e) {
    console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != null) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != null) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != null) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
    //console.log(!this.data.condition)
  },

  primary:function(e) {
    var that = this
    if (that.data.name == null || that.data.name == "") {
      wx.showToast({
        title: '请输入会员姓名'
      })
    }
    if (that.data.gender == null || that.data.gender == "") {
      wx.showToast({
        title: '请选择您的性别'
      })
    }
    wx.request({
      url: getApp().data.pathApi +'/utils/updateInfo.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        name: that.data.name,
        gender: that.data.gender,
        birthday: that.data.birthday,
       // privince: that.data.region[0],
       // city: that.data.region[1],
        //area: that.data.region[2]
      },
      success: function (data) {
        
        var pageData = data.data
        //console.log(data)
        app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
            userInfo: userInfo
          })
        })
        if (pageData.type == "success") {
          wx.showToast({
            title: '修改成功',
            success: function () {
              wx.switchTab({
                url: '../../../mine/mine',
              })
            },
            fail: function () {
              return false
            }
          })
        }else {
          wx.showToast({
            title: '修改失败',
          })

        }
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
  bindRegionChange: function (e) {    //城市选择
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})