<!--
 * @Author: zhangcheng
 * @Date: 2022-06-01 16:26:31
 * @LastEditTime: 2022-08-24 10:41:15
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\custQuotaManage\components\CustQuotaManageEdit.vue
-->
<template>
  <div>
    <el-table
      class="mg-8"
      :data="tcBankLimitRelationReqList"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')" prop="custNo"></el-table-column>
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')" prop="custName"></el-table-column>
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.ORG_CUS_CLAZZ')" prop="customerClazz">
        <template v-slot="{row}">{{ customerClazzFilter(row.customerClazz) }}</template>
      </el-table-column>
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.UPDATA_CUS_CLAZZ')">
        <template v-slot="{row}">
          <el-select v-model="row.updateCustomerClazz">
            <el-option
              v-for="item in customerClazzList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backIndex">{{ $t('COMMON.BACK') }}</el-button>
      <el-button type="primary" @click="toConfirm">{{ $t('COMMON.NEXT_STEP') }}</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { FormItem } from 'element-ui';
export default {
  name: 'CustQuotaManageEdit',
  props: {
    editData: {
      type: Object,
      default() {
        return {};
      }
    },
    customerClazzList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tcBankLimitRelationReqList: []
    };
  },
  created() {
    this.tcBankLimitRelationReqList = [{ ...this.editData }];
  },
  methods: {
    backIndex() {
      this.$emit('backIndex');
    },
    toConfirm() {
      if (this.tcBankLimitRelationReqList[0].updateCustomerClazz) {
        this.$emit('toConfirm', {
          data: this.tcBankLimitRelationReqList,
          type: 'edit'
        });
      } else {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.SELECT_LIMIT_CLAZZ'),
          type: 'error'
        });
      }
    },
    customerClazzFilter(val) {
      const number = Number(val);
      if (number === 0 || (number && number < 26)) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        );
      } else {
        return val;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../style/style.scss';
</style>