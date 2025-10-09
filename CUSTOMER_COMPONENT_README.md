# 客户管理组件使用说明

## 功能概述

已实现基于 Ant Design Vue 的客户管理系统，包含以下功能：

### 1. 客户列表页面 (CustomerList.vue)

#### 主要功能
- ✅ **双视图切换**：卡片视图和列表视图
- ✅ **卡片独占一行**：每个卡片水平展示，包含完整信息
- ✅ **搜索筛选**：支持关键词、客户状态、管户人筛选
- ✅ **分页功能**：支持分页显示和每页条数设置
- ✅ **页面跳转**：点击卡片或查看按钮跳转到详情页

#### 卡片布局说明
每个卡片分为三个区域：
- **左侧区域**：客户基本信息（姓名、证件号、电话、经理、机构）
- **中间区域**：标签信息（主标签、手工标签）+ 底部功能标签
- **右侧区域**：操作按钮（基本信息、修改记录、一键推单）

### 2. 客户详情页面 (CustomerDetail.vue)

#### 主要功能
- ✅ **Tab 标签页**：基本信息、销售列表、申请记录、360画像、服务记录
- ✅ **基本信息展示**：完整的表单信息展示和编辑
- ✅ **标签管理**：支持添加和删除客户标签
- ✅ **返回功能**：支持返回上一页

## 使用方法

### 1. 安装依赖

```bash
npm install ant-design-vue @ant-design/icons-vue
```

### 2. 在 main.js 中引入 Ant Design Vue

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.mount('#app')
```

### 3. 路由配置

路由文件已创建在 `src/router/index.js`，包含：
- `/customers` - 客户列表页
- `/customer/:id` - 客户详情页

### 4. 在 App.vue 中使用

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>
```

## 页面跳转逻辑

### 从列表跳转到详情

1. **点击卡片任意位置**：跳转到客户详情的基本信息页
   ```javascript
   viewCustomer(customer) {
     this.$router.push({ 
       name: 'CustomerDetail', 
       params: { id: customer.id },
       query: { tab: 'basic' }
     });
   }
   ```

2. **点击"基本信息"按钮**：直接跳转到基本信息标签页
   ```javascript
   viewBasicInfo(customer) {
     this.$router.push({ 
       name: 'CustomerDetail', 
       params: { id: customer.id },
       query: { tab: 'basic' }
     });
   }
   ```

### 从详情返回列表

点击页面头部的返回按钮：
```javascript
goBack() {
  window.history.back();
}
```

## 数据结构

### 客户数据格式

```javascript
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
    // ...
  ],
  rightTags: [
    { id: 1, label: '手工标签1', color: 'red' },
    // ...
  ]
}
```

## 自定义配置

### 修改视图默认值

在 CustomerList.vue 中修改：
```javascript
data() {
  return {
    viewType: 'card', // 'card' 或 'list'
  }
}
```

### 修改分页配置

```javascript
pagination: {
  currentPage: 1,
  pageSize: 10  // 修改每页显示条数
}
```

### 添加更多 Tab 标签页

在 CustomerDetail.vue 的 `a-tabs` 中添加：
```vue
<a-tab-pane key="new-tab" tab="新标签页">
  <!-- 新标签页内容 -->
</a-tab-pane>
```

## API 集成示例

### 获取客户列表

```javascript
async loadCustomers() {
  this.loading = true;
  try {
    const response = await fetch('/api/customers');
    this.customers = await response.json();
  } catch (error) {
    message.error('加载客户数据失败');
  } finally {
    this.loading = false;
  }
}
```

### 获取客户详情

```javascript
async loadCustomerDetail(id) {
  try {
    const response = await fetch(`/api/customer/${id}`);
    const data = await response.json();
    this.customerForm = data;
  } catch (error) {
    message.error('加载客户详情失败');
  }
}
```

## 注意事项

1. **图标组件**：需要从 `@ant-design/icons-vue` 导入所需图标
2. **路由配置**：确保在项目中正确配置 Vue Router
3. **样式优化**：可根据实际需求调整卡片布局和样式
4. **权限控制**：可在路由守卫中添加权限验证逻辑

## 后续扩展

- [ ] 实现其他 Tab 标签页的内容（销售列表、申请记录等）
- [ ] 添加客户新增功能
- [ ] 添加批量操作功能
- [ ] 集成实际后端 API
- [ ] 添加权限控制
- [ ] 优化移动端显示效果
