<template>
  <v-list dense nav>
    <nav-menu-item v-for="(item, index) in menu" :key="index" :menu-item="item" small />
  </v-list>
</template>

<script>
import NavMenuItem from '@/components/layout/atoms/NavMenuItem.vue'

export default {
  components: {
    NavMenuItem
  },
  data() {
    const menu = [
      {
        name: 'Lớp học phần',
        link: '/admin/classes',
        key: 1,
        icon: 'mdi-home'
      },
      {
        name: 'Giảng viên',
        key: 2,
        link: '/admin/teachers',
        icon: 'mdi-package-variant-closed'
      },
      {
        name: 'Sinh viên',
        key: 8,
        link: '/admin/students',
        icon: 'mdi-shape'
      },
      {
        name: 'Hat',
        key: 9,
        link: '/admin/hats',
        icon: 'mdi-shape'
      },
      {
        name: 'Quản lý người dùng',
        key: 3,
        link: '/admin/users',
        icon: 'mdi-account-group'
      },
      {
        name: 'Phương thức vận chuyển',
        key: 4,
        link: '/admin/shipping-methods',
        icon: 'mdi-truck-delivery'
      },
      {
        name: 'Phương thức thanh toán',
        key: 5,
        link: '/admin/payment-methods',
        icon: 'mdi-cash'
      },
      {
        name: 'Thương hiệu',
        key: 6,
        link: '/admin/brands',
        icon: 'mdi-tag-heart'
      },
      {
        name: 'Quản lý khoa',
        key: 7,
        link: '/admin/faculties',
        icon: 'mdi-account'
      }
    ]

    return {
      menu
    }
  }
}
</script>
