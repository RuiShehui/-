<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-24 14:11:23
 * @LastEditTime: 2022-05-26 14:23:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\local-transfer\pages\local-fast\operate.vue
-->
<template>
  <div class="g-local-fast-operate">
    <!-- show-steps -->
    <header class="g-header">
      <el-steps :active="stepIndex" :align-center="true">
        <el-step
          v-for="(item, index) of stepList"
          :key="index"
          :title="item.title"
        />
      </el-steps>
    </header>
    <section class="g-main-wrapper">
      <el-form
        v-show="stepIndex === 1"
        ref="submitForm"
        class="main-input-form"
        :model="submitData"
        :rules="formRules"
        label-width="calc(50% - 170px)"
        label-position="right"
      >
        <el-form-item
          v-show="showProps.includes(prop)"
          v-for="(value, prop) in submitData"
          :key="prop"
          :prop="prop"
          :label="
            $t(`CUSTOMER_MANAGEMENT${prop ? `.${transToHighCamel(prop)}` : ''}`)
          "
        >
          <el-input
            class="g-form-input"
            v-if="inputs.includes(prop)"
            v-model="submitData[prop]"
            placeholder
            maxlength="300"
          />
          <el-select
            class="g-form-select"
            v-if="prop === 'payeeBankCode'"
            v-model="submitData[prop]"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
          >
            <el-option
              v-for="(bn, bnIdx) of chatsBankList"
              :key="bnIdx + bn"
              :value="bn.value"
              :label="bn.value + ' ' + bn.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-descriptions
        class="g-desc"
        v-show="stepIndex === 2"
        :title="$t('CUSTOMER_MANAGEMENT.CONFIRM_INFO')"
      >
        <el-descriptions-item
          v-for="prop in showProps"
          :key="prop"
          :label="
            $t(`CUSTOMER_MANAGEMENT${prop ? `.${transToHighCamel(prop)}` : ''}`)
          "
        >
          {{
            (prop => {
              if (inputs.includes(prop)) {
                return submitData[prop];
              }
              if (prop === 'payeeBankCode' && chatsBankList.length) {
                return chatsBankList.find(
                  item => item.value === submitData.payeeBankCode
                )
                  ? chatsBankList.find(
                      item => item.value === submitData.payeeBankCode
                    ).label
                  : '';
              }
              return '';
            })(prop)
          }}
        </el-descriptions-item>
      </el-descriptions>
    </section>
    <!-- operations -->
    <footer class="g-footer">
      <el-button
        :class="['g-bottom-btn', btnIdx === 1 ? 'confirm' : 'cancel']"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
        >{{ btn.name }}</el-button
      >
    </footer>
  </div>
</template>

<script>
import { transToHighCamel, deepClone } from '@/utils/tools';
import mapValidator from '@/utils/stategies';
import hkBanks from '@/mixins/bank-infos';
import {
  addLocalFastItem,
  editLocalFastItem
} from '@/api/customer-management/third-register';
// 'registerCode' in this.submitData

export default {
  name: 'LocalFastOperate',
  mixins: [hkBanks],
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
    const { STR_NOT_EMPTY } = mapValidator(self);
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
      inputs: ['payeeName', 'payeeAccount'],
      submitData: {
        payeeBankCode: '', // 收款银行/机构编号
        payeeBank: '', // 收款银行/机构名称
        payeeName: '', // 收款人名称
        payeeAccount: '', // 收款账户
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo') // 网银客户号
      },
      showProps: ['payeeBankCode', 'payeeName', 'payeeAccount'],
      /** first-step-validate-rule */
      formRules: {
        payeeName: STR_NOT_EMPTY(
          self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeName')}`)
        ),
        // payeeAccount: STR_NOT_EMPTY(
        //   self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeAccount')}`)
        // ),
        payeeAccount: {
        required: true,
          validator: (r, val, cb) => {
            if (!val || !val.length) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.RECEIVE_ACCOUNT')
                  })
                )
              );
              return;
            }
            if (!/^\d{1,34}$/.test(val)) {
              cb(new Error(self.$t('COMMON.CHECK_FAIL')));
              return;
            }
            cb();
          }
        //   STR_NOT_EMPTY(
        //   self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeAccount')}`,
        //   )
        // ),
        },
        payeeBankCode: STR_NOT_EMPTY(
          self.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeBankCode')}`),
          'change'
        )
      }
    };
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
    }
  },
  watch: {
    'submitData.payeeBankCode'(newVal) {
      const crtBank = this.chatsBankList.find(item => item.value === newVal);
      if (crtBank) {
        this.$set(this.submitData, 'payeeBank', crtBank.label || '');
      }
    }
  },
  mounted() {
    this.initEditData();
  },
  methods: {
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
    // back-list-page
    handleBackPage() {
      this.$router.push({
        name: 'RegisterThird',
        query: {
          activeName:'2'
        }
      });
    },
    // handle-back-last-step
    handleLastStep() {
      this.stepIndex--;
    },
    // handle-to-next-step
    handleNextStep() {
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
          this.stepIndex++;
        } else
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
      });
    },
    handleConfirm() {
      const self = this,
        tipTitle = transToHighCamel(self.$route.meta.title),
        content = self.$t('COMMON.CONFIRM_SOMETHING_INFO', {
          content: self.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
        });
      this.$showBox({
        content,
        confirm: () => this.confirmSubmit()
      });
    },
    async confirmSubmit() {
      try {
        const fn =
            'registerCode' in this.submitData
              ? editLocalFastItem
              : addLocalFastItem,
          op =
            'registerCode' in this.submitData
              ? this.$t('COMMON.UPDATE')
              : this.$t('COMMON.ADD');

        const result = await fn(this.submitData),
          { body } = result;
        if (body && body === true) {
          this.$showMsg({
            type: 'success',
            message: `${op}-${this.$t('COMMON.SUCCESS')}`
          });
        } else {
          this.$showMsg({
            type: 'error',
            message: `${op}-${this.$t('COMMON.FAIL')}`
          });
        }
      } catch (err) {
        // console.error(err);
      }
      setTimeout(() => {
        this.$router.push({
          name: 'RegisterThird',
        query: {
          activeName:'2'
        }
        });
      }, 3000);
    },
    initFormPage() {
      this.submitForm.resetFields();
      this.stepIndex = 1;
      this.handleBackPage();
    },
    initEditData() {
      const { type } = this.$route.meta;
      if (!type || type !== 'edit') {
        return;
      } else {
        const { crtItem } = this.routeQuery;
        const _submitData = deepClone(this.submitData);
        for (let prop in this.submitData) {
          const value = crtItem.hasOwnProperty(prop)
            ? crtItem[prop]
            : _submitData[prop];
          this.$set(this.submitData, prop, value);
        }
        this.$set(this.submitData, 'registerCode', crtItem.registerCode);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../../../styles/operate-page.scss';

.g-local-fast-operate {
  @include operatePageMixin;
  .g-desc {
    width: 100%;
    margin: 0;
    padding: 0 10%;
    position: relative;
    left: 5%;
  }
}
</style>
