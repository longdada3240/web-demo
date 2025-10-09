<template>
  <el-collapse v-model="activeNames" accordion>
    <el-collapse-item title="客户基础信息" name="1">
      <el-form label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名:">张三</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄:">35岁</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职业:">软件工程师</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
    
    <el-collapse-item title="资产状况" name="2">
      <el-statistic group-separator="," decimal-separator="." :precision="2" :value="123456.78" title="总资产(元)">
        <template #prefix>
          <i class="el-icon-money"></i>
        </template>
      </el-statistic>
    </el-collapse-item>
    
    <el-collapse-item title="交易行为" name="3">
      <el-timeline>
        <el-timeline-item timestamp="2023-06-01" placement="top">
          <el-card>
            <h4>购买理财产品</h4>
            <p>购买金额: ¥50,000</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023-05-15" placement="top">
          <el-card>
            <h4>信用卡消费</h4>
            <p>消费金额: ¥2,300</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1']
    }
  }
}
</script>