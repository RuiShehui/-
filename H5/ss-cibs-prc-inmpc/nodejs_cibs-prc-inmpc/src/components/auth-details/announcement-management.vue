<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 10:41:18
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 15:28:52
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\announcement-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.CN_TITLE`) }}</div>
      <div>{{ tableData.cnTitle }}</div>
      <div>{{ $t(`BUSINESS_MANAGEMENT.ANNOUNCEMENT_EFFECTIVE_TIME`) }}</div>
      <div>{{ tableData.announcementDeadtime }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.CN_CONTENT`) }}</div>
      <div>{{ tableData.cnContent }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.TC_TITLE`) }}</div>
      <div>{{ tableData.tcTitle }}</div>
      <div>{{ $t(`BUSINESS_MANAGEMENT.ANNOUNCEMENT_EFFECTIVE_TIME`) }}</div>
      <div>{{ tableData.announcementDeadtime }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.TC_CONTENT`) }}</div>
      <div>{{ tableData.tcContent }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.EN_TITLE`) }}</div>
      <div>{{ tableData.enTitle }}</div>
      <div>{{ $t(`BUSINESS_MANAGEMENT.ANNOUNCEMENT_EFFECTIVE_TIME`) }}</div>
      <div>{{ tableData.announcementDeadtime }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`BUSINESS_MANAGEMENT.EN_CONTENT`) }}</div>
      <div>{{ tableData.enContent }}</div>
    </div>
  </div>
  <!-- <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="
            $t(`AUTHORIZATION_CENTER.ANNOUNCEMENT_TITLE`)
          "
          width="180"
        >
          {{
          $t(`AUTHORIZATION_CENTER.ANNOUNCEMENT_TITLE`)
          }}
        </el-table-column>
        <el-table-column prop="title"></el-table-column>
        <el-table-column width="180">
          {{
          $t(`BUSINESS_MANAGEMENT.ANNOUNCEMENT_EFFECTIVE_TIME`)
          }}
        </el-table-column>
        <el-table-column prop="announcementDeadtime"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="
            $t(`AUTHORIZATION_CENTER.ANNOUNCEMENT_CONENT`)
          "
          width="180"
        >
          {{
          $t(`AUTHORIZATION_CENTER.ANNOUNCEMENT_CONENT`)
          }}
        </el-table-column>
        <el-table-column prop="content"></el-table-column>
  </el-table>-->
  <!-- </section> -->
</template>

<script>
import CONSTANTS from '@/utils/constant.js';
import { getHead } from '@/utils/user';
export default {
  components: { CONSTANTS },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {
        cnTitle: '',
        cnContent: '',
        tcTitle: '',
        tcContent: '',
        enTitle: '',
        enContent: ''
      }
    };
  },
  computed: {},
  created() {},

  mounted() {
    // console.log('this.options', JSON.parse(this.options.temp.afterMdJson).body);
    this.processData(JSON.parse(this.options.temp.afterMdJson).body);
  },

  methods: {
    // columnStyle({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex == 0 || columnIndex == 2) {
    //     return 'background:#f3f6fc;';
    //   } else {
    //     return 'background:#ffffff';
    //   }
    // },

    //处理公告数据
    processData(noticeObj) {
      if (!noticeObj.inputEndTime) {
        noticeObj.inputEndTime = this.$t(
          'BUSINESS_MANAGEMENT.FOREVER_EFFECTED'
        );
      }
      this.tableData.announcementDeadtime = `${
        noticeObj.inputStartTime
      } ${this.$t('COMMON.DATESPAN_TO')} ${noticeObj.inputEndTime}`;
      this.tableData.cnTitle = noticeObj.cnAnnouncementTitle;
      this.tableData.cnContent = noticeObj.cnAnnouncementContent;
      this.tableData.tcTitle = noticeObj.tcAnnouncementTitle;
      this.tableData.tcContent = noticeObj.tcAnnouncementContent;
      this.tableData.enTitle = noticeObj.enAnnouncementTitle;
      this.tableData.enContent = noticeObj.enAnnouncementContent;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
