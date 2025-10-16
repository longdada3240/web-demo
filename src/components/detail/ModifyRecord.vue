<!-- src/components/detail/ModifyRecord.vue -->
<template>
  <div class="tab-content">
    <h3>客户信息修改记录</h3>
    <a-timeline mode="left">
      <a-timeline-item
        v-for="record in modifyRecords"
        :key="record.id"
        :color="record.type === 'create' ? 'green' : 'blue'">
        <template #label>
          {{ record.time }}
        </template>
        <p><strong>{{ record.operator }}</strong></p>
        <p>{{ record.action }}</p>
        <p class="change-detail">{{ record.detail }}</p>
      </a-timeline-item>
    </a-timeline>

    <!-- 如果没有记录 -->
    <a-empty v-if="modifyRecords.length === 0" description="暂无修改记录" />
  </div>
</template>

<script>
export default {
  name: 'ModifyRecord',
  props: {
    modifyRecords: {
      type: Array,
      default: () => []
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

.change-detail {
  color: #666;
  font-size: 13px;
  margin-top: 4px;
}

:deep(.ant-timeline-item-label) {
  width: 150px;
  color: #666;
}
</style>

