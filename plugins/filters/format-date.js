import Vue from 'vue'
import configs from '@/configs'

export default function ({ $moment }) {
  Vue.filter('formatDate', (value, filterFormat) => {
    console.log('value', value, filterFormat, $moment)
    if (!value) return ''
    return $moment(value).format(filterFormat || configs.momentFormat.date)
  })
}
