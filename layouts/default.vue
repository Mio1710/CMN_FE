<template>
  <v-app class="d-flex flex-grow-1">
    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" app class="elevation-1" color="#6a76ab" dark floating>
      <!-- Navigation menu info -->
      <template #prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase white--text">ELE - DEVICE Admin</div>
        </div>
      </template>
      <main-menu />
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar app dense light>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-spacer />
      <div class="d-block">
        <toolbar-user v-if="$auth.user" />
        <div v-else class="d-flex">
          <v-btn class="mr-2" color="#ffffff20" dark small to="/login">Đăng nhập</v-btn>
          <v-btn color="#ffffff20" dark small to="register">Đăng ký</v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" :fluid="$vuetify.breakpoint.lgOnly">
        <v-layout>
          <nuxt />
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import MainMenu from '@/components/layout/organisms/MainMenu.vue'
import ToolbarUser from '@/components/common/share/ToolbarUser'

export default defineComponent({
  components: {
    MainMenu,
    ToolbarUser
  },
  auth: false,
  setup() {
    const drawer = ref(true)

    return {
      drawer
    }
  }
})
</script>
