<template>
  <div class="d-flex flex-column flex-grow-1 pa-3">
    <v-container>
      <div class="d-flex align-center">
        <div>
          <breadcrumbs />
        </div>
        <v-spacer />
      </div>
      <v-card v-if="order" class="mt-3">
        <v-card-text>
          <div class="d-flex items-center">
            <span class="mr-2">
              Mã đơn hàng:
              <span class="font-bold">{{ order.order_code }}</span>
            </span>
            <v-spacer />
            <v-chip class="ma-2" color="primary" label>
              {{ order.order_status | orderStatus }}
            </v-chip>
            <v-btn
              v-if="order.order_status === 0 || order.order_status === 1"
              color="error"
              outlined
              small
              @click="onCancelOrder"
            >
              Hủy đơn hàng
            </v-btn>
          </div>
          <div class="d-flex w-full mb-2">
            <div class="w-1/2">
              <v-icon>mdi-calendar</v-icon>
              <span>Ngày đặt hàng:</span>
              <span class="ml-2">{{ order.created_at | formatDate }}</span>
            </div>
            <div class="w-1/2">
              <v-icon>mdi-calendar</v-icon>
              <span>Ngày giao hàng:</span>
              <span class="ml-2">{{ order.delivery_date | formatDate }}</span>
            </div>
          </div>
          <div class="d-flex">
            <div class="text-error min-w-[150px]">
              <v-icon>mdi-map-marker</v-icon>
              <span>Địa chỉ nhận hàng:</span>
            </div>
            <div class="d-flex mb-2 w-full items-center">
              <div class="ml-2">
                <span>
                  <b>{{ address.name }} - {{ address.phone }}</b>
                  <span class="ml-2 text-[16px]">{{ address.address }}</span>
                </span>
              </div>
              <v-spacer />
              <v-btn v-if="order.order_status === 0" color="primary" outlined small @click="onUpdateAddress">
                Cập nhật
              </v-btn>
            </div>
          </div>
          <update-address-dialog ref="addressDialog" :address="address" @update="updateAddress" />
          <div>
            <v-icon>mdi-truck-delivery</v-icon>
            <span>Đơn vị vận chuyển:</span>
            <span class="ml-2">{{ order.deliveryMethod.name }}</span>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="mt-2">
        <v-card-text class="tw-py-0">
          <v-row>
            <v-col cols="5">Sản phẩm</v-col>
            <v-col cols="2">Đơn giá</v-col>
            <v-col cols="2">Số lượng</v-col>
            <v-col cols="2">Số tiền</v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!--      list cart -->
      <v-card v-if="order" class="mt-2">
        <v-card-text>
          <div class="d-flex items-center">
            <v-avatar class="mx-2" size="40">
              <v-img :src="order.supplier.avatar_url | userImageDefault" />
            </v-avatar>
            <span>{{ order.supplier.name }}</span>
            <v-spacer />
          </div>
          <v-row v-for="(product, index) in order.order_items" :key="index" class="items-center">
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
            <div class="max-w-[500px] w-full">
              <div class="d-flex w-full">
                <div class="w-1/2 text-right">
                  <span class="text--primary">Tổng tiền hàng</span>
                </div>
                <div class="w-1/2 text-right">{{ order.total_price | currency }}</div>
              </div>
              <v-divider class="w-full my-2" />
              <div class="d-flex w-full">
                <div class="w-1/2 text-right">
                  <span class="text--primary">Phí vận chuyển</span>
                </div>
                <div class="w-1/2 text-right">{{ order.shipping_fee | currency }}</div>
              </div>
              <v-divider class="w-full my-2" />
              <div class="d-flex w-full">
                <div class="w-1/2 text-right">
                  <span class="text--primary">Thành tiền</span>
                </div>
                <div class="w-1/2 text-right">{{ (order.total_price + order.shipping_fee) | currency }}</div>
              </div>
              <v-divider class="w-full my-2" />
              <div class="d-flex w-full">
                <div class="w-1/2 text-right">
                  <span class="text--primary">Phương thức thanh toán</span>
                </div>
                <div class="w-1/2 text-right">{{ order.paymentMethod.name }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import UpdateAddressDialog from '~/components/web/organisms/UpdateAddressDialog.vue'

export default defineComponent({
  components: { UpdateAddressDialog, Breadcrumbs },
  layout: 'web',
  auth: true,

  setup(_, { refs }) {
    const order = ref(null)
    const { $api, route, $dialog, $auth } = useContext()
    const id = route.value.query.id
    const loading = ref(false)
    const address = ref({
      name: $auth.user.name,
      phone: $auth.user.phone,
      address: $auth.user.address
    })

    onMounted(async () => {
      loading.value = true
      await $api.order
        .getOrder(id)
        .then((res) => {
          order.value = res.data
          address.value.address = res.data.address
        })
        .finally(() => {
          loading.value = false
        })
    })

    const onCancelOrder = async () => {
      loading.value = true
      await $api.order
        .updateOrder(id, {
          order_status: 5
        })
        .then((res) => {
          order.value = res.data
          $dialog.notify.success('Hủy đơn hàng thành công')
        })
        .finally(() => {
          window.location.reload(true)
          loading.value = false
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

    return {
      order,
      loading,
      onCancelOrder,
      onUpdateAddress,
      address,
      updateAddress
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}

.tw-py-0 {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
