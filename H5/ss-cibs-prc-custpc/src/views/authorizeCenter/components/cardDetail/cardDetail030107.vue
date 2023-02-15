<!--
 * @Author: your name
 * @Date: 2022-09-28 17:38:54
 * @LastEditTime: 2022-09-28 17:38:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardDetail\cardDetail030107.vue
-->
<template>
  <div class="g-card-detail-wrapper" v-loading="submits">
    <div v-if="transType == 'INNER'">
      <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
      <div class="g-confirmContent">
        <!-- 收款账户： -->
        <DetailItem :title="$t('AUTHORIZE.creditAcctName')" :content="detailData.payeeAccount"></DetailItem>
        <!-- 收款户名： -->
        <DetailItem :title="$t('AUTHORIZE.payeeName')" :content="detailData.payeeName"></DetailItem>
        <!-- <DetailItem title="使用权限" :content="detailData.payeeName"></DetailItem> -->
        <!-- 操作类型： -->
        <DetailItem :title="$t('AUTHORIZE.operation')" :content="operation"></DetailItem>
        <!-- 交易类型： -->
        <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="getTransType()"></DetailItem>
        <!-- 提交时间： -->
        <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
        <!-- 参考编号： -->
        <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
        <!-- 授权状态： -->
        <DetailItem
          v-if="isProcess"
          :title="$t('AUTHORIZE.authState')"
          :content="tableData.authState | authStateFilter"
        ></DetailItem>
        <!-- 交易状态： -->
        <DetailItem
          :title="$t('AUTHORIZE.tradeState')"
          v-show="scene ==='1' || scene ==='3'"
          :content="tableData.tradeState | tradeStateFilter"
        ></DetailItem>
      </div>
    </div>
    <div v-if="transType == 'EUR'">
      <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
      <div class="g-confirmContent">
        <!-- 收款银行/机构： -->
        <DetailItem :title="$t('AUTHORIZE.payeeBank')" :content="detailData.payeeBank"></DetailItem>
        <!-- 收款户名： -->
        <DetailItem :title="$t('AUTHORIZE.payeeName')" :content="detailData.payeeName"></DetailItem>
        <!-- 收款账户： -->
        <DetailItem :title="$t('AUTHORIZE.creditAcctName')" :content="detailData.payeeAccount"></DetailItem>
        <!-- <DetailItem title="指定用户" :content="detailData.payeeAccount"></DetailItem> -->
        <!-- <DetailItem title="使用权限" :content="detailData.payeeName"></DetailItem> -->
        <!-- 操作类型： -->
        <DetailItem :title="$t('AUTHORIZE.operation')" :content="operation"></DetailItem>
        <!-- 交易类型： -->
        <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="getTransType()"></DetailItem>
        <!-- 提交时间： -->
        <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
        <!-- 参考编号： -->
        <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
        <!-- 授权状态： -->
        <DetailItem
          v-if="isProcess"
          :title="$t('AUTHORIZE.authState')"
          :content="tableData.authState | authStateFilter"
        ></DetailItem>
        <!-- 交易状态： -->
        <DetailItem
          :title="$t('AUTHORIZE.tradeState')"
          v-show="scene ==='1' || scene ==='3'"
          :content="tableData.tradeState | tradeStateFilter"
        ></DetailItem>
      </div>
    </div>
    <div v-if="transType === 'FPS'">
      <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
      <div class="g-confirmContent">
        <!-- 收款人识别方式： -->
        <DetailItem :title="$t('AUTHORIZE.FPStransType')" :content="FPStransType()"></DetailItem>
        <DetailItem :title="`${FPStransType()}：`" :content="FPStrans()"></DetailItem>
        <!-- 收款户名： -->
        <DetailItem :title="$t('AUTHORIZE.payeeName')" :content="detailData.payeeName"></DetailItem>
        <!-- 收款银行/机构： -->
        <DetailItem :title="$t('AUTHORIZE.payeeBank')" :content="FPSpayeeBank()"></DetailItem>
        <!-- 操作类型： -->
        <DetailItem :title="$t('AUTHORIZE.operation')" :content="operation"></DetailItem>
        <!-- 交易类型： -->
        <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="getTransType()"></DetailItem>
        <!-- 提交时间： -->
        <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
        <!-- 参考编号： -->
        <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
        <!-- 授权状态： -->
        <DetailItem
          v-if="isProcess"
          :title="$t('AUTHORIZE.authState')"
          :content="tableData.authState | authStateFilter"
        ></DetailItem>
        <!-- 交易状态： -->
        <DetailItem
          :title="$t('AUTHORIZE.tradeState')"
          v-show="scene ==='1' || scene ==='3'"
          :content="tableData.tradeState | tradeStateFilter"
        ></DetailItem>
      </div>
    </div>
    <div v-if="transType === 'GLOBAL'">
      <!-- 收款人信息 -->
      <div class="m-head">{{$t('AUTHORIZE.RECIVE_MESSAGE')}}</div>
      <div class="g-confirmContent">
        <!-- 收款人名称： -->
        <DetailItem :title="$t('AUTHORIZE.CREDITNAME')" :content="detailData.payeeName"></DetailItem>
        <!-- 收款人地址： -->
        <DetailItem :title="$t('AUTHORIZE.payeeAddress')" :content="detailData.payeeAddress"></DetailItem>
        <!-- 国家/地区： -->
        <DetailItem
          :title="$t('AUTHORIZE.payeeCountryCode')"
          :content="findCountryName(detailData.payeeCountryCode)"
        ></DetailItem>
        <!-- 账户号码/IBAN： -->
        <DetailItem :title="$t('AUTHORIZE.IBAN')" :content="detailData.accountNo"></DetailItem>
      </div>
      <!-- 收款银行信息 -->
      <div class="m-head">{{$t('AUTHORIZE.CREDIT_BANK_MEASSGE')}}</div>
      <div class="g-confirmContent">
        <!-- 收款银行国家/地区： -->
        <DetailItem
          :title="$t('AUTHORIZE.bankCountry')"
          :content="findCountryName(detailData.bankCountry)"
        ></DetailItem>
        <!-- 银行地址： -->
        <DetailItem :title="$t('AUTHORIZE.bankAddress')" :content="detailData.bankAddress"></DetailItem>
        <!-- 银行名称： -->
        <DetailItem :title="$t('AUTHORIZE.bankName')" :content="detailData.bankName"></DetailItem>
      </div>
      <div class="g-confirmContent" style="margin-top:40px">
        <!-- 交易类型： -->
        <DetailItem :title="$t('AUTHORIZE.TYPE')" :content="operation"></DetailItem>
        <!-- 提交时间： -->
        <DetailItem :title="$t('AUTHORIZE.createTime')" :content="tableData.createTime"></DetailItem>
        <!-- 参考编号： -->
        <DetailItem :title="$t('AUTHORIZE.flowNo')" :content="tableData.flowNo"></DetailItem>
        <!-- 授权状态： -->
        <div v-if="isProcess">
          <DetailItem
            :title="$t('AUTHORIZE.authState')"
            :content="tableData.authState | authStateFilter"
          ></DetailItem>
        </div>
        <!-- 交易状态： -->
        <DetailItem
          :title="$t('AUTHORIZE.tradeState')"
          v-show="scene ==='1' || scene ==='3'"
          :content="tableData.tradeState | tradeStateFilter"
        ></DetailItem>
      </div>
    </div>
    <!-- 授权流程 -->
    <div class="m-head" v-if="isProcess">{{$t('AUTHORIZE.isProcess')}}</div>
    <authorizetionProcess
      :authStatus="tableData.authState"
      :flowNo="tableData.flowNo"
      :menuCode="tableData.transactionType"
      v-if="isProcess"
    ></authorizetionProcess>
    <authOpinion
      :transactionType="transactionType"
      :creditType="creditType"
      :detailData="detailDataAll"
      class="mgt20"
      v-if="scene ==='2'"
      @confirm="sumbitAuth"
    />
  </div>
