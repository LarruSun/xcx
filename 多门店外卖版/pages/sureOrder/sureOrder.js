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
    couponAmount: 0,
    couponName: '',
    couponType: '',
    useDishNum: 1,
    discount: 0,
    freightFree: '',
    beizhuValue: '无',
    receiptTitle: '无',
    people: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      url: getApp().data.pathApi +'/utils/sureOrder.do',//自己的服务接口地址
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
            address: pageData.data.address,
            method: pageData.data.method,
            time: pageData.data.time,
            boxFee: pageData.data.boxFee,
          })
        }
        if (pageData.data.memberCardDefined != null) {
          that.setData({
            freightFree: pageData.data.memberCardDefined.freightFree,
            discount: pageData.data.memberCardDefined.discount,
          })
        }

        var orderList = that.getCartData();
        console.log(orderList)
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
    var that = this
    if (that.data.beizhuValue != null) {
      wx.navigateTo({
        url: '/pages/beizhuInfo/beizhuInfo?beizhuValue=' + that.data.beizhuValue,
      })
    }else {
      wx.navigateTo({
        url: '/pages/beizhuInfo/beizhuInfo',
      })
    }
    
  },
  tofpInfo: function () {
    if (null != this.data.receiptId && "" != this.data.receiptId){
      wx.navigateTo({
        url: '/pages/fpInfo/fpInfo?receiptId=' + this.data.receiptId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/fpInfo/fpInfo',
      })
    }
    
  },
  topay: function () {
    var orderList = this.getCartData();
    console.log(orderList);

    var canSendData = this.handelBackData(orderList);
    console.log(canSendData)

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
      var that = this;
      var orderId = "";
      if (that.data.orderId != null && that.data.orderId != "数据获取异常") {
        orderId = that.data.orderId
      }
      var addressId = that.data.address.id;
      var payment = that.data.payMethod
      var foodIds = that.getFoodsIds()
      var sendFee = that.data.startingPrice * 100
      var deliveryFee = that.data.takeOutAmount * 100
      var cyUseNum = that.data.people
      var remark = that.data.beizhuValue
      var receiptTitle = that.data.receiptTitle
      var totalPrice = (that.data.orderList.totprice * 100).toFixed(0)
      var soTotalPrice = ((that.data.orderList.totprice*1 + that.data.youhui*1) * 100).toFixed(0)
      var orderName = that.data.business_name + '（' + that.data.branch_name + '）外卖订单'
      var couponId = that.data.couponId
      var qwe = parseFloat(that.data.couponAmount).toFixed(2)
      var couponAmount = (qwe * 100).toFixed(0)
      var couponName = that.data.couponName
      var couponType = that.data.couponType
      var foods = JSON.stringify(canSendData)
      var boxFee = that.data.orderList.totMealsPrice

      // var dd=this.getCartData();
      console.log(that.data);
      

      wx.request({
        url: getApp().data.pathApi +'/utils/createOrder.do',//自己的服务接口地址
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
          soTotalPrice: totalPrice,
          orderName: orderName,
          couponId: couponId,
          couponAmount: couponAmount,
          couponName: couponName,
          couponType: couponType,
          foods: foods,
          soTotalPrice: soTotalPrice,
          boxFee: boxFee,
          orderId:orderId
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
            var add_food = rightList[i].foodsData[j];
            var add_guige = add_food.guigeList[k];
            // var pros = this.handlesizeData();
            var foodsid_;
            if (foodsid.indexOf("_") > 0) {
              foodsid_ = foodsid.split("_")[0];
            }
            if (undefined == foodsid_ ? add_food.foodsId == foodsid : add_food.foodsId == foodsid_) {
              //循环查找是否有匹配的属性
              //是否没有匹配的


              if (undefined == add_food.selpro) {
                add_food.selpro = [];
              }
              for (var z = 0; z < add_food.selpro.length; z++) {
                if (undefined == foodsid_) {
                } else {
                  if (foodsid == add_food.selpro[z].id) {

                    add_food.selpro[z].num--;
                    if (add_food.selpro[z].num == 0) {
                      add_food.selpro.splice(z, 1);
                    }
                    break;
                  }
                }
                // if (add_food.selpro[z].pro == pros) {

                //   add_food.selpro[z].num--;
                //   if (add_food.selpro[z].num == 0) {
                //     add_food.selpro.splice(z, 1);
                //   }
                // }
              }

              rightList[i].foodsData[j].num--;
              console.log("thisdata:");
              console.log(this.data.sizeData);
              break;
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
    //单个添加
    var danFlag = false;
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          if (rightList[i].foodsData[j].foodsId == foodsid) {
            rightList[i].foodsData[j].num++;
          }
        } else {  //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            var add_food = rightList[i].foodsData[j];
            var add_guige = add_food.guigeList[k];
            // var pros = this.handlesizeData();
            var foodsid_;
            if (foodsid.indexOf("_") > 0) {
              foodsid_ = foodsid.split("_")[0];
            }
            if (undefined == foodsid_ ? add_food.foodsId == foodsid : add_food.foodsId == foodsid_) {
              //循环查找是否有匹配的属性
              //是否没有匹配的
              if (!danFlag) {
              var flag = true;
              if (undefined == add_food.selpro) {
                add_food.selpro = [];
              }
              for (var z = 0; z < add_food.selpro.length; z++) {
                if (undefined == foodsid_) {
                } else {
                  if (foodsid == add_food.selpro[z].id) {
                    flag = false
                    add_food.selpro[z].num++;
                    break;
                  }
                }
                // if (add_food.selpro[z].pro == pros) {
                //   flag = false;
                //   add_food.selpro[z].num++;
                // }
              }
              // if (flag) {
              //   console.log(foodsid + "_" + Math.ceil(Math.random() * 10000));
              //   var selpro = {
              //     id: foodsid + "_" + Math.ceil(Math.random() * 10000),
              //     num: 1, pro: pros
              //   }
              //   add_food.selpro.push(selpro);
              // }
              }
              rightList[i].foodsData[j].num++;
              console.log("thisdata:");
              console.log(this.data.sizeData);
              danFlag = true;
              break;
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
            var add_food = rightList[i].foodsData[j];
            var add_guige = add_food.guigeList[k];
            var foodsid_;
            if (foodsid.indexOf("_") > 0) {
              foodsid_ = foodsid.split("_")[0];
            }
            if (undefined == foodsid_ ? add_food.foodsId == foodsid : add_food.foodsId == foodsid_) {
              //循环查找是否有匹配的属性
              //是否没有匹配的


              if (undefined == add_food.selpro) {
                add_food.selpro = [];
              }
              for (var z = 0; z < add_food.selpro.length; z++) {
                if (undefined == foodsid_) {
                } else {
                  if (foodsid == add_food.selpro[z].id) {

                    rightList[i].foodsData[j].num -= add_food.selpro[z].num;
                      add_food.selpro.splice(z, 1);
                    
                    break;
                  }
                }
               
              }

              //rightList[i].foodsData[j].num--;
              console.log("thisdata:");
              console.log(this.data.sizeData);
              break;
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
    obj.boxNum=0;
    obj.totMealsPrice = 0;
    obj.cartdata = [];
    for (var i = 0; i < cartData.length; i++) {
      for (var j = 0; j < cartData[i].foodsData.length; j++) {
        if (!cartData[i].foodsData[j].guige) { //无规格
          if (cartData[i].foodsData[j].num > 0) {
            //判断是否有重复的
            var flag = this.checkDanFood(obj.cartdata, cartData[i].foodsData[j].foodsId);
            if (flag) {
              continue;
            }
            var oobj = {};
            oobj.foodsId = cartData[i].foodsData[j].foodsId;
            oobj.foodsName = cartData[i].foodsData[j].foodsName;
            oobj.foodsPrice = (cartData[i].foodsData[j].foodsPrice * 0.01).toFixed(2);
            oobj.foodsnum = cartData[i].foodsData[j].num;
            obj.cartdata.push(oobj);
          }
        } else { //有规格
          if (undefined == cartData[i].foodsData[j].selpro) {
            cartData[i].foodsData[j].selpro = [];
          }
          for (var k = 0; k < cartData[i].foodsData[j].selpro.length; k++) {
            var cardfood_ = cartData[i].foodsData[j].selpro[k];
            var pro = JSON.parse(cardfood_.pro);
            var guige = pro[0];
            var oobj = {};
            oobj.foodsId = cardfood_.id;
            oobj.foodsName = cartData[i].foodsData[j].foodsName + '(' + guige.name + ')';
            var price = 0;
            price = guige.price;
            for (var z = 1; z < pro.length; z++) {
              price += pro[z].price
            }
            oobj.foodsPrice = (price * 0.01).toFixed(2);
            oobj.foodsnum = cardfood_.num;
            oobj.tech = pro;
            oobj.sendId=guige.id;
            obj.cartdata.push(oobj);


          }
        }
        obj.totMealsPrice += cartData[i].foodsData[j].mealsPrice * 100 * cartData[i].foodsData[j].num
      }
      // obj.totMealsPrice = obj.boxNum * (parseFloat(this.data.boxFee.content) * 100);//计算餐盒费
    }  
    for (var m = 0; m < obj.cartdata.length; m++) {
      obj.totnum += obj.cartdata[m].foodsnum;
      obj.totprice += obj.cartdata[m].foodsnum * obj.cartdata[m].foodsPrice;
    }

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

    youhui = yuanjia - obj.totprice
    obj.totprice = parseFloat(obj.totprice) + parseFloat(this.data.takeOutAmount)
    obj.totprice = obj.totMealsPrice / 100 + parseFloat(obj.totprice);  //总价格时将餐盒费算进去
    obj.totprice = parseFloat(obj.totprice).toFixed(2)
    
    this.setData({
      yuanjia: yuanjia,
      youhui: youhui.toFixed(2)
    })
    console.log("obj::")
    console.log(obj);
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
    if (null != this.data.couponId && "" != this.data.couponId) {
      wx.navigateTo({
        url: '../sureOrder/clipCoupons/clipCoupons?shopId=' + this.data.shopId + '&couponId=' + this.data.couponId,
      })
    }else {
      wx.navigateTo({
        url: '../sureOrder/clipCoupons/clipCoupons?shopId=' + this.data.shopId,
      })
    }
  },
  // handleBackData:function(_obj){
  //   var temObj = _obj.cartdata;
  //   var arr=[];
  //   for (var i = 0; i < temObj.length;i++){
  //        var obj={};
  //        if(obj.fid){  //有规格
  //          obj.tech=JSON.parse(temObj[i].str);          
  //        }
  //        obj.foodId = temObj[i].foodsId;
  //        obj.num = temObj[i].foodsnum;
  //        arr.push(obj);
  //    }
  //   return arr; 
  // },
  handelBackData:function(oobj){
    var tecartData = oobj.cartdata;
    var arr=[];
    for (var i = 0; i < tecartData.length;i++){
        var obj={};
        obj.foodId = tecartData[i].foodsId;
        obj.tech =[];
        if (tecartData[i].sendId){
          obj.foodId = tecartData[i].sendId;
          for (var k = 0; k < tecartData[i].tech.length;k++){
            if (tecartData[i].tech[k].id == tecartData[i].sendId){
               tecartData[i].tech.splice(k,1);
            }
          }
          obj.tech = tecartData[i].tech;
        }
        obj.num = tecartData[i].foodsnum;
        arr.push(obj);
     }
    return arr;
  },
  checkDanFood: function (cartData, foodsId) { //判断单规格查找是否有重复的
    for (var i = 0; i < cartData.length; i++) {

      if (cartData[i].foodsId == foodsId) {
        //存在返回true
        return true;
      }
    }
    return false;
  }
  
})