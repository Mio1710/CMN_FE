<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <h1 class="mb-6">Đơn Hàng</h1>
      <v-spacer />
    </div>
    <div class="px-3 d-flex">
      <div class="app-filter d-flex gap-3">
        <v-text-field v-model="query.filters.q" class="filter-component" dense hide-details label="Tìm kiếm" outlined />
        <v-select
          v-model="query.filters.order_status"
          class="filter-component"
          dense
          hide-details
          :items="types"
          label="Trạng thái đơn hàng"
          outlined
        />
      </div>
      <v-spacer />
      <v-btn color="success" small @click="dialog = !dialog">Duyệt Đơn Hàng</v-btn>
    </div>
    <div class="pa-2">
      <app-data-table v-model="selectedItems" class="elevation-1" :headers="headers" :items="items" :items-per-page="5">
        <template #item.index="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.order_status="{ item }">
          <span>{{ item.order_status | saleOrderStatus }}</span>
        </template>
        <template #item.order_status_action="{ item }">
          <v-chip
            v-if="item.order_status === 2"
            class="hover:cursor-pointer"
            color="primary"
            outlined
            pill
            @click="onDelivery(item)"
          >
            Giao hàng
          </v-chip>
          <div v-else-if="item.order_status === 3 || item.order_status === 4">
            {{ item.order_status | saleOrderStatus }}
          </div>
          <div v-else>---------------</div>
        </template>
        <template #item.created_at="{ item }">
          <span>{{ item.created_at | formatDate }}</span>
        </template>
        <template #item.action="{ item }">
          <v-list-item class="info--text" dense @click="detailOrder(item)">
            <v-list-item-title>
              <v-icon color="info" left small>mdi-eye-outline</v-icon>
              <span>Xem chi tiết</span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </app-data-table>
      <approve-orders v-model="dialog" />
      <detail-order-dialog ref="detailOrderDialog" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import AppDataTable from '@/components/common/molecules/AppDataTable'
import ApproveOrders from '@/components/sale/organisms/ApproveOrders'
import { useGetOrders } from '@/composables'
import DetailOrderDialog from '@/components/sale/organisms/DetailOrderDialog'

export default defineComponent({
  components: {
    ApproveOrders,
    AppDataTable,
    DetailOrderDialog
  },
  layout: 'sale',

  setup(_, { refs }) {
    const { $api, $auth } = useContext()
    const queryClient = useQueryClient()
    const query = ref({
      filters: {
        q: '',
        order_status: null,
        supplier_id: $auth.user.id
      },
      sorts: '-created_at',
      page: 1,
      limit: 100
    })

    const { items, refetch, totalItems } = useGetOrders(query)

    const state = reactive({
      headers: [
        { text: 'STT', value: 'index', align: 'left', sortable: false },
        { text: 'Mã đơn hàng', value: 'order_code' },
        { text: 'Customer', value: 'customer.name' },
        { text: 'OrderDate', value: 'created_at' },
        { text: 'Status', value: 'order_status' },
        { text: 'Giao hàng', value: 'order_status_action' },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      selectedItems: []
    })
    const dialog = ref(false)

    const types = ref([
      { text: 'Tất cả', value: null },
      { text: 'Chưa duyệt', value: 1 },
      { text: 'Đã duyệt', value: 2 },
      { text: 'Đang giao', value: 3 },
      { text: 'Đã giao', value: 4 },
      { text: 'Đã hủy', value: 5 },
      { text: 'Từ chối', value: 6 },
      { text: 'Đang chờ xử lý', value: 0 }
    ])

    const detailOrder = (item) => {
      refs.detailOrderDialog.open(item, true)
    }

    const onDelivery = (item) => {
      $api.order.updateOrder(item.id, { order_status: 3 }).then(() => {
        queryClient.invalidateQueries('orders')
      })
    }

    return {
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items,
      types,
      dialog,
      refetch,
      totalItems,
      detailOrder,
      query,
      onDelivery
    }
  }
})
</script>
<style lang="scss">
.app-filter {
  .filter-component,
  span {
    flex: 0 1 200px;

    .v-autocomplete .v-select__selections {
      flex-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .v-chip__content {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
    }
  }
}
</style>
