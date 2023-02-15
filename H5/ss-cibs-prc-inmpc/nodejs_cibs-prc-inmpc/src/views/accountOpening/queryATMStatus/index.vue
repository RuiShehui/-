<!-- ATM卡狀態查詢 -->
<template>
  <div>
    <!-- 查询表单 -->
    <el-form class="transverse-form" :model="formData" label-width="auto" ref="formData">
      <el-form-item :label="$t('RAO_CHECK.APPLICATION_DATA_SYMBOL')" prop="applictionData">
        <el-date-picker
          class="g-w-270"
          v-model="formData.applictionData"
          type="daterange"
          align="right"
          unlink-panels
          :clearable="false"
          :range-separator="$t('COMMON.DATESPAN_TO')"
          :start-placeholder="
            $t('COMMON.START_DATE')
          "
          :end-placeholder="
            $t('COMMON.END_DATE')
          "
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="selectDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label=" " style="margin-left: -30px">
        <div style="width:302px;">
          <div style="float:right;">
            <el-button class="reset" @click="handleReset('formData')">{{ $t('COMMON.RESET') }}</el-button>
            <el-button class="export" @click="exportExcel">{{ $t('RAO_CHECK.EXPORT') }}</el-button>
            <el-button class="query" type="primary" @click="search">{{ $t('COMMON.SEARCH') }}</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }">
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column prop="primaryAccountNo" :label="$t('RAO_CHECK.MAIN_ACCOUNT')" width="180"></el-table-column>
      <el-table-column prop="primaryAccountType" :label="$t('RAO_CHECK.ACCOUNT_CATEGORY')" width="150"></el-table-column>
      <el-table-column prop="cif" :label="$t('RAO_CHECK.CIF')" width="140"></el-table-column>
      <el-table-column prop="createTime" :label="$t('RAO_CHECK.APPLICATION_DATA')" width="140"></el-table-column>
      <el-table-column prop="certCountry" :label="$t('RAO_CHECK.CARD_ISSUE_COUNTRY')" width="170">
        <template slot-scope="scope">
          <div>{{ countryObj[scope.row.certCountry] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="certType" :label="$t('RAO_CHECK.CARD_ISSUE_TYPE')" width="190">
        <template slot-scope="scope">
          <div>{{ cardTypeObj[scope.row.certType] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="certId" :label="$t('RAO_CHECK.CARD_ISSUE_NO')" width="170"></el-table-column>
      <el-table-column prop="ownerName" :label="$t('RAO_CHECK.NAME_OF_CARDHoLDER')" width="180"></el-table-column>
      <el-table-column prop="status" :label="$t('RAO_CHECK.CARD_STATUS')" width="160">
        <template slot-scope="scope">
          <div>{{ statusObj[scope.row.status] }}</div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>
          {{
          $t('RAO_CHECK.QUERY_NO_RECORDS')
          }}
        </span>
      </div>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
import {
  queryATMList,
  downloadATMReport
} from '@/api/accountOpening/queryATMStatus'
import {
  downloadFile
} from '@/utils/tools';
import CONSTANTS from '@/utils/constant';
const {
  CARD_TYPE_LIST,
  NATIONAL_LIST
} = CONSTANTS;

export default {
  name: 'QueryATMStatus',
  components: {
  },
  data() {
    const endTime = dateTools.formatDate(new Date()),
      startTime = dateTools.getDateStr(endTime, -30);
    return {
      formData: {
        applictionData: [startTime, endTime], // 申请日期
        createTimeFrom: '', // 申请日期 开始
        createTimeTo: '', // 申请日期 结束
      },
      cardTypeObj: {}, // 证件类型
      countryObj: {}, // 国家
      statusObj: {
        0: this.$t('RAO_CHECK.INIT_STATE'),
        1: this.$t('RAO_CHECK.CARD_RETRY'),
        2: this.$t('RAO_CHECK.CARD_NO_RETRY'),
        3: this.$t('RAO_CHECK.CARD_SUCCESS'),
        4: this.$t('RAO_CHECK.CARD_PROPRE'),
        5: this.$t('RAO_CHECK.CARD_EXIT'),
      }, // 账户类型
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 90 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      tableData: [], // table数据
      currentPage: 1,
      pageSize: 10,
      total: 1,
    };
  },

  created() {
    // 證件類型list轉Obj
    CARD_TYPE_LIST.forEach(item => {
      this.cardTypeObj[item.value] = item.label
    })
    // 國籍list轉Obj
    NATIONAL_LIST.forEach(item => {
      this.countryObj[item.value] = item.label
    })
    console.log("this.countryObj", this.countryObj)
    this.search();
  },
  activated() {
    this.search();
  },

  mounted() {
    
  },

  methods: {
    // 查詢
    async search() {
      let params = {
        ...this.formData,
        current: this.currentPage,
        size: this.pageSize,
        orderByField: ''
      };
      params.createTimeFrom = params.applictionData[0] || ''
      params.createTimeTo = params.applictionData[1] || ''
      delete params.applictionData;
      let result = await queryATMList(params)
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.atmCreateCardVOS || []
        this.total = result.body.total
      }
    },
    // 重置
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 导出excel
    async exportExcel() {
      let params = {
        ...this.formData,
      };
      params.createTimeFrom = params.applictionData[0] || ''
      params.createTimeTo = params.applictionData[1] || ''
      delete params.applictionData;
      let result = await downloadATMReport(params)
      console.log('downloadReport', result)
      if (result.type !== 'application/octet-stream') {
        this.$showMsg({
          message: this.$t('RAO_CHECK.EXPORT_ERROR'),
          type: 'error'
        });
      } else {
        downloadFile(
          result,
          `${this.$t('RAO_CHECK.ATM_REPORT')}.csv`,
          'text/csv'
        );
      }
      // }
    },
    //选择时间
    selectDate([startTime, endTime]) {
      console.log('applictionData', this.formData)
      //判断时间段是否超过90天
      const { getGapDay } = dateTools;
      let days = getGapDay(startTime, endTime);
      if (days > 90) {
        this.resetTimespan(startTime);
        this.$showBox({
          content: this.$t('COMMON.QUERY_INTERVAL')
        });
      }
    },
    //时间段超过90天，以开始时间为准，结束时间为开始时间之后90天
    resetTimespan(startTime) {
      const { getDateStr } = dateTools;
      const endTime = getDateStr(startTime, 90);
      this.$set(this.formData, 'applictionData', [startTime, endTime]);
    },
    // pageSize 改变是触发
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    // currentPage 改变是触发
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.search();
    },
  }
};
</script>

<style lang="scss" scoped>
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 20px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
  }
}
.g-bolck {
  text-align: right;
  padding: 24px;
}
.g-w-270 {
  width: 270px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.export {
  margin-left: 16px;
  border-color: #f06b00;
  color: #f06b00;
}
</style>
