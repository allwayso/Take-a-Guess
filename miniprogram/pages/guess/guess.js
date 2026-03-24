Page({
  data: {
    dish: null,
    userPrice: '',
    result: ''
  },
  onLoad: function () {
    this.loadNextDish()
  },
  loadNextDish: function () {
    this.setData({ dish: null, userPrice: '', result: '' })
    const db = wx.cloud.database()
    // 使用 aggregate 随机获取一条数据
    db.collection('dishes').aggregate()
      .sample({ size: 1 })
      .end()
      .then(res => {
        if (res.list && res.list.length > 0) {
          this.setData({ dish: res.list[0] })
        } else {
          this.setData({ result: '没有更多菜品了' })
        }
      })
  },
  onPriceInput: function (e) {
    this.setData({ userPrice: e.detail.value })
  },
  onSubmit: function () {
    const userPrice = parseInt(this.data.userPrice)
    const realPrice = this.data.dish.price
    if (isNaN(userPrice)) {
      this.setData({ result: '请输入有效的价格' })
      return
    }
    if (userPrice === realPrice) {
      this.setData({ result: '恭喜你，猜对了！' })
    } else if (userPrice > realPrice) {
      this.setData({ result: '猜高了，再试一次！' })
    } else {
      this.setData({ result: '猜低了，再试一次！' })
    }
  }
})
