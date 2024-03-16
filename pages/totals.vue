<template>
  <div class="w-full">
    <slide-bar />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <list-total-products :limit="24" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SlideBar from '~/components/web/molecules/SlideBar.vue'
import ListTotalProducts from '~/components/web/molecules/ListTotalProducts.vue'

export default {
  components: { ListTotalProducts, SlideBar },
  layout: 'web',
  auth: false
}
</script>
