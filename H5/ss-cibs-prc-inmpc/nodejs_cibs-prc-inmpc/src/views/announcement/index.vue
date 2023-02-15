<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-05-19 16:34:42
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\announcement\index.vue
-->
<template>
  <div ref="searchForm" class="contain">
    <el-form class="transverse-form" label-width="auto" ref="formRef">
      <el-form-item :label="`${$t('BUSINESS_MANAGEMENT.PUB_STATUS')}:`">
        <el-select
          v-model="requestParams.announcementStatus"
          :placeholder="$t('COMMON.PLEASE_SELECT', { label: $t('BUSINESS_MANAGEMENT.PUB_STATUS') })"
          class="g-w-270"
          @change="onAnnouncementStatusChange"
        >
          <el-option
            v-for="itm of pubStatusList"
            :key="itm.value + ' ' + itm.label"
            :value="itm.value"
            :label="itm.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE')}:`" class="g-project">
        <el-input
          v-model="requestParams.title"
          maxlength="100"
          :placeholder="$t('COMMON.PLEASE_INPUT', { label: $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE') })"
          class="g-w-270"
        />
      </el-form-item>
      <el-form-item v-show="requestParams.announcementStatus !== '1'" :label="`${$t('BUSINESS_MANAGEMENT.SUBMIT_TIME')}:`" class="g-project">
        <el-date-picker
          class="g-w-120"
          v-model="requestParams.timespan[0]"
          type="date"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
          :range-separator="$t('COMMON.DATESPAN_TO')"
          :start-placeholder="$t('COMMON.START_DATE')"
          :end-placeholder="$t('COMMON.END_DATE')"
        />
        <span class="g-p-20">至</span>
        <el-date-picker
          class="g-w-120"
          v-model="requestParams.timespan[1]"
          type="date"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
          :range-separator="$t('COMMON.DATESPAN_TO')"
          :start-placeholder="$t('COMMON.START_DATE')"
          :end-placeholder="$t('COMMON.END_DATE')"
        />
      </el-form-item>
      <el-form-item label=" ">
        <!-- 查询 /**重置**/ 新增 -->
        <div style="width:300px;">
          <Form-Button
            style="float:right"
            @add="handleAdd"
            @submit="handleSearch"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      class="g-table"
      :data="tableData"
      :stripe="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="number" :label="$t('COMMON.SERIAL_NUMBER')" minWidth="60" />
      <el-table-column
        prop="cnAnnouncementTitle"
        :label="$t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE')"
        width="250px"
        min-width="200px"
      >
        <template v-slot="{ row }">
          <span
            type="text"
            class="g-op-btn detail-btn"
            @click="handleCheckDetail(row)"
          >{{ renderTitle(row) }}</span>
          <!-- cnAnnouncementTitle tcAnnouncementTitle enAnnouncementTitle -->
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="$t('BUSINESS_MANAGEMENT.SUBMIT_TIME')"
        min-width="200px"
      >
        <template v-slot="{ row }">{{ row.createTime | createTimeText }}</template>
      </el-table-column>
      <el-table-column
        prop="announcementStatus"
        :label="$t('BUSINESS_MANAGEMENT.PUB_STATUS')"
        min-width="80px"
      >
        <template v-slot="{ row }">{{ row.announcementStatus | announcementStatusStatusText }}</template>
      </el-table-column>
      <el-table-column prop="creator" :label="$t('BUSINESS_MANAGEMENT.SUBMITOR')" min-width="120px">
        <template v-slot="{ row }">{{`${row.creator || ''}( ${row.creatorUserName || ''})` }}</template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('COMMON.OPERATION')" min-width="80px">
        <template v-slot="{ row }">
          <span
            class="g-op-btn delete-btn"
            @click="handleDelete(row)"
            type="text"
          >{{ $t('COMMON.DELETE') }}</span>
        </template>
      </el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_IS_EMPTY') }}</footer>
      </div>
    </el-table>
    <div class="g-pagination-area">
      <el-pagination
        :background="true"
        :current-page.sync="requestParams.current"
        :page-size="requestParams.size"
        :total="requestParams.total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      />
    </div>
  </div>
</template>

<script>
import {
  getAnnouncementList as requestListFn,
  deleteAnnounce
} from '@/api/business-management/announcement';

import dateTools from '@/utils/dateTools';
import FormButton from '@/components/common/FormButton.vue';
import pageMixin from '@/mixins/table-page';
import { getHead } from '@/utils/user';
import constant from '@/utils/constant';
// import { useStorage } from '@/hooks';
// import { ANNOUNCEMENT_REQUEST_PARAMS } from '@/configs/keys';

const { formatDate, getDateStr } = dateTools;
const { ANNOUNCEMENT_STATUS_LIST } = constant;

