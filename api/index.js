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
  brand: brand($axios)
})
