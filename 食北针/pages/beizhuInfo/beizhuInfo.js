// beizhuInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offenuse: ["请提供餐具", "不加辣", "辣一点", "没零钱", "米饭多点"],
    beizhuValue: "",
    offenuse2: [
      { onclass: 'on_active', offenusename: "1人餐具", people: '1' },
      { onclass: '', offenusename: "2人餐具", people: '2' },
      { onclass: '', offenusename: "3人餐具", people: '3' },
      { onclass: '', offenusename: "4人餐具", people: '4' },
      { onclass: '', offenusename: "5人餐具", people: '5' },
      { onclass: '', offenusename: "6人餐具", people: '6' },
      { onclass: '', offenusename: "7人餐具", people: '7' },
      { onclass: '', offenusename: "8人餐具", people: '8' },
    ],
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
  tosureOrder: function () {
    var beizhuValue = this.data.beizhuValue;
    var offenuse2 = this.data.offenuse2
    var pages = getCurrentPages();             //  获取页面栈
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      beizhuValue: beizhuValue
    })
    for (var i = 0; i < offenuse2.length; i++) {
      if (offenuse2[i].onclass == 'on_active'){
        prevPage.setData({
          people: offenuse2[i].people,
          peopleShow: offenuse2[i].offenusename,
        })
     }
    }
    wx.navigateBack({
      delta: 1
    })
  },
  setThisValue: function (e) {
    var thisVal = e.currentTarget.dataset.val;
    var beizhuValue = this.data.beizhuValue;
    if (beizhuValue.indexOf(thisVal) < 0) {
      beizhuValue += thisVal + '、';
      this.setData({
        beizhuValue: beizhuValue
      })
    }
    console.log(this.data.beizhuValue)
  },
  bindme: function (e) {
    console.log(e);
    var beizhuValue = e.detail.value;
    this.setData({
      beizhuValue: beizhuValue
    })
    console.log(this.data.beizhuValue)
  },
  otherMoney: function (e) {
    //console.log(that)
    var offenuse2 = this.data.offenuse2;
    var ind = e.currentTarget.dataset.amount;
    //console.log("我的index是：" + e.currentTarget.dataset.amount);
    for (var i = 0; i < offenuse2.length; i++) {
      offenuse2[i].onclass = '';
    }
    offenuse2[ind].onclass = 'on_active';
    this.setData({
      offenuse2: offenuse2
    })

    //console.log(offenuse2)
  }
})