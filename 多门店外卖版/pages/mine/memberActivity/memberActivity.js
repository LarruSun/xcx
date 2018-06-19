// pages/mine/memberActivity/memberActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conpun_tally:'border:0',
    currentId: '1001',
    section: [
      { name: '全部', id: '1001'},
      { name: '充值优惠', id: '1002'},
      { name: '积分兑换', id: '1003'}
    ],
    container_discounta: [
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
      that.toMemberActivity()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },

  toMemberActivity: function () {
    var that = this
    wx.request({
      url: getApp().data.pathApi +'/utils/toMemberActivity.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        that.setData({
          pageData: pageData
        })
      },
      fail: function () {

      }
    })
  },
  //横向导航
  handleTap: function (e) {
    var that = this
    let idC = e.currentTarget.id;
    var navTop = that.data.section;
    for (var i = 0; i < navTop.length; i++) {
      if (navTop[i].name == navTop) {
        arr.push(navTop[i]); 
      }
    }
    console.log(navTop.name)
    if (idC) {
      this.setData({ 
        currentId: idC
       })
      this.onLoad();
    }
    this.getDataByidC(navTop);
  },
  getDataByidC: function (navTop){
    //console.log(idC)
     var arr=[];
     var allData=this.data.container_discounta;
      for(var i=0;i<allData.length;i++){
        if (allData[i].credits == navTop.name) {
          arr.push(allData[i]);
        }
      }
      console.log(allData);
     return arr;
  },
  //活动详细兑换页面
  toChange: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    for (var i = 0; i < that.data.pageData.integralConvertList.length; i++) {
      if (id == that.data.pageData.integralConvertList[i].id) {
        var aData = JSON.stringify(that.data.pageData.integralConvertList[i]);
        wx.navigateTo({
          url: '../../mine/Change_Settings/Change_Settings?aData=' + aData
        })
      }
    }
  },

  
})