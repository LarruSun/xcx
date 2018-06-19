// pages/mine/QRCode/QRCode.js
var wxbarcode = require('../../../utils/index.js');
Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      placeholder:options.cardNum
    })
  },
  onReady: function () {

  },
  onShow: function () {
    wxbarcode.barcode('barcode', this.data.placeholder, 680, 200);
    wxbarcode.qrcode('qrcode', this.data.placeholder, 420, 420);
    // wxbarcode.barcode('barcode','81993606181', 680, 200);
    // wxbarcode.qrcode('qrcode', '81993606181', 420, 420);

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },

})