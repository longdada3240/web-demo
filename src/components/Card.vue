<template>
  <div class="list-page-container">
    <!-- 查询条件区域 -->
    <a-card title="查询条件" size="small" class="query-card">
      <a-form layout="inline" :model="queryForm" @finish="handleQuery">
        <!-- 查询字段 -->
        <a-form-item label="名称">
          <a-input v-model:value="queryForm.name" placeholder="请输入名称" />
        </a-form-item>
        
        <a-form-item label="状态">
          <a-select v-model:value="queryForm.status" placeholder="请选择状态" style="width: 120px">
            <a-select-option value="1">启用</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
            <a-button @click="handleExport">导出</a-button>
          </a-space>
        </a-form-item>

        <!-- 右侧区域：复选框 + 视图切换 -->
        <a-form-item style="margin-left: auto">
          <a-space>
            <!-- 复选框 -->
            <a-checkbox v-model:checked="queryForm.showDetail">显示详情</a-checkbox>
            <a-checkbox v-model:checked="queryForm.includeChildren">包含子级</a-checkbox>
            
            <!-- 视图切换按钮 -->
            <span class="view-switch-label">视图:</span>
            <a-radio-group v-model:value="viewType" size="small" button-style="solid">
              <a-radio-button value="card">
                <template #default>
                  <span class="view-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"></rect>
                    </svg>
                  </span>
                </template>
              </a-radio-button>
              <a-radio-button value="list">
                <template #default>
                  <span class="view-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <rect x="3" y="4" width="18" height="2" rx="1" fill="currentColor"></rect>
                      <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor"></rect>
                      <rect x="3" y="18" width="18" height="2" rx="1" fill="currentColor"></rect>
                    </svg>
                  </span>
                </template>
              </a-radio-button>
            </a-radio-group>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 内容区域 -->
    <a-card class="content-card">
      <!-- 卡片视图 -->
      <div v-if="viewType === 'card'" class="card-view">
        <a-row :gutter="16">
          <a-col 
            v-for="item in dataList" 
            :key="item.id" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
            class="card-col"
          >
            <a-card class="item-card" :title="item.name" size="small">
              <template #extra>
                <!-- 修复这里：使用正确的语法 -->
                <a-tag v-if="item.status === '1'" color="green">启用</a-tag>
                <a-tag v-else color="red">禁用</a-tag>
              </template>
              
              <div class="card-content">
                <p>创建时间: {{ item.createTime }}</p>
                <p>描述: {{ item.description }}</p>
              </div>
              
              <template #actions>
                <span @click="handleEdit(item)">
                  <!-- <EditOutlined /> -->
                  编辑
                </span>
                <span @click="handleDelete(item)">
                  <!-- <DeleteOutlined /> -->
                  删除
                </span>
              </template>
            </a-card>
          </a-col>
        </a-row>
        
        <!-- 空状态 -->
        <a-empty v-if="dataList.length === 0" description="暂无数据" />
      </div>

      <!-- 列表视图 -->
      <div v-if="viewType === 'list'" class="list-view">
        <a-table 
          :columns="columns" 
          :data-source="dataList" 
          :pagination="pagination"
          :row-key="record => record.id"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <!-- 修复这里：使用正确的语法 -->
              <a-tag v-if="record.status === '1'" color="green">启用</a-tag>
              <a-tag v-else color="red">禁用</a-tag>
            </template>
            
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import EditOutlined from '@ant-design/icons-vue/EditOutlined'
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined'

export default defineComponent({
  name: 'ListPage',
  components: {
    EditOutlined,
    DeleteOutlined
  },
  setup() {
    // 视图类型
    const viewType = ref('card')
    
    // 查询表单
    const queryForm = reactive({
      name: '',
      status: undefined,
      showDetail: false,
      includeChildren: true
    })

    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条记录`
    })

    // 表格列配置
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        width: 150
      }
    ]

    // 模拟数据
    const dataList = ref([
      {
        id: 1,
        name: '项目一',
        status: '1',
        createTime: '2023-01-15',
        description: '这是项目一的描述信息'
      },
      {
        id: 2,
        name: '项目二',
        status: '0',
        createTime: '2023-02-20',
        description: '这是项目二的描述信息，稍微长一些'
      },
      {
        id: 3,
        name: '项目三',
        status: '1',
        createTime: '2023-03-10',
        description: '项目三的描述'
      },
      {
        id: 4,
        name: '项目四',
        status: '1',
        createTime: '2023-04-05',
        description: '项目四的详细描述信息'
      }
    ])

    // 查询处理
    const handleQuery = (values) => {
      console.log('查询参数:', values)
      // 执行查询操作
      pagination.current = 1
      // 这里调用API获取数据
    }

    // 重置查询
    const handleReset = () => {
      Object.assign(queryForm, {
        name: '',
        status: undefined,
        showDetail: false,
        includeChildren: true
      })
    }

    // 导出数据
    const handleExport = () => {
      console.log('导出数据:', queryForm)
      // 执行导出操作
    }

    // 编辑项目
    const handleEdit = (item) => {
      console.log('编辑项目:', item)
      // 打开编辑对话框或跳转到编辑页面
    }

    // 删除项目
    const handleDelete = (item) => {
      console.log('删除项目:', item)
      // 显示确认对话框并执行删除操作
    }

    return {
      viewType,
      queryForm,
      pagination,
      columns,
      dataList,
      handleQuery,
      handleReset,
      handleExport,
      handleEdit,
      handleDelete
    }
  }
})
</script>

<style scoped>
.list-page-container {
  padding: 16px;
}

.query-card {
  margin-bottom: 16px;
}

.content-card {
  min-height: 400px;
}

.view-switch-label {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.view-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-col {
  margin-bottom: 16px;
}

.item-card {
  height: 100%;
  transition: all 0.3s;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-content p {
  margin-bottom: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

:deep(.ant-card-actions) {
  background: #fafafa;
}

:deep(.ant-card-actions > li) {
  margin: 8px 0;
  cursor: pointer;
}

:deep(.ant-card-actions > li:hover) {
  color: #1890ff;
}
</style>