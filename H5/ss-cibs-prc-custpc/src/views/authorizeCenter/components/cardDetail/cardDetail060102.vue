<template>
  <div class="g-card-detail-wrapper">
    <!-- 详情 -->
    <div class="m-head">{{$t('AUTHORIZE.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <!-- 商户别名 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.merchantAlias')}}</div>
          <div class="u-content__item__right">{{dataDep.merchantAlias}}</div>
        </div>
        <div class="u-content__item">
          <!-- 商户类别 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.merchantTypeInfo')}}</div>
          <div class="u-content__item__right">{{merchantTypeInfo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 商户名称 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.merchantName')}}</div>
          <div class="u-content__item__right">{{merchantName}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账单类别 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.billTypeInfo')}}</div>
          <div class="u-content__item__right">{{billTypeInfo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 账单号码 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.billNo')}}</div>
          <div class="u-content__item__right">{{dataDep.billNo}}</div>
        </div>
        <div class="u-content__item">
          <!-- 交易类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.TYPE')}}</div>
          <!-- 我的商户清单 -->
          <div class="u-content__item__right">{{$t('AUTHORIZE.MY_BILLS')}}</div>
        </div>
        <div class="u-content__item">
          <!-- 操作类型 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.operation')}}</div>
          <div class="u-content__item__right">{{dataItem.operationType | operationTypeFilter}}</div>
        </div>
        <div class="u-content__item">
          <!-- 提交时间 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.createTime')}}</div>
          <div class="u-content__item__right">{{dataItem.createTime}}</div>
        </div>
        <div class="u-content__item">
          <!-- 参考编号 -->
          <div class="u-content__item__left">{{$t('AUTHORIZE.flowNo')}}</div>
          <div class="u-content__item__right">{{dataItem.flowNo}}</div>
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
      <authorizetionProcess
        :authStatus="tableData.authState"
        :flowNo="tableData.flowNo"
        :menuCode="tableData.transactionType"
        v-if="isProcess"
      ></authorizetionProcess>
      <authOpinion
        :transactionType="transactionType"
        :dataItem="dataItem"
        :detailData="dataDep"
        :creditType="creditType"
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
import { saveMyMerchantAuth } from '@/api/payService';
import { updateMyMerchantAuth } from '@/api/payService';
import { deleteMyMerchantAuth } from '@/api/payService';
import { otpDialog } from '@/components/messageBox';
import filters from '@/filters/public';
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
    //  res: {
    //   type: Object,
    //   default() {
    //     return {};
    //   }
    // },
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
      transactionType: '',
      processStatus: '', //步骤进度当前的状态
      authActionMessage: '', //授权意见
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      creditType: '',
      merchantTypeInfo: '',
      merchantName: '',
      billTypeInfo: ''
    };
  },
  created() {
    this.dataItem = this.stt ? this.res : this.tableData;
    console.log('this.dataItem---created', this.dataItem);
    this.dataDep = this.stt
      ? JSON.parse(this.dataItem.transactionDescribe)
      : this.dataItem.transactionDescribe;
    this.transactionType = this.dataItem.transactionType;
    this.creditType = '3';
    this.flowNoList.push(this.dataItem.flowNo);
    console.log('上個頁面', this.dataDep);
    const lang = localStorage.getItem('lang');
    this.merchantTypeInfo =
      lang == 'zh-CN'
        ? this.dataDep.merchantTypeInfo
        : lang == 'zh-HK'
        ? this.dataDep.merchantTypeInfoZht
        : this.dataDep.merchantTypeInfoEn;
    this.merchantName =
      lang == 'zh-CN'
        ? this.dataDep.merchantName
        : lang == 'zh-HK'
        ? this.dataDep.merchantNameZht
        : this.dataDep.merchantNameEn;
    this.billTypeInfo =
      lang == 'zh-CN'
        ? this.dataDep.billTypeInfo
        : lang == 'zh-HK'
        ? this.dataDep.billTypeInfoZht
        : this.dataDep.billTypeInfoEn;
    // this.newTableData.push(...this.tableData);
  },
  methods: {
    //授权接口
    async authInit() {
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
      if (this.dataItem.operationType == '1') {
        console.log('---params-------------------1', params);
        const result = await saveMyMerchantAuth(params);
        console.log('result', result);
        // '提交成功'
        if (result.head.returnCode === '000000') {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: { resultList: [result.body.authResultInfo] }
          });
        }
      } else if (this.dataItem.operationType == '2') {
        console.log('---params------------------2', params);
        const result = await updateMyMerchantAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: { resultList: [result.body.authResultInfo] }
          });
        }
      } else {
        console.log('---params------------------2', params);
        const result = await deleteMyMerchantAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.replace({
            path: '/authorizeCenter/result',
            query: { resultList: [result.body.authResultInfo] }
          });
        }
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
      console.log('-----submit', form);
      let custNo = sessionStorage.getItem('custNo');
      // otpDialog({
      //   otpType: "030101",
      //   custNo: custNo,
      //   otpMode:"otp"
      // }).then(()=>{
      this.authInit();
      // })
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