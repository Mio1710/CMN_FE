<template>
  <div class="d-flex flex-column flex-grow-1 pa-3">
    <v-container>
      <div class="d-flex align-center">
        <div>
          <breadcrumbs />
        </div>
        <v-spacer />
      </div>
      <v-card class="pa-0">
        <v-card-text>
          <v-row>
            <v-col cols="5">Sản phẩm</v-col>
            <v-col cols="2">Đơn giá</v-col>
            <v-col cols="1">Số lượng</v-col>
            <v-col cols="2">Số tiền</v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!--      list order -->
      <div v-if="products.length > 0">
        <v-card v-for="(item, index) in products" :key="index" class="mt-2">
          <v-card-text>
            <div class="d-flex items-center">
              <v-avatar class="mx-2" size="40">
                <v-img :src="item.supplier.avatar_url | userImageDefault" />
              </v-avatar>
              <span>{{ item.supplier.name }}</span>
            </div>
            <v-row v-for="(product, index) in item.cartItems" :key="index" class="items-center">
              <v-col cols="5">
                <div class="d-flex items-center">
                  <v-img contain max-height="60" max-width="100" :src="product.product.image_url" />
                  <div class="ml-2">
                    <div class="text--primary">{{ product.product.name }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="2">{{ product.product.price | currency }}</v-col>
              <v-col cols="2">
                {{ product.quantity }}
              </v-col>
              <v-col cols="2">{{ (parseInt(product.quantity) * parseInt(product.product.price)) | currency }}</v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mt-2" />
          <v-card-text class="bg-cyan-100">
            <v-row>
              <v-col cols="8">
                <div class="d-flex items-center">
                  <v-icon color="primary">mdi-truck-delivery</v-icon>
                  <div class="mx-1">Chọn đơn vị vận chuyển</div>
                  <delivery-autocomplete
                    v-model="item.delivery"
                    :cleable="false"
                    placeholder="Vận chuyển tiết kiệm"
                    return-object
                    @change="onChangeDelivery(item)"
                  />
                  <v-spacer />
                  <span>Giá vận chuyển: {{ item.shipping_fee | currency }}</span>
                </div>
              </v-col>
              <v-col cols="4">
                <div>Tổng tiền hàng: {{ subPrice(item) | currency }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-3">
          <v-card-text>
            <div class="text-error">
              <v-icon>mdi-map-marker</v-icon>
              <span>Địa chỉ nhận hàng</span>
            </div>
            <div class="d-flex">
              <div>
                <b>{{ address.name }} - {{ address.phone }}</b>
                <span class="ml-2 text-[16px]">{{ address.address }}</span>
              </div>
              <v-spacer />
              <v-btn color="primary" outlined small @click="onUpdateAddress">Cập nhật</v-btn>
            </div>
            <update-address-dialog ref="addressDialog" :address="address" @update="updateAddress" />
          </v-card-text>
        </v-card>
        <v-card class="mt-3">
          <v-card-text>
            <v-row>
              <v-col cols="7">
                <p>Phương thức thanh toán</p>
                <v-chip-group v-model="paymentMethod" active-class="primary--text">
                  <v-chip v-for="payment in paymentMethods" :key="payment.id" filter outlined :value="payment.id">
                    {{ payment.name }}
                  </v-chip>
                </v-chip-group>
              </v-col>
              <v-col cols="3">
                <div>Tổng tiền hàng: {{ total | currency }}</div>
              </v-col>
              <v-col cols="2">
                <v-btn color="primary" @click="onSubmit">Đặt hàng</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, useRouter, useStore, useContext } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import { useGetCarts } from '@/composables'
import DeliveryAutocomplete from '@/components/common/share/DeliveryAutocomplete'
import UpdateAddressDialog from '~/components/web/organisms/UpdateAddressDialog.vue'

export default defineComponent({
  components: { UpdateAddressDialog, DeliveryAutocomplete, Breadcrumbs },
  layout: 'web',
  auth: true,

  setup(_, { refs }) {
    const store = useStore()
    const productIds = ref(store.state.order.product_ids)
    const router = useRouter()
    const { $api, $dialog, $auth } = useContext()
    const paymentMethods = ref([])
    const address = ref({
      name: $auth.user.name,
      phone: $auth.user.phone,
      address: $auth.user.address
    })

    const query = ref({
      filters: {
        product_ids: productIds.value
      },
      sorts: '-created_at'
    })

    onMounted(() => {
      if (productIds.value.length === 0) {
        router.push('/cart')
      }
      getPaymentMethod()
      getDeliveryMethod()
    })

    const paymentMethod = ref(null)
    const getPaymentMethod = () => {
      $api.paymentMethod.getPaymentMethods().then((res) => {
        paymentMethods.value = res.data
        if (res.data.length > 0) {
          paymentMethod.value = res.data[0].id
        }
      })
    }

    const deleveryMethods = ref([])
    const getDeliveryMethod = () => {
      $api.deliveryMethod.getDeliveryMethods().then((res) => {
        deleveryMethods.value = res.data
      })
    }

    const { items } = useGetCarts(query, {
      enabled: !!productIds.value.length
    })

    const products = computed(() => items.value || [])

    const total = computed(() => {
      let sum = 0
      products.value.forEach((item) => {
        sum += subPrice(item)
      })
      return sum
    })

    const subPrice = (item) => {
      let subPrice = 0
      item.cartItems.forEach((product) => {
        subPrice += parseInt(product.quantity) * parseInt(product.product.price)
      })

      subPrice += parseInt(item.shipping_fee ?? 0)
      return subPrice
    }

    const checkAddress = () => {
      if (!address.value.name || !address.value.phone || !address.value.address) {
        $dialog.notify.error('Vui lòng nhập đầy đủ thông tin nhận hàng')
        return false
      }
      return true
    }

    const checkDelivery = () => {
      let check = true
      products.value.forEach((item) => {
        if (!item.delivery_id) {
          check = false
          $dialog.notify.error('Vui lòng chọn đủ phương thức vận chuyển')
          return false
        }
      })
      return check
    }

    const onSubmit = () => {
      if (!checkAddress() || !checkDelivery()) {
        return
      }
      const orders = products.value.map((item) => {
        return {
          supplier_id: item.supplier.id,
          cart_items: item.cartItems.map((product) => {
            return {
              cart_item_id: product.id,
              product_id: product.product.id,
              quantity: product.quantity,
              price: product.product.price
            }
          }),
          delivery_id: item.delivery_id,
          total_price: subPrice(item) - item.shipping_fee,
          payment_method_id: paymentMethod.value,
          shipping_fee: item.shipping_fee
        }
      })
      $api.order
        .createOrders({
          orders,
          address: address.value
        })
        .then(() => {
          $dialog.notify.success('Đặt hàng thành công')
          store.commit('order/SET_PRODUCT_IDS', [])
          router.push('/order/success')
          $auth.fetchUser()
        })
        .catch(() => {
          router.push('/cart')
        })
    }

    const onUpdateAddress = () => {
      refs.addressDialog.open()
    }

    const updateAddress = (data) => {
      address.value = data
      $api.user.updateUser($auth.user.id, data).then(() => {
        $dialog.notify.success('Cập nhật địa chỉ thành công')
      })
    }

    const onChangeDelivery = (item) => {
      item.delivery_id = item.delivery.id
      item.shipping_fee = item.delivery.price ?? 0
    }

    return {
      products,
      subPrice,
      total,
      onSubmit,
      paymentMethods,
      paymentMethod,
      address,
      onUpdateAddress,
      updateAddress,
      onChangeDelivery
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}
</style>
