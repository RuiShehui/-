<!-- 行内转账- 填写转账信息-->
<template>
  <div class="g-intraBank-transferinfo" v-loading="requestLoading">
    <el-form
      v-loading="requestLoading"
      ref="submitForm"
      :model="formsData"
      label-width="160px"
      :rules="formsRule"
    >
      <!-- 付款账户信息 -->
      <divider :title="$t('PAYMENT.PAYER_INFO')" />
      <!-- 付款账户 -->
      <el-form-item class="m-selAccount" :label="`${$t('PAYMENT.PAYMENT_ACCOUNT')}：`">
        <!-- debitAcct | creditAcct -->
        <el-select v-model="debitIndex" :filterable="true" @change="selectDebitAcct">
          <el-option
            v-for="(item, index) in debitAcctList"
            :label="item.label"
            :value="index"
            :key="index"
          />
        </el-select>
        <!-- 付款户名 -->
        <p class="lh20 m-selAccount-name tl" v-show="showNameFlag">
          <span>{{ `${$t('PAYMENT.ACCOUNT_NAME')}：${formsData.debitAcctName}` }}</span>
        </p>
        <!-- 付款账户-透支提醒 (账户类型为往来账户时显示) -->
        <el-tag v-if="isShowOverBalance" type="warning">
          <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
        </el-tag>
        <!-- 付款账户-可用结余 -->
        <p
          class="lh20 m-selAccount-balance"
          v-show="formatMoneyNew(formsData.currbal) !== '-1' && showNameFlag"
        >
          <span>
            {{
            `${$t('PAYMENT.AVAILABLE_BALANCE')}：${formsData.ccy} ${formatMoneyNew(
            formsData.currbal
            )}`
            }}
          </span>
        </p>
      </el-form-item>
      <!-- 预约处理 -->
      <!-- <el-form-item :label="`${$t('PAYMENT.APPOINTMENT_PROCESS')}：`" prop="isScheduleTx">
        <el-checkbox v-model="formsData.isScheduleTx" />
      </el-form-item>-->
      <!-- 预约处理日期 -->
      <!-- <el-form-item
        prop="scheduleDate"
        v-show="formsData.isScheduleTx ? true : false"
        class="sel-account"
        :label="`${$t('PAYMENT.APPOINTMENT_DATE')}：`"
        :required="formsData.isScheduleTx ? true : false"
      >
        <el-date-picker
          v-model="formsData.scheduleDate"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="option"
          :clearable="false"
          @input="$forceUpdate()"
        ></el-date-picker>
      </el-form-item>-->
      <!-- 重试扣账 -->
      <el-form-item
        :label="`${$t('PAYMENT.RETRY_DEDUCTION')}：`"
        v-show="formsData.isScheduleTx ? true : false"
        prop="isRetry"
      >
        <el-checkbox v-model="formsData.isRetry">{{ $t('PAYMENT.RETRY_TIPS') }}</el-checkbox>
      </el-form-item>
      <!-- 收款人信息 -->
      <divider :title="$t('PAYMENT.PAYEE_INFO')" />
      <!-- 收款人类型 -->
      <el-form-item :label="`${$t('PAYMENT.PAYEE_TYPE')}：`" prop="creditType" required>
        <el-radio-group v-model="formsData.creditType" @change="changeCreditType">
          <!-- 本人名下演示账户 -->
          <el-radio :label="1">{{ $t('PAYMENT.MY_ACCOUNT') }}</el-radio>
          <!-- 已登记第三者账户 -->
          <el-radio :label="2">
            {{ $t('PAYMENT.REGISTERED_ACCOUNT') }}
            <span
              @click="listDialogVisible = true"
              class="account-btn"
              v-if="formsData.creditType === 2"
            >{{ $t('PAYMENT.REGISTRIED_ACCOUNT_QUERY') }}</span>
          </el-radio>
          <!-- 未登记账户 -->
          <el-radio :label="3">
            {{ $t('PAYMENT.NO_REGISTERED_ACCOUNT') }}
            <span
              v-if="formsData.creditType === 3"
              class="account-btn"
              @click="listDialogVisible = true"
            >{{ $t('PAYMENT.IMPORT_NEAREST_PEYEE') }}</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 收款人 -->
      <template v-if="formsData.creditType !== 2 || formsData.isShowRegistered">
        <!-- 收款账户 已登记/未登记输入收款账户-->
        <el-form-item
          v-if="formsData.creditType !== 1"
          :label="`${$t('PAYMENT.RECEIVE_ACCOUNT')}：`"
          prop="creditAcct"
          key="creditAcct"
        >
          <el-input
            v-model="formsData.creditAcct"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVE_ACCOUNT')
              })
            "
            :disabled="formsData.creditType === 2 ? true : false"
            maxlength="34"
          />
        </el-form-item>
        <!-- 收款账户 本人名下演示 选择收款账户 -->
        <!-- debitAcct | creditAcct -->
        <el-form-item
          v-else
          :label="`${$t('PAYMENT.RECEIVE_ACCOUNT')}：`"
          prop="creditAcct"
          key="creditAcct1"
        >
          <el-select v-model="formsData.creditAcct" :filterable="true" @change="selectedCreditAcct">
            <el-option
              v-for="(item, index) in creditAcctList"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <!-- 收款户名 -->
        <el-form-item
          v-if="formsData.creditType !== 1"
          :label="`${$t('PAYMENT.PAYEE_NAME')}：`"
          prop="creditAcctName"
        >
          <el-input
            v-model="formsData.creditAcctName"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.PAYEE_NAME')
              })
            "
            :disabled="formsData.creditType === 2 ? true : false"
            maxlength="120"
          />
        </el-form-item>
      </template>
      <!-- 转账金额 -->
      <el-form-item class="m-amountStyle is-required" :label="`${$t('PAYMENT.TRANSFER_AMOUNT')}：`">
        <!-- 收款账户的币种 -->
        <el-select
          class="m-amountStyle-one"
          v-model="formsData.ccy"
          @change="formsData.amount = ''"
        >
          <el-option
            v-for="(item, index) in ccyList"
            :label="item.label"
            :value="item.value"
            :key="index"
          />
        </el-select>
        <el-form-item prop="amount" label-width="0" key="amount" class="m-amountStyle-two">
          <money-input
            :maxlength="17"
            :isSaveDot="formsData.ccy !== 'JPY'"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.TRANSFER_AMOUNT')
              })
            "
            v-model="formsData.amount"
            style="width: 160px"
            @blur="initAuthSelect"
          />
        </el-form-item>
      </el-form-item>
      <!-- 登记此账户 -->
      <el-form-item
        v-if="formsData.creditType === 3"
        :label="`${$t('PAYMENT.IS_REGISTERED')}：`"
        prop="isRegistry"
      >
        <el-checkbox v-model="formsData.isRegistry" />
      </el-form-item>
      <!-- 授权提醒 组件 -->
      <auth-select
        v-if="entType !== 1"
        :authInfo="formsData.authInfo"
        tradeType="030101"
        :acctNo="formsData.debitAcct"
        :amount="formsData.amount"
        ref="authSelect"
        labelWidth="160px"
        @checkClick="getAuthInfo"
      />
      <footer class="flexc mt36">
        <!-- 重置 -->
        <v-button size="w160" @click="handleReset">{{ $t('COMMON.RESET') }}</v-button>
        <!-- 暂存交易草稿 -->
        <v-button
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          @click="handleSave"
          class="mlr15"
        >{{ $t('PAYMENT.TEMPORARY_TRANSACTION') }}</v-button>
        <!-- 下一步 -->
        <v-button
          type="primary"
          size="w160"
          @click="handleTradeConfirm"
        >{{ $t('COMMON.NEXT_STEP') }}</v-button>
      </footer>
    </el-form>
    <!-- 已登记/最近收款人弹窗 -->
    <component
      :is="renderDialog"
      :dialogVisible.sync="listDialogVisible"
      :accountType="formsData.creditType"
      payType="inline"
      @confirmClick="getChooseInfo($event)"
      @toCancle="listDialogVisible = false"
      @close="listDialogVisible = false"
    />
  </div>