</template>

<script>
import authorizetionProcess from '../authorizetionProcess';
import countryInfos from '@/mixins/countryInfos';
import authOpinion from '../authOpinion';
import filters from '@/filters/public';
import { action } from '@/api/public.js';
import { otpDialog } from '@/components/messageBox';
import { SELECT_BANK_TYPES } from '@bank-transfer/utils/constant';
import { bankInfos } from '@/mixins';
export default {
  name: 'CardDetail030107',
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
  mixins: [countryInfos, bankInfos],
  computed: {
    operation: {
      set(newVal) {
        console.log(newVal, 'newVal');
        const operaArr = newVal.split(':');
        this.transType = operaArr[operaArr.length - 1];
        this.operationType = operaArr[0];
      },
      get() {
        return `${this.getOperateType()}`;
      }
    }
  },
  components: {
    authorizetionProcess,
    authOpinion
  },
  filters,
  data() {
    return {
      transType: '',
      operationType: '',
      submits: false,
      detailData: {},
      detailDataAll: {},
      SELECT_BANK_TYPES,
      transactionType: '',
      creditType: '3'
    };
  },
  created() {
    if (this.stt) {
      this.tableData.authState = this.res.authState;
    }
    console.log(this.tableData, 'table');
    this.detailData = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    this.detailDataAll = this.stt ? this.res : this.tableData;
    this.operation = this.stt
      ? this.res.operationType
      : this.tableData.operationType;
    this.tableData.operationType = this.stt
      ? this.res.operationType
      : this.tableData.operationType;
    console.log(this.operation, 'operation');
    switch (this.tableData.operationType) {
      case '2:INTER:FPS':
        this.transactionType = '030102012';
        break;
      case '1:INNER':
        this.transactionType = '0301011';
        break;
      case '2:INNER':
        this.transactionType = '0301012';
        break;
      case '3:INNER':
        this.transactionType = '0301013';
        break;
      case '1:INTER:FPS':
        this.transactionType = '030102011';
        break;
      case '3:INTER:FPS':
        this.transactionType = '030102013';
        break;
      case '1:INTER:EUR':
        this.transactionType = '030102021';
        break;
      case '2:INTER:EUR':
        this.transactionType = '030102022';
        break;
      case '3:INTER:EUR':
        this.transactionType = '030102023';
        break;
      case '1:GLOBAL':
        this.transactionType = '0301031';
        break;
      case '2:GLOBAL':
        this.transactionType = '0301032';
        break;
      case '3:GLOBAL':
        this.transactionType = '0301033';
        break;
    }
    console.log(this.transactionType, 'transactionType');
  },
  methods: {
    getTransType() {
      // '登记第三者账户-'
      const text = this.$t('AUTHORIZE.THIRED_ACCOUNT');
      switch (this.transType) {
        case 'INNER':
          // 行内转账
          return `${text}${this.$t('AUTHORIZE.INNER')}`;
        case 'GLOBAL':
          // 电汇
          return `${text}${this.$t('AUTHORIZE.GLOBAL')}`;
        case 'FPS':
          // 转数快
          return `${text}${this.$t('AUTHORIZE.FPS')}`;
        case 'EUR':
          // 外币转账
          return `${text}${this.$t('AUTHORIZE.EUR')}`;
        default:
          return this.transType;
      }
    },
    getOperateType() {
      switch (this.operationType) {
        case '1':
          // '新增'
          return this.$t('AUTHORIZE.ADD');
        case '2':
          // '修改'
          return this.$t('AUTHORIZE.UPDATE');
        case '3':
          //  '删除'
          return this.$t('AUTHORIZE.DELETE');
        default:
          return this.operationType;
      }
    },
    // 收款人识别方式
    FPStransType() {
      switch (this.detailData.payeeIdentifyMethod) {
        case 'BBAN':
          // '收款账户'
          return this.$t('AUTHORIZE.creditAcctName');
        case 'MOBN':
          // '流动电话号码'
          return this.$t('AUTHORIZE.MOBN');
        case 'EMAL':
          // '电邮地址'
          return this.$t('AUTHORIZE.EMAL');
        case 'SVID':
          return 'FPS ID';
        default:
          return this.detailData.payeeIdentifyMethod;
      }
    },
    // FPS对应收款银行
    FPSpayeeBank() {
      console.log('this.detailData', this.detailData);
      if (this.detailData.payeeIdentifyMethod === 'SVID') {
        return (
          this.detailData.payeeBankCode +
          ' ' +
          this.filterBankInfo(this.detailData.payeeBankCode)
        );
      } else if (
        this.detailData.payeeIdentifyMethod === 'MOBN' ||
        this.detailData.payeeIdentifyMethod === 'EMAL'
      ) {
        if (this.detailData.selectBankType === 'PRE') {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        } else if (this.detailData.selectBankType === 'DEF') {
          return '041 ' + this.$t('PAYMENT.CHUANGXING_BANK');
        } else if (this.detailData.selectBankType === 'OPT') {
          return (
            this.detailData.payeeBankCode +
            ' ' +
            this.filterBankInfo(this.detailData.payeeBankCode)
          );
        }
      } else {
        return (
          this.detailData.payeeBankCode +
          ' ' +
          this.filterBankInfo(this.detailData.payeeBankCode)
        );
      }
    },
    // 对应识别方式取值
    FPStrans() {
      switch (this.detailData.payeeIdentifyMethod) {
        case 'BBAN':
          return this.detailData.payeeAccount;
        case 'MOBN':
          return this.detailData.mobilePhone;
        case 'EMAL':
          return this.detailData.emailAddress;
        case 'SVID':
          return this.detailData.fpsId;
        default:
          return this.detailData.payeeIdentifyMethod;
      }
    },
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    async sumbitAuth(form) {
      let flowNo = this.tableData.flowNo;
      let params = {
        authActionType: form.radio,
        authActionMessage: form.opinion,
        flowNo: this.tableData.flowNo,
        opType: this.tableData.operationType
          ? this.tableData.operationType.charAt(0)
          : null,
        bsnCode: this.transactionType,
        authReqInfo: {
          authActionType: form.radio,
          authActionMessage: form.opinion,
          flowNo: this.tableData.flowNo,
          opType: this.tableData.operationType
            ? this.tableData.operationType.charAt(0)
            : null,
          bsnCode: this.tableData.transactionType,
          flowNoList: [flowNo]
        },
        flowNoList: [flowNo]
      };
      let custNo = sessionStorage.getItem('custNo');
      const result = await action(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
      // action(params)
      //   .then(res => {
      //     console.log(res, '第三者');
      //     if (res) {
      //       this.$router.replace({
      //         path: '/authorizeCenter/result',
      //         query: { resultList: [res.authResultInfo] ,operationType:this.operation},
      //       });
      //       // this.$router.go(-1);
      //       // '提交成功'
      //       this.$message({
      //         type: 'success',
      //         message: this.$t('AUTHORIZE.Success'),
      //         delay: 3000
      //       });
      //       // this.$router.go(-1);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err, 'err');
      //   });
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
.g-confirmContent {
  margin-left: 16%;
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  // margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.m-author {
  margin-top: 24px;
}
</style>