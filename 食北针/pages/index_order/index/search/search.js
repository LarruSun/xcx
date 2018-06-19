//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hidelistBox: true,
    isShowDown: "",
    toggleFlag: true,
    togon: "",
    hideguigeAlert: true,
    shopInf: {
      shopLogo: "../../img/kf.png",
      shopName: "真功夫(南新店)"
    },
    toView: [],
    scrollTop: 0,
    toViewItem: "",
    sizeData: {},  //规格数据展示
    cartData: {},  //购物车数据(需要传给后台的数据)
    gudingTit: "",
    haveResult:false
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var pageData={};
    pageData.rightList=JSON.parse(wx.getStorageSync(options.getdata) || '[]');
    that.setData({
      pageData: pageData,
      jsCartrightList: options.getdata,
      startingPrice: options.startingPrice,
      cartData: tempCartData,
      optionData: options
    });
    var tempCartData = this.getCartData();
    that.setData({
      cartData: tempCartData,
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('storage_bg'),
    })
  },
  onShow: function () {
    //this.pageTab();
    //this.setViewData();
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

  tosureOrder: function () { //跳转到订单页面
    var tempCartData = this.getCartData();
    console.log(tempCartData);
    wx.navigateTo({
      url: '/pages/sureOrder/sureOrder?shopId=' + this.data.optionData.shopId + '&latitude=' + this.data.optionData.latitude + '&longitude=' + this.data.optionData.longitude + '&startingPrice=' + this.data.optionData.startingPrice + '&takeOutAmount=' + this.data.optionData.takeOutAmount + '&business_name=' + this.data.optionData.business_name + '&branch_name=' + this.data.optionData.branch_name,
    })
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
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    var obj = {};
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        console.log(rightList[i].foodsData[j].foodsId, foodsId);
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
              }
            }
          }
        }
      }
    }
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var pageData = this.data.pageData;
    //pageData.rightList = rightList;
    var nRightList = this.seachReg(this.data.kreg);
    console.log(nRightList);
    pageData.rightList = nRightList;    
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
            }
          }
          this.hideSizeAlert();
        }
      }
    }
    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var pageData = this.data.pageData;   
    var nRightList= this.seachReg(this.data.kreg);
    console.log(nRightList);
    pageData.rightList = nRightList;    
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
    console.log(this.data.jsCartrightList);
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
      obj.totnum += obj.cartdata[m].foodsnum;
      obj.totprice += obj.cartdata[m].foodsnum * obj.cartdata[m].foodsPrice;
    }
    return obj;

  },
  clearCartData: function () {//清除购物车数据
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          rightList[i].foodsData[j].num = 0;
        } else {  //有规格
          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            rightList[i].foodsData[j].guigeList[k].num = 0;
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
  seachReg:function(reg){
       var newRightList = [];
       var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList) || '[]');
       console.log(rightList);
       for (var i = 0; i < rightList.length; i++) {
         var obj={};
         obj.foodsData=[];
         obj.typeId=rightList[i].typeId;
         obj.typeName=rightList[i].typeName;
         for (var j = 0; j < rightList[i].foodsData.length; j++) {
           console.log(rightList[i].foodsData[j].foodsName);
             if (rightList[i].foodsData[j].foodsName.indexOf(reg)>=0&&reg!="") {
                obj.foodsData.push(rightList[i].foodsData[j]);
                console.log(rightList[i].foodsData[j].foodsName);
                continue;
             }
             if (rightList[i].foodsData[j].briefCode && rightList[i].foodsData[j].briefCode.indexOf(reg) >= 0&&reg!= ""){
               obj.foodsData.push(rightList[i].foodsData[j]);
             }             
         }
         if (obj.foodsData.length>0){
           newRightList.push(obj);
         }         
       }       
       console.log(newRightList);
       return newRightList;
  },
  seachfood:function(e){
    var reg = e.detail.value.toUpperCase();
    var newRightList=this.seachReg(reg);
    var haveResult=newRightList.length>0?true:false
    var pageData=this.data.pageData;
    pageData.rightList = newRightList;
    console.log(reg);
    this.setData({
      kreg:reg,
      haveResult: haveResult,
      pageData: pageData
    })
  }
})


