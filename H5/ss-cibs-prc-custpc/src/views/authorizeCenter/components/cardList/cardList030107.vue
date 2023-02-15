<template>
<!-- 登记第三者账户 -->
  <card-list-left :title="$t('AUTHORIZE.THIRED_ACCOUNT')" :state="item.authState">
    <template slot="first">
      <!-- 收款人名称 -->
      <div>
        <span>{{$t('AUTHORIZE.CREDITNAME')}} : </span>
        <span>{{ cardData.payeeName }}</span>
      </div>
      <!-- 收款人识别方式 -->
      <div>
        <span>{{ `${accountTypeShow}：` }}</span>
        <span>{{ accountShow }}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 收款银行 -->
      <div>
        <span>{{$t('AUTHORIZE.CUT_BANK')}} : </span>
        <span v-if="transType !== 'GLOBAL'">{{ payeeBank }}</span>
        <span v-else>{{ cardData.bankName }}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 操作类型 -->
      <div>
        <span>{{$t('AUTHORIZE.operation')}} : </span>
        <span>{{ operationType }}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { countryInfos, bankInfos } from '@/mixins';
import { cardListMixin } from '@auth/service/mixins';
import { SELECT_BANK_TYPES } from '@bank-transfer/utils/constant';

export default {
  name: 'CardList030107',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mixins: [countryInfos, bankInfos, cardListMixin],
  data() {
    return {
      transType: '',
      operateType: '',
      SELECT_BANK_TYPES
    };
  },
  created() {
    this.init();
  },
  computed: {
    operationType() {
      return `${this.getOperate()}`;
    },
    payeeBank(){
      if (
        this.cardData.payeeIdentifyMethod === 'MOBN' ||
        this.cardData.payeeIdentifyMethod === 'EMAL'
      ) {
        if (this.cardData.selectBankType === this.SELECT_BANK_TYPES.PRE) {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        }
        if (this.cardData.selectBankType === this.SELECT_BANK_TYPES.DEF) {
          return '041 ' + this.$t('PAYMENT.CHUANGXING_BANK');
        }
        if (this.cardData.selectBankType === this.SELECT_BANK_TYPES.OPT){
          return this.cardData.payeeBankCode+ ' ' + this.filterBankInfo(this.cardData.payeeBankCode)
        }
      } else {
        return this.cardData.payeeBankCode+ ' ' +this.filterBankInfo(this.cardData.payeeBankCode);
      }
    },
    accountShow() {
      switch (this.transType) {
        case 'INNER':
          return this.cardData.payeeAccount;
        case 'GLOBAL':
          return this.cardData.accountNo;
        case 'FPS':
          return this.FPStrans();
        case 'EUR':
          return this.cardData.payeeAccount;
        default:
          return '';
      }
    },
    accountTypeShow() {
      switch (this.transType) {
        case 'FPS':
          return this.FPStransType();
        default:
          // '账户号码/IBAN'
          return this.$t('AUTHORIZE.IBAN') ;
      }
    }
  },
  methods: {
    init() {
      if (this.item) {
        this.cardData = this.item.transactionDescribe;
        const operaArr = this.item.operationType.split(':');
        this.operateType = operaArr[0];
        this.transType = operaArr[operaArr.length - 1];
      }
    },
    FPStrans() {
      switch (this.cardData.payeeIdentifyMethod) {
        case 'BBAN':
          return this.cardData.payeeAccount;
        case 'MOBN':
          return this.cardData.mobilePhone;
        case 'EMAL':
          return this.cardData.emailAddress;
        case 'SVID':
          return this.cardData.fpsId;
      }
    },
    FPStransType() {
      switch (this.cardData.payeeIdentifyMethod) {
        case 'BBAN':
          // '收款账户'
          return this.$t('AUTHORIZE.creditAcctName');
        case 'MOBN':
          // '流动电话号码'
          return this.$t('AUTHORIZE.MOBN') ;
        case 'EMAL':
          // '电邮地址'
          return this.$t('AUTHORIZE.EMAL') ;
        case 'SVID':
          return 'FPS ID';
      }
    },
    getTransType() {
      switch (this.transType) {
        case 'INNER':
          // '行内转账'
          return this.$t('AUTHORIZE.INNER') ;
        case 'GLOBAL':
          // '电汇'
          return this.$t('AUTHORIZE.GLOBAL') ;
        case 'FPS':
          // '本地跨行-转数快'
          return this.$t('AUTHORIZE.LOCAL_FPS') ;
        case 'EUR':
          // 本地跨行-外币转账'
          return this.$t('AUTHORIZE.LOCAL_EUR') ;
        default:
          return '';
      }
    },
    getOperate() {
      switch (this.operateType) {
        case '1':
          // '登记'
          return this.$t('AUTHORIZE.RESIGTER') ;
        case '2':
          // '修改'
          return this.$t('AUTHORIZE.UPDATE') ;
        case '3':
          // '删除'
          return this.$t('AUTHORIZE.DELETE') ;
        default:
          return '';
      }
    }
  }
};
</script>