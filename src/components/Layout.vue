<!-- src/components/Layout.vue -->
<template>
  <div class="layout-container">
    <!-- 侧边菜单 -->
    <Sidebar 
      :show-mask="showSidebarMask"
      @collapse-change="handleCollapseChange"
      @menu-select="handleMenuSelect"
      @close-sidebar="closeSidebar" />
    
    <!-- 主内容区域 -->
    <div class="main-container" :class="{ 'main-collapsed': sidebarCollapsed }">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="navbar-left">
          <el-button 
            type="text" 
            class="menu-toggle-btn"
            @click="toggleSidebar"
            :icon="showSidebarMask ? 'el-icon-s-fold' : 'el-icon-s-unfold'">
          </el-button>
          <span class="page-title">{{ currentPageTitle }}</span>
        </div>
        
        <div class="navbar-right">
          <el-dropdown @command="handleUserCommand">
            <span class="user-info">
              <i class="el-icon-user-solid"></i>
              <span>管理员</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="content-area">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
  name: 'Layout',
  components: {
    Sidebar
  },
  data() {
    return {
      // 侧边栏是否收起
      sidebarCollapsed: false,
      // 是否显示遮罩层
      showSidebarMask: false,
      // 当前页面标题
      currentPageTitle: '首页',
      // 菜单标题映射
      menuTitleMap: {
        '1': '首页',
        '2': '客户管理',
        '2-1': '客户列表',
        '2-2': '客户标签',
        '2-3': '客户分组',
        '3': '订单管理',
        '3-1': '订单列表',
        '3-2': '订单统计',
        '4': '财务管理',
        '4-1': '收支明细',
        '4-2': '财务报表',
        '5': '系统设置',
        '5-1': '用户管理',
        '5-2': '权限设置',
        '5-3': '系统配置'
      }
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 处理侧边栏收起状态变化
    handleCollapseChange(collapsed) {
      this.sidebarCollapsed = collapsed;
    },
    
    // 处理菜单选择
    handleMenuSelect(index) {
      this.currentPageTitle = this.menuTitleMap[index] || '未知页面';
      this.$emit('menu-select', index);
    },
    
    // 切换侧边栏显示
    toggleSidebar() {
      if (window.innerWidth <= 768) {
        this.showSidebarMask = !this.showSidebarMask;
      }
    },
    
    // 关闭侧边栏
    closeSidebar() {
      this.showSidebarMask = false;
    },
    
    // 处理用户下拉菜单命令
    handleUserCommand(command) {
      switch (command) {
        case 'profile':
          this.$message.info('跳转到个人资料页面');
          break;
        case 'settings':
          this.$message.info('跳转到系统设置页面');
          break;
        case 'logout':
          this.$confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message.success('退出登录成功');
          }).catch(() => {
            this.$message.info('已取消退出');
          });
          break;
      }
    },
    
    // 处理窗口大小变化
    handleResize() {
      const width = window.innerWidth;
      if (width > 768) {
        this.showSidebarMask = false;
      }
    }
  }
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  flex: 1;
  margin-left: 200px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.main-collapsed {
  margin-left: 64px;
}

.top-navbar {
  height: 64px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.navbar-left {
  display: flex;
  align-items: center;
}

.menu-toggle-btn {
  margin-right: 24px;
  font-size: 18px;
  color: #606266;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-toggle-btn:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  transform: scale(1.05);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease;
  background-color: rgba(52, 152, 219, 0.05);
  border: 1px solid rgba(52, 152, 219, 0.1);
}

.user-info:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.user-info i:first-child {
  margin-right: 8px;
  font-size: 16px;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 64px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .main-collapsed {
    margin-left: 0;
  }
  
  .content-area {
    padding: 15px;
  }
}

/* 滚动条样式 */
.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content-area::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
