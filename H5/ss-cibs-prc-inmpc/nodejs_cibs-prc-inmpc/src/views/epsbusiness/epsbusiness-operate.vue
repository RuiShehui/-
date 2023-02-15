<!--
 * @Autor: 赵霖
 * @Date: 2021-10-22 15:21:24
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-11 16:39:40
 * @Description: EPS商家维护--新增EPS商家维护
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\epsbusiness\epsbusiness-operate.vue
-->
<template>
  <div class="contain">
    <el-form
      ref="submitForm"
      class="g-form"
      :model="submitParams"
      :rules="submitRules"
      :disabled="readonly || stepIndex > 1"
      label-width="calc(50% - 170px)"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(簡)'" prop="merchartTypeName">
        <el-input
          class="g-input"
          v-model="submitParams.merchartTypeName"
          :disabled="isEdit"
          :maxlength="300"
        />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(繁)'" prop="merchartTypeNameZht">
        <el-input
          class="g-input"
          v-model="submitParams.merchartTypeNameZht"
          :disabled="isEdit"
          :maxlength="300"
        />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(英)'" prop="merchartTypeNameEn">
        <el-input
          class="g-input"
          v-model="submitParams.merchartTypeNameEn"
          :disabled="isEdit"
          :maxlength="300"
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('BUSINESS_MANAGEMENT.RISK_CLAZZ')" prop="riskClazz">
        <el-select class="g-select" v-model="submitParams.riskClazz">
          <el-option
            v-for="item in riskLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <footer class="u-btn">
      <el-button
        :class="['g-bottom-btn', btnIdx > 0 ? '' : 'cancel']"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
      >{{ btn.name }}</el-button>
    </footer>
  </div>
</template>

<script>
import { deepClone } from '@/utils/tools';
// import { riskLevelList } from './utils/constants';
import { createNamespacedHelpers } from 'vuex';
import mapValidators from '@/utils/stategies';
import constant from '@/utils/constant';
import {
  addEpsBusiness,
  editEpsBusiness
} from '@/api/business-management/eps-business';
import { transToHighCamel } from '../../utils/tools';

const { mapMutations } = createNamespacedHelpers('tabs');
const { RISK_LEVEL_LIST } = constant;

export default {
  name: 'EpsBusinessAddPage',
  components: {},
  data() {
    const self = this;
    const { STR_NOT_EMPTY } = mapValidators(self);
    return {
      submitParams: {
        merchartTypeName: '',
        merchartTypeNameZht:'',
        merchartTypeNameEn:'',
        riskClazz: ''
      },
      submitRules: {
        merchartTypeName: STR_NOT_EMPTY(
          self.$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE'),
          'blur'
        ),
        merchartTypeNameZht: STR_NOT_EMPTY(
          self.$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE'),
          'blur'
        ),
        merchartTypeNameEn: STR_NOT_EMPTY(
          self.$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE'),
          'blur'
        ),
        riskClazz: STR_NOT_EMPTY(
          self.$t('BUSINESS_MANAGEMENT.RISK_LEVEL'),
          'change'
        )
      },
      riskLevelList: RISK_LEVEL_LIST,
      stepIndex: 1
    };
  },
  computed: {
    isEdit() {
      const { query } = this.$route;
      if (query.hasOwnProperty('isEdit')) {
        return true;
      }
      return false;
    },
    readonly() {
      const { meta } = this.$route,
        { readonly = false } = meta;
      if (readonly) {
        return true;
      }
      return false;
    },
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm || null;
    },
    bottomBtns() {
      if (this.readonly) {
        return [
          {
            name: this.$t('COMMON.BACK')
          }
        ];
      }
      switch (this.stepIndex) {
        case 1:
          return [
            {
              name: this.$t('COMMON.BACK')
            },
            {
              name: this.$t('COMMON.CONFIRM')
            }
          ];
        case 2:
          return [
            {
              name: this.$t('COMMON.BACK')
            },
            {
              name: this.$t('COMMON.SUBMIT')
            }
          ];
        default:
          return [];
      }
    }
  },
  mounted() {
    this.initSubmitParams();
  },
  methods: {
    ...mapMutations(['DELETE_TABS']),
    initSubmitParams() {
      const { query } = this.$route;
      const _submitParams = deepClone(this.submitParams);
      for (let k in this.submitParams) {
        if (query.hasOwnProperty(k) && query[k].length) {
          const newValue = query[k] || _submitParams[k];
          this.$set(this.submitParams, k, newValue);
        }
      }
    },
    handleOperations(tarText) {
      switch (tarText) {
        case this.$t('COMMON.BACK'):
          this.handleBack();
          break;
        case this.$t('COMMON.CONFIRM'):
          this.handleNextStep();
          break;
        case this.$t('COMMON.SUBMIT'):
          this.handleSubmit();
          break;
        default:
          break;
      }
    },
    handleNextStep() {
      this.submitForm.validate(valid => {
        if (!valid) {
          this.$showMsg({
            message: this.$t('COMMON.SHOULD_NOT_EMPTY', {
              content: this.$t('COMMON.CONTENT')
            }),
            type: 'error'
          });
          return;
        }
        this.stepIndex++;
      });
      // this.$router.push({
      //   name: 'EpsbusinessAddConfirm',
      //   query: {
      //     submitParams: {
      //       ...this.$route.query,
      //       ...submitParams
      //     },
      //     title: `${operateName}收费折扣`,
      //     isEdit: this.isEdit,
      //     content: ['是否确认操作 ?']
      //   }
      // });
    },
    handleSubmit() {
      const submitParams = {
        // 是否为编辑的内容
        ...(this.isEdit ? this.$route.query : {}),
        // 固定提交的数据
        ...deepClone(this.submitParams)
      };
      const { title } = this.$route.meta,
        operation = this.$t(`MENU_PAGE_ITEMS.${transToHighCamel(title)}`);
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM')}-${operation}?`,
        confirm: () => {
          this.stepIndex++;
          this.confirmSubmit(submitParams, operation);
        }
      });
    },
    async confirmSubmit(params = {}, op = this.$t('COMMON.UPDATE')) {
      try {
        const fn = this.isEdit ? editEpsBusiness : addEpsBusiness,
          result = await fn(params),
          { body } = result;
        if (body && body === true) {
          this.$showMsg({
            message: `"${op}"${this.$t('COMMON.SUCCESS')}, ${this.$t(
              'COMMON.RETURN_AFTER_3_SECOND'
            )}`,
            type: 'success'
          });
        }
      } catch (err) {
        this.$showMsg({
          message: err,
          type: 'error'
        });
      }
      setTimeout(() => {
        this.handleBack();
      }, 3000);
    },
    handleBack() {
      if (this.stepIndex === 2) {
        this.stepIndex--;
        return;
      }
      this.$router.push('/businessMangament/epsbusiness');

      this.DELETE_TABS('/businessMangament/epsbusiness/add');
      this.DELETE_TABS('/businessMangament/epsbusiness/edit');
      this.DELETE_TABS('/businessMangament/epsbusiness/detail');
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #fff;
  box-sizing: border-box;
  min-height: 100%;
}
.g-form {
  .g-input,
  .g-select {
    width: 340px !important;
  }
}
.u-btn {
  display: flex;
  justify-content: center;
  align-content: center;
  padding-bottom: 20px;
  margin-top: 40px;
  .el-button {
    width: 210px;
    height: 40px;
    border-color: #f06b00;
    font-size: 18px;
  }
  .cancel {
    color: #f06b00;
  }
  .confirm {
    background: #f06b00;
    color: #fff;
  }
}
</style>
