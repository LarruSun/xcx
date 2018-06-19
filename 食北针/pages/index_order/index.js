//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    orderId:null,
    hidelistBox: true,
    isShowDown: "",
    toggleFlag: true,
    togon: "",
    hideguigeAlert: true,
    toView: [],
    scrollTop: 0,
    toViewItem: "",
    sizeData: {},  //规格数据展示
    cartData: {},  //购物车数据(需要传给后台的数据)
    gudingTit:""
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    //console.log(options.backgroundColor)
    var that = this;
    this.setData({
      shopId: options.shopId,
      jsRightList: 'rightList' + options.shopId,
      jsCartrightList: 'cartrightList' + options.shopId
    })
    if(options.orderId != null) {
      that.setData({
        orderId:options.orderId
      })
    };
    
  },
  onUnload:function(){
    var that=this;
    wx.removeStorage({
      key: that.data.jsCartrightList,
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  onShow: function () {
    this.pageTab();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
    //this.setViewData();
  },
  //页面标签切换及数据加载基础
  pageTab: function (params) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo_')
    that.setData({
      userInfo: userInfo
    })
    if (userInfo != null && userInfo.openId != null) {
      this.takeOutPageData()
      
    } else {
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  },
  takeOutPageData: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var orderId = 'null'
    if(that.data.orderId != null) {
      orderId = that.data.orderId
    }
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/toTakeOut.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        openId: that.data.userInfo.openId,
        shopId: that.data.shopId,
        orderId: orderId
      },
      success: function (data) {
        if (data.statusCode == 404) {

        }
        var pageData = data.data
        that.setData({
          isKy: pageData.isKy
        })
        console.log(pageData)
        var toView = [], tempArr = [], tempCartData = {};
        var tit;
        for (var i = 0; i < pageData.leftList.length; i++) {
          var ison = i == 0 ? 'on' : '';
          pageData.leftList[i].isclass = ison;
          tit=pageData.leftList[0].typeName;
        }
        wx.setStorageSync(that.data.jsRightList, JSON.stringify(pageData.rightList));
        var ishavecartrightList = JSON.parse(wx.getStorageSync(that.data.jsCartrightList) || '[]');
        if (ishavecartrightList.length > 0 && orderId == "null") { //如果本地有数据
          pageData.rightList = ishavecartrightList;
          tempCartData = that.getCartData();
          console.log(tempCartData);
        } else { //如果本地没有数据
          wx.setStorageSync(that.data.jsCartrightList, JSON.stringify(pageData.rightList));
        }
        if (orderId != null && orderId != "null") {
          wx.setStorageSync(that.data.jsCartrightList, JSON.stringify(pageData.rightList));
          tempCartData = that.getCartData();
        }
        wx.setNavigationBarTitle({ title: pageData.title });
        
        that.setData({
          pageData: pageData,
          cartData: tempCartData,
          gudingTit: tit,
          topBackgroundColor: pageData.backgroundColor
        })
        //设置view数据
        for (var k = 0; k < that.data.pageData.rightList.length; k++) {
          tempArr.push(that.data.pageData.rightList[k].foodsData.length * 120);
        }
        toView.push(0);
        for (var i = 0; i < tempArr.length; i++) {
          var tmp = 120*i;
          for (var j = 0; j <= i; j++) {
            tmp += tempArr[j];
          }
          toView.push(tmp);
        }
        that.setData({
          "toView": toView
        })
        console.log(toView);
        //设置view数据结束
        wx.hideLoading();
        console.log(that.data);
      },
      fail: function () {

      }
    })
  },
  toggleHideShow: function () {
    var swiFlag = this.data.toggleFlag ? false : true;
    if (swiFlag) {
      this.setData({ "togon": "" })
    } else {
      this.setData({ "togon": "togon" })
    }
    this.setData({ "toggleFlag": swiFlag })
  },
  hideByList: function () {
    var that = this;
    this.setData({ "isShowDown": "andown" });
    setTimeout(function () {
      that.setData({ "hidelistBox": true });
    }, 300)
  },
  showListBox: function () {
    var that = this;
    this.setData({ "isShowDown": "anup" });
    that.setData({ "hidelistBox": false });
  },
  tobussInfo: function () {
    wx.navigateTo({   //跳转到商家信息页面
      url: '/pages/bussinessInfo/bussinessInfo?shopId=' + this.data.shopId,
    })
  },
  tosureOrder: function () { //跳转到订单页面
    var tempCartData = this.getCartData();
    console.log(tempCartData);
    wx.navigateTo({
      url: '/pages/sureOrder/sureOrder?shopId=' + this.data.shopId + '&latitude=' + this.data.pageData.shop.latitude + '&longitude=' + this.data.pageData.shop.longitude + '&startingPrice=' + this.data.pageData.setting.startingPrice + '&takeOutAmount=' + this.data.pageData.setting.takeOutAmount + '&business_name=' + this.data.pageData.shop.business_name + '&branch_name=' + this.data.pageData.shop.branch_name,
    })
  },
  setThisItemAddClassOn: function (ind) { //左侧菜品点击的tab切换
    var pageData = this.data.pageData;
    for (var i = 0; i < pageData.leftList.length; i++) {
      pageData.leftList[i].isclass = "";
    }
    pageData.leftList[ind].isclass = "on";
    this.setData({ "pageData": pageData });
    return pageData.leftList[ind].typeName;
  },
  move: function () {//右侧菜品滑动对应左侧菜品分类显示
    var that = this;
    wx.createSelectorQuery().selectAll('.rBoxItem').boundingClientRect(function (rects) {
      for (var i = 0; i < rects.length; i++) {
        if (rects[i].top < 80 && rects[i].top > -260) {
          var tit=that.setThisItemAddClassOn(i);
          that.setData({
             "gudingTit":tit
          })
        }
      }
    }).exec(function () {

    })
  },
  rBoxItemToView: function (e) { //左侧菜品点击对应右侧菜品划到可视区
    var thisInd = e.target.dataset.indx;
    var tit=e.target.dataset.tit;
    var scrollTop = this.data.toView[thisInd];
    this.setThisItemAddClassOn(thisInd);
    this.setData({
      "scrollTop": scrollTop - 0,
      "gudingTit": tit
    })
    this.getCartData();
    console.log(this.data.toView);
  },
  setViewData: function () { //设置view数组数据
    var toView = [], tempArr = [];
    var that = this;
  },
  showSizeAlert: function (e) {
    var foodsId = e.target.dataset.foodsid;
    console.log(foodsId);
    var sizeData = this.chazhaoSizeData(foodsId);
    this.setData({
      hideguigeAlert: false,
      sizeData: sizeData
    })
    console.log(this.data.sizeData);
  },
  hideSizeAlert: function (e) {
    this.setData({
      hideguigeAlert: true
    })
  },
  chazhaoSizeData: function (foodsId) {
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsRightList));
    var obj = {};
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        console.log(rightList[i].foodsData[j].foodsId,foodsId);
        if (rightList[i].foodsData[j].foodsId == foodsId) {
          obj.foodsName = rightList[i].foodsData[j].foodsName;
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            var isClass = k == 0 ? "ggsizeon" : ""
            obj.thePrice = rightList[i].foodsData[j].guigeList[0].guigePrice;
            obj.guigeId = rightList[i].foodsData[j].guigeList[0].guigeId;
            rightList[i].foodsData[j].guigeList[k].isClass = isClass;
          }
          obj.guigeList = rightList[i].foodsData[j].guigeList;
          return obj;
        }
      }
    }
    return obj;
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
                rightList[i].foodsData[j].num--
              }
            }
          }
        }
      }
    }
    var pageData = this.data.pageData;
    pageData.rightList = rightList;
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(pageData.rightList));
    var tempCartData = this.getCartData();
    this.setData({
      pageData: pageData,
      cartData: tempCartData
    })

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
              rightList[i].foodsData[j].num++;
            }
          }
          this.hideSizeAlert();
        }
      }
    }
    var pageData = this.data.pageData;
    pageData.rightList = rightList;
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(pageData.rightList));
    var tempCartData = this.getCartData();
    this.setData({
      pageData: pageData,
      cartData: tempCartData
    })
    console.log(this.data.pageData);
  },
  sizeChoseThis: function (e) {//有规格的tab切换
    var idx = e.target.dataset.idx //获取该索引
    var thePrice = e.target.dataset.sizeprice;//获取该规格的价格
    var guigeId = e.target.dataset.guigeid;//获取该规格的foodsid
    var sizeData = this.data.sizeData;
    sizeData.guigeId = guigeId;
    sizeData.thePrice = thePrice;
    for (var i = 0; i < sizeData.guigeList.length; i++) {
      sizeData.guigeList[i].isClass = ""
    }
    sizeData.guigeList[idx].isClass = "ggsizeon";
    this.setData({
      sizeData: sizeData
    })
  },
  getCartData: function () {
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
            oobj.foodsPrice = cartData[i].foodsData[j].foodsPrice;
            oobj.foodsnum = cartData[i].foodsData[j].num;
            obj.cartdata.push(oobj);
          }
        } else { //有规格
          for (var k = 0; k < cartData[i].foodsData[j].guigeList.length; k++) {
            if (cartData[i].foodsData[j].guigeList[k].num > 0) {
              var oobj = {};
              oobj.foodsId = cartData[i].foodsData[j].guigeList[k].guigeId;
              oobj.foodsName = cartData[i].foodsData[j].foodsName + '(' + cartData[i].foodsData[j].guigeList[k].guigeName + ')';
              oobj.foodsPrice = cartData[i].foodsData[j].guigeList[k].guigePrice;
              oobj.foodsnum = cartData[i].foodsData[j].guigeList[k].num;
              obj.cartdata.push(oobj);
            }
          }
        }
      }
    }
    for (var m = 0; m < obj.cartdata.length; m++) {
      obj.totnum += obj.cartdata[m].foodsnum*1;
      obj.totprice += obj.cartdata[m].foodsnum * obj.cartdata[m].foodsPrice;
    }
    return obj;

  },
  clearCartData:function(){//清除购物车数据
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
            rightList[i].foodsData[j].num=0;
        } else {  //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
              rightList[i].foodsData[j].guigeList[k].num=0;
              rightList[i].foodsData[j].num = 0;
          }
          this.hideSizeAlert();
        }
      }
    }
    var pageData = this.data.pageData;
    pageData.rightList = rightList;
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(pageData.rightList));
    var tempCartData = this.getCartData();
    this.setData({
      pageData: pageData,
      cartData: tempCartData
    })
    this.hideByList();
    console.log(this.data.pageData);
  },
  search_href:function(){
    var that = this; 
    console.log(that.data)
    wx.navigateTo({   //跳转到搜索页面
      url: '/pages/index_order/index/search/search?shopId=' + this.data.shopId + '&latitude=' + this.data.pageData.shop.latitude + '&longitude=' + this.data.pageData.shop.longitude + '&startingPrice=' + this.data.pageData.setting.startingPrice + '&takeOutAmount=' + this.data.pageData.setting.takeOutAmount + '&business_name=' + this.data.pageData.shop.business_name + '&branch_name=' + this.data.pageData.shop.branch_name + '&getdata=' + this.data.jsCartrightList,
    })
  },

  //判断是否在营业时间
  isyinye:function(){
    var takeOutDate = this.data.pageData.setting.takeOutDate.split(",");
    var date=new Date();
    var weekDay=date.getDay()-1<0?6:date.getDate();
    var flag=false;
    for(var i=0;i<takeOutDate.length;i++){
       if(takeOutDate[i]==weekDay){
          flag = true;
          return flag;
       }
    }
    return flag;
  }

})


