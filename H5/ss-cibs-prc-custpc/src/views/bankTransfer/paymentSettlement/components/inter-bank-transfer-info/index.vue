<!-- 转数块/ 外币转账 — 填写转账信息页-->
<template>
  <div class="g-bankInfo" v-loading="requestLoading">
    <!-- 付款人信息 -->
    <divider :title="$t('PAYMENT.PAYER_INFO')" />
    <el-form ref="transferForm" label-width="160px" :model="formsData" :rules="formValidateRules">
      <!-- 付款账户 -->
      <el-form-item
        class="m-selAccount"
        :label="`${$t('PAYMENT.PAYMENT_ACCOUNT')}：`"
        prop="debitAcct"
      >
        <el-select
          v-model="debitIndex"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
          :filterable="true"
          @change="selectDebitAcct"
        >
          <el-option
            v-for="(item, index) in debitAcctList"
            :label="item.label"
            :value="index"
            :key="index"
          />
        </el-select>
        <!-- 付款账户名称 -->
        <p
          class="lh20 m-selAccount-name tl"
          v-show="formsData.debitAcctName && formsData.debitAcctName.length > 0"
        >
          {{ `${$t('PAYMENT.ACCOUNT_NAME')}：` }}
          <span
            class="debit-acct-name"
          >{{ formsData.debitAcctName }}</span>
          <!-- 付款账户-透支提醒 -->
          <el-tag v-if="isShowOverBalance" type="warning">
            <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
          </el-tag>
        </p>
        <!-- 付款账户-可用结余 -->
        <p
          class="lh20 m-selAccount-balance"
          v-show="formsData.debitAcctName && formsData.debitAcctName.length > 0"
        >
          {{ `${$t('PAYMENT.AVAILABLE_BALANCE')}：` }}
          <span
            class="debit-acct-currbal"
            v-if="formsData.currbal !== '-1'"
          >
            <!-- !formsData.currbal?'- -':formatMoney(formsData.currbal) -->
            {{ formsData.ccy }}
            {{ formatMoneyNew(formsData.currbal) }}
          </span>
        </p>
      </el-form-item>
      <!-- 手续费扣费账户 (收款银行机构为本行时不显示) -->
      <!-- -->
      <el-form-item
        class="m-selAccount"
        :label="`${$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')}：`"
        prop="deductAcct"
        v-if="payType == 'localtransfer'"
        v-show="formsData.creditBankInstitution !== '041'"
      >
        <!-- 选择手续费扣款账户 -->
        <el-select
          v-model="dedutIndex"
          :placeholder="$t('PAYMENT.PLEASE_SELECT',{
            select:$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')
          })"
          :filterable="true"
          @change="selectPoundPayAcct"
        >
          <el-option
            v-for="(item, index) in chargeAcctList.length
              ? chargeAcctList
              : debitAcctList"
            :label="item.label"
            :value="index"
            :key="`${index} ${item.value}`"
          />
        </el-select>
        <!-- 手续费扣款账户-户名 -->
        <p class="lh20 m-selAccount-name tl" v-show="formsData.deductAcctName">
          {{ `${$t('PAYMENT.ACCOUNT_NAME')}：` }}
          <span>{{ formsData.deductAcctName }}</span>
        </p>
        <!-- 手续费扣款账户-透支提醒 -->
        <el-tag v-if="formsData.deductAcctType === 'CURRENT'" type="warning">
          <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
        </el-tag>
        <!-- 手续费扣款账户-可用结余 -->
        <p class="lh20 m-selAccount-balance" v-if="formsData.deductAcctMoney">
          {{ `${$t('PAYMENT.AVAILABLE_BALANCE')}：` }}
          <span>{{formsData.chargeCcy+' '+ formatMoneyNew(formsData.deductAcctMoney)}}</span>
        </p>
      </el-form-item>
      <!-- 预约处理 -->
      <el-form-item
        v-if="payType !== 'fast'"
        :label="`${$t('PAYMENT.APPOINTMENT_PROCESS')}：`"
        prop="isScheduleTx"
      >
        <el-checkbox v-model="formsData.isScheduleTx" />
      </el-form-item>
      <!-- 预约处理日期-->
      <el-form-item
        :label="`${$t('PAYMENT.APPOINTMENT_DATE')}：`"
        prop="scheduleDate"
        v-if="formsData.isScheduleTx"
        required
      >
        <el-date-picker
          v-model="formsData.scheduleDate"
          type="date"
          :placeholder="
            $t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: $t('PAYMENT.APPOINTMENT_DATE')
            })
          "
          @change="changAppointedDay"
          :picker-options="option"
          :clearable="false"
        />
      </el-form-item>
      <!-- 是否重试扣账 --- 暂定取消此功能 -->
      <!-- <el-form-item
        :label="`${$t('PAYMENT.RETRY_DEDUCTION')}：`"
        prop="isRetry"
        v-if="formsData.isScheduleTx"
      >
        <el-checkbox v-model="formsData.isRetry" class="u-check">{{ $t('PAYMENT.RETRY_TIPS') }}</el-checkbox>
      </el-form-item>-->
      <!-- 收款账户信息 -->
      <divider :title="$t('PAYMENT.PAYEE_INFO')" />
      <!-- 收款人类型 -->
      <el-form-item :label="`${$t('PAYMENT.PAYEE_TYPE')}：`" prop="creditorType" required>
        <el-radio-group
          class="payee-account-types"
          v-model="formsData.creditorType"
          @change="selectCreditType"
        >
          <!-- 已登记第三者账户 -->
          <el-radio label="2">
            <span>{{ $t('PAYMENT.REGISTERED_ACCOUNT') }}</span>
            <!-- 已登记账户查询 -->
            <span
              v-show="formsData.creditorType === '2'"
              class="accounts-btn"
              @click="dialogVisible = true"
            >{{ $t('PAYMENT.REGISTRIED_ACCOUNT_QUERY') }}</span>
          </el-radio>
          <!-- 未登记账户 -->
          <el-radio label="3">
            <span>{{ $t('PAYMENT.NO_REGISTERED_ACCOUNT') }}</span>
            <!-- 最近收款人 -->
            <span
              v-show="formsData.creditorType === '3'"
              class="accounts-btn"
              @click="dialogVisible = true"
            >{{ $t('PAYMENT.IMPORT_NEAREST_PEYEE') }}</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!--转数快 已登记/未登记账户 -->
      <template v-if="payType === 'fast'">
        <div v-show="formsData.isShowRegistered || formsData.creditorType === '3'">
          <!-- 收款人识别方式 已登记输入框反显 -->
          <el-form-item
            v-if="formsData.creditorType === '2' && formsData.isShowRegistered"
            :label="`${$t('PAYMENT.PAYEE_IDENTIFY_WAY')}：`"
            prop="creditAcctIdentificationType"
          >
            <el-input
              :value="
                identifyWayList.find(
                  item => item.value === formsData.creditAcctIdentificationType
                )
                  ? identifyWayList.find(
                      item =>
                        item.value === formsData.creditAcctIdentificationType
                    ).label
                  : ''
              "
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.PAYEE_IDENTIFY_WAY')
                })
              "
              :disabled="true"
            />
          </el-form-item>
          <!-- 收款人识别方式 未登记手动选择-->
          <el-form-item
            v-if="formsData.creditorType !== '2'"
            :label="`${$t('PAYMENT.PAYEE_IDENTIFY_WAY')}：`"
            prop="creditAcctIdentificationType"
          >
            <!-- 收款人识别方式选择 -->
            <el-select
              v-model="formsData.creditAcctIdentificationType"
              @change="changeWayType"
              :placeholder="$t('COMMON.PLEASE_SELECT')"
            >
              <el-option
                v-for="(item, index) in identifyWayList"
                :label="item.label"
                :value="item.value"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <!-- 收款账户反显 -->
          <template
            v-if="
              [
                IDENTIFY_WAY_MAP.payeeAccount,
                IDENTIFY_WAY_MAP.creditCard
              ].includes(formsData.creditAcctIdentificationType)
            "
          >
            <!-- 收款账户 -->
            <el-form-item :label="`${$t('PAYMENT.RECEIVE_ACCOUNT')}：`" prop="creditAcct">
              <el-input
                v-model="formsData.creditAcct"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.RECEIVE_ACCOUNT')
                  })
                "
                :disabled="formsData.creditorType === '2' ? true : false "
                maxlength="34"
              />
            </el-form-item>
            <!-- 收款户名 -->
            <el-form-item :label="`${$t('PAYMENT.PAYEE_NAME')}：`" prop="creditAcctName">
              <el-input
                v-model="formsData.creditAcctName"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.PAYEE_NAME')
                  })
                "
                :disabled="formsData.creditorType === '2' ? true : false "
                maxlength="120"
              />
            </el-form-item>
          </template>
          <template
            v-if="
              formsData.creditAcctIdentificationType ===
                IDENTIFY_WAY_MAP.emailAddress
            "
          >
            <!-- 电邮地址 -->
            <el-form-item :label="`${$t('PAYMENT.EMAIL_ADDRESS')}：`" prop="emailAddress">
              <el-input
                v-model="formsData.emailAddress"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.EMAIL_ADDRESS')
                  })
                "
                :disabled="formsData.creditorType === '2' ? true : false"
              />
            </el-form-item>
          </template>
          <template
            v-if="
              formsData.creditAcctIdentificationType === IDENTIFY_WAY_MAP.fpsId
            "
          >
            <!-- FPS ID -->
            <el-form-item label="FPS ID" prop="fpsId">
              <el-input
                v-model="formsData.fpsId"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'FPS ID' })
                "
                :disabled="formsData.creditorType === '2' ? true : false"
              />
            </el-form-item>
          </template>

          <template
            v-if="
              formsData.creditAcctIdentificationType ===
                IDENTIFY_WAY_MAP.mobilePhone
            "
          >
            <!-- 流动电话号码 -->
            <el-form-item :label="`${$t('PAYMENT.MOBILE_PHONE_NUMBER')}：`" prop="flowNumber">
              <phone-input
                ref="phoneInput"
                v-model="formsData.flowNumber"
                :disabled="formsData.creditorType === '2' ? true : false"
              />
            </el-form-item>
          </template>

          <template v-if="formsData.creditorType === '2'">
            <el-form-item
              :label="`${$t('PAYMENT.RECEIVE_BANK')}：`"
              v-if="
                [
                  IDENTIFY_WAY_MAP.mobilePhone,
                  IDENTIFY_WAY_MAP.emailAddress
                ].includes(formsData.creditAcctIdentificationType)
              "
              prop="creditBankInstitution"
            >
              <el-input
                :value="formsData.designBank === SELECT_BANK_TYPES.DEF
                    ? ''
                    : filterBankInfo(formsData.creditBankInstitution)
                "
                :disabled="true"
              />
            </el-form-item>
          </template>
          <!-- 指定收款银行/机构  电邮地址和流动电话支持-->
          <template v-if="isShowDesignBank">
            <el-form-item
              :label="`${$t('PAYMENT.RECEIVE_BANK')}：`"
              v-if="
                [
                  IDENTIFY_WAY_MAP.mobilePhone,
                  IDENTIFY_WAY_MAP.emailAddress,
                  IDENTIFY_WAY_MAP.fpsId
                ].includes(formsData.creditAcctIdentificationType)
              "
              prop="designBank"
            >
              <el-radio-group v-model="formsData.designBank" @change="changeDesignBank">
                <el-radio
                  v-for="item of designBankList"
                  :key="item.value"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <!-- 指定收款银行机构 -> 收款银行机构 -->
          <template
            v-if="
              [
                IDENTIFY_WAY_MAP.mobilePhone,
                IDENTIFY_WAY_MAP.emailAddress
              ].includes(formsData.creditAcctIdentificationType)
            "
          >
            <template
              v-if="
                formsData.creditorType !== SELECT_BANK_TYPES.DEF &&
                  formsData.designBank === SELECT_BANK_TYPES.OPT
              "
            >
              <el-form-item
                :label="`${$t('PAYMENT.DESIGNATED_RECEIVE_BANK')}：`"
                prop="creditBankInstitution"
              >
                <el-select
                  v-model="formsData.creditBankInstitution"
                  :filterable="true"
                  :placeholder="$t('COMMON.PLEASE_SELECT')"
                >
                  <el-option
                    v-for="(item, index) in filterTransBank"
                    :label="item.bankName"
                    :value="item.value"
                    :key="`${index} ${item.value}`"
                  />
                </el-select>
              </el-form-item>
            </template>
          </template>
          <!-- 收款银行机构 -->
          <el-form-item
            :label="`${$t('PAYMENT.RECEIVE_BANK')}：`"
            v-if="
              [
                IDENTIFY_WAY_MAP.payeeAccount,
                IDENTIFY_WAY_MAP.creditCard
              ].includes(formsData.creditAcctIdentificationType)
            "
            prop="creditBankInstitution"
          >
            <el-input
              v-if="formsData.creditorType === '2'"
              :value="filterBankInfo(formsData.creditBankInstitution)"
              :disabled="true"
            />
            <el-select
              v-else
              v-model="formsData.creditBankInstitution"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: $t('PAYMENT.RECEIVE_BANK')
                  })"
              :filterable="true"
              @change="onBankInfoChange"
            >
              <el-option
                v-for="(item, index) in filterTransBank"
                :label="item.bankName"
                :value="item.value"
                :key="`${index} ${item.value}`"
              />
            </el-select>
          </el-form-item>
        </div>
      </template>
      <!-- 外币转账 已登记第三方账户/未登记 -->
      <template v-if="payType === 'localtransfer'">
        <div v-show="formsData.creditorType === '3' || formsData.isShowRegistered">
          <!-- 收款账户 -->
          <el-form-item :label="`${$t('PAYMENT.RECEIVE_ACCOUNT')}：`" prop="creditAcct">
            <el-input
              v-model="formsData.creditAcct"
              :disabled="formsData.creditorType === '2'"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.RECEIVE_ACCOUNT')
                })
              "
              maxlength="34"
            />
          </el-form-item>
          <!-- 收款户名 -->
          <el-form-item :label="`${$t('PAYMENT.PAYEE_NAME')}：`" prop="creditAcctName">
            <el-input
              v-model="formsData.creditAcctName"
              :disabled="formsData.creditorType === '2'"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.PAYEE_NAME')
                })
              "
              maxlength="120"
            />
          </el-form-item>
          <!-- 收款银行/机构 -->
          <el-form-item :label="`${$t('PAYMENT.RECEIVE_BANK')}：`" prop="creditBankInstitution">
            <el-input
              v-if="formsData.creditorType === '2'"
              :value="filterBankInfo(formsData.creditBankInstitution)"
              :disabled="true"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.RECEIVE_BANK')
                })
              "
            />
            <el-select
              v-else
              v-model="formsData.creditBankInstitution"
              :filterable="true"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: $t('PAYMENT.RECEIVE_BANK')
                  })"
              @change="onBankInfoChange"
            >
              <el-option
                v-for="(item, index) in filterTransBank"
                :label="item.bankName"
                :value="item.value"
                :key="`${index} ${item.value}`"
              />
            </el-select>
          </el-form-item>
        </div>
      </template>
      <!-- 转账金额 -->
      <el-form-item :label="`${$t('PAYMENT.TRANSFER_AMOUNT')}：`" class="m-amountStyle is-required">
        <el-select
          class="m-amountStyle-one"
          v-model="formsData.ccy"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
        >
          <el-option
            v-for="item of currencyList"
            v-show="item.length > 0"
            :key="item"
            :value="item"
            :label="item.length > 0 ? item : '--'"
          />
        </el-select>
        <el-form-item prop="amount" label-width="0" class="m-amountStyle-two">
          <money-input
            :maxlength="17"
            :isSaveDot="true"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.TRANSFER_AMOUNT')
              })
            "
            v-model="formsData.amount"
            @blur="initAuthSelect"
            style="width: 160px"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="`${$t('PAYMENT.POSTSCRIPT')}：`" prop="additionalComment">
        <el-input
          v-model="formsData.additionalComment"
          :placeholder="
            $t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: $t('PAYMENT.POSTSCRIPT')
            })
          "
          :maxlength="payType === 'localtransfer' ? '140' : '40'"
        />
      </el-form-item>
      <!-- <el-form-item :label="`${$t('PAYMENT.REMARKS')}：`" prop="remark">
        <el-input
          v-model="formsData.remark"
          :placeholder="
            $t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: $t('PAYMENT.REMARKS')
            })
          "
          maxlength="140"
        />
      </el-form-item>-->
      <!-- 付款人是否已登记 -->
      <el-form-item
        :label="`${$t('PAYMENT.IS_REGISTERED')}：`"
        prop="isRegistry"
        v-if="isShowRegistryAcct"
      >
        <el-checkbox v-model="formsData.isRegistry" />
      </el-form-item>
      <!-- 授权提醒 -->
      <auth-select
        v-if="entType !== 1"
        ref="authSelect"
        labelWidth="160px"
        @checkClick="getAuthInfo"
        :authInfo="formsData.authInfo"
        :tradeType="payType === 'fast' ? '03010201' : '03010202'"
        :amount="formsData.amount"
      />
      <el-row class="flexc mt36">
        <!-- 重置 -->
        <v-button type size="w160" @click="handleReset">{{ $t('COMMON.RESET') }}</v-button>
        <!-- 暂存交易草稿 -->
        <el-button class="mw-160" @click="saveTransfer">{{ $t('PAYMENT.TEMPORARY_TRANSACTION') }}</el-button>
        <v-button
          type="primary"
          size="w160"
          @click="handleTradeConfirm"
        >{{ $t('COMMON.NEXT_STEP') }}</v-button>
      </el-row>
    </el-form>
    <!-- 是否登记的导入弹窗 -->
    <component
      :is="renderPopup"
      :dialogVisible.sync="dialogVisible"
      :type="formsData.creditorType"
      :accountType="formsData.creditorType"
      :payType="payType"
      @confirmClick="onDialogConfirm"
      @toCancle="dialogVisible = false"
      @close="dialogVisible = false"
    />
  </div>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ccyTool from '@/filters/accountManagement';
