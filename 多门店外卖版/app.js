const http = require('./utils/request.js');
App({
  data:{
    // pathApi: 'https://yun.eaqul.com/api/smallroutine/open/smallRouinteApi',
    pathApi: 'https://yun.lolola.cn/api/smallroutine/open/smallRouinteApi',    //同一接口地址
    ppp:1,
  },
  onLaunch: function () {
  },
  
  getUserInfo: function (cb) {
    var that = this;
    //登录态过期
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: function (res) {
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: getApp().data.pathApi+'/utils/getUserOpenIdByCode.do',//自己的服务接口地址
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                success: function (data) {
                  //4.解密成功后 获取自己服务器返回的结果
                  var pageData = data.data
                  if (pageData.status == 1) {
                    that.globalData.userInfo = pageData.userInfo;
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    wx.setStorageSync('userInfo_', pageData.userInfo)
                    console.log('解密成功')
                    return that.globalData.userInfo;
                  } else {
                    console.log('解密失败')
                  }

                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            },
            fail: function (res) {
              wx.navigateTo({
                url: '/pages/auth/auth'
              })
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
        // }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },

  globalData: {
    userInfo: null,
    userPhone: null

  },
  callPhone(val){
    wx.makePhoneCall({
      phoneNumber: val
    })
  },
  sendVerifyCode: function (e, openId, code) {
    wx.request({
      url: getApp().data.pathApi +'/utils/smallRoutineGetCode.do',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        contactPhone: e,
        openId: openId,
        code: code
      },
      success: function (data) {
        if (data.data.type == "success") {
          wx.showToast({
            title: data.data.message,
            icon: 'success'
          })
        }else {
          wx.showModal({
            title: '提示',
            content: "短信发送失败",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        
      }
    })
  },
  http: http
})