</template>

<script>
import businessFilter from '@/filters/business';
import AccountList, {
  RegisterAccts
} from '@bank-transfer/components/accountList';
import {
  innerBankGetPreviousInfo,
  nextStepValidate
} from '@/api/paymentRemittance';
import { mapState } from 'vuex';

import tools from '@/dataTools/tools';
import {
  getValidateAmount,
  transToSubmitInnerParams,
  initPaymentFormData,
  formatAcctNo,
  reduceAcctList
} from '@bank-transfer/utils/function';
import { ccyList } from '@bank-transfer/utils/constant';
import { transWrite } from '@bank-transfer/mixins';

const { getCurrentTimes, getNearDay } = tools;

const formsData = {
  transferAccType: 'intr',
  accountType: '', // 账户类型
  creditAcctLabel: '', //收款账户显示
  creditAcct: '', //收款账户
  creditAcctName: '', //收款户名
  bankInstitution: '', // 付款银行机构
  currbal: '', // 可用结余
  isScheduleTx: false, // 预约处理
  scheduleDate: getNearDay(getCurrentTimes(), 1), //预约处理日期
  isRetry: false, // 重试扣账
  creditCcy: '', //登记第三者or最近收款人带出的币种以及选择的币种
  creditAcctType: '', //登记第三者or最近收款人带出的账户类型-若有值，就是从登记第三者，或最近转账记录拿来的值
  creditType: 1, // 收款人类型
  debitCcy: '', // 付款币种
  isRegistry: false, // 登记此账户
  remindNameList: [], // 提醒人
  amount: '', //金额
  debitAcct: '', //付款账户
  debitAcctName: '', //付款户名
  creditBankCode: '', // 收款银行编号
  debitAcctLabel: '', //付款账户显示
  additionalComment: '', //附言
  remark: '', //备注
  ccy: '', //交易币种
  isShowRegistered: false, // 展示收款人账户标识

  authInfo: {} // 授权信息
};

