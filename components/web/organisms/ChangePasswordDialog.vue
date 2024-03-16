<template>
  <form-dialog
    v-if="isOpen"
    v-model="isOpen"
    submit-text="Lưu"
    title="Đổi mật khẩu"
    width="700px"
    @close="onCancel"
    @submit="submit"
  >
    <v-row dense>
      <v-col cols="12">
        <app-password
          v-model="form.oldPassword"
          autocomplete="new-password"
          label="Mật khẩu cũ"
          rules="required"
          vid="oldPassword"
        />
      </v-col>
      <v-col cols="12">
        <app-password
          v-model="form.newPassword"
          autocomplete="new-password"
          label="Mật khẩu mới"
          rules="required|hardPassWord|min:8"
          vid="newPassword"
        />
      </v-col>
      <v-col cols="12">
        <app-password
          v-model="form.confirmPassword"
          autocomplete="new-password"
          label="Xác nhận mật khẩu"
          rules="required|confirmed:newPassword"
          vid="confirmPassword"
        />
      </v-col>
    </v-row>
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, useContext, toRef, useRouter } from '@nuxtjs/composition-api'
import FormDialog from '@/components/common/organisms/FormDialog'
import AppPassword from '~/components/common/atoms/AppPassword.vue'

export default defineComponent({
  name: 'ChangePasswordDialog',
  components: { AppPassword, FormDialog },

  setup() {
    const initialState = () => ({
      form: {}
    })
    const { $api, $auth } = useContext()
    const router = useRouter()
    const state = reactive(initialState())
    const loading = ref(false)
    const isOpen = ref(true)

    const open = () => {
      isOpen.value = true
      state.form = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }

    const onCancel = () => {
      isOpen.value = false
      router.go(-1)
    }

    const submit = () => {
      loading.value = true
      $api.user
        .changePassword(state.form)
        .then(() => {
          isOpen.value = false
          $auth.logout()
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      form: toRef(state, 'form'),
      loading,
      isOpen,
      open,
      submit,
      onCancel
    }
  }
})
</script>

<style scoped></style>
