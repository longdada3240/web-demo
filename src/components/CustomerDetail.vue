<!-- src/components/CustomerDetail.vue -->
<template>
  <div class="customer-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button type="text" @click="goBack" class="back-btn">
          <template #icon><arrow-left-outlined /></template>
          返回客户列表
        </a-button>
        <div class="customer-title">
          <h2>{{ customerInfo.name }} 的客户详情</h2>
        <a-space>
            <a-tag
              v-for="tag in customerInfo.mainTags"
              :key="tag.id"
              :color="getTagColor(tag.label)">
              {{ tag.label }}
            </a-tag>
        </a-space>
        </div>
      </div>
    </div>

    <!-- Tab 切换内容 -->
    <a-card :bordered="false" class="detail-card">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <!-- Tab 1: 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <BasicInfo :customer-info="customerInfo" />
        </a-tab-pane>

        <!-- Tab 2: 修改记录 -->
        <a-tab-pane key="modify" tab="修改记录">
          <ModifyRecord :modify-records="modifyRecords" />
        </a-tab-pane>

        <!-- Tab 3: 一键推单 -->
        <a-tab-pane key="push" tab="一键推单">
          <PushOrder 
            :push-records="pushRecords" 
            @push-success="handlePushSuccess"
            @cancel-push="handleCancelPush" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import BasicInfo from './detail/BasicInfo.vue';
import ModifyRecord from './detail/ModifyRecord.vue';
import PushOrder from './detail/PushOrder.vue';

export default {
  name: 'CustomerDetail',
  components: {
    BasicInfo,
    ModifyRecord,
    PushOrder
  },
  data() {
    return {
      activeTab: 'basic',
      customerInfo: {
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
      // 修改记录
      modifyRecords: [
        {
          id: 1,
          time: '2024-10-08 14:30:00',
          operator: '张经理',
          action: '修改了客户信息',
          detail: '更新了联系电话：13800138001 → 13800138002',
          type: 'update'
        },
        {
          id: 2,
          time: '2024-09-20 10:15:00',
          operator: '李经理',
          action: '添加了手工标签',
          detail: '新增标签：手工标签2',
          type: 'update'
        },
        {
          id: 3,
          time: '2024-08-15 16:45:00',
          operator: '王经理',
          action: '修改了管户人',
          detail: '管户人从"李经理"变更为"张经理"',
          type: 'update'
        },
        {
          id: 4,
          time: '2024-01-15 10:30:00',
          operator: '系统',
          action: '创建了客户',
          detail: '客户刘琳琳创建成功',
          type: 'create'
        }
      ],
      // 推单历史记录
      pushRecords: [
        {
          id: 1,
          time: '2024-10-05 14:30:00',
          product: '产品A - 贷款服务',
          amount: '¥50,000',
          channel: '电话',
          status: 'completed',
          operator: '张经理'
        },
        {
          id: 2,
          time: '2024-09-28 10:15:00',
          product: '产品C - 保险服务',
          amount: '¥10,000',
          channel: '微信',
          status: 'pending',
          operator: '李经理'
        },
        {
          id: 3,
          time: '2024-09-15 16:45:00',
          product: '产品B - 理财服务',
          amount: '¥100,000',
          channel: '邮件',
          status: 'rejected',
          operator: '王经理'
        }
      ]
    };
  },
  mounted() {
    // 从路由参数中获取客户ID和默认tab
    const customerId = this.$route.params.id;
    const tab = this.$route.query.tab || 'basic';
    
    this.activeTab = tab;
    
    // 根据ID加载客户信息
    this.loadCustomerInfo(customerId);
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    
    handleTabChange(key) {
      // 更新URL中的tab参数
      this.$router.replace({
        query: { ...this.$route.query, tab: key }
      });
    },
    
    loadCustomerInfo(id) {
      // TODO: 从后端API加载客户信息
      console.log('加载客户信息，ID:', id);
    },
    
    getTagColor(label) {
      if (label.includes('VIP') || label.includes('大行')) return 'red';
      if (label.includes('重要') || label.includes('大')) return 'orange';
      if (label.includes('新')) return 'green';
      if (label.includes('企业')) return 'blue';
      return 'default';
    },
    
    // 处理推单成功事件
    handlePushSuccess(newRecord) {
      this.pushRecords.unshift(newRecord);
    },
    
    // 处理取消推单事件
    handleCancelPush(recordId) {
      const index = this.pushRecords.findIndex(r => r.id === recordId);
      if (index > -1) {
        this.pushRecords.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.customer-detail {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-btn {
  width: fit-content;
  padding: 0;
  color: #1890ff;
}

.customer-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.customer-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.detail-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
