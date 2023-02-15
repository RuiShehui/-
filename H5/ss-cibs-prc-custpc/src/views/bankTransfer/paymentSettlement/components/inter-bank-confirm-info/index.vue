<!-- 转数块/ 外币转账 — 确认转账信息页-->
<template>
  <div v-loading="formLoading" class="g-confirmData">
    <div class="pdf-wrapper" ref="pdf">
      <div class="m-confirm flexc mb36 pt12">
        <div class="m-confirm-left">
          <span class="tag">{{ $t('PAYMENT.PAYMENT_ACCOUNT') }}</span>
          <!-- 付款户名 -->
          <p class="f16 pb5">{{ confirmData.debitAcctName }}</p>
          <!-- 付款账户 币种 -->
          <p class="f16 pb5">{{ `${formatAcctNo(confirmData.debitAcct)} ${confirmData.ccy}` }}</p>
          <!-- 账户类型 -->
          <p class="f16 pb15">{{ confirmData.accountType | processAccountType }}</p>
          <!-- 付款账户银行 -->
          <p class="f14 rgba45">
            <span>
              {{ $t('PAYMENT.CHUANGXING_BANK_CPY') }}
              <!--
              {{
                findBankName(confirmData.bankInstitution) ||
                  confirmData.debitBankName
              }}
              -->
            </span>
          </p>
        </div>
        <div class="m-confirm-center">
          <!-- 币种 金额 -->
          <p class="f20 fw700">
            <span>{{ `${confirmData.ccy} ` }}</span>
            <span>{{ confirmData.amount | formatMoney }}</span>
          </p>
        </div>
        <div class="m-confirm-right">
          <span class="tag">{{ $t('PAYMENT.RECEIVE_ACCOUNT') }}</span>
          <div v-if="payType === 'localtransfer'">
            <!-- 收款户名 -->
            <p class="f16 pb5">{{ confirmData.creditAcctName }}</p>
            <!-- 收款账户 -->
            <p class="f16 pb5">{{ `${formatAcctNo(confirmData.creditAcct)} ${confirmData.ccy}` }}</p>
            <!-- 收款账户类型 -->
            <p class="f16 pb15">{{ confirmData.creditAcctLabel | processAccountType }}</p>
            <!-- 收款账户银行 -->
            <p class="f14 rgba45">{{ filterBankInfo(confirmData.creditBankCode) }}</p>
          </div>
          <div v-else>
            <div
              v-if="
                confirmData.creditAcctIdentificationType ===
                  IDENTIFY_WAY_MAP.payeeAccount ||
                  confirmData.creditAcctIdentificationType ===
                    IDENTIFY_WAY_MAP.creditCard
              "
            >
              <!-- 收款账户 -->
              <p class="f16 pb5">{{ confirmData.creditAcctName }}</p>
              <p class="f16 pb5">{{ confirmData.creditAcct }}</p>
              <p
                class="f16 pb15"
                v-if="payType !== 'fast'"
              >{{ confirmData.creditorType | processAccountType }}</p>
              <p class="f14 rgba45">{{ findBankName(confirmData.creditBankInstitution) }}</p>
            </div>
            <div
              v-if="
                confirmData.creditAcctIdentificationType ===
                  IDENTIFY_WAY_MAP.emailAddress ||
                  confirmData.creditAcctIdentificationType ===
                    IDENTIFY_WAY_MAP.mobilePhone
              "
            >
              <!-- 电邮地址 /流动电话号码-->
              <p class="f16 pb5">{{ confirmData.identifyWay }}</p>
              <p class="f16 pb15">
                {{
                confirmData.creditAcctIdentificationType ===
                IDENTIFY_WAY_MAP.emailAddress
                ? confirmData.emailAddress
                : confirmData.flowNumber
                }}
              </p>
              <p class="f14 rgba45">
                {{
                confirmData.designBank === SELECT_BANK_TYPES.DEF
                ? ''
                : filterBankInfo(confirmData.creditBankInstitution)
                }}
              </p>
            </div>
            <div
              v-if="
                confirmData.creditAcctIdentificationType ===
                  IDENTIFY_WAY_MAP.fpsId
              "
            >
              <!-- FPS ID -->
              <p class="f16 pb5">{{ confirmData.identifyWay }}</p>
              <p class="f16 pb5">{{ confirmData.fpsId }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="confirmContent mt36 mb20">
        <!-- 手续费扣款账户 -->
        <detail-item
          v-if="payType !== 'fast'"
          :title="this.$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
          :content="
            `${formatAcctNo(confirmData.deductAcct)} ${
              confirmData.chargeCcy
            } ${accountType(confirmData.deductAcctType)}`
          "
        />
        <!-- 手续费 -->
        <detail-item v-if="payType !== 'fast'" :title="$t('PAYMENT.CHARGE_CCY')" :content="confirmData.chargeAmount" />
        <!-- 收款人类型 -->
        <detail-item
          :title="$t('PAYMENT.PAYEE_TYPE')"
          :content="confirmData.creditorType | processCreditType"
        />
        <!-- 收款人识别方式 -->
        <detail-item
          v-if="payType === 'fast'"
          :title="$t('PAYMENT.PAYEE_IDENTIFY_WAY')"
          :content="confirmData.creditAcctIdentificationType | FPStransTypeFilers"
        />
        <!-- 预约处理日期 -->
        <detail-item
          :title="$t('PAYMENT.APPOINTMENT_DATE')"
          :content="confirmData.scheduleDate"
          v-if="confirmData.isScheduleTx === 'Y'"
        />
        <!-- 重试扣账 -->
        <detail-item
          :title="$t('PAYMENT.RETRY_DEDUCTION')"
          :content="confirmData.isRetry | ynToText"
          v-if="confirmData.isRetry === 'Y'"
        />
        <!-- 收款户名 -->
        <detail-item
          v-if="payType === 'fast'"
          :title="$t('PAYMENT.PAYEE_NAME')"
          :content="
            confirmData.creditAcctName
          "
        />
        <!-- 附言（致收款人） -->
        <detail-item
          :title="$t('PAYMENT.POSTSCRIPT')"
          :content="
            confirmData.additionalComment
              ? confirmData.additionalComment
              : '- -'
          "
        />
        <!-- 备注 -->
        <!-- 登记此账户 -->
        <detail-item
          :title="$t('PAYMENT.IS_REGISTERED')"
          :content="confirmData.isRegistry | ynToText"
          v-if="confirmData.isRegistry === 'Y'"
        />
      </div>
    </div>
    <div class="flexc">
      <!-- 上一步 -->
      <v-button @click="onBackStep" class="mr16">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
      <!-- 确定 -->
      <v-button type="primary" @click="onConfirm">{{ $t('COMMON.DETERMINE') }}</v-button>
    </div>
  </div>
</template>
<script>
import { bankInfos } from '@/mixins';
import { confirm } from '@bank-transfer/mixins';
import {
  IDENTIFY_WAY_MAP,
  SELECT_BANK_TYPES
} from '@bank-transfer/utils/constant';
import { submitFPSTx, chatsSubmitFPSBankTx } from '@/api/paymentRemittance';
import { BANK_TYPES } from '@bank-transfer/paymentSettlement/utils/enums';
import filters from '@/filters/accountManagement';
import business from '@/filters/business.js';
import { sendEmail } from '@/api/sendMsg';
import { otpDialog } from '@/components/messageBox';
export default {
  components: {},
  mixins: [confirm, bankInfos],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  props: {
    payType: {
      type: String,
      default: BANK_TYPES.FAST,
      validator(val) {
        return Object.getOwnPropertyNames(BANK_TYPES).some(
          k => BANK_TYPES[k] === val
        );
      }
    }
  },
  data() {
    return {
      formLoading: false,
      IDENTIFY_WAY_MAP,
      SELECT_BANK_TYPES
    };
  },
    filters: {
    FPStransTypeFilers:business.FPStransTypeFilers,
  },
  created() {
    console.log('确认页信息', this.confirmData);
    console.log(this.authInfo, 'authInfo');
  },
  methods: {
    ...filters,
    // 确定
    async onConfirm() {
      this.$emit('next', this.payType);
    },
    findBankName(value) {
      const item = this.filterTransBank.find(item => item.value === value);
      if (item) {
        return item.bankName;
      }
      return ''; // Bank is Not Found!
    },
    onBackStep() {
      this.$emit('back');
    }
  }
};
</script>
<style lang="scss" scoped>
.g-confirmData {
  width: 100%;
  height: 100%;
}

.pdf-wrapper {
  .m-confirm-left,
  .m-confirm-right {
    width: 300px;
    height: 160px;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    flex-direction: column;
    color: rgba(0, 0, 0, 0.85);
  }
  .m-confirm-center {
    width: 280px;
    background: url('~@/images/bankTransfer/jiantou-transInfo@3x.png') no-repeat;
    background-position: center center;
    background-size: 200px 5px;
    p {
      padding: 44px 0 0;
      line-height: 28px;
      letter-spacing: 0;
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
    }
  }
  .m-confirm-left,
  .m-confirm-right {
    position: relative;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    background: url('~@/images/paymentSettlement/16.png') no-repeat;
    background-position: bottom right;
    border-radius: 8px;
    .tag {
      line-height: 24px;
      background: rgba(240, 107, 0, 0.1);
      font-size: 12px;
      height: 24px;
      width: 64px;
      text-align: center;
      color: #f06b00;
      border-radius: 4px 8px 4px 4px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .confirmContent {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
  .rgba45 {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
