<template>
  <div class="g-comfirm">
    <div class="g-confirmContent">
      <DetailItem :title="$t('ACCOUNT_MANAGEMENT.CURRENT')" :content="acoutContect"></DetailItem>
      <DetailItem :title="$t('HEAD.Delivery_method')" :content="formData.getWay"></DetailItem>
      <DetailItem
        v-if="formData.authoA"
        :title="$t('TRANSFR_INFO.A_AUTHOR')"
        :content="formData.authoA"
      ></DetailItem>
      <DetailItem
        v-if="formData.authoB"
        :title="$t('TRANSFR_INFO.B_AUTHOR')"
        :content="formData.authoB"
      ></DetailItem>
      <DetailItem
        v-if=" formData.authoC"
        :title="$t('TRANSFR_INFO.C_AUTHOR')"
        :content="formData.authoC"
      ></DetailItem>
    </div>

    <el-row class="u-btn mt36">
      <v-button type size="w160" @click="back" class="mlr15">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
      <v-button
        type="primary"
        size="w160"
        @click="next"
        v-loading.fullscreen.lock="loading"
      >{{ $t('COMMON.CONFIRM') }}</v-button>
    </el-row>

    <div class="u-tips">
      <p class="u-title">{{ $t('TIPS.Tips') }}</p>
      <ul class="u-content">
        <li>{{ $t('TIPS.Tips_one') }}</li>
        <li>{{ $t('TIPS.Tips_two') }}</li>
        <li>{{ $t('TIPS.Tips_three') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { chequeBookSubmit, chequeBookAuth } from '@/api/applyCheckbook';
export default {
  inject: ['scrollToTop'],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          account: '',
          getWay: '',
          tips: [],
          authInfo: {}
        };
      }
    }
  },
  data() {
    return {
      chequeBook: {},
      flag: false, //标识是否需要授权
      loading: false
    };
  },
  created() {
    console.log('数据', this.formData);
  },
  mounted() {
    this.scrollToTop();
  },
  computed: {
    acoutContect() {
      let accountType = '';
      let dd = this.formData.data.accountNo;
      switch (this.formData.data.accountType) {
        case 'SAVING':
          accountType = this.$t('ACCOUNT_MANAGEMENT.SAVING');
          break;
        case 'MULTICURRENCY':
          accountType = this.$t('TRANSFR_INFO.MULTICURRENCY');
          break;
        case 'CURRENT':
          accountType = this.$t('ACCOUNT_MANAGEMENT.CURRENT');
          break;
        case 'FIXED':
          accountType = this.$t('ACCOUNT_MANAGEMENT.FIXED');
          break;
        case 'LOAN':
          accountType = this.$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TITLE');
          break;
        case 'SECURITES':
          accountType = this.$t('ACCOUNT_MANAGEMENT.SECURITIES');
          break;
        case 'INVESTMENT':
          accountType = this.$t('ACCOUNT_MANAGEMENT.INVESTMENT');
          break;
      }
      let s = dd.slice(0, 3) + '-' + dd.slice(5, 7) + '-' + dd.slice(7);
      return `${s} ${this.formData.data.currency} ${accountType}`;
    }
  },
  methods: {
    back() {
      this.$emit('back', this.formData);
    },
    //需要授权接口
    async chequeBookAuthInit() {
      let params = {
        body: {
          flowNoList: []
        },
        authReqInfo: {
          authActionMessage: this.chequeBook.authResultInfo.authActionMessage,
          authActionType: '',
          bsnCode: this.chequeBook.authResultInfo.bsnCode,
          cstmNo: '',
          expiration: '',
          feeAccount: '',
          flowNo: this.chequeBook.authResultInfo.flowNo,
          opType: '',
          payAccount: '',
          totalNum: '',
          transAmount: 0,
          transDetail: '',
          userCode: '',
          userLevel: '',
          userName: ''
        }
      };
      const res = await chequeBookAuth(params);
    },
    async chequeBookSubmitinit() {
      this.loading = true;
      const { accountNo, accountType, currency } = this.formData.data;
      let params = {
        accountNo, //账户号码
        // accountType,//账户类型编码
        currency //币种
        // drawMeth:'1'//领取方式
      };
      chequeBookSubmit(params)
        .then(res => {
          console.log(res);
          if (res.body !== null) {
            this.chequeBook = res.body;
            this.loading = false;
            if (res.body.authResultInfo.authResultState == '03') {
              this.chequeBook.flag = true;

            } else {
              this.chequeBook.flag = false;
            }
            this.$emit('next', this.chequeBook);
            console.log('----', this.chequeBook);
          } else {
            this.$emit('next', res.head.returnMessage);
          }
        })
        .catch(err => {

        });
    },
    next() {
      this.chequeBookSubmitinit();
      // if(status.body){
      //   this.$emit('next');
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-btn {
  display: flex;
  margin-left: 35%;
}
.g-confirmContent {
  margin-left: 18%;
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  // margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.u-tips {
  margin-top: 240px;
  .u-title {
    color: rgba($color: #000000, $alpha: 0.85);
    font-size: 14px;
  }
  .u-content {
    color: rgba($color: #000000, $alpha: 0.45);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
  }
}
</style>