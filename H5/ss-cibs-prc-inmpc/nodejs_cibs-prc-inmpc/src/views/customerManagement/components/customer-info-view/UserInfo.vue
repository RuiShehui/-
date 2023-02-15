<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 17:06:47
 * @LastEditTime: 2022-10-08 20:36:13
 * @LastEditors: Please set LastEditors
 * @Description: 用户信息
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\UserInfo.vue
-->
<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column width="80" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')">
        <template slot-scope="scope">{{userTypeFilter(scope.row.userType) }}</template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')">
        <template slot-scope="scope">
          <span class="f-btnColor" @click="toDetail(scope.row.userCode)">{{scope.row.userCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userChsName" :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')"></el-table-column>
      <el-table-column prop="userEglsName" :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')"></el-table-column>
      <el-table-column prop="cardType" :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')"></el-table-column>
      <el-table-column prop="cardNo" :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')">
        <template slot-scope="scope">{{userStatusFilter(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column prop="empowerGroup" :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')">
        <template slot-scope="scope">{{empowerGroupFilter(scope.row.empowerGroup)}}</template>
      </el-table-column>
      <el-table-column width="150" prop="tfaStatus" :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')">
        <template slot-scope="scope">{{tfaStatusFilter(scope.row.tfaStatus) }}</template>
      </el-table-column>
      <el-table-column width="150" prop="tfaStatus" label="密碼重試次數">
        <template v-slot="{ row }">
          {{ row.canRetryCount }}
          <!-- <span
            v-if="row.status==='0' && row.canRetryCount===0 "
            @click="resetLoginCount(row.userCode)"
            class="f-btnColor resetPwd"
          >重設</span> -->
        </template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  queryOperatorPage,
  resetLoginCount
} from '@/api/customer-management/user';
export default {
  name: 'UserInfo',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 1,
      tableData: []
    };
  },
  methods: {
    async resetLoginCount(userCode) {
      const result = await resetLoginCount({ userCode });
      this.queryOperatorPage();
    },
    handleSizeChange(val) {
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryOperatorPage();
    },
    query() {
      this.current = 1;
      this.queryOperatorPage();
    },
    toDetail(userCode) {
      this.$emit('toUserInfoDetail', userCode);
    },

    // 用户列表查询
    async queryOperatorPage() {
      let result = await queryOperatorPage({
        ebankCstmNo: this.ebankCstmNo,
        size: this.size,
        current: this.current
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
      console.log(result);
    },
    userStatusFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    },
    empowerGroupFilter(val) {
      switch (val) {
        case 'A':
          return 'A';
        case 'B':
          return 'B';
        case 'C':
          return 'C';
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NONE');
        default:
          return '';
      }
    },
    tfaStatusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO');
        case '1':
        default:
          return this.$t('CUSTOMER_MANAGEMENT.YES');
      }
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ADMAIN');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.AUTH_USER');
        case '3':
          return this.$t('CUSTOMER_MANAGEMENT.INPUT_USER');
        default:
          return '';
      }
    }
  },
  created() {
    this.queryOperatorPage();
  }
};
</script>

<style lang="scss" scoped>
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.f-btnColor {
  color: #4181fa;
  cursor: pointer;
}
.resetPwd {
  margin-left: 5px;
}
</style>