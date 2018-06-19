// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'val': {
      type: 'Object',
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    obj: {
      a: 5555555
    },
    hidden: 'block'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function(){
      this.setData({
        hidden: 'none'
      })
    },
    open(val){
      this.setData({
        hidden: val
      })
    }

  }
})
