<template>
  <div class="d-flex flex-column flex-grow-1 pa-3">
    <v-container>
      <div class="d-flex align-center">
        <div>
          <breadcrumbs />
        </div>
        <v-spacer />
      </div>
      <v-card>
        <v-card-text>
          <v-skeleton-loader v-if="loading" type="article, actions" />
          <v-row v-else>
            <v-col class="d-flex justify-center" cols="12" sm="6">
              <v-img contain max-height="250" max-width="400" :src="currentProduct.image_url" />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="title font-weight-bold">{{ currentProduct.name }}</div>
              <div class="d-flex items-center">
                <div class="d-flex">
                  <div class="d-flex text-amber">
                    <span>4.8</span>
                    <v-rating
                      background-color="grey lighten-2"
                      class="ml-2"
                      color="amber darken-2"
                      dense
                      half-increments
                      hover
                      readonly
                      size="18"
                      :value="4.5"
                    />
                  </div>
                  <v-divider class="mx-2" vertical />
                  <div class="d-flex text-amber">
                    <span class="text-decoration-underline mr-2">1</span>
                    <span>Đánh giá</span>
                  </div>
                  <v-divider class="mx-2" vertical />
                  <div class="d-flex text-amber">
                    <span class="text-decoration-underline mr-2">1</span>
                    <span>Đã bán</span>
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  v-if="!$auth.user || $auth.user.id !== currentProduct.supplier_id"
                  color="error"
                  @click="reportProduct"
                >
                  Tố cáo
                </v-btn>
              </div>
              <div class="mt-2">
                <div class="font-weight-bold d-inline-block text-xl">
                  <span>Giá:</span>
                  <span class="text-[#6A76AB]">{{ currentProduct.price | currency }}</span>
                </div>
                <span class="text-decoration-line-through ml-2">{{ currentProduct.price | currency }}</span>
              </div>
              <div class="d-flex my-2 items-center">
                <div class="w-[100px]">
                  <app-text-field
                    v-model="count"
                    append-icon="mdi-plus"
                    class="text-center input-count"
                    hide-spin-buttons
                    outlined
                    prepend-inner-icon="mdi-minus"
                    readonly
                    rules="min:1"
                    type="number"
                    @click:append="add"
                    @click:prepend-inner="sub"
                  />
                </div>
                <div class="ml-2">
                  <span>Số lượng còn lại:</span>
                  <span>{{ currentProduct.quantity }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div v-if="!$auth.user">
                  <v-btn class="mr-2" color="primary" outlined @click="addCart">
                    <v-icon size="16">mdi-cart-plus</v-icon>
                    <span>Thêm vào giỏ hàng</span>
                  </v-btn>
                  <v-btn color="primary" @click="addCart">Mua ngay</v-btn>
                </div>
                <div v-else>
                  <v-btn
                    class="mr-2"
                    color="primary"
                    :disabled="$auth.user.id === currentProduct.supplier_id"
                    outlined
                    @click="addCart"
                  >
                    <v-icon size="16">mdi-cart-plus</v-icon>
                    <span>Thêm vào giỏ hàng</span>
                  </v-btn>
                  <v-btn color="primary" :disabled="$auth.user.id === currentProduct.supplier_id" @click="onPurchase">
                    Mua ngay
                  </v-btn>
                  <p v-if="$auth.user.id === currentProduct.supplier_id" class="text-red-500 text-sm">
                    * Đây là sản phẩm của bạn
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-4">
        <v-card-text>
          <v-skeleton-loader v-if="loading || !currentProduct.supplier" type="list-item-avatar-three-line" />
          <v-row v-else dense>
            <v-col class="d-flex" cols="12" md="4">
              <v-avatar size="60">
                <v-img :src="currentProduct.supplier.avatar_url | userImageDefault" />
              </v-avatar>
              <div class="ml-2">
                <div class="font-weight-bold">{{ currentProduct.supplier.name }}</div>
                <div class="caption">1 ngày trước</div>
                <div class="mt-1 d-flex">
                  <v-btn class="mr-2" color="primary" dark outlined small>
                    <v-icon>mdi-forum</v-icon>
                    <span class="ml-1 text-primary">Chat ngay</span>
                  </v-btn>
                  <v-btn
                    color="secondary"
                    dark
                    outlined
                    small
                    :to="{ name: 'shop', query: { supplier_id: currentProduct.supplier_id } }"
                  >
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
                  <span>{{ currentProduct.supplier.totalProducts }}</span>
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
                  <span>{{ currentProduct.sold }}</span>
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
      <v-card class="mt-4">
        <v-card-title>Chi tiết sản phẩm</v-card-title>
        <v-card-text>
          <div class="w-1/2 lg:w-[200px] d-inline-block">Danh mục sản phẩm:</div>
          <span v-if="currentProduct.category">{{ currentProduct.category.name }}</span>
          <br />
          <div class="w-1/2 lg:w-[200px] d-inline-block">Thương hiệu:</div>
          <span v-if="currentProduct.brand">{{ currentProduct.brand.name }}</span>
          <br />
          <div class="w-1/2 lg:w-[200px] d-inline-block">Số lượng tồn kho:</div>
          <span>{{ currentProduct.quantity }}</span>
        </v-card-text>
        <v-card-title>Mô tả sản phẩm</v-card-title>
        <v-card-text class="max-h-[500px] overflow-y-scroll">
          <div>{{ currentProduct.description }}</div>
        </v-card-text>
      </v-card>
      <v-card-title class="mt-4">CÁC SẢN PHẨM KHÁC CỦA SHOP</v-card-title>
      <list-products v-if="!loading" link="/shop" slug="shop-product" :supplier-id="currentProduct.supplier_id" />
      <v-card-title class="mt-4">CÁC SẢN PHẨM TƯƠNG TỰ</v-card-title>
      <list-products
        v-if="!loading && currentProduct.category"
        :category-id="currentProduct.category_id"
        :link="currentProduct.category.code"
        slug="same-product"
      />
    </v-container>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext, watch, useRouter } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import AppTextField from '@/components/common/atoms/AppTextField'
