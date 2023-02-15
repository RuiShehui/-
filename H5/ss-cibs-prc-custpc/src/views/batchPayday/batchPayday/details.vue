<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:48
 * @LastEditTime: 2022-09-29 14:08:48
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\paymentsSettlement\batchPayday\details.vue
-->
<template>
  <div class="g-payDayDetails">
    <el-table :data="tableData">
      <el-table-column :label="$t('TRANSFR_INFO.NUMBER')" type="index" width="90"></el-table-column>
      <el-table-column :label="$t('TRANSFR_INFO.CUT_ACCOUNT')" prop="debitAcct"></el-table-column>
      <el-table-column :label="$t('TRANSFR_INFO.ACCOUNT_NAME')" prop="debitAcctName"></el-table-column>
            <el-table-column :label="$t('TRANSFR_INFO.BANKNAME')" prop="bankCode" >
       <template v-slot="{ row }">{{row.bankCode}} {{ filterBankInfo(row.bankCode) ? filterBankInfo(row.bankCode) : row.bankName }}</template>
      </el-table-column>
            <el-table-column :label="$t('TRANSFR_INFO.AMOUNT')" prop="amount">
        <template v-slot="{ row }">{{row.amount | formatMoneyNew}}</template>
      </el-table-column>
      <el-table-column :label="$t('TRANSFR_INFO.CUR')" prop="cur"></el-table-column>
      <el-table-column :label="$t('TRANSFR_INFO.TIPS')" prop="additionalComment"></el-table-column>
      <el-table-column :label="$t('TRANSFR_INFO.TRADESTATE')" prop="tradeState"></el-table-column>
      <el-table-column :label="$t('AUTHORIZE.FAIL_WHY')" prop="returnMag" ></el-table-column>
    </el-table>
    <pageNation class="mt16" :total="total" :page_index="current" @sizeChange="sizeChange" @pageChange="pageChange" />
    <vButton size="w210" class="f-back" @click="backTo">{{$t('TRANSFR_INFO.BACK_TO')}}</vButton>
  </div>
</template>
 
<script>
import {batchDetail } from '@/api/cashManage';
import { bankInfos } from '@/mixins';
import { formatMoneyNew } from '@/utils/tools';
export default {
   mixins: [bankInfos],
  data() {
    return {
      tableData: [],
      batchNo: "",
      current:1,
      size: 10,
      total:0,
    };
  },
    filters: {
    formatMoneyNew: formatMoneyNew
  },
  created(){
    this.batchNo=this.$route.query.item.batchNo
    this.batchDetailInit()
    console.log('---',this.batchNo)
  },
  methods: {
     async batchDetailInit(){
      let params={
        batchNo: this.batchNo,
        current:this.current,
        size: this.size,
       
      }
      console.log('參數', params)
       let res= await batchDetail(params)
       this.total=res.total
       this.tableData=res.list
       this.tableData.map((item)=>{
         switch(item.tradeState){
           case '0':item.tradeState=this.$t('TRANSFR_INFO.TRANS_SUCCESS');break;
           case '1':item.tradeState=this.$t('TRANSFR_INFO.FAILED');break;
           case '6':item.tradeState=this.$t('TRANSFR_INFO.FAILED');break;
           case '2':item.tradeState=this.$t('TRANSFR_INFO.WAIT');break;
           case '3':item.tradeState=this.$t('TRANSFR_INFO.NOW_EXCUCTE');break;
           case '4':item.tradeState=this.$t('TRANSFR_INFO.DESTORYED');break;
           case '5':item.tradeState=this.$t('TRANSFR_INFO.HUAN_YI');break;
         }
       })
      console.log('數據', res)
    },
     sizeChange(size){
      this.size=size.page_limit
       this.batchDetailInit()
      console.log('size---',this.size)
    },
    pageChange(page){
      this.current=page.page_index
       this.batchDetailInit()
      console.log('current---',this.current)
    },
    backTo() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.f-back {
  margin-top: 36px;
  margin-left: 37%;
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table .el-table__row {
  height: 46px;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
  // height: 46px;
}
</style>