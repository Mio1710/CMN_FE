<template>
  <div>
    <slide-bar />
    <v-container fluid>
      <v-row justify="center">
        <v-col v-for="(item, index) in listProductCategories" :key="index" cols="12" lg="10">
          <list-product-category :item="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import SlideBar from '@/components/web/molecules/SlideBar.vue'
import ListProductCategory from '~/components/web/molecules/ListProductCategory.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { ListProductCategory, SlideBar },
  layout: 'web',
  auth: false,

  setup() {
    const listProductCategories = ref([
      {
        key: 'phones',
        title: 'Điện thoại',
        link: '/phones'
      },
      {
        key: 'ipads',
        title: 'iPad',
        link: '/ipads'
      },
      {
        key: 'laptops',
        title: 'Laptop',
        link: '/laptops'
      },
      {
        key: 'watches',
        title: 'Đồng hồ',
        link: '/watches'
      },
      {
        key: 'accessories',
        title: 'Phụ kiện',
        link: '/accessories'
      }
    ])
    return {
      listProductCategories
    }
  }
})
</script>
