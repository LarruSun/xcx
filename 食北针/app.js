// //app.js
App({

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs);

  },
  getUserInfo: function (cb) {
    var that = this
    //登录态过期
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        // if (that.globalData.userInfo) {
        //   typeof cb == "function" && cb(this.globalData.userInfo)
        // } else {
        // //调用登录接口
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: function (res) {
              //console.log({ extAppId: "wxd730c0a6af4c0f73", encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: 'https://www.eaqul.com/smallRoutineUser/utils/getUserOpenIdByCode.do',//自己的服务接口地址
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
                    //console.log(userInfo_)
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
            fail: function () {
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
  onReady: function () {

  },
  sendVerifyCode: function (e, openId, code) {
    wx.request({
      url: 'https://www.eaqul.com/smallRoutineUser/utils/smallRoutineGetCode.do',//自己的服务接口地址
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
        if (data.data.msgCode == "fail") {
          wx.showToast({
            title: data.data.message,
            icon: 'loading'
          })
        }else {
          wx.showToast({
            title: data.data.message,
            icon: 'success'
          })
        }
        
      }
    })
  }
})



