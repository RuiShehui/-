<!--
 * @Author: ZhangZhen
 * @Date: 2022-04-01 14:21:35
 * @LastEditTime: 2022-05-17 15:30:10
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\registerThirdAccount\telegraphBankAccount\AddAndUpdate\ConfirmInfo.vue
-->

<style lang="scss" scoped>
.m-detail-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .detailItem {
    margin-bottom: 16px;
  }
}
</style>

<template>
  <div class="confirm-info-wrapper">
    <divider :title="$t('PAYMENT.PAYEE_INFO')" class="mb20" />
    <div class="m-detail-content mb8">
      <detail-item :title="$t('PAYMENT.ACCT_NAME')" :content="data.payeeName" />
      <detail-item :title="$t('PAYMENT.RECEIVER_ADDRESS')" :content="data.payeeAddress" />
      <detail-item
        :title="$t('PAYMENT.RECEIVER_COUNTRY')"
        :content="getCountryName(data.payeeCountryCode)"
      />
      <detail-item :title="$t('PAYMENT.ACCT_NO_OR_IBAN')" :content="(data.accountNo)" />
    </div>

    <divider :title="$t('PAYMENT.RECEIVE_BANK_INFO')" class="mb20" />
    <div class="m-detail-content mb8">
      <detail-item
        v-if="data.isSwiftCode"
        :title="'SWIFT Code: '"
        :content="data.swiftCode"
      />
      <detail-item
        :title="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
        :content="getCountryName(data.countryCode)"
      />
      <detail-item :title="$t('PAYMENT.BANK_ADDRESS')" :content="data.bankAddress" />
      <detail-item :title="$t('PAYMENT.BANK_NAME')" :content="data.bankName" />
    </div>
    <!-- A, B, C类型收款人 -->
    <template v-if="entType !== 1 && authInfo && authInfo.AlevelList">
      <divider :title="$t('PAYMENT.AUTH_CENTER')" class="mb20" />
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
    <!-- A, B, C类型收款人 -->
    <el-row class="flexc pt20">
      <v-button size="w160" @click="handleBackStep" class="mr16">
        {{
        $t('COMMON.PREVIOUS_STEP')
        }}
      </v-button>
      <v-button type="primary" size="w160" @click="handleConfirm">
        {{
        $t('COMMON.CONFIRM')
        }}
      </v-button>
    </el-row>
  </div>
</template>

<script>
import { bankInfos } from '@/mixins';

export default {
  name: 'ConfirmInfo',
  mixins: [bankInfos],
  inject: ['entType'],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    authInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    getCountryName: {
      type: Function,
      default() {
        return () => '';
      }
    }
  },
  mounted() {
    console.log(this.data);
  },
  methods: {
    handleBackStep() {
      this.$emit('handleBackStep');
    },
    handleConfirm() {
      this.$emit('handleConfirm');
    }
  }
};
</script>
