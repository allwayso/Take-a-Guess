# 餐厅数据 (restaurants.json)
[
  {
    "_id": "rest_001",
    "name": "魏厨私房菜",
    "location": {
      "address": "北京市朝阳区某某路1号",
      "lat": 39.9042,
      "lng": 116.4074
    }
  },
  {
    "_id": "rest_002",
    "name": "老北京炸酱面",
    "location": {
      "address": "北京市东城区某某胡同2号",
      "lat": 39.9150,
      "lng": 116.4100
    }
  }
]

# 菜品数据 (dishes.json)
[
  {
    "_id": "dish_001",
    "restaurant_id": "rest_001",
    "name": "招牌红烧肉",
    "price": 58,
    "image_url": "https://example.com/hongshaorou.jpg"
  },
  {
    "_id": "dish_002",
    "restaurant_id": "rest_001",
    "name": "清蒸鲈鱼",
    "price": 88,
    "image_url": "https://example.com/luyu.jpg"
  },
  {
    "_id": "dish_003",
    "restaurant_id": "rest_002",
    "name": "老北京炸酱面",
    "price": 25,
    "image_url": "https://example.com/zhajiangmian.jpg"
  }
]
