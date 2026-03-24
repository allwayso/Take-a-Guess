const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { dishId, userPrice, attempts } = event
  const dishRes = await db.collection('dishes').doc(dishId).get()
  const realPrice = dishRes.data.price
  
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

  return {
    feedback,
    isGameOver,
    realPrice: isGameOver ? realPrice : null
  }
}
