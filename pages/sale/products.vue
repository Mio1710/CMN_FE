<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <h1 class="mb-6">Quản Lí Sản Phẩm</h1>
      <v-spacer />
    </div>
    <div class="px-3 d-flex">
      <div class="app-filter d-flex gap-3">
        <v-text-field v-model="query.filters.q" class="filter-component" dense hide-details label="Tìm kiếm" outlined />
        <brand-autocomplete
          v-model="query.filters.brand_id"
          class="filter-component"
          dense
          hide-details
          label="Thương hiệu"
          outlined
        />
        <category-autocomplete
          v-model="query.filters.category_id"
          class="filter-component"
          dense
          hide-details
          label="Loại"
          outlined
        />
      </div>
      <v-spacer />
      <v-btn color="primary" small @click="createProd">
        <v-icon left small>mdi-plus</v-icon>
        Thêm sản phẩm
      </v-btn>
    </div>
    <div class="pa-2">
      <app-data-table
        v-model="selectedItems"
        class="elevation-1"
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :loading="isLoading"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #item.index="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.image_url="{ item }">
          <v-img class="rounded" :src="item.image_url" width="100px" />
        </template>
        <template #item.price="{ item }">
          <span>{{ item.price | currency }}</span>
        </template>
        <template #item.status="{ item }">
          <v-checkbox v-model="item.status" @click="updateStatus(item)" />
        </template>
        <template #item.action="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="info--text" dense @click="detailProd(item)">
                <v-list-item-title>
                  <v-icon color="info" left small>mdi-eye-outline</v-icon>
                  <span>Sửa</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteProd(item)">
                <v-list-item-title>
                  <v-icon color="error" left small>mdi-delete-outline</v-icon>
                  <span>Xóa</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </app-data-table>
      <create-prod-dialog ref="createProdDialog" />
      <edit-prod-dialog ref="editProdDialog" />
      <delete-confirmation-dialog ref="deleteConfirmationDialog" />
      <!--      <v-btn @click="refetch"> refetch </v-btn>-->
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import AppDataTable from '@/components/common/molecules/AppDataTable'
import CreateProdDialog from '@/components/sale/products/organisms/CreateProdDialog'
import EditProdDialog from '@/components/sale/products/organisms/EditProdDialog'
import { useGetProds } from '@/composables'
import BrandAutocomplete from '~/components/sale/products/atoms/BrandAutocomplete.vue'
import CategoryAutocomplete from '~/components/sale/products/atoms/CategoryAutocomplete.vue'
import DeleteConfirmationDialog from '@/components/sale/products/organisms/DeleteConfirmationDialog.vue'

export default defineComponent({
  components: {
    CategoryAutocomplete,
    BrandAutocomplete,
    DeleteConfirmationDialog,
    AppDataTable,
    CreateProdDialog,
    EditProdDialog
  },
  layout: 'sale',
  setup(_, { refs }) {
    const { $api, $auth } = useContext()
    const queryClient = useQueryClient()
    const sortBy = ref('created_at')
    const sortDesc = ref(true)
    const query = ref({
      filters: {
        q: '',
        supplier_id: $auth.user.id,
        brand_id: null,
        category_id: null
      },
      sorts: '-created_at',
      page: 1,
      limit: 100
    })

    const { items, refetch, totalItems, isLoading } = useGetProds(query)

    const state = reactive({
      headers: [
        { text: 'STT', value: 'index', align: 'left', sortable: false },
        { text: 'Ảnh', value: 'image_url', sortable: false },
        { text: 'Tên', value: 'name', sortable: false },
        { text: 'Loại', value: 'category.name', sortable: false },
        { text: 'Thương hiệu', value: 'brand.name', sortable: false },
        { text: 'Trạng thái', value: 'status', sortable: false },
        { text: 'Bị báo cáo', value: 'num_reports' },
        { text: 'Số lượng', value: 'quantity', align: 'right' },
        { text: 'Giá', value: 'price', align: 'right' },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      selectedItems: []
    })

    const createProd = () => {
      refs.createProdDialog.open()
    }

    const detailProd = (item) => {
      refs.editProdDialog.open(item)
    }

    const deleteProd = async (data) => {
      const confirmed = await refs.deleteConfirmationDialog.open()
      if (confirmed) {
        $api.product.deleteProd(data.id).then(() => {
          queryClient.invalidateQueries('products')
        })
      }
    }

    const updateStatus = (item) => {
      $api.product
        .updateProd(item.id, {
          status: item.status
        })
        .then(() => {
          queryClient.invalidateQueries('products')
        })
    }

    const onUpdateSort = () => {
      if (sortBy.value) {
        query.value.sorts = `${sortDesc.value ? '-' : ''}${sortBy.value}`
      } else {
        query.value.sorts = '-created_at'
      }
    }

    return {
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items,
      deleteProd,
      createProd,
      refetch,
      totalItems,
      detailProd,
      query,
      isLoading,
      updateStatus,
      onUpdateSort,
      sortBy,
      sortDesc
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
