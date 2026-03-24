Page({
  data: {
    dish: null,
    restaurant: null,
    userPrice: '',
    result: '',
    usedDishIds: [],
    attempts: 0,
    isGameOver: false
  },
  onLoad: function () {
    this.loadNextDish()
  },
  loadNextDish: function () {
    this.setData({ dish: null, restaurant: null, userPrice: '', result: '', attempts: 0, isGameOver: false })
    const db = wx.cloud.database()
    const _ = db.command
    
    db.collection('dishes')
      .where({
        _id: _.nin(this.data.usedDishIds)
      })
      .count()
      .then(res => {
        if (res.total > 0) {
          const skip = Math.floor(Math.random() * res.total)
          db.collection('dishes')
            .where({
              _id: _.nin(this.data.usedDishIds)
            })
            .skip(skip)
            .limit(1)
            .get()
            .then(res => {
              if (res.data && res.data.length > 0) {
                const dish = res.data[0]
                this.setData({ 
                  dish: dish,
                  usedDishIds: [...this.data.usedDishIds, dish._id]
                })
                // 获取餐厅信息
                db.collection('restaurants').doc(dish.restaurant_id).get().then(res => {
                  this.setData({ restaurant: res.data })
                })
              }
            })
        } else {
          this.setData({ result: '没有更多菜品了' })
        }
      })
  },
  onPriceInput: function (e) {
    this.setData({ userPrice: e.detail.value })
  },
  onSubmit: function () {
    if (this.data.isGameOver) return

    const userPrice = parseInt(this.data.userPrice)
    if (isNaN(userPrice)) {
      this.setData({ result: '请输入有效的价格' })
      return
    }

    wx.cloud.callFunction({
      name: 'checkGuess',
      data: {
        dishId: this.data.dish._id,
        userPrice: userPrice,
        attempts: this.data.attempts + 1
      }
    }).then(res => {
      this.setData({
        result: res.result.feedback,
        isGameOver: res.result.isGameOver,
        attempts: this.data.attempts + 1
      })
    })
  }
})
