<template>
  <div class="w-full">
    <v-card class="mt-4">
      <v-card-text>
        <v-skeleton-loader v-if="loading" type="list-item-avatar-three-line" />
        <v-row v-else dense>
          <v-col class="d-flex" cols="12" md="4">
            <v-avatar size="60">
              <v-img :src="supplier.avatar_url | userImageDefault" />
            </v-avatar>
            <div class="ml-2">
              <div class="font-weight-bold">{{ supplier.name }}</div>
              <div class="caption">1 ngày trước</div>
              <div class="mt-1 d-flex">
                <v-btn class="mr-2" color="primary" dark outlined small>
                  <v-icon>mdi-forum</v-icon>
                  <span class="ml-1 text-primary">Chat ngay</span>
                </v-btn>
                <v-btn color="secondary" dark outlined small>
                  <v-icon>mdi-store</v-icon>
                  <span class="ml-1 text-primary">Xem shop</span>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-divider vertical />
          <v-col class="pl-4" cols="12" md="4">
            <v-row>
              <v-col cols="6">
                <span>Đánh giá</span>
              </v-col>
              <v-col cols="6">
                <span>6</span>
              </v-col>
              <v-col cols="6">
                <span>Số lượng sản phẩm</span>
              </v-col>
              <v-col cols="6">
                <span>5</span>
              </v-col>
            </v-row>
          </v-col>
          <v-divider vertical />
          <v-col class="pl-4" cols="12" md="4">
            <v-row>
              <v-col cols="6">
                <span>Số sản phẩm đã bán</span>
              </v-col>
              <v-col cols="6">
                <span>{{ supplier.sold }}</span>
              </v-col>
              <v-col cols="6">
                <span>Địa chỉ</span>
              </v-col>
              <v-col cols="6">
                <span>TP HCM</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-container v-if="supplierId" fluid>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <total-products :limit="24" :supplier-id="supplierId" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, useContext } from '@nuxtjs/composition-api'
import TotalProducts from '~/components/web/molecules/TotalProducts.vue'

export default defineComponent({
  components: { TotalProducts },
  layout: 'web',
  auth: false,

  setup() {
    const supplier = ref({})
    const { $api, route } = useContext()
    const supplierId = ref(route.value.query.supplier_id ?? null)
    const loading = ref(false)

    onMounted(() => {
      loading.value = true
      $api.user.getUser(supplierId.value).then((res) => {
        supplier.value = res.data
        loading.value = false
      })
    })

    return {
      loading,
      supplier,
      supplierId
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}
</style>
