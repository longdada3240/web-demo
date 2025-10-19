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
        <a-button @click="showAdvancedFilter = !showAdvancedFilter" class="filter-btn">
          <img 
            :src="showAdvancedFilter ? require('@/images/icon_排序.png') : require('@/images/标签筛选.png')" 
            :alt="showAdvancedFilter ? '排序' : '标签筛选'" 
            class="btn-icon-img" />
          <span>{{ showAdvancedFilter ? '收起标签' : '标签筛选' }}</span>
        </a-button>
        
        <a-button @click="openSavedFilters" class="filter-btn">
          <template #icon><folder-open-outlined /></template>
          <span>已存标签</span>
        </a-button>
        
        <!-- 视图切换 -->
        <div class="view-switch">
          <span class="view-label">视图:</span>
          <a-radio-group v-model:value="viewType" button-style="solid" size="small">
            <a-radio-button value="card" class="view-btn">
              <img src="@/images/卡片.png" alt="卡片" class="btn-icon-img" />
              <span>卡片</span>
            </a-radio-button>
            <a-radio-button value="list" class="view-btn">
              <img src="@/images/列表.png" alt="列表" class="btn-icon-img" />
              <span>列表</span>
            </a-radio-button>
          </a-radio-group>
        </div>
      </a-space>
    </a-card>

    <!-- 高级筛选面板 -->
    <a-card v-if="showAdvancedFilter" class="advanced-filter-section" :bordered="true">
      <div class="filter-container">
        <!-- 动态标签筛选行 -->
        <div 
          v-for="(filterRow, index) in tagFilterRows" 
          :key="filterRow.key"
          class="filter-row">
          <div class="filter-label">{{ filterRow.label }}:</div>
          <div class="filter-options">
            <a-checkbox-group 
              v-model:value="selectedTags[filterRow.key]" 
              @change="handleTagChange(filterRow.key)">
              <a-checkbox
                v-for="tag in filterRow.options"
                :key="tag.value"
                :value="tag.value">
                {{ tag.label }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- 第四行 - 多个下拉选择（动态筛选） -->
        <div class="filter-row">
          <div class="filter-label">更多筛选:</div>
          <div class="filter-options">
            <a-space wrap>
              <a-select 
                v-for="filter in dynamicFilterOptions" 
                :key="filter.key"
                v-model:value="filterForm[filter.key]" 
                :placeholder="filter.placeholder" 
                mode="multiple"
                :max-tag-count="0"
                :max-tag-placeholder="getSelectPlaceholder(filter)"
                style="width: 150px" 
                allowClear>
                <a-select-option 
                  v-for="option in filter.options" 
                  :key="option.value" 
                  :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-space>
          </div>
        </div>

        <!-- 已选筛选条件 -->
        <div class="filter-row">
          <div class="filter-label">已选筛选条件:</div>
          <div class="selected-filters">
            <!-- 动态标签 -->
            <template v-for="(filterRow, rowIndex) in tagFilterRows">
              <span 
                v-if="selectedTags[filterRow.key] && selectedTags[filterRow.key].length > 0"
                :key="'title-' + filterRow.key"
                class="filter-group-title">{{ filterRow.label }}:</span>
              <a-tag
                v-for="tagValue in selectedTags[filterRow.key]"
                v-if="selectedTags[filterRow.key] && selectedTags[filterRow.key].length > 0"
                :key="filterRow.key + '-' + tagValue"
                closable
                @close="removeTag(filterRow.key, tagValue)"
                :color="getTagColor(rowIndex)">
                {{ getTagLabel(filterRow.key, tagValue) }}
              </a-tag>
            </template>

            <!-- 其他筛选条件 -->
            <template v-for="(value, key) in filterForm">
              <a-tag
                v-if="value && value.length > 0"
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
            <a-button type="primary" @click="showSaveTemplateModal">
              保存模板
            </a-button>
            <a-button @click="applyFilters">
              应用筛选
            </a-button>
            <a-button @click="clearAllFilters">
              清除
            </a-button>
          </a-space>
        </div>
      </div>
    </a-card>

    <!-- 保存/编辑模板对话框 -->
    <a-modal
      v-model:visible="saveTemplateModalVisible"
      :title="templateMode === 'edit' ? '编辑模板名称' : '保存筛选模板'"
      @ok="saveFilterTemplate"
      @cancel="cancelTemplateModal">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="模板名称">
          <a-input
            v-model:value="templateName"
            placeholder="请输入模板名称"
            @pressEnter="saveFilterTemplate" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 已存标签抽屉 -->
    <a-drawer
      :visible="showSavedFilters"
      title="已存模板"
      placement="right"
      width="500"
      @close="showSavedFilters = false">
      <div class="saved-templates-list">
        <div
          v-for="template in savedTemplates"
          :key="template.id"
          class="template-item">
          <div class="template-header">
            <span class="template-title">{{ template.name }}</span>
            <span class="template-time">{{ template.createTime }}</span>
          </div>
          
          <div class="template-filters">
            <!-- 显示标签筛选条件 -->
            <template v-for="(filterRow, rowIndex) in tagFilterRows">
              <div 
                v-if="template.filters.tags[filterRow.key] && template.filters.tags[filterRow.key].length > 0"
                :key="filterRow.key"
                class="filter-group">
                <span class="filter-label-inline">{{ filterRow.label }}：</span>
                <a-tag
                  v-for="tagValue in template.filters.tags[filterRow.key]"
                  :key="tagValue"
                  :color="getTagColor(rowIndex)"
                  size="small">
                  {{ getTagLabel(filterRow.key, tagValue) }}
                </a-tag>
              </div>
            </template>

            <!-- 显示其他筛选条件 -->
            <div 
              v-for="(value, key) in template.filters.otherFilters"
              v-if="value && ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value))"
              :key="key"
              class="filter-group">
              <a-tag color="purple" size="small">
                {{ getFilterLabel(key, value) }}
              </a-tag>
            </div>
          </div>

          <div class="template-actions">
            <a-button size="small" type="primary" @click="loadTemplate(template)">
              加载
            </a-button>
            <a-button size="small" @click="editTemplate(template)">
              编辑
            </a-button>
            <a-button size="small" danger @click="deleteTemplate(template.id)">
              删除
            </a-button>
          </div>
        </div>

        <a-empty v-if="savedTemplates&&savedTemplates.length === 0" description="暂无保存的模板" />
      </div>
    </a-drawer>

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
            <!-- 客户信息区域（左侧+中间） -->
            <CustomerCardInfo :customer="customer" />

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
                    <span>跟进</span>
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
import CustomerCardInfo from './CustomerCardInfo.vue';

export default {
  name: 'CustomerList',
  components: {
    CustomerCardInfo
  },
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
      // 动态标签筛选行配置
      tagFilterRows: [
        {
          key: 'mainTags',
          label: '主标签',
          options: [
            { label: 'VIP客户', value: 'vip' },
            { label: '重要客户', value: 'important' },
            { label: '手机银行', value: 'mobile_bank' },
            { label: '企业客户', value: 'enterprise' }
          ]
        },
        {
          key: 'secondTags',
          label: '次标签',
          options: [
            { label: '高价值客户', value: 'high_value' },
            { label: '活跃客户', value: 'active' },
            { label: '潜力客户', value: 'potential' },
            { label: '长期客户', value: 'long_term' }
          ]
        },
        {
          key: 'businessTags',
          label: '业务标签',
          options: [
            { label: '贷款客户', value: 'loan' },
            { label: '理财客户', value: 'wealth' },
            { label: '信用卡客户', value: 'credit_card' },
            { label: '存款客户', value: 'deposit' }
          ]
        }
      ],
      // 选中的标签（统一管理）
      selectedTags: {
        mainTags: [],
        secondTags: [],
        businessTags: []
      },

      // 动态筛选选项配置
      dynamicFilterOptions: [
        {
          key: 'businessInfo',
          placeholder: '业务信息',
          options: [
            { value: 'option1', label: '选项1' },
            { value: 'option2', label: '选项2' },
            { value: 'option3', label: '选项3' }
          ]
        },
        {
          key: 'riskInfo',
          placeholder: '风险信息',
          options: [
            { value: 'low', label: '低风险' },
            { value: 'medium', label: '中风险' },
            { value: 'high', label: '高风险' }
          ]
        },
        {
          key: 'creditInfo',
          placeholder: '征信信息',
          options: [
            { value: 'good', label: '良好' },
            { value: 'normal', label: '一般' },
            { value: 'bad', label: '较差' }
          ]
        },
        {
          key: 'serviceInfo',
          placeholder: '服务信息',
          options: [
            { value: 'vip', label: 'VIP服务' },
            { value: 'normal', label: '普通服务' },
            { value: 'basic', label: '基础服务' }
          ]
        },
        {
          key: 'pointStatus',
          placeholder: '积分状态',
          options: [
            { value: 'high', label: '高积分' },
            { value: 'medium', label: '中等积分' },
            { value: 'low', label: '低积分' }
          ]
        },
        {
          key: 'manualTag',
          placeholder: '手工标签',
          options: [
            { value: 'tag1', label: '手工标签1' },
            { value: 'tag2', label: '手工标签2' },
            { value: 'tag3', label: '手工标签3' }
          ]
        },
        {
          key: 'customerLevel',
          placeholder: '客户等级',
          options: [
            { value: 'diamond', label: '钻石客户' },
            { value: 'gold', label: '黄金客户' },
            { value: 'silver', label: '白银客户' },
            { value: 'bronze', label: '青铜客户' }
          ]
        },
        {
          key: 'loanStatus',
          placeholder: '贷款状态',
          options: [
            { value: 'approved', label: '已批准' },
            { value: 'pending', label: '审批中' },
            { value: 'rejected', label: '已拒绝' },
            { value: 'completed', label: '已完成' }
          ]
        }
      ],
      // 其他筛选条件（在data中直接初始化，确保响应性）
      filterForm: {
        businessInfo: [],
        riskInfo: [],
        creditInfo: [],
        serviceInfo: [],
        pointStatus: [],
        manualTag: [],
        customerLevel: [],
        loanStatus: []
      },
      // 应用的筛选条件（保存后的）
      appliedFilters: {
        tags: {},
        otherFilters: {}
      },
      // 保存模板相关
      saveTemplateModalVisible: false,
      templateName: '',
      templateMode: 'save', // 'save' 或 'edit'
      editingTemplateId: null, // 正在编辑的模板ID
      showSavedFilters: false,
      savedTemplates: [],
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
          addrss2: '重庆市江北区鱼嘴镇拓兴时代192号附2号A区A幢18-2',
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
          addrss1: '重庆市江北区鱼嘴镇拓兴时代192号附2号A区A幢18-9',
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
          addrss1: '重庆市江北区鱼嘴镇拓兴时代192号附2号A区A幢18-9',
          addrss2: '重庆市江北区鱼嘴镇拓兴时代192号附2号A区A幢18-2',
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
      const hasTagSelected = Object.values(this.selectedTags).some(tags => tags && tags.length > 0);
      const hasFilterSelected = Object.values(this.filterForm).some(v => Array.isArray(v) && v.length > 0);
      return hasTagSelected || hasFilterSelected;
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
    
    // 标签变化统一处理
    handleTagChange(filterKey) {
      console.log(`${filterKey} 标签选择:`, this.selectedTags[filterKey]);
    },
    
    // 获取标签的显示文本（统一方法）
    getTagLabel(filterKey, tagValue) {
      const filterRow = this.tagFilterRows.find(row => row.key === filterKey);
      if (filterRow) {
        const option = filterRow.options.find(opt => opt.value === tagValue);
        return option ? option.label : tagValue;
      }
      return tagValue;
    },
    
    // 获取标签颜色（根据行索引）
    getTagColor(rowIndex) {
      const colors = ['blue', 'green', 'orange', 'cyan', 'purple', 'geekblue'];
      return colors[rowIndex % colors.length];
    },
    
    // 移除单个标签
    removeTag(filterKey, tagValue) {
      const tags = this.selectedTags[filterKey];
      if (tags) {
        const index = tags.indexOf(tagValue);
        if (index > -1) {
          tags.splice(index, 1);
        }
      }
    },
    
    // 获取下拉框的自定义显示文本（带数量）
    getSelectPlaceholder(filter) {
      // 直接从 filterForm 获取当前选中的值
      const selectedValues = this.filterForm[filter.key] || [];
      const count = Array.isArray(selectedValues) ? selectedValues.length : 0;
      
      if (count === 0) {
        return filter.placeholder;
      }
      
      // 使用圆圈数字Unicode字符
      const circleNumbers = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
      const countStr = count <= 10 ? circleNumbers[count] : `(${count})`;
      
      return `${filter.placeholder}${countStr}`;
    },
    
    // 获取其他筛选条件的显示文本（动态）
    getFilterLabel(key, value) {
      // 从动态配置中查找
      const filterConfig = this.dynamicFilterOptions.find(f => f.key === key);
      if (filterConfig) {
        const label = filterConfig.placeholder;
        
        // 如果是数组，处理多个值
        if (Array.isArray(value)) {
          const valueLabels = value.map(v => {
            const option = filterConfig.options.find(o => o.value === v);
            return option ? option.label : v;
          }).join('、');
          return `${label}: ${valueLabels}`;
        } else {
          // 单个值
          const option = filterConfig.options.find(o => o.value === value);
          const valueLabel = option ? option.label : value;
          return `${label}: ${valueLabel}`;
        }
      }
      
      return `${key}: ${value}`;
    },
    
    // 清除单个筛选项
    clearFilterItem(key) {
      this.filterForm[key] = [];
    },
    
    // 应用筛选条件（保存）
    applyFilters() {
      console.log('应用筛选条件:', this.selectedTags);
      this.appliedFilters = {
        tags: JSON.parse(JSON.stringify(this.selectedTags)), // 深拷贝
        otherFilters: { ...this.filterForm }
      };
      
      message.success('筛选条件已应用');
      this.pagination.currentPage = 1;
    },
    
    // 清除所有筛选条件
    clearAllFilters() {
      // 清空所有标签选择
      this.tagFilterRows.forEach(row => {
        this.selectedTags[row.key] = [];
      });
      
      // 动态清空所有筛选条件（设置为空数组）
      this.dynamicFilterOptions.forEach(filter => {
        this.filterForm[filter.key] = [];
      });

      message.success('筛选条件已清除');
    },
    
    // ============ 模板管理相关方法 ============
    
    // 打开已存标签抽屉
    openSavedFilters() {
      this.showSavedFilters = true;
    },
    
    // 显示保存模板对话框
    showSaveTemplateModal() {
      if (!this.hasSelectedFilters) {
        message.warning('请先选择筛选条件');
        return;
      }
      this.templateMode = 'save';
      this.templateName = '';
      this.editingTemplateId = null;
      this.saveTemplateModalVisible = true;
    },
    
    // 保存或编辑筛选模板
    saveFilterTemplate() {
      if (!this.templateName.trim()) {
        message.warning('请输入模板名称');
        return;
      }
      
      if (this.templateMode === 'edit') {
        // 编辑模式：只修改模板名称
        const template = this.savedTemplates.find(t => t.id === this.editingTemplateId);
        if (template) {
          template.name = this.templateName;
          message.success('模板名称已更新');
        }
      } else {
        // 保存模式：创建新模板
        const template = {
          id: Date.now(),
          name: this.templateName,
          createTime: new Date().toLocaleString('zh-CN'),
          filters: {
            tags: JSON.parse(JSON.stringify(this.selectedTags)),
            otherFilters: JSON.parse(JSON.stringify(this.filterForm))
          }
        };
        this.savedTemplates.push(template);
        message.success('模板保存成功');
      }
      
      this.saveTemplateModalVisible = false;
      this.templateName = '';
      this.editingTemplateId = null;
    },
    
    // 取消模板对话框
    cancelTemplateModal() {
      this.saveTemplateModalVisible = false;
      this.templateName = '';
      this.templateMode = 'save';
      this.editingTemplateId = null;
    },
    
    // 加载模板
    loadTemplate(template) {
      this.selectedTags = JSON.parse(JSON.stringify(template.filters.tags));
      this.filterForm = JSON.parse(JSON.stringify(template.filters.otherFilters));
      
      // 确保所有 filterForm 的值都是数组
      this.dynamicFilterOptions.forEach(filter => {
        if (!Array.isArray(this.filterForm[filter.key])) {
          this.filterForm[filter.key] = [];
        }
      });
      
      this.showSavedFilters = false;
      message.success(`已加载模板: ${template.name}`);
    },
    
    // 编辑模板
    editTemplate(template) {
      this.templateMode = 'edit';
      this.editingTemplateId = template.id;
      this.templateName = template.name;
      this.saveTemplateModalVisible = true;
      this.showSavedFilters = false
    },
    
    // 删除模板
    deleteTemplate(templateId) {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除此模板吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = this.savedTemplates.findIndex(t => t.id === templateId);
          if (index > -1) {
            this.savedTemplates.splice(index, 1);
            message.success('删除成功');
          }
        }
      });
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

/* 筛选按钮和视图切换按钮的图标样式 */
.filter-btn,
.view-btn {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
}

.btn-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
}

:deep(.view-btn) {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
}

:deep(.ant-radio-button-wrapper span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
  padding: 12px 0;
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

.selected-filters {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  /* background: #f5f5f5; */
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

/* ============ 已存标签抽屉样式 ============ */
.saved-templates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s;
}

.template-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.template-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.template-time {
  font-size: 12px;
  color: #999;
}

.template-filters {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label-inline {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.template-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

</style>
