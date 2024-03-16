<template>
  <form-dialog
    v-if="dialog"
    v-model="dialog"
    :loading="loading"
    submit-text="Lưu"
    title="Chi tiết thương hiệu"
    width="700px"
    @close="dialog = false"
    @submit="submit"
  >
    <class-form v-model="form" is-update />
  </form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, useContext, toRef } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { serialize } from 'object-to-formdata'
import ClassForm from '@/components/admin/classes/molecules/ClassForm'
import FormDialog from '@/components/common/organisms/FormDialog'

export default defineComponent({
  name: 'EditBrandDialog',
  components: { FormDialog, ClassForm },

  setup() {
    const initialState = () => ({
      form: {}
    })
    const { $api } = useContext()
    const state = reactive(initialState())
    const loading = ref(false)
    const dialog = ref(false)
    const queryClient = useQueryClient()

    const open = (item) => {
      dialog.value = true
      state.form = Object.assign({}, item)
    }

    const submit = () => {
      loading.value = true
      const form = {
        id: state.form.id,
        name: state.form.name,
        code: state.form.code,
        image: state.form.image,
        image_url: state.form.image_url
      }
      $api.brand
        .updateBrand(state.form.id, serialize(form))
        .then(() => {
          dialog.value = false
          queryClient.invalidateQueries('brands')
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      form: toRef(state, 'form'),
      loading,
      dialog,
      open,
      submit
    }
  }
})
</script>

<style scoped></style>
