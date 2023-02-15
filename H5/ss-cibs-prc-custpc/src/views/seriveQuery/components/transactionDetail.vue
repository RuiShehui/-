<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.TRANSACTION_DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <!-- <div class="m-head">收款人信息</div> -->
      <!-- 付款-行内转账 -->
      <div class="m-content">
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.flowNo') }}</div>
          <div class="m-content__item__right">{{datalist.idPk}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('FUND.TRS_TYPE') }}</div>
          <div class="m-content__item__right">{{ $t('AUTHORIZE.ELE_SETT_SYS') }}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.debitAcctName') }}</div>
          <div class="m-content__item__right">{{datalist.paymentAccount}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.PAYEE_BANK_CODE') }}</div>
          <div class="m-content__item__right">{{datalist.receiveBankCode}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.creditAcctName') }}</div>
          <div class="m-content__item__right">{{datalist.receiveAccount}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.payeeName') }}</div>
          <div class="m-content__item__right">{{datalist.receiveAccountName}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.PAYEE_AMOUNT') }}</div>
          <div
            class="m-content__item__right"
          >{{datalist.receiveAmountCcy}} {{datalist.receiveAmount}}</div>
        </div>
        <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('AUTHORIZE.amount') }}</div>
          <div
            class="m-content__item__right"
          >{{datalist.serviceChargeCcy}} {{datalist.serviceCharge}}</div>
        </div>
        <!-- <div class="m-content__item">
          <div class="m-content__item__left">{{ $t('INTERESTRATEQUERY.createTime') }}</div>
          <div class="m-content__item__right">{{res.submitTtime}}</div>
        </div> -->
      </div>
    </div>

    <div class="btns">
      <v-button size="w160" @click="goList">{{$t('COMMON.BACK')}}</v-button>
    </div>
  </div>
</template>

<script>
import { querySingleTradeDetail } from '@/api/serveQuery.js';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    dataone: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      name: 'sfsdf',
      datalist: {},
      accountNo: '12345',
      accountName: '123451',
      toName: 'sfdsfd',
      toAccountNo: '13245',
      toAccountName: '142542',
      active: 2,
      status: '0',
      isAgree: '0', // 0 同意 1 拒绝
      opinion: '', //授权意见
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      processStatus: '', //步骤进度当前的状态
      pageSize: '',
      currentPage: '',
      total: '',
      dayQuota: '',
      singleQuota: ''
    };
  },
  created() {
    this.datalist = JSON.parse(this.res.transactionDescribe);
    let fmt = this.res.submitTtime;
    this.res.submitTtime =
      fmt.slice(0, 4) +
      '-' +
      fmt.slice(4, 6) +
      '-' +
      fmt.slice(6, 8) +
      '   ' +
      fmt.slice(8, 10) +
      ':' +
      fmt.slice(10, 12) +
      ':' +
      fmt.slice(12, 14);
    
  },
  watch: {
    newTableData: {
      handler(newVal, oldVal) {
        this.watchSome(newVal[0]);
      }
    }
  },
  computed: {
  },
  methods: {
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
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
    line-height: 26px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    .m-left,
    .m-right {
      width: 250px;
      height: 160px;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
     
      float: left;
      position: relative;
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
        line-height: 20px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
      // margin-top: 54px;
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
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
      // margin-top: 54px;
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
      .u-money {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 20px;
        margin-top: 4px;
      }
    }
  }
  &__middle {
    margin-top: 36px;
    .m-content {
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
    padding: 20px 62px 0;
    margin-bottom: 27px;
  }
}
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
.u-mt24 {
  margin-top: 24px;
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
  width: 208px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
  margin-bottom:20px
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
.m-table {
  margin-top: 24px;
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
  width: 90%;
}
</style>