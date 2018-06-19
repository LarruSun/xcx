var app = getApp();

Page({
  data: {
    list: {},
    storeImgList: [],
    allFoodList: [],
    foodList: {},
    isShowModal: false,
    foodSpeciesIndex: 0,
    foodOffsetTop: '',
    foodOffsetTopList: [],
    isScroll: true,
    shoppingList: {},
    shoppingNum: 0,
    shoppingSum: 0,
    isShowShopping: false,
    foodDetail: {},
    isShowFoodModal: false,
    isShowFoodSizeModal: false,
    isShowStoreModal: false,
    foodSize: {},
    foodSizeList: {},
    foodSizeSum: 0,
    hideyhq: true
  },

  /* 显示门店详情 */
  showStoreModal(){
    this.setData({
      isShowStoreModal: true,
      isShowModal: true
    })
  },

  /* 拨打商户电话 */
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.list.shop.telephone
    })
  },

  /* 去结算 */
  goSureOrder() {
    wx.setStorageSync('shoppingList',JSON.stringify(this.data.shoppingList));
    wx.setStorageSync('shoppingSum',this.data.shoppingSum);
    wx.setStorageSync('shoppingNum',this.data.shoppingNum);
    wx.navigateTo({
      url: '/pages/orderEatIn/orderEatIn?shopId=' + this.data.list.cyDiningTable.shopId + '&openId=' + wx.getStorageSync('userInfo_').openId + '&type=eatIn' + '&orderName=' + this.data.list.cyDiningTable.areaName + '-' + this.data.list.cyDiningTable.deskNum,
    })
  },

  /* 增加规格商品 */
  addSizeShoppingBtn(event) {
    let data = event.currentTarget.dataset;
    let shoppinglist  = this.data.shoppingList;
    shoppinglist[data.food.briefCode].list[data.idx].num += 1;
    this.setData({
      shoppingSum: this.data.shoppingSum + data.food.price,
      shoppingNum: this.data.shoppingNum +1,
      shoppingList: shoppinglist
    })
  },

  /* 减少规格商品 */
  subSizeShoppingBtn(event) {
    let data = event.currentTarget.dataset;
    let shoppinglist  = this.data.shoppingList;
    if(shoppinglist[data.food.briefCode].list[data.idx].num <= 1) {
      shoppinglist[data.food.briefCode].list.splice(data.idx,1);
    }else {
      shoppinglist[data.food.briefCode].list[data.idx].num -= 1;
    }
    this.setData({
      shoppingSum: this.data.shoppingSum - data.food.price,
      shoppingNum: this.data.shoppingNum - 1,
      shoppingList: shoppinglist
    })
    if(this.data.shoppingNum == 0) {
      this.hideModal();
    }
  },

  /* 规格商品添加到购物车 */
  addSizeShopping() {
    let size = this.data.foodSize;
    let shoppingList = this.data.shoppingList;
    let tech = [];
    for (let k in this.data.foodSizeList) {
      tech.push(this.data.foodSizeList[k]);
    }
    if(shoppingList[size.briefCode]) {
      shoppingList[size.briefCode].list.push({'name': size.name, 'price': this.data.foodSizeSum, 'num': 1, 'briefCode' : size.briefCode, 'id' : size.id, 'tech' : tech, 'ggName': size.ggName});
    }else {
      shoppingList[size.briefCode] = {'mark': '1','list' : [{'name': size.name, 'price': this.data.foodSizeSum, 'num': 1, 'briefCode' : size.briefCode, 'id' : size.id, 'tech' : tech, 'ggName': size.ggName}]};
    }
    this.setData({
      shoppingList: shoppingList,
      shoppingSum: this.data.shoppingSum + this.data.foodSizeSum,
      shoppingNum: this.data.shoppingNum + 1,
    });
    this.hideModal();
  },

  /* 添加规格 */
  addSize(event) {
    let foodSizeList = this.data.foodSizeList;
    let foodSizeSum = 0;
    let size = event.currentTarget.dataset.size;
    if(foodSizeList[size.ggName]) {
      if(foodSizeList[size.ggName].id == size.id) {
        if(size.ggName != '规格' && size.ggName != '做法') {
          delete foodSizeList[size.ggName]
        }
      }else {
        foodSizeList[size.ggName] = {'id' : size.id, 'name' : size.name, 'price': size.price, 'ggName': size.ggName};
      }
    }else {
      foodSizeList[size.ggName] = {'id' : size.id, 'name' : size.name, 'price': size.price, 'ggName': size.ggName};
    }
    for (let k in foodSizeList) {
      foodSizeSum += foodSizeList[k].price
    }
    
    this.setData({
      foodSizeList: foodSizeList,
      foodSizeSum: foodSizeSum
    });
  },

  /* 显示商品详情 */
  showFoodModal(event) {
    this.setData({
      foodDetail: event.currentTarget.dataset.food,
      isShowFoodModal: true,
      isShowModal: true,
    })
  },

  /* 减少商品 */
  subShopping(event) {
    let food = event.currentTarget.dataset.food;
    let shoppingList = this.data.shoppingList;
    if( shoppingList[food.briefCode].num > 1) {
      shoppingList[food.briefCode].num--
    }else {
      delete shoppingList[food.briefCode]
    }
    this.setData({
      shoppingList: shoppingList,
      shoppingSum: this.data.shoppingSum - food.price,
      shoppingNum: this.data.shoppingNum - 1,
    });
    if(this.data.shoppingNum == 0) {
      this.hideModal();
    }
  },
  
  /* 增加商品 */
  addShopping(event) {
    let food = event.currentTarget.dataset.food;
    let shoppingList = this.data.shoppingList;
    if(shoppingList[food.briefCode]) {
      shoppingList[food.briefCode].num++;
    }else {
      shoppingList[food.briefCode] = {'name': food.name, 'price': food.price, 'num': 1, 'briefCode' : food.briefCode, 'id' : food.foodId};
    }
    this.setData({
      shoppingList: shoppingList,
      shoppingSum: this.data.shoppingSum + food.price,
      shoppingNum: this.data.shoppingNum + 1,
    });
  },
  
  /* 显示购物车 */
  showShoppingModal() {
    if(this.data.shoppingNum > 0) {
      this.setData({
        isShowModal: true,
        isShowShopping: true,
      })
    }
  },
  
  /* 清空购物车 */
  clearShopping() {
    this.setData({
      isShowModal: false,
      isShowShopping: false,
      shoppingSum: 0,
      shoppingNum: 0,
      shoppingList: {},
    })
  },

  /* 显示规格 */
  showFoodSizeModal(event) {
    let data = event.currentTarget.dataset.food.map['规格'][0];
    let foodSizeList = {};
    let sum = 0;
    foodSizeList['规格'] = {'id' : data.id, 'name' : data.name, 'price': data.price, 'ggName': data.ggName};
    sum += data.price;
    if(event.currentTarget.dataset.food.map['做法']){
      if(event.currentTarget.dataset.food.map['做法'].length > 0) {
        let method = event.currentTarget.dataset.food.map['做法'][0];
        foodSizeList['做法'] = {'id' : method.id, 'name' : method.name, 'price': method.price, 'ggName': method.ggName};
        sum += method.price;
      }
    }
    this.setData({
      isShowModal: true,
      isShowFoodSizeModal: true,
      foodSize: event.currentTarget.dataset.food,
      foodSizeList: foodSizeList,
      foodSizeSum: sum
    })
    console.log(this.data.foodSize)
  },

  /* 跳转指定菜品联动 */
  switchSpecies(event){
    this.setData({
      foodSpeciesIndex : event.currentTarget.dataset.idx,
      foodList: this.data.allFoodList[event.currentTarget.dataset.idx],
      /* foodOffsetTop : this.data.foodOffsetTopList[event.currentTarget.dataset.idx], */
      isScroll: false,
    })
  },

  /* 滚动列表联动 */
  foodListScroll(event) {
    /* if(!this.data.isScroll) {
      this.setData({isScroll: true})
      return
    }
    let that = this;
    let scrollTop = event.detail.scrollTop;
    let foodOffsetTopList = that.data.foodOffsetTopList;
    for (let k in foodOffsetTopList) {
      if( scrollTop <= foodOffsetTopList[k]) {
        that.setData({ foodSpeciesIndex: k - 1 < 0 ? '0' : k - 1 });
        return
      }
    } */
  },

  /* 隐藏模态框 */
  hideModal() {
    this.setData({
      isShowModal: false,
      isShowShopping: false,
      isShowFoodModal: false,
      isShowFoodSizeModal: false,
      isShowStoreModal: false
    })
  },

