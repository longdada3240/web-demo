<!-- src/components/CustomerCardInfo.vue -->
<template>
  <div class="customer-card-info">
    <!-- 第一行：客户名称 + 主标签 -->
    <div class="info-row row-1">
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

    <!-- 第二行：leftTags | rightTags -->
    <div class="info-row row-2">
      <div class="tags-container">
        <!-- 左侧标签 -->
        <div class="left-tags">
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

        <!-- 分隔符 -->
        <div class="divider" v-if="customer.rightTags.length > 0">|</div>

        <!-- 右侧标签 -->
        <div class="right-tags" v-if="customer.rightTags.length > 0">
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

    <!-- 第三行：客户信息 -->
    <div class="info-row row-3">
      <div class="customer-info">
        <span class="info-label">身份证：{{ customer.idCard }}</span>
        <span class="info-label">电话号码：{{ customer.phone }}</span>
        <span class="info-label">客户管户人：{{ customer.manager }}</span>
         <span class="info-label">办公地址：{{ customer.addrss1 }}</span>
         <span class="info-label">常住地址：{{ customer.addrss2 }}</span>
      </div>
    </div>

    <!-- 第四行：底部信息栏 -->
    <div class="info-row row-4">
      <div class="card-footer">
        <a-tag color="red">基本信息</a-tag>
        <a-tag color="orange">销售列表</a-tag>
        <a-tag color="green">申请记录</a-tag>
        <a-tag color="blue">360画像</a-tag>
        <a-tag color="purple">服务记录</a-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerCardInfo',
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  methods: {
    getTagColor(label) {
      if (label.includes('VIP') || label.includes('大行')) return 'red';
      if (label.includes('重要') || label.includes('大')) return 'orange';
      if (label.includes('新')) return 'green';
      if (label.includes('企业')) return 'blue';
      return 'default';
    }
  }
};
</script>

<style scoped>
.customer-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 每一行的通用样式 */
.info-row {
  display: flex;
  align-items: center;
}

/* 第一行：客户名称 + 主标签 */
.row-1 {
  gap: 16px;
}

.customer-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.main-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* 第二行：标签 | 标签 */
.row-2 {
  width: 100%;
}

.tags-container {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.left-tags,
.right-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.left-tags {
  flex: 1;
}

.divider {
  font-size: 16px;
  color: #d9d9d9;
  font-weight: 300;
  padding: 0 8px;
}

/* 第三行：客户信息 */
.row-3 {
  width: 100%;
}

.customer-info {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-left: 4px solid #3498db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.info-label {
  color: #666;
  font-size: 14px;
}

/* 第四行：底部信息栏 */
.row-4 {
  width: 100%;
}

.card-footer {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

