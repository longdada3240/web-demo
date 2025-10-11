<!-- src/components/Test.vue -->
<template>
  <div>
    <!-- 遍历客户数据 -->
    <div v-for="customer in customerData" :key="customer.id" class="customer-section">
      <!-- 客户行的大标签 -->
      <div class="tag-group">
        <span class="tag-group__title">{{ customer.name }}</span>
        <el-tag 
          size="medium"
          v-for="tag in customer.mainTags"
          :key="tag.id"
          :color="tag.color"
          effect="dark">
          {{ tag.label }}
        </el-tag>
      </div>
      
      <!-- 客户行下的小标签区域 -->
      <div class="tag-group">
        <!-- <span class="tag-group__title"></span> -->
        <!-- 左边的小标签 -->
        <el-tag 
          v-for="(tag, index) in customer.leftTags"
          v-if="index < 3 || customer.leftTagsExpanded"
          :key="tag.id"
          size="mini"
          :color="tag.color"
          effect="plain">
          {{ tag.label }}
        </el-tag>
        
        <!-- 左边标签的展开按钮 -->
        <el-button 
          v-if="customer.leftTags.length > 3"
          size="mini"
          type="text"
          class="expand-btn"
          @click="toggleLeftTags(customer.id)">
          {{ customer.leftTagsExpanded ? '收起' : `+${customer.leftTags.length - 3}` }}
        </el-button>
        
        <!-- 分隔符 -->
        <span class="separator">|</span>
        
        <!-- 右边的手工标签 -->
        <el-tag 
          v-for="(tag, index) in customer.rightTags"
          v-if="index < 3 || customer.rightTagsExpanded"
          :key="tag.id"
          size="mini"
          :color="tag.color"
          effect="plain">
          {{ tag.label }}
        </el-tag>
        
        <!-- 右边标签的展开按钮 -->
        <el-button 
          v-if="customer.rightTags.length > 3"
          size="mini"
          type="text"
          class="expand-btn"
          @click="toggleRightTags(customer.id)">
          {{ customer.rightTagsExpanded ? '收起' : `+${customer.rightTags.length - 3}` }}
        </el-button>
      </div>
      
      <!-- 客户信息区域 -->
      <div class="customer-info">
        <div class="info-item">
          <span class="info-label">身份证：{{ customer.idCard }}</span>
      
        </div>
        <div class="info-item">
          <span class="info-label">电话号码：{{ customer.phone }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">客户管户人：{{ customer.manager }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      // 模拟接口数据
      customerData: [
        {
          id: 1,
          name: '客户一1233是',
          idCard: '110101199001011234',
          phone: '13800138001',
          manager: '张经理',
          mainTags: [
            { id: 1, label: 'VIP客户', color: '#f56c6c' },
            { id: 2, label: '重要客户', color: '#e6a23c' }
          ],
          leftTags: [
            { id: 1, label: '标签一', color: '#409eff' },
            { id: 2, label: '标签二', color: '#67c23a' },
            { id: 4, label: '标签四', color: '#67c23a' },
            { id: 3, label: '标签三', color: '#e6a23c' }
          ],
          rightTags: [
            { id: 1, label: '手工标签1', color: '#f56c6c' },
            { id: 2, label: '手工标签2', color: '#909399' }
          ],
          leftTagsExpanded: false,
          rightTagsExpanded: false
        },
        {
          id: 2,
          name: '客户二',
          idCard: '110101199002021234',
          phone: '13800138002',
          manager: '李经理',
          mainTags: [
            { id: 3, label: '普通客户', color: '#909399' },
            { id: 4, label: '新客户', color: '#67c23a' }
          ],
          leftTags: [
            { id: 4, label: '标签四', color: '#409eff' },
            { id: 5, label: '标签五', color: '#e6a23c' }
          ],
          rightTags: [
            { id: 3, label: '手工标签3', color: '#f56c6c' },
            { id: 4, label: '手工标签4', color: '#67c23a' },
            { id: 5, label: '手工标签5', color: '#409eff' }
          ],
          leftTagsExpanded: false,
          rightTagsExpanded: false
        },
        {
          id: 3,
          name: '客户三',
          idCard: '110101199003031234',
          phone: '13800138003',
          manager: '王经理',
          mainTags: [
            { id: 5, label: '企业客户', color: '#409eff' }
          ],
          leftTags: [
            { id: 6, label: '标签六', color: '#f56c6c' },
            { id: 7, label: '标签七', color: '#67c23a' },
            { id: 8, label: '标签八', color: '#e6a23c' },
            { id: 9, label: '标签九', color: '#909399' },
            { id: 10, label: '标签十', color: '#f56c6c' }
          ],
          rightTags: [
            { id: 6, label: '手工标签6', color: '#e6a23c' },
            { id: 7, label: '手工标签7', color: '#67c23a' },
            { id: 8, label: '手工标签8', color: '#409eff' },
            { id: 9, label: '手工标签9', color: '#f56c6c' }
          ],
          leftTagsExpanded: false,
          rightTagsExpanded: false
        }
      ]
    };
  },
  mounted() {
    // 模拟从接口获取数据
    this.fetchCustomerData();
  },
  methods: {
    // 模拟接口调用
    async fetchCustomerData() {
      try {
        // 这里可以替换为真实的API调用
        // const response = await this.$http.get('/api/customers');
        // this.customerData = response.data;
        
        console.log('客户数据加载完成:', this.customerData);
        this.processCustomerData();
      } catch (error) {
        console.error('获取客户数据失败:', error);
      }
    },
    
    // 处理客户数据
    processCustomerData() {
      this.customerData.forEach(customer => {
        console.log(`处理客户: ${customer.name}`);
        console.log('大标签:', customer.mainTags);
        console.log('左边小标签:', customer.leftTags);
        console.log('右边手工标签:', customer.rightTags);
      });
    },
    
    // 添加新标签的方法
    addTag(customerId, tagType, tagData) {
      const customer = this.customerData.find(c => c.id === customerId);
      if (customer) {
        const newTag = {
          id: Date.now(), // 简单的ID生成
          ...tagData
        };
        
        if (tagType === 'main') {
          customer.mainTags.push(newTag);
        } else if (tagType === 'left') {
          customer.leftTags.push(newTag);
        } else if (tagType === 'right') {
          customer.rightTags.push(newTag);
        }
      }
    },
    
    // 删除标签的方法
    removeTag(customerId, tagType, tagId) {
      const customer = this.customerData.find(c => c.id === customerId);
      if (customer) {
        if (tagType === 'main') {
          customer.mainTags = customer.mainTags.filter(tag => tag.id !== tagId);
        } else if (tagType === 'left') {
          customer.leftTags = customer.leftTags.filter(tag => tag.id !== tagId);
        } else if (tagType === 'right') {
          customer.rightTags = customer.rightTags.filter(tag => tag.id !== tagId);
        }
      }
    },
    
    // 切换左边标签的展开状态
    toggleLeftTags(customerId) {
      const customer = this.customerData.find(c => c.id === customerId);
      if (customer) {
        customer.leftTagsExpanded = !customer.leftTagsExpanded;
        console.log(`客户${customer.name}的左边标签${customer.leftTagsExpanded ? '展开' : '收起'}`);
      }
    },
    
    // 切换右边标签的展开状态
    toggleRightTags(customerId) {
      const customer = this.customerData.find(c => c.id === customerId);
      if (customer) {
        customer.rightTagsExpanded = !customer.rightTagsExpanded;
        console.log(`客户${customer.name}的右边标签${customer.rightTagsExpanded ? '展开' : '收起'}`);
      }
    }
  }
};
</script>

<style scoped>
.customer-section {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.customer-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.tag-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.tag-group__title {
  font-weight: 600;
  margin-right: 16px;
  min-width: 80px;
  color: #2c3e50;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.separator {
  margin: 0 16px;
  color: #bdc3c7;
  font-weight: 600;
  font-size: 16px;
}

.el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.expand-btn {
  margin-left: 8px;
  margin-right: 8px;
  padding: 4px 12px;
  font-size: 12px;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 12px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.expand-btn:hover {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
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

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
}

.info-label {
  font-weight: 600;
  color: #7f8c8d;
  min-width: 80px;
  margin-right: 8px;
  font-size: 14px;
}

.info-value {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tag-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tag-group__title {
    margin-bottom: 5px;
  }
  
  .separator {
    margin: 10px 0;
  }
  
  .customer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-item {
    width: 100%;
  }
}
</style>