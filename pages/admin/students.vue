<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <h1 class="mb-6">Sinh viên</h1>
      <v-spacer />
    </div>
    <div class="px-3 d-flex">
      <div class="app-filter d-flex gap-3">
        <v-text-field v-model="query.filters.q" class="filter-component" dense hide-details label="Tìm kiếm" outlined />
      </div>
      <v-spacer />
      <v-btn color="primary" small @click="createClass">
        <v-icon left small>mdi-plus</v-icon>
        Thêm Sinh viên
      </v-btn>
    </div>
    <div class="pa-2">
      <app-data-table v-model="selectedItems" class="elevation-1" :headers="headers" :items="items" :items-per-page="5">
        <template #item.index="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.action="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="info--text" dense @click="detailClass(item)">
                <v-list-item-title>
                  <v-icon color="info" left small>mdi-eye-outline</v-icon>
                  <span>Xem chi tiết</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="error--text" dense @click="deleteClass(item)">
                <v-list-item-title>
                  <v-icon color="error" left small>mdi-delete-outline</v-icon>
                  <span>Xóa</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </app-data-table>
      <create-class-dialog ref="createClassDialog" />
      <edit-class-dialog ref="editClassDialog" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import { useQueryClient } from 'vue-query'
import { useGetCategories } from '@/composables'
import AppDataTable from '@/components/common/molecules/AppDataTable'
import CreateClassDialog from '@/components/admin/classes/organisms/CreateClassDialog'
import EditClassDialog from '@/components/admin/classes/organisms/EditClassDialog.vue'

export default defineComponent({
  components: {
    EditClassDialog,
    CreateClassDialog,
    AppDataTable
  },
  setup(_, { refs }) {
    const { $api } = useContext()
    const queryClient = useQueryClient()
    const query = ref({
      filters: {
        q: ''
      },
      sorts: '-created_at',
      page: 1,
      limit: 100
    })

    const { items } = useGetCategories(query)

    const state = reactive({
      headers: [
        {
          text: 'STT',
          value: 'index',
          align: 'left',
          sortable: false
        },
        {
          text: 'Mã',
          value: 'masv'
        },
        {
          text: 'Tên',
          value: 'ten'
        },
        {
          text: 'Giảng viên',
          value: 'teacher'
        },
        {
          text: 'Số lượng sinh viên',
          value: 'student_count'
        },
        {
          text: 'Ngày bắt đầu',
          value: 'start_date'
        },
        {
          text: 'Ngày kết thúc',
          value: 'end_date'
        },
        {
          text: '',
          value: 'action',
          align: 'right',
          sortable: false
        }
      ],
      selectedItems: []
    })
    const dialog = ref(false)

    const createClass = () => {
      refs.createClassDialog.open()
    }

    const detailClass = (item) => {
      refs.editClassDialog.open(item)
    }

    const deleteClass = (data) => {
      $api.brand.deleteBrand(data.id).then(() => {
        queryClient.invalidateQueries('brands')
      })
    }

    return {
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items,
      deleteClass,
      createClass,
      dialog,
      detailClass,
      query
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
