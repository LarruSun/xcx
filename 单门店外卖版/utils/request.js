module.exports = {
  request: request
}

function request(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().data.pathApi + url,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: data || {},
      success: function(res) {
        console.log(res)
        if(res.data.type == 'success') {
          resolve(res);
        }else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            confirmColor: '#ffc824',
            success: function (res) {
              if (res.confirm) {
                if (getCurrentPages().length == 1) {
                  wx.switchTab({
                    url: '../../pages/index/index',
                  })
                } else {
                  wx.navigateBack();
                }
              }
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: res.errorMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
}