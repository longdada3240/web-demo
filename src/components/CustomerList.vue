<!-- src/components/CustomerList.vue -->
<template>
  <div class="customer-list">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>客户列表</h2>
        <a-tag color="blue">共 {{ totalCustomers }} 个客户</a-tag>
      </div>
      <div class="header-right">
        <a-space>
          <a-button type="primary" icon="plus" @click="addCustomer">
            新增客户
          </a-button>
          <a-button icon="download" @click="exportData">
            导出数据
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <a-card class="search-section" :bordered="false">
      <a-space :size="16">
        <a-input
          v-model="searchForm.keyword"
          placeholder="请输入客户姓名、电话或身份证号"
          style="width: 300px"
          @pressEnter="handleSearch">
          <a-icon slot="prefix" type="search" />
        </a-input>
        
        <a-select v-model="searchForm.status" placeholder="客户状态" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="vip">VIP客户</a-select-option>
          <a-select-option value="normal">普通客户</a-select-option>
          <a-select-option value="new">新客户</a-select-option>
          <a-select-option value="enterprise">企业客户</a-select-option>
        </a-select>
        
        <a-select v-model="searchForm.manager" placeholder="管户人" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="张经理">张经理</a-select-option>
          <a-select-option value="李经理">李经理</a-select-option>
          <a-select-option value="王经理">王经理</a-select-option>
        </a-select>
        
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="resetSearch">重置</a-button>
        
        <!-- 视图切换 -->
        <div class="view-switch">
          <span class="view-label">视图:</span>
          <a-radio-group v-model="viewType" button-style="solid" size="small">
            <a-radio-button value="card">
              <a-icon type="appstore" /> 卡片
            </a-radio-button>
            <a-radio-button value="list">
              <a-icon type="unordered-list" /> 列表
            </a-radio-button>
          </a-radio-group>
        </div>
      </a-space>
    </a-card>

    <!-- 卡片视图 -->
    <div v-if="viewType === 'card'" class="card-view-section">
      <a-spin :spinning="loading">
        <a-card
          v-for="customer in filteredCustomers"
          :key="customer.id"
          class="customer-card"
          :bordered="false"
          hoverable
          @click="viewCustomer(customer)">
          <div class="card-content">
            <!-- 左侧：客户基本信息 -->
            <div class="card-left">
              <div class="customer-header">
                <h3 class="customer-name">{{ customer.name }}</h3>
                <div class="main-tags">
                  <a-tag
                    v-for="tag in customer.mainTags"
                    :key="tag.id"
                    :color="getTagColor(tag.label)">
                    {{ tag.label }}
                  </a-tag>
                </div>
              </div>
              
              <div class="customer-info-list">
                <div class="info-line">证件号码: {{ formatIdCard(customer.idCard) }}</div>
                <div class="info-line">联系电话: {{ customer.phone }}</div>
                <div class="info-line">客户经理: {{ customer.manager }}</div>
                <div class="info-line">所属机构: 某某支行分理处</div>
              </div>
            </div>

            <!-- 中间：标签信息 -->
            <div class="card-middle">
              <div class="tag-section">
                <div class="tag-group">
                  <label>主标签:</label>
                  <div class="tags-wrapper">
                    <a-tag
                      v-for="tag in customer.leftTags.slice(0, 5)"
                      :key="tag.id"
                      :color="tag.color">
                      {{ tag.label }}
                    </a-tag>
                    <a-tag v-if="customer.leftTags.length > 5" color="default">
                      +{{ customer.leftTags.length - 5 }}
                    </a-tag>
                  </div>
                </div>
                
                <div class="tag-group" v-if="customer.rightTags.length > 0">
                  <label>手工标签:</label>
                  <div class="tags-wrapper">
                    <a-tag
                      v-for="tag in customer.rightTags.slice(0, 3)"
                      :key="tag.id"
                      :color="tag.color">
                      {{ tag.label }}
                    </a-tag>
                    <a-tag v-if="customer.rightTags.length > 3" color="default">
                      +{{ customer.rightTags.length - 3 }}
                    </a-tag>
                  </div>
                </div>
              </div>
              
              <!-- 底部信息栏 -->
              <div class="card-footer">
                <div class="footer-item">
                  <a-tag color="red">基本信息</a-tag>
                  <a-tag color="orange">销售列表</a-tag>
                  <a-tag color="green">申请记录</a-tag>
                  <a-tag color="blue">360画像</a-tag>
                  <a-tag color="purple">服务记录</a-tag>
                </div>
              </div>
            </div>

            <!-- 右侧：操作按钮 -->
            <div class="card-right">
              <a-space direction="vertical">
                <a-button type="link" @click.stop="viewBasicInfo(customer)">
                  <a-icon type="file-text" /> 基本信息
                </a-button>
                <a-button type="link" @click.stop="editCustomer(customer)">
                  <a-icon type="edit" /> 修改记录
                </a-button>
                <a-button type="link" danger @click.stop="deleteCustomer(customer)">
                  <a-icon type="delete" /> 一键推单
                </a-button>
              </a-space>
            </div>
          </div>
        </a-card>

        <!-- 空状态 -->
        <a-empty v-if="filteredCustomers.length === 0" description="暂无客户数据" />
      </a-spin>
    </div>

    <!-- 列表视图 -->
    <a-card v-if="viewType === 'list'" class="table-section" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="filteredCustomers"
        :loading="loading"
        :pagination="false"
        row-key="id"
        @change="handleSelectionChange">
        
        <template slot-scope="text, record, index" slot="name">
          <div class="customer-name-col">
            <span class="name-text">{{ record.name }}</span>
            <div class="main-tags-inline">
              <a-tag
                v-for="tag in record.mainTags"
                :key="tag.id"
                :color="getTagColor(tag.label)"
                size="small">
                {{ tag.label }}
              </a-tag>
            </div>
          </div>
        </template>
        
        <template slot-scope="text, record" slot="idCard">
          <span class="id-card">{{ formatIdCard(record.idCard) }}</span>
        </template>
        
        <template slot-scope="text, record" slot="leftTags">
          <div class="tags-wrapper">
            <a-tag
              v-for="tag in record.leftTags.slice(0, 3)"
              :key="tag.id"
              :color="tag.color"
              size="small">
              {{ tag.label }}
            </a-tag>
            <a-tag v-if="record.leftTags.length > 3" size="small">
              +{{ record.leftTags.length - 3 }}
            </a-tag>
          </div>
        </template>
        
        <template slot-scope="text, record" slot="rightTags">
          <div class="tags-wrapper">
            <a-tag
              v-for="tag in record.rightTags.slice(0, 2)"
              :key="tag.id"
              :color="tag.color"
              size="small">
              {{ tag.label }}
            </a-tag>
            <a-tag v-if="record.rightTags.length > 2" size="small">
              +{{ record.rightTags.length - 2 }}
            </a-tag>
          </div>
        </template>
        
        <template slot-scope="text, record" slot="action">
          <a-space>
            <a-button type="link" size="small" @click="viewBasicInfo(record)">查看</a-button>
            <a-button type="link" size="small" @click="editCustomer(record)">编辑</a-button>
            <a-button type="link" size="small" danger @click="deleteCustomer(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 分页 -->
    <div class="pagination-section">
      <a-pagination
        :current="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="totalCustomers"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
        :show-total="total => `共 ${total} 条记录`"
        @change="handleCurrentChange"
        @showSizeChange="handleSizeChange" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerList',
  data() {
    return {
      loading: false,
      viewType: 'card', // 默认卡片视图
      searchForm: {
        keyword: '',
        status: '',
        manager: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        { title: '客户ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '客户姓名', dataIndex: 'name', key: 'name', width: 150, scopedSlots: { customRender: 'name' } },
        { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 140 },
        { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 180, scopedSlots: { customRender: 'idCard' } },
        { title: '管户人', dataIndex: 'manager', key: 'manager', width: 100 },
        { title: '标签', key: 'leftTags', width: 200, scopedSlots: { customRender: 'leftTags' } },
        { title: '手工标签', key: 'rightTags', width: 150, scopedSlots: { customRender: 'rightTags' } },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '操作', key: 'action', width: 200, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ],
      customers: [
        {
          id: 1,
          name: '刘琳琳',
          phone: '13800138001',
          idCard: '110101199001011234',
          manager: '张经理',
          createTime: '2024-01-15 10:30:00',
          mainTags: [
            { id: 1, label: '大行签约标签', color: '#f56c6c' },
            { id: 2, label: '大标签标签', color: '#e6a23c' }
          ],
          leftTags: [
            { id: 1, label: '小标签标签', color: 'blue' },
            { id: 2, label: '小行标签', color: 'green' },
            { id: 3, label: '小签标签', color: 'orange' },
            { id: 4, label: '小标签行', color: 'cyan' },
            { id: 5, label: '小签行标', color: 'purple' }
          ],
          rightTags: [
            { id: 1, label: '手工标签1', color: 'red' },
            { id: 2, label: '手工标签2', color: 'volcano' }
          ]
        },
        {
          id: 2,
          name: '李四',
          phone: '13800138002',
          idCard: '110101199002021234',
          manager: '李经理',
          createTime: '2024-01-16 14:20:00',
          mainTags: [
            { id: 3, label: '普通客户', color: '#909399' },
            { id: 4, label: '新客户', color: '#67c23a' }
          ],
          leftTags: [
            { id: 4, label: '标签四', color: 'blue' },
            { id: 5, label: '标签五', color: 'orange' }
          ],
          rightTags: [
            { id: 3, label: '手工标签3', color: 'red' },
            { id: 4, label: '手工标签4', color: 'green' },
            { id: 5, label: '手工标签5', color: 'blue' }
          ]
        },
        {
          id: 3,
          name: '王五',
          phone: '13800138003',
          idCard: '110101199003031234',
          manager: '王经理',
          createTime: '2024-01-17 09:15:00',
          mainTags: [
            { id: 5, label: '企业客户', color: '#409eff' }
          ],
          leftTags: [
            { id: 6, label: '标签六', color: 'red' },
            { id: 7, label: '标签七', color: 'green' },
            { id: 8, label: '标签八', color: 'orange' },
            { id: 9, label: '标签九', color: 'geekblue' },
            { id: 10, label: '标签十', color: 'purple' }
          ],
          rightTags: [
            { id: 6, label: '手工标签6', color: 'orange' },
            { id: 7, label: '手工标签7', color: 'green' },
            { id: 8, label: '手工标签8', color: 'blue' },
            { id: 9, label: '手工标签9', color: 'red' }
          ]
        }
      ]
    };
  },
  computed: {
    filteredCustomers() {
      let result = this.customers;
      
      if (this.searchForm.keyword) {
        const keyword = this.searchForm.keyword.toLowerCase();
        result = result.filter(customer => 
          customer.name.toLowerCase().includes(keyword) ||
          customer.phone.includes(keyword) ||
          customer.idCard.includes(keyword)
        );
      }
      
      if (this.searchForm.status) {
        result = result.filter(customer => {
          const mainTagLabels = customer.mainTags.map(tag => tag.label);
          return mainTagLabels.some(label => {
            switch (this.searchForm.status) {
              case 'vip': return label.includes('VIP');
              case 'normal': return label.includes('普通');
              case 'new': return label.includes('新');
              case 'enterprise': return label.includes('企业');
              default: return true;
            }
          });
        });
      }
      
      if (this.searchForm.manager) {
        result = result.filter(customer => customer.manager === this.searchForm.manager);
      }
      
      return result;
    },
    
    totalCustomers() {
      return this.filteredCustomers.length;
    }
  },
  methods: {
    handleSearch() {
      this.pagination.currentPage = 1;
    },
    
    resetSearch() {
      this.searchForm = {
        keyword: '',
        status: '',
        manager: ''
      };
      this.pagination.currentPage = 1;
    },
    
    formatIdCard(idCard) {
      if (!idCard) return '';
      return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
    },
    
    getTagColor(label) {
      if (label.includes('VIP') || label.includes('大行')) return 'red';
      if (label.includes('重要') || label.includes('大')) return 'orange';
      if (label.includes('新')) return 'green';
      if (label.includes('企业')) return 'blue';
      return 'default';
    },
    
    addCustomer() {
      this.$message.info('跳转到新增客户页面');
    },
    
    viewCustomer(customer) {
      // 点击卡片查看客户详情
      this.$router.push({ 
        name: 'CustomerDetail', 
        params: { id: customer.id },
        query: { tab: 'basic' }
      });
    },
    
    viewBasicInfo(customer) {
      // 查看基本信息
      this.$router.push({ 
        name: 'CustomerDetail', 
        params: { id: customer.id },
        query: { tab: 'basic' }
      });
    },
    
    editCustomer(customer) {
      this.$message.info(`编辑客户：${customer.name}`);
    },
    
    deleteCustomer(customer) {
      const vm = this;
      this.$confirm({
        title: '确认删除',
        content: `确定要删除客户"${customer.name}"吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const index = vm.customers.findIndex(c => c.id === customer.id);
          if (index > -1) {
            vm.customers.splice(index, 1);
            vm.$message.success('删除成功');
          }
        }
      });
    },
    
    exportData() {
      this.$message.info('导出客户数据');
    },
    
    handleSelectionChange() {
      // 处理选择变化
    },
    
    handleSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
    },
    
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
    }
  }
};
</script>

<style scoped>
.customer-list {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left h2 {
  margin: 0 16px 0 0;
  display: inline-block;
  font-size: 20px;
  font-weight: 600;
}

.search-section {
  margin-bottom: 20px;
}

.view-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-label {
  color: #666;
  font-size: 14px;
}

/* 卡片视图样式 */
.card-view-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.customer-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.customer-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

/* 左侧基本信息 */
.card-left {
  flex: 0 0 280px;
}

.customer-header {
  margin-bottom: 12px;
}

.customer-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.main-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.customer-info-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  margin-top: 12px;
}

.info-line {
  color: #666;
  line-height: 1.6;
}

/* 中间标签区域 */
.card-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tag-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tag-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tag-group label {
  color: #666;
  font-size: 14px;
  min-width: 70px;
  line-height: 24px;
}

.tags-wrapper {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.footer-item {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 右侧操作按钮 */
.card-right {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 列表视图样式 */
.table-section {
  margin-bottom: 20px;
}

.customer-name-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-text {
  font-weight: 500;
}

.main-tags-inline {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.id-card {
  font-family: 'Courier New', monospace;
}

/* 分页 */
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .card-content {
    flex-direction: column;
  }
  
  .card-left,
  .card-right {
    flex: 1;
    width: 100%;
  }
  
  .card-right {
    align-items: flex-start;
  }
}
</style>
