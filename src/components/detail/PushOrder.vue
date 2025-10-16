<!-- src/components/detail/PushOrder.vue -->
<template>
  <div class="tab-content">
    <h3>一键推单</h3>
    
    <!-- 推单表单 -->
    <a-form
      :model="pushForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }">
      <a-form-item label="推单产品">
        <a-select v-model:value="pushForm.product" placeholder="请选择产品">
          <a-select-option value="product1">产品A - 贷款服务</a-select-option>
          <a-select-option value="product2">产品B - 理财服务</a-select-option>
          <a-select-option value="product3">产品C - 保险服务</a-select-option>
          <a-select-option value="product4">产品D - 信用卡服务</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="推单金额">
        <a-input-number
          v-model:value="pushForm.amount"
          :min="0"
          :step="1000"
          style="width: 100%"
          placeholder="请输入金额">
          <template #addonAfter>元</template>
        </a-input-number>
      </a-form-item>

      <a-form-item label="推单渠道">
        <a-radio-group v-model:value="pushForm.channel">
          <a-radio value="phone">电话</a-radio>
          <a-radio value="wechat">微信</a-radio>
          <a-radio value="email">邮件</a-radio>
          <a-radio value="sms">短信</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="推单说明">
        <a-textarea
          v-model:value="pushForm.remark"
          :rows="4"
          placeholder="请输入推单说明"
          :maxlength="500"
          show-count />
      </a-form-item>

      <a-form-item label="预计跟进时间">
        <a-date-picker
          v-model:value="pushForm.followTime"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择跟进时间"
          style="width: 100%" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-space>
          <a-button type="primary" @click="handlePush" :loading="pushLoading">
            <template #icon><send-outlined /></template>
            立即推单
          </a-button>
          <a-button @click="resetPushForm">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <!-- 历史推单记录 -->
    <a-divider />
    <h3>历史推单记录</h3>
    <a-table
      :columns="pushColumns"
      :data-source="pushRecords"
      :pagination="{ pageSize: 5 }"
      row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewPushDetail(record)">
              查看
            </a-button>
            <a-button
              type="link"
              size="small"
              v-if="record.status === 'pending'"
              @click="cancelPush(record)">
              取消
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';

export default {
  name: 'PushOrder',
  props: {
    pushRecords: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pushLoading: false,
      pushForm: {
        product: undefined,
        amount: undefined,
        channel: 'phone',
        remark: '',
        followTime: undefined
      },
      pushColumns: [
        { title: '推单时间', dataIndex: 'time', key: 'time', width: 160 },
        { title: '产品名称', dataIndex: 'product', key: 'product', width: 150 },
        { title: '推单金额', dataIndex: 'amount', key: 'amount', width: 120 },
        { title: '推单渠道', dataIndex: 'channel', key: 'channel', width: 100 },
        { title: '状态', key: 'status', width: 100 },
        { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
        { title: '操作', key: 'action', width: 150, fixed: 'right' }
      ]
    };
  },
  methods: {
    handlePush() {
      if (!this.pushForm.product) {
        message.warning('请选择推单产品');
        return;
      }
      if (!this.pushForm.amount) {
        message.warning('请输入推单金额');
        return;
      }
      
      this.pushLoading = true;
      
      // 模拟API调用
      setTimeout(() => {
        this.pushLoading = false;
        message.success('推单成功！');
        
        // 添加到推单记录
        const newRecord = {
          id: Date.now(),
          time: new Date().toLocaleString('zh-CN'),
          product: this.getProductName(this.pushForm.product),
          amount: `¥${this.pushForm.amount.toLocaleString()}`,
          channel: this.getChannelName(this.pushForm.channel),
          status: 'pending',
          operator: '当前用户'
        };
        
        // 通知父组件添加新记录
        this.$emit('push-success', newRecord);
        
        // 重置表单
        this.resetPushForm();
      }, 1000);
    },
    
    resetPushForm() {
      this.pushForm = {
        product: undefined,
        amount: undefined,
        channel: 'phone',
        remark: '',
        followTime: undefined
      };
    },
    
    getProductName(value) {
      const map = {
        product1: '产品A - 贷款服务',
        product2: '产品B - 理财服务',
        product3: '产品C - 保险服务',
        product4: '产品D - 信用卡服务'
      };
      return map[value] || value;
    },
    
    getChannelName(value) {
      const map = {
        phone: '电话',
        wechat: '微信',
        email: '邮件',
        sms: '短信'
      };
      return map[value] || value;
    },
    
    getStatusColor(status) {
      const colors = {
        pending: 'orange',
        completed: 'green',
        rejected: 'red'
      };
      return colors[status] || 'default';
    },
    
    getStatusText(status) {
      const texts = {
        pending: '进行中',
        completed: '已完成',
        rejected: '已拒绝'
      };
      return texts[status] || status;
    },
    
    viewPushDetail(record) {
      message.info(`查看推单详情：${record.product}`);
    },
    
    cancelPush(record) {
      this.$confirm({
        title: '确认取消',
        content: `确定要取消这条推单记录吗？`,
        onOk: () => {
          // 通知父组件删除记录
          this.$emit('cancel-push', record.id);
          message.success('已取消推单');
        }
      });
    }
  }
};
</script>

<style scoped>
.tab-content {
  padding: 20px;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>

