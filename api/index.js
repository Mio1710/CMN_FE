import user from '@/api/user'
import deliveryMethod from '@/api/delivery-method'
import order from '@/api/order'
import product from '@/api/product'
import common from '@/api/common'
import auth from '@/api/auth'
import cart from '@/api/cart'
import paymentMethod from '@/api/payment-method'
import category from '@/api/category'
import brand from '@/api/brand'
import classroom from '@/api/classroom'
import faculty from '@/api/faculty'

export default ($axios) => ({
  user: user($axios),
  deliveryMethod: deliveryMethod($axios),
  order: order($axios),
  product: product($axios),
  common: common($axios),
  auth: auth($axios),
  cart: cart($axios),
  paymentMethod: paymentMethod($axios),
  category: category($axios),
  brand: brand($axios),
  classroom: classroom($axios),
  faculty: faculty($axios)
})
