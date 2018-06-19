
var app = getApp()
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    isnonShow: true,
    isneedfp: false
  },
  onLoad: function (options) {
    this.setData({
      receiptId: options.receiptId
    })
  },
  onShow: function (e) {
    this.pageTab()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
  },
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      this.fpInfo();
      //this.fpList()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  fpInfo: function (e) {
    var that = this
    wx.request({
      url: getApp().data.pathApi + '/utils/fpInfo.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
      },
      success: function (data) {
        var pageData = data.data;
        if (null != that.data.receiptId && "" != that.data.receiptId) {
        for (var i = 0; i < pageData.receiptList.length; i++) {
          pageData.receiptList[i].ishidden = true;
            if (that.data.receiptId == pageData.receiptList[i].id) {
              pageData.receiptList[i].ishidden = false;
            }
          }
        that.setData({
          items: pageData.receiptList,
          isneedfp: true
        })
        }else {
          for (var i = 0; i < pageData.receiptList.length; i++) {
            pageData.receiptList[i].ishidden = true;
          }
          that.setData({
            items: pageData.receiptList,
          })
        }
      },
      fail: function () {
      }
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    //console.log(e);
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    console.log(e);
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    //debugger;
    var that = this;
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    wx.request({
      url: getApp().data.pathApi + '/utils/deleReceipt.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        receiptId: e.currentTarget.dataset.fpid
      },
      success: function (data) {
        var pageData = data.data;

      },
      fail: function () {

      }
    })
    this.setData({
      items: this.data.items
    }, function () {
      var newfpList = [];
      for (var i = 0; i < that.data.items.length; i++) {
        newfpList.push(that.data.items[i].content);
      }
      var tostr = newfpList.join("#");
      wx.setStorageSync('fpList', '#' + tostr);
    })
    this.isnonShowfn();
  },
  tocreatefp: function () {
    wx.navigateTo({
      url: "createfp/createfp"
    })
  },
  //判断有没有发票
  isnonShowfn: function () {
    var isnonShow = this.data.items.length > 0 ? true : false;
    this.setData({
      isnonShow: isnonShow
    })
  },
  isselectThis: function (e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
    var items = this.data.items;
    if (idx < 0) {
      for (var i = 0; i < items.length; i++) {
        items[i].ishidden = true;
      }
      this.setData({
        items: items,
        isneedfp: false
      })
    } else {
      for (var i = 0; i < items.length; i++) {
        items[i].ishidden = true;
      }
      items[idx].ishidden = false;
      this.setData({
        items: items,
        isneedfp: true
      })
    }
    console.log(items)
  },
  //选择发票
  chooseFp: function (e) {
    var that = this
    var data_ = that.data.items
    var id = e.currentTarget.dataset.fpid
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    for (var i = 0; i < data_.length; i++) {
      if (id == data_[i].id) {
        prevPage.setData({
          receiptId: data_[i].id,
          receiptTitle: data_[i].receiptTitle
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  //不使用发票
  noReceipt: function (e) {
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      receiptTitle: '无'
    })
    wx.navigateBack({
      delta: 1
    })
  }
})