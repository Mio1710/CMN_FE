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
        <template #item.is_lock="{ item }">
          <v-checkbox v-model="item.is_lock" @click="lockProduct(item)" />
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
                  <span>Xem chi tiết</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteProduct(item)">
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
      <detail-prod-dialog ref="detailProdDialog" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import AppDataTable from '@/components/common/molecules/AppDataTable'
import CreateProdDialog from '@/components/sale/products/organisms/CreateProdDialog'
import DetailProdDialog from '@/components/sale/products/organisms/DetailProdDialog'
import { useGetProds } from '~/composables'
import BrandAutocomplete from '~/components/sale/products/atoms/BrandAutocomplete.vue'
import CategoryAutocomplete from '~/components/sale/products/atoms/CategoryAutocomplete.vue'

export default defineComponent({
  components: {
    CategoryAutocomplete,
    BrandAutocomplete,
    DetailProdDialog,
    CreateProdDialog,
    AppDataTable
  },
  setup(_, { refs }) {
    const { $api } = useContext()
    const queryClient = useQueryClient()
    const sortBy = ref('created_at')
    const sortDesc = ref(true)
    const query = ref({
      filters: {
        q: '',
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
        { text: '#', value: 'index', align: 'left', sortable: false },
        { text: 'Ảnh', value: 'image_url', sortable: false },
        { text: 'Tên', value: 'name', sortable: false },
        { text: 'Thương hiệu', value: 'brand.name', sortable: false },
        { text: 'Loại', value: 'category.name', sortable: false },
        { text: 'Báo cáo', value: 'num_reports' },
        { text: 'Khóa', value: 'is_lock' },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      selectedItems: []
    })
    const dialog = ref(false)

    const createProd = () => {
      refs.createProdDialog.open()
    }

    const detailProd = (item) => {
      refs.detailProdDialog.open(item)
    }

    const deleteProduct = (data) => {
      $api.product.deleteProd(data.id).then(() => {
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

    const lockProduct = (item) => {
      $api.product
        .updateProd(item.id, {
          is_lock: item.is_lock
        })
        .then(() => {
          queryClient.invalidateQueries('products')
        })
    }

    return {
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items,
      deleteProduct,
      createProd,
      dialog,
      refetch,
      totalItems,
      detailProd,
      query,
      onUpdateSort,
      sortBy,
      sortDesc,
      isLoading,
      lockProduct
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