import businessFilter from '@/filters/business';
import mathTools from '@/utils/mathTools';
import { checkEmail } from '@/utils/validator';
import { judgeHoliday } from '@/api/openFixed.js';
import {
  getFPSPreviousInfo,
  chatsGetPreviousInfo,
  fpsSubmitValidate,
  requestChatsTx
} from '@/api/paymentRemittance';
import tools from '@/dataTools/tools';

import { transWrite } from '@bank-transfer/mixins';
import {
  designBankList,
  IDENTIFY_WAY_MAP,
  SELECT_BANK_TYPES
} from '@bank-transfer/utils/constant';
import CommonPopup, {
  RegisterAccts
} from '@bank-transfer/components/accountList';

import {
  filterIntraBankParams,
  getValidateAmount,
  initPaymentFormData,
  formatAcctNo,
  getChargeAmount,
  reduceAcctList
} from '@bank-transfer/utils/function';

const { getCurrentTimes, getNearDay } = tools;

const formsData = {
  debitAcct: '', // 付款账户
  debitAcctName: '', // 付款户名
  accountType: '', // 付款账户类型
  debitBankCode: '', // 付款银行编码
  debitBankName: '', // 付款银行名称
  isScheduleTx: false, // 是否预约处理
  // scheduleDate: getNearDay(getCurrentTimes(), 1), // 预约处理日期
  scheduleDate: '', // 预约处理日期
  isRetry: false, // 是否重试扣账
  creditorType: '2', // 收款人类型
  debitCcy: '', // 付款人币种
  ccy: '', // 收款人币种币种
  currbal: '', // 付款人可用额度
  creditCcy: 'HKD', // 收款人币种
  amount: '', // 转账金额
  additionalComment: '', // 附言
  remark: '', // 备注
  accountName: '', // 收款户名
  creditAcctBalance: '', // 可用结余
  isRegistry: false, // 是否登记此账户
  creditAcctIdentificationType: IDENTIFY_WAY_MAP.payeeAccount, // 收款人识别方式
  creditAcct: '', // 收款账户
  creditAcctName: '', //收款户名
  fpsId: '', // fps ID
  emailAddress: '', // 电邮地址
  creditBankInstitution: '', // 收款银行/机构
  creditBankCode: '', // 收款银行/机构编号
  creditBankName: '', // 收款银行/机构名称
  flowNumber: '', // 流动电话号码

  deductAcct: '', //手续费-账户号码
  chargeAcct: '', //手续费-账户号码
  deductAcctName: '', // 手续费-账户名称
  deductAcctMoney: '', // 手续费-扣款金额
  chargeCcy: '', // 手续费-币种
  deductAcctType: '', // 手续费扣款账户 - 类型

  designBank: SELECT_BANK_TYPES.PRE, // 指定收款银行/机构
  /** 是否显示反显的收款人信息 */
  isShowRegistered: false,

  /** 授权人信息 */
  authInfo: {}
};

export default {
  name: 'WriteIntraBankInfo',
  components: {
    CommonPopup,
    RegisterAccts
  },
  mixins: [transWrite],
  props: {
    payType: {
      type: String,
      default: 'fast' // fast 转数快  localtransfer 本地特快
    },
    confirmInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      pageType: '',
      payIsExcee: 0,
      formsData: _.cloneDeep(formsData),
      /** @enum {{ [key: string]: string; }} 识别方式映射  */
      IDENTIFY_WAY_MAP,
      // 付款账户下拉数组
      debitAcctList: [],
      // 收款账户下拉数组
      // getAcctNoList: [],
      dialogVisible: false, //   是否登记的弹窗标识
      // : '', // 已登记的导入的分类显示
      SELECT_BANK_TYPES,
      designBankList: designBankList(),
      identifyWayList: [
        {
          label: this.$t('PAYMENT.RECEIVE_ACCOUNT'), // 收款账户
          value: IDENTIFY_WAY_MAP.payeeAccount
        },
        {
          label: 'FPS ID', // FPS ID
          value: IDENTIFY_WAY_MAP.fpsId
        },
        {
          label: this.$t('PAYMENT.EMAIL_ADDRESS'), // 电邮地址
          value: IDENTIFY_WAY_MAP.emailAddress
        },
        {
          label: this.$t('PAYMENT.MOBILE_PHONE_NUMBER'), // 流动电话号码
          value: IDENTIFY_WAY_MAP.mobilePhone
        }
        // {
        //   label: this.$t('PAYMENT.CREDIT_CARD'), // 信用卡
        //   value: IDENTIFY_WAY_MAP.creditCard
        // }
      ]
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    validateSubmit() {
      switch (this.payType) {
        case 'fast':
          return fpsSubmitValidate;
        case 'localtransfer':
          return requestChatsTx;
        default:
          return () => {};
      }
    },
    poundPayAcctNoList() {
      const { debitCcy } = this.formsData;
      return this.debitAcctList; // .filter(item => item.cur === debitCcy)
    },
    requestInfos() {
      return {
        ...this.formsData,
        ...this.confirmInfo
      };
    },
    renderPopup() {
      const { creditorType } = this.formsData,
        payType = this.payType;
      /** formsData.creditorType payType */
      if (Number(creditorType) === 2) {
        return 'RegisterAccts';
      }
      return 'CommonPopup';
    },
    formValidateRules() {
      const self = this;
      const amountValidate = getValidateAmount(self);

      return {
        creditAcct: {
          required: true,
          trigger: 'change',
          validator: (r, val, cb) => {
            if (!val) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.RECEIVE_ACCOUNT')
                  })
                )
              );
              return;
            }
            cb();
          }
        },
        creditAcctName: {
          required:
            self.formsData.creditAcctIdentificationType &&
            self.formsData.creditAcctIdentificationType !==
              IDENTIFY_WAY_MAP.payeeAccount &&
            self.formsData.creditAcctIdentificationType !==
              IDENTIFY_WAY_MAP.creditCard
              ? false
              : true,
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.PAYEE_NAME')
          }),
          trigger: 'blur'
        },
        scheduleDate: {
          required: this.formsData.isScheduleTx ? true : false,
          validator: (rule, value, callback) => {
            if (this.formsData.isScheduleTx && !value) {
              callback(
                new Error(
                  self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: self.$t('PAYMENT.APPOINTMENT_DATE')
                  })
                )
              );
            } else {
              callback();
            }
          }
        },
        amount: [
          {
            required: true,
            trigger: 'blur',
            validator: amountValidate
          }
        ],
        debitAcct: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.formsData.creditorType === '2' && !value) {
              callback(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.PAYMENT_ACCOUNT')
                  })
                )
              );
            } else {
              callback();
            }
          },
          trigger: 'blur'
        },
        debitAcctName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.formsData.creditorType === '2' && !value) {
                callback(
                  new Error(
                    self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                      input: self.$t('PAYMENT.ACCOUNT_NAME')
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        deductAcct: [
          {
            required: true,
            message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: self.$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')
            }),
            trigger: 'change'
          }
        ],
        designBank: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(
                  new Error(
                    self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                      select: self.$t('PAYMENT.DESIGNATED_RECEIVE_BANK')
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        creditBankInstitution: [
          {
            required: self.formsData.creditorType !== '2',
            validator: (rule, value, callback) => {
              if (self.formsData.creditorType !== '2') {
                if (!value) {
                  callback(
                    new Error(
                      self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                        select: self.$t('PAYMENT.RECEIVE_BANK')
                      })
                    )
                  );
                  return;
                }
              }
              callback();
            },
            trigger: 'change'
          }
        ],
        creditAcctIdentificationType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.formsData.creditorType === SELECT_BANK_TYPES.OPT &&
                !value
              ) {
                callback(
                  new Error(
                    self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                      select: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY')
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        emailAddress: {
          required: true,
          trigger: 'blur',
          validator(r, val, cb) {
            return checkEmail(r, val, cb);
          }
        },
        flowNumber: {
          required: true,
          validator(r, val, cb) {
            const phoneInput = self.$refs['phoneInput'];

            if (!val || !val.length) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.MOBILE_PHONE_NUMBER')
                  })
                )
              );
              return;
            }
            if (phoneInput) {
              if (!phoneInput.validateValue(val, phoneInput.rules)) {
                cb(new Error(self.$t('PAYMENT.MOBILE_PHONE_NUMBER_NOT_VALID')));
                return;
              }
            }
            cb();
          }
        },
        fpsId: [
          {
            required: true,
            message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: 'FPS ID'
            }),
            trigger: 'blur'
          }
        ]
      };
    },
    /** 是否显示登记此账户 ? */
    isShowRegistryAcct() {
      const { creditorType, creditAcctIdentificationType } = this.formsData;
      /**
       * 1. 用户选择未登记账户
       * 2.
       */
      if (creditorType === '3') {
        if (
          ![IDENTIFY_WAY_MAP.creditCard].includes(creditAcctIdentificationType)
        ) {
          return true;
        }
      }
      return false;
    },
    /** 是否显示收款银行机构列表 */
    isShowDesignBank() {
      const { creditorType, creditAcctIdentificationType } = this.formsData;
      if (creditorType === '3') {
        if (
          [
            IDENTIFY_WAY_MAP.mobilePhone,
            IDENTIFY_WAY_MAP.emailAddress
          ].includes(creditAcctIdentificationType)
        ) {
          return true;
        }
      }
      return false;
    },
    currencyList() {
      return this.payType === 'localtransfer'
        ? ['HKD', 'CNY', 'USD', 'EUR', '']
        : ['HKD', 'CNY', ''];
    },
    /** @override */
    bankCcy() {
      return this.formsData.ccy;
    }
  },
  watch: {
    'formsData.creditAcctIdentificationType'(newVal) {
      this.$set(this.formsData, 'designBank', SELECT_BANK_TYPES.PRE);
      this.$set(this.formsData, 'isRegistry', false);
      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 0);
    },
    'formsData.designBank'(newVal) {
      if (this.payType === 'fast') {
        if (newVal === SELECT_BANK_TYPES.DEF) {
          this.$set(this.formsData, 'creditBankInstitution', '041');
          this.$set(
            this.formsData,
            'creditBankName',
            this.$t('PAYMENT.CHUANGXING_BANK')
          );
        } else if (newVal === SELECT_BANK_TYPES.PRE) {
          this.$set(this.formsData, 'creditBankInstitution', '');
          this.$set(this.formsData, 'creditBankName', this.$t(''));
          this.$set(this.formsData, 'creditBankCode', '');
        }
      }
    },
    'formsData.ccy'() {
      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 0);
    }
  },
  methods: {
    // 初始化数据
    init() {
      console.log(ccyTool, 'ccyTool');
      if (this.payType === 'localtransfer') {
        this.pageType = '03010202';
      }
      setTimeout(() => {
        this.$refs['authSelect'] && this.$refs['authSelect'].reset();
        this.setFormsData();
        this.getPreviousInfos(); //初始化付款列表以及扣款列表
        this.getBankInfos(); //初始化，查询银行数据
        setTimeout(() => {
          this.$refs['transferForm'].clearValidate();
        }, 0);
        this.$nextTick(() => {
          if (this.confirmInfo.authInfo) {
            this.formsData.authInfo = this.confirmInfo.authInfo;
          }
          this.$set(
            this.formsData,
            'creditBankInstitution',
            this.confirmInfo.creditBankInstitution ||
              this.confirmInfo.creditBankCode
          );
        });
      }, 0);
    },
    setFormsData() {
      const confirmInfo = initPaymentFormData(this.confirmInfo);
      for (let k in formsData) {
        const value = confirmInfo.hasOwnProperty(k)
          ? confirmInfo[k]
          : this.formsData[k];
        this.$set(this.formsData, k, value);
      }
      console.log('this.formsData', this.formsData);
      /** 2022-04-09 在有初始值的时候才会反显已登记账户信息 */
      if (this.confirmInfo.hasOwnProperty('ccy')) {
        this.$set(this.formsData, 'isShowRegistered', true);
      }
      if (
        this.jumpData.creditAcctIdentificationType === 'SVID' &&
        !this.jumpData.fpsId
      ) {
        this.$set(this.formsData, 'fpsId', confirmInfo.creditAcct);
      } else if (
        this.jumpData.creditAcctIdentificationType === 'MOBN' &&
        !this.jumpData.flowNumber
      ) {
        this.$set(this.formsData, 'flowNumber', confirmInfo.creditAcct);
      } else if (
        this.jumpData.creditAcctIdentificationType === 'EMAL' &&
        !this.jumpData.emailAddress
      ) {
        this.$set(this.formsData, 'emailAddress', confirmInfo.creditAcct);
      }
      setTimeout(() => {
        this.$set(this.formsData, 'designBank', confirmInfo.designBank);
        if (this.payType === 'localtransfer') {
          this.$set(this.formsData, 'debitBankCode', '041');
          this.$set(
            this.formsData,
            'debitBankName',
            this.$t('PAYMENT.CHUANGXING_BANK')
          );
        }
      }, 0);

      if (!this.confirmInfo.isScheduleTx) {
        this.$set(this.formsData, 'scheduleDate', '');
      }
      if (this.confirmInfo.hasOwnProperty('tdId')) {
        this.$set(this.formsData, 'tdId', this.confirmInfo.tdId);
      }
      if (this.confirmInfo.authInfo) {
        this.$set(this.formsData, 'authInfo', this.confirmInfo.authInfo);
      }
    },
    onBankInfoChange(value) {
      const target = this.filterTransBank.find(item => item.value === value);
      if (target) {
        const { bankName } = target;
        this.$set(this.formsData, 'creditBankCode', value);
        this.$set(this.formsData, 'creditBankName', bankName || '');
      }
    },
    async getPreviousInfos(params = {}) {
      const requestFn =
        this.payType === 'fast' ? getFPSPreviousInfo : chatsGetPreviousInfo;

      // const { debitAcctList, chargeAcctList } = await requestFn(params);
      let res = await requestFn(params);
      if (res) {
        this.debitAcctList = res.debitAcctList.sort((a, b) => {
          return Number(a.stateSort) - Number(b.stateSort);
        });
        this.chargeAcctList = res.chargeAcctList.sort((a, b) => {
          return Number(a.stateSort) - Number(b.stateSort);
        });
      }
      if (Array.isArray(this.debitAcctList) && this.debitAcctList.length) {
        // 付款账号列表
        this.setdebitAcctList(this.debitAcctList);
      }
      if (Array.isArray(this.chargeAcctList) && this.chargeAcctList.length) {
        // 手续费扣款账户列表
        this.setChargeAcctList(this.chargeAcctList);
      }
      if (
        !this.jumpData.isJumpTo &&
        JSON.stringify(this.confirmInfo) === '{}'
      ) {
        this.initDebitAcct();
        this.initDedutAcct();
        this.selectDebitAcct(this.debitIndex);
      } else if (JSON.stringify(this.confirmInfo) !== '{}') {
        this.initDebitAcct(
          this.confirmInfo.debitAcct,
          this.confirmInfo.debitCcy
        );
        this.initDedutAcct(
          this.confirmInfo.chargeAcct,
          this.confirmInfo.chargeCcy
        );
        this.selectDebitAcct(this.debitIndex);
        this.selectPoundPayAcct(this.dedutIndex);
      } else if (this.jumpData.isJumpTo) {
        this.initDebitAcct(this.jumpData.debitAcct, this.jumpData.debitCcy);
        this.initDedutAcct(this.jumpData.chargeAcct, this.jumpData.chargeCcy);
        this.selectDebitAcct(this.debitIndex);
        this.selectPoundPayAcct(this.dedutIndex);
      }
      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 5000);
    },
    // 付款账号列表名称拼接
    setdebitAcctList(debitAcctList = []) {
      this.debitAcctList = reduceAcctList(
        debitAcctList.map((item, index) => ({
          ...item,
          value: item.acctNo || index,
          label: `${formatAcctNo(item.acctNo)} ${ccyTool.ccyFilter(
            item.cur
          )} ${businessFilter.processAccountType(item.typeLabel)}`
        }))
      );
    },
    // 手续费扣款账户列表
    setChargeAcctList(list) {
      this.chargeAcctList = reduceAcctList(
        list.map((item, index) => ({
          ...item,
          value: item.acctNo || index,
          label: `${formatAcctNo(item.acctNo)} ${ccyTool.ccyFilter(
            item.cur
          )} ${businessFilter.processAccountType(item.typeLabel)}`
        }))
      );
    },
    // 修改收款人识别方式
    changeWayType(val) {
      this.formsData.creditBankInstitution = ''; //收款银行/机构
      this.formsData.emailAddress = ''; //电邮地址
      this.formsData.flowNumber = ''; // 流动电话号码 '030-0755-32339833'
      this.formsData.fpsId = ''; //fps ID
      if (val === 2 || val === 4) {
        this.formsData.designBank = SELECT_BANK_TYPES.PRE;
      }
      this.identifyWayList.map((item, index) => {
        if (item.value === val) {
          this.formsData.identifyWay = item.label;
        }
      });
      this.$forceUpdate();
      this.$refs['transferForm'].clearValidate();
    },
    changeDesignBank(index) {
      this.formsData.designBank = index;
      this.$forceUpdate();
    },
    // 重置
    handleReset() {
      this.$set(this, 'formsData', _.cloneDeep(formsData));
      this.$refs['authSelect'] && this.$refs['authSelect'].reset();
      this.formsData.isShowRegistered = false;
      this.debitIndex = 0;
      this.selectDebitAcct(this.debitIndex);
      this.dedutIndex = '';
      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 0);
    },
    // 保存交易草稿
    saveTransfer() {
      const params = {
        transactionType: this.payType === 'fast' ? '2' : '3',
        tdId: this.formsData.tdId || '0',
        // transactionText: JSON.stringify(this.formsData),
        uploadMethod: '0'
      };
      this.saveCraft(params);
    },
    // 下一步
    handleNextStep() {
      if (!this.checkDebitStatus()) {
        return;
      }
      const self = this;
      this.$refs['transferForm'].validate(async valid => {
        this.scrollToTop();
        if (valid) {
          if (this.confirmCheck()) {
            if (!this.formsData.isScheduleTx) {
              this.formsData.scheduleDate = '';
            }
            const params = {
              ...filterIntraBankParams(this.formsData),
              creditBankCode: this.formsData.creditBankInstitution
            };
            if (this.payType === 'fast') {
              const result = await this.validateSubmit(params);
              if (result) {
                if (
                  !result.nameChangeFlag &&
                  this.formsData.creditorType === '2' &&
                  (this.formsData.creditAcctIdentificationType === 'EMAL' ||
                    this.formsData.creditAcctIdentificationType === 'MOBN')
                ) {
                  let test;
                  if (this.formsData.creditAcctIdentificationType === 'EMAL') {
                    test = this.$t('PAYMENT.EMAIL_ADDRESS');
                  } else {
                    test = this.$t('PAYMENT.MOBILE_PHONE_NUMBER');
                  }
                  this.$confirm({
                    message: this.$t('PAYMENT.NAME_CHANGE_WARN', {
                      input: test
                    }),
                    type: 'warn',
                    isIcon: true,
                    btnText: {
                      cancleText: this.$t('COMMON.CANCEL'),
                      confirmText: this.$t('COMMON.CONFIRM')
                    },
                    isCancle: true
                  })
                    .then(() => {
                      params.creditorType = '3';
                      this.formsData.creditorType = '3';
                      this.FpsFunConfirm(params, result);
                    })
                    .catch(() => {
                      return false;
                    });
                } else {
                  this.FpsFunConfirm(params, result);
                }
              }
            } else {
              if (params.debitCcy === params.chargeCcy) {
                if (
                  this.payIsExcee === 1 &&
                  this.formsData.isScheduleTx === 'N'
                ) {
                  this.$message({
                    message: this.$t('PAYMENT.LACK_OF_BALANCE'),
                    type: 'warn'
                  });
                } else {
                  const result = await this.validateSubmit(params);
                  if (result) {
                    this.$emit('next', {
                      ...params,
                      chargeAmount: getChargeAmount(result, this),
                      chargeAmt: result.chAmount || ''
                    });
                  }
                }
              } else {
                this.$message({
                  type: 'fail',
                  // 手续费扣款账户的货币应与付款账户的货币一致
                  message: this.$t('PAYMENT.ERROR_CBP03184'),
                  delay: 3000
                });
                return;
              }
            }
          }
        } else {
          if (!this.formsData.creditAcct) {
            this.$message({
              type: 'fail',
              message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: this.$t('PAYMENT.RECEIVE_ACCOUNT')
              }),
              delay: 3000
            });
            return;
          }
          if (!this.formsData.amount) {
            this.$message({
              type: 'fail',
              message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: this.$t('PAYMENT.TRANSFER_AMOUNT')
              }),
              delay: 3000
            });
            return;
          }
          this.$message({
            type: 'fail',
            message: this.$t('COMMON.CHECK_FAIL'),
            delay: 3000
          });
        }
      });
    },
    FpsFunConfirm(params, result) {
      console.log('params, result', params, result);
      // 处理  当未登记，且输入是（emal 或 电话 或 fpsID）时候，确认页展示 脱敏姓名问题
      if (
        (params.creditAcctIdentificationType === 'EMAL' ||
          params.creditAcctIdentificationType === 'MOBN' ||
          params.creditAcctIdentificationType === 'SVID') &&
        params.creditorType === '3'
      ) {
        params.creditAcctName = result.adrSchmeList[0].cusNmList[0].dispNm;
      }
      this.$emit('next', {
        ...params,
        chargeAmount: getChargeAmount(result, this),
        chargeAmt: result.chAmount || ''
      });
    },
    // 校验
    confirmCheck() {
      if (
        [IDENTIFY_WAY_MAP.mobilePhone].includes(this.formsData.creditorType)
      ) {
        if (!this.formsData.creditAcctIdentificationType) {
          this.$message({
            type: 'fail',
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('PAYMENT.RECEIVE_ACCOUNT')
            }),
            delay: 3000
          });
          return false;
        }
      }
      if (
        this.formsData.currbal &&
        Number(this.formsData.amount) > Number(this.formsData.currbal)
      ) {
        if (this.formsData.isScheduleTx) {
          this.$message({
            type: 'warn',
            message: this.$t('PAYMENT.LACK_OF_BALANCE_AND_TIP'),
            delay: 3000
          });
          return true;
        }
        if (this.formsData.isOdLimit === 'Y') {
          this.$message({
            type: 'warn',
            message: this.$t('PAYMENT.MAY_BE_INTEREST'),
            delay: 3000
          });
          return true;
        }
      }
      return true;
    },
    // 消息弹窗
    messageCom(msg) {
      this.$message({
        type: 'warn',
        message: msg,
        delay: 3000
      });
    },
    // 获取收款人信息
    getReceiverInfo(params) {
      this.$set(this.formsData, 'creditAcct', params.creditAcct || '');
      this.$set(this.formsData, 'creditAcctName', params.creditAcctName || '');
      this.$set(this.formsData, 'flowNumber', params.flowNumber || '');
      if (this.payType === 'localtransfer') {
        this.$set(this.formsData, 'designBank', '');
        this.formsData.designBank = '';
      } else {
        this.$set(this.formsData, 'designBank', params.designBank || '');
        this.$set(this.formsData, 'emailAddress', params.emailAddress || '');
        this.$set(this.formsData, 'fpsId', params.fpsId || '');
      }

      // 已登记
      this.formsData.creditAcctIdentificationType =
        params.creditAcctIdentificationType || params.identifyWay;
      this.formsData.getChannalNo = params.getChannalNo || 'xxxxx';
      if (params.creditBankInstitution) {
        this.$set(
          this.formsData,
          'creditBankInstitution',
          params.creditBankInstitution
        );
      } else if (params.creditBankCode) {
        this.$set(
          this.formsData,
          'creditBankInstitution',
          params.creditBankCode
        );
      }
      this.setExactKeyData(params);
    },
    setExactKeyData(params = {}) {
      if (!params.hasOwnProperty('creditAcctIdentificationType')) {
        return;
      }
      const { creditAcctIdentificationType, creditAcct } = params;
      switch (creditAcctIdentificationType) {
        case IDENTIFY_WAY_MAP.payeeAccount:
          break;
        case IDENTIFY_WAY_MAP.mobilePhone:
          this.$set(this.formsData, 'flowNumber', creditAcct);
          break;
        case IDENTIFY_WAY_MAP.emailAddress:
          this.$set(this.formsData, 'emailAddress', creditAcct);
          break;
        case IDENTIFY_WAY_MAP.fpsId:
          this.$set(this.formsData, 'fpsId', creditAcct);
          break;
        case IDENTIFY_WAY_MAP.creditCard:
          break;
        default:
          break;
      }
    },
    /**
     * 选择收款人类型后触发的方法
     * 1. 重置收款账户信息
     * 2. 取消表单校验
     */
    selectCreditType(selectValue) {
      this.$set(this.formsData, 'isShowRegistered', selectValue === 2);

      /* 重置收款账户信息 */
      this.$set(this.formsData, 'creditAcct', '');
      this.$set(this.formsData, 'creditAcctName', '');
      this.$set(this.formsData, 'creditBankInstitution', '');
      this.$set(this.formsData, 'creditBankCode', '');
      this.$set(this.formsData, 'creditBankName', '');

      if (this.formsData.hasOwnProperty('flowNumber')) {
        this.$set(this.formsData, 'flowNumber', '');
      }
      if (this.formsData.hasOwnProperty('emailAddress')) {
        this.$set(this.formsData, 'emailAddress', '');
      }
      if (this.formsData.hasOwnProperty('fpsId')) {
        this.$set(this.formsData, 'fpsId', '');
      }

      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 0);
    },
    // 获取授权信息
    getAuthInfo(authInfo) {
      this.$set(this.formsData, 'authInfo', authInfo);
    },
    /** 模态框确认后的回调 */
    onDialogConfirm(selectedItem) {
      this.getReceiverInfo(selectedItem);
      this.dialogVisible = false;
      this.formsData.isShowRegistered = true;
    },
    // 预约处理日期----节假日查询方法
    changAppointedDay() {
      let date = tools.date2Str(this.formsData.scheduleDate, 'YYYY-MM-DD');
      this.$set(this.formsData, 'scheduleDate', date);
      judgeHoliday({ holidayDay: date }).then(res => {
        if (res) {
          this.$message({
            message: this.$t('PAYMENT.HOLIDAY_ERROR'),
            type: 'warn',
            delay: 3000
          });
          this.$set(this.formsData, 'scheduleDate', '');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
