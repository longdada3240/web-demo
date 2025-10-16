<!-- src/components/detail/BasicInfo.vue -->
<template>
  <div class="tab-content">
    <h3>客户基本信息</h3>
    <a-descriptions bordered :column="2">
      <a-descriptions-item label="客户ID">
        {{ customerInfo.id }}
      </a-descriptions-item>
      <a-descriptions-item label="客户姓名">
        {{ customerInfo.name }}
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{ customerInfo.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="身份证号">
        {{ customerInfo.idCard }}
      </a-descriptions-item>
      <a-descriptions-item label="管户人">
        {{ customerInfo.manager }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ customerInfo.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="主标签" :span="2">
        <a-space wrap>
          <a-tag
            v-for="tag in customerInfo.leftTags"
            :key="tag.id"
            :color="tag.color">
            {{ tag.label }}
          </a-tag>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="手工标签" :span="2">
        <a-space wrap>
          <a-tag
            v-for="tag in customerInfo.rightTags"
            :key="tag.id"
            :color="tag.color">
            {{ tag.label }}
          </a-tag>
        </a-space>
      </a-descriptions-item>
    </a-descriptions>

    <!-- 额外信息 -->
    <div class="extra-info">
      <h3>其他信息</h3>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="客户统计" size="small">
            <p>购买次数：<strong>5次</strong></p>
            <p>消费总额：<strong>¥12,580</strong></p>
            <p>最近购买：<strong>2024-10-01</strong></p>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="联系记录" size="small">
            <p>联系次数：<strong>8次</strong></p>
            <p>最近联系：<strong>2024-10-08</strong></p>
            <p>联系方式：<strong>电话、微信</strong></p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicInfo',
  props: {
    customerInfo: {
      type: Object,
      required: true
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

.extra-info {
  margin-top: 30px;
}

.extra-info p {
  margin: 8px 0;
  color: #666;
}

.extra-info strong {
  color: #333;
  font-weight: 600;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 600;
  background-color: #fafafa;
}
</style>

