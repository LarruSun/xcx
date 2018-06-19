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
    haveResult:false,
    hideguigeAlert: true, //设置是否规格弹窗显示
    toViewItem: "",
    sizeData: {},  //规格数据展示
    cartData: {},  //购物车数据(需要传给后台的数据)
    gudingTit: "",
    rightBox_H: '',  //获取rightBox的高度
    userInfo: '',  //用户信息
    mdFlag: true,   //是否显示门店信息
    cFlag: true,   //是否显示菜信息
  },
  onLoad: function (options) {
    var that = this;
    var pageData={};
    pageData.rightList=JSON.parse(wx.getStorageSync(options.getdata) || '[]');
    that.setData({
      pageData: pageData,
      jsCartrightList: options.getdata,
      startingPrice: options.startingPrice,
      cartData: tempCartData,
      optionData: options,
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
    wx.navigateTo({
      url: '/pages/sureOrder/sureOrder?shopId=' + this.data.optionData.shopId + '&latitude=' + this.data.optionData.latitude + '&longitude=' + this.data.optionData.longitude + '&startingPrice=' + this.data.optionData.startingPrice + '&takeOutAmount=' + this.data.optionData.takeOutAmount + '&business_name=' + this.data.optionData.business_name + '&branch_name=' + this.data.optionData.branch_name,
    })
  },
  showSizeAlert: function (e) {   //显示规格弹窗
    var foodsId = e.target.dataset.foodsid;
    var sizeData = this.chazhaoSizeData(foodsId);
    this.setData({
      hideguigeAlert: false,
      sizeData: sizeData
    })
  },
  hideSizeAlert: function (e) {  //隐藏规格弹窗
    this.setData({
      hideguigeAlert: true
    })
  },
  showMDInfo: function () {  //显示门店信息
    this.setData({
      mdFlag: false
    })
  },
  hideMDInfo: function () {  //隐藏门店信息
    this.setData({
      mdFlag: true
    })
  },
  hideCInfo: function () {  //隐藏菜品信息
    this.setData({
      cFlag: true
    })
  },
  showCInfo: function () {  //显示菜品信息
    this.setData({
      cFlag: false
    })
  },

  chazhaoSizeData: function (foodsId) {  //根据foodid查找对应的规格数据
    //var rightList = JSON.parse(wx.getStorageSync(this.data.jsRightList));
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    var obj = {};
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (rightList[i].foodsData[j].foodsId == foodsId) {
          obj.foodsName = rightList[i].foodsData[j].foodsName;
          obj.thePrice = 0;
          if (rightList[i].foodsData[j].guige) {
            for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
              var isClass = k == 0 ? "ggsizeon" : ""
              //obj.thePrice += rightList[i].foodsData[j].guigeList[0].guigePrice;
              obj.guigeId = rightList[i].foodsData[j].guigeList[0].guigeId;
              rightList[i].foodsData[j].guigeList[k].isClass = isClass;
            }
            obj.thePrice += rightList[i].foodsData[j].guigeList[0].guigePrice;
          }
          if (rightList[i].foodsData[j].practice) {
            for (var k = 0; k < rightList[i].foodsData[j].practiceList.length; k++) {
              var isClass = k == 0 ? "ggsizeon" : ""
              //obj.thePrice += rightList[i].foodsData[j].practiceList[0].price;
              obj.practiceId = rightList[i].foodsData[j].practiceList[0].proId;
              rightList[i].foodsData[j].practiceList[k].isClass = isClass;
            }
            obj.thePrice += rightList[i].foodsData[j].practiceList[0].price;
          }

          obj.guigeList = rightList[i].foodsData[j].guigeList; //处理规格数据
          obj.ingredientsList = rightList[i].foodsData[j].ingredientsList;
          obj.practiceList = rightList[i].foodsData[j].practiceList;
          obj.remarkList = rightList[i].foodsData[j].remarkList;
          obj.guige = rightList[i].foodsData[j].guige;
          obj.ingredients = rightList[i].foodsData[j].ingredients;
          obj.isremark = rightList[i].foodsData[j].isremark;
          obj.practice = rightList[i].foodsData[j].practice;
          obj.foodsId = rightList[i].foodsData[j].foodsId;
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
            var add_food = rightList[i].foodsData[j];
            var add_guige = add_food.guigeList[k];
            var pros = this.handlesizeData();
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
                if (add_food.selpro[z].pro == pros) {

                  add_food.selpro[z].num--;
                  if (add_food.selpro[z].num == 0) {
                    add_food.selpro.splice(z, 1);
                  }
                }
              }

              rightList[i].foodsData[j].num--;
              break;
            }
          }
        }
      }
    }

    // var pageData = this.data.pageData;
    // pageData.rightList = rightList;
    // wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(pageData.rightList));
    // var tempCartData = this.getCartData();
    // this.setData({
    //   pageData: pageData,
    //   cartData: tempCartData
    // })

    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var pageData = this.data.pageData;
    //pageData.rightList = rightList;
    var nRightList = this.seachReg(this.data.kreg);
    pageData.rightList = nRightList;
    var tempCartData = this.getCartData();
    this.setData({
      pageData: pageData,
      cartData: tempCartData
    })

  },
  addcrtDataByfoodId: function (e) { //购物车+数据
    var foodsid = e.target.dataset.foodsid;
    //单个添加
    var danFlag = false;
    var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList));
    for (var i = 0; i < rightList.length; i++) {
      for (var j = 0; j < rightList[i].foodsData.length; j++) {
        if (!rightList[i].foodsData[j].guige) {//没有规格
          if (rightList[i].foodsData[j].foodsId == foodsid) {
            // if (!danFlag) {
              rightList[i].foodsData[j].num++;
              danFlag = true;
              break;
            // }
          }
        } else {  //有规格

          for (var k = 0; k < rightList[i].foodsData[j].guigeList.length; k++) {
            var add_food = rightList[i].foodsData[j];
            var add_guige = add_food.guigeList[k];
            var pros = this.handlesizeData();
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
                if (add_food.selpro[z].pro == pros) {
                  flag = false;
                  add_food.selpro[z].num++;
                }
              }
              if (flag) {
                var selpro = {
                  id: foodsid + "_" + new Date().getTime(),
                  num: 1, pro: pros
                }
                add_food.selpro.push(selpro);
              }
              }
              rightList[i].foodsData[j].num++;
              danFlag = true;
              break;
            }
          }
          this.hideSizeAlert();
        }
      }
    }

    // var pageData = this.data.pageData;
    // pageData.rightList = rightList;
    // wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(pageData.rightList));
    // var tempCartData = this.getCartData();
    // this.setData({
    //   pageData: pageData,
    //   cartData: tempCartData
    // })

    wx.setStorageSync(this.data.jsCartrightList, JSON.stringify(rightList));
    var pageData = this.data.pageData;
    var nRightList = this.seachReg(this.data.kreg);
    pageData.rightList = nRightList;
    var tempCartData = this.getCartData();
    this.setData({
      pageData: pageData,
      cartData: tempCartData
    })

  },
  sizeChoseThis_guige: function (e) {//有规格的tab切换（换规格）
    var idx = e.target.dataset.idx //获取该索引
    //var thePrice = e.target.dataset.sizeprice;//获取该规格的价格
    //var guigeId = e.target.dataset.guigeid;//获取该规格的foodsid
    var sizeData = this.data.sizeData;
    //sizeData.guigeId = guigeId;
    //sizeData.thePrice = thePrice;
    for (var i = 0; i < sizeData.guigeList.length; i++) {
      sizeData.guigeList[i].isClass = ""
    }
    sizeData.guigeList[idx].isClass = "ggsizeon";
    sizeData.thePrice = this.calcSizeChosePrice(sizeData);
    this.setData({
      sizeData: sizeData
    })
  },
  sizeChoseThis_jialiao: function (e) {  //加料
    var idx = e.target.dataset.idx //获取该索引
    var sizeData = this.data.sizeData;
    //for (var i = 0; i < sizeData.ingredientsList.length; i++) {
    sizeData.ingredientsList[idx].isClass = sizeData.ingredientsList[idx].isClass == 'ggsizeon' ? '' : 'ggsizeon';
    //}
    sizeData.thePrice = this.calcSizeChosePrice(sizeData);
    this.setData({
      sizeData: sizeData
    })
  },
  sizeChoseThis_zuofa: function (e) { //做法
    var idx = e.target.dataset.idx //获取该索引
    var sizeData = this.data.sizeData;
    for (var i = 0; i < sizeData.practiceList.length; i++) {
      sizeData.practiceList[i].isClass = ""
    }
    sizeData.practiceList[idx].isClass = sizeData.practiceList[idx].isClass == 'ggsizeon' ? '' : 'ggsizeon';
    sizeData.thePrice = this.calcSizeChosePrice(sizeData);
    this.setData({
      sizeData: sizeData
    })
  },
  sizeChoseThis_beizu: function (e) { //备注
    var idx = e.target.dataset.idx //获取该索引
    var sizeData = this.data.sizeData;
    // for (var i = 0; i < sizeData.remarkList.length; i++) {
    //   sizeData.remarkList[i].isClass = ""
    // }
    sizeData.remarkList[idx].isClass = sizeData.remarkList[idx].isClass == 'ggsizeon' ? '' : 'ggsizeon';
    sizeData.thePrice = this.calcSizeChosePrice(sizeData);
    this.setData({
      sizeData: sizeData
    })
  },
  calcSizeChosePrice: function (sizeData) { //计算有规格的总价格
    var thePrice = 0;
    if (sizeData.guige) { //查找规格价格
      for (var i = 0; i < sizeData.guigeList.length; i++) {
        if (sizeData.guigeList[i].isClass == 'ggsizeon') {
          thePrice += sizeData.guigeList[i].guigePrice;
        }
      }
    }
    if (sizeData.ingredients) { //查找加料价格
      for (var i = 0; i < sizeData.ingredientsList.length; i++) {
        if (sizeData.ingredientsList[i].isClass == 'ggsizeon') {
          thePrice += sizeData.ingredientsList[i].price;
        }
      }
    }
    if (sizeData.practice) { //查找做法价格
      for (var i = 0; i < sizeData.practiceList.length; i++) {
        if (sizeData.practiceList[i].isClass == 'ggsizeon') {
          thePrice += sizeData.practiceList[i].price;
        }
      }
    }
    if (sizeData.isremark) { //查找做法价格
      for (var i = 0; i < sizeData.remarkList.length; i++) {
        if (sizeData.remarkList[i].isClass == 'ggsizeon') {
          thePrice += sizeData.remarkList[i].price||0;
        }
      }
    }
    return thePrice;
  },
  getCartData: function () {
    var cartData = JSON.parse(wx.getStorageSync(this.data.jsCartrightList) || '[]');
    var obj = {};
    obj.totnum = 0;
    obj.totprice = 0;
    obj.totMealsPrice = 0;
    obj.boxNum = 0;
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
            oobj.foodsPrice = cartData[i].foodsData[j].foodsPrice;
            oobj.foodsnum = cartData[i].foodsData[j].num;
            oobj.strArr=[];
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
            var strArr = [];
            for (var z = 1; z < pro.length; z++) {
              price += pro[z].price;
              strArr.push(pro[z].name);
            }
            oobj.foodsPrice = price;
            oobj.foodsnum = cardfood_.num;
            oobj.strArr = strArr;
            obj.cartdata.push(oobj);

          }
        }
        obj.totMealsPrice += cartData[i].foodsData[j].mealsPrice * 100 * cartData[i].foodsData[j].num
      }
      // obj.totMealsPrice = obj.boxNum * (parseFloat(this.data.optionData.boxFee) * 100);//计算餐盒费
    }
    for (var m = 0; m < obj.cartdata.length; m++) {
      obj.totnum += obj.cartdata[m].foodsnum * 1;
      obj.totprice += obj.cartdata[m].foodsnum * obj.cartdata[m].foodsPrice;
    }
    obj.totprice += obj.totMealsPrice;  //总价格时将餐盒费算进去
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
            rightList[i].foodsData[j].selpro = [];
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
  },
  seachReg:function(reg){
       var newRightList = [];
       var rightList = JSON.parse(wx.getStorageSync(this.data.jsCartrightList) || '[]');
       for (var i = 0; i < rightList.length; i++) {
         var obj={};
         obj.foodsData=[];
         obj.typeId=rightList[i].typeId;
         obj.typeName=rightList[i].typeName;
         for (var j = 0; j < rightList[i].foodsData.length; j++) {
             if (rightList[i].foodsData[j].foodsName.indexOf(reg)>=0&&reg!="") {
                obj.foodsData.push(rightList[i].foodsData[j]);
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
       return newRightList;
  },
  seachfood:function(e){
    var reg = e.detail.value.toUpperCase();
    var newRightList=this.seachReg(reg);
    var haveResult=newRightList.length>0?true:false
    var pageData=this.data.pageData;
    pageData.rightList = newRightList;
    this.setData({
      kreg:reg,
      haveResult: haveResult,
      pageData: pageData
    })
  },
  handlesizeData: function () {
    var oobj = {
      guige: [],
      jialiao: [],
      zuofa: [],
      beizu: []
    };
    var _obj = [];
    var guigeList = this.data.sizeData.guigeList;
    var ingredientsList = this.data.sizeData.ingredientsList;
    var practiceList = this.data.sizeData.practiceList;
    var remarkList = this.data.sizeData.remarkList;
    if (guigeList){
        for (var i = 0; i < guigeList.length; i++) {
          if (guigeList[i].isClass && guigeList[i].isClass == 'ggsizeon') {
            var obj = {};
            obj.id = guigeList[i].guigeId;
            obj.name = guigeList[i].guigeName;
            obj.price = guigeList[i].guigePrice;
            //oobj.guige.push(obj);
            _obj.push(obj);
          }
        }
    }
    if (ingredientsList){
      for (var i = 0; i < ingredientsList.length; i++) {
        if (ingredientsList[i].isClass && ingredientsList[i].isClass == 'ggsizeon') {
          var obj = {};
          obj.id = ingredientsList[i].proId;
          obj.name = ingredientsList[i].proName;
          obj.price = ingredientsList[i].price;
          //oobj.ingredientsList.push(obj);
          _obj.push(obj);
        }
      }
    }
    if (practiceList){
        for (var i = 0; i < practiceList.length; i++) {
          if (practiceList[i].isClass && practiceList[i].isClass == 'ggsizeon') {
            var obj = {};
            obj.id = practiceList[i].proId;
            obj.name = practiceList[i].proName;
            obj.price = practiceList[i].price;
            //oobj.practiceList.push(obj);
            _obj.push(obj);
          }
        }
    }
    if (remarkList){
        for (var i = 0; i < remarkList.length; i++) {
          if (remarkList[i].isClass && remarkList[i].isClass == 'ggsizeon') {
            var obj = {};
            obj.id = remarkList[i].proId;
            obj.name = remarkList[i].proName;
            obj.price = remarkList[i].price||0;
            //oobj.remarkList.push(obj);
            _obj.push(obj);
          }
        }
    }
    return JSON.stringify(_obj);
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


