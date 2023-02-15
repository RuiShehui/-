<!--
 * @Author: ZhangZhen
 * @Date: 2022-04-18 14:07:01
 * @LastEditTime: 2022-05-18 15:56:43
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\applyCheckbook\components\confirm.vue
-->
<template>
  <div class="g-confirmInfo">
    <!-- confirm-info -->
    <detail-item
      :title="formData.accountType"
      :content="
        `${filterAcctType(formData.accountNo)} ${formData.currency} ${
          formData.accountType
        }`
      "
    />
    <detail-item
      v-if="getWayList.length > 0"
      :title="$t('HEAD.Delivery_method')"
      :content="
        getWayList.some(item => item.value === formData.getWay)
          ? getWayList.find(item => item.value === formData.getWay).label
          : ''
      "
    />
    <!-- confirm-info -->
    <!-- auth-info -->
    <template v-if="authInfo && authInfo.AlevelList">
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
    </template>
    <!-- auth-info -->
    <el-row class="u-btn mt36">
      <v-button type size="w160" @click="onLastStep" class="mlr15">{{ $t('COMMON.PREVIOUS_STEP') }}</v-button>
      <v-button
        type="primary"
        size="w160"
        @click="onNextStep"
        v-loading="butFlag"
      >{{ $t('COMMON.DETERMINE') }}</v-button>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import accountManagement from '@/filters/accountManagement';
import { chequeBookSubmit, chequeBookAuth } from '@/api/applyCheckbook';

const filterAcctType = accountManagement.accountType;

export default {
  name: 'ApplyCheckBookConfirm',
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    },
    getWayList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  filters: {
    showLabelFilter(list) {
      return list
        .map(item => {
          if (typeof item === 'string') {
            return item;
          }

          return item.label;
        })
        .join(', ');
    }
  },
  data() {
    return {
      butFlag: false //按钮防重点击控制
    };
  },
  computed: {
    ...mapState(['requestLoading']),
    authInfo() {
      const { authInfo } = this.formData;
      return authInfo || {};
    }
  },
  mounted() {},
  methods: {
    filterAcctType,

    onLastStep() {
      this.$emit('back');
    },
    async onNextStep() {
      this.butFlag = true;

      const params = {
          ...this.formData
        },
        result = await chequeBookSubmit(params);
      if (this.entType !== 1) {
        await this.sendEmail(this.formData);
      }
      if (result && result.body) {
        const { body } = result;
        if (body.authResultInfo) {
          this.butFlag = false;
          const { authResultInfo } = body;
          this.$emit('next', authResultInfo);
        }
      }else if (result.head.returnCode) {
        this.butFlag = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.g-confirmInfo {
  width: 100%;
  .detailItem {
    display: inline-block;
    width: 50%;
  }

  .u-btn {
    display: flex;
    margin-left: 36%;
  }
}
</style>
