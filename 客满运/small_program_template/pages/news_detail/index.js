var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Data:null
  },
  getData:function(e){
    var that = this
    var getParams = {}
    getParams.newsId = e.id
    var customIndex = app.AddClientUrl("/get_news_bbs_detail.html", getParams)
    console.log(customIndex.url)

    wx.showLoading({
      title: 'loading'
    })
    //拿custom_page
    wx.request({
      url: customIndex.url ,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        WxParse.wxParse('article', 'html', res.data.content, that, 10);
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        that.setData({Data:res.data})
        wx.hideLoading()

      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})