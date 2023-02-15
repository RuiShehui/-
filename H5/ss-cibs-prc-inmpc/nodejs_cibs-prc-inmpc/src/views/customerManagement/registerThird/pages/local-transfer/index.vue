<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-23 09:59:32
 * @LastEditTime: 2022-01-25 09:04:37
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\local-transfer\index.vue
-->
<template>
  <div class="g-page-wrapper">
    <el-tabs v-model="crtTab">
      <el-tab-pane v-for="(tab) of tabList" :key="tab.value" :label="tab.label" :name="tab.value">
        <fast-transfer v-if="crtTab === '0'" />
        <local-fast v-if="crtTab === '1'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 转数快
import FastTransfer from './pages/trans-fast';
// 本地特快
import LocalFast from './pages/local-fast';

import pageMixin from '@/mixins/table-page';

export default {
  name: 'LocalTransfer',
  components: {
    FastTransfer,
    LocalFast
  },
  mixins: [pageMixin],
  props: {},
  data() {
    const self = this;
    return {
      crtTab: '0',
      tabList: [
        {
          label: self.$t('CUSTOMER_MANAGEMENT.TRANS_FAST'),
          value: '0'
        },
        {
          label: self.$t('CUSTOMER_MANAGEMENT.LOCAL_FAST'),
          value: '1'
        }
      ],
      tableData: [
        {
          number: '序号',
          payeeCode: '登记编号',
          payeeBank: '收款机构/银行',
          payeeName: '收款人名称',
          payeeAccount: '收款账户',
          operations: ['update', 'delete', 'transfer']
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.g-page-wrapper {
  width: 100%;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}
</style>
