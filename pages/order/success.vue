<template>
  <v-row align="center" class="h-full" justify="center">
    <v-col cols="12" md="6" sm="8">
      <v-card>
        <v-card-title>
          <div class="text-center w-full">
            <v-icon color="primary" large>mdi-check-circle</v-icon>
            <h1>Đặt hàng thành công</h1>
          </div>
        </v-card-title>
        <v-card-text>
          <p class="text-center">
            Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" outlined to="/">Trang chủ</v-btn>
          <v-spacer />
          <v-btn color="primary" to="/my-orders">Đơn hàng của bạn</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Success',
  layout: 'web',
  auth: true
}
</script>
