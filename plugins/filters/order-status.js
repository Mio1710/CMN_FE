import Vue from 'vue'

export default function () {
  Vue.filter('orderStatus', (value) => {
    let valueStatus = ''

    switch (value) {
      case 1:
        valueStatus = 'Chờ duyệt'
        break
      case 2:
        valueStatus = 'Chờ lấy hàng'
        break
      case 3:
        valueStatus = 'Đang giao'
        break
      case 4:
        valueStatus = 'Đã hoàn thành'
        break
      case 5:
        valueStatus = 'Đã hủy'
        break
      case 6:
        valueStatus = 'Từ chối'
        break
      default:
        valueStatus = 'Đang chờ xử lý'
    }

    return valueStatus
  })
}
