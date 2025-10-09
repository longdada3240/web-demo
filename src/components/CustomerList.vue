<!-- src/components/CustomerList.vue -->
<template>
  <div class="customer-list">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2>客户列表</h2>
        <span class="customer-count">共 {{ totalCustomers }} 个客户</span>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="addCustomer">
          新增客户
        </el-button>
        <el-button icon="el-icon-download" @click="exportData">
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-row">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入客户姓名、电话或身份证号"
          prefix-icon="el-icon-search"
          class="search-input"
          @keyup.enter="handleSearch">
        </el-input>
        <el-select v-model="searchForm.status" placeholder="客户状态" class="filter-select">
          <el-option label="全部" value=""></el-option>
          <el-option label="VIP客户" value="vip"></el-option>
          <el-option label="普通客户" value="normal"></el-option>
          <el-option label="新客户" value="new"></el-option>
          <el-option label="企业客户" value="enterprise"></el-option>
        </el-select>
        <el-select v-model="searchForm.manager" placeholder="管户人" class="filter-select">
          <el-option label="全部" value=""></el-option>
          <el-option label="张经理" value="张经理"></el-option>
          <el-option label="李经理" value="李经理"></el-option>
          <el-option label="王经理" value="王经理"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>

    <!-- 客户数据表格 -->
    <div class="table-section">
      <el-table
        :data="filteredCustomers"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        
        <el-table-column type="selection" width="55"></el-table-column>
        
        <el-table-column prop="id" label="客户ID" width="80"></el-table-column>
        
        <el-table-column prop="name" label="客户姓名" width="120">
          <template slot-scope="scope">
            <div class="customer-name">
              <span class="name-text">{{ scope.row.name }}</span>
              <el-tag 
                v-for="tag in scope.row.mainTags" 
                :key="tag.id"
                :type="getTagType(tag.label)"
                size="mini"
                class="name-tag">
                {{ tag.label }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="phone" label="联系电话" width="140"></el-table-column>
        
        <el-table-column prop="idCard" label="身份证号" width="180">
          <template slot-scope="scope">
            <span class="id-card">{{ formatIdCard(scope.row.idCard) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="manager" label="管户人" width="100"></el-table-column>
        
        <el-table-column label="标签" min-width="200">
          <template slot-scope="scope">
            <div class="tags-container">
              <el-tag 
                v-for="tag in scope.row.leftTags.slice(0, 3)" 
                :key="tag.id"
                size="mini"
                :color="tag.color"
                effect="plain"
                class="tag-item">
                {{ tag.label }}
              </el-tag>
              <el-tag 
                v-if="scope.row.leftTags.length > 3"
                size="mini"
                type="info"
                class="tag-item">
                +{{ scope.row.leftTags.length - 3 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="手工标签" min-width="150">
          <template slot-scope="scope">
            <div class="tags-container">
              <el-tag 
                v-for="tag in scope.row.rightTags.slice(0, 2)" 
                :key="tag.id"
                size="mini"
                :color="tag.color"
                effect="plain"
                class="tag-item">
                {{ tag.label }}
              </el-tag>
              <el-tag 
                v-if="scope.row.rightTags.length > 2"
                size="mini"
                type="info"
                class="tag-item">
                +{{ scope.row.rightTags.length - 2 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="viewCustomer(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" @click="editCustomer(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteCustomer(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCustomers">
      </el-pagination>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedCustomers.length > 0">
      <span class="selected-count">已选择 {{ selectedCustomers.length }} 个客户</span>
      <el-button size="small" @click="batchExport">批量导出</el-button>
      <el-button size="small" type="danger" @click="batchDelete">批量删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerList',
  data() {
    return {
      loading: false,
      // 搜索表单
      searchForm: {
        keyword: '',
        status: '',
        manager: ''
      },
      // 分页信息
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      // 选中的客户
      selectedCustomers: [],
      // 客户数据
      customers: [
        {
          id: 1,
          name: '张三',
          phone: '13800138001',
          idCard: '110101199001011234',
          manager: '张经理',
          createTime: '2024-01-15 10:30:00',
          mainTags: [
            { id: 1, label: 'VIP客户', color: '#f56c6c' },
            { id: 2, label: '重要客户', color: '#e6a23c' }
          ],
          leftTags: [
            { id: 1, label: '标签一', color: '#409eff' },
            { id: 2, label: '标签二', color: '#67c23a' },
            { id: 3, label: '标签三', color: '#e6a23c' },
            { id: 4, label: '标签四', color: '#67c23a' }
          ],
          rightTags: [
            { id: 1, label: '手工标签1', color: '#f56c6c' },
            { id: 2, label: '手工标签2', color: '#909399' }
          ]
        },
        {
          id: 2,
          name: '李四',
          phone: '13800138002',
          idCard: '110101199002021234',
          manager: '李经理',
          createTime: '2024-01-16 14:20:00',
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
          ]
        },
        {
          id: 3,
          name: '王五',
          phone: '13800138003',
          idCard: '110101199003031234',
          manager: '王经理',
          createTime: '2024-01-17 09:15:00',
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
          ]
        },
        {
          id: 4,
          name: '赵六',
          phone: '13800138004',
          idCard: '110101199004041234',
          manager: '张经理',
          createTime: '2024-01-18 16:45:00',
          mainTags: [
            { id: 6, label: 'VIP客户', color: '#f56c6c' }
          ],
          leftTags: [
            { id: 11, label: '标签十一', color: '#409eff' },
            { id: 12, label: '标签十二', color: '#67c23a' }
          ],
          rightTags: [
            { id: 10, label: '手工标签10', color: '#e6a23c' }
          ]
        },
        {
          id: 5,
          name: '钱七',
          phone: '13800138005',
          idCard: '110101199005051234',
          manager: '李经理',
          createTime: '2024-01-19 11:30:00',
          mainTags: [
            { id: 7, label: '新客户', color: '#67c23a' }
          ],
          leftTags: [
            { id: 13, label: '标签十三', color: '#e6a23c' },
            { id: 14, label: '标签十四', color: '#909399' },
            { id: 15, label: '标签十五', color: '#f56c6c' }
          ],
          rightTags: [
            { id: 11, label: '手工标签11', color: '#67c23a' },
            { id: 12, label: '手工标签12', color: '#409eff' }
          ]
        }
      ]
    };
  },
  computed: {
    // 过滤后的客户数据
    filteredCustomers() {
      let result = this.customers;
      
      // 关键词搜索
      if (this.searchForm.keyword) {
        const keyword = this.searchForm.keyword.toLowerCase();
        result = result.filter(customer => 
          customer.name.toLowerCase().includes(keyword) ||
          customer.phone.includes(keyword) ||
          customer.idCard.includes(keyword)
        );
      }
      
      // 状态筛选
      if (this.searchForm.status) {
        result = result.filter(customer => {
          const mainTagLabels = customer.mainTags.map(tag => tag.label);
          return mainTagLabels.some(label => {
            switch (this.searchForm.status) {
              case 'vip': return label.includes('VIP');
              case 'normal': return label.includes('普通');
              case 'new': return label.includes('新');
              case 'enterprise': return label.includes('企业');
              default: return true;
            }
          });
        });
      }
      
      // 管户人筛选
      if (this.searchForm.manager) {
        result = result.filter(customer => customer.manager === this.searchForm.manager);
      }
      
      return result;
    },
    
    // 总客户数
    totalCustomers() {
      return this.filteredCustomers.length;
    }
  },
  mounted() {
    this.loadCustomers();
  },
  methods: {
    // 加载客户数据
    loadCustomers() {
      this.loading = true;
      // 模拟API调用
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    
    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1;
    },
    
    // 重置搜索
    resetSearch() {
      this.searchForm = {
        keyword: '',
        status: '',
        manager: ''
      };
      this.pagination.currentPage = 1;
    },
    
    // 格式化身份证号
    formatIdCard(idCard) {
      if (!idCard) return '';
      return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
    },
    
    // 获取标签类型
    getTagType(label) {
      if (label.includes('VIP')) return 'danger';
      if (label.includes('重要')) return 'warning';
      if (label.includes('新')) return 'success';
      if (label.includes('企业')) return 'primary';
      return 'info';
    },
    
    // 新增客户
    addCustomer() {
      this.$message.info('跳转到新增客户页面');
    },
    
    // 查看客户
    viewCustomer(customer) {
      this.$message.info(`查看客户：${customer.name}`);
    },
    
    // 编辑客户
    editCustomer(customer) {
      this.$message.info(`编辑客户：${customer.name}`);
    },
    
    // 删除客户
    deleteCustomer(customer) {
      this.$confirm(`确定要删除客户"${customer.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.customers.findIndex(c => c.id === customer.id);
        if (index > -1) {
          this.customers.splice(index, 1);
          this.$message.success('删除成功');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    // 导出数据
    exportData() {
      this.$message.info('导出客户数据');
    },
    
    // 批量导出
    batchExport() {
      this.$message.info(`批量导出 ${this.selectedCustomers.length} 个客户数据`);
    },
    
    // 批量删除
    batchDelete() {
      this.$confirm(`确定要删除选中的 ${this.selectedCustomers.length} 个客户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedCustomers.forEach(customer => {
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index > -1) {
            this.customers.splice(index, 1);
          }
        });
        this.selectedCustomers = [];
        this.$message.success('批量删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedCustomers = selection;
    },
    
    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
    },
    
    // 当前页变化
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
    }
  }
};
</script>

<style scoped>
.customer-list {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.header-left h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.customer-count {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
  background-color: rgba(52, 152, 219, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(52, 152, 219, 0.2);
}

.search-section {
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.search-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.filter-select {
  width: 150px;
}

.table-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.customer-name {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name-text {
  font-weight: 500;
  color: #303133;
}

.name-tag {
  margin-right: 5px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-item {
  margin: 0;
}

.id-card {
  font-family: 'Courier New', monospace;
  color: #606266;
}

.pagination-section {
  margin-top: 24px;
  text-align: right;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.batch-actions {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border-radius: 30px;
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.4);
  z-index: 1000;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.selected-count {
  font-size: 14px;
  margin-right: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .filter-select {
    max-width: none;
    width: 100%;
  }
  
  .batch-actions {
    left: 10px;
    right: 10px;
    transform: none;
    border-radius: 8px;
  }
}
</style>