//显示隐藏优惠券
  hideyhq: function () {
    this.setData({
      hideyhq: true
    })
  },
  showyhq: function () {
    this.setData({
      hideyhq: false
    })
  },

  onLoad: function (options) {
    let that = this;
    wx.setStorageSync('storage_bg', '#464646');
    app.getUserInfo(function (userInfo) {
      wx.setStorageSync('userInfo_', userInfo)
    })
    let scene = decodeURIComponent(options.scene);
    wx.setStorageSync('scene', scene);
    app.http.request('/utils/getNewCyDataByTableId',{'tableId': scene}).then(res => {
      let allFoodList = [...res.data.data.cyFoodStatusVoList, ...res.data.data.cyFoodTypeV0];
      that.setData({
        list : res.data.data,
        allFoodList : allFoodList,
        storeImgList: res.data.data.shop.imgUrl.split(','),
        foodList: allFoodList[that.data.foodSpeciesIndex]
      });
      if(res.data.data.openOrClose == '0') {
        wx.showModal({
          title: '提示',
          content: '商家已打烊',
          showCancel: false,
          confirmColor: '#ffc824',
          success: function(res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        })
      }

      /* 计算每个菜品列表的高度 */
      /* setTimeout(()=> {
        wx.createSelectorQuery().selectAll('#food-item').boundingClientRect(function(rect){
          wx.createSelectorQuery().select('.store-wrap').boundingClientRect(function(storeOffset){
            let foodOffsetTopList = [];
            rect.forEach(item => {
              foodOffsetTopList.push(item.top - storeOffset.height);
            });
            that.setData({foodOffsetTopList: foodOffsetTopList});
          }).exec();
        }).exec();
      },300) */
    });
  },

  onShow: function () {
    let data = wx.getStorageSync('shoppingList');
    let shoppingSum = wx.getStorageSync('shoppingSum');
    let shoppingNum = wx.getStorageSync('shoppingNum');
    if(data == '') {
      this.setData({shoppingList : {}})
    }else {
      this.setData({
        shoppingList : JSON.parse(data),
        shoppingSum : shoppingSum,
        shoppingNum : shoppingNum,
      })
    }
  },

  onHide:function () {
    wx.setStorageSync('shoppingList',JSON.stringify(this.data.shoppingList));
    wx.setStorageSync('shoppingSum',this.data.shoppingSum);
    wx.setStorageSync('shoppingNum',this.data.shoppingNum);
  }
})