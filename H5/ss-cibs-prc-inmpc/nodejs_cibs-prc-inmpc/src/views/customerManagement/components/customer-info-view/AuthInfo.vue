<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 19:31:35
 * @LastEditTime: 2022-07-08 10:00:10
 * @LastEditors: zhangcheng
 * @Description: 授权信息
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\AuthInfo.vue
-->
<template>
  <div>
    <el-table
      :data="tableDataY"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TRANS_TYPE')" prop>
        <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGEMENT.ACCOUNT_NO')" prop="acctNo"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')" prop="modelName"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.APPROVAL_TYPE')">
        <template slot-scope="scope">{{modelTypeFilter(scope.row.approvalType)}}</template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.ANTH_INFO')">
        <template slot-scope="scope">
          <p
            v-for="(itm, idx) of scope.row.amuntUserList"
            :key="idx"
          >{{handleShowItem(itm,scope.row.approvalType)}}</p>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      class="f-margint-40"
      :data="tableDataN"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TRANS_TYPE')" prop>
        <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')" prop="modelName"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.APPROVAL_TYPE')">
        <template slot-scope="scope">{{modelTypeFilter(scope.row.approvalType)}}</template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.ANTH_INFO')">
        <template slot-scope="scope">
          <p
            v-for="(itm, idx) of scope.row.amuntUserList"
            :key="idx"
          >{{handleShowItem(itm,scope.row.approvalType)}}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryListAllSetting } from '@/api/customer-management/authorization';
import { moneyFormat } from '@/utils/tools';
import filters from '@/filters/business.js';
export default {
  name: 'AuthInfo',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableDataY: [],
      tableDataN: []
    };
  },
  filters,
  methods: {
    async queryListAllSetting() {
      const result = await queryListAllSetting({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        // const showData = result.body.map(item => {
        //   return {
        //     tradeType: item.tradeType,
        //     modelName: item.modelName,
        //     approvalType: item.approvalType,
        //     amuntUserList: item.amuntUserList
        //   };
        // });
        result.body.forEach(item => {
          if (item.approvalType === '1') {
            this.tableDataY.push(item);
          } else {
            this.tableDataN.push(item);
          }
        });
      }
      console.log(this.tableDataY);
      console.log(this.tableDataN);
    },
    handleShowItem(item, index) {
      let tpl;
      if (index === '1') {
        tpl = `${moneyFormat(item.amountStart)}<${this.$t(
          'CUSTOMER_MANAGEMENT.MONEY'
        )}≤${moneyFormat(item.amountEnd)}, ${item.levelANumber}A ${
          item.levelBNumber
        }B ${item.levelCNumber}C`;
      } else {
        tpl = `${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C`;
      }
      return tpl;
    },
    modelTypeFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL');
        default:
          return '';
      }
    }
  },
  created() {
    this.queryListAllSetting();
  }
};
</script>

<style lang="scss" scoped>
.f-margint-40 {
  margin-top: 40px;
}
</style>