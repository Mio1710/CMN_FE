<template>
  <v-card flat rounded="0" theme="dark">
    <v-window v-model="onboarding" dark show-arrows>
      <v-window-item v-for="(n, index) in length" :key="index" :value="n">
        <v-card class="d-flex justify-center align-center" height="300">
          <v-img
            src="https://shopdunk.com/images/uploaded/banner/banner%20thang%2011/banner%20iphone%2015%20pro%20max%20T11_PC.jpg"
            width="100vh"
          />
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
export default {
  name: 'SlideBar',
  data() {
    const length = [1, 2, 3, 4]
    const onboarding = 1

    return {
      onboarding,
      length
    }
  },

  methods: {
    next(item) {
      this.onboarding = this.onboarding + 1 > this.length.indexOf(item) ? 1 : this.onboarding + 1
    },
    prev(item) {
      this.onboarding = this.onboarding - 1 <= 0 ? this.length.indexOf(item) : this.onboarding - 1
    }
  }
}
</script>

<style scoped></style>
