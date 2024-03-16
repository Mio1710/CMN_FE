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
            <div class="text-h5">Bạn chưa có đơn hàng nào</div>
            <v-btn color="primary" large outlined :to="{ name: 'home' }">Mua hàng</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <div>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="5">Sản phẩm</v-col>
              <v-col cols="2">Đơn giá</v-col>
              <v-col cols="2">Số lượng</v-col>
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
              <v-spacer />
              <v-chip class="ma-2" color="primary" label>
                {{ item.order_status | orderStatus }}
              </v-chip>
              <v-btn v-if="item.order_status === 3" class="mr-2" color="success" small @click="onComplete(item)">
                Đã nhận được hàng
              </v-btn>
              <v-btn color="primary" outlined small :to="{ name: 'my-orders-detail', query: { id: item.id } }">
                Xem chi tiết
              </v-btn>
            </div>
            <v-row v-for="(product, index) in item.order_items" :key="index" class="items-center">
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
                <div>
                  {{ product.quantity }}
                </div>
              </v-col>
              <v-col cols="2">{{ (product.product.price * product.quantity) | currency }}</v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="bg-cyan-100">
            <div class="d-flex">
              <v-spacer />
              <div class="d-flex w-full max-w-[500px]">
                <div class="w-1/2 text-right">
                  <span class="text--primary">Tổng tiền hàng</span>
                </div>
                <div class="w-1/2 text-right">{{ (item.total_price + item.shipping_fee) | currency }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import { useGetOrders } from '@/composables'

export default defineComponent({
  components: { Breadcrumbs },
  layout: 'web',
  auth: true,

  setup() {
    const { $api, $auth } = useContext()
    const queryClient = useQueryClient()
    const query = ref({
      filters: {
        order_status: null,
        customer_id: $auth.user.id
      },
      sorts: '-created_at'
    })

    const { items } = useGetOrders(query)

    const onComplete = (item) => {
      $api.order.updateOrder(item.id, { order_status: 4 }).then(() => {
        queryClient.invalidateQueries('orders')
      })
    }

    return {
      items,
      onComplete
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}
</style>
