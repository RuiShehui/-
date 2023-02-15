<!--
 * @Author: your name
 * @Date: 2022-07-06 14:34:48
 * @LastEditTime: 2022-09-26 10:03:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\authManagement\detail\index.vue
-->
<template>
  <div class="u-detail">
    <div class="u-temSet">
      <divider :title="$t('COMMON.DETAIL')" />
      <div class="u-content">
        <detail-item :title="$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')" :content="jsonRow.modelName" />
        <detail-item
          :title="$t('RIGHTS_TEMPLATE.MODULE_TYPE')"
          :content="jsonRow.modelType==='1'?$t('RIGHTS_TEMPLATE.CASH_MODULE'):$t('RIGHTS_TEMPLATE.NO_CASH_MODULE')"
        />
      </div>
      <el-table :data="moneyData" stripe stype="width: 100%" v-if="jsonRow.modelType !=='1'">
        <el-table-column min-width="340" :label="$t('RIGHTS_TEMPLATE.A_LEVEL')">
          <template slot-scope="scope">{{ scope.row.levelANumber }}</template>
        </el-table-column>
        <el-table-column min-width="340" prop="levelBNumber" :label="$t('RIGHTS_TEMPLATE.B_LEVEL')"></el-table-column>
        <el-table-column min-width="340" prop="levelCNumber" :label="$t('RIGHTS_TEMPLATE.C_LEVEL')"></el-table-column>
      </el-table>

      <el-table v-if="jsonRow.modelType==='1'" :data="moneyData" stripe stype="width: 100%">
        <el-table-column :label="$t('RIGHTS_TEMPLATE.TO_AMMOUNT')" min-width="25%">
          <!-- <template
            slot-scope="scope"
          >{{formatMoneyNew(scope.row.amountStart) }} &nbsp;&nbsp;&lt;&nbsp;{{$t('RIGHTS_TEMPLATE.AOMMOUT')}}&nbsp;&lt;=&nbsp;&nbsp;{{formatMoneyNew(scope.row.amountEnd)}}</template> -->
          <template
            slot-scope="scope"
          >{{formatMoneyNew(scope.row.amountStart) }} &nbsp;&nbsp;&lt;&nbsp;{{$t('RIGHTS_TEMPLATE.AOMMOUT')}}&nbsp;&lt;=&nbsp;&nbsp;{{formatMoneyNew(scope.row.amountEnd)}}</template>
        </el-table-column>
        <el-table-column min-width="25%" prop="levelANumber" :label="$t('RIGHTS_TEMPLATE.A_LEVEL')"></el-table-column>
        <el-table-column min-width="25%" prop="levelBNumber" :label="$t('RIGHTS_TEMPLATE.B_LEVEL')"></el-table-column>
        <el-table-column min-width="25%" prop="levelCNumber" :label="$t('RIGHTS_TEMPLATE.C_LEVEL')"></el-table-column>
      </el-table>
    </div>
    <div class="flexc">
      <v-button @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
    </div>
  </div>
</template>
<script>
import Divider from '../../operatorMaintain/components/divider';
import tool from '@/dataTools/tools/moneyTools.js';
import { formatMoneyNew } from '@/utils/tools';
export default {
  components: {
    Divider
  },
  data() {
    return {
      jsonRow: {},
      moneyData: [
        {
          startMoney: '0.00',
          endMoney: '100000.00',
          levelANumber: '1',
          levelBNumber: '1',
          levelCNumber: '1'
        }
      ]
    };
  },
  created() {
    this.jsonRow = this.$route.query;
    console.log('this.jsonRow', this.jsonRow);
    if (this.jsonRow.amuntUserList) {
      this.moneyData = this.jsonRow.amuntUserList;
    }
  },
  methods: {
    formatMoneyNew,
    returnClick() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>