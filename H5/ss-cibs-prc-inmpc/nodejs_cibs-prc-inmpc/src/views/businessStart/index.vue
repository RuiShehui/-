<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-05-19 16:34:52
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\businessStart\index.vue
-->
<template>
  <div class="g-business-start">
    <main class="u-businessTable">
      <el-table
        :data="tableData"
        row-key="menuCode"
        default-expand-all
        :tree-props="{ children:'children',haChildren:'hasChildren' }"
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column
          :label="$t('BUSINESS_MANAGEMENT.MENU_NAME')"
          prop="menuName"
          min-width="328px"
        ></el-table-column>
        <el-table-column
          :label="$t('BUSINESS_MANAGEMENT.MENU_STATUS')"
          prop="menuStatus"
          min-width="328px"
        >
          <template v-slot="{ row }">
            <span v-show="row.showFlag">{{ (menuStatusText(row.menuStatus)) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('COMMON.OPERATION')" min-width="328px">
          <template v-slot="{ row, $index }">
            <div
              v-show="row.showFlag"
              class="op-btn"
              @click="handleSetup(row, $index)"
            >{{ $t('COMMON.SETTING') }}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-backtop :bottom="100" />
    </main>
  </div>
</template>

<script>
import {
  getNetbackList as requestListFn,
  getNetbackDetail
} from '@/api/business-management/business-start';
import { formatTreeData } from '@/utils/tools';

import pageMixin from '@/mixins/table-page';

export default {
  name: 'BusinessStart',
  components: {},
  mixins: [pageMixin],
  mounted() {
    this.getContentData({});
  },

  methods: {
    requestListFn,
    async handleSetup(row = {}) {
      const { body } = await getNetbackDetail(row);
      if (body) {
        const crtItem = {
          ...row,
          ...body
        };
        await this.$router.push({
          path: '/businessMangament/businessStart/setup',
          query: {
            ...crtItem,
            customerCode: crtItem.commNetbankMenuObjects
              ? crtItem.commNetbankMenuObjects.map(item =>
                  crtItem.suitableObject === '0'
                    ? item.depCode
                    : item.customerCode
                )
              : []
          }
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/businessMangament/businessStart'
        );
      }
    },
    _setPageInfo() {},
    _setContentData(list) {
      console.log('list', list);
      list.forEach(item => {
        item.showFlag = true;
        if (
          item.transType == '9' ||
          item.transType == 'S' ||
          item.transType == 'P' ||
          item.transType == 'A' ||
          item.basicsMenu == '0'
        ) {
          item.showFlag = false;
        }
      });
      this.tableData = formatTreeData(list, 'menuCode', 'pmenuCode');
    },
    menuStatusText(menuStatus) {
      switch (Number(menuStatus)) {
        case 1:
          return this.$t('COMMON.USING');
        case 0:
          return this.$t('COMMON.STOP_USING');
        default:
          return '';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import './styles/index.scss';
</style>