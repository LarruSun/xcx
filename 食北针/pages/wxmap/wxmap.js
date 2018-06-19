// wxmap.js
 var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "../../img/posired.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 30
    }],
    point:{
      latitude: 23.099994,
      longitude: 113.324520
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this;
    // app.getwxPoint(function (point) {
    //   //更新数据
    //   var marker = that.data.markers;
    //   var points = that.data.point;
    //   marker.latitude = point.latitude;
    //   marker.longitude = point.longitude;
    //   points.latitude = point.latitude;
    //   points.longitude = point.longitude;
    //   that.setData({
    //     markers: marker,
    //     point: points
    //   })
    // });
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
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
  // map.js
    regionchange(e) {
      console.log(e.type +"regionchange")
    },
    markertap(e) {
      console.log(e.markerId +"markertap")
    },
    controltap(e) {
      console.log(e.controlId +"controltap")
    }
})