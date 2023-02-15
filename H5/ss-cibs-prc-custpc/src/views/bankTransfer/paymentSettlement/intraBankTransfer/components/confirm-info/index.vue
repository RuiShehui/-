<!-- 行内转账 确认转账信息页-->
<template>
  <div v-loading="formLoading" v-if="confirmData" class="g-intraBank-confirmData">
    <div class="pdf-wrapper" ref="pdf">
      <div class="m-confirm flexc pt12">
        <!-- 付款账户-信息 -->
        <div class="m-confirm-left">
          <span class="tag">{{ $t('PAYMENT.PAYMENT_ACCOUNT') }}</span>
          <!-- 付款户名 -->
          <p class="f16 pb5" style="font-weight: 600;">{{ confirmData.debitAcctName }}</p>
          <!-- 付款账户 (账号 + 币种) -->
          <p class="f16 pb5" style="font-weight: 600;">
            {{
            `${formatAcctNo(confirmData.debitAcct)} ${confirmData.debitCcy}`
            }}
          </p>
          <!-- 付款账户类型 -->
          <p
            class="f16 pb15"
            style="font-weight: 600;"
          >{{ confirmData.accountType | processAccountType }}</p>
          <p class="f14 rgba45">{{ $t('PAYMENT.CHUANGXING_BANK_CPY') }}</p>
        </div>
        <!-- 转账信息 -->
        <div class="m-confirm-center">
          <p class="f20 fw700">
            <!-- 交易币种 -->
            <span class="ccy">{{ `${confirmData.ccy} ` }}</span>
            <!-- 交易金额数目 -->
            <span class="amount">{{ confirmData.amount | formatMoney }}</span>
          </p>
        </div>
        <!-- 收款人信息 -->
        <div class="m-confirm-right">
          <span class="tag">{{ $t('PAYMENT.RECEIVE_ACCOUNT') }}</span>
          <!-- 收款户名 -->
          <p class="f16 pb5" style="font-weight: 600;">{{ confirmData.creditAcctName }}</p>
          <!-- 收款账户 (账号+币种) -->
          <p class="f16 pb5" style="font-weight: 600;">
            {{
            `${formatAcctNo(confirmData.creditAcct)} ${confirmData.creditCcy}`
            }}
          </p>
          <!-- 收款账户类型 -->
          <p class="f16 pb15" style="font-weight: 600;">
            <span>{{ confirmData.creditAcctLabel | processAccountType }}</span>
          </p>
          <!-- 收款银行机构 -->
          <p class="f14 rgba45">{{ $t('PAYMENT.CHUANGXING_BANK_CPY') }}</p>
        </div>
      </div>
      <div class="m-confirmlist mt36 mb20">
        <!-- 预约处理日期 -->
        <!-- <detail-item
          :title="$t('PAYMENT.APPOINTMENT_DATE')"
          :content="confirmData.scheduleDate"
          v-if="confirmData.isScheduleTx === 'Y'"
        /> -->
        <!-- 重试扣账 -->
        <!-- <detail-item
          :title="$t('PAYMENT.RETRY_DEDUCTION')"
          :content="$t('COMMON.YES')"
          v-if="confirmData.isRetry === 'Y'"
        /> -->
        <!-- 收款人类型 -->
        <detail-item
          :title="$t('PAYMENT.PAYEE_TYPE')"
          :content="confirmData.creditType | processCreditType"
        />
        <!-- 附言（致收款人） (2022-04-24 行内转账取消附言) -->
        <!-- <detail-item
        v-if="confirmData.creditType != 1"
        :title="$t('PAYMENT.POSTSCRIPT')"
        :content="
          confirmData.additionalComment ? confirmData.additionalComment : '- -'
        "
        />-->
        <!-- 备注 -->
        <!-- <detail-item
        :title="$t('PAYMENT.REMARKS')"
        :content="confirmData.remark ? confirmData.remark : '- -'"
        />-->
        <!-- 是否登记此账户 -->
        <detail-item
          :title="$t('PAYMENT.IS_REGISTERED')"
          :content="$t('COMMON.YES')"
          v-if="confirmData.isRegistry === 'Y'"
        />
        <!-- A, B, C类型收款人 -->
        <!-- <template v-if="authInfo && authInfo.AlevelList">
          <detail-item
            v-if="authInfo.AlevelList.length > 0"
            :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
            :content="authInfo.AlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.BlevelList.length > 0"
            :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
            :content="authInfo.BlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.ClevelList.length > 0"
            :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
            :content="authInfo.ClevelList | getAuthName"
          />
        </template>-->
        <!-- A, B, C类型收款人 -->
      </div>
    </div>
    <div class="flexc" v-if="showBtns">
      <v-button @click="confirmBack" class="mr16">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
      <v-button type="primary" @click="confirmSubmit">{{ $t('COMMON.DETERMINE') }}</v-button>
    </div>
  </div>
</template>

<script>
import {
  innerBankSubmitInnerBankTx,
  removeTransactionDraft
} from '@/api/paymentRemittance';
import { sendEmail } from '@/api/sendMsg';
import { confirm } from '@bank-transfer/mixins';
import { softToken, choosesWay } from '@/components/messageBox';

export default {
  name: 'InnerConfirm',
  components: {},
  mixins: [confirm],
  inject: ['entType', 'sendEmail'],
  created() {
    console.log(this.confirmData, 'this.confirmData');
  },
  methods: {
    //上一步
    confirmBack() {
      this.$emit('confirmBack');
    },
    //确认
    confirmSubmit() {
      this.submitTrading();
    },
    async submitTrading(confirm = 'false') {
      this.formLoading = true;
      const data = { ...this.confirmData, confirm };
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      const tradeInfo = JSON.stringify(data);
      innerBankSubmitInnerBankTx(data).then(({ body = {}, head = {} }) => {
        if (
          head.returnCode == 'OTP000107' &&
          cuSoleAuthorizerInd == '1' &&
          data.creditType == 3
        ) {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
            // status: status
          }).then(() => {
            this.submitTrading('true');
          });
        } else if (
          head.returnCode == 'OTP000107' &&
          data.creditType == 3 &&
          entType === '1'
        ) {
          // const tradeInfo = JSON.stringify(data)
          softToken({
            softTokenCode: '',
            otpType: '030101',
            tradeInfo: tradeInfo
            // randomNum:''
          }).then(() => {
            this.submitTrading('true');
            // this.comfirm();
          });
        } else if (head.returnCode == 'COC009970') {
          this.$confirm({
            isIcon: false,
            type: 'warn',
            message: this.$t('PAYMENT.TRANSFER_REPEAT_INT'),
            btnText: {
              cancleText: this.$t('COMMON.CANCEL'),
              confirmText: this.$t('COMMON.CONFIRM')
            },
            countDown: true,
            isCancle: true
          })
            .then(() => {
              this.submitTrading('true');
            })
            .catch(() => {
              this.formLoading = false;
            });
        } else {
          if (body) {
            this.sendEmail(this.confirmData);
            this.$emit('confirmSubmit', body);
          }
          this.formLoading = false;
        }
        this.formLoading = false;
      });
      /** 删除交易草稿 */
      if (data.hasOwnProperty('tdId')) {
        await removeTransactionDraft({
          tdId: data.tdId
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-intraBank-confirmData {
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
    color: rgba(0, 0, 0, 0.85);
    position: relative;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    background: url('~@/images/paymentSettlement/16.png') no-repeat;
    background-size: 132px 95px;
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
  .rgba45 {
    color: rgba(0, 0, 0, 0.45);
  }

  .m-confirmlist {
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
}
</style>
