<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <!-- 付款账户 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debitAcctName')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.creditAcct | formatBankNo}} {{dataDep.cur|ccyFilter}} {{dataDep.creditAcctType |acctypeFilter}}</div>
        </div>
        <div class="u-content__item">
          <!-- 手续费扣款账户 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.feeAcct')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.feeAcct | formatBankNo}} {{dataDep.cur|ccyFilter}} {{dataDep.feeAcctType | acctypeFilter}}</div>
        </div>
        <div class="u-content__item">
          <!-- 手续费 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.amount')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.cur}} {{dataDep.serviceCharge |formatMoneyNew }}</div>
        </div>
        <div class="u-content__item" v-if="dataDep.scheduleDate">
          <!-- 预约处理日期 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.scheduleDate')}}</div>
          <div class="u-content__item__right">{{dataDep.scheduleDate}}</div>
        </div>
        <div class="u-content__item" v-if="dataDep.scheduleDate">
          <!-- 重试扣账 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.isRetry')}}</div>
          <!-- '是' '否' -->
          <div
            class="u-content__item__right"
          >{{dataDep.isRetry=='Y'?`${$t('AUTHORIZE.YES')}`:`${$t('AUTHORIZE.NO')}`}}</div>
        </div>
        <div class="u-content__item">
          <!-- 总笔数 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.tradeNumber')}}</div>
          <!-- 笔 -->
          <div class="u-content__item__right">{{dataDep.tradeNumber}}{{$t('AUTHORIZE.PANS')}}</div>
        </div>
        <div class="u-content__item">
          <!-- 总金额 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.ALL_AMOUNT')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.cur}} {{dataDep.tradeAmount |formatMoneyNew }}</div>
        </div>
        <div class="u-content__item">
          <!-- 交易类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.TYPE')}}</div>
          <div class="u-content__item__right">{{dataDep.opType|opTypeFilter }}</div>
        </div>
        <div class="u-content__item" v-if="dataDep.opType">
          <!-- 操作类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.operation')}}</div>
          <div class="u-content__item__right">{{ opFilter(dataDep.opType) }}</div>
        </div>
        <div class="u-content__item">
          <!-- 提交时间 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.createTime')}}</div>
          <div class="u-content__item__right">{{tableData.createTime}}</div>
        </div>
        <div class="u-content__item">
          <!-- 参考编号 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.flowNo')}}</div>
          <div class="u-content__item__right">{{ tableData.flowNo }}</div>
        </div>
        <div class="u-content__item" v-if="isProcess">
          <!-- 授权状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.authState')}}</div>
          <div class="u-content__item__right status">{{tableData.authState | authStateFilter}}</div>
        </div>
        <div class="u-content__item" v-show="scene ==='1' || scene ==='3'">
          <!-- 交易状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.tradeState')}}</div>
          <div class="u-content__item__right status">{{tableData.tradeState | tradeStateFilter}}</div>
        </div>
      </div>
      <div class="m-table" v-if="accountList.length > 0">
        <el-table :data="accountList.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe>
          <el-table-column :label="$t('PAYMENT.RECEIVE_ACCOUNT')" prop="debitAcct"></el-table-column>
          <el-table-column :label="$t('PAYMENT.PAYEE_NAME')" prop="debitAcctName"></el-table-column>
          <el-table-column prop="bankNameTable" :label="$t(`PAYMENT.RECEIVE_BANK`)" width="165">
            <template slot-scope="scope">{{(scope.row.bankNameTable )}}</template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t(`PAYMENT.TRANSFER_AMOUNT`)" >
            <template slot-scope="scope">{{dataDep.cur}} {{scope.row.amount | formatMoneyNew}}</template>
          </el-table-column>
          <el-table-column :label="$t('PAYMENT.POSTSCRIPT')" prop="additionalComment" width="160"></el-table-column>
        </el-table>
        <div class="mt16">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,30,50]"
            :page-size="pageSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="(total)"
          ></el-pagination>
        </div>
      </div>
    </div>
    <authorizetionProcess
      :authStatus="tableData.authState"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
      v-if="isProcess"
    ></authorizetionProcess>
    <authOpinion
      :transactionType="transactionType"
      :creditType="creditType"
      :detailData="dataDep"
      hasAuthorization="0"
      v-if="scene ==='2'"
      @confirm="confirm"
    ></authOpinion>
  </div>
</template>

<script>
import authOpinion from '../authOpinion';
import authorizetionProcess from '../authorizetionProcess';
import { paydayAuth } from '@/api/cashManage';
import filters from '@/filters/public';
import tools from '@/dataTools/tools';
import { otpDialog } from '@/components/messageBox';
import { formatMoneyNew } from '@/utils/tools';
import { bankInfos } from '@/mixins';