export default {
  components: {
    AccountList,
    RegisterAccts
  },
  mixins: [transWrite],
  data() {
    const self = this;

    return {
      listDialogVisible: false, //已登记/最近收款人列表
      formsData: { ...formsData },
      // 付款账户
      debitAcctList: [],
      ccyList: [...ccyList]
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    /** 根据payType判断需要渲染的弹窗 */
    renderDialog() {
      const { creditType } = this.formsData;
      if (creditType === 2) {
        return 'RegisterAccts';
      }
      return 'AccountList';
    },
    /** 付款币种和收款币种是否相同 */
    isSameCurrency() {
      const { debitCcy, ccy, creditAcctType,creditCcy } = this.formsData;
      if (creditAcctType !== 'MULTICURRENCY') {
        if ((creditCcy && creditCcy !== debitCcy) || ccy !== debitCcy) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    /** 校验规则 (待补充) */
    formsRule() {
      const self = this;
      const amountValidate = getValidateAmount(self);
      return {
        scheduleDate: {
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
        creditAcct: [
          {
            required: true,
            message:
              self.formsData.creditType === 3
                ? self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.RECEIVE_ACCOUNT')
                  })
                : self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: self.$t('PAYMENT.RECEIVE_ACCOUNT')
                  }),
            trigger: 'blur'
          }
        ],
        creditAcctName: [
          {
            required: true,
            message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: self.$t('PAYMENT.PAYEE_NAME')
            }),
            trigger: 'blur'
          }
        ],
        amount: [{ validator: amountValidate, trigger: 'blur' }]
      };
    }
  },
  watch: {
    debitIndex(newVal) {
      this.$refs['submitForm'].clearValidate();
    }
  },
  methods: {
    /**
     * 1. 初始化表单数据
     * 2. 初始化授权数据
     */
    init() {
      if (this.isJumpTo) {
        this.$set(this, 'formsData', { ...this.jumpData });
        this.formsData.creditType = Number(this.jumpData.creditType);
        if (this.jumpData && this.jumpData.creditAcct) {
          this.$set(this.formsData, 'isShowRegistered', true);
        }
      }
      if (this.confirmData) {
        this.formsData = initPaymentFormData({
          ...this.formsData,
          ...this.confirmData
        });
      }

      if (this.confirmData.creditType) {
        this.formsData.creditType = Number(this.confirmData.creditType);
      }
      if (this.confirmData && this.confirmData.creditAcct) {
        this.$set(this.formsData, 'isShowRegistered', true);
      }
      if (this.confirmData.hasOwnProperty('tdId')) {
        this.$set(this.formsData, 'tdId', this.confirmData.tdId);
      }
      this.getAccountInfo();
      setTimeout(() => {
        this.$refs['submitForm'].clearValidate();
      }, 0);
    },
    /**
     * 获取账户信息 (付款账户、手续费账户、收款账户)
     */
    async getAccountInfo() {
      this.debitAcctList = [];

      let res = await innerBankGetPreviousInfo({});
      if (res) {
        this.debitAcctList = res.debitAcctList;
        this.debitAcctList = this.debitAcctList.sort((a, b) => {
          return Number(a.stateSort) - Number(b.stateSort);
        });
        // 设置页面展示账户内容
        this.setAcctList(this.debitAcctList, 'debitAcctList');

        // 设置索引
        if (this.jumpData.JumpBusinessCode === '030101') {
          this.initDebitAcct(this.jumpData.debitAcct, this.jumpData.debitCcy);
        } else {
          this.initDebitAcct();
        }
        this.selectDebitAcct(this.debitIndex);
      }
    },
    changeCreditType() {
      console.log(12);
      this.formsData.creditAcctLabel = '';
      this.formsData.creditAcct = '';
      this.formsData.creditAcctName = '';
      this.formsData.creditBankCode = '';
      this.formsData.creditCcy = '';
      this.formsData.creditAcctType = '';
      this.$refs['submitForm'].clearValidate();
    },
    /**
     * 重置填写页面的数据
     * 1. 重置授权提醒数据
     * 2. 重置填写表单的数据
     */
    handleReset() {
      if (this.$refs['authSelect']) {
        this.$refs['authSelect'].reset();
        this.clearLevelLists();
      }
      this.$set(this, 'formsData', { ...formsData });
      this.selectDebitAcct(0);
      setTimeout(() => {
        this.$refs['submitForm'].clearValidate();
      }, 0);
    },
    /**
     * 已登记/最近收款人 选择
     */
    getChooseInfo(selectedItem) {
      this.listDialogVisible = false;

      console.log('选择值', selectedItem);

      for (let k in selectedItem) {
        if (this.formsData.hasOwnProperty(k)) {
          this.$set(this.formsData, k, selectedItem[k]);
        }
      }
      this.formsData.isShowRegistered = true;
      if (this.formsData.creditAcctType !== 'MULTICURRENCY') {
        if (this.formsData.creditCcy !== this.formsData.debitCcy) {
          this.$message({
            type: 'warn',
            message: this.$t('PAYMENT.CURRENCY_NOT_VALID'),
            delay: 3000
          });
        }
      }else {
        this.$set(this.formsData, 'creditCcy', this.formsData.debitCcy);
      }
      console.log('选择值1', this.formsData);
    },
    /** 保存交易草稿 */
    handleSave() {
      const params = {
        transactionType: '1',
        tdId: this.formsData.tdId || '0',
        // transactionText: JSON.stringify(this.formsData),
        uploadMethod: '0'
      };
      this.saveCraft(params);
    },
    /**
     * 校验填写信息是否合法
     */
    confirmCheck() {
      if (this.formsData.creditType == 2) {
        if (!this.formsData.creditAcct) {
          this.$message({
            type: 'warn',
            message: this.$t('COMMON.SELECT_SOMETIME', {
              select: this.$t('PAYMENT.RECEIVE_ACCOUNT')
            }),
            delay: 3000
          });
          return false;
        }
      }
      if (
        this.formsData.creditAcctType &&
        this.formsData.creditAcctType !== 'MULTICURRENCY'
      ) {
        if (this.formsData.creditCcy !== this.formsData.debitCcy) {
          this.$message({
            type: 'warn',
            message: this.$t('PAYMENT.CURRENCY_NOT_VALID'),
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
            message: this.$t('PAYMENT.LACK_OF_BALANCE'),
            delay: 3000
          });
          return true;
        }
        if (this.formsData.isOdLimit == 'Y') {
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
    /** 确认无误后, 调用下一步校验的接口, 判断跳转 */
    async handleNextStep() {
      if ((this.formsData.creditCcy === '' || this.formsData.creditCcy === null) && this.formsData.creditType === 3) {
        this.formsData.creditCcy = this.formsData.ccy
      }
      if (this.formsData.creditType === 1) {
         this.formsData.creditCcy = this.formsData.ccy
      }

      if (!this.checkDebitStatus()) {
        return;
      }
      this.$refs['submitForm'].validate(valid => {
        this.scrollToTop();
        if (!this.isSameCurrency) {
          this.$message({
            message: this.$t('PAYMENT.CURRENCY_NOT_VALID'),
            type: 'fail'
          });
          return;
        }
        if (valid) {
          if (this.confirmCheck()) {
            this.handleSubmitData();
          }
        }
      });
    },
    /**
     * 请求接口判断当前步骤数据是否能过FPS系统
     */
    async handleSubmitData() {
      const checkData = transToSubmitInnerParams({
        ...this.formsData
      });
      const result = await nextStepValidate(checkData);
      if (result) {
        if (![undefined, null, NaN].includes(result.body)) {
          console.log(checkData);
          this.$emit('next', checkData);
        }
      }
    },
    // 获取授权信息
    getAuthInfo(authInfo) {
      this.$set(this.formsData, 'authInfo', authInfo);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
