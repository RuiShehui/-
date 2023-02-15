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
            :disabled="item.soleDisabled"
            class="accountCheck"
            v-model="item.checked"
            @change="selectChecked"
          >{{item.accName}}</el-checkbox>
        </div>
      </div>
    </div>

    <div class="mb20" v-if="accountObj.operator.cuSoleAuthorizerInd === '1'">
      <div style="clear:both">
        <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ONEC_ACCOUNT')" />
      </div>
      <el-table :data="tableData" stripe>
        <el-table-column :label="$t('USER_MANAGEMENT.PRIVILEGED_ACCOUNT')" prop="accName" align="left" min-width="50%"></el-table-column>
        <el-table-column :label="$t('USER_MANAGEMENT.QUOTA')" prop="accLimitDaily" align="left" min-width="50%"></el-table-column>
      </el-table>
    </div>
    <div class="flexc mt36">
      <v-button @click="$emit('back', accountObj)" class="mr16">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
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
  queryAccount,
  queryUserAccountLimit,
  checkAccountLimit,
  queryCstUserAcctList
} from '@/api/userManagement';
import { formatTreeData, deepClone, unique } from '@/utils/tree-table.js';
import mathTool from '@/utils/mathTools.js';
import filters from "@/filters/public.js"
export default {
  props: {
    accountObj: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  filters,
  data() {
    return {
      accountList: [], //账户数组
      allChecked: false, //全选
      tableData: [],
       accountTypeList: [
        {
          value: '',
          label: this.$t('RIGHTS_TEMPLATE.ALL')
        },
        {
          value: 'SAVING',
          label: this.$t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
        },
        {
          value: 'MULTICURRENCY',
          label: this.$t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
        },
        {
          value: 'CURRENT',
          label: this.$t('USER_MANAGEMENT.CURRENT_ACCOUNT')
        },
        {
          value: 'FIXED',
          label: this.$t('USER_MANAGEMENT.FIXED')
        },
        {
          value: 'LOAN',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'SECURITIES',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ]
    };
  },

  created() {},

  mounted() {
    console.log('accountObj', this.accountObj.operator.cuSoleAuthorizerInd);
    if (this.accountObj.operator.cuSoleAuthorizerInd === '1') {
      if (this.accountObj.operator.userAccountLimits.length > 0) {
        this.accountObj.operator.userAccountLimits.forEach(item => {
          item.accLimitDaily = tool.currencyFormat(item.limitDaily, '', 2);
          console.log(item,'item')
          this.accountTypeList.forEach(accountItem => {
            if (item.accountType === accountItem.value) {
              item.accountTypeName = accountItem.label;
            }
            if (item.currencyType) {
              item.accName =
                this.formatAccountNo(item.accountNo) +
                '-' +
               filters.ccyFilter(item.currencyType)  +
                '-' +
                (item.accountTypeName?item.accountTypeName: '');
            } else {
              item.accName =this.formatAccountNo(item.accountNo)  + '-' +  (item.accountTypeName?item.accountTypeName: '');
            }
          });
        });
      }
      this.tableData = this.accountObj.operator.userAccountLimits;
    } else {
      this.tableData = [];
    }
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
      self.accountList = [];
      let params = {
        userCode: self.accountObj.operator.userCode
      };
      Promise.all([queryAccount(), queryCstUserAcctList(params)]).then(resp => {
        console.log('resp', resp);
        // resp[1].acctList = resp[0].accountInfoList;
        let uniqueList = resp[1].acctList.filter((item, index) => {
          return (
            resp[1].acctList.findIndex(
              item1 => item1.accountCode == item.accountCode
            ) == index
          );
        });
        if (resp[0].accountInfoList.length > 0) {
          resp[0].accountInfoList.forEach(item => {
            item.checked = false;
            item.soleDisabled = false;
            this.accountTypeList.forEach(accountItem => {
              if (item.accountType === accountItem.value) {
                item.accountTypeName = accountItem.label;
              }
              if (item.currencyType) {
                item.accName =
                  this.formatAccountNo(item.accountNo) +
                  '-' +
                  filters.ccyFilter(item.currencyType)   +
                  '-' +
                  (item.accountTypeName?item.accountTypeName: '');
              } else {
                item.accName = this.formatAccountNo(item.accountNo) + '-' + (item.accountTypeName?item.accountTypeName: '');
              }
            });
            if (uniqueList.length > 0) {
              uniqueList.forEach(unItem => {
                if (
                  item.accountNo == unItem.accountNo &&
                  item.currencyType == unItem.currencyType &&
                  item.accountType == unItem.accountType
                ) {
                  return (item.checked = true);
                }
              });
            }
            if (this.tableData && this.tableData.length > 0) {
              this.tableData.forEach(soleItem => {
                if (
                  item.accountNo == soleItem.accountNo &&
                  item.currencyType == soleItem.currencyType &&
                  item.accountType == soleItem.accountType
                ) {
                  item.checked = true;
                  item.soleDisabled = true;
                  return;
                }
              });
            }
            this.accountList.push(item);
          });
          this.allSelect();
        }
      });
    },

    //查询判断是否全选
    allSelect() {
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
    },

    //下一步
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
    },
     formatAccountNo(val) {
      return mathTool.formatBankNo(val);
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
// .el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
// .el-table .el-table__body /deep/.el-table__cell /deep/.cell {
//   margin-left: 18px;
// }
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