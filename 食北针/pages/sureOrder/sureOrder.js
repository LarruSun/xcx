// sureOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: ['在线支付', '货到付款'],
    payMethod: '在线支付',
    orderList: [],
    edit: false,
    arriveTime: "14:15-14:30",
    yhq: "选择优惠券",
    couponId: '',
    couponAmount: '',
    couponName: '',
    couponType: '',
    useDishNum: 1,
    discount: '',
    freightFree: '',
    beizhuValue: '无',
    receiptTitle: '无',
    people: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);


    if (options.beizhuValue) {
      this.setData({
        beizhuValue: options.beizhuValue
      })
    }
    if (options.shopId) {
      this.setData({
        shopId: options.shopId,
        jsRightList: 'rightList' + options.shopId,
        jsCartrightList: 'cartrightList' + options.shopId
      })
    }

    console.log(this.data.orderList);



    if (options.latitude && options.longitude) {
      this.setData({
        latitude: options.latitude,
        longitude: options.longitude,
        startingPrice: options.startingPrice,
        takeOutAmount: parseFloat(options.takeOutAmount).toFixed(2),
        business_name: options.business_name,
        branch_name: options.branch_name
      })
    }


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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
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
      this.sureOrder()
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  //获取确定订单页面数据
  sureOrder: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/sureOrder.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        shopId: that.data.shopId
      },
      success: function (data) {
        var pageData = data.data
        console.log(pageData)
        if (that.data.address == null) {
          that.setData({
            address: pageData.address,
            method: pageData.method,
            time: pageData.time,
          })
        }
        if (pageData.memberCardDefined != null) {
          that.setData({
            freightFree: pageData.memberCardDefined.freightFree,
            discount: pageData.memberCardDefined.discount,
          })
        }

        var orderList = that.getCartData();
        that.setData({
          orderList: orderList
        })
        wx.hideLoading()
      },
      fail: function () {

      }
    })

  },
  //选择支付方式
  choosePayMethod: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: that.data.method,
      success: function (res) {
        console.log(that.data.method[res.tapIndex])
        that.setData({
          payMethod: that.data.method[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  tobeizhuInfo: function () {
    wx.navigateTo({
      url: '/pages/beizhuInfo/beizhuInfo',
    })
  },
  tofpInfo: function () {
    wx.navigateTo({
      url: '/pages/fpInfo/fpInfo',
    })
  },
  topay: function () {
    if (this.data.address == null) {
      wx.showModal({
        title: '提示',
        content: '请选择地址！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }

        }
      })
      return false
    }
    var distance = this.getDistance(this.data.latitude, this.data.longitude, this.data.address.latitude, this.data.address.longitude)
    console.log(distance)
    if (distance > 2000) {
      wx.showModal({
        title: '提示',
        content: '抱歉！您已超出店家配送范围！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false
    }
    if (parseFloat(this.data.orderList.yuanjia) < parseFloat(this.data.startingPrice)) {
      wx.showModal({
        title: '提示',
        content: '未达到起送金额！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }

        }
      })
      return false
    } else {
      var that = this
      var addressId = that.data.address.id
      var payment = that.data.payMethod
      var foodIds = that.getFoodsIds()
      var sendFee = that.data.startingPrice * 100
      var deliveryFee = that.data.takeOutAmount * 100
      var cyUseNum = that.data.people
      var remark = that.data.beizhuValue
      var receiptTitle = that.data.receiptTitle
      var totalPrice = that.data.orderList.totprice * 100
      var orderName = that.data.business_name + '（' + that.data.branch_name + '）外卖订单'
      var couponId = that.data.couponId
      var qwe = parseFloat(that.data.couponAmount).toFixed(2)
      var couponAmount = (qwe * 100).toFixed(0)
      var couponName = that.data.couponName
      var couponType = that.data.couponType

      wx.request({
        url: 'https://www.eaqul.com/smallRoutineUser/utils/createOrder.do',//自己的服务接口地址
        method: 'post',

        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          openId: that.data.userInfo.openId,
          shopId: that.data.shopId,
          addressId: addressId,
          payment: payment,
          foodIds: foodIds,
          sendFee: sendFee,
          deliveryFee: deliveryFee,
          cyUseNum: cyUseNum,
          remark: remark,
          receiptTitle: receiptTitle,
          totalPrice: totalPrice,
          orderName: orderName,
          couponId: couponId,
          couponAmount: couponAmount,
          couponName: couponName,
          couponType: couponType
        },
        success: function (data) {
          var pageData = data.data
          console.log(pageData)
          if(data.statusCode == 200) {
            wx.navigateTo({
              url: '/pages/pay/pay?orderId=' + pageData.message + '&shopId=' + that.data.shopId,
            })
          }else {
            wx.showToast({
              title: '提交失败',
              icon: 'loading',
              duration: 1000
            })
          }
        },
        fail: function () {

        }
      })

    }
  },
  getFoodsIds: function () {
    var cartData = this.getCartData()
    var foodsIds = ''
    for (var i = 0; i < cartData.cartdata.length; i++) {
      foodsIds += cartData.cartdata[i].foodsId + ':' + cartData.cartdata[i].foodsnum + ','
    }
    return foodsIds
  },
  toaddr: function () {
    wx.navigateTo({
      url: "../mine/myInfo/selectAddr/selectAddr?fromWhere=order",
    })
  },
  isEditdish: function (e) {
    var isedit = this.data.edit ? false : true;
    this.setData({
      edit: isedit
    })
  },

  subcrtDataByfoodId: function (e) { //购物车减数据
    var foodsid = e.target.dataset.foodsid;
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          if (rightList[i].foodsData[j].foodsId == foodsid) {
            if (rightList[i].foodsData[j].num <= 0) {

            } else {
              rightList[i].foodsData[j].num--
            }
          }
        } else { //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            if (rightList[i].foodsData[j].guigeList[k].guigeId == foodsid) {
              if (rightList[i].foodsData[j].guigeList[k].num <= 0) {

              } else {
                rightList[i].foodsData[j].guigeList[k].num--;
              }
            }
          }
        }
      }
    }
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var orderList = this.getCartData();
    this.setData({
      orderList: orderList
    })
    if (orderList.cartdata.length == 0) {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  addcrtDataByfoodId: function (e) { //购物车+数据
    var foodsid = e.target.dataset.foodsid;
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          if (rightList[i].foodsData[j].foodsId == foodsid) {
            rightList[i].foodsData[j].num++;
          }
        } else {  //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            if (rightList[i].foodsData[j].guigeList[k].guigeId == foodsid) {
              rightList[i].foodsData[j].guigeList[k].num++;
            }
          }
          //this.hideSizeAlert();
        }
      }
    }
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var orderList = this.getCartData();
    this.setData({
      orderList: orderList
    })
  },
  delcrtDataByfoodId: function (e) { //购物车删除数据
    var foodsid = e.target.dataset.foodsid;
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          if (rightList[i].foodsData[j].foodsId == foodsid) {
            if (rightList[i].foodsData[j].num <= 0) {

            } else {
              rightList[i].foodsData[j].num = 0;
            }
          }
        } else { //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            if (rightList[i].foodsData[j].guigeList[k].guigeId == foodsid) {
              if (rightList[i].foodsData[j].guigeList[k].num <= 0) {

              } else {
                rightList[i].foodsData[j].guigeList[k].num = 0;
              }
            }
          }
        }
      }
    }
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var orderList = this.getCartData();
    this.setData({
      orderList: orderList
    })
    if (orderList.cartdata.length == 0) {
      wx.navigateBack({
        delta: 1
      })
    }
    console.log(orderList);
  },
  getCartData: function () {   //获取购物车数据
    var cartData = JSON.parse(wx.getStorageSync(this.data.jsCartrightList) || '[]');
    console.log(cartData);
    var obj = {};
    obj.totnum = 0;
    obj.totprice = 0;
    obj.cartdata = [];
    for (var i = 0; i < cartData.length; i++) {
      for (var j = 0; j < cartData[i].foodsData.length; j++) {
        if (!cartData[i].foodsData[j].guige) { //无规格
          if (cartData[i].foodsData[j].num > 0) {
            var oobj = {};
            oobj.foodsId = cartData[i].foodsData[j].foodsId;
            oobj.foodsName = cartData[i].foodsData[j].foodsName;
            oobj.foodsPrice = cartData[i].foodsData[j].foodsPrice.toFixed(2);
            oobj.foodsnum = cartData[i].foodsData[j].num;
            obj.cartdata.push(oobj);
          }
        } else { //有规格
          for (var k = 0; k < cartData[i].foodsData[j].guigeList.length; k++) {
            if (cartData[i].foodsData[j].guigeList[k].num > 0) {
              var oobj = {};
              oobj.foodsId = cartData[i].foodsData[j].guigeList[k].guigeId;
              oobj.foodsName = cartData[i].foodsData[j].foodsName + '(' + cartData[i].foodsData[j].guigeList[k].guigeName + ')';
              oobj.foodsPrice = cartData[i].foodsData[j].guigeList[k].guigePrice.toFixed(2);
              oobj.foodsnum = cartData[i].foodsData[j].guigeList[k].num;
              obj.cartdata.push(oobj);
            }
          }
        }
      }
    }
    for (var m = 0; m < obj.cartdata.length; m++) {
      obj.totnum += obj.cartdata[m].foodsnum;
      obj.totprice += obj.cartdata[m].foodsnum * obj.cartdata[m].foodsPrice;
    }
    obj.totprice += parseFloat(this.data.takeOutAmount)
    var yuanjia = obj.totprice
    var youhui = obj.totprice
    if (this.data.freightFree != null && this.data.freightFree != "") {
      obj.totprice -= parseFloat(this.data.takeOutAmount)
    }
    if (this.data.couponId != null && this.data.couponId != '') {
      var couponAmount = parseFloat(this.data.couponAmount).toFixed(2)
      if (parseFloat(this.data.lowestConsume) > 0 && parseFloat(this.data.lowestConsume) <= yuanjia) {
        obj.totprice = (obj.totprice - couponAmount).toFixed(2)
      } else if (parseFloat(this.data.lowestConsume) == 0) {
        obj.totprice = (obj.totprice - couponAmount).toFixed(2)
      } else {
        wx.showModal({
          title: '提示',
          content: '该优惠券未达到满减金额!',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        this.setData({
          yhq: '选择优惠券',
          couponId: '',
          couponAmount: '',
          lowestConsume: ''
        })
      }
    } else if (this.data.discount != null && this.data.discount != "") {
      obj.totprice = (obj.totprice * (this.data.discount * 0.1)).toFixed(2)
    }
    if (obj.totprice < 0) {
      obj.totprice = 0
    }

    obj.totprice = parseFloat(obj.totprice).toFixed(2)
    youhui = yuanjia - obj.totprice
    this.setData({
      yuanjia: yuanjia,
      youhui: youhui.toFixed(2)
    })
    return obj;

  },

  adduseDishNum: function (e) {
    var useDishNum = this.data.useDishNum;
    useDishNum++;
    this.setData({
      useDishNum: useDishNum
    })
  },

  adduseDishNum: function (e) {
    var useDishNum = this.data.useDishNum;
    useDishNum++;
    this.setData({
      useDishNum: useDishNum
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
  },
  clipCoupons: function () {
    wx.navigateTo({
      url: '../sureOrder/clipCoupons/clipCoupons?shopId=' + this.data.shopId,
    })
  }
})