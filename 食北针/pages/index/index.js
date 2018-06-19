//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    address_message_css:'',
    location_d:'定位中...',
    imgUrls: [
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    vertical: true,
    telephone: '',
    pageTF:'',
    pageTF_other:'true'
  },
  //调用地图
  Lnvoking_map: function () {
    wx.navigateTo({
      url: '../harvestAddress/harvestAddress?backgroundColor=' + this.data.address_message_css,
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
 
  onLoad: function (opation) {   
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log(res.extConfig.appid)

        }
      })
    }
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo,
    })
    if (that.data.location == null) {
      that.setData({
        location_d: '定位中..'
      })
    }
    if (userInfo != null && userInfo.openId != null) {

    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }

    //1、获取当前位置坐标
    if (that.data.location == null) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
          wx.request({
            //获取首页数据
            url: "https://www.eaqul.com/smallRoutineUser/utils/getMapAddress.do",
            method: 'post',
            dataType: 'json',
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (data) {
              if (data.statusCode == 200) {
              var pageData = data.data
              console.log(pageData)
              that.setData({
                location_e: pageData.address,
                location_d: null
              })
            }else{
              that.interation()
            } 
            },
            fail: function () {
              console.log('错误')
            }
          })
        }
      })
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            }
          })
          console.log(res)
          that.getSingleShopData()
        }
      })
    }else {
      that.getSingleShopData()
    }
    
    
  },
  getSingleShopData: function() {
    var that = this
    wx.request({
      //获取首页数据
      url: "https://www.eaqul.com/smallRoutineUser/utils/getSingleShopData.do",
      method: 'post',
      dataType:'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        longitude: that.data.location.longitude,
        latitude: that.data.location.latitude
      },
      success: function (data) {
        if (data.statusCode==200){
          var pageData = data.data
          console.log(pageData);
          var shopList = pageData.shopList;
          for(var i=0;i<shopList.length;i++){
            shopList[i].distinces = (shopList[i].distinces/1000).toFixed(2);
          }
          pageData.shopList = shopList;
          that.setData({
            shopList: shopList,
            pageData: pageData,
            address_message_css: pageData.backgroundColor
          })
          wx.setStorageSync('storage_bg', pageData.backgroundColor)
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: wx.getStorageSync('storage_bg'),
          })
        }else{
          that.interation()
        } 
      },
      fail: function () {
        that.interation()
        console.log('错误');
      },

    })
  },
  //进入对应餐饮外卖
  goToTakeOut:function(e) {
    //console.log(this.data.address_message_css)
    const shopId = e.currentTarget.dataset.id;
    const isKy = e.currentTarget.dataset.ky;
    wx.navigateTo({
      url: '../index_order/index?shopId=' + shopId + '&backgroundColor=' + this.data.address_message_css
    })
  },
  telephone: function (e) {
    this.setData({
      telephone: this.data.telephone,
    })
    wx.makePhoneCall({
      phoneNumber: this.data.telephone
    })
    //console.log(this.data.hot_pot.phone)
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
  },
  //检查用户是否已绑定手机号
  checkUserPhone: function (e) {
    let id = e.currentTarget.id;
    const name = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../activate/activate?id=' + id + '&name=' + name
    })
  },
  //轮播
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })

  },

  objChangToArr: function (oArr) {
    var arr = [];
    for (var i in oArr) {
      arr.push(oArr[i].shop_Img)
    }
    return arr;
  },
  objChangToArr2: function (oArr) {
    var arr = [];
    for (var i in oArr) {
      arr.push(oArr[i].slideshow_Img)
    }
    return arr;
  },
  objChangToArr3: function (oArr) {
    var arr = [];
    for (var i in oArr) {
      arr.push(oArr[i].food_Img)
    }
    return arr;
  },
  objChangToArr4: function (oArr) {
    var arr = [];
    for (var i in oArr) {
      arr.push(oArr[i].food_name)
    }
    return arr;
  },
  interation:function(){
    var that=this
    // wx.showModal({
    //   title: '网络错误！',
    //   content: '当前网络不佳，数据请求失败...',
    //   showCancel:false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
    that.setData({
      pageTF: true,
      pageTF_other:false
    })
    console.log('状态码非200，数据请求失败')
  },

  reload:function(e) {
    this.setData({
      location: null,
      pageTF: '',
      pageTF_other: 'true'
    })
    var that=this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.onShow()
    
  },
  onPullDownRefresh: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    that.setData({
      location: null
    })
    that.onShow()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '小程序转发',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
