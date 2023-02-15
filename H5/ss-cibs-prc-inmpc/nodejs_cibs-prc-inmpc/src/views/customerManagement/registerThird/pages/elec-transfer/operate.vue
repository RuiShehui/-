<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-24 16:01:06
 * @LastEditTime: 2022-06-23 15:47:41
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\elec-transfer\operate.vue
-->
<template>
  <div class="g-elec-transfer-operate-page">
    <!-- show-steps -->
    <header class="g-header">
      <el-steps :active="stepIndex" :align-center="true">
        <el-step v-for="(item, index) of stepList" :key="index" :title="item.title" />
      </el-steps>
    </header>
    <!-- main-section -->
    <section>
      <el-form
        v-show="stepIndex === 1"
        ref="submitForm"
        class="main-input-form"
        :model="formData"
        :rules="formRules"
        label-width="calc(50% - 170px)"
        label-suffix=":"
        label-position="right"
      >
        <!-- 收款人信息 -->
        <div class="inner-block" style="padding:0;">
          <h2
            :style="{ textAlign: 'left', padding: '15px 0' }"
          >{{ $t('CUSTOMER_MANAGEMENT.PAYEE_INFO') }}</h2>
          <el-form-item
            v-for="prop of receiverInfo"
            :key="prop"
            :prop="prop"
            :label="
              $t(
                `CUSTOMER_MANAGEMENT${
                  prop
                    ? `.${transToHighCamel(
                        prop === 'payeeCountryCode' ? 'countryCode' : prop
                      )}`
                    : ''
                }`
              )
            "
          >
            <el-input
              class="g-form-input"
              v-if="inputs.includes(prop)"
              v-model="formData[prop]"
              maxlength="300"
            />
            <el-select
              class="g-form-select"
              v-if="prop === 'payeeCountryCode'"
              v-model="formData[prop]"
              :filterable="true"
              @change="changeMenu($event)"
            >
              <el-option
                v-for="item of countryList"
                :key="item.countryId"
                :value="item.countryId"
                :label="item.countryShortName"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 收款银行信息 -->
        <div class="inner-block">
          <h2
            :style="{ textAlign: 'left', padding: '15px 0' }"
          >{{ $t('CUSTOMER_MANAGEMENT.RECEIVE_BANK_INFO') }}</h2>
          <el-radio-group
            class="radio-form-group"
            v-model="submitBankType"
            @change="handleRadioChange"
          >
            <el-form-item
              :class="['radio-form-item', prop === 'countryCode' ? 'long' : '']"
              ref="radioFormItems"
              v-for="prop of radioList"
              :key="prop"
              :prop="prop"
              label-position="right"
            >
              <!-- label-width="calc(50% - 170px)" -->
              <el-radio
                :label="prop"
                :style="{
                  position: 'relative',
                  left: prop === 'swiftCode' ? '0' : '16px'
                }"
              >
                {{
                `${$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel(
                prop === 'countryCode' ? 'payeeCountryCode' : prop
                )}`
                )}:`
                }}
              </el-radio>
              <el-input
                class="g-form-input radio-component"
                v-if="prop === 'swiftCode'"
                v-model="formData[prop]"
                :disabled="submitBankType !== 'swiftCode'"
                :style="{ position: 'relative', right: '25px' }"
                placeholder
                maxlength="300"
                @blur="handleSwiftCodeBlur(formData[prop])"
              />
              <el-select
                class="g-form-select radio-component"
                v-else
                v-model="formData[prop]"
                :disabled="submitBankType === 'swiftCode'"
                :filterable="true"
                :style="{ position: 'relative', right: '5px' }"
                @change="handleSelectBankCountry($event, prop)"
              >
                <el-option
                  v-for="item of countryList"
                  :key="item.countryId"
                  :value="item.countryId"
                  :label="item.countryShortName"
                />
              </el-select>
            </el-form-item>
          </el-radio-group>
          <!-- 更改需求: 无论在哪种模式下, 都会显示所有的收款银行信息 -->
          <!-- v-show="submitBankType !== 'swiftCode'" -->
          <!-- ['bankName', 'bankAddress'].includes(prop) && formData['countryCode'] === 'HK' -->
          <el-form-item
            v-show="showBankInfos(prop)"
            v-for="prop in receiveBankInfo"
            :key="prop"
            :prop="prop"
            :label="$t(`CUSTOMER_MANAGEMENT.${getBankInfos(prop)}`)"
          >
            <el-input
              class="g-form-input"
              v-if="inputs.includes(prop)"
              v-model="formData[prop]"
              :disabled="submitBankType === 'swiftCode'"
              placeholder
              maxlength="300"
            />
            <el-input
              class="g-form-input"
              v-if="prop === 'bankName'"
              v-model="formData.bankName"
              :disabled="submitBankType === 'swiftCode'"
              placeholder
              maxlength="300"
            />
          </el-form-item>
        </div>
      </el-form>
    </section>
    <!-- confirm-descriptions -->
    <el-descriptions
      class="g-desc"
      v-show="stepIndex === 2"
      :column="2"
      :title="$t('CUSTOMER_MANAGEMENT.PAYEE_INFO')"
    >
      <el-descriptions-item
        v-for="(prop, propIdx) of receiverInfo"
        :key="`${propIdx} ${prop}`"
        :label="
          $t(
            `CUSTOMER_MANAGEMENT${
              prop
                ? `.${transToHighCamel(
                    prop === 'payeeCountryCode' ? 'countryCode' : prop
                  )}`
                : ''
            }`
          )
        "
      >{{ renderInfoItem(prop) }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      class="g-desc"
      v-show="stepIndex === 2"
      :column="2"
      :title="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INFOS')"
    >
      <el-descriptions-item
        v-for="(prop, propIdx) of receiveBankInfo"
        :key="`${propIdx} ${prop}`"
        :label="$t(`CUSTOMER_MANAGEMENT.${getBankInfos(prop)}`)"
      >{{ renderInfoItem(prop) }}</el-descriptions-item>
    </el-descriptions>
    <!-- operations -->
    <footer class="g-footer">
      <el-button
        :class="['g-bottom-btn', btnIdx === 1 ? 'confirm' : 'cancel']"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
      >{{ btn.name }}</el-button>
    </footer>
  </div>
</template>

<script>
import { transToHighCamel, deepClone, isType } from '@/utils/tools';
import {
  addElecItem,
  editElecItem,
  judgeSwiftCode,
  getBankList
} from '@/api/customer-management/third-register';
import mapValidator from '@/utils/stategies';
import countryInfos from '@/mixins/country-list';
import _ from 'lodash';

export default {
  name: 'ElecTransferOperate',
  mixins: [countryInfos],
  props: {},
  data() {
    const self = this;

    const tipTitle = transToHighCamel(self.$route.meta.title);

    const writeStepTip = self.$t('COMMON.WRITE_SOMETHING_INFO', {
        content: self.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
      }),
      confirmStepTip = self.$t('COMMON.CONFIRM_SOMETHING_INFO', {
        content: self.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
      }),
      lastStepTip = self.$t('COMMON.SOMETHING_SUCCESS', {
        op: self.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
      });

    return {
      stepIndex: 1,
      stepList: [
        {
          title: writeStepTip
        },
        {
          title: confirmStepTip
        },
        {
          title: lastStepTip
        }
      ],
      formData: {
        payeeName: '', // 收款人名称
        payeeAddress: '', // 收款户地址
        payeeCountryCode: '', // 收款人-国家/地区
        payeeCountryName: '',
        accountNo: '', // '账户号码/IBAN'
        swiftCode: '', // SWIFT Code
        countryCode: '', // 银行-国家/地区
        bankAddress: '', // 银行地址
        bankName: '', // 银行名称
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo') // 网银客户号
      },
      inputs: [
        'payeeName',
        'payeeAddress',
        'accountNo',
        'bankAddress',
        // 'bankName',
        'swiftCode'
      ],
      /** first-step-validate-rule */
      /**
       * submitBankMode 提交银行信息的类型
       * @example 'swfitCode' | 'countryCode'
       */
      submitBankType: 'swiftCode',
      radioList: ['swiftCode', 'countryCode'],
      // 校验swiftCode是否合法
      swiftCodeIsValid: false,
      bankList: []
    };
  },
  computed: {
    // receiver-info
    receiverInfo() {
      return ['payeeName', 'payeeAddress', 'payeeCountryCode', 'accountNo'];
    },
    // bank-info
    receiveBankInfo() {
      const { countryCode } = this.formData;
      if (['HK'].includes(countryCode)) {
        return ['swiftCode', 'countryCode', 'bankName'];
      }
      return ['swiftCode', 'countryCode', 'bankAddress', 'bankName'];
    },
    /** first-step-validate-rule */
    formRules() {
      const { STR_NOT_EMPTY } = mapValidator(this);
      const rules = {
        payeeName: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeName')}`)
        ),
        payeeAddress: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeAddress')}`)
        ),
        payeeCountryCode: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('countryCode')}`),
          'change'
        ),
        accountNo: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('accountNo')}`)
        )
      };
      if (this.submitBankType !== 'swiftCode') {
        rules.swiftCode = {};
        rules.countryCode = STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('bankCountry')}`),
          'change'
        );
        rules.bankAddress = STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('bankAddress')}`)
        );
        rules.bankName = STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('bankName')}`),
          'change'
        );
      } else {
        rules.swiftCode = STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('swiftCode')}`)
        );
        rules.countryCode = {};
        rules.bankAddress = {};
        rules.bankName = {};
      }

      return rules;
    },
    /** bottom-btns */
    bottomBtns() {
      switch (this.stepIndex) {
        case 1:
          return [
            {
              name: this.$t('COMMON.BACK')
            },
            {
              name: this.$t('COMMON.NEXT_STEP')
            }
          ];
        case 2:
          return [
            {
              name: this.$t('COMMON.PREVIOUS_STEP')
            },
            {
              name: this.$t('COMMON.CONFIRM')
            }
          ];
        default:
          return [];
      }
    },
    /** submit-form */
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm || null;
    },
    /** submit-data */
    submitData() {
      const {
        payeeName,
        payeeAddress,
        payeeCountryCode,
        accountNo,
        swiftCode,
        countryCode,
        bankAddress,
        bankName
      } = this.formData;
      if (this.submitBankType === 'swiftCode') {
        return {
          payeeName,
          payeeAddress,
          payeeCountryCode,
          accountNo,
          swiftCode
        };
      }
      return {
        payeeName,
        payeeAddress,
        payeeCountryCode,
        accountNo,
        countryCode,
        bankAddress,
        bankName
      };
    },
    /** route-query */
    routeQuery() {
      const { query } = this.$route;
      return query || {};
    },
    /** radio-form-items */
    radioFormItems() {
      const { radioFormItems } = this.$refs;
      return radioFormItems || [];
    }
  },
  mounted() {
    this.initEdit();
  },
  methods: {
    transToHighCamel,
    handleOperations(tarText) {
      switch (tarText) {
        case this.$t('COMMON.BACK'):
          this.handleBackPage();
          break;
        case this.$t('COMMON.PREVIOUS_STEP'):
          this.handleLastStep();
          break;
        case this.$t('COMMON.NEXT_STEP'):
          this.handleNextStep();
          break;
        case this.$t('COMMON.CONFIRM'):
          this.handleConfirm();
          break;
        default:
          break;
      }
    },
    handleBackPage() {
      this.$router.push({
        name: 'RegisterThird',
        query: {
          activeName: '3'
        }
      });
      // this.$store.commit(
      //   'tabs/DELETE_TABS',
      //   '/customerManagement/registerThird/add-elec-transfer'
      // );
      // this.$store.commit(
      //   'tabs/DELETE_TABS',
      //   '/customerManagement/registerThird/edit-elec-transfer'
      // );
    },
    handleLastStep() {
      this.stepIndex--;
    },
    handleNextStep() {
      console.log('dadadadad', this.stepIndex);
      switch (this.stepIndex) {
        case 1:
          this.handleCheckSubmit();
          break;
        case 2:
          break;
        default:
          break;
      }
    },
    handleCheckSubmit() {
      this.submitForm.validate(valid => {
        if (valid) {
          console.log('this.submitForm', this.formData);
          if (!this.formData.swiftCode) {
            const regPayeeName = /^([a-zA-Z0-9_,/\.-\s()?:'\+])+$/;
            if (!regPayeeName.test(this.formData.payeeName)) {
              this.formData.payeeName = '';
              return this.$showMsg({
                type: 'error',
                message: '收款人名稱不遵循SWIFT的合法性，請從新輸入'
              });
            }
          }
          this.stepIndex++;
        } else
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
      });
    },
    handleConfirm() {
      // 提交的数据无变化
      const _formData = deepClone(this.formData);
      const tipTitle = transToHighCamel(this.$route.meta.title),
        content = this.$t('COMMON.CONFIRM_SOMETHING_INFO', {
          content: this.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
        });
      const submitData = {
        ..._formData,
        ...(this.routeQuery.crtItem
          ? {
              registerCode: this.routeQuery.crtItem.registerCode
            }
          : {})
      };
      this.$showBox({
        content,
        confirm: () => this.confirmSubmit(submitData)
      });
    },
    async confirmSubmit(submitData) {
      if (!Object.keys(this.routeQuery).length) {
        this.handleAdd(submitData);
      } else {
        this.handleEdit(submitData);
      }
      setTimeout(() => {
        this.stepIndex++;
        // this.$showMsg({
        //   message: `${(this.$t('COMMON.SOMETHING_SUCCESS'),
        //   {
        //     op: this.$t('COMMON.OPERATION')
        //   })}`,
        //   type: 'success'
        // });
        setTimeout(() => {
          this.initFormPage();
        }, 3000);
      }, 800);
    },
    async handleAdd(submitData) {
      const result = await addElecItem(submitData);
      this.checkResult(result, this.$t('COMMON.OPERATION'));
    },
    initEdit() {
      const { type } = this.$route.meta;
      if (type && type === 'edit') {
        const { crtItem } = this.routeQuery,
          _formData = deepClone(this.formData);
        for (let k in this.formData) {
          const value = crtItem.hasOwnProperty(k)
            ? crtItem[k] || ''
            : _formData[k];
          this.$set(this.formData, k, value);
        }
        this.$set(this.submitData, 'registerCode', crtItem.registerCode);
        if (crtItem.swiftCode && crtItem.swiftCode.length) {
          this.handleSwiftCodeBlur(crtItem.swiftCode);
        } else {
          this.submitBankType = 'countryCode';
        }
        if (crtItem.countryCode) {
          let row = this.countryList.find(item => {
            return item.countryId === crtItem.countryCode;
          });
          this.formData.bankCountry = row.countryShortName;
        }
      }
    },
    setFormItems() {
      if (this.radioFormItems && this.radioFormItems[1]) {
        const { $el } = this.radioFormItems[1];
        if ($el) {
          const oContent = $el.querySelector('.el-form-item__content');
          if (oContent) {
            // const oErrorTag = oContent.querySelector('.el-form-item__error');
          }
        }
      }
    },
    async handleEdit(submitData) {
      const result = await editElecItem(submitData);
      this.checkResult(result, '编辑');
    },
    checkResult({ body, head }, op = this.$t('COMMON_OPERATION')) {
      if (body === true) {
        this.stepIndex++;
        this.$showMsg({
          message: `${op}成功, 3秒後返回`,
          type: 'success'
        });
      } else
        this.$showMsg({
          message: `${op}失败, ${
            head.returnMessage ? head.returnMessage : 'error'
          }, 3秒后返回`,
          type: 'error'
        });
      setTimeout(() => {
        this.initFormPage();
      }, 3000);
    },
    initFormPage() {
      this.submitForm.resetFields();
      this.stepIndex = 1;
      this.handleBackPage();
    },
    /* 2021-12-17新增 */
    onCountryCodeChange() {},
    /* 2021-12-20新增 */
    async handleSwiftCodeBlur(inputValue = '') {
      if (!inputValue || !inputValue.length) {
        this.$showMsg({
          type: 'warning',
          message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT_SWIFT_CODE')
        });
        this.resetPayeeInfo();
        return;
      }
      try {
        const { body } = await judgeSwiftCode({
          swiftCode: inputValue,
          ebankCstmNo: sessionStorage.getItem('ebankCstmNo')
        });
        if (body && Object.getOwnPropertyNames(body).length) {
          // const {
          //   countryCode,
          //   // country,
          //   location,
          //   city,
          //   address,
          //   institution
          // } = body;

          const crtCountryCode = body.countryCode,
            bankAddress = body.bankAddress,
            // bankAddress = `${location}-${city}-${address}`,
            bankName = body.bankName;

          this.$set(this.formData, 'countryCode', crtCountryCode);
          this.$set(this.formData, 'bankAddress', bankAddress);
          this.$set(this.formData, 'bankName', bankName);
          let row = this.countryList.find(item => {
            return item.countryId === crtCountryCode;
          });
          this.formData.bankCountry = row.countryShortName;
          this.form;
        } else {
          this.$set(this.formData, 'swiftCode', '');
        }
      } catch (err) {
        this.$showMsg({
          type: 'error',
          message: err
        });
        this.$set(this.submitData, 'swiftCode', '');
      }
    },
    resetPayeeInfo() {
      this.$set(this.formData, 'swiftCode', '');
      this.$set(this.formData, 'countryCode', '');
      this.$set(this.formData, 'bankAddress', '');
      this.$set(this.formData, 'bankName', '');
    },
    changeMenu(val) {
      let row = this.countryList.find(item => {
        return item.countryId === val;
      });
      this.formData.payeeCountryName = row.countryShortName;
    },
    handleRadioChange() {
      this.resetPayeeInfo();
    },
    renderInfoItem(prop) {
      if (this.inputs.includes(prop)) {
        return this.formData[prop];
      }
      if (['payeeCountryCode', 'countryCode'].includes(prop)) {
        return this.countryList.find(
          item => item.countryId === this.formData[prop]
        )
          ? this.countryList.find(
              item => item.countryId === this.formData[prop]
            ).countryShortName
          : '';
      }
      return this.formData[prop] || '';
    },
    handleSearchBankList: _.throttle(async function(value = '') {
      this.bankList = [];
      const { countryCode } = this.formData;
      // const params = {
      //     countryCode,
      //     institution: value
      //   },
      //   result = await getBankList(params),
      //   { body } = result;
      // if (body && isType(body, 'Array')) {
      //   if (!['HK'].includes(countryCode)) {
      //     this.bankList = body;
      //   } else {
      //     this.bankList = body.map(({ institution = '', address = '' }) => ({
      //       institution: `${institution}-${address}`,
      //       address: `${institution}-${address}`
      //     }));
      //   }
      // }
    }, 500),
    handleSelectBankCountry(value, prop) {
      if (prop === 'countryCode') {
        let row = this.countryList.find(item => {
          return item.countryId === value;
        });
        this.formData.bankCountry = row.countryShortName;
        this.handleSearchBankList();
      }
    },
    showBankInfos(prop) {
      if (['bankName', 'bankAddress'].includes(prop)) {
        if (prop === 'bankAddress' && this.formData.countryCode === 'HK') {
          return false;
        }
        return true;
      }

      return false;
    },
    // handleBankChange(bankCode) {
    //   const { countryCode } = this.formData;
    //   const validList = ['HK'];
    //   if (!validList.includes(countryCode)) {
    //     return;
    //   }
    //   const currentBank = this.bankList.find(
    //     item => item.institution === bankCode
    //   );
    //   if (currentBank) {
    //     const autoAddress =
    //       currentBank && currentBank.address ? currentBank.address : '';

    //     this.$set(this.formData, 'bankAddress', autoAddress);
    //   } else {
    //     this.$showMsg({
    //       type: 'error',
    //       message: 'BANK NOT FOUND'
    //     });
    //   }
    // },
    getBankInfos(prop) {
      if (prop === 'countryCode') {
        return transToHighCamel('payeeCountryCode');
      }
      if (prop === 'payeeCountryCode') {
        return transToHighCamel('countryCode');
      }
      if (prop === 'bankName') {
        if (['HK'].includes(this.formData.countryCode)) {
          return transToHighCamel('bankCode');
        }
      }

      return transToHighCamel(prop);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/operate-page.scss';

.g-elec-transfer-operate-page {
  @include operatePageMixin;
  min-width: 800px;
  .inner-block {
    margin-top: 5px;
    text-align: left;
    .el-form-item {
      padding-bottom: 5px;
      .g-form-input,
      .g-form-select {
        display: inline-block;
        width: 340px;
        // &.radio-component + .el-form-item__error {
        //   background-color: yellow;
        //   color: pink;
        // }
      }
      ::v-deep .el-form-item__error {
        left: 1.5% !important;
      }
    }
    .radio-form-group {
      width: 100%;
      .radio-form-item {
        min-width: 650px;
        position: relative;
        right: 115px;
        ::v-deep .el-form-item__error {
          left: 13.5% !important;
        }
        &.long {
          position: relative;
          right: 170px;
          ::v-deep .el-form-item__error {
            left: 187px !important;
          }
        }
      }
    }
  }
  .g-desc {
    width: 75%;
    // padding: 0 20%;
  }
}
</style>
