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
          <a-button type="primary" @click="addCustomer">
            <template #icon><plus-outlined /></template>
            新增客户
          </a-button>
          <a-button @click="exportData">
            <template #icon><download-outlined /></template>
            导出数据
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <a-card class="search-section" :bordered="false">
      <a-space wrap :size="16">
        <a-input
          v-model:value="searchForm.keyword"
          placeholder="请输入客户姓名、电话或身份证号"
          style="width: 300px"
          @pressEnter="handleSearch">
          <template #prefix><search-outlined /></template>
        </a-input>
        
        <a-select v-model:value="searchForm.status" placeholder="客户状态" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="vip">VIP客户</a-select-option>
          <a-select-option value="normal">普通客户</a-select-option>
          <a-select-option value="new">新客户</a-select-option>
          <a-select-option value="enterprise">企业客户</a-select-option>
        </a-select>
        
        <a-select v-model:value="searchForm.manager" placeholder="管户人" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="张经理">张经理</a-select-option>
          <a-select-option value="李经理">李经理</a-select-option>
          <a-select-option value="王经理">王经理</a-select-option>
        </a-select>
        
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="resetSearch">重置</a-button>
        <a-button @click="showAdvancedFilter = !showAdvancedFilter">
          <filter-outlined /> {{ showAdvancedFilter ? '收起筛选' : '高级筛选' }}
        </a-button>
        
        <!-- 视图切换 -->
        <div class="view-switch">
          <span class="view-label">视图:</span>
          <a-radio-group v-model:value="viewType" button-style="solid" size="small">
            <a-radio-button value="card">
              <appstore-outlined /> 卡片
            </a-radio-button>
            <a-radio-button value="list">
              <unordered-list-outlined /> 列表
            </a-radio-button>
          </a-radio-group>
        </div>
      </a-space>
    </a-card>

    <!-- 高级筛选面板 -->
    <a-card v-if="showAdvancedFilter" class="advanced-filter-section" :bordered="false">
      <div class="filter-container">
        <!-- 主标签筛选 -->
        <div class="filter-row">
          <div class="filter-label">筛选条件:</div>
          <div class="filter-options">
            <a-checkbox-group v-model:value="selectedMainTags" @change="handleMainTagChange">
              <a-checkbox
                v-for="tag in mainTagOptions"
                :key="tag.value"
                :value="tag.value">
                {{ tag.label }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- 小标签筛选（第二行标题） -->
        <div class="filter-row">
          <div class="filter-label">筛选条件:</div>
          <div class="filter-options">
            <a-checkbox-group v-model:value="selectedSecondRowTags">
              <a-checkbox
                v-for="tag in secondRowTagOptions"
                :key="tag.value"
                :value="tag.value">
                {{ tag.label }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- 小标签树形筛选（第三行分类） -->
        <div class="filter-row">
          <div class="filter-label">筛选条件:</div>
          <div class="filter-options">
            <div class="filter-category-row">
              <div 
                v-for="category in smallTagCategories" 
                :key="category.key"
                class="category-section">
                <div class="category-header">
                  <span class="category-title">分类</span>
                  <a-radio-group 
                    v-model:value="selectedCategoryTags[category.key]" 
                    @change="handleCategoryTagChange">
                    <a-radio 
                      v-for="tag in category.tags" 
                      :key="tag.key" 
                      :value="tag.key">
                      {{ tag.label }}
                    </a-radio>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第四行 - 多个下拉选择（树形结构） -->
        <div class="filter-row">
          <div class="filter-label">更多筛选:</div>
          <div class="filter-options">
            <a-space wrap>
              <a-select v-model:value="filterForm.businessInfo" placeholder="业务信息" style="width: 150px" allowClear>
                <a-select-option value="option1">选项1</a-select-option>
                <a-select-option value="option2">选项2</a-select-option>
              </a-select>
              
              <a-select v-model:value="filterForm.riskInfo" placeholder="风险信息" style="width: 150px" allowClear>
                <a-select-option value="low">低风险</a-select-option>
                <a-select-option value="medium">中风险</a-select-option>
                <a-select-option value="high">高风险</a-select-option>
              </a-select>
              
              <a-select v-model:value="filterForm.creditInfo" placeholder="征信信息" style="width: 150px" allowClear>
                <a-select-option value="good">良好</a-select-option>
                <a-select-option value="normal">一般</a-select-option>
                <a-select-option value="bad">较差</a-select-option>
              </a-select>
              
              <a-select v-model:value="filterForm.serviceInfo" placeholder="服务信息" style="width: 150px" allowClear>
                <a-select-option value="vip">VIP服务</a-select-option>
                <a-select-option value="normal">普通服务</a-select-option>
              </a-select>
              
              <a-select v-model:value="filterForm.pointStatus" placeholder="积分状态" style="width: 150px" allowClear>
                <a-select-option value="high">高积分</a-select-option>
                <a-select-option value="medium">中等积分</a-select-option>
                <a-select-option value="low">低积分</a-select-option>
              </a-select>
              
              <a-select v-model:value="filterForm.manualTag" placeholder="手工标签" style="width: 150px" allowClear>
                <a-select-option value="tag1">手工标签1</a-select-option>
                <a-select-option value="tag2">手工标签2</a-select-option>
              </a-select>
            </a-space>
          </div>
        </div>

        <!-- 已选筛选条件 -->
        <div class="filter-row" v-if="hasSelectedFilters">
          <div class="filter-label">已选筛选条件:</div>
          <div class="selected-filters">
            <!-- 主标签 -->
            <template v-if="selectedMainTags.length > 0">
              <span class="filter-group-title">筛选条件:</span>
              <a-tag
                v-for="tag in selectedMainTags"
                :key="tag"
                closable
                @close="removeMainTag(tag)"
                color="blue">
                {{ getMainTagLabel(tag) }}
              </a-tag>
            </template>

            <!-- 第二行标签 -->
            <template v-if="selectedSecondRowTags.length > 0">
              <span class="filter-group-title">筛选条件:</span>
              <a-tag
                v-for="tag in selectedSecondRowTags"
                :key="tag"
                closable
                @close="removeSecondRowTag(tag)"
                color="green">
                {{ getSecondRowTagLabel(tag) }}
              </a-tag>
            </template>

            <!-- 分类标签 -->
            <template v-for="(value, key) in selectedCategoryTags">
              <a-tag
                v-if="value"
                :key="'cat-' + key"
                closable
                @close="removeCategoryTag(key)"
                color="orange">
                {{ getCategoryTagLabel(value) }}
              </a-tag>
            </template>

            <!-- 其他筛选条件 -->
            <template v-for="(value, key) in filterForm">
              <a-tag
                v-if="value"
                :key="key"
                closable
                @close="clearFilterItem(key)"
                color="purple">
                {{ getFilterLabel(key, value) }}
              </a-tag>
            </template>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="filter-actions">
          <a-space>
            <a-button type="primary" @click="applyFilters">
              保存
            </a-button>
            <a-button @click="clearAllFilters">
              清除
            </a-button>
          </a-space>
        </div>
      </div>
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
                <!-- 客户信息区域 -->
                <div class="customer-info">
   
                    <span class="info-label">身份证：{{ customer.idCard }}</span>
                
      
                    <span class="info-label">电话号码：{{ customer.phone }}</span>
              
                    <span class="info-label">客户管户人：{{ customer.manager }}</span>
  
                </div>
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
                  <a-tag color="red">基本信息</a-tag>
                  <a-tag color="orange">销售列表</a-tag>
                  <a-tag color="green">申请记录</a-tag>
                  <a-tag color="blue">360画像</a-tag>
                  <a-tag color="purple">服务记录</a-tag>
                </div>
            </div>

            <!-- 右侧：操作按钮 -->
            <div class="card-right">
              <div class="action-buttons">
                <!-- 第一行 -->
                <div class="button-row">
                  <a-button class="action-btn" @click.stop="viewBasicInfo(customer)">
                    <img src="@/images/列表.png" alt="基本信息" class="btn-icon" />
                    <span>基本信息</span>
                  </a-button>
                  <a-button class="action-btn" @click.stop="viewModifyRecord(customer)">
                    <img src="@/images/icon_修改记录.png" alt="修改记录" class="btn-icon" />
                    <span>修改记录</span>
                  </a-button>
                </div>
                <!-- 第二行 -->
                <div class="button-row">
                  <a-button class="action-btn" @click.stop="viewFollowCustomer(customer)">
                    <img src="@/images/icon_跟进客户.png" alt="跟进客户" class="btn-icon" />
                    <span>跟进客户</span>
                  </a-button>
                  <a-button class="action-btn" @click.stop="viewPushOrder(customer)">
                    <img src="@/images/icon_一键推单.png" alt="一键推单" class="btn-icon" />
                    <span>一键推单</span>
                  </a-button>
                </div>
              </div>
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
        
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
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
          
          <template v-if="column.key === 'idCard'">
            <span class="id-card">{{ formatIdCard(record.idCard) }}</span>
          </template>
          
          <template v-if="column.key === 'leftTags'">
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
          
          <template v-if="column.key === 'rightTags'">
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
          
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewBasicInfo(record)">查看</a-button>
              <a-button type="link" size="small" @click="editCustomer(record)">编辑</a-button>
              <a-button type="link" size="small" danger @click="deleteCustomer(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 分页 -->
    <div class="pagination-section">
      <a-pagination
        v-model:current="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
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
import { message, Modal } from 'ant-design-vue';

export default {
  name: 'CustomerList',
  data() {
    return {
      loading: false,
      viewType: 'card', // 默认卡片视图
      showAdvancedFilter: false, // 是否显示高级筛选
      searchForm: {
        keyword: '',
        status: '',
        manager: ''
      },
      // 主标签筛选
      selectedMainTags: [],
      mainTagOptions: [
        { label: '选项', value: 'option1' },
        { label: '选项', value: 'option2' },
        { label: '选项', value: 'option3' },
        { label: '选项', value: 'option4' }
      ],
      // 第二行标签筛选
      selectedSecondRowTags: [],
      secondRowTagOptions: [
        { label: '选项', value: 'sec_option1' },
        { label: '选项', value: 'sec_option2' },
        { label: '选项', value: 'sec_option3' },
        { label: '选项', value: 'sec_option4' }
      ],
      // 分类标签（单选）
      selectedCategoryTags: {},
      smallTagCategories: [
        {
          key: 'category1',
          tags: [
            { label: '选项', key: 'cat1_tag1' },
            { label: '选项', key: 'cat1_tag2' }
          ]
        },
        {
          key: 'category2',
          tags: [
            { label: '选项', key: 'cat2_tag1' },
            { label: '选项', key: 'cat2_tag2' }
          ]
        }
      ],
      // 其他筛选条件
      filterForm: {
        businessInfo: undefined,
        riskInfo: undefined,
        creditInfo: undefined,
        serviceInfo: undefined,
        pointStatus: undefined,
        manualTag: undefined
      },
      // 应用的筛选条件（保存后的）
      appliedFilters: {
        mainTags: [],
        secondRowTags: [],
        categoryTags: {},
        otherFilters: {}
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        { title: '客户ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '客户姓名', dataIndex: 'name', key: 'name', width: 150 },
        { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 140 },
        { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 180 },
        { title: '管户人', dataIndex: 'manager', key: 'manager', width: 100 },
        { title: '标签', key: 'leftTags', width: 200 },
        { title: '手工标签', key: 'rightTags', width: 150 },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '操作', key: 'action', width: 200, fixed: 'right' }
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
    // 是否有选中的筛选条件
    hasSelectedFilters() {
      return this.selectedMainTags.length > 0 || 
             this.selectedSecondRowTags.length > 0 ||
             Object.values(this.selectedCategoryTags).some(v => v) ||
             Object.values(this.filterForm).some(v => v !== undefined && v !== '');
    },
    
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
      message.info('跳转到新增客户页面');
    },
    
    navigateToDetail(customerId, tab) {
      // 统一的导航方法，优先使用 emit，如果父组件没有监听则使用 router
      this.$emit('navigate-to-detail', { customerId, tab });
      
      // 如果 router 存在，也执行路由跳转（作为备用）
      if (this.$router) {
        this.$nextTick(() => {
          this.$router.push({
            path: '/customer-detail/' + customerId,
            query: { tab }
          }).catch(() => {});
        });
      }
    },
    
    viewCustomer(customer) {
      // 点击卡片查看客户详情
      this.navigateToDetail(customer.id, 'basic');
    },
    
    viewBasicInfo(customer) {
      // 查看基本信息 - 跳转到详情页的基本信息tab
      this.navigateToDetail(customer.id, 'basic');
    },
    
    viewModifyRecord(customer) {
      // 查看修改记录 - 跳转到详情页的修改记录tab
      this.navigateToDetail(customer.id, 'modify');
    },
    
    viewFollowCustomer(customer) {
      // 跟进客户
      message.info(`跟进客户：${customer.name}`);
    },
    
    viewPushOrder(customer) {
      // 一键推单 - 跳转到详情页的推单tab
      this.navigateToDetail(customer.id, 'push');
    },
    
    editCustomer(customer) {
      message.info(`编辑客户：${customer.name}`);
    },
    
    deleteCustomer(customer) {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除客户"${customer.name}"吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index > -1) {
            this.customers.splice(index, 1);
            message.success('删除成功');
          }
        }
      });
    },
    
    exportData() {
      message.info('导出客户数据');
    },
    
    handleSelectionChange() {
      // 处理选择变化
    },
    
    handleSizeChange(current, size) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = size;
    },
    
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
    },
    
    // ============ 高级筛选相关方法 ============
    
    // 主标签变化
    handleMainTagChange(checkedValues) {
      console.log('主标签选择:', checkedValues);
    },
    
    // 分类标签变化
    handleCategoryTagChange() {
      console.log('分类标签选择:', this.selectedCategoryTags);
    },
    
    // 获取主标签的显示文本
    getMainTagLabel(value) {
      const tag = this.mainTagOptions.find(t => t.value === value);
      return tag ? tag.label : value;
    },
    
    // 获取第二行标签的显示文本
    getSecondRowTagLabel(value) {
      const tag = this.secondRowTagOptions.find(t => t.value === value);
      return tag ? tag.label : value;
    },
    
    // 获取分类标签的显示文本
    getCategoryTagLabel(key) {
      for (const category of this.smallTagCategories) {
        const tag = category.tags.find(t => t.key === key);
        if (tag) return tag.label;
      }
      return key;
    },
    
    // 获取其他筛选条件的显示文本
    getFilterLabel(key, value) {
      const labelMap = {
        businessInfo: '业务信息',
        riskInfo: '风险信息',
        creditInfo: '征信信息',
        serviceInfo: '服务信息',
        pointStatus: '积分状态',
        manualTag: '手工标签'
      };
      
      const valueMap = {
        // 业务信息
        option1: '选项1',
        option2: '选项2',
        // 风险信息
        low: '低风险',
        medium: '中风险',
        high: '高风险',
        // 征信信息
        good: '良好',
        normal: '一般',
        bad: '较差',
        // 服务信息
        vip: 'VIP服务',
        // 积分状态
        high: '高积分',
        medium: '中等积分',
        low: '低积分',
        // manualTag
        tag1: '手工标签1',
        tag2: '手工标签2'
      };
      
      return `${labelMap[key]}: ${valueMap[value] || value}`;
    },
    
    // 移除主标签
    removeMainTag(tag) {
      const index = this.selectedMainTags.indexOf(tag);
      if (index > -1) {
        this.selectedMainTags.splice(index, 1);
      }
    },
    
    // 移除第二行标签
    removeSecondRowTag(tag) {
      const index = this.selectedSecondRowTags.indexOf(tag);
      if (index > -1) {
        this.selectedSecondRowTags.splice(index, 1);
      }
    },
    
    // 移除分类标签
    removeCategoryTag(categoryKey) {
      this.selectedCategoryTags[categoryKey] = undefined;
      this.$forceUpdate(); // 强制更新视图
    },
    
    // 清除单个筛选项
    clearFilterItem(key) {
      this.filterForm[key] = undefined;
    },
    
    // 应用筛选条件（保存）
    applyFilters() {
      this.appliedFilters = {
        mainTags: [...this.selectedMainTags],
        secondRowTags: [...this.selectedSecondRowTags],
        categoryTags: { ...this.selectedCategoryTags },
        otherFilters: { ...this.filterForm }
      };
      
      message.success('筛选条件已应用');
      this.pagination.currentPage = 1;
    },
    
    // 清除所有筛选条件
    clearAllFilters() {
      this.selectedMainTags = [];
      this.selectedSecondRowTags = [];
      this.selectedCategoryTags = {};
      this.filterForm = {
        businessInfo: undefined,
        riskInfo: undefined,
        creditInfo: undefined,
        serviceInfo: undefined,
        pointStatus: undefined,
        manualTag: undefined
      };
      this.appliedFilters = {
        mainTags: [],
        secondRowTags: [],
        categoryTags: {},
        otherFilters: {}
      };
      
      message.success('筛选条件已清除');
      this.pagination.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.customer-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
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
  flex: 0 0 580px;
}

.customer-header {
  margin-bottom: 16px;
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

.customer-info {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-left: 4px solid #3498db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: #666;
  margin-right: 8px;
  min-width: 70px;
}

.info-value {
  color: #333;
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

  


/* 右侧操作按钮 */
.card-right {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.button-row {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  transition: all 0.3s;
  font-size: 14px;
  color: #333;
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #f0f8ff;
}

.btn-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.action-btn span {
  white-space: nowrap;
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

/* ============ 高级筛选面板样式 ============ */
.advanced-filter-section {
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.filter-label {
  min-width: 100px;
  font-weight: 600;
  color: #333;
  padding-top: 4px;
  flex-shrink: 0;
}

.filter-options {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-title {
  font-weight: 500;
  color: #666;
  padding: 4px 0;
  display: flex;
  align-items: center;
}

.category-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #1890ff;
  margin-right: 8px;
  border-radius: 2px;
}

.selected-filters {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  min-height: 48px;
}

.filter-group-title {
  color: #666;
  font-weight: 500;
  margin-right: 4px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* Checkbox 组样式 */
:deep(.ant-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

:deep(.ant-checkbox-wrapper) {
  margin: 0;
}

/* Radio 组样式 */
:deep(.ant-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.ant-radio-wrapper) {
  margin: 0;
}

</style>
