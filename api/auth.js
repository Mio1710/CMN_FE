export default ($axios) => ({
  async createUser(data) {
    return await $axios.$post('/auth/register', data)
  }
})
