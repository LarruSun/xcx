// pages/harvestAddress/harvestAddress.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: '',
    region_c: false,

    particular: [
      {

      }
    ],
    currentPosi: {
      curAddr: '',//当前地址
      curAddrPosi: { //当前地址坐标
        lng: '',
        lat: ''
      },
      curfjAddrArr: [ //附近地址
        {
          fjAddrName: '',
          id: '',
          lng: '',
          lat: ''
        },
        {
          fjAddrName: '',
          id: '',
          lng: '',
          lat: ''
        },

      ]
    },
    seachflag: true, //true为搜索结果隐藏，false为显示
    del:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      backgroundColor: options.backgroundColor,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.backgroundColor,
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
    that.getGelc()
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      that.getAddressList()
      that.getGelc()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //获取收货地址
  getAddressList: function (e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi +"/utils/getAddressList.do",
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
          particular: data.data
        })
      }
    })
  },
  choose_city: function (e) {
    this.setData({
      region_c: true
    })
  },
  choose_none: function (e) {
    this.setData({
      region_c: false,
      region: e.currentTarget.dataset.text
    })
    // console.log(e.currentTarget.dataset.text)
  },
  toIndex: function (e) { //点击返回首页
    var that = this
    var curaddrId = e.target.dataset.addrid;
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    for (var i = 0; i < that.data.particular.length; i++) {
      if (curaddrId == that.data.particular[i].id) {
        prevPage.setData({
          location_e: that.data.particular[i].province,
          location_d: '',
          location: {
            latitude: that.data.particular[i].latitude,
            longitude: that.data.particular[i].longitude,
          }
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  getGelc: function (e) { //重新定位
    var that = this;
    that.setData({
      currentPosi: {
        curAddr: '定位中...',//当前地址
        curAddrPosi: { //当前地址坐标
          lng: '',
          lat: ''
        },
      },
    })
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        wx.request({
          //获取首页数据
          url: getApp().data.pathApi +"/utils/getMapAddress.do",
          method: 'post',
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (data) {
            var pageData = data.data
            console.log(pageData)

            that.setData({
              region_city:pageData.citys,
              region: pageData.citys[0].region_city1,
              currentPosi: {
                curAddr: pageData.address,//当前地址
                curAddrPosi: { //当前地址坐标
                  lng: res.longitude,
                  lat: res.latitude
                },
              },
              pageData: JSON.parse(pageData.nearby)
            })
          },
          fail: function () {
            console.log('错误')
          }
        })
      }
    })
  },
  mapSeach: function (oobj) {
    var that = this;
    wx.request({
      //获取首页数据
      url: getApp().data.pathApi +"/utils/getMapByKeyWord.do",
      method: 'post',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        keyword: that.data.region + oobj.address,
      },
      success: function (res) {
        var data = res.data
        var nearby = JSON.parse(data.nearby)
        console.log(nearby)
        if (oobj.seach) { //是搜索框的
          var seachRes = []; //搜索结果
          for (var i = 0; i < nearby.pois.length; i++) {
            var obj = {};
            obj.sAddr = nearby.pois[i].pname + nearby.pois[i].cityname + nearby.pois[i].adname + nearby.pois[i].name;
            obj.sAddrtit = nearby.pois[i].address;
            obj.id = nearby.pois[i].id;
            obj.location = nearby.pois[i].location;
            seachRes.push(obj);
          }
          that.setData({
            seachRes: seachRes,
            seachflag: false
          })
        } else { //如果不是搜索框的
          var currentPosi = that.data.currentPosi;
          var len = data.length > 5 ? 5 : data.length;
          var addrArr = [];
          for (var i = 0; i < len; i++) {
            var obj = {};
            obj.fjAddrName = data[i].address;
            obj.id = data[i].id;
            obj.lat = data[i].location.lat;
            obj.lng = data[i].location.lng;
            addrArr.push(obj);
          }
          currentPosi.curfjAddrArr = addrArr;
          that.setData({
            currentPosi: currentPosi
          })
        }
      },
    })
  },
  getValtoSeach: function (e) {
    var keyval = this.data.keyval;
    var obj = {};
    obj.address = keyval;
    obj.seach = true;
    if (obj.address) {
      this.mapSeach(obj);
    } else {
      this.setData({
        seachflag: true
      })
    }
  },
  getSeachVal: function (e) {
    var del;
    if (e.detail.value!=''){
      del=false;
    }else{
      del=true;
    }
    this.setData({
      keyval: e.detail.value,
      del:del
    })
  },
  delInputVal:function(){
    this.setData({
      keyval:'',
      del: true
    })
    this.getValtoSeach();
  },
  fujinToIndex: function (e) {
    var that = this
    var location = e.currentTarget.dataset.location
    var lo = location.toString().split(",");
    var address = e.currentTarget.dataset.address
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      location_e: address,
      location_d: '',
      location: {
        longitude: lo[0],
        latitude: lo[1],
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
  seachToIndex: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    for (var i = 0; i < that.data.seachRes.length; i++) {
      if (id == that.data.seachRes[i].id) {
        var lo = that.data.seachRes[i].location.toString().split(",");
        prevPage.setData({
          location_e: that.data.seachRes[i].sAddr,
          location_d: '',
          location: {
            longitude: lo[0],
            latitude: lo[1],
          }
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  localAddress: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      location_e: that.data.currentPosi.curAddr,
      location_d: '',
      location: {
        latitude: that.data.currentPosi.curAddrPosi.lat,
        longitude: that.data.currentPosi.curAddrPosi.lng,
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
})