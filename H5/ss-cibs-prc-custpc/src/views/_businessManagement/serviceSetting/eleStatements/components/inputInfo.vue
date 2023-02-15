<template>
  <div class="inputInfo" v-loading="requestLoading">
    <el-table :data="tableData" stripe>
      <el-table-column
        :label="$t('REMITTANCECONFIRM.ACCOUNT')"
        prop="accountNameNo"
        min-width="30%"
      ></el-table-column>
      <el-table-column
        :label="$t('REMITTANCECONFIRM.ACCOUNT_NAME')"
        prop="accountName"
        min-width="30%"
      ></el-table-column>
      <el-table-column
        :label="$t('USER_MANAGERMENT.CATEGORY')"
        prop="stateTypeName"
        min-width="25%"
      ></el-table-column>
      <el-table-column :label="$t('AUTHORIZE.AUTH_STATEMENTS')" min-width="15%">
        <template slot-scope="scope">
          <el-switch class="switch" v-model="scope.row.stateStatus"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt16"
      @size-change="fSizeChange1"
      @current-change="fCurrentChange1"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="[10,20,30,50]"
      layout="prev,pager,next,sizes,total,jumper"
      :total="totalCount"
    />

    <el-row class="flexc mt36">
      <v-button class="mr16" @click="reset">{{$t("COMMON.RESET")}}</v-button>
      <v-button type="primary" @click="submit">{{$t("COMMON.SUBMIT")}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { queryElecState, updateElecState } from '@/api/setServiceQuota.js';
import CONSTANTS from '@/utils/contants.js';
import _ from 'lodash';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      value: false,
      totalCount: 0, //总条数
      tableData: [],
      oldTableData: [],
      currentPage: 0,
      page: {
        currentPage: 1,
        pageSize: 10
      },
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
          label: this.$t('ACCOUNT_MANAGEMENT.SECURITIES')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ]
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  mounted() {
    this.queryStatement();
  },
  methods: {
    //查询列表
    queryStatement() {
      let params = {
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      queryElecState(params).then(resp => {
        if (resp.list.length > 0) {
          resp.list.forEach(item => {
            this.accountTypeList.forEach(type => {
              if (type.value == item.accountType) {
                item.accountTypeName = type.label;
                //  console.log("输出的数据",item.accountTypeName)
              }
            });
            if (item.currency && item.currency != 'null') {
              item.accountNameNo =
                item.accountNo +
                ' ' +
                item.currency +
                ' ' +
                item.accountTypeName;
            } else {
              item.accountNameNo = item.accountNo + ' ' + item.accountTypeName;
            }

            if (item.stateStatus === '0') {
              item.stateStatus = false;
            } else {
              item.stateStatus = true;
            }
            if (item.stateType === 'MONTHLY_STATEMENT') {
              item.stateTypeName = this.$t('AUTHORIZE.AUTH_MONTHLY');
            }
            if (item.stateType === 'REGULAR_BASIS_STATEMENT') {
              item.stateTypeName = this.$t('AUTHORIZE.AUTH_NOTICE');
            }
          });
        }
        this.totalCount = resp.total;
        this.oldTableData = _.cloneDeep(resp.list);
        this.tableData = resp.list;
      });
    },

    //提交
    submit() {
      // console.log('this.oldTableData', this.oldTableData, this.tableData);
      let flag = true;
      let upateArr = [];
      this.oldTableData.forEach((item, index) => {
        if (item.stateStatus !== this.tableData[index].stateStatus) {
          flag = false;
          upateArr.push(this.tableData[index]);
        }
      });
      console.log('upateArr', upateArr);
      if (flag) {
        return this.$confirm({
          message: this.$t('USER_MANAGERMENT.NO_UPDATE'),
          btnText: {
            confirmText: this.$t('COMMON.DETERMINE')
          },
          isCancle: false
        });
      }
      upateArr.forEach(item => {
        if (item.stateStatus) {
          item.stateStatus = '1';
        } else {
          item.stateStatus = '0';
        }
      });
      updateElecState({ eletStateList: upateArr }).then(resp => {
        if (!resp.flag) {
          //true: 修改的对象信息已提交过, false:未提交
          this.$confirm({
            title: this.$t('ACCOUNT_MANAGEMENT.TIPS_TITLE'),
            message: this.$t('USER_MANAGERMENT.ZHONGFU'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        } else {
          this.$emit('next', upateArr);
        }
      });
    },
    fSizeChange1(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.queryStatement();
    },
    fCurrentChange1(current) {
      this.page.currentPage = current;
      this.queryStatement();
    },
    reset() {
      this.queryStatement();
    }
  }
};
</script>
<style lang="scss" scoped>
.inputInfo {
  margin-bottom: 16px;
  .switch {
    position: relative;
    left: -23px;
  }
}
.flexc {
  margin-bottom: 36px;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 23px;
}
/deep/ .el-table th.el-table__cell > .cell {
  margin-left: 24px !important;
}
</style>