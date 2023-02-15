<template>
  <div class="g-card-detail-wrapper">
    <!-- 详情 -->
    <div class="m-head">{{$t('AUTHORIZE.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <!-- 付款账户 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.debitAcctName')}}</div>
          <div
            class="u-content__item__right"
          >{{dataDep.payAccount | formatBankNo}} {{dataDep.currency | ccyFilter}}</div>
        </div>
        <div class="u-content__item">
          <!-- 商户类别 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.merchantTypeInfo')}}</div>
          <div class="u-content__item__right">{{dataDep.merchantTypeInfo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 商户名称 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.merchantName')}}</div>
          <div class="u-content__item__right">{{dataDep.merchantName}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账单类别 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.billTypeInfo')}}</div>
          <div class="u-content__item__right">{{dataDep.billTypeInfo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账单号码 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.billNo')}}</div>
          <div class="u-content__item__right">{{dataDep.billNo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 交易金额 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.CHANGE_AMOUNT')}}</div>
          <div class="u-content__item__right">{{dataDep.currency}} {{dataDep.tranAmt}}</div>
        </div>
        <div class="u-content__item">
          <!-- 缴付日期 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.payDate')}}</div>
          <div class="u-content__item__right">{{dataDep.payDate}}</div>
        </div>
        <div class="u-content__item">
          <!-- 交易类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.TYPE')}}</div>
          <!-- 预约缴付管理-缴付账单 -->
          <div class="u-content__item__right">{{$t('AUTHORIZE.YU_CHECK_DAN')}}</div>
        </div>
        <div class="u-content__item">
          <!-- 操作类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.operation')}}</div>
          <div class="u-content__item__right">{{operationType}}</div>
        </div>
        <div class="u-content__item">
          <!-- 提交时间 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.createTime')}}</div>
          <div class="u-content__item__right">{{this.dataItem.createTime}}</div>
        </div>
        <div class="u-content__item">
          <!-- 参考编号 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.flowNo')}}</div>
          <div class="u-content__item__right">{{this.dataItem.flowNo}}</div>
        </div>
        <div class="u-content__item" v-if="isProcess">
          <!-- 授权状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.authState')}}</div>
          <div
            class="u-content__item__right"
            style="color:#F06B00"
          >{{tableData.authState | authStateFilter}}</div>
        </div>
        <div class="u-content__item" v-show="scene ==='1' || scene ==='3'">
          <!-- 交易状态 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.tradeState')}}</div>
          <div class="u-content__item__right status">{{tableData.tradeState | tradeStateFilter}}</div>
        </div>
      </div>
      <authorizetionProcess
        :authStatus="tableData.authState"
        :flowNo="tableData.flowNo"
        :menuCode="tableData.transactionType"
        v-if="isProcess"
      ></authorizetionProcess>
      <authOpinion
        :creditType="creditType"
        :transactionType="transactionType"
        :detailData="dataDep"
        hasAuthorization="0"
        v-if="scene ==='2'"
        @confirm="confirm"
      ></authOpinion>
    </div>
  </div>
</template>

<script>
import authOpinion from '../authOpinion';
import authorizetionProcess from '../authorizetionProcess';
import { subscribePayModifyAuth } from '@/api/payService';
import { subscribePayCancelAuth } from '@/api/payService';
import { currencyExchangeDetails } from '@/api/internationalBusiness';
import filters from '@/filters/public';
import { otpDialog } from '@/components/messageBox';
import { orderPayTranAuth } from '@/api/payService';
import mathTools from '@/utils/mathTools.js';
export default {
  components: {
    authOpinion,
    authorizetionProcess
  },
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
    ...filters,
    showMaxOpinion(val) {
      if (typeof val === 'undefined') return;
      if (val.length <= 30) {
        return val;
      } else {
        return val.substr(0, 30) + '...';
      }
    }
  },
  data() {
    return {
      active: 2,
      dataItem: {}, //
      dataDep: {}, //
      amountCredited: '',
      creditAcctName: '',
      debitAcctName: '',
      approveList: [],
      status: '0',
      accountList: [],
      one: '',
      two: '',
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      flowNoList: [],
      processStatus: '', //步骤进度当前的状态
      authActionMessage: '', //授权意见
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      operationType: '',
      transactionType: '',
      creditType: ''
    };
  },
  created() {
    this.dataItem = this.stt ? this.res : this.tableData;
    console.log(this.c, ' this.dataItemssssssssss');
    this.dataDep = this.stt
      ? JSON.parse(this.dataItem.transactionDescribe)
      : this.dataItem.transactionDescribe;
    this.transactionType = this.dataItem.transactionType;
    // '新增'
    if (this.dataItem.operationType == '1') {
      this.operationType = this.$t('AUTHORIZE.ADD');
      this.dataDep = this.dataDep.transactionDescribe;
    } else if (this.dataItem.operationType == '2') {
      // '修改'
      this.operationType = this.$t('AUTHORIZE.UPDATE');
      this.dataDep = this.stt
        ? JSON.parse(this.dataDep.origData)
        : JSON.parse(this.dataDep.origData);
    } else {
      // '取消'
      this.operationType = this.$t('AUTHORIZE.CANCLE');
      this.dataDep = this.stt
        ? JSON.parse(this.dataDep.origData)
        : JSON.parse(this.dataDep.origData);
    }
    this.flowNoList.push(this.dataItem.flowNo);
    this.creditType = '3';
    this.dataDep.tranAmt = String(this.dataDep.tranAmt).toMoney();
    let brr = this.dataDep.tranAmt.toString();
    this.dataDep.tranAmt = mathTools.moneyCheck(brr);
    const lang = localStorage.getItem('lang');
    let detail = this.stt
      ? JSON.parse(this.dataItem.transactionDescribe)
      : this.dataItem.transactionDescribe;
    this.dataDep.merchantTypeInfo =
      lang == 'zh-CN'
        ? detail.merchantTypeInfo
        : lang == 'zh-HK'
        ? detail.merchantTypeInfoZht
        : detail.merchantTypeInfoEn;
    this.dataDep.merchantName =
      lang == 'zh-CN'
        ? detail.merchantName
        : lang == 'zh-HK'
        ? detail.merchantNameZht
        : detail.merchantNameEn;
    this.dataDep.billTypeInfo =
      lang == 'zh-CN'
        ? detail.billTypeInfo
        : lang == 'zh-HK'
        ? detail.billTypeInfoZht
        : detail.billTypeInfoEn;
  },
  methods: {
    //授权接口
    async authInit(s, params) {
      console.log('---params', params);
      const result = await subscribePayModifyAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    async authInitone(s, params) {
      console.log('---params', params);
      const result = await subscribePayCancelAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    async authInittwo(s, params) {
      console.log('---params', params);
      const result = await orderPayTranAuth(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    confirm(form) {
      this.authActionType = form.radio;
      this.authActionMessage = form.opinion;
      let s = this.dataDep;
      let params = {
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
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        },
        account: '',
        amount: 0,
        entType: '',
        flowNoList: this.flowNoList,
        riskFlag: this.dataDep.riskFlag,
        t24CustNo: '',
        total: '',
        totalMoney: ''
      };
      let paramsone = {
        authReqInfo: {
          authActionMessage: this.authActionMessage,
          authActionType: this.authActionType,
          flowNo: this.dataItem.flowNo,
          opType: '1',
          bsnCode: this.dataItem.transactionType,
          ccy: '',
          cry: '',
          cstmNo: '',
          expiration: '',
          feeAccount: '',
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        },
        account: '',
        amount: 0,
        entType: '',
        flowNoList: this.flowNoList,
        riskFlag: this.dataDep.riskFlag,
        t24CustNo: '',
        total: '',
        totalMoney: ''
      };
      console.log('-----submit', form);
      let custNo = sessionStorage.getItem('custNo');
      if (this.dataItem.operationType == '2') {
        this.authInit(s, params);
      } else if (this.dataItem.operationType == '1') {
        this.authInittwo(s, paramsone);
      } else {
        this.authInitone(s, params);
      }
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
    // margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      // margin-top: 36px;
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