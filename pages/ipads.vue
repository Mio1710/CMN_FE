<template>
  <div class="w-full">
    <slide-bar />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <total-products :limit="24" product-key="ipads" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TotalProducts from '~/components/web/molecules/TotalProducts.vue'
import SlideBar from '~/components/web/molecules/SlideBar.vue'

export default {
  components: { SlideBar, TotalProducts },
  layout: 'web',
  auth: false
}
</script>
