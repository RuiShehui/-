<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-27 15:02:22
 * @LastEditTime: 2022-09-17 17:22:56
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\transferRecord\record-detail\index.vue
-->
<!-- 最近转账记录 详情-->
<template>
  <div class="g-recorddetail-container">
    <title-tab :title="$t('COMMON.DETAIL')" />
    <!-- 单笔转账详情 -->
    <single-record
      v-if="!['03010401', '03010501'].includes(detailItem.businessCode)"
      :detailItem="detailItem"
    />
    <!-- 批量转账详情 -->
    <batch-record v-else :detailItem="detailItem" />

    <v-button size="w210" @click="returnBack">
      {{ $t('COMMON.BACK') }}
    </v-button>
    <div class="wPro">
      <p class="p1 mb16">
        {{ `${$t('PAYMENT.WARM_TIPS')}: ` }}
      </p>
      <p>{{ `${$t('TRANSFR_INFO.SUCCESSFUL_TRANSFERS')}: ` }}</p>
    </div>
  </div>
</template>

<script>
import TitleTab from '../../components/title-tab';
import SingleRecord from './single-record.vue';
import BatchRecord from './batch-record.vue';

import { escapeTransType } from '@bank-transfer/utils/filters';
import { bankInfos } from '@/mixins';

import { confirm } from '@bank-transfer/mixins';

export default {
  name: 'RecentTransferRecordDetail',
  components: {
    TitleTab,
    SingleRecord,
    BatchRecord
  },
  mixins: [bankInfos, confirm],
  props: {
    detailItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mounted() {
  },
  methods: {
    escapeTransType,
    returnBack() {
      this.$emit('returnBack');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-recorddetail-container {
  ::v-deep .vbutton {
    display: block;
    margin: 20px auto 0;
  }
  .m-detail-content {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
}
</style>
