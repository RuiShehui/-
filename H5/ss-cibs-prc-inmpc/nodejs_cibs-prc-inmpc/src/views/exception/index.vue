<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-08 10:18:22
 * @LastEditTime: 2022-06-19 18:51:42
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\exception\index.vue
-->
<template>
  <div class="g-business">
    <query-menu
      ref="queryMenu"
      :properties="{
        handleSt: $t('BUSINESS_MANAGEMENT.DEAL_STATUS'),
      }"
      :btn-group="[
        {
          name: $t('COMMON.SEARCH'),
          type: 'primary'
        },
        {
          name: $t('COMMON.RESET'),
          type: 'reset'
        },
      ]"
      :default-value="{
        handleSt: '01',
        current: this.requestParams.current,
        size: this.requestParams.size
      }"
      @handleSearch="handleSearch"
      @handleReset="handleReset"
    >
      <el-form-item
        v-fix-form-label
        prop="timespan"
        :label="`${$t('BUSINESS_MANAGEMENT.TIME_SPAN')}:`"
      >
        <el-date-picker
          :class="['g-w-270', 'menu-input']"
          v-model="requestParams.timespan"
          :picker-options="pickerOptions"
          :start-placeholder="$t('BUSINESS_MANAGEMENT.START_TIME')"
          :end-placeholder="$t('BUSINESS_MANAGEMENT.END_TIME')"
          type="daterange"
          :range-separator="$t('BUSINESS_MANAGEMENT.TO')"
          :placeholder="$t('BUSINESS_MANAGEMENT.PLEASE_INPUT_TIME_SPAN')"
        />
      </el-form-item>
    </query-menu>
    <el-table
      class="g-table"
      :data="tableData"
      :stripe="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column
        v-for="itm of i18Columns"
        :key="itm.prop"
        :prop="itm.prop"
        :label="itm.label"
        :width="itm.width"
        :min-width="itm.minWidth"
      >
        <template v-slot="{ row, column }">
          <p v-if="itm.prop === 'handleSt'">{{ row[itm.prop] | dealStatusText }}</p>
          <p v-else-if="itm.prop === 'tradeType'">{{ row[itm.prop] | tradeTypeText }}</p>
          <p v-else-if="itm.prop === 'status'">{{ row[itm.prop] | tradeStatusText }}</p>
          <p v-else v-html="row[itm.prop]" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="requestParams.handleSt === '01'"
        :label="$t('BUSINESS_MANAGEMENT.OP')"
        width="220px"
        max-width="220px"
      >
        <template v-slot="{ row }">
          <el-button
            type="text"
            :disabled="btndisabled(row.createDate)"
            :class="!btndisabled(row.createDate) ? 'g-op-btn success' : 'g-op-btn grey'"
            @click="handleOperateItem(row, 'success')"
          >{{ $t('BUSINESS_MANAGEMENT.SUCCESS_OP') }}</el-button>
          <el-button
            type="text"
            :disabled="btndisabled(row.createDate)"
            :class="!btndisabled(row.createDate) ? 'g-op-btn fail' : 'g-op-btn grey'"
            @click="handleOperateItem(row, 'fail')"
          >{{ $t('BUSINESS_MANAGEMENT.FAIL_OP') }}</el-button>
        </template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-pagination-area">
      <el-pagination
        :background="true"
        :current-page="requestParams.current"
        :page-size="requestParams.size"
        :page-sizes="[10, 20, 30, 50]"
        :total="requestParams.total"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      />
    </div>
    <div class="g-u-note">
      <p>{{ $t('BUSINESS_MANAGEMENT.TOTAL_DESC') }}</p>
      <ul class="g-u-note-list">
        <li>{{ $t('BUSINESS_MANAGEMENT.DESC_SENTENCE_1') }}</li>
        <li>{{ $t('BUSINESS_MANAGEMENT.DESC_SENTENCE_2') }}</li>
        <li>{{ $t('BUSINESS_MANAGEMENT.DESC_SENTENCE_3') }}</li>
        <li>{{ $t('BUSINESS_MANAGEMENT.DESC_SENTENCE_4') }}</li>
      </ul>
    </div>
    <!-- 确认成功dialog -->
  </div>
</template>

<script>
import QueryMenu from '@/components/query-menu';

import {
  getExceptionList as requestListFn,
  updateTradeStatus
} from '@/api/business-management/exception';
import dateTools from '@/utils/dateTools';
import filters from '@/filters/business';
import pageMixin from '@/mixins/table-page';
import { fixFormLabel } from '@/directives';

const { formatDate, getDateStr } = dateTools;
export default {
  components: {
    QueryMenu
  },
  directives: {
    fixFormLabel
  },
  filters,
  mixins: [pageMixin],
  data() {
    const self = this;
    return {
      requestParams: {
        current: 1,
        size: 10,
        handleSt: '01',
        total: 0,
        timespan: ['', '']
      },
      tableData: [],
      columns: {
        number: 'BUSINESS_MANAGEMENT.NUMBER',
        handleSt: 'BUSINESS_MANAGEMENT.DEAL_STATUS',
        tradeType: 'BUSINESS_MANAGEMENT.TRADE_SCENE',
        createDate: 'BUSINESS_MANAGEMENT.TRAN_DATE',
        status: 'BUSINESS_MANAGEMENT.TRADE_STATUS',
        flowNo: 'BUSINESS_MANAGEMENT.DEBIT_ACCOUNT_NO',
        drAcct: 'BUSINESS_MANAGEMENT.PAYER_ACCOUNT',
        crAcct: 'BUSINESS_MANAGEMENT.STAFF_ACCOUNT',
        cur: 'BUSINESS_MANAGEMENT.CURRENCY',
        amount: 'BUSINESS_MANAGEMENT.TRADE_MONEY_TYPE',
        returnMsg: 'BUSINESS_MANAGEMENT.TRADE_INFO'
      },
      scene: '',
      visible: false,
      operation: true,

      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 2 * 365 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          var thatDay = time.getTime();
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      }
    };
  },
  computed: {
    i18Columns() {
      const crtColumns = Object.keys(this.columns).map(k => ({
        label: this.$t(this.columns[k]),
        prop: k,
        minWidth: k === 'number' ? 60 : 80
      }));

      return crtColumns;
    },
    beginDate() {
      const timespan = this.requestParams.timespan;
      const start = timespan[0];
      if (start && start.toString().length) {
        const beginDate = formatDate(new Date(start));

        return beginDate;
      }
      return getDateStr(formatDate(new Date()), -30);
    },
    endDate() {
      const timespan = this.requestParams.timespan;
      const end = timespan[1];
      const endDate = formatDate(new Date(end));

      if (end && end.toString().length) {
        const endDate = formatDate(new Date(end));

        return endDate;
      }

      return formatDate(new Date());
    }
  },
  watch: {
    ['requestParams.timespan'](newVal) {
      if (!newVal) {
        const endDate = formatDate(new Date()),
          beginDate = getDateStr(endDate, -30);

        this.$set(this.requestParams, 'timespan', [beginDate, endDate]);
      }
    }
  },

  created() {
    const endDate = formatDate(new Date()),
      beginDate = getDateStr(endDate, -30);
    this.getContentData({
      current: 1,
      size: 10,
      beginDate: beginDate + ' ' + '00:00:00',
      endDate: endDate + ' ' + '23:59:59',
      handleSt: '01'
    });
    this.$set(this.requestParams, 'timespan', [beginDate, endDate]);
  },

  methods: {
    requestListFn,
    btndisabled(date){
      let d1 = new Date(date)
      let d2 = new Date()

      let cha = Math.abs(d2.getTime() - d1.getTime())
      let day = parseInt(cha / (24 * 60 * 60 * 1000))
      let hour = parseInt(cha % (24 * 60 * 60 * 1000) / (60*60*1000))
      let min = parseInt(cha % (60 * 60 * 1000) / (60*1000))

      if (day && Number(day) > 30) {
        return true
      }else {
        return false
      }
    },

    // handle-reset
    handleReset() {
      this.requestParams.handleSt = '01';
      this.requestParams.current = 1;
      this.requestParams.size = 10;
      const endDate = formatDate(new Date()),
        beginDate = getDateStr(endDate, -30);
      this.$set(this.requestParams, 'timespan', [beginDate, endDate]);
      this.getContentData({
        current: 1,
        size: 10,
        beginDate: beginDate + ' ' + '00:00:00',
        endDate: endDate + ' ' + '23:59:59',
        handleSt: '01'
      });
    },
    // search-area-request
    handleSearch(params = {}) {
      if (this.isValidTime()) {
        const requestParams = {
          handleSt: params.handleSt,
          current: params.current,
          size: params.size,
          beginDate: this.beginDate + ' ' + '00:00:00',
          endDate: this.endDate + ' ' + '23:59:59'
        };
        this.requestParams.handleSt = params.handleSt;
        this.requestParams.current = params.current;
        this.requestParams.size = params.size;
        delete requestParams.timespan;
        this.getContentData(requestParams);
      }
    },
    // search-by-page
    getContentByPageInfo(value, type) {
      if (type === 'size') {
        this.requestParams.size = value;
      } else if (type === 'current') {
        this.requestParams.current = value;
      }
      this.handleSearch(this.requestParams);
    },
    // ...
    handleOperateItem(crtItem, status) {
      const statusText =
        status === 'success'
          ? this.$t('BUSINESS_MANAGEMENT.SUCCESS')
          : this.$t('BUSINESS_MANAGEMENT.FAIL');

      this.$showBox({
        content: `${this.$t(
          'BUSINESS_MANAGEMENT.CONFIRM_CHANGE_TO'
        )}"${statusText}", ${this.$t(
          'BUSINESS_MANAGEMENT.FORBID_CHANGE_AGAIN'
        )}!`,
        confirm: () => {
          status === 'success'
            ? this.confirmOperateItem({
                ...crtItem,
                operateStatus: '00'
              })
            : this.confirmOperateItem({
                ...crtItem,
                operateStatus: '01'
              });
        }
      });
    },
    async confirmOperateItem(crtItem) {
      const result = await updateTradeStatus(crtItem);
      this.checkResult(result, this.$t('COMMON.SUBMIT'), [
        this.requestParams
      ]);
      this.getContentData({
        current: 1,
        size: 10,
        beginDate: this.beginDate + ' ' + '00:00:00',
        endDate: this.endDate + ' ' + '23:59:59',
        handleSt: '01'
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.g-business {
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  .g-cpn-tag {
    font-size: 14px;
    box-sizing: border-box;
    position: relative;
    top: 12px;
    right: 6px;
  }
  .g-u-note {
    font-size: 14px;
    margin-top: 40px;
    color: #666;
    .g-u-note-list {
      li {
        text-decoration: none;
        list-style: none;
      }
    }
  }
  .g-pagination-area {
    width: 100%;
    text-align: right;
    margin-top: 3rem;
  }
  .g-op-btn {
    cursor: pointer;
    position: relative;
    right: 5px;
    // height: 10rem;
    &.success {
      color: #ff9400;
    }
    &.fail {
      color: #f00;
    }
    &.grey {
      color: #c0c4cc;
    }
  }
  ::v-deep .el-form-item__content {
    display: inline-block;
  }
  .g-w-270 {
    width: 270px;
  }
  .menu-input {
    width: 270px;
    margin-right: 20px;
  }
}
</style>