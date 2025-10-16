<!-- src/App.vue -->
<template>
  <div id="app">
    <Layout @menu-select="handleMenuSelect">
      <!-- 如果是路由页面，使用 router-view -->
      <router-view v-if="isRouterPage"></router-view>
      
      <!-- 否则根据选中的菜单显示不同内容 -->
      <div v-else-if="currentMenu === '2-1'">
        <CustomerList @navigate-to-detail="handleNavigateToDetail" />
      </div>

      <div v-else-if="currentMenu === '2-2'">
        <Test />
      </div>
      <div v-else-if="currentMenu === '2-3'">
        <Huax />
      </div>
      <div v-else-if="currentMenu === '3-1'">
        <Card />
      </div>
      <div v-else class="page-placeholder">
        <div class="placeholder-content">
          <i class="el-icon-s-home" v-if="currentMenu === '1'"></i>
          <i class="el-icon-s-custom" v-else-if="currentMenu === '2-1'"></i>
          <i class="el-icon-price-tag" v-else-if="currentMenu === '2-2'"></i>
          <i class="el-icon-s-grid" v-else-if="currentMenu === '2-3'"></i>
          <i class="el-icon-s-order" v-else-if="currentMenu === '3-1'"></i>
          <i class="el-icon-s-data" v-else-if="currentMenu === '3-2'"></i>
          <i class="el-icon-s-finance" v-else-if="currentMenu === '4-1'"></i>
          <i class="el-icon-s-marketing" v-else-if="currentMenu === '4-2'"></i>
          <i class="el-icon-user-solid" v-else-if="currentMenu === '5-1'"></i>
          <i class="el-icon-key" v-else-if="currentMenu === '5-2'"></i>
          <i class="el-icon-s-tools" v-else-if="currentMenu === '5-3'"></i>
          <i class="el-icon-s-platform" v-else></i>
          <h2>{{ getPageTitle() }}</h2>
          <p>这里是 {{ getPageTitle() }} 的内容区域</p>
          <p v-if="currentMenu === '2-2'">客户标签管理页面已加载</p>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import Layout from './components/Layout.vue';
import Huax from './components/Test.vue';
import Test from './components/360.vue';
import Card from './components/Card.vue';
import CustomerList from './components/CustomerList.vue';

export default {
  name: 'App',
  components: { 
    Layout,
    Test,
    Huax,
    Card,
    CustomerList
  },
  data() {
    return {
      currentMenu: '2-2' // 默认显示客户标签页面
    };
  },
  computed: {
    isRouterPage() {
      // 检查当前路由是否是需要使用 router-view 的页面
      return this.$route && this.$route.path.includes('/customer-detail/');
    }
  },
  watch: {
    '$route'(to, from) {
      // 当从详情页返回时，恢复到客户列表菜单
      if (from.path.includes('/customer-detail/') && !to.path.includes('/customer-detail/')) {
        this.currentMenu = '2-1';
      }
    }
  },
  methods: {
    handleMenuSelect(menuIndex) {
      this.currentMenu = menuIndex;
      // 如果选择客户列表菜单，确保路由也跳转到列表页
      if (menuIndex === '2-1') {
        if (this.$route.path !== '/customers') {
          this.$router.push('/customers').catch(() => {});
        }
      }
    },
    handleNavigateToDetail(data) {
      // 处理导航到详情页的事件
      this.$router.push({
        path: '/customer-detail/' + data.customerId,
        query: { tab: data.tab }
      });
    },
    getPageTitle() {
      const titleMap = {
        '1': '首页',
        '2-1': '客户列表',
        '2-2': '客户标签',
        '2-3': '客户分组',
        '3-1': '卡片视图',
        '3-2': '订单统计',
        '4-1': '收支明细',
        '4-2': '财务报表',
        '5-1': '用户管理',
        '5-2': '权限设置',
        '5-3': '系统配置'
      };
      return titleMap[this.currentMenu] || '未知页面';
    }
  }
};
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.page-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.placeholder-content {
  text-align: center;
  color: #909399;
}

.placeholder-content i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #c0c4cc;
}

.placeholder-content h2 {
  margin: 0 0 10px 0;
  color: #606266;
}

.placeholder-content p {
  margin: 5px 0;
  color: #909399;
}
</style>