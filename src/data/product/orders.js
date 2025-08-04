export const Orders = [
  {
    id: 'RE126049388383',
    orderDate: '2025-08-05',
    status: '處理中',
    customerName: 'Wen',
    total: 790,
    notes: '無特別備註',
    paymentMethod: '信用卡',
    paymentStatus: '已付款',
    customerPhone: '0912-345-678',
    customerEmail: 'wen@example.com',
    shippingAddress: '台北市中山區南京東路三段100號5樓',
    statusHistory: [
      { status: '訂單成立', timestamp: '2025-08-05 10:15' },
      { status: '付款成功 - 線上付款', timestamp: '2025-08-05 10:16' },
      { status: '處理中', timestamp: '2025-08-05 10:20' },
      { status: '包裝中', timestamp: '2025-08-06 09:00' },
    ],
  
    items: [
      {
        productId: 'P001',
        productName: 'G-Tech 機能防風外套',
        quantity: 1,
        price: 790,
        imageUrl: 'https://via.placeholder.com/150/4287f5/ffffff?text=P001'
      }
    ]
  },
  {
    id: 'DH48839300300',
    orderDate: '2025-08-05',
    status: '已出貨',
    customerName: 'Chen',
    total: 1790,
    notes: '延後出貨',
    paymentMethod: 'LINE Pay',
    paymentStatus: '已付款',
    customerPhone: '0922-123-456',
    customerEmail: 'chen@example.com',
    shippingAddress: '新北市板橋區文化路一段10號',
    statusHistory: [
      { status: '訂單成立', timestamp: '2025-08-05 14:30' },
      { status: '付款成功 - 線上付款', timestamp: '2025-08-05 14:31' },
      { status: '處理中', timestamp: '2025-08-05 15:00' },
      { status: '包裝中', timestamp: '2025-08-06 11:00' },
      { status: '已出貨 (物流單號: ABC123456)', timestamp: '2025-08-07 17:00' },
    ],
    items: [
      {
        productId: 'P002',
        productName: '多功能旅行後背包',
        quantity: 1,
        price: 1290,
        imageUrl: 'https://via.placeholder.com/150/f54242/ffffff?text=P002'
      },
      {
        productId: 'P003',
        productName: '戶外運動水壺',
        quantity: 2,
        price: 250,
        imageUrl: 'https://via.placeholder.com/150/f5a142/ffffff?text=P003'
      }
    ]
  },
  
]