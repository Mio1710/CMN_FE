<template>
  <v-row dense>
    <v-col cols="12">
      <v-card class="pa-2">
        <v-img contain height="200" :src="form.image_url || '/images/brand/default.png'" />
        <v-card-text class="px-0 pb-0">
          <app-file-input
            v-model="form.image"
            accept="image/jpg, image/jpeg, image/png"
            label="Image"
            :rules="form.image_url ? '' : 'required'"
            @change="onFileChange"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.name" label="Tên thương hiệu" rules="required|max:100" vid="name" />
    </v-col>
    <v-col cols="12">
      <app-text-field v-model="form.code" label="Mã thương hiệu" rules="required|max:100" vid="code" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField.vue'
import AppFileInput from '@/components/common/atoms/AppFileInput'

export default defineComponent({
  name: 'ClassForm',
  components: { AppTextField, AppFileInput },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const onFileChange = (file) => {
      if (file) {
        form.value.image_url = URL.createObjectURL(form.value.image)
        URL.revokeObjectURL(file)
      } else {
        form.value.image_url = null
      }
    }

    return {
      form,
      onFileChange
    }
  }
})
</script>
