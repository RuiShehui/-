<!--
 * @Author: ZhangZhen
 * @Date: 2021-12-25 11:35:46
 * @LastEditTime: 2022-05-24 15:31:51
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\inside-transfer\operate.vue
-->
<template>
  <div class="contain">
    <!-- show-steps -->
    <el-steps :active="step" :align-center="true">
      <el-step
        v-for="(item, index) of stepList"
        :key="index"
        :title="item.title"
      />
    </el-steps>
    <!-- step-1-form -->
    <el-form
      class="g-current"
      ref="submitForm"
      v-show="step === 1"
      :model="submitData"
      :rules="submitRules"
      label-position="right"
      label-width="calc(50% - 170px)"
    >
      <el-form-item
        v-for="prop of showProps"
        :key="prop"
        :prop="prop"
        :label="$t(`CUSTOMER_MANAGEMENT.${transToHighCamel(prop)}`)"
      >
        <el-input
          class="g-form-input"
          v-model="submitData[prop]"
          :placeholder="
            $t(`COMMON.PLEASE_INPUT_SOMETHING`, {
              label: $t(`CUSTOMER_MANAGEMENT.${transToHighCamel(prop)}`)
            })
          "
          maxlength="16"
          @blur="onInputBlur(prop, $event)"
        />
      </el-form-item>
    </el-form>
    <el-descriptions
      class="g-current confirm-desc"
      v-show="step === 2"
      :column="2"
      :title="$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')"
    >
      <el-descriptions-item
        :label="$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeAccount')}`)"
      >
        <div class="desc-content">{{ submitData | filterAccount }}</div>
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t(`CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE`)"
      >
        <div class="desc-content">{{ submitData['payeeName'] }}</div>
      </el-descriptions-item>
    </el-descriptions>
    <div class="g-op-bottom">
      <el-button
        class="g-op-btn"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
        >{{ btn.name }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { transToHighCamel, deepClone } from '@/utils/tools';
import {
  showPayeeName,
  addInsideItem,
  editInsideItem
} from '@/api/customer-management/third-register';
import validator from '@/utils/stategies';
import clientManageFilters from '@/filters/clientManage';

export default {
  name: 'InsideTransferOperate',
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
      submitData: {
        payeeName: '',
        payeeAccount: '',
        payeeCcy: '',
        payeeType: '',
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo') // 网银客户号
      },
      step: 1,
      stepList: [
        { title: writeStepTip },
        { title: confirmStepTip },
        { title: lastStepTip }
      ]
    };
  },
  filters: {
    ...clientManageFilters
  },
  computed: {
    showProps() {
      switch (this.step) {
        case 1:
          return ['payeeAccount'];
        case 2:
          return ['payeeName', 'payeeAccount'];
        default:
          return [];
      }
    },
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm || null;
    },
    submitRules() {
      const ctx = this,
        { STR_NOT_EMPTY } = validator(ctx);

      return {
        payeeAccount: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeAccount')}`),
          'blur'
        ),
        payeeName: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('payeeName')}`),
          'blur'
        )
      };
    },
    bottomBtns() {
      switch (this.step) {
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
    routeQuery() {
      const { query } = this.$route;
      return query || {};
    }
  },
  mounted() {
    this.setEditData();
    if (this.submitData.payeeAccount.length) {
      this.setPayeeName({
        custNo: this.submitData.ebankCstmNo,
        acctNoList: [this.submitData.payeeAccount]
      });
    }
  },
  methods: {
    transToHighCamel,
    setEditData() {
      const { type } = this.$route.meta;
      if (type && type.toLowerCase().includes('edit')) {
        const { crtItem = {} } = this.routeQuery;
        for (let k in crtItem) {
          const value = crtItem[k];
          this.$set(this.submitData, k, value);
        }
      }
    },
    async onInputBlur(prop, e) {
      if (!this.showProps.includes(prop)) {
        this.$set(this.submitData, 'payeeName', '');
        return;
      }
      const inputValue = e.target.value,
        acctNoList = [inputValue],
        params = {
          custNo: this.submitData.ebankCstmNo,
          acctNoList
        };
      if (!inputValue.length) {
        return;
      }
      this.setPayeeName(params);
    },
    async setPayeeName(params) {
      if (params.acctNoList.length) {
        const { body } = await showPayeeName(params);
        if (Object.getOwnPropertyNames(body).length) {
          // this.$showMsg({
          //   message: `${this.$t(`CUSTOMER_MANAGEMENT.GET_PAYEE_NAME_SUCCESS`)}`,
          //   type: 'success'
          // });
          const { englishName, chineseName, payeeCcy, payeeType } = body,
            payeeName = englishName || chineseName;

          this.$set(this.submitData, 'payeeCcy', payeeCcy || '');
          this.$set(this.submitData, 'payeeType', payeeType || '');
          if (payeeName && payeeName.length > 0) {
            this.$set(this.submitData, 'payeeName', payeeName);

            return;
          }
        } else {
          this.$set(this.submitData, 'payeeName', '');
        }
      }

      this.$set(this.submitData, 'payeeName', '');
    },
    handleOperations(btnName) {
      switch (btnName) {
        case this.$t('COMMON.BACK'):
          this.handleBackPage();
          break;
        case this.$t('COMMON.PREVIOUS_STEP'):
          this.step--;
          break;
        case this.$t('COMMON.NEXT_STEP'):
          this.submitForm.validate(valid => {
            if (valid) {
              if (this.submitData.payeeName.length) {
                this.step++;
              }
            } else {
              this.$showMsg({
                message: this.$t('COMMON.CHECK_FAIL'),
                type: 'error'
              });
            }
          });
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
        name: 'RegisterThird'
      });
      // this.$store.commit(
      //   'tabs/DELETE_TABS',
      //   '/customerManagement/registerThird/add-inside-transfer'
      // );
      // this.$store.commit(
      //   'tabs/DELETE_TABS',
      //   '/customerManagement/registerThird/edit-inside-transfer'
      // );
    },
    handleConfirm() {
      const { type } = this.$route.meta;
      const tipTitle = transToHighCamel(this.$route.meta.title),
        content = this.$t('COMMON.CONFIRM_SOMETHING_INFO', {
          content: this.$t(`MENU_PAGE_ITEMS.${tipTitle}`)
        });
      const submitData = {
        ...deepClone(this.submitData)
      };
      this.$showBox({
        content,
        confirm: () => {
          if (type && type.length) {
            if (type.toLowerCase().includes('add')) {
              this.confirmAdd(submitData, type);
            }
            if (type.toLowerCase().includes('edit')) {
              this.confirmEdit(submitData, type);
            }
          }
        }
        // cancel: () => {}
      });
    },
    async confirmAdd(submitData, type) {
      const result = await addInsideItem(submitData);
      this.checkResult(result, type);
    },
    async confirmEdit(submitData, type) {
      const result = await editInsideItem(submitData);
      this.checkResult(result, type);
    },
    checkResult(res, op) {
      if (res.hasOwnProperty('body') && res.body) {
        this.$showMsg({
          message: `${this.$t(
            `COMMON.${transToHighCamel(op)}_SUCCESS`
          )},${this.$t('COMMON.RETURN_AFTER_3_SECOND')}`,
          type: 'success'
        });
      }
      setTimeout(() => {
        this.handleBackPage();
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  width: 100%;
  .g-current {
    margin-top: 30px;
    .g-form-input {
      width: 340px;
    }
    &.confirm-desc {
      margin: 40px calc(50% - 220px);

      .desc-content {
        width: 100%;
        overflow-x: auto;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
  }
  .g-op-bottom {
    width: 100%;
    text-align: center;
    padding: 0;
    .g-op-btn {
      width: 210px !important;
    }
  }
}
</style>