import ListProducts from '@/components/web/molecules/ListProducts'

export default defineComponent({
  components: { ListProducts, AppTextField, Breadcrumbs },
  layout: 'web',
  auth: false,

  setup() {
    const count = ref(1)
    const loading = ref(false)
    const router = useRouter()

    const sub = () => {
      if (count.value > 1) {
        count.value--
      }
    }

    const { $api, query, $auth, $dialog } = useContext()

    const currentProduct = ref({})

    onMounted(() => {
      loading.value = true
      $api.product.getProd(query.value.id).then((res) => {
        currentProduct.value = res.data
        loading.value = false
      })
    })

    watch(query, () => {
      loading.value = true
      $api.product.getProd(query.value.id).then((res) => {
        currentProduct.value = res.data
        window.scrollTo(0, 0)
        loading.value = false
      })
    })

    const add = () => {
      if (currentProduct.value.quantity > count.value) {
        count.value++
      } else {
        $dialog.notify.error('Số lượng sản phẩm đạt tối đa')
      }
    }

    const addCart = () => {
      // check nếu chưa login thì chuyển sang trang login
      console.log('add Cart')
      if (!$auth.loggedIn) {
        router.push('/login')
      } else {
        $api.cart
          .addCart({
            product_id: currentProduct.value.id,
            quantity: count.value
          })
          .then(() => {
            $dialog.notify.success('Thêm vào giỏ hàng thành công')
            $auth.fetchUser()
          })
      }
    }

    const reportProduct = () => {
      if (!$auth.loggedIn) {
        router.push('/login')
      } else {
        $api.product
          .updateProd(currentProduct.value.id, {
            report: 1
          })
          .then(() => {
            $dialog.notify.success('Báo cáo sản phẩm thành công')
          })
      }
    }

    const onPurchase = () => {
      console.log('onPurchase')
      if (!$auth.loggedIn) {
        router.push('/login')
      } else {
        addCart()
        router.push('/cart')
      }
    }

    return {
      count,
      sub,
      add,
      currentProduct,
      query,
      loading,
      addCart,
      reportProduct,
      onPurchase
    }
  }
})
</script>

<style>
.input-count input {
  text-align: center;
}
</style>
