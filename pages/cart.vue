<template>
  <div class="d-flex flex-column flex-grow-1 pa-3">
    <v-container>
      <div class="d-flex align-center">
        <div>
          <breadcrumbs />
        </div>
        <v-spacer />
      </div>
      <v-card v-if="items.length == 0">
        <v-card-text>
          <div class="text-center">
            <v-icon size="100">mdi-cart-off</v-icon>
            <div class="text-h5">Bạn chưa có sản phẩm nào trong giỏ hàng</div>
            <v-btn color="primary" large outlined to="/">Mua hàng</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <template v-else>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="1">
                <v-checkbox class="mt-0" hide-details />
              </v-col>
              <v-col cols="5">Sản phẩm</v-col>
              <v-col cols="2">Đơn giá</v-col>
              <v-col cols="1">Số lượng</v-col>
              <v-col cols="2">Số tiền</v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!--      list cart -->
        <v-card v-for="(item, index) in items" :key="index" class="mt-2">
          <v-card-text>
            <div class="d-flex items-center">
              <v-avatar class="mx-2" size="40">
                <v-img :src="item.supplier.avatar_url | userImageDefault" />
              </v-avatar>
              <span>{{ item.supplier.name }}</span>
            </div>
            <v-row v-for="(product, index) in item.cartItems" :key="index" class="items-center">
              <v-checkbox
                v-model="cartItems"
                class="mt-0"
                :disabled="product.product.quantity < product.quantity"
                hide-details
                :value="product"
              />
              <v-col cols="5">
                <p v-if="product.product.quantity < product.quantity" class="text-red-500 text-sm">
                  *Số lượng sản phẩm quá giới hạn
                </p>
                <div class="d-flex items-center">
                  <v-img contain max-height="60" max-width="100" :src="product.product.image_url" />
                  <div class="ml-2">
                    <div class="text--primary">{{ product.product.name }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="2">{{ product.product.price | currency }}</v-col>
              <v-col cols="2">
                <div class="w-[100px]">
                  <app-text-field
                    v-model="product.quantity"
                    append-icon="mdi-plus"
                    class="text-center input-count"
                    hide-spin-buttons
                    outlined
                    prepend-inner-icon="mdi-minus"
                    readonly
                    rules="min:1"
                    type="number"
                    @click:append="add(product)"
                    @click:prepend-inner="sub(product)"
                  />
                </div>
              </v-col>
              <v-col cols="2">{{ (parseInt(product.quantity) * parseInt(product.product.price)) | currency }}</v-col>
              <v-btn color="error" icon @click="deleteCartItem(product)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>

        <div class="fixed bottom-0 right-0 left-0">
          <v-card class="mt-4">
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-btn color="primary" outlined>Chọn tất cả</v-btn>
                </v-col>
                <v-col cols="6">
                  <span>Tổng tiền</span>
                  <span>{{ total | currency }}</span>
                </v-col>
                <v-col cols="3">
                  <v-btn color="primary" :disabled="cartItems.length == 0" @click="onOrder">Mua hàng</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-container>
  </div>
</template>

<script>
import { computed, defineComponent, ref, useContext, useRouter, useStore } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import { useGetCarts } from '@/composables'
import AppTextField from '~/components/common/atoms/AppTextField.vue'

export default defineComponent({
  components: { AppTextField, Breadcrumbs },
  layout: 'web',

  setup() {
    const count = ref(1)
    const cartItems = ref([])
    const store = useStore()
    const router = useRouter()
    const { $api, $dialog, $auth } = useContext()
    const queryClient = useQueryClient()

    const { items } = useGetCarts()
    const sub = (item) => {
      if (item.quantity > 1) {
        item.quantity--
        $api.cart.add({
          quantity: -1,
          product_id: item.product_id
        })
        $auth.fetchUser()
      } else {
        $dialog
          .confirm({
            title: 'Bạn muốn xóa sản phẩm khỏi giỏ hàng?',
            text: 'Hành động này không thể hoàn tác!'
          })
          .then((confirm) => {
            if (confirm) {
              deleteCartItem(item)
            }
          })
      }
    }
    const add = (item) => {
      if (item.product.quantity > item.quantity) {
        item.quantity++
        $api.cart.add({
          quantity: 1,
          product_id: item.product_id
        })
        $auth.fetchUser()
      } else {
        $dialog.notify.error('Số lượng sản phẩm quá giới hạn')
      }
    }

    const total = computed(() => {
      return cartItems.value.reduce((acc, item) => {
        return acc + item.quantity * item.product.price
      }, 0)
    })

    const onOrder = () => {
      const productIds = cartItems.value.map((item) => item.product.id)
      store.commit('order/SET_PRODUCT_IDS', productIds)
      cartItems.value = []
      router.push('/order')
    }

    const deleteCartItem = (item) => {
      $api.cart.deleteItem(item.id)
      $dialog.notify.success('Xóa sản phẩm khỏi giỏ hàng thành công')
      queryClient.invalidateQueries('carts')
      $auth.fetchUser()
    }

    return {
      count,
      sub,
      add,
      items,
      cartItems,
      total,
      onOrder,
      deleteCartItem
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}
</style>
