<template>
  <div class="accountWapper">
    <div class="accountSelect">
      <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ACCOUNT_CHOOSES')" />
      <div class="accountSelectAll">
        <el-checkbox style="padding-left: 3%" v-model="allChecked" @change="selectAll">{{$t('USER_MANAGEMENT.ALL_CHECK')}}</el-checkbox>
      </div>
      <div style="overflow: auto">
        <div v-for="(item, index) in accountList" :key="index">
          <el-checkbox
            class="accountCheck"
            v-model="item.checked"
            @change="selectChecked"
          >{{item.accName}}</el-checkbox>
        </div>
      </div>
    </div>
    <div class="flexc mt36">
      <v-button @click="$emit('back', accountObj)" class="mr16">{{$t('COMMON.BACK')}}</v-button>
      <v-button @click="next" type="primary">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </div>
  </div>
</template>
<script>
import tools from '@/dataTools/tools';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import _ from 'lodash';
import {
  queryUserAccountLimit,
  checkAccountLimit,
  queryAccountListLimit,
  queryAccount,
  queryAllOperationList
} from '@/api/userManagement';
import { formatTreeData, deepClone, unique } from '@/utils/tree-table.js';
import CONSTANTS from '@/utils/contants';
import filter from '@/filters/accountManagement';
export default {
  props: {
    accountObj: {
      type: Object,
      default: () => {}
    }
  },
    filters:{
    ...filter
  },

  components: {},
  data() {
    return {
      accountList: [], //账户数组
      allChecked: false, //全选
      tableData: []
    };
  },

  created() {},

  mounted() {
    console.log('打印this.accountObj', this.accountObj);
    if (this.accountObj && this.accountObj.accountList) {
      this.accountList = this.accountObj.accountList;
      this.allChecked = this.accountObj.allChecked;
    } else {
      this.queryAccountLimit();
    }
  },

  methods: {
    //查询服务权限设定
    queryAccountLimit() {
      let self = this;
      console.log('self:', self.accountObj);
      queryAccount().then(resp => {
        resp.accountInfoList.forEach(item => {
          CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
            if (item.accountType === accountItem.value) {
              item.accountTypeName = accountItem.label;
            }
          });
          if (item.currencyType) {
            item.accName =
              item.accountNo +
              '-' +
              item.currencyType +
              '-' +
              this.$options.filters['accountType'](item.accountType);
          } else {
            item.accName = item.accountNo + '-' +this.$options.filters['accountType'](item.accountType)
          }

          this.accountList.push(item);
        });
      });
    },
    next() {
      let userAccountLimitList = [];
      this.accountList.forEach(item => {
        if (item.checked) {
          userAccountLimitList.push(item);
        }
      });

      if (userAccountLimitList.length === 0) {
        return this.$message({
          type: 'fail',
          message: this.$t('USER_MANAGEMENT.ACCOUNT_SETTTINGS'),
          delay: 3000
        });
      }

      this.accountObj.operatorAccounts = userAccountLimitList;
      // this.accountObj.userAccountLimit = userAccountLimitList;
      this.accountObj.accountList = this.accountList;
      this.accountObj.allChecked = this.allChecked;
      this.$emit('next', this.accountObj);
    },

    //账户全选
    selectAll() {
      console.log('打印。。。', this.allChecked);
      this.accountList.forEach(item => {
        item.checked = this.allChecked;
      });
    },
    //账户单选
    selectChecked() {
      let flag = true;
      this.accountList.forEach(item => {
        if (!item.checked) {
          flag = false;
        }
      });
      if (flag) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.accountWapper {
  /deep/.el-checkbox__inner {
    border-radius: 10px;
  }
  /deep/.el-input {
    width: 180px;
    height: 28px;
    .el-input__inner {
      width: 180px;
      height: 28px;
    }
  }
  /deep/.cell {
    padding: 0;
  }
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}
.el-table tr {
  background-color: #ffffff;
}
/deep/ .el-table td.el-table__cell div {
  // margin-left: 3px;
  position: relative;
  left: 10px;
}
.accountSelect {
  height: 100%;
  border-bottom-color: red;
  .accountSelectAll {
    background: #f3f3f3;
    height: 46px;
    width: 100%;
    // padding-left: 3%;
  }
  .accountCheck {
    width: 100%;
    float: left;
    width: 30%;
    // padding: 20px;
    padding: 12px 0;
    padding-left: 3%;
  }
  /deep/ .el-checkbox__inner {
    border-radius: 0 !important;
  }
}
</style>