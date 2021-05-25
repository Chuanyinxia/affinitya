// 行人参数说明
export const age = {
  0: '<15岁',
  1: '15-60岁',
  2: '>60岁',
};
export const orientation = {
  0: '正向',
  1: '侧向',
  2: '背向',
};
export const hairstyle = {
  0: 'unidentified', // 'unidentified'
  1: '光头',
  2: '短发',
  3: '长发',
};
export const jacketType = {
  0: 'unidentified',
  1: '未穿上衣',
  2: '无袖',
  3: '短袖',
  4: '长袖',
};

export const lowerType = {
  0: 'unidentified', 1: '短裙', 2: '长裙', 3: '短裤', 4: '长裤', 5: '大衣',
};

export const hasGoods = {
  type: [
    'hat',
    'shopBag',
    'handbag',
    'singlePack',
    'backpack',
    'suitcase',
    'mobile',
    'umbrella',
    'glasses',
    'mask',
    'dangerous',
  ],
  0: 'Not Sure',
  1: 'No',
  2: 'Yes',
};

export const wheelbarrow = {
  0: 'unidentified',
  1: '无',
  2: '婴儿车',
  3: '购物车',
};
export const shoes = {
  0: 'unidentified',
  1: 'Others', // '其他',
  2: '光脚',
  3: '凉鞋',
  4: '皮鞋',
  5: '运动鞋',
  6: '靴子',
};

export const group = {
  0: 'Others', // '其他',
  1: '环卫工人(根据服装)',
  2: '快递员(根据服装)',
  3: '外卖人员(根据服装)',
  4: '孕妇',
  5: '保安',
};

//
export const overcoat = {
  type: [
    'overcoat',
    'practice',
    'mediumHeavyDuty',
    'safetyBeltStatus',
    'callPhone',
    'pendant',
    'tissueBox',
    'inspectVehicle',
    'yellowLabel',
  ],
  0: 'no',
  1: 'yes',
};

export const Colors = {
  type: [
    'lowerColor',
    'peopleColor',
    'jacketColor',
    'carColor',
    'umbrellaColor',
  ],
  peopleColor: {
    0: 'unidentified',
    1: 'Others', // '其他',
    2: 'White', // 白色,
    3: 'Blue', //  蓝色,
    4: 'Gray', //  灰色,
    5: 'Brown', //  棕色,
    6: 'Red', //  红色,
    7: 'Purple', //  紫色,
    8: 'Green', //  绿色
    9: 'Yellow', //  黄色
    10: 'Black', //  黑色,
    11: 'Orange', // 橙色
    12: 'Pink', // 粉色
  },

  umbrellaColor: {
    0: 'Others', // '其他',
    1: 'Black', //  黑色,
    2: 'White', // 白色,
    3: 'Gray', //  灰色
    4: 'Red', //  红色
    5: 'Blue', //  蓝色
    6: 'Yellow', //  黄色
    7: 'Orange', // 橙色
    8: 'Green', //  绿色
    9: 'Purple', //  紫色,
    10: 'Pink', // 粉色
    11: 'Transparent', // '透明',
  },
  carColor: {
    0: 'Others', // '其他',
    1: 'White', // 白色,
    2: 'Silver', // 粉色,
    3: 'Yellow', //  黄色
    4: 'Pink', // 粉色
    5: 'Purple', //  紫色,
    6: 'Green', //  绿色
    7: 'Blue', //  蓝色
    8: 'Red', //  红色
    9: 'Brown', //  棕色
    10: 'Black', //  黑色,
  },
};


/*
export const jacketColor = {
  0: 'unidentified'
  1: 'Others', //'其他',
  2: 'White', //白色'',
  3: 'Blue', //  蓝色
  4: 'Gray', //  灰色
  5: 'Brown', //  棕色
  6: 'Red', //  红色
  7: 'Purple', //  紫色,
  8: 'Green', //  绿色
  9: 'Yellow', //  黄色
  10: 'Black', //  黑色,
  11: 'Orange', // 橙色
  12: 'Pink', // 粉色
};
export const automobileColor = {
  1: 'White', //白色'',
  2: 'Silver', // 粉色,
  3: 'Yellow', //  黄色
  4: 'Pink', // 粉色
  5: 'Purple', //  紫色,
  6: 'Green', //  绿色
  7: 'Blue', //  蓝色
  8: 'Red', //  红色
  9: 'Brown', //  棕色
  10: 'Black', //  黑色,
};
 export const carColor = {
  0: 'Others', //'其他',
  1: 'White', //白色'',
  2: 'Silver', // 粉色,
  3: 'Yellow', //  黄色
  4: 'Pink', // 粉色
  5: 'Purple', //  紫色,
  6: 'Green', //  绿色
  7: 'Blue', //  蓝色
  8: 'Red', //  红色
  9: 'Brown', //  棕色
  10: 'Black', //  黑色,
};
*/
// 非机动车响应说明
export const category = {
  0: 'unidentified',
  1: '自行车',
  2: '摩托车',
  3: '三轮车-无封闭',
  4: '三轮车-半封闭',
  5: '三轮车-全封闭',
};
export const peopleNum = {
  0: 'unidentified',
  1: '单人',
  2: '多人',
};
// 8.4 机动车响应说明
// category
export const automobile = {
  0: 'Others', // '其他',
  1: '小轿车',
  2: 'suv',
  3: 'mpv',
  4: '面包车',
  5: '客车',
  6: '厢式货车',
  7: '罐式货车',
  8: '卡车',
  9: '校车',
  10: '消防车',
  11: '医疗车',
  12: '建筑工程车',
  13: '挂车',
  14: '小轿车-两厢',
};

export const sunshadeStatus = {
  0: '全部未打开',
  1: '主驾驶打开',
  2: '副驾驶打开',
  3: '主副驾均打开',
};
