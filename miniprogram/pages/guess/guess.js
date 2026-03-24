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
    const realPrice = this.data.dish.price
    if (isNaN(userPrice)) {
      this.setData({ result: '请输入有效的价格' })
      return
    }

    let attempts = this.data.attempts + 1
    const diff = Math.abs(userPrice - realPrice) / realPrice

    let feedback = ''
    let isGameOver = false

    if (userPrice === realPrice) {
      feedback = '神了！完全一致！'
      isGameOver = true
    } else if (diff <= 0.05) {
      feedback = '太厉害了，简直是行家！'
    } else if (diff <= 0.1) {
      feedback = '眼光不错，非常接近了！'
    } else if (diff <= 0.2) {
      feedback = '有点感觉，再琢磨琢磨？'
    } else {
      feedback = userPrice > realPrice ? '稍微有点高估了哦。' : '稍微有点低估了哦。'
    }

    if (attempts >= 2 && !isGameOver) {
      feedback += ` 游戏结束，真实价格是 ${realPrice} 元。`
      isGameOver = true
    }

    this.setData({ result: feedback, attempts: attempts, isGameOver: isGameOver })
  }
})
