<template>
  <validation-provider v-slot="{ errors }" :name="name || $attrs.label" :rules="rules" :vid="vid">
    <v-textarea
      v-model="innerValue"
      v-bind="$attrs"
      :dense="dense"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :outlined="outlined"
      :rows="rows"
      v-on="$listeners"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-textarea>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppTextarea',
  mixins: [ControlMixin],
  props: {
    rows: {
      type: [String, Number],
      default: 2
    }
  }
}
</script>
