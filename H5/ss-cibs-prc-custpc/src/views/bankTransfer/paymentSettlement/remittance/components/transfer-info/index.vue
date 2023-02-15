<!--电汇-转账信息页-->
<template>
  <div class="g-remittance-transferInfo" v-loading="requestLoading">
    <el-form
      ref="transferForm"
      :model="formsData"
      label-width="180px"
      :rules="formValidateRules"
      label-suffix=" :"
    >
      <divider :title="$t('PAYMENT.PAYER_INFO')" />
      <!-- 付款账户 -->
      <el-form-item
        class="m-selAccount"
        :label="`${$t('PAYMENT.PAYMENT_ACCOUNT')}`"
        prop="debitAcct"
      >
        <el-select :filterable="true" v-model="debitIndex" @change="selectDebitAcct">
          <el-option
            v-for="(item, index) in debitAcctList"
            :label="item.label"
            :value="index"
            :key="`${index} ${item.value}`"
          />
        </el-select>
        <p class="lh20 m-selAccount-name tl" v-show="formsData.debitAcctName.length">
          <span>{{ $t('PAYMENT.ACCOUNT_NAME') }}：</span>
          <span class="money">{{ formsData.debitAcctName }}</span>
        </p>
        <el-tag v-if="isShowOverBalance" type="warning">
          <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
        </el-tag>
        <p
          class="lh20 m-selAccount-balance"
          v-show="showNameFlag && formatMoney(formsData.currbal) !== '-1'"
        >
          <span>{{ $t('PAYMENT.AVAILABLE_BALANCE') }}:</span>
          <span class="money">{{ formsData.ccy + ' ' + formatMoney(formsData.currbal) }}</span>
        </p>
      </el-form-item>
      <!-- 费用支付方式 -->
      <el-form-item :label="$t('PAYMENT.PAYMENT_METHOD')" prop="chargePayWay" class="m-flex-radio">
        <el-radio-group v-model="formsData.chargePayWay" class="radio-chargePayWay">
          <el-radio label="SHA">{{ $t('PAYMENT.PAYMENT_METHOD_TIP1') }}</el-radio>
          <el-radio label="BEN">{{ $t('PAYMENT.PAYMENT_METHOD_TIP2') }}</el-radio>
          <el-radio label="OUR">{{ $t('PAYMENT.PAYMENT_METHOD_TIP3') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 费用扣款账户 -->
      <el-form-item
        v-if="formsData.chargePayWay !== 'BEN'"
        class="m-selAccount"
        :label="$t('PAYMENT.FEE_DEBIT_ACCOUNT')"
        prop="chargeAcct"
        :required="formsData.chargePayWay !== 'BEN'"
      >
        <el-select :filterable="true" v-model="dedutIndex" @change="selectPoundPayAcct">
          <el-option
            v-for="(item, index) in chargeAcctList"
            :label="item.label"
            :value="index"
            :key="`${index} ${item.value}`"
          />
        </el-select>
        <p class="lh20 m-selAccount-name tl" v-show="formsData.deductAcctName.length">
          {{ `${$t('PAYMENT.ACCOUNT_NAME')}` }}
          <span>{{ formsData.deductAcctName }}</span>
        </p>
        <el-tag v-if="formsData.deductAcctType === 'CURRENT'" type="warning">
          <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
        </el-tag>
        <p class="lh20 m-selAccount-balance" v-show="formsData.deductAcctMoney">
          {{ `${$t('PAYMENT.AVAILABLE_BALANCE')}:` }}
          <span>{{formsData.chargeCcy + ' ' + formatMoney(formsData.deductAcctMoney)}}</span>
        </p>
      </el-form-item>
      <!-- 预约处理 -->
      <el-form-item :label="`${$t('PAYMENT.APPOINTMENT_PROCESS')}`" prop="isScheduleTx">
        <el-checkbox v-model="formsData.isScheduleTx"></el-checkbox>
      </el-form-item>
      <!-- 预约处理日期 -->
      <el-form-item
        :label="`${$t('PAYMENT.APPOINTMENT_DATE')}`"
        prop="scheduleDate"
        v-if="formsData.isScheduleTx"
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
      <!-- 收款人信息 -->
      <divider :title="$t('PAYMENT.PAYEE_INFO')" />
      <!-- 收款人类型 -->
      <el-form-item :label="`${$t('PAYMENT.PAYEE_TYPE')}`" class="m-flex-radio">
        <el-radio-group v-model="formsData.creditorType" @change="onResetCredit">
          <!--
            账户类型显示
            REGISTERED_ACCOUNT - 已登记账户
            NOT_REGISTERED_ACCOUNT - 未登记账户
          -->
          <el-radio
            v-show="prop !== CREDIT_TYPE_MAP.MY_ACCOUNT"
            v-for="(label, prop) in CREDIT_TYPES"
            :key="prop"
            :label="prop"
          >
            <label>{{ label }}</label>
            <span
              v-show="
                formsData.creditorType !== CREDIT_TYPE_MAP.MY_ACCOUNT &&
                  formsData.creditorType === prop
              "
              :class="[
                formsData.creditorType ===
                CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
                  ? 'accountse-btn'
                  : 'accounts-btn'
              ]"
              @click="dialogVisible = true"
            >
              {{
              formsData.creditorType ===
              CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
              ? $t('PAYMENT.IMPORT_NEAREST_PEYEE')
              : $t('PAYMENT.REGISTRIED_ACCOUNT_QUERY')
              }}
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 收款人名称 -->
      <el-form-item :label="$t('PAYMENT.ACCT_NAME')" prop="creditAcctName">
        <el-input
          v-model="formsData.creditAcctName"
          :maxlength="formsData.strLenght"
          :disabled="
            formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT
              ? true
              : false
          "
          :placeholder="
            `${$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: $t('PAYMENT.ACCT_NAME')
            })}`
          "
        />
      </el-form-item>
      <!-- 收款人 国家/地区 -->
      <el-form-item
        v-show="
          formsData.isShowRegisted ||
            formsData.creditorType === CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
        "
        :label="$t('PAYMENT.RECEIVER_COUNTRY')"
        prop="creditRegion"
      >
        <el-input
          v-show="formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT"
          class="form-item-component"
          :value="findCountryName(formsData.creditRegion)"
          :disabled="true"
          :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVER_COUNTRY')
              })
            "
        />
        <el-select
          v-show="formsData.creditorType !== CREDIT_TYPE_MAP.REGISTERED_ACCOUNT"
          v-model="formsData.creditRegion"
          class="form-item-component"
          :filterable="true"
        >
          <el-option
            v-for="item in countryInfoList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 收款人地址 -->
      <el-form-item :label="`${$t('PAYMENT.RECEIVER_ADDRESS')}`" prop="creditAddress">
        <el-input
          v-model="formsData.creditAddress"
          :maxlength="formsData.strLenght"
          :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVER_ADDRESS')
              })
            "
          :disabled="
              formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT
            "
        />
      </el-form-item>
      <!-- 已登记第三者账户 选择账户反显/ 未登记账户-->
      <template>
        <!--  账户号码/IBAN -->
        <el-form-item
          v-show="
          formsData.isShowRegisted ||
            formsData.creditorType === CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
        "
          :label="$t('PAYMENT.ACCT_NO_OR_IBAN')"
          prop="creditAcct"
        >
          <el-input
            v-model="formsData.creditAcct"
            maxlength="34"
            :disabled="
              formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT
            "
            :blur="acctBlurFun()"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.ACCT_NO_OR_IBAN')
              })
            "
          />
        </el-form-item>
      </template>
      <!-- 收款银行信息 -->
      <divider
        :title="$t('PAYMENT.RECEIVE_BANK_INFO')"
        v-if="
          formsData.isShowRegisted ||
            formsData.creditorType === CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
        "
      />
      <!-- 收款方式 -->
      <div class="el-form-item radioStyle">
        <template v-if="formsData.creditorType === CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT">
          <el-radio-group v-model="formsData.isSwiftCode" @change="onSwichIsSwiftCode">
            <el-form-item
              class="radioStylebox"
              v-for="prop of radioList"
              :key="prop.name"
              :prop="prop.name"
            >
              <div class="radioStyleboxS">
                <el-radio
                  class="el-form-item__label"
                  :style="(lang === 'en'&&prop.name === 'creditBankRegion') ? 'width:260px;left:-80px;' : ''"
                  :label="prop.type"
                >{{(prop.name === 'creditBankRegion'? $t('PAYMENT.PAYEE_COUNTRY_CODE') :'SWIFT Code') + ' : '}}</el-radio>
                <el-input
                  class="el-form-item__content"
                  v-if="prop.name === 'swiftCode'"
                  :maxlength="11"
                  v-model="formsData.swiftCode"
                  :placeholder="
            $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'SWIFT Code' })
          "
                  :disabled="!isSelectSwiftCode"
                  @blur="onSwiftCodeBlur"
                  @keyup.enter.native="onSwiftCodeBlur"
                />
                <el-select
                  class="el-form-item__content"
                  v-if="prop.name !== 'swiftCode'"
                  :disabled="isSelectSwiftCode"
                  :placeholder="
              $t('COMMON.PLEASE_SELECT_SOMETHING', {
                select: $t('PAYMENT.PAYEE_COUNTRY_CODE')
              })
            "
                  v-model="formsData.creditBankRegion"
                  :filterable="true"
                  @change="selectCountry"
                >
                  <el-option
                    v-for="(item, index) in countryInfoList"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-radio-group>
        </template>
      </div>
      <!-- 收款银行/国家地区 -->
      <template
        v-if="
          formsData.isShowRegisted ||
            formsData.creditorType === CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
        "
      >
        <el-form-item
          v-if="formsData.isSwiftCode && formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT"
          label="SWIFT Code"
          prop="swiftCode"
        >
          <el-input
            v-model="formsData.swiftCode"
            :placeholder="
            $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'SWIFT Code' })
          "
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          v-if="formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT"
          :label="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
          prop="creditBankRegion"
        >
          <el-input
            :value="findCountryName(formsData.creditBankRegion)"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.PAYEE_COUNTRY_CODE')
              })
            "
            :disabled="true"
          />
        </el-form-item>
        <!-- 银行名称, 银行地址 -->
        <template>
          <el-form-item :label="$t('PAYMENT.BANK_ADDRESS')" prop="creditBankAddress">
            <el-input
              v-model="formsData.creditBankAddress"
              :disabled="
                isSelectSwiftCode ||
                  formsData.creditorType !==
                    CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT
              "
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.BANK_ADDRESS')
                })
              "
              :maxlength="formsData.strLenght"
            />
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.BANK_NAME')" prop="creditBankName">
            <el-input
              v-model="formsData.creditBankName"
              :disabled="isSelectSwiftCode ||
                  formsData.creditorType !==
                    CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.BANK_NAME')
                })
              "
              :maxlength="formsData.strLenght"
            />
          </el-form-item>
        </template>
        <!-- 汇款致 中国 -->
        <template v-if="formsData.creditBankRegion === 'CN' && formsData.ccy === 'CNY'">
          <el-form-item :label="$t('PAYMENT.TT_PURPOSE_CODE')" prop="ttPurposeCode">
            <el-select
              :placeholder="
                $t('COMMON.PLEASE_SELECT_SOMETHING', {
                  select: $t('PAYMENT.TT_PURPOSE_CODE')
                })
              "
              v-model="formsData.ttPurposeCode"
            >
              <el-option v-for="item of chinaTTList" :key="item.value" v-bind="item" />
            </el-select>
          </el-form-item>
        </template>
        <!-- 汇款致 美国 -->
        <template v-if="formsData.creditBankRegion === 'US'">
          <el-form-item :label="$t('PAYMENT.TT_USABANK_CODE')" prop="creditBankCode">
            <el-radio-group v-model="formsData.bankCodeType" @change="onTtPurposeCodeSelect">
              <el-radio label="CU" class="pt16">CHIPS UID</el-radio>
              <el-radio label="FN" class="pt16">Fedwire No./ABA No.</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="
              formsData.bankCodeType === 'CU'
                ? 'CHIPS UID'
                : formsData.bankCodeType === 'FN'
                ? 'Fedwire No./ABA No.'
                : ''
            "
            prop="creditBankCode"
            class="m-amountStyle is-required"
          >
            <el-input
              class="m-amountStyle-one"
              style="width: 150px"
              :disabled="true"
              v-model="formsData.creditBankCodeTip"
            />
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :maxlength="formsData.bankCodeType === 'CU'? 6 : 'FN' ? 9 : 6"
                v-model="formsData.creditBankCode"
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: formsData.bankCodeType === 'CU'
                ? 'CHIPS UID'
                : formsData.bankCodeType === 'FN'
                ? 'Fedwire No./ABA No.'
                : $t('PAYMENT.TT_USABANK_CODE')
                })
              "
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            label="CHIPS UID"
            v-if="formsData.paymentType === 2"
            class="m-amountStyle is-required"
          >
            <el-input
              class="m-amountStyle-one"
              style="width: 150px"
              :disabled="true"
              v-model="formsData.creditBankCodeTip"
            />
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'CHIPS UID' })
              "
                v-model="formsData.bankName"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item
            label="Fedwire No./ABA No."
            v-if="formsData.paymentType === 3"
            class="m-amountStyle is-required"
          >
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: 'Fedwire No./ABA No.'
                })
              "
                v-model="formsData.bankName"
              />
            </el-form-item>
          </el-form-item>
        </template>
        <!-- 汇款致 英国 -->
        <template v-if="formsData.creditBankRegion === 'GB'">
          <!-- bankName -->
          <el-form-item label="SORT Code" class="m-amountStyle is-required">
            <el-input
              class="m-amountStyle-one"
              style="width: 150px"
              :disabled="true"
              v-model="formsData.creditBankCodeTip"
            />
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'SORT Code' })
              "
                maxlength="6"
                v-model="formsData.creditBankCode"
              />
            </el-form-item>
          </el-form-item>
        </template>
        <!-- 汇款致 加拿大 -->
        <template v-if="formsData.creditBankRegion === 'CA'">
          <el-form-item label="Transit Code" class="m-amountStyle is-required">
            <el-input
              class="m-amountStyle-one"
              style="width: 150px"
              :disabled="true"
              v-model="formsData.creditBankCodeTip"
            />
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'Transit Code' })
              "
                maxlength="9"
                v-model="formsData.creditBankCode"
              />
            </el-form-item>
          </el-form-item>
        </template>
        <!-- 汇款致 澳洲 -->
        <template v-if="formsData.creditBankRegion == 'AU'">
          <el-form-item label="BSB No." class="m-amountStyle is-required">
            <el-input
              class="m-amountStyle-one"
              style="width: 150px"
              :disabled="true"
              v-model="formsData.creditBankCodeTip"
            />
            <el-form-item prop="creditBankCode" class="m-amountStyle-two creditstyle">
              <el-input
                :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'BSB No.' })
              "
                maxlength="6"
                v-model="formsData.creditBankCode"
              />
            </el-form-item>
          </el-form-item>
        </template>
      </template>
      <!-- 汇款金额 -->
      <el-form-item
        :label="$t('PAYMENT.PAYEE_AMOUNT')"
        prop="ccy"
        class="m-amountStyle is-required"
      >
        <el-select
          v-model="formsData.ccy"
          class="m-amountStyle-one"
          @change="formsData.amount = ''"
        >
          <el-option
            v-for="(item, index) in ccyList"
            :label="item.label"
            :value="item.value"
            :key="index"
          />
        </el-select>
        <el-form-item prop="amount" label-width="0" class="m-amountStyle-two">
          <money-input
            v-model="formsData.amount"
            :maxlength="17"
            :isSaveDot="true"
            :isFullNumber="formsData.ccy === 'JPY'"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.PAYEE_AMOUNT')
              })
            "
            @blur="initAuthSelect"
            style="width: 160px"
          />
        </el-form-item>
      </el-form-item>
      <!-- 附言（致收款人） -->
      <el-form-item :label="`${$t('PAYMENT.POSTSCRIPT')}`" prop="additionalComment">
        <el-input
          v-model="formsData.additionalComment"
          :placeholder="
            $t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: $t('PAYMENT.POSTSCRIPT')
            })
          "
          maxlength="140"
        />
        <!-- maxlength="acLength" -->
      </el-form-item>
      <!-- 备注 -->
      <!-- <el-form-item :label="`${$t('PAYMENT.REMARKS')}`" prop="remark">
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
      <!-- 是否登记此账户 -->
      <el-form-item
        :label="`${$t('PAYMENT.IS_REGISTERED')}`"
        prop="isRegistry"
        v-if="formsData.creditorType !== CREDIT_TYPE_MAP.REGISTERED_ACCOUNT"
      >
        <el-checkbox v-model="formsData.isRegistry" />
      </el-form-item>
      <!-- 授权提醒 -->
      <auth-select
        v-if="entType !== 1"
        ref="authSelect"
        labelWidth="180px"
        :acctNo="formsData.debitAcct"
        @checkClick="getAuthInfo"
        :authInfo="formsData.authInfo"
        :amount="formsData.amount"
        tradeType="030103"
      />
      <div class="wPro" style="padding-top: 0px;">
        <p class="p1">{{ $t('PAYMENT.CONFIRMATION_TIPS') }}</p>
        <p v-for="(item, index) in $t('PAYMENT.CONFIRMATION_TIPS_TEXT')" :key="index" v-html="item"></p>
      </div>
      <el-row class="flexc mt36">
        <v-button type size="w160" @click="handleReset">{{ $t('COMMON.RESET') }}</v-button>
        <v-button
          type
          size="wMin160"
          @click="saveTransfer"
          class="mlr15"
        >{{ $t('PAYMENT.TEMPORARY_TRANSACTION') }}</v-button>
        <v-button
          type="primary"
          size="w160"
          @click="handleTradeConfirm"
        >{{ $t('COMMON.NEXT_STEP') }}</v-button>
      </el-row>
    </el-form>

    <!-- 是否登记/最近转账的列表弹窗 -->
    <component
      :is="renderPopup"
      :dialogVisible.sync="dialogVisible"
      :type="formsData.creditorType"
      :accountType="formsData.creditorType"
      :payType="payType"
      @confirmClick="onCheckedItem"
      @toCancle="dialogVisible = false"
      @close="dialogVisible = false"
    />
    <div class="wPro">
      <p class="p1">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p v-for="(item, index) in $t('PAYMENT.GLOBAL_TIPS')" :key="index" v-html="item"></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CommonPopup, {
  RegisterAccts
} from '@bank-transfer/components/accountList';
import ccyTool from '@/filters/accountManagement';

