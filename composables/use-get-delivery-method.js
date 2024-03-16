import { computed, useContext } from '@nuxtjs/composition-api'
import { useQuery } from 'vue-query'
import Parser from '@/utils/parser'

export default function useGetDeliveryMethods(params = {}, options = {}) {
  const { $api } = useContext()

  const query = useQuery(
    ['shipping-methods', params],
    () => {
      const query = new Parser({
        includes: [],
        appends: [],
        fields: {},
        filters: {},
        sorts: [],
        page: 1,
        limit: 10,
        payload: null,
        ...params.value
      }).query()

      return $api.deliveryMethod.getDeliveryMethods(query)
    },
    options
  )

  const items = computed(() => query.data.value?.data || [])
  const totalItems = computed(() => query.data.value?.pagination?.total || 0)

  return {
    ...query,
    items,
    totalItems
  }
}