let that;
export default {
  components: {
    authOpinion,
    authorizetionProcess
  },
  mixins: [bankInfos],
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    },
    authState: {
      type: String,
      default: ''
    },
    scene: {
      type: String,
      default: '0'
    },
    isProcess: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    isAppointmant: {
      type: Boolean,
      default: false
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    },
    stt: {
      type: String,
      default: ''
    }
  },
  filters: {
    formatfourcard: tools.formatfourcard,
    formatEnScName: tools.formatEnScName,
    formatMoneyNew: formatMoneyNew,
    filtersType: filters.filtersType,
    ...filters,
    showMaxOpinion(val) {
      if (typeof val === 'undefined') return;
      if (val.length <= 30) {
        return val;
      } else {
        return val.substr(0, 30) + '...';
      }
    },
    acctypeFilter(n) {
      if (n == 'SAVING') {
        // '储蓄账户'
        return that.$t('AUTHORIZE.SAVING');
      } else if (n == 'CURRENT') {
        // '往来账户'
        return that.$t('AUTHORIZE.CURRENT');
      } else if (n == 'MULTICURRENCY') {
        // '多种币种储蓄账户'
        return that.$t('AUTHORIZE.MULTICURRENCY');
      } else {
        return n;
      }
    },
    opTypeFilter(n) {
      if (n) {
        return `${that.$t('AUTHORIZE.opType')}-${that.$t(
          'AUTHORIZE.ALL_NEWTRANSTER'
        )}`;
      } else {
        // 批量发薪
        return that.$t('AUTHORIZE.ALL_NEWTRANSTER');
      }
    }
  },
  data() {
    return {
      active: 2,
      dataItem: {}, //
      dataDep: {}, //
      approveList: [],
      status: '0',
      accountList: [],
      //分页数据
      total: null,
      currentPage: 1,
      pageSize: 10,
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      transactionType: '',
      newTableData: [],
      processStatus: '', //步骤进度当前的状态
      authActionMessage: '', //授权意见
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      creditType: ''
    };
  },
  beforeCreate() {
    that = this;
  },
  created() {
    let transactionTypes = this.tableData.transactionType;
    this.dataItem = this.stt ? this.res : this.tableData;
    this.dataDep = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.dataItem.transactionDescribe;
    this.accountList = this.dataDep.bthDetailList || [];
    this.total = this.accountList.length;
    this.creditType = '3';
    this.accountList.map(item => {
      item.bankNameTable = `${item.bankCode} ${
        this.filterBankInfo(item.bankCode)
          ? this.filterBankInfo(item.bankCode)
          : item.bankName
      }`;
    });
    if (transactionTypes == '0303') {
      this.transactionType = '0303';
    } else {
      this.transactionType = '03010501';
    }
  },
  methods: {
    //授权接口
    async authInit() {
      let s = this.dataDep;
      let params = {
        flowNumList: [this.dataItem.flowNo],
        authReqInfo: {
          authActionMessage: this.authActionMessage,
          authActionType: this.authActionType,
          flowNo: this.dataItem.flowNo,
          opType: this.dataItem.operationType
            ? this.dataItem.operationType.charAt(0)
            : null,
          bsnCode: this.dataItem.transactionType,
          ccy: '',
          cry: '',
          cstmNo: '',
          expiration: '',
          feeAccount: '',
          // flowNo: s.batchNo,
          otpType: '',
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        }
      };
      console.log('---params', params);
      let custNo = sessionStorage.getItem('custNo');
      const result = await paydayAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    opFilter(val) {
      switch (val) {
        case '0':
          // '修改'
          return this.$t('AUTHORIZE.UPDATE');
        case '1':
          // '取消'
          return this.$t('AUTHORIZE.CANCLE');
        default:
          return '';
      }
    },
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    confirm(form) {
      if (this.isAppointmant) {
        // 预约交易处理
        this.$emit('appointmant', {
          flowNumList: [this.dataItem.flowNo],
          authReqInfo: {
            authActionType: form.radio,
            authActionMessage: form.opinion,
            flowNo: this.dataItem.flowNo,
            opType: this.dataItem.operationType
              ? this.dataItem.operationType.charAt(0)
              : null,
            bsnCode: this.dataItem.transactionType
          }
        });
      } else {
        // 非预约交易处理
        this.authActionType = form.radio;
        this.authActionMessage = form.opinion;
        console.log('-----submit', form);
        this.authInit();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    filterType(type, cur) {
      return filters.filtersType(type, cur);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  &__middle {
    margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 36px;
      &__item {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        &__left {
          width: 222px;
          text-align: right;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          line-height: 22px;
          // margin-left: 82px;
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          line-height: 22px;
          margin-left: 24px;
        }
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
}
::v-deep .el-pagination .el-pagination__jump {
  margin-left: 10px;
  height: 32px;
  position: relative;
  line-height: 32px;
  font-size: 16px !important;
  color: #595959;
  margin-right: 30px;
}
</style>