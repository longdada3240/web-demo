<template>
  <div class="form-example-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>表单示例页面</h2>
      <div class="header-actions">
        <a-space>
          <a-button @click="loadTemporaryData">
            加载暂存数据
          </a-button>
          <a-button type="primary" @click="handleSubmit">
            提交
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 表单内容 -->
    <a-card :bordered="false" class="form-card">
      <a-form-model
        ref="formModel"
        :model="baseData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }">
        
        <!-- 动态表单项 -->
        <a-form-model-item
          v-for="item in formItems"
          :key="item.field"
          :label="item.label"
          :prop="item.field"
          :rules="item.rules">
          
          <!-- 下拉选择框 -->
          <a-select
            v-if="item.type === 'select'"
            show-search
            :placeholder="item.placeholder || '请选择'"
            option-filter-prop="children"
            v-model="baseData[item.field]"
            @change="(value) => handleSelect(value, item)">
            <a-select-option
              v-for="lead in leadData"
              :key="lead.id"
              :value="lead.id">
              {{ lead.leadDesc }}
            </a-select-option>
          </a-select>

          <!-- 文本输入框 -->
          <a-input
            v-else-if="item.type === 'input'"
            v-model="baseData[item.field]"
            :placeholder="item.placeholder || '请输入'" />

          <!-- 文本域 -->
          <a-textarea
            v-else-if="item.type === 'textarea'"
            v-model="baseData[item.field]"
            :placeholder="item.placeholder || '请输入'"
            :rows="4" />

          <!-- 日期选择器 -->
          <a-date-picker
            v-else-if="item.type === 'date'"
            v-model="baseData[item.field]"
            style="width: 100%"
            format="YYYY-MM-DD" />
        </a-form-model-item>

        <!-- 操作按钮 -->
        <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-space>
            <a-button type="primary" @click="handleSubmit">
              提交
            </a-button>
            <a-button @click="handleSaveTemporary">
              暂存
            </a-button>
            <a-button @click="handleReset">
              重置
            </a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import moment from 'moment';

export default {
  name: 'FormExample',
  data() {
    return {
      // 表单数据
      baseData: {
        leadId: undefined,
        name: '',
        description: '',
        date: null
      },
      
      // 下拉选项数据
      leadData: [],
      leadLoading: false,
      
      // 表单项配置
      formItems: [
        {
          field: 'leadId',
          label: '选择项目',
          type: 'select',
          placeholder: '请选择项目',
          rules: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
        },
        {
          field: 'name',
          label: '名称',
          type: 'input',
          placeholder: '请输入名称',
          rules: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        {
          field: 'description',
          label: '描述',
          type: 'textarea',
          placeholder: '请输入描述'
        },
        {
          field: 'date',
          label: '日期',
          type: 'date',
          placeholder: '请选择日期'
        }
      ]
    };
  },
  
  created() {
    // 页面加载时获取下拉数据
    this.loadLeadData();
  },
  
  methods: {
    /**
     * 加载下拉选项数据
     */
    async loadLeadData() {
      this.leadLoading = true;
      try {
        // 模拟API调用
        const response = await this.mockGetLeadData();
        this.leadData = response.data;
        
        console.log('加载下拉数据成功:', this.leadData);
      } catch (error) {
        console.error('加载下拉数据失败:', error);
        message.error('加载数据失败');
      } finally {
        this.leadLoading = false;
      }
    },
    
    /**
     * 加载暂存数据
     */
    async loadTemporaryData() {
      try {
        // 先确保leadData已加载
        if (this.leadData.length === 0) {
          await this.loadLeadData();
        }
        
        // 加载暂存数据
        const tempData = await this.mockGetTemporaryData();
        
        // 处理日期字段
        if (tempData.date) {
          tempData.date = moment(tempData.date);
        }
        
        this.baseData = { ...this.baseData, ...tempData };
        
        message.success('暂存数据加载成功');
        console.log('加载暂存数据:', this.baseData);
      } catch (error) {
        console.error('加载暂存数据失败:', error);
        message.error('加载暂存数据失败');
      }
    },
    
    /**
     * 下拉选择变化
     */
    handleSelect(value, item) {
      console.log('选中:', value, '字段:', item.field);
      
      // 可以根据选择的值做其他操作
      const selectedLead = this.leadData.find(lead => lead.id === value);
      if (selectedLead) {
        console.log('选中的项目详情:', selectedLead);
      }
    },
    
    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.formModel.validate(async valid => {
        if (valid) {
          try {
            // 处理提交数据
            const submitData = { ...this.baseData };
            
            // 转换日期格式
            if (submitData.date && submitData.date.format) {
              submitData.date = submitData.date.format('YYYY-MM-DD');
            }
            
            console.log('提交数据:', submitData);
            
            // 模拟API调用
            await this.mockSubmitData(submitData);
            
            message.success('提交成功！');
            
            // 提交成功后可以跳转或重置表单
            // this.$router.push('/success');
            // this.handleReset();
          } catch (error) {
            console.error('提交失败:', error);
            message.error('提交失败，请重试');
          }
        } else {
          message.warning('请检查表单必填项');
          return false;
        }
      });
    },
    
    /**
     * 暂存表单
     */
    async handleSaveTemporary() {
      try {
        // 处理暂存数据
        const tempData = { ...this.baseData };
        
        // 转换日期格式
        if (tempData.date && tempData.date.format) {
          tempData.date = tempData.date.format('YYYY-MM-DD');
        }
        
        console.log('暂存数据:', tempData);
        
        // 模拟API调用
        await this.mockSaveTemporary(tempData);
        
        message.success('暂存成功！');
      } catch (error) {
        console.error('暂存失败:', error);
        message.error('暂存失败，请重试');
      }
    },
    
    /**
     * 重置表单
     */
    handleReset() {
      this.baseData = {
        leadId: undefined,
        name: '',
        description: '',
        date: null
      };
      message.info('表单已重置');
    },
    
    // ============ 模拟API调用（实际项目中替换为真实API）============
    
    /**
     * 模拟获取下拉数据
     */
    mockGetLeadData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 0,
            data: [
              { id: 1, leadDesc: '项目A - 重要项目' },
              { id: 2, leadDesc: '项目B - 常规项目' },
              { id: 3, leadDesc: '项目C - 紧急项目' },
              { id: 4, leadDesc: '项目D - 长期项目' },
              { id: 5, leadDesc: '项目E - 短期项目' }
            ]
          });
        }, 500);
      });
    },
    
    /**
     * 模拟获取暂存数据
     */
    mockGetTemporaryData() {
      this.baseData.leadId = 4;
      this.baseData.name = 'sadjhajhd';
    },
    
    /**
     * 模拟提交数据
     */
    mockSubmitData(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('服务器接收到的数据:', data);
          resolve({ code: 0, msg: '提交成功' });
        }, 800);
      });
    },
    
    /**
     * 模拟暂存数据
     */
    mockSaveTemporary(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('暂存到服务器的数据:', data);
          resolve({ code: 0, msg: '暂存成功' });
        }, 500);
      });
    }
  }
};
</script>

<style scoped>
.form-example-page {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 表单样式优化 */
.form-card :deep(.ant-form-item-label) {
  font-weight: 500;
}

.form-card :deep(.ant-form-item) {
  margin-bottom: 24px;
}

/* 下拉框样式 */
.form-card :deep(.ant-select) {
  width: 100%;
}

/* 按钮样式 */
.header-actions :deep(.ant-btn) {
  min-width: 100px;
}
</style>

