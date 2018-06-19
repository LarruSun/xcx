var app = getApp();
Page({
  data:{
    orderTitle: '',
    list: {},
    isUpdate: false,
    shoppingSum: 0,
    shoppingNum: 0,
    peopleShow: '',
    beizhuValue: '',
    peopleShow: '',
    people: '',
    remarkList: [],
    reallySum: 0,
    orderName: '',
    orderId: '',
    memberCard: {}
  },

  /* 支付 */
  pay(e) {
    /*if(!(this.data.people > 0)) {
      wx.showToast({title: '请选择用餐人数',icon: 'none',duration: 2000});
      return
    }*/
    var ticket = app.youhuiquan;
    let list = this.data.list;
    let foods = [];
    for (let k in list) {
      if(list[k].mark == '1'){
        for (let j in list[k].list) {
          for (let i in list[k].list[j].tech) {
            if (list[k].list[j].tech[i].ggName == '规格') {
              list[k].list[j].foodId = list[k].list[j].tech[i].id;
              list[k].list[j].tech.splice(i, 1);
              break
            }
          }
          foods.push({'foodId': list[k].list[j].foodId, 'tech': list[k].list[j].tech, 'num': list[k].list[j].num})
        }
      }else {
        foods.push({'foodId': list[k].id, 'tech': [], 'num': list[k].num,})
      }
    }
    let totalPrice = 0;
    let couponAmount = 0;

    if(this.data.memberCard.discount) {
      if (ticket){
        if (ticket.couponsType == 2) {
          totalPrice = this.data.shoppingSum + this.data.reallySum - (this.data.shoppingSum * (10 - ticket.discount) * 0.1)
          couponAmount = this.data.shoppingSum * (10 - ticket.discount) * 0.1
        } else if (ticket.couponsType == 1) {
          totalPrice = this.data.shoppingSum + this.data.reallySum - ticket.vouchers
          couponAmount = ticket.vouchers
        }
      }else{
        totalPrice = this.data.shoppingSum + this.data.reallySum - 
        (this.data.shoppingSum * (10 - this.data.memberCard.discount) * 0.1)
        couponAmount = this.data.shoppingSum * (10 - this.data.memberCard.discount) * 0.1
      }
    }else {
      totalPrice = this.data.shoppingSum + this.data.reallySum;
    }
    app.http.request('/order/utils/createOrder',{
      'openId': wx.getStorageSync('userInfo_').openId,
      'shopId': this.data.shopId,
      'cyUseNum': 0,
      'remark': this.data.beizhuValue,
      'totalPrice': totalPrice.toFixed(0),
      'orderName': this.data.orderName,
      'foods': JSON.stringify(foods),
      'soTotalPrice': (wx.getStorageSync('shoppingSum') + this.data.reallySum).toFixed(0),
      'orderId': this.data.orderId,
      'deskId' : wx.getStorageSync('scene'),
      'couponId': ticket ? ticket.id : '',
      'couponAmount': ticket ? couponAmount.toFixed(0) : '',
      'couponName': ticket ? ticket.couponsName : ''
    }).then(res => {
      this.setData({
        orderId: res.data.data
      });
      wx.navigateTo({'url' : '/pages/pay/pay?shopId=' + this.data.shopId + '&orderId=' + res.data.data + '&type=eatIn'})
    }, msg => {
      wx.showToast({title: msg, icon: 'none', duration: 2000});
    })
  },

  /* 跳转备注 */
  goRemark(e) {
    var id = e.currentTarget.dataset.id;
    app.info = this.data.beizhuValue;
    app.id = id;
    wx.navigateTo({url: '/pages/beizhuInfo/beizhuInfo'})
  },

  clipCoupons: function(){
    this.data.yuanjia = wx.getStorageSync('shoppingSum') * 0.01;
    
    if (null != this.data.couponId && "" != this.data.couponId) {
      wx.navigateTo({
        url: '../sureOrder/clipCoupons/clipCoupons?shopId=' + this.data.shopId + 
        '&couponId=' + this.data.couponId + '&yuanjia=' + this.data.yuanjia
      })
    } else {
      wx.navigateTo({
        url: '../sureOrder/clipCoupons/clipCoupons?shopId=' + this.data.shopId + '&yuanjia=' + this.data.yuanjia
      })
    }
  },

  /* 是否编辑 */
  update() {
    this.setData({
      isUpdate: !this.data.isUpdate,
    })
  },

  /* 删除商品 */
  delete(event) {
    let food = event.currentTarget.dataset.food;
    let index = event.currentTarget.dataset.index;
    let data = this.data.list;
    let shoppingSum = this.data.shoppingSum;
    let shoppingNum = this.data.shoppingNum;
    if(index != 'undefined') {
      shoppingSum -= food.num * food.price
      data[food.briefCode].list.splice(index, 1);
    }else {
      shoppingSum -= food.num * food.price;
      delete data[food.briefCode];
    }
    this.setData({
      list: data,
      shoppingSum: shoppingSum,
      shoppingNum: shoppingNum - food.num
    })
    this.saveShopping();
  },

  /* 添加商品 */
  addShopping(event){
    let food = event.currentTarget.dataset.food;
    let index = event.currentTarget.dataset.index;
    let data = this.data.list;
    let shoppingSum = this.data.shoppingSum;
    let shoppingNum = this.data.shoppingNum;
    if(index != 'undefined') {
      data[food.briefCode].list[index].num += 1;
      shoppingSum += data[food.briefCode].list[index].price;
    }else {
      data[food.briefCode].num += 1;
      shoppingSum += data[food.briefCode].price;
    }
    this.setData({
      list: data,
      shoppingSum: shoppingSum,
      shoppingNum: shoppingNum + 1
    })
    this.saveShopping();
  },

  /* 减少商品 */
  subShopping(event){
    let food = event.currentTarget.dataset.food;
    let index = event.currentTarget.dataset.index;
    let data = this.data.list;
    let shoppingSum = this.data.shoppingSum;
    let shoppingNum = this.data.shoppingNum;
    if(index != 'undefined') {
      if(data[food.briefCode].list[index].num > 1) {
        data[food.briefCode].list[index].num -= 1;
        shoppingSum -= data[food.briefCode].list[index].price;
      }else {
        shoppingSum -= data[food.briefCode].list[index].price;
        data[food.briefCode].list.splice(index,1);
      }
    }else {
      if(data[food.briefCode].num > 1) {
        data[food.briefCode].num -= 1;
        shoppingSum -= data[food.briefCode].price;
      }else {
        shoppingSum -= data[food.briefCode].price;
        delete data[food.briefCode];
      }
    }
    this.setData({
      list: data,
      shoppingSum: shoppingSum,
      shoppingNum: shoppingNum - 1
    })
    this.saveShopping();
  },

  saveShopping() {
    wx.setStorageSync('shoppingList', JSON.stringify(this.data.list));
    wx.setStorageSync('shoppingSum', this.data.shoppingSum);
    wx.setStorageSync('shoppingNum', this.data.shoppingNum);
  },

  onLoad:function(options){
    this.setData({
      orderTitle: options.orderName,
      list: JSON.parse(wx.getStorageSync('shoppingList')),
      shoppingSum: wx.getStorageSync('shoppingSum'),
      shoppingNum: wx.getStorageSync('shoppingNum'),
    });
    app.http.request('/order/utils/sureOrder',{
      'openId': wx.getStorageSync('userInfo_').openId,
      'shopId': options.shopId
    }).then(res => {
      let data = res.data.data.listCySurcharge;
      if(res.data.data.memberCardDefined) {
        this.setData({
          memberCard: res.data.data.memberCardDefined,
        })
      }
      this.setData({
        remarkList: data,
        shopId: options.shopId,
        orderName: options.orderName
      });

      var sum = 0;
      for (let k in data) {
        if(data[k].method == '0') {
          sum += data[k].content;
        }else if (data[k].method == '1') {
          sum += data[k].content * 0.01 * this.data.shoppingSum;
        }else if (data[k].method == '2') {
          sum += data[k].content * 1;
        }
      }
      this.setData({
        reallySum: sum
      })
    })
  },
  onShow:function(){
   
  },
})