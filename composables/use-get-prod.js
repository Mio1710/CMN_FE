import { computed, useContext } from '@nuxtjs/composition-api'
import { useQuery } from 'vue-query'
import Parser from '@/utils/parser'

export default function useGetProds(params = {}, options = {}) {
  const { $api } = useContext()

  const query = useQuery(
    ['products', params],
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
      return $api.product.getProds(query)
    },
    options
  )

  const items = computed(() => query.data.value?.data || [])
  const totalItems = computed(() => query.data.value?.pagination?.total || 0)
  const totalPages = computed(() => query.data.value?.pagination?.totalPages || 0)

  return {
    ...query,
    items,
    totalItems,
    totalPages
  }
}
