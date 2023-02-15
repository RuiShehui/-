<!--预约交易管理 行内转账/转数快/本地特快/电汇 详情/预约修改页面-->
<template>
  <div class="g-transferDetail-container" v-loading="requestLoading">
    <div v-if="!changeResult">
      <!-- 修改 -->
      <div v-if="jumpType == 'change'">
        <!-- 修改预约 -->
        <title-tab :title="$t('PAYMENT.MODIFY_APPOINTMENT')" />
        <el-form ref="bankInfoForm" :model="bankInfoForm" :rules="rules" label-width="200px">
          <!-- 预约处理日期 -->
          <el-form-item :label="`${$t('PAYMENT.APPOINTMENT_DATE')}：`" prop="scheduleDate">
            <el-date-picker
              v-model="bankInfoForm.scheduleDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{select:$t('PAYMENT.APPOINTMENT_DATE')})"
              :picker-options="option"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- 详情 -->
      <title-tab :title="$t('PAYMENT.DETAIL')" class="mb36" />
      <div class="m-confirm flexc mb36" v-if="bsnCode!=='030103' || jumpType!=='detail'">
        <div class="m-confirm-left">
          <!-- 付款账户 -->
          <span class="tag">{{ $t('PAYMENT.PAYMENT_ACCOUNT') }}</span>
          <p class="f16 pb5">{{ detailsObj.debitAcctName }}</p>
          <p
            class="f16 pb5"
          >{{ acctFormat(detailsObj.debitAcct,detailsObj.debitCcy,detailsObj.debitAcctType) }}</p>
          <p class="f16 pb15">{{ detailsObj.paymentBankType }}</p>
          <p class="f14 gray3">{{ $t('PAYMENT.CHUANGXING_BANK') }}</p>
        </div>
        <div class="m-confirm-center">
          <p
            class="f20 fw700"
          >{{ detailsObj.ccy }} {{ formatMoney(detailsObj.ccy,detailsObj.amount) }}</p>
        </div>
        <div class="m-confirm-right">
          <!-- 收款账户 -->
          <span class="tag">{{ $t('PAYMENT.RECEIVE_ACCOUNT') }}</span>
          <p class="f16 pb5">{{ detailsObj.creditAcctName }}</p>
          <p class="f16 pb5">{{ detailsObj.creditAcct }} {{ detailsObj.creditCcy }}</p>
          <p class="f16 pb15">{{ detailsObj.paymentBankType }}</p>
          <p class="f14 gray3" v-if="bsnCode==='030101'">{{ $t('PAYMENT.CHUANGXING_BANK') }}</p>
          <p class="f14 gray3" v-if="detailsObj.creditBankName">{{ detailsObj.creditBankName }}</p>
        </div>
      </div>
      <!-- 行内转账/转数快/外币转账 -->
      <div
        class="m-detail-content mb20"
        v-if="bsnCode=='030101'||bsnCode=='03010201'||bsnCode=='03010202'"
      >
        <!-- 手续费扣款账户 -->
        <detail-item
          v-if="bsnCode=='03010202'"
          :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
          :content="acctFormat(detailsObj.chargeAcct,detailsObj.chargeCcy,detailsObj.chargeAcctType)"
        ></detail-item>
        <!-- 手续费 -->
        <detail-item
          :title="$t('PAYMENT.CHARGE_CCY')"
          :content="`${detailsObj.chargeCcy} ${formatMoney(detailsObj.chargeCcy, detailsObj.chargeAmt)}`"
          v-if="bsnCode=='03010202'"
        ></detail-item>
        <!-- 预约处理日期 -->
        <detail-item
          :title="$t('PAYMENT.APPOINTMENT_DATE')"
          :content="detailsObj.modifiedScheduleDate"
        ></detail-item>
        <!-- 重试扣账 -->
        <detail-item :title="$t('PAYMENT.RETRY_DEDUCTION')" :content="detailsObj.isRetry|yesOrNo"></detail-item>
        <!-- 是否登记此账户 -->
        <detail-item :title="$t('PAYMENT.IS_REGISTERED')" :content="detailsObj.isRegistry|yesOrNo"></detail-item>
        <!-- 收款人类型 -->
        <detail-item
          :title="$t('PAYMENT.PAYEE_TYPE')"
          :content="CREDIT_TYPES[detailsObj.creditorType] || CREDIT_TYPES[detailsObj.creditType]"
        ></detail-item>
        <!-- 收款人识别方式 -->
        <detail-item
          v-if="bsnCode=='03010201'"
          :title="$t('PAYMENT.PAYEE_IDENTIFY_WAY')"
          :content="PAYEEID_TYPE[detailsObj.creditAcctIdentificationType]"
        ></detail-item>
        <!-- 附言（致收款人） -->
        <detail-item
          v-if="bsnCode !=='030101'"
          :title="$t('PAYMENT.POSTSCRIPT')"
          :content="detailsObj.additionalComment?detailsObj.additionalComment:'- -'"
        ></detail-item>
        <!-- <detail-:title="$t('PAYMENT.item ')" :content="detailsObj.remark"></detail-item> -->
        <!-- 登记此账户 -->
        <detail-item
          v-if="detailsObj.isRegisteredAccount"
          :title="$t('PAYMENT.IS_REGISTERED')"
          :content="detailsObj.isRegisteredAccount"
        ></detail-item>
        <!-- A级授权人 -->
        <detail-item
          :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
          v-if="AAuth.length"
          :content="AAuth.join(';')"
        ></detail-item>
        <!-- B级授权人 -->
        <detail-item
          :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
          v-if="BAuth.length"
          :content="BAuth.join(';')"
        ></detail-item>
        <!-- C级授权人 -->
        <detail-item
          :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
          v-if="CAuth.length"
          :content="CAuth.join(';')"
        ></detail-item>
      </div>
      <!-- 电汇 -->
      <div class="mb20" v-if="bsnCode=='030103'">
        <!-- 付款人信息 -->
        <divider :title="$t('PAYMENT.PAYER_INFO')" class="pb10" />
        <div class="m-detail-content">
          <!-- 付款账户 -->
          <detail-item
            :title="$t('PAYMENT.PAYMENT_ACCOUNT')"
            :content="acctFormat(detailsObj.debitAcct,detailsObj.debitCcy,detailsObj.debitAcctType)"
          ></detail-item>
          <!-- 账户名称 -->
          <detail-item :title="$t('PAYMENT.ACCOUNT_NAME')" :content="detailsObj.debitAcctName"></detail-item>
          <!-- 费用支付方式 -->
          <detail-item
            :title="$t('PAYMENT.PAYMENT_METHOD')"
            :content="detailsObj.chargePayWay | processPayType"
          ></detail-item>
          <!-- 费用扣款账户 -->
          <detail-item
            :title="$t('PAYMENT.FEE_DEBIT_ACCOUNT')"
            v-if="detailsObj.chargePayWay !== 'BEN'"
            :content="acctFormat(detailsObj.chargeAcct,detailsObj.chargeCcy,detailsObj.chargeAcctType)"
          ></detail-item>
          <!-- 手续费 -->
          <detail-item
            v-if="detailsObj.chargePayWay !== 'BEN'"
            :title="$t('PAYMENT.CHARGE_CCY')"
            :content="`${detailsObj.chargeCcy} ${String(detailsObj.chargeAmt).toMoney()}`"
          ></detail-item>
          <!-- 电报费 -->
          <detail-item
            v-if="detailsObj.chargePayWay !== 'BEN'"
            :title="$t('PAYMENT.ELEC_FEE')"
            :content="`HKD ${detailsObj.commissionAmt}`"
          ></detail-item>
          <!-- 银行代理费 -->
          <detail-item
            v-if="detailsObj.chargePayWay === 'OUR' && this.isShowFee"
            :title="$t('PAYMENT.BANK_PROXY_FEE')"
            :content="`${detailsObj.ccy} ${
                detailsObj.ccy === 'USD'
                  ? '28.00'
                  : detailsObj.ccy === 'CAD'
                  ? '15.00'
                  : detailsObj.ccy === 'GBP'
                  ? '8.00'
                  : detailsObj.ccy === 'AUD'
                  ? '15.00'
                  : detailsObj.ccy === 'EUR'
                  ? '15.00'
                  : '0.00'
              }`"
          ></detail-item>
          <!-- 预约处理日期 -->
          <detail-item
            :title="$t('PAYMENT.APPOINTMENT_DATE')"
            :content="detailsObj.modifiedScheduleDate"
          ></detail-item>
        </div>
        <!-- 收款人信息 -->
        <divider :title="$t('PAYMENT.PAYEE_INFO')" class="pb10" />
        <div class="m-detail-content">
          <!-- 收款人类型 -->
          <detail-item
            :title="$t('PAYMENT.PAYEE_TYPE')"
            :content="detailsObj.creditorType | processCreditType"
          ></detail-item>
          <!-- 收款人名称 -->
          <detail-item :title="$t('PAYMENT.ACCT_NAME')" :content="detailsObj.creditAcctName"></detail-item>
          <!-- 国家/地区 -->
          <detail-item
            :title="$t('PAYMENT.RECEIVER_COUNTRY')"
            :content="detailsObj.creditRegion | filterCountry"
          ></detail-item>
          <!-- 收款人地址 -->
          <detail-item :title="$t('PAYMENT.RECEIVER_ADDRESS')" :content="detailsObj.creditAddress"></detail-item>
          <!-- 账户号码/IBAN -->
          <detail-item :title="$t('PAYMENT.ACCT_NO_OR_IBAN')" :content="detailsObj.creditAcct"></detail-item>
          <!-- 手续费 -->
          <detail-item
            v-if="detailsObj.chargePayWay === 'BEN'"
            :title="$t('PAYMENT.CHARGE_CCY')"
            :content="`${detailsObj.chargeCcy} ${String(detailsObj.chargeAmt).toMoney()}`"
          ></detail-item>
          <!-- 电报费 -->
          <detail-item
            v-if="detailsObj.chargePayWay === 'BEN'"
            :title="$t('PAYMENT.ELEC_FEE')"
            :content="`HKD ${detailsObj.commissionAmt}`"
          ></detail-item>
        </div>
        <!-- 收款银行信息 -->
        <divider :title="$t('PAYMENT.RECEIVE_BANK_INFO')" class="pb10" />
        <div class="m-detail-content">
          <!-- 收款方式 -->
          <detail-item
            v-if="detailsObj.swiftCode"
            title="SWIFT Code"
            :content="detailsObj.swiftCode"
          ></detail-item>
          <!-- 收款银行国家/地区 -->
          <detail-item
            :title="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
            :content="detailsObj.creditBankRegion | filterCountry"
          ></detail-item>

          <!-- 银行地址 -->
          <detail-item :title="$t('PAYMENT.BANK_ADDRESS')" :content="detailsObj.creditBankAddress"></detail-item>
          <!-- 银行名称 -->
          <detail-item :title="$t('PAYMENT.BANK_NAME')" :content="detailsObj.creditBankName"></detail-item>
          <detail-item
            v-if="['US','AU','CA','GB'].includes(detailsObj.creditBankRegion)"
            :title="codeName"
            :content="detailsObj.creditBankCode"
          ></detail-item>
          <!-- 汇款目的代码 -->
          <detail-item
            v-if="detailsObj.ttPurposeCode && detailsObj.ccy==='CNY' && detailsObj.creditBankRegion==='CN' "
            :title="$t('AUTHORIZE.ttPurposeCode')"
            :content="ttPurposeCodeFilter(detailsObj.ttPurposeCode)"
          ></detail-item>
          <!-- 汇款金额 -->
          <detail-item
            :title="$t('PAYMENT.FEE')"
            :content="`${detailsObj.ccy} ${String(detailsObj.amount).toMoney()}`"
          ></detail-item>
          <!-- 附言（致收款人） -->
          <detail-item
            :title="$t('PAYMENT.POSTSCRIPT')"
            :content="detailsObj.additionalComment?detailsObj.additionalComment:'- -'"
          ></detail-item>
          <!-- 登记此账户 -->
          <detail-item
            :title="$t('PAYMENT.IS_REGISTERED')"
            :content="detailsObj.isRegistry|yesOrNo"
          ></detail-item>
          <!-- A级授权人 -->
          <detail-item
            :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
            v-if="AAuth.length"
            :content="AAuth.join(';')"
          ></detail-item>
          <!-- B级授权人 -->
          <detail-item
            :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
            v-if="BAuth.length"
            :content="BAuth.join(';')"
          ></detail-item>
          <!-- C级授权人 -->
          <detail-item
            :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
            v-if="CAuth.length"
            :content="CAuth.join(';')"
          ></detail-item>
        </div>
      </div>
      <el-row v-if="jumpType=='detail'">
        <!-- 返回 -->
        <v-button
          class="m-mgauto-btn"
          size="w210"
          @click="$emit('clickBack')"
        >{{ $t('COMMON.BACK') }}</v-button>
      </el-row>
      <el-row v-if="jumpType=='change'" class="flexc">
        <!-- 返回 -->
        <v-button size="w160" @click="$emit('clickBack')" class="mr16">{{ $t('COMMON.BACK') }}</v-button>
        <!-- 确认 -->
        <v-button size="w160" type="primary" @click="onConfirm">{{ $t('COMMON.CONFIRM') }}</v-button>
      </el-row>
    </div>

    <div v-if="changeResult">
      <!-- 网银流水号 -->
      <el-result
        :icon="status"
        :title="title"
        :subTitle="`${$t('PAYMENT.WEBBANK_FLOW_NO')}：${subTitle}`"
      >
        <template slot="extra">
          <!-- 请至授权中心查看授权进度 -->
          <div v-if="showWaitAuth" class="wait-auth">{{ $t('TRANSFR_INFO.GOTO_AUTHOR') }}</div>
          <!-- 返回 -->
          <v-button @click="$emit('clickBack')">{{ $t('COMMON.BACK') }}</v-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
import titleTab from '@bank-transfer/components/title-tab';
// import operateResult from '@/components/common/operateResult';
import { scrollToTop } from '@bank-transfer/utils/function';
import { CREDIT_TYPES, PAYEEID_TYPE } from '@bank-transfer/utils/constant';
import { updateScheduleDateSubmit } from '@/api/reservationTransaction';
import { mapState } from 'vuex';
import { confirm } from '@bank-transfer/mixins';
import { softToken, choosesWay } from '@/components/messageBox';
import filters from '@/filters/public';
import acFilters from '@/filters/accountManagement';
import {
  getInnerBankDetail,
  getFPSDetail,
  getTelegraphicDetail,
  getChatsDetail
} from '@/api/authorizeCenter.js';
import { searchAuthRecord } from '@/api/authorizeCenter';
export default {
  components: {
    titleTab,
    // operateResult
  },
  mixins: [confirm],
  props: {
    jumpType: { type: String, default: 'detail' },
    bsnCode: String,
    flowNo: { type: String, default: '' }
  },
  filters: { ...filters, ...acFilters },
  data() {
    return {
      isShowFee: false, //控制展示银行代理费（电汇）
      bankInfoForm: {},
      // 限制所选日期大于当前日期
      option: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6
          );
        }
      },
      AAuth: [],
      BAuth: [],
      CAuth: [],
      CREDIT_TYPES,
      PAYEEID_TYPE,
      detailsObj: {},
      changeResult: false, //修改结果
      subTitle: '',
      title: '',
      status: 'success',
      showWaitAuth: false,
      rules: {
        scheduleDate: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('PAYMENT.APPOINTMENT_DATE')
            }),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    codeName() {
      switch (this.detailsObj.bankCodeType) {
        case 'SC':
          return 'SORT Code';
        case 'CU':
          return 'CHIPS UID';
        case 'FN':
          return 'Fedwire No./ABA No.';
        case 'TC':
          return 'Transit Code';
        case 'BN':
          return 'BSB No.';
        default:
          return '';
      }
    }
  },
  async created() {
    this.scrollToTop();

    this.searchAuthRecord();
    if (this.bsnCode === '030101') {
      const result = await getInnerBankDetail({ flowNo: this.flowNo });
      if (result) {
        this.detailsObj = result;
      }
      return;
    }
    if (this.bsnCode === '03010201') {
      const result = await getFPSDetail({ flowNo: this.flowNo });
      if (result) {
        this.detailsObj = result;
      }
      return;
    }
    if (this.bsnCode === '03010202') {
      const result = await getChatsDetail({ flowNo: this.flowNo });
      if (result) {
        this.detailsObj = result;
      }
      console.log(this.detailsObj, 'detailsObj');
      return;
    }
    if (this.bsnCode === '030103') {
      const result = await getTelegraphicDetail({ flowNo: this.flowNo });
      if (result) {
        this.detailsObj = result;
        if (
          this.detailsObj.ccy === 'USD' ||
          this.detailsObj.ccy === 'CAD' ||
          this.detailsObj.ccy === 'GBP' ||
          this.detailsObj.ccy === 'AUD' ||
          this.detailsObj.ccy === 'EUR'
        ) {
          this.isShowFee = true;
        } else this.isShowFee = false;
      }
      return;
    }
  },
  methods: {
    scrollToTop,
    // 查授权人
    async searchAuthRecord() {
      let params = {
        flowNo: this.flowNo
      };
      const result = await searchAuthRecord(params);
      if (result && result.tcApprovalRecords) {
        result.tcApprovalRecords.pop();
        result.tcApprovalRecords.forEach(item => {
          if (item.userLevel === '1') {
            this.AAuth.push(item.userName);
          }
          if (item.userLevel === '2') {
            this.BAuth.push(item.userName);
          }
          if (item.userLevel === '3') {
            this.CAuth.push(item.userName);
          }
        });
      }
      console.log(result, 'result');
    },
    //   确定
    onConfirm() {
      this.$refs['bankInfoForm'].validate(async valid => {
        if (valid) {
          if (this.bankInfoForm.scheduleDate === this.detailsObj.scheduleDate) {
            return this.$message({
              message: this.$t('PAYMENT.REVISE_RESERVE_ERROR'),
              type: 'fail'
            });
          }
          let params = {
            lastScheduleDate: this.detailsObj.modifiedScheduleDate,
            scheduleDate: this.bankInfoForm.scheduleDate,
            updateFlowNO: this.flowNo,
            bsnCode: this.bsnCode,
            opType: '0' //0修改1取消
          };
          const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          updateScheduleDateSubmit(params).then(({ body = {}, head = {} }) => {
            const tradeInfo = JSON.stringify(params);
            if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
              choosesWay({
                checkWay: '',
                tradeInfo: tradeInfo,
                flag: '1'
                // status: status
              }).then(() => {
                this.onConfirm();
              });
            } else if (head.returnCode == 'OTP000107' && entType == '1') {
              // const tradeInfo = JSON.stringify(params)
              softToken({
                softTokenCode: '',
                otpType: '0303',
                tradeInfo: {...this.detailsObj, scheduleDate: this.bankInfoForm.scheduleDate, operationType: '2'}
                // randomNum:''
              }).then(() => {
                this.onConfirm();
              });
            } else {
              if (body) {
                console.log(body, 'change result');
                const { authResultInfo = {} } = body;
                if (authResultInfo.authResultState !== '91') {
                  this.status = 'success';
                } else {
                  this.status = 'error';
                }
                this.title = this.titleFilter(authResultInfo.authResultState);
                this.subTitle = authResultInfo.flowNo;
                this.changeResult = true;
              }
            }
          });
      
        }
      });
    },
    titleFilter(val) {
      switch (val) {
        case '91':
          return this.$t('COMMON.SUBMIT_FAIL');
        case '03':
          this.showWaitAuth = true;
          return this.$t('COMMON.SUBMIT_SUCCESS');
        default:
          return this.$t('COMMON.SUBMIT_SUCCESS');
      }
    },
    ttPurposeCodeFilter(val) {
      switch (val) {
        case 'GT':
          return this.$t('PAYMENT.GOODS_TRADE');
        case 'ST':
          return this.$t('PAYMENT.SERVICE_TRADE');
        case 'CT':
          return this.$t('PAYMENT.CAPITAL_TRANSFER');
        case 'CAT':
          return this.$t('PAYMENT.CURRENT_ACCOUNT_TRANSCATION');
        case 'CD':
          return this.$t('PAYMENT.CHARITY_DONATION');
        default:
          return val;
      }
    },
    acctFormat(val, ccy, type) {
      let str = val;
      if (val) {
        str = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(
          5
        )} ${ccy} ${this.$options.filters['accountType'](type)}`;
      }
      return str;
    },
    formatMoney(ccy, money) {
      if (money === 0 || money) {
        let moneyStr = String(money);
        let minus = moneyStr.split('-');
        moneyStr = moneyStr.split('-').join('');
        if (ccy === 'JPY') {
          if (minus.length > 1) {
            return '-' + moneyStr.toJPY();
          }
          return moneyStr.toJPY();
        } else {
          if (minus.length > 1) {
            return '-' + moneyStr.toMoney();
          }
          return moneyStr.toMoney();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-transferDetail-container {
  .m-confirm {
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
      background: url('~@/images/bankTransfer/jiantou-transInfo@3x.png')
        no-repeat;
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
  }
  .m-mgauto-btn {
    /deep/ .vbutton {
      margin: 0 auto;
    }
  }
  .el-form-item {
    width: 650px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    .el-input {
      width: 320px;
    }
  }
  .m-detail-content {
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
.wait-auth {
  margin-bottom: 56px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
</style>