import {
  globalGetPreviousInfo,
  requestTelegraphicTx,
  getSwiftDetails
} from '@/api/paymentRemittance';
import { judgeHoliday } from '@/api/openFixed.js';
import businessFilter from '@/filters/business';
import mathTools from '@/utils/mathTools';
import tools from '@/dataTools/tools';
import countryInfos from '@/mixins/countryInfos';
import { transWrite } from '@bank-transfer/mixins';
import {
  getValidateAmount,
  filterRemittanceParams,
  initRemittanceParams,
  setTransferBankInfoBySwiftCode,
  formatAcctNo
} from '@bank-transfer/utils/function';
import {
  CREDIT_TYPES,
  CREDIT_TYPE_MAP,
  ccyList,
  // chinaTTList
} from '@bank-transfer/utils/constant';
import _ from 'lodash';

const { getCurrentTimes, getNearDay } = tools;

const formsData = {
  /** -------------- 付款信息区域 ---------------- */
  debitAcct: '', // 付款账户
  debitAcctName: '', // 付款账户名
  debitCcy: '', // 付款账户币种
  /** -------------- 付款信息区域 ---------------- */
  /** -------------- 手续费信息区域 ---------------- */
  chargeAcct: '', // 费用扣款账户
  chargeAcctName: '', // 费用扣款账户名称
  deductAcctMoney: '', // 手续费账户金额
  deductAcctName: '', // 手续费账户名称
  chargeCcy: '', // 手续费扣款币种
  /** -------------- 手续费信息区域 ---------------- */
  /** -------------- "预约处理"信息区域 ---------------- */
  isScheduleTx: false, // 是否预约处理
  // scheduleDate: getNearDay(getCurrentTimes(), 1), // 预约处理日期
  scheduleDate: '', // 预约处理日期
  isRetry: false, // 是否重试扣账
  /** -------------- "预约处理"信息区域 ---------------- */
  /** -------------- 收款人信息区域 ---------------- */
  creditorType: CREDIT_TYPE_MAP.REGISTERED_ACCOUNT, // 收款人类型
  creditAcct: '', // 账户号码/IBAN
  creditAcctName: '', // 收款人名称
  creditAddress: '', // 收款人地址
  creditRegion: '', // 收款人国家/地区
  creditCcy: '', // 收款币种
  /** -------------- 收款人信息区域 ---------------- */
  isSwiftCode: true, // 选择"SwiftCode"或者"收款银行国家地区"
  /** -------------- 收款银行信息区域 ---------------- */
  swiftCode: '', // 电汇SwiftCode
  creditBankRegion: '', // 收款银行国家/地区
  creditBankName: '', // 收款银行名称
  creditBankAddress: '', // 收款银行地址
  /** -------------- 收款银行信息区域 ---------------- */
  /** -------------- 备用字段区域 ---------------- */
  bankArea: '', // 香港银行编号
  bankCodeType: '', // 国家选择的方式
  ttPurposeCode: '', // 银行目的代码 (仅限中国)
  creditBankCode: '', // 银行目的代码 (除了中国)
  creditBankCodeTip: '', //默认值--澳洲"AU"、加拿大"CC"、美国"CH"、英国"SC"
  bankName: '', // 外国指定银行名称
  /** -------------- 备用字段区域 ---------------- */
  currbal: '-1', // 可用结余
  chargePayWay: 'SHA', // 费用支付方式
  isRegistry: false, // 是否登记此账户
  ccy: 'HKD', // 当前汇款金额类型
  amount: '', // 当前汇款金额数目
  paymentType: '', // swift-code | country
  remindNameList: [], // 授权提醒人列表

  additionalComment: '', // 附言
  remark: '', // 备注
  step: '1',

  isShowRegisted: false, // 是否显示已登记账户的信息 (配合草稿使用)

  authInfo: {},
  strLenght: 140, //字符串长度，当是中国内陆，香港，澳门，台湾。
  rightStyle: ''
};

export default {
  name: 'RemittanceTransferInput',
  components: {
    CommonPopup,
    RegisterAccts
  },
  mixins: [countryInfos, transWrite],
  inject: ['entType'],
  props: {
    confirmInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      creditBankNameISrequired: false, //false-已登记，true-未登记
      CREDIT_TYPES: {
        /** 本人名下演示账户 */
        '1': this.$t('PAYMENT.MY_ACCOUNT'),
        /** 已登记账户 */
        '2': this.$t('PAYMENT.REGISTERED_ACCOUNT'),
        /** 未登记账户 */
        '3': this.$t('PAYMENT.NO_REGISTERED_ACCOUNT')
      },
      radioList: [
        { name: 'swiftCode', type: true },
        { name: 'creditBankRegion', type: false }
      ],
      CREDIT_TYPE_MAP,
      pageType: '030103',
      payIsExcee: 0,
      formsData: { ...formsData },
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
      chinaTTList: [
        {
          label: this.$t('PAYMENT.GOODS_TRADE'),
          value: 'GT' // Corporate - Goods Trade
        },
        {
          label: this.$t('PAYMENT.SERVICE_TRADE'),
          value: 'ST' // Corporate - Service Trade
        },
        {
          label: this.$t('PAYMENT.CAPITAL_TRANSFER'),
          value: 'CT' // Corporate - Capital Transfer
        },
        {
          label: this.$t('PAYMENT.CURRENT_ACCOUNT_TRANSCATION'),
          value: 'CAT' // Corporate - Current Account Transaction
        },
        {
          label: this.$t('PAYMENT.CHARITY_DONATION'),
          value: 'CD' // Corporate - Charity Donation
        }
      ],
      /** 手续费扣款人列表 */
      chargeAcctList: [],
      dialogVisible: false,
      payType: 'remittance',
      ccyList
    };
  },
  computed: {
    ...mapState('app', ['requestLoading', 'lang']),
    /** 费用扣款账户 */
    poundPayAcctNoList() {
      return this.debitAcctList.reduce((prev, current) => {
        // console.log(prev, current);
        if (current.cur === this.formsData['ccy']) {
          prev.push(current);
        }
        return prev;
      }, []);
    },
    /** render popup */
    renderPopup() {
      const { creditorType } = this.formsData;
      /** formsData.creditorType payType */
      if (creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT) {
        return 'RegisterAccts';
      }
      return 'CommonPopup';
    },
    /** form validate rules */
    formValidateRules() {
      const self = this;
      const amountValidate = getValidateAmount(self);

      return {
        debitAcct: {
          required: false,
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('PAYMENT.PAYMENT_ACCOUNT')
          }),
          trigger: 'blur'
        },
        chargeAcct: {
          required: true,
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('PAYMENT.FEE_DEBIT_ACCOUNT')
          }),
          trigger: 'change'
        },
        scheduleDate: {
          required: true,
          validator: (rule, value, cb) => {
            if (this.formsData.isScheduleTx && !value) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: self.$t('PAYMENT.APPOINTMENT_DATE')
                  })
                )
              );
            } else {
              cb();
            }
          },
          trigger: 'blur'
        },
        amount: {
          required: true,
          validator: amountValidate,
          trigger: 'blur'
        },
        additionalComment: {
          required: false,
          trigger: 'blur',
          validator: (r, val, cb) => {
            let reg = /(^$)|(^([a-zA-Z0-9_,/\.-\s()?:'\+])+$)/;

            let isreg = reg.test(val);
            if (!isreg) {
              cb(new Error(self.$t('PAYMENT.ITIONALTEXT')));
              return;
            }
            cb();
          }
        },
        // 收款人-账户号码/iban
        creditAcct: {
          required: self.creditBankNameISrequired,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired) {
              if (!val || !val.length) {
                cb(
                  new Error(
                    self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                      input: self.$t('PAYMENT.ACCT_NO_OR_IBAN')
                    })
                  )
                );
              }
            }

            cb();
          }
        },
        // 收款人名称
        creditAcctName: {
          required: self.creditBankNameISrequired,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired) {
              if (!val || !val.length) {
                cb(
                  new Error(
                    self.$t(`COMMON.PLEASE_INPUT_SOMETHING`, {
                      input: self.$t('PAYMENT.ACCT_NAME')
                    })
                  )
                );
                return;
              }
              let reg;
              if (
                this.formsData.creditBankRegion === 'CN' ||
                this.formsData.creditBankRegion === 'HK' ||
                this.formsData.creditBankRegion === 'TW' ||
                this.formsData.creditBankRegion === 'MO'
              ) {
                reg = /(^$)|(^([a-zA-Z0-9\u4e00-\u9fa5_,/\.-\s()?:'\+])+$)/;
              } else {
                reg = /^([a-zA-Z0-9_,/\.-\s()?:'\+])+$/;
              }
              let isreg = reg.test(val);
              if (!isreg) {
                cb(new Error(self.$t('PAYMENT.RECEIVER_NAME_ERROR')));
                return;
              }
            }
            cb();
          }
        },
        // 收款人地址
        creditAddress: {
          required: self.creditBankNameISrequired,
          trigger: 'blur',
          validator: (r, val, cb) => {
            console.log('val', val);
            if (self.creditBankNameISrequired) {
              if (val === '' || val === null) {
                cb(
                  new Error(
                    self.$t(`COMMON.PLEASE_INPUT_SOMETHING`, {
                      input: self.$t('PAYMENT.RECEIVER_ADDRESS')
                    })
                  )
                );
                return;
              }
              let reg;
              if (
                this.formsData.creditBankRegion === 'CN' ||
                this.formsData.creditBankRegion === 'HK' ||
                this.formsData.creditBankRegion === 'TW' ||
                this.formsData.creditBankRegion === 'MO'
              ) {
                reg = /(^$)|(^([a-zA-Z0-9\u4e00-\u9fa5_,/\.-\s()?:'\+])+$)/;
              } else {
                reg = /^([a-zA-Z0-9_,/\.-\s()?:'\+])+$/;
              }
              let isreg = reg.test(val);
              if (!isreg) {
                cb(new Error(self.$t('PAYMENT.RECEIVER_ADDRESS_ERROR')));
                return;
              }
            }
            cb();
          }
        },
        // 收款人国家地区
        creditRegion: {
          required: self.creditBankNameISrequired,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired) {
              if (!val || !val.length) {
                cb(
                  new Error(
                    self.$t(`COMMON.PLEASE_INPUT_SOMETHING`, {
                      input: self.$t('PAYMENT.RECEIVER_COUNTRY')
                    })
                  )
                );
              }
            }
            cb();
          }
        },
        creditBankCode: {
          required: ['GB', 'US', 'CA', 'AU'].includes(
            self.formsData.creditBankRegion
          ), // ['US', 'GB', 'CA', 'AU']
          // message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
          //   input: 'SORT Code'
          // })
          trigger: 'blur',
          validator: (r, val, cb) => {
            console.log(r, val, cb);
            // creditBankRegion----對應國家
            // bankCodeType----美國--CU/FN
            let test = '';
            if (self.formsData.creditBankRegion === 'GB') {
              test = 'SORT Code';
            }
            if (self.formsData.creditBankRegion === 'US') {
              if (self.formsData.bankCodeType === 'CU') {
                test = 'CHIPS UID';
              }
              if (self.formsData.bankCodeType === 'FN') {
                test = 'Fedwire No./ABA No.';
              }
            }
            if (self.formsData.creditBankRegion === 'CA') {
              test = 'Transit Code';
            }
            if (self.formsData.creditBankRegion === 'AU') {
              test = 'BSB No.';
            }

            if (!val || !val.length) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: test
                  })
                )
              );
              return;
            }
            cb();
          }
        },
        ttPurposeCode: {
          required:
            self.formsData.creditBankRegion === 'CN' &&
            self.formsData.ccy === 'CNY',
          message: self.$t('COMMON.PLEASE_SELECT')
        },
        swiftCode: {
          required: self.creditBankNameISrequired && self.formsData.isSwiftCode,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired && self.formsData.isSwiftCode) {
              const testSwiftCode = /\w{8,11}/g;
              if (!val || !val.length) {
                cb(
                  new Error(
                    this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                      input: 'SWIFT Code'
                    })
                  )
                );
                return;
              }
              if (!testSwiftCode.test(val)) {
                cb(new Error(this.$t('PAYMENT.SWIFT_CODE_ILEGAL')));
                return;
              }
            }
            cb();
          }
        },
        creditBankRegion: {
          required:
            self.creditBankNameISrequired && !self.formsData.isSwiftCode,
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('PAYMENT.PAYEE_COUNTRY_CODE')
          }),
          trigger: 'change'
        },
        creditBankName: {
          required:
            self.creditBankNameISrequired && !self.formsData.isSwiftCode,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired && !self.formsData.isSwiftCode) {
              if (!val || !val.length) {
                cb(
                  new Error(
                    self.$t(`COMMON.PLEASE_INPUT_SOMETHING`, {
                      input: self.$t('PAYMENT.BANK_NAME')
                    })
                  )
                );
              }
            }

            cb();
          }
        },
        creditBankAddress: {
          required:
            self.creditBankNameISrequired && !self.formsData.isSwiftCode,
          trigger: 'blur',
          validator: (r, val, cb) => {
            if (self.creditBankNameISrequired && !self.formsData.isSwiftCode) {
              if (!val || !val.length) {
                cb(
                  new Error(
                    self.$t(`COMMON.PLEASE_INPUT_SOMETHING`, {
                      input: self.$t('PAYMENT.BANK_ADDRESS')
                    })
                  )
                );
              }
            }
            cb();
          }
        }
      };
    },
    requestInfos() {
      return {
        ...this.formsData,
        ...this.confirmInfo
      };
    },
    isSelectSwiftCode() {
      if (
        this.formsData.creditorType ===
          CREDIT_TYPE_MAP.NOT_REGISTERED_ACCOUNT &&
        this.formsData.isSwiftCode
      ) {
        return true;
      } else {
        return false;
      }
    },
    isExcAgeFee() {
      const curData = _.cloneDeep(this.formsData);
      console.log('curData', curData);
      if (curData.ccy === 'USD') {
        if (Number(curData.amount) > 28) {
          return true;
        } else {
          return false;
        }
      }
      if (curData.ccy === 'CAD') {
        if (Number(curData.amount) > 15) {
          return true;
        } else {
          return false;
        }
      }
      if (curData.ccy === 'GBP') {
        if (Number(curData.amount) > 8) {
          return true;
        } else {
          return false;
        }
      }
      if (curData.ccy === 'AUD') {
        if (Number(curData.amount) > 15) {
          return true;
        } else {
          return false;
        }
      }
      if (curData.ccy === 'EUR') {
        if (Number(curData.amount) > 15) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  watch: {
    'formsData.creditorType'(newVal) {
      if (newVal == '2') {
        this.creditBankNameISrequired = false;
      } else {
        this.creditBankNameISrequired = true;
      }
    },
    'formsData.debitAcct'(newVal) {
      const tarItem = this.debitAcctList.find(item => item.value === newVal);
      if (tarItem) {
        this.formsData.debitAcctName = tarItem.acctName;
      }
    },
    'formsData.chargeAcct'(newVal) {
      const tarItem = this.chargeAcctList.find(item => item.value === newVal);
      if (tarItem) {
        this.formsData.chargeAcctName = tarItem.label;
      }
    },
    'formsData.bankCodeType'(newVal) {
      if (newVal === 'CU') {
        this.$set(this.formsData, 'creditBankCodeTip', 'CH');
      } else if (newVal === 'FN') {
        this.$set(this.formsData, 'creditBankCodeTip', 'FW');
      }
    },
    'formsData.creditBankRegion'(newVal) {
      setTimeout(() => {
        if (newVal === 'AU') {
          this.$set(this.formsData, 'creditBankCodeTip', 'AU');
        }
        if (newVal === 'CA') {
          this.$set(this.formsData, 'creditBankCodeTip', 'CC');
        }
        if (newVal === 'GB') {
          this.$set(this.formsData, 'creditBankCodeTip', 'SC');
        }
        if (newVal === 'US') {
          console.log('是不是执行到这里了', this.formsData);
          if (this.formsData.bankCodeType === 'CU') {
            this.$set(this.formsData, 'creditBankCodeTip', 'CH');
          } else if (this.formsData.bankCodeType === 'FN') {
            this.$set(this.formsData, 'creditBankCodeTip', 'FW');
          }
        }
        if (
          newVal === 'HK' ||
          newVal === 'CN' ||
          newVal === 'MO' ||
          newVal === 'TW'
        ) {
          // this.$set(this.formsData, 'strLenght', 24);
          this.$set(this.formsData, 'strLenght', 140);
        } else {
          this.$set(this.formsData, 'strLenght', 140);
        }

        this.$refs['transferForm'].clearValidate();
      }, 0);
    },
    'formsData.ccy'() {
      setTimeout(() => {
        this.$refs['transferForm'].clearValidate();
      }, 0);
    }
  },
  methods: {
    init() {
      if (this.lang === 'en') {
        this.rightStyle = 'width: 180px;';
      } else {
        this.rightStyle = 'right: 7px;';
      }
      setTimeout(() => {
        if (this.$refs['authSelect']) {
          this.$refs['authSelect'].reset();
        }
        this.initConfirmInfo();
        this.getPreviousInfo();
        this.$nextTick(() => {
          if (this.confirmInfo.authInfo) {
            this.formsData.authInfo = this.confirmInfo.authInfo;
          }
        });
      }, 0);
    },
    onCheckedItem(selectItem) {
      console.log('selectItem', selectItem);
      this.dialogVisible = false;
      // 删除最近收款人返回的汇款币种，以免影响最新数据的汇款币种
      if (selectItem.creditCcy) {
        delete selectItem.creditCcy;
      }
      // 已登记返回的（收款银行国家地区）是countryCode
      // 未登记返回的是 creditBankRegion
      selectItem.creditBankRegion =
        selectItem.creditBankRegion || selectItem.countryCode;
      this.getAccountInfo(selectItem);
    },
    initConfirmInfo() {
      if (Object.keys(this.confirmInfo).length) {
        if (
          this.confirmInfo.creditBankRegion === 'US' ||
          this.confirmInfo.creditBankRegion === 'GB' ||
          this.confirmInfo.creditBankRegion === 'CA' ||
          this.confirmInfo.creditBankRegion === 'AU'
        ) {
          let str = this.confirmInfo.creditBankCode.substr(2);
          this.$set(this.confirmInfo, 'creditBankCode', str);
        }
        const formsData = { ...this.formsData };
        for (let k in formsData) {
          const confirmInfo = initRemittanceParams(this.confirmInfo);
          const value = confirmInfo.hasOwnProperty(k)
            ? confirmInfo[k]
            : formsData[k];
          this.$set(this.formsData, k, value);
        }
        // if (this.formsData)
        if (this.formsData.swiftCode) {
          this.formsData.isSwiftCode = true;
        } else {
          this.formsData.isSwiftCode = false;
        }
        if (!this.confirmInfo.isScheduleTx) {
          this.confirmInfo.scheduleDate = '';
        }
      }

      if (this.confirmInfo.hasOwnProperty('tdId')) {
        this.$set(this.formsData, 'tdId', this.confirmInfo.tdId);
      }
      const ccy = this.confirmInfo.ccy || this.confirmInfo.debitCcy;
      this.$set(this.formsData, 'ccy', ccy);
      this.$set(this.formsData, 'creditCcy', ccy);
    },
    async getPreviousInfo(params = {}) {
      /** this.requestInfos */
      // const { debitAcctList, chargeAcctList } = await globalGetPreviousInfo(
      //   params
      // );
      let res = await globalGetPreviousInfo(params);
      if (res) {
        this.debitAcctList = res.debitAcctList.sort((a, b) => {
          return Number(a.stateSort) - Number(b.stateSort);
        });
        this.chargeAcctList = res.chargeAcctList.sort((a, b) => {
          return Number(a.stateSort) - Number(b.stateSort);
        });
        this.setAcctList(this.debitAcctList, 'debitAcctList');
        this.setAcctList(this.chargeAcctList, 'chargeAcctList');

        if (this.isJumpTo) {
          this.initDebitAcct(this.jumpData.debitAcct, this.jumpData.debitCcy);
          this.initDedutAcct(this.jumpData.chargeAcct, this.jumpData.chargeCcy);
          this.selectDebitAcct(this.debitIndex);
          this.selectPoundPayAcct(this.dedutIndex);
        } else if (Object.keys(this.confirmInfo).length) {
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
        } else {
          this.initDebitAcct();
          this.initDedutAcct();
          this.selectDebitAcct(this.debitIndex);
        }
      }
    },
    setAcctList(origin, target) {
      const self = this;
      if (Array.isArray(origin) && origin.length) {
        self.$set(
          self,
          target,
          origin.map(item => ({
            ...item,
            value: item.acctNo,
            label: `${formatAcctNo(item.acctNo)} ${ccyTool.ccyFilter(
              item.cur
            )} ${businessFilter.processAccountType(item.typeLabel)}`,
            bankInstitution:
              item.bankInstitution || self.$t('PAYMENT.CHUANGXING_BANK')
          }))
        );
      }
    },
    selectCountry(val) {
      console.log('收款银行国家/地区', val);
    },
    // 暂存草稿
    saveTransfer() {
      const params = {
        transactionType: '4',
        tdId: this.formsData.tdId || '0',
        uploadMethod: '0'
      };
      if (
        this.formsData.creditBankRegion === 'US' ||
        this.formsData.creditBankRegion === 'GB' ||
        this.formsData.creditBankRegion === 'CA' ||
        this.formsData.creditBankRegion === 'AU'
      ) {
        this.formsData.creditBankCode =
          this.formsData.creditBankCodeTip + this.formsData.creditBankCode;
      }
      this.saveCraft(params);
    },

    // 下一步
    handleNextStep() {
      const formsData = filterRemittanceParams({ ...this.formsData });
      console.log('submit1', formsData);
      console.log('submit1', this.creditBankNameISrequired);
      this.$refs['transferForm'].validate(valid => {
        if (valid) {
          if (
            formsData.chargePayWay !== 'OUR' &&
            (formsData.ccy === 'USD' ||
              formsData.ccy === 'CAD' ||
              formsData.ccy === 'GBP' ||
              formsData.ccy === 'AUD' ||
              formsData.ccy === 'EUR')
          ) {
            if (!this.isExcAgeFee) {
              this.$message({
                type: 'warn',
                message: `${this.$t('PAYMENT.TRANSFER_FEE_ERROR')}`,
                duration: 1500
              });
              return;
            }
          }
          if (this.payIsExcee === 1 && this.formsData.isScheduleTx === 'N') {
            this.$message({
              message: this.$t('PAYMENT.LACK_OF_BALANCE'),
              type: 'warn'
            });
          } else {
            if (formsData.chargePayWay === 'BEN') {
              formsData.chargeAcct = '';
              formsData.chargeAcctName = '';
              formsData.deductAcctMoney = '';
              formsData.deductAcctName = '';
              formsData.chargeCcy = '';
              formsData.deductAcct = '';
            }
            if (
              formsData.creditBankRegion === 'US' ||
              formsData.creditBankRegion === 'GB' ||
              formsData.creditBankRegion === 'CA' ||
              formsData.creditBankRegion === 'AU'
            ) {
              formsData.creditBankCode =
                formsData.creditBankCodeTip + formsData.creditBankCode;
            }
            if (formsData.isScheduleTx === 'N') {
              formsData.scheduleDate = '';
            }
            requestTelegraphicTx(formsData).then(res => {
              if (res) {
                this.$emit('next', {
                  ...formsData,
                  bankAgentAmt: res.bankAgentAmt || `0.00`, // `${this.formsData.ccy} 0.00`
                  chargeAmount: res.chargeAmt ? `${res.chargeAmt}` : `0.00`, // 手續費
                  chargeAmt: res.chargeAmt ? `${res.chargeAmt}` : `0.00`,
                  commissionAmt: res.commissionAmt
                    ? `${res.commissionAmt}`
                    : `0.00`, // swift電報費
                  // creditBankCode: `${formatTtCode(this.formsData)} ${
                  //   this.formsData.creditBankCode
                  // }`,
                  locAmtCredited: res.locAmtCredited || ''
                });
              }
            });
          }
        } else {
          this.$message({
            message: this.$t('COMMON.CHECK_FAIL'),
            type: 'fail',
            delay: 3000
          });
        }
      });

      function formatTtCode({ ttPurposeCode, bankCodeType, creditBankRegion }) {
        if (creditBankRegion === 'US') {
          return `${bankCodeType}||${creditBankRegion}`;
        }
        return ttPurposeCode;
      }
    },
    // 特定条件是否大于银行代理费

    // 重置
    handleReset() {
      this.$set(this, 'formsData', { ...formsData });
      this.debitIndex = 0;
      this.dedutIndex = '';
      this.onResetCredit();
      setTimeout(() => {
        this.$refs['authSelect'] && this.$refs['authSelect'].reset();
        this.$refs.transferForm.clearValidate();
      }, 0);
      this.selectDebitAcct(0);
    },
    // 已登记或最近转账列表选择的数据
    getAccountInfo(selectItem = {}) {
      /** is swift code */
      this.$set(this.formsData, 'isSwiftCode', !!selectItem.swiftCode.length);
      for (let k in selectItem) {
        if (this.formsData.hasOwnProperty(k)) {
          const value = selectItem[k] || '';
          this.$set(this.formsData, k, value);
        }
      }
      if (this.formsData.creditorType === CREDIT_TYPE_MAP.REGISTERED_ACCOUNT) {
        this.$set(this.formsData, 'isShowRegisted', true);
      }
      if (selectItem.creditBankCode) {
        let creditBankCode = selectItem.creditBankCode.substr(2);
        let bankCodeType = selectItem.creditBankCode.substring(0, 2);
        this.$set(this.formsData, 'creditBankCode', creditBankCode);
        if (bankCodeType === 'FW') {
          this.$set(this.formsData, 'bankCodeType', 'FN');
        } else if (bankCodeType === 'CH') {
          this.$set(this.formsData, 'bankCodeType', 'CU');
        }
      }
    },
    formatMoney(val) {
      if (val) {
        return mathTools.addDecollator(val);
      }
      return '-1';
    },
    // 获取授权信息
    getAuthInfo(authInfo) {
      this.$set(this.formsData, 'authInfo', authInfo);
    },
    /** swiftCode反显 */
    onSwiftCodeBlur(e) {
      let swiftCode = e.target.value.trim();
      this.$refs.transferForm.validateField(['swiftCode'], valid => {
        if (!valid) {
          if (!swiftCode.length) {
            this.resetBankInfo();
            return;
          }
          let swiftInfo = {};
          getSwiftDetails({ swiftCode }).then(res => {
            swiftInfo = res;
            if (swiftInfo) {
              setTransferBankInfoBySwiftCode(swiftInfo, this.formsData);
            } else {
              this.resetBankInfo();
            }
          });
        }
      });
    },
    onResetCredit() {
      this.resetCreditAcctInfo();
      this.resetBankInfo();
    },
    resetCreditAcctInfo() {
      this.$set(this.formsData, 'creditAcct', '');
      this.$set(this.formsData, 'creditAcctName', '');
      this.$set(this.formsData, 'creditAddress', '');
      this.$set(this.formsData, 'creditRegion', '');
      this.$set(this.formsData, 'creditCcy', '');
    },
    resetBankInfo() {
      this.$set(this.formsData, 'swiftCode', '');
      this.$set(this.formsData, 'creditBankRegion', '');
      this.$set(this.formsData, 'creditBankCode', '');
      this.$set(this.formsData, 'creditBankName', '');
      this.$set(this.formsData, 'creditBankAddress', '');
      setTimeout(() => {
        this.$refs.transferForm.clearValidate();
      });
    },
    onSwichIsSwiftCode() {
      this.resetBankInfo();
    },
    onTtPurposeCodeSelect() {
      this.$set(this.formsData, 'creditBankCode', '');
      this.$refs.transferForm.clearValidate();
    },
    // 预约处理日期----节假日查询方法
    changAppointedDay() {
      let date = tools.date2Str(this.formsData.scheduleDate, 'YYYY-MM-DD');
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
.creditstyle {
  .el-input__inner {
    width: 230px;
  }
}
.radio-chargePayWay {
  .el-radio {
    display: flex;
    align-items: center;
    white-space: break-spaces;
  }
}
.radioStyle {
  .el-radio-group {
    padding-left: 0px;
    .radioStylebox:nth-of-type(1) {
      margin-bottom: 16px;
    }
    .radioStylebox {
      .radioStyleboxS {
        margin-left: -180px;
        position: relative;
        .el-radio {
          margin-right: 0px;
        }
        .el-form-item__label {
          width: 180px;
          position: absolute;
          white-space: normal;
        }
        .el-form-item__content {
          margin-left: 180px;
        }
      }
    }
  }
}
</style>
