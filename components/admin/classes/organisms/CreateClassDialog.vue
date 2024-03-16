<template>
  <form-dialog
    v-if="dialog"
    v-model="dialog"
    :loading="loading"
    submit-text="Lưu"
    title="Thêm thương hiệu"
    width="700px"
    @close="dialog = false"
    @submit="createBrand"
  >
    <class-form v-model="form" />
  </form-dialog>
</template>

<script>
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { serialize } from 'object-to-formdata'
import ClassForm from '@/components/admin/classes/molecules/ClassForm'
import FormDialog from '@/components/common/organisms/FormDialog'

export default defineComponent({
  name: 'CreateClassDialog',
  components: { FormDialog, ClassForm },

  setup() {
    const dialog = ref(false)
    const { $api } = useContext()
    const queryClient = useQueryClient()
    const loading = ref(false)

    const initialForm = () => ({
      name: null,
      code: null,
      image: null,
      image_url: null
    })
    const form = ref(initialForm())

    const open = () => {
      dialog.value = true
      form.value = initialForm()
    }

    const createBrand = () => {
      loading.value = true
      $api.brand
        .createBrand(serialize(form.value))
        .then(() => {
          dialog.value = false
          queryClient.invalidateQueries('brands')
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      dialog,
      form,
      createBrand,
      loading,
      open
    }
  }
})
</script>

<style scoped></style>
