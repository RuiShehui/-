<!--
 * @Author: zhangcheng
 * @Date: 2022-06-06 10:58:45
 * @LastEditTime: 2022-06-09 09:54:08
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\customer-quota-manage.vue
-->
<template>
  <div class="mg-25">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f3f6fc',color:'#606266',fontSize:'14px',fontWeight: '400'}"
    >
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')" prop="custNo"></el-table-column>
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')" prop="custName"></el-table-column>
      <el-table-column v-if="showAdd" :label="$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.customerClazz) }}</template>
      </el-table-column>
      <el-table-column v-if="showUp" :label="$t('BUSINESS_MANAGEMENT.ORG_CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.customerClazz) }}</template>
      </el-table-column>
      <el-table-column v-if="showUp" :label="$t('BUSINESS_MANAGEMENT.UPDATA_CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.updateCustomerClazz) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomerQuotaManage',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showAdd: '',
      showUp: '',
      tableData: []
    };
  },
  created() {
    const data = JSON.parse(this.options.temp.afterMdJson).body;
    if (data.tcBankLimitRelationReqList) {
      this.tableData = data.tcBankLimitRelationReqList;
      this.showAdd = true;
    } else {
      if (data.updateCustomerClazz) {
        this.showUp = true;
      } else {
        this.showAdd = true;
      }
      this.tableData = [data];
    }
    console.log('this.tableData',this.tableData)
  },
  methods: {
    customerClazzFilter(val) {
      if ( 0 <= Number(val) &&  Number(val)  <= 25) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        );
      }else {
        return val;
      }

    }
  }
};
</script>

<style scoped>
.mg-25 {
  margin-top: 25px;
}
</style>
