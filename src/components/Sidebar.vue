<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar-container">
    <!-- 侧边菜单 -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- 菜单头部 -->
      <div class="sidebar-header">
        <div class="logo" v-if="!isCollapsed">
          <i class="el-icon-s-platform"></i>
          <span class="logo-text">管理系统</span>
        </div>
        <div class="logo-collapsed" v-else>
          <i class="el-icon-s-platform"></i>
        </div>
        <el-button 
          class="collapse-btn" 
          type="text" 
          @click="toggleCollapse"
          :icon="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'">
        </el-button>
      </div>

      <!-- 菜单内容（Ant Design Vue） -->
      <a-menu
        class="sidebar-menu"
        theme="light"
        mode="inline"
        :inline-collapsed="isCollapsed"
        :selectedKeys="[activeMenu]"
        :openKeys="openKeys"
        @click="handleMenuClick"
        @openChange="onOpenChange">

        <!-- 菜单项 -->
        <template v-for="item in menuItems">
          <!-- 有子菜单的项 -->
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.index">
            <span slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </span>
            <a-menu-item 
              v-for="child in item.children" 
              :key="child.index">
              <i :class="child.icon"></i>
              <span>{{ child.title }}</span>
            </a-menu-item>
          </a-sub-menu>

          <!-- 没有子菜单的项 -->
          <a-menu-item v-else :key="item.index">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>

    <!-- 遮罩层（移动端） -->
    <div 
      v-if="showMask" 
      class="sidebar-mask" 
      @click="closeSidebar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    // 是否显示遮罩层（移动端使用）
    showMask: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 菜单是否收起
      isCollapsed: false,
      // 当前激活的菜单项
      activeMenu: '1',
      // 展开的子菜单键集合（Antd）
      openKeys: ['2'],
      // 菜单数据
      menuItems: [
        {
          index: '1',
          title: '首页',
          icon: 'el-icon-s-home',
          children: []
        },
        {
          index: '2',
          title: '客户管理',
          icon: 'el-icon-user',
          children: [
            {
              index: '2-1',
              title: '客户列表',
              icon: 'el-icon-s-custom'
            },
            {
              index: '2-2',
              title: '客户标签',
              icon: 'el-icon-price-tag'
            },
            {
              index: '2-3',
              title: '客户分组',
              icon: 'el-icon-s-grid'
            }
          ]
        },
        {
          index: '3',
          title: '订单管理',
          icon: 'el-icon-s-order',
          children: [
            {
              index: '3-1',
              title: '订单列表',
              icon: 'el-icon-s-order'
            },
            {
              index: '3-2',
              title: '订单统计',
              icon: 'el-icon-s-data'
            }
          ]
        },
        {
          index: '4',
          title: '财务管理',
          icon: 'el-icon-money',
          children: [
            {
              index: '4-1',
              title: '收支明细',
              icon: 'el-icon-s-finance'
            },
            {
              index: '4-2',
              title: '财务报表',
              icon: 'el-icon-s-marketing'
            }
          ]
        },
        {
          index: '5',
          title: '系统设置',
          icon: 'el-icon-setting',
          children: [
            {
              index: '5-1',
              title: '用户管理',
              icon: 'el-icon-user-solid'
            },
            {
              index: '5-2',
              title: '权限设置',
              icon: 'el-icon-key'
            },
            {
              index: '5-3',
              title: '系统配置',
              icon: 'el-icon-s-tools'
            }
          ]
        }
      ]
    };
  },
  mounted() {
    // 根据屏幕大小自动调整菜单状态
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 切换菜单收起/展开
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit('collapse-change', this.isCollapsed);
    },
    // Antd 菜单点击
    handleMenuClick({ key }) {
      this.activeMenu = key;
      this.$emit('menu-select', key);

      // 移动端选择菜单后自动关闭
      if (this.showMask) {
        this.closeSidebar();
      }
    },
    // Antd 子菜单展开/收起
    onOpenChange(nextOpenKeys) {
      this.openKeys = nextOpenKeys;
    },
    
    // 关闭侧边栏（移动端）
    closeSidebar() {
      this.$emit('close-sidebar');
    },
    
    // 处理窗口大小变化
    handleResize() {
      const width = window.innerWidth;
      if (width <= 768) {
        this.isCollapsed = true;
      }
    }
  }
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100vh;
  background: #FCFDFF 100%;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(135deg, #ebeff2 0%, #d9e0e4 100%);
  border-bottom: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  color: #FF4327 100%;
  font-size: 18px;
  font-weight: bold;
}

.logo i {
  font-size: 24px;
  margin-right: 12px;
  color: #FF4327 100%;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.logo-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo-collapsed i {
  font-size: 24px;
  color: #865353;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.collapse-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 16px;
  padding: 8px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.sidebar-menu {
  border: none;
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: transparent;
}

/* Ant Design Vue 菜单适配（深度选择，绕过 scoped） */
.sidebar-menu /deep/ .ant-menu-dark.ant-menu-inline .ant-menu-item, 
.sidebar-menu /deep/ .ant-menu-dark.ant-menu-inline .ant-menu-submenu-title {
  margin-right: 8px;
  border-radius: 0 25px 25px 0;
}
.sidebar-menu /deep/ .ant-menu .ant-menu-item-selected {
  background: #FF4327 100%;
}
.sidebar-menu /deep/ .ant-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
  background: #FF4327 100%;
}
/* 选中子项：文字/图标统一白色 */
.sidebar-menu /deep/ .ant-menu .ant-menu-item-selected > a,
.sidebar-menu /deep/ .ant-menu .ant-menu-item-selected > a i {
  color: #fff !important;
}

/* 选中父项：标题/图标统一白色 */
.sidebar-menu /deep/ .ant-menu .ant-menu-submenu-selected > .ant-menu-submenu-title,
.sidebar-menu /deep/ .ant-menu .ant-menu-submenu-selected > .ant-menu-submenu-title i {
  color: #fff !important;
}



.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: #2b3a4b;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #434a50;
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: #5a6169;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    width: 200px;
  }
}


</style>
