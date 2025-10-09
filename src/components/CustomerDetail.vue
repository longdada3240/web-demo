<!-- src/components/CustomerDetail.vue -->
<template>
  <div class="customer-detail">
    <!-- 页面头部 -->
    <a-page-header
      title="客户详情"
      @back="goBack"
      style="background: white; margin-bottom: 20px;">
      <template #extra>
        <a-space>
          <a-button @click="editCustomer">
            <template #icon><edit-outlined /></template>
            编辑
          </a-button>
          <a-button type="primary" @click="saveCustomer">
            <template #icon><save-outlined /></template>
            保存
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Tab 标签页 -->
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <a-form
            :model="customerForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }">
            
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="客户姓名">
                  <a-input v-model:value="customerForm.name" placeholder="请输入客户姓名" />
                </a-form-item>
              </a-col>
              
              <a-col :span="12">
                <a-form-item label="客户类型">
                  <a-select v-model:value="customerForm.type" placeholder="请选择客户类型">
                    <a-select-option value="vip">VIP客户</a-select-option>
                    <a-select-option value="normal">普通客户</a-select-option>
                    <a-select-option value="enterprise">企业客户</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="身份证号">
                  <a-input v-model:value="customerForm.idCard" placeholder="请输入身份证号" />
                </a-form-item>
              </a-col>
              
              <a-col :span="12">
                <a-form-item label="联系电话">
                  <a-input v-model:value="customerForm.phone" placeholder="请输入联系电话" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="电子邮箱">
                  <a-input v-model:value="customerForm.email" placeholder="请输入电子邮箱" />
                </a-form-item>
              </a-col>
              
              <a-col :span="12">
                <a-form-item label="客户经理">
                  <a-select v-model:value="customerForm.manager" placeholder="请选择客户经理">
                    <a-select-option value="张经理">张经理</a-select-option>
                    <a-select-option value="李经理">李经理</a-select-option>
                    <a-select-option value="王经理">王经理</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="所属机构">
                  <a-input v-model:value="customerForm.organization" placeholder="请输入所属机构" />
                </a-form-item>
              </a-col>
              
              <a-col :span="12">
                <a-form-item label="客户等级">
                  <a-rate v-model:value="customerForm.level" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="联系地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <a-input v-model:value="customerForm.address" placeholder="请输入联系地址" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="客户标签" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <div class="tags-edit">
                    <a-tag
                      v-for="tag in customerForm.tags"
                      :key="tag"
                      closable
                      @close="removeTag(tag)">
                      {{ tag }}
                    </a-tag>
                    <a-input
                      v-if="tagInputVisible"
                      ref="tagInput"
                      v-model:value="tagInputValue"
                      type="text"
                      size="small"
                      style="width: 100px"
                      @blur="handleTagInputConfirm"
                      @keyup.enter="handleTagInputConfirm" />
                    <a-tag v-else @click="showTagInput" style="cursor: pointer">
                      <plus-outlined /> 添加标签
                    </a-tag>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="备注信息" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
                  <a-textarea
                    v-model:value="customerForm.remark"
                    placeholder="请输入备注信息"
                    :rows="4" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

        <!-- 销售列表 -->
        <a-tab-pane key="sales" tab="销售列表">
          <a-empty description="暂无销售数据" />
        </a-tab-pane>

        <!-- 申请记录 -->
        <a-tab-pane key="apply" tab="申请记录">
          <a-empty description="暂无申请记录" />
        </a-tab-pane>

        <!-- 360画像 -->
        <a-tab-pane key="profile" tab="360画像">
          <a-empty description="暂无画像数据" />
        </a-tab-pane>

        <!-- 服务记录 -->
        <a-tab-pane key="service" tab="服务记录">
          <a-empty description="暂无服务记录" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { EditOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'CustomerDetail',
  components: {
    EditOutlined,
    SaveOutlined,
    PlusOutlined
  },
  setup() {
    const activeTab = ref('basic');
    const tagInputVisible = ref(false);
    const tagInputValue = ref('');
    const tagInput = ref(null);

    const customerForm = ref({
      name: '刘琳琳',
      type: 'vip',
      idCard: '110101199001011234',
      phone: '13800138001',
      email: 'liulinlin@example.com',
      manager: '张经理',
      organization: '某某支行分理处',
      level: 5,
      address: '北京市朝阳区某某街道某某小区',
      tags: ['大行签约标签', '大标签标签', '重要客户'],
      remark: '这是一个重要的VIP客户，需要重点维护。'
    });

    const handleTabChange = (key) => {
      console.log('切换到标签页:', key);
    };

    const goBack = () => {
      window.history.back();
    };

    const editCustomer = () => {
      message.info('进入编辑模式');
    };

    const saveCustomer = () => {
      message.success('保存成功');
    };

    const removeTag = (tag) => {
      customerForm.value.tags = customerForm.value.tags.filter(t => t !== tag);
    };

    const showTagInput = () => {
      tagInputVisible.value = true;
      nextTick(() => {
        tagInput.value?.focus();
      });
    };

    const handleTagInputConfirm = () => {
      if (tagInputValue.value && !customerForm.value.tags.includes(tagInputValue.value)) {
        customerForm.value.tags.push(tagInputValue.value);
      }
      tagInputVisible.value = false;
      tagInputValue.value = '';
    };

    onMounted(() => {
      // 从路由获取客户ID和默认标签页
      const { id } = this.$route?.params || {};
      const { tab } = this.$route?.query || {};
      
      if (tab) {
        activeTab.value = tab;
      }
      
      if (id) {
        console.log('加载客户详情，ID:', id);
        // 这里可以调用API加载客户数据
      }
    });

    return {
      activeTab,
      customerForm,
      tagInputVisible,
      tagInputValue,
      tagInput,
      handleTabChange,
      goBack,
      editCustomer,
      saveCustomer,
      removeTag,
      showTagInput,
      handleTagInputConfirm
    };
  }
};
</script>

<style scoped>
.customer-detail {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.tags-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>

