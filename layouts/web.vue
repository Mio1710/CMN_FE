<template>
  <v-app class="d-flex flex-grow-1">
    <v-app-bar app class="toolbar-header" color="primary" dense flat>
      <div class="d-flex justify-between w-full items-center">
        <a class="d-block" href="/">
          <span class="text-white font-bold">ELE-Device</span>
        </a>
        <div class="align-center">
          <v-toolbar-items class="toolbar-menu">
            <v-tabs color="#fff" fixed-tabs height="48">
              <v-tab
                v-for="item in items"
                :key="item.key"
                class="capitalize whitespace-nowrap min-w-min md:min-w-[100px]"
                :to="item.link"
              >
                <span class="text-white">
                  {{ item.name }}
                </span>
              </v-tab>
            </v-tabs>
          </v-toolbar-items>
        </div>
        <div class="d-block">
          <toolbar-user v-if="$auth.user" />
          <div v-else class="d-flex">
            <v-btn class="mr-2" color="#ffffff20" dark small to="/login">Đăng nhập</v-btn>
            <v-btn color="#ffffff20" dark small to="register">Đăng ký</v-btn>
          </div>
        </div>
      </div>
    </v-app-bar>
    <v-main class="transition-all duration-500 md:bg-[#f5f5f7]">
      <v-layout class="h-full">
        <nuxt />
      </v-layout>
    </v-main>
    <div v-if="$auth.user" class="fixed bottom-10 right-10">
      <v-btn class="text-none" color="primary" height="50" rounded :to="{ name: 'cart' }">
        <v-badge color="error" :content="$auth.user.totalCart < 100 ? $auth.user.totalCart : '99+'">
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>
    </div>
    <footer class="bg-white">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <div class="md:text-left">
              <div class="text-xl font-bold">ELE-Device</div>
              <div class="text-base">Địa chỉ: 123 Nguyễn Trãi, Hà Nội</div>
              <div class="text-base">Số điện thoại: 0123456789</div>
              <div class="text-base">Email: ELE@gmail.com</div>
            </div>
            <div style="margin-top: 10px">
              <div class="text-xl font-bold">Tổng đài hỗ trợ miễn phí</div>
              <div class="text-sm">
                Gọi mua hàng
                <b>1800.1234</b>
                (7h30 - 22h00)
              </div>
              <div class="text-sm">
                Gọi khiếu nại
                <b>1800.5678</b>
                (8h00 - 21h30)
              </div>
              <div class="text-sm">
                Gọi bảo hành
                <b>1800.9876</b>
                (8h00 - 21h00)
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div>
              <div class="text-xl font-bold md:text-left">Thông tin và chính sách</div>
              <div class="text-base"><a href="#">Về chúng tôi</a></div>
              <div class="text-base"><a href="#">Chính sách bảo mật</a></div>
              <div class="text-base"><a href="#">Chính sách đổi trả</a></div>
              <div class="text-base"><a href="#">Chính sách bảo hành</a></div>
              <div class="text-base"><a href="#">Chính sách giao hàng</a></div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div>
              <div class="text-xl font-bold md:text-left">Hỗ trợ và dịch vụ</div>
              <div class="text-base"><a href="#">Hướng dẫn mua hàng</a></div>
              <div class="text-base"><a href="#">Hướng dẫn thanh toán</a></div>
              <div class="text-base"><a href="#">Hướng dẫn đổi trả</a></div>
              <div class="text-base"><a href="#">Hướng dẫn bảo hành</a></div>
              <div class="text-base"><a href="#">Dịch vụ bảo hành điện thoại</a></div>
              <div class="text-base"><a href="#">Dịch vụ bảo hành mở rộng</a></div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div>
              <div class="text-xl font-bold">Kết nối với ELE-Device</div>
              <div class="flex">
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/44x,webp/media/logo/social/cellphones-youtube.png" />
                </a>
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/44x,webp/media/logo/social/cellphones-facebook.png" />
                </a>
                <a class="p-1" href="#">
                  <img
                    alt=""
                    src="https://cdn2.cellphones.com.vn/44x,webp/media/logo/social/cellphones-instagram.png"
                  />
                </a>
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/44x,webp/media/logo/social/cellphones-zalo.png" />
                </a>
              </div>
            </div>
            <div style="margin-top: 10px">
              <div class="text-xl font-bold">Thành viên</div>
              <div class="text-base">Lê Trung Hân</div>
              <div class="text-base">Trần Hoài Duy</div>
              <div class="text-base">Nguyễn Thị Lê</div>
              <div class="text-base">Trần Quỳnh Nam</div>
              <div class="text-base">Nguyễn Minh Thiện</div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <div>
              <div class="text-xl font-bold">Phương thức thanh toán</div>
              <div class="flex">
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/x35,webp/media/wysiwyg/apple-pay-og.png" />
                </a>
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/x35,webp/media/logo/payment/vnpay-logo.png" />
                </a>
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/momo_1.png" />
                </a>
                <a class="p-1" href="#">
                  <img alt="" src="https://cdn2.cellphones.com.vn/x35,webp/media/logo/payment/zalopay-logo.png" />
                </a>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="3" />
          <v-col cols="12" md="3" />
          <v-col cols="12" md="3">
            <div class="md:text-left">
              <div class="text-xl font-bold">Giảng viên hướng dẫn</div>
              <div class="text-base">TS. Ngô Hữu Dũng</div>
              <div class="text-xl font-bold">Môn học</div>
              <div class="text-base">Phát triển ứng dụng</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </v-app>
</template>

<script>
import { defineComponent, onMounted, useContext, useRouter } from '@nuxtjs/composition-api'
import ToolbarUser from '@/components/common/share/ToolbarUser'

export default defineComponent({
  components: {
    ToolbarUser
  },

  setup() {
    const items = [
      {
        icon: 'mdi-switch',
        key: 1,
        name: 'Điện thoại',
        link: '/phones'
      },
      {
        icon: 'mdi-home-search',
        key: 2,
        name: 'Tablet',
        link: '/ipads'
      },
      {
        icon: 'mdi-store-alert',
        key: 3,
        name: 'Máy tính',
        link: '/laptops'
      },
      {
        icon: 'mdi-warehouse',
        key: 4,
        name: 'Watch',
        link: '/watches'
      },
      {
        icon: 'mdi mdi-file-arrow-left-right-outline',
        key: 5,
        name: 'Âm thanh',
        link: '/sounds'
      },
      {
        icon: 'mdi mdi-file-arrow-left-right-outline',
        key: 6,
        name: 'Phụ kiện',
        link: '/accessories'
      },
      {
        icon: 'mdi mdi-file-arrow-left-right-outline',
        key: 7,
        name: 'Tổng hợp',
        link: '/totals'
      },
      {
        icon: 'mdi mdi-file-arrow-left-right-outline',
        key: 8,
        name: 'Tin tức',
        link: '/news'
      },
      {
        icon: 'mdi mdi-file-arrow-left-right-outline',
        key: 9,
        name: 'My Store',
        link: '/sale/dashboard'
      }
    ]

    const { $auth } = useContext()
    const router = useRouter()

    onMounted(() => {
      if ($auth.user) {
        if ($auth.user.is_admin !== 0) {
          router.push('/admin/dashboard')
        }
      }
    })

    return {
      items
    }
  }
})
</script>

<style lang="scss">
.theme--light.v-tabs > .v-tabs-bar {
  background-color: transparent !important;

  .v-tab--active {
    color: #fff;
    background-color: #ffffff40;
  }
}
</style>