export default {
  name: 'AnnouncementIndexPage',
  mixins: [pageMixin],
  components: {
    FormButton
  },
  filters: {
    announcementStatusStatusText(status) {
      return ANNOUNCEMENT_STATUS_LIST.find(item => item.value === status)
        ? ANNOUNCEMENT_STATUS_LIST.find(item => item.value === status).label
        : '';
    },
    createTimeText(createTime = 'yyyy-mm-ddThh:mm:ss') {
      return createTime.replace('T', () => ' ');
    }
  },
  data() {
    const endTime = formatDate(new Date()),
      startTime = getDateStr(endTime, -30);

    return {
      pubStatusList: ANNOUNCEMENT_STATUS_LIST,
      requestParams: {
        current: 1,
        size: 10,
        total: 0,
        timespan: [startTime, endTime],
        title: '',
        announcementStatus: 0
      },
      tableData: [],
      visible: false
    };
  },
  watch: {
    ['requestParams.timespan'](newVal) {
      if (!newVal) {
        this.requestParams.timespan = ['', ''];
      }
    },
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate(date) {
          return new Date(date) <= new Date();
        }
      };
    },
    startTime() {
      const timespan = this.requestParams.timespan;
      const start = timespan[0];
      if (start.toString && start.toString().length) {
        const startTime = formatDate(new Date(start));

        return startTime;
      }
      return '';
    },
    endTime() {
      const timespan = this.requestParams.timespan;
      const end = timespan[1];

      if (end.toString && end.toString().length) {
        const endTime = formatDate(new Date(end));

        return endTime;
      }

      return '';
    }
  },
  mounted() {
    this.initContentData();
  },
  methods: {
    // 默认查询方法
    requestListFn,
    // init-content-data
    initContentData() {
      const endTime = formatDate(new Date()),
        startTime = getDateStr(endTime, -30);

      this.getContentData({
        current: 1,
        size: 10,
        startTime,
        endTime
      });
    },
    // search-list-items
    handleSearch() {
      if (this.requestParams.announcementStatus !== '1') {
        if (!this.requestParams.timespan[0] || !this.requestParams.timespan[1]) {
          return this.$showMsg({
            type: 'error',
            message: this.$t('AUTHORIZATION_CENTER.PLEASE_SUBMIT_TIME')
          });
        }
        if (this.getDateGap() < 0) {
          return this.$showMsg({
            message: this.$t('BUSINESS_MANAGEMENT.END_TIME_AND_START_TIME'),
            type: 'error'
          });
        }
      }
      if (this.isValidTime()) {
        const requestParams = this.getCrtParams();
        // reset-page-info
        requestParams.current = 1;
        requestParams.size = 10;

        this.getContentData(requestParams);
      }
    },
    getDateGap() {
      let [startTime, endTime] = this.requestParams.timespan;
      const { getGapDay } = dateTools;
      let days = getGapDay(startTime, endTime);
      return days;
    },
    getCrtParams() {
      const requestParams = {
        ...this.requestParams,
        ...((start, end) => {
          let startTime, endTime;
          if (!end || !end.length) {
            endTime = formatDate(new Date());
            startTime = getDateStr(endTime, -30);
          } else {
            endTime = end;
            startTime = start;
          }
          return {
            startTime,
            endTime
          };
        })(this.startTime, this.endTime)
      };
      delete requestParams.timespan;
      return requestParams;
    },
    getContentByPageInfo(value, pageProperty) {
      this.requestParams[pageProperty] = value;
      const requestParams = this.getCrtParams();
      this.getContentData(requestParams);
    },
    // 详情
    handleCheckDetail(row) {
      this.$router.push({
        name: 'AnnouncementDetail',
        query: {
          type: 'detail',
          ...row
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$showBox({
        content: this.$t('BUSINESS_MANAGEMENT.CONFIRM_DELETE_ANNOUNCEMENT'),
        confirm: () => this.confirmDelete(row)
      });
    },
    async confirmDelete(crtItem) {
      const result = await deleteAnnounce(crtItem);
      this.checkResult(result, this.$t('COMMON.DELETE'), [this.getCrtParams()]);
      const requestParams = this.getCrtParams();
      this.getContentData(requestParams);
    },
    // 新增
    handleAdd() {
      this.$router.push({
        name: 'AnnouncementAdd'
      });
    },
    // 重置
    handleReset() {
      const endTime = formatDate(new Date()),
        startTime = getDateStr(endTime, -30);

      this.$set(this.requestParams, 'current', 1);
      this.$set(this.requestParams, 'size', 10);
      this.$set(this.requestParams, 'timespan', [startTime, endTime]);
      this.$set(this.requestParams, 'title', '');
      this.$set(this.requestParams, 'announcementStatus', 0);
    },
    // 校验操作结果
    checkResult(res, op) {
      if (res.body && res.body === true) {
        this.$showMsg({
          type: 'success',
          message: `${this.$t(`COMMON.SOMETHING_SUCCESS`, {
            op: `${this.$t(
              'MENU_PAGE_ITEMS.ANNOUNCEMENT_MANAGE'
            )}${op}: ${this.$t('COMMON.SUBMIT')}`
          })}`
        });
      }
    },
    renderTitle({
      cnAnnouncementTitle = '',
      tcAnnouncementTitle = '',
      enAnnouncementTitle = ''
    }) {
      const { lang = 'zhXG' } = getHead();
      switch (lang) {
        case 'zhCN':
          return cnAnnouncementTitle;
        case 'zhXG':
          return tcAnnouncementTitle;
        default:
          return enAnnouncementTitle;
      }
    },
    onAnnouncementStatusChange(newVal) {
      this.requestParams.timespan = ['', ''];
      switch (newVal) {
        case '1':
          // TODO ...
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import './styles/index.scss';
</style>