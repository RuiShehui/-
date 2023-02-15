<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-23 19:33:04
 * @LastEditTime: 2022-07-19 09:57:03
 * @LastEditors: zhangcheng
 * @Description: Zz's design 转数快
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\local-transfer\pages\trans-fast\operate.vue
-->
<template>
  <div class="g-fast-transfer-page">
    <!-- show-steps -->
    <header class="g-header">
      <el-steps :active="stepIndex" :align-center="true">
        <el-step v-for="(item, index) of stepList" :key="index" :title="item.title" />
      </el-steps>
    </header>
    <section class="g-main-wrapper">
      <el-form
        v-show="stepIndex === 1"
        ref="submitForm"
        class="main-input-form"
        :model="formData"
        :rules="formRules"
        label-width="calc(50% - 170px)"
        label-position="right"
      >
        <el-form-item
          v-for="prop of renderPropList"
          :key="prop"
          :prop="prop"
          :label="
            $t(`CUSTOMER_MANAGEMENT${prop ? `.${transToHighCamel(prop)}` : ''}`)
          "
        >
          <el-input
            class="g-form-input"
            @blur="queryDate(prop,$event)"
            v-if="inputs.includes(prop)"
            v-model="formData[prop]"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
            maxlength="300"
          />
          <el-select
            class="g-form-select"
            v-if="prop === 'payeeIdentifyMethod'"
            @change="changePayeeIdentifyMethod"
            v-model="formData[prop]"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            :disabled="$route.query.hasOwnProperty('crtItem')"
          >
            <el-option
              v-for="item of methodList"
              :key="`${item.value} ${item.label}`"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-select
            class="g-form-select"
            v-if="prop === 'payeeBankCode'"
            @change="changePayeeBankCode"
            v-model="formData[prop]"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            :filterable="true"
          >
            <el-option
              v-for="(bn, bnIdx) of fpsBankList"
              :key="bnIdx + bn"
              :value="bn.value"
              :label="bn.value + ' ' + bn.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="['MOBN','EMAL'].includes(formData.payeeIdentifyMethod)"
          :required="true"
          :label="$t('PAYMENT.RECEIVE_BANK')"
          prop="selectBankType"
        >
          <el-radio-group v-model="formData.selectBankType" class="flex-cloum">
            <!-- fake data -->
            <el-radio label="PRE">預設收款銀行</el-radio>
            <el-radio label="DEF">演示銀行</el-radio>
            <el-radio label="OPT">指定收款銀行/機構</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.payeeIdentifyMethod!=='BBAN'">
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.REMITTEE_BANK')"
            v-if="formData.payeeBank && formData.payeeIdentifyMethod=='SVID'"
          >
            <el-input class="g-form-input" disabled :value="formData.payeeBank" />
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.PAYEE_NAME')" v-if="formData.payeeName">
            <el-input class="g-form-input" disabled :value="formData.payeeName" />
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_CODE')"
            v-if="formData.selectBankType === 'OPT'"
            prop="payeeBankCode"
          >
            <el-select
              class="g-form-select"
              @change="changePayeeBankCode"
              v-model="formData.payeeBankCode"
              :placeholder="$t('COMMON.PLEASE_SELECT')"
              :filterable="true"
            >
              <el-option
                v-for="(bn, bnIdx) of fpsBankList"
                :key="bnIdx + bn"
                :value="bn.value"
                :label="bn.value + ' ' + bn.label"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <el-descriptions
        class="g-desc"
        v-show="stepIndex === 2"
        :title="$t('CUSTOMER_MANAGEMENT.CONFIRM_INFO')"
      >
        <el-descriptions-item
          class="g-desc-item"
          v-for="prop of renderPropList"
          :key="prop"
          :label="
            $t(`CUSTOMER_MANAGEMENT${prop ? `.${transToHighCamel(prop)}` : ''}`)
          "
        >
          {{
          (prop => {
          if (inputs.includes(prop)) {
          return formData[prop];
          }
          if (prop === 'payeeIdentifyMethod') {
          return methodList.some(item => item.value === formData[prop])
          ? methodList.find(item => item.value === formData[prop]).label
          : '';
          }
          if (prop === 'payeeBankCode') {
          return fpsBankList.find(item => item.value === formData[prop])
          ? fpsBankList.find(item => item.value === formData[prop]).label
          : '';
          }
          return formData[prop];
          })(prop)
          }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="formData.payeeIdentifyMethod !== 'BBAN'"
          :label="$t('CUSTOMER_MANAGEMENT.REMITTEE_BANK')"
        >{{ formData.payeeBank || '預設收款银行'}}</el-descriptions-item>
        <el-descriptions-item
          v-if="formData.payeeIdentifyMethod !== 'BBAN'"
          label="收款戶名"
        >{{ formData.payeeName }}</el-descriptions-item>
      </el-descriptions>
    </section>
    <!-- operations -->
    <footer class="g-footer">
      <el-button
        class="g-bottom-btn"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :class="['g-bottom-btn', btnIdx === 1 ? 'confirm' : 'cancel']"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
      >{{ btn.name }}</el-button>
    </footer>
  </div>
</template>

<script>
import { transToHighCamel, deepClone } from '@/utils/tools';
import mapValidator from '@/utils/stategies';
import constant from '@/utils/constant';
import {
  addTransCountFast,
  editTransCountFast,
  innerFindFpsInfo
} from '@/api/customer-management/third-register';
import hkBanks from '@/mixins/bank-infos';

const { PAYEE_IDENTIFY_METHOD_LIST } = constant;

export default {
  name: 'FastTransferOperatePage',
  mixins: [hkBanks],
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
      addNo: '',
      addNoType: '',
      // isBlur: false,
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
        payeeIdentifyMethod: PAYEE_IDENTIFY_METHOD_LIST[1].value, // 识别方式
        payeeAccount: '', // 收款账户
        payeeName: '', // 收款户名
        payeeBankCode: '', // 收款银行/机构 // 112
        payeeBank: '', // 收款银行/机构名称 // 112
        mobilePhone: '', // 流动电话
        emailAddress: '', // 电邮地址
        fpsId: '', // FPS ID
        selectBankType: '', // 银行类型
        // TODO 指定收款银行/机构
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo')
      },
      inputs: [
        'payeeName',
        'payeeAccount',
        'mobilePhone',
        'emailAddress',
        'fpsId'
      ],
      // showRadio: false,
      methodList: PAYEE_IDENTIFY_METHOD_LIST.filter(
        item => item.value.length > 0
      )
    };
  },
  watch: {
    'formData.selectBankType'(newVal) {
      if (
        this.formData.payeeIdentifyMethod === 'MOBN' ||
        this.formData.payeeIdentifyMethod === 'EMAL'
      ) {
        if (newVal === 'PRE') {
          this.$set(this.formData, 'payeeBank', '');
          this.$set(this.formData, 'payeeBankCode', '');
        }
        if (newVal === 'DEF') {
          this.$set(this.formData, 'payeeBank', '演示银行有限公司');
          this.$set(this.formData, 'payeeBankCode', '041');
        }
        console.log('this.newVal', newVal);
        console.log('this.formData-----watcdh', this.formData);
      }
    }
  },
  computed: {
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
    routeQuery() {
      const { query } = this.$route;
      return query || {};
    },
    /** 根据识别方式, 判断需要渲染出来的字段 */
    renderPropList() {
      const { payeeIdentifyMethod } = this.formData;
      switch (payeeIdentifyMethod) {
        case 'BBAN':
          return [
            'payeeIdentifyMethod',
            'payeeAccount',
            'payeeName',
            'payeeBankCode'
          ];
        case 'MOBN':
          return ['payeeIdentifyMethod', 'mobilePhone'];
        case 'EMAL':
          return ['payeeIdentifyMethod', 'emailAddress'];
        case 'SVID':
          return ['payeeIdentifyMethod', 'fpsId'];
        default:
          return ['payeeIdentifyMethod'];
      }
    },
    submitData() {
      console.log('这是什么时候出发', this.formData);
      const submitData = {};
      submitData.ebankCstmNo = this.formData.ebankCstmNo;
      submitData.payeeBank = this.formData.payeeBank;
      submitData.payeeBankCode = this.formData.payeeBankCode;
      submitData.payeeName = this.formData.payeeName;
      submitData.selectBankType = this.formData.selectBankType;

      this.renderPropList.forEach(prop => {
        submitData[prop] = this.formData[prop];
      });

      if (
        this.routeQuery.crtItem &&
        this.routeQuery.crtItem.hasOwnProperty('registerCode')
      ) {
        submitData.registerCode = this.routeQuery.crtItem.registerCode;
      }

      return submitData;
    },
    /** validate-by payeeIdentifyMethod */
    formRules() {
      const self = this;

      const { STR_NOT_EMPTY } = mapValidator(self);
      const { payeeIdentifyMethod } = self.formData;

      switch (payeeIdentifyMethod) {
        case 'BBAN':
          return {
            payeeIdentifyMethod: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeIdentifyMethod')}`
              )
            ),
            payeeName: {
              required: true,
              validator: (r, val, cb) => {
                if (!val || !val.length) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        label: self.$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')
                      })
                    )
                  );
                  return;
                }
                // if (!/^(\w|\s|(_)|(-)){1,120}$/.test(val)) {
                //   cb(new Error(self.$t('COMMON.CHECK_FAIL')));
                //   return;
                // }
                cb();
              }
            },
            payeeAccount: {
              required: true,
              validator: (r, val, cb) => {
                if (!val || !val.length) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        label: self.$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')
                      })
                    )
                  );
                  return;
                }
                if (!/^\w{1,34}$/.test(val)) {
                  cb(new Error(self.$t('COMMON.CHECK_FAIL')));
                  return;
                }
                cb();
              }
            },
            payeeBankCode: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeBankCode')}`
              ),
              'change'
            )
          };
        case 'SVID':
          return {
            payeeIdentifyMethod: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeIdentifyMethod')}`
              )
            ),
            fpsId: STR_NOT_EMPTY(
              self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('fpsId')}`)
            )
          };
        case 'MOBN':
          return {
            payeeIdentifyMethod: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeIdentifyMethod')}`
              )
            ),
            mobilePhone: STR_NOT_EMPTY(
              self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('mobilePhone')}`)
            ),
            payeeBankCode: {
              required: this.formData.selectBankType === 'OPT' ? true : false,
              validator: (r, val, cb) => {
                if (!val && r.required) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        label: self.$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_CODE')
                      })
                    )
                  );
                  return;
                }
                cb();
              },
              trigger: 'change'
            }
          };
        case 'EMAL':
          return {
            payeeIdentifyMethod: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeIdentifyMethod')}`
              )
            ),
            emailAddress: {
              required: true,
              validator: (r, val, cb) => {
                if (!val) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        label: self.$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')
                      })
                    )
                  );
                  return;
                }
                if (!/^(\w+)@((\w|-)+)\.(\w{2,4})$/.test(val)) {
                  cb(new Error(self.$t('COMMON.CHECK_FAIL')));
                  return;
                }
                cb();
              }
            },
            payeeBankCode: {
              required: this.formData.selectBankType === 'OPT' ? true : false,
              validator: (r, val, cb) => {
                if (!val && r.required) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        label: self.$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_CODE')
                      })
                    )
                  );
                  return;
                }
                cb();
              },
              trigger: 'change'
            }
          };
        default:
          return {
            payeeIdentifyMethod: STR_NOT_EMPTY(
              self.$t(
                `CUSTOMER_MANAGEMENT.${transToHighCamel('payeeIdentifyMethod')}`
              )
            )
          };
      }
    }
  },
  mounted() {
    this.initEditData();
  },
  methods: {
    changePayeeBankCode(newVal) {
      const curBank = this.fpsBankList.find(item => item.value === newVal);
      if (curBank && curBank.label) {
        this.$set(this.formData, 'payeeBank', curBank.label);
        this.$set(this.formData, 'payeeBankCode', curBank.value);
      } else {
        this.$set(this.formData, 'payeeBank', '');
        this.$set(this.formData, 'payeeBankCode', '');
      }
    },
    // watch导致回填数据清空
    changePayeeIdentifyMethod() {
      // this.isBlur = false;
      this.formData.payeeAccount = '';
      this.formData.payeeName = '';
      this.formData.payeeBankCode = '';
      this.formData.payeeBank = '';
      this.formData.mobilePhone = '';
      this.formData.emailAddress = '';
      this.formData.fpsId = '';
      this.formData.selectBankType = 'PRE';
      this.$nextTick(() => {
        this.$refs['submitForm'].clearValidate();
      });
    },
    // 失焦事件
    queryDate(prop, e) {
      if (e.target.value) {
        switch (prop) {
          case 'payeeAccount':
            this.addNo = '';
            this.addNoType = '';
            return;
          case 'mobilePhone':
            this.addNo = e.target.value;
            this.addNoType = 'mobilePhone';
            this.queryFps(e.target.value, 'MOBN', false);
            return;
          case 'emailAddress':
            this.addNo = e.target.value;
            this.addNoType = 'emailAddress';
            this.queryFps(e.target.value, 'EMAL', false);
            return;
          case 'fpsId':
            this.addNo = e.target.value;
            this.addNoType = 'fpsId';
            this.queryFps(e.target.value, 'SVID', false);
            return;
          default:
            this.addNo = '';
            this.addNoType = '';
            return;
        }
      }
    },
    // fps查詢
    async queryFps(value, type, isAddStep) {
      const result = await innerFindFpsInfo({
        proxyId: value,
        proxyIdTp: type
      });
      if (result.body) {
        if (isAddStep) {
          this.stepIndex++;
        } else {
          if (type === 'SVID') {
            this.fpsBankList.map(item => {
              if (item.clearingCode === result.body.mmbId) {
                this.formData.payeeBank = item.chtName;
                this.formData.payeeBankCode = item.clearingCode;
              }
            });
          }
          this.formData.selectBankType = 'PRE';
          this.formData.payeeName = result.body.dispNm;
        }
      }
    },
    // utils
    transToHighCamel,
    // events
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
          activeName: '2'
        }
      });
    },
    /** to-next-step */
    handleNextStep() {
      switch (this.stepIndex) {
        case 1:
          this.handleCheckSubmit();
          break;
        default:
          break;
      }
    },
    handleCheckSubmit() {
      console.log('this.submitData', this.submitData);
      console.log('this.formData', this.formData);
      this.submitForm.validate(valid => {
        if (valid) {
          // 增加接口判断
          switch (this.addNoType) {
            case 'mobilePhone':
              this.queryFps(this.addNo, 'MOBN', true);
              return;
            case 'emailAddress':
              this.queryFps(this.addNo, 'EMAL', true);
              return;
            case 'fpsId':
              this.queryFps(this.addNo, 'SVID', true);
              return;
            default:
              this.stepIndex++;
              return;
          }
        } else
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
      });
    },
    /** to-last-step */
    handleLastStep() {
      this.stepIndex--;
    },
    // handle-to-confirm-page
    handleConfirm() {
      const tipTitle = transToHighCamel(this.$route.meta.title),
        content = this.$t('COMMON.CONFIRM_SOMETHING_INFO', {
          content: this.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
        });
      this.$showBox({
        content,
        confirm: () => {
          this.confirmSubmit(this.submitData);
        }
      });
    },
    confirmSubmit(submitData) {
      this.routeQuery.hasOwnProperty('crtItem')
        ? this.handleEdit(submitData)
        : this.handleAdd(submitData);
    },
    async handleAdd(submitData) {
      const result = await addTransCountFast(submitData);
      this.checkResult(result, this.$t('COMMON.ADD'));
    },
    async handleEdit(submitData) {
      const result = await editTransCountFast(submitData);
      this.checkResult(result, this.$t('COMMON.UPDATE'));
    },
    checkResult(res, op = '操作') {
      if (res.hasOwnProperty('body') && res.body) {
        this.stepIndex++;
        this.$showMsg({
          message: `"${op}"${this.$t('COMMON.SUCCESS')},${this.$t(
            'COMMON.RETURN_AFTER_3_SECOND'
          )}`,
          type: 'success'
        });
      } else
        this.$showMsg({
          message: `"${op}"${this.$t('COMMON.FAIL')},${this.$t(
            'COMMON.RETURN_AFTER_3_SECOND'
          )}`,
          type: 'error'
        });
      setTimeout(() => {
        this.initFormPage();
      }, 3000);
    },
    initFormPage() {
      this.handleReset();
      this.handleBackPage();
    },
    handleReset() {
      this.submitForm.resetFields();
      this.stepIndex = 1;
    },
    initEditData() {
      const { type } = this.$route.meta;
      if (!type || type !== 'edit') {
        return;
      } else {
        const { crtItem } = this.routeQuery;
        console.log(crtItem, 'crtItem');
        console.log(crtItem.fpsId, 'crtItem.fpsId');
        const _formData = deepClone(this.formData);
        for (let prop in this.formData) {
          console.log(prop, 'prop');
          const value = crtItem.hasOwnProperty(prop)
            ? crtItem[prop]
            : _formData[prop];
          this.$set(this.formData, prop, value);
        }
        console.log(this.formData, 'this.formData');
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../../../styles/operate-page.scss';

.g-fast-transfer-page {
  @include operatePageMixin;
  .g-desc {
    width: 100%;
    margin: 0;
    padding: 0 10%;
    position: relative;
    left: 10%;
    .g-desc-item {
      color: #c0c4cc;
      .el-step__title {
        color: #c0c4cc;
        font-weight: 500;
        &.is-process &.is-finish {
          font-weight: 500;
        }
      }
    }
  }
}
.flex-cloum {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-radio {
    padding-top: 13px;
    margin-bottom: 9px;
  }
}
</style>
