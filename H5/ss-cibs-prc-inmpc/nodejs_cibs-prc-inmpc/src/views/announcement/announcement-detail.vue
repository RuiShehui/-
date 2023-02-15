<!--
 * @Autor: 赵霖
 * @Date: 2021-10-25 10:15:52
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2021-12-24 14:40:14
 * @Description: 银行公告管理--银行公告详情
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\views\announcement\announcement-detail.vue
-->
<template>
  <div class="g-detail">
    <col-detail v-for="(itm, idx) of tableData" :key="idx" :item="itm" />
    <div class="g-bottom">
      <el-button class="f-backTo" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
    </div>
  </div>
</template>

<script>
import ColDetail from './components/col-detail';

import { createNamespacedHelpers } from 'vuex';
import { queryAnnouncement } from '@/api/business-management/announcement';
const { mapMutations } = createNamespacedHelpers('tabs');

export default {
  name: 'AnnouncementDetailPage',
  components: {
    ColDetail
  },
  filters: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {},
  mounted() {
    this.getDetailData(this.$route.query);
  },
  methods: {
    ...mapMutations(['DELETE_TABS', 'ADD_TABS']),

    async getDetailData(params) {
      const result = await queryAnnouncement(params);
      if (result.hasOwnProperty('body') && result.body) {
        this.setDetailData(result.body);
      }
    },
    setDetailData(body) {
      this.tableData = [];
      this.tableData.push(body);
    },
    // 返回
    backTo() {
      this.$router.push('/businessMangament/announcement');

      this.DELETE_TABS('/businessMangament/announcement/detail');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-detail {
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  padding: 32px 24px;
}
.g-tabs {
  margin-top: 3.5%;
  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
.f-backTo {
  font-size: 18px;
  margin-top: 20px;
  width: 210px;
  height: 40px;
  background: #f06b00;
  color: #fff;
  text-align: center;
}
</style>
