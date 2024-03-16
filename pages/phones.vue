<template>
  <div class="w-full">
    <slide-bar />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <total-products :limit="24" product-key="phones" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SlideBar from '~/components/web/molecules/SlideBar.vue'
import TotalProducts from '~/components/web/molecules/TotalProducts.vue'

export default {
  components: { TotalProducts, SlideBar },
  layout: 'web',
  auth: false
}
</script>
