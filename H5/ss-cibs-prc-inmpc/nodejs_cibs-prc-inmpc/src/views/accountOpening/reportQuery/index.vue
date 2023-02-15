<!-- 報表查詢 -->
<template>
  <div>
    <el-form class="transverse-form" :model="formData" label-width="auto" ref="formData">
      <el-form-item :label="$t('RAO_CHECK.MONTH')" prop="accountOpeningApplictionData">
        <el-date-picker
          class="g-w-270"
          v-model="formData.queryTime"
          :picker-options="pickerOptions"
          type="month"
          align="right"
          unlink-panels
          :clearable="false"
          value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.REPORT_TYPE')" prop="queryType">
        <el-select
          class="g-w-270"
          v-model="formData.queryType"
          @change="selectReport"
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          ">
          <el-option
            v-for="(item, key) in reportTypeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" " style="margin-left: -30px">
        <div style="width:302px;">
          <div style="float:left;">
            <!-- <el-button class="reset" @click="handleReset('formData')">{{ $t('COMMON.RESET') }}</el-button> -->
            <el-button class="query" type="primary" v-if="exportBoolean" @click="exportExcel">{{ $t('RAO_CHECK.EXPORT') }}</el-button>
            <!-- <el-button class="query" type="primary" @click="search">{{ $t('COMMON.SEARCH') }}</el-button> -->
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      v-if="formData.queryType === '0'"
    >
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column width="auto" type="referenceNumber" :label="'报表类型'"></el-table-column>
      <el-table-column prop="referenceNumber" :label="'报表月份'" width="220"></el-table-column>
      <el-table-column :label="$t(`COMMON.OPERATION`)" width="140" fixed="right">
        <template>
          <div class="f-span-btns">
            <span @click="exportReport">{{ $t('RAO_CHECK.EXPORT') }}</span>
          </div>
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
    </el-table> -->
    <!-- <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      v-if="formData.queryType === '0'"
    >
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column width="160" type="referenceNumber" :label="$t(`RAO_CHECK.DRAFT_NUMBER`)"></el-table-column>
      <el-table-column prop="referenceNumber" :label="$t('RAO_CHECK.MCY_NUMBER')" width="220"></el-table-column>
      <el-table-column prop="engFirstName" :label="$t('RAO_CHECK.DRAFT_SUCCESS_NUMBER')" width="220"></el-table-column>
      <el-table-column prop="engLastName" :label="$t('RAO_CHECK.DRAFT_FAIL_NUMBER')" width="160"></el-table-column>
      <el-table-column prop="chineseName" :label="$t('RAO_CHECK.DRAFT_HIGHT_NUMBER')" width="150"></el-table-column>
      <el-table-column prop="idNumber" :label="$t('RAO_CHECK.BRANCH_NUMBER')" width="210"></el-table-column>
      <el-table-column prop="creationTime" :label="$t('RAO_CHECK.BRANCH_SUCCESS_NUMBER')" width="160"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.BRANCH_FAIL_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.EIAO_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.EIAO_SUCCESS_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.ATM_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.TERMLY_SUCCESS_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.STAEMTEN_SUCCESS_NUMBER')" width="190"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.EBANK_SUCCESS_NUMBER')" width="190"></el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>
          {{
          $t('RAO_CHECK.QUERY_NO_RECORDS')
          }}
        </span>
      </div>
    </el-table>
    <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      v-if="formData.queryType === '1'"
    >
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column width="490" type="referenceNumber" :label="$t(`RAO_CHECK.BRANCH_APPLY_NUMBER`)"></el-table-column>
      <el-table-column prop="referenceNumber" :label="$t('RAO_CHECK.BRANCH_SUCCESS_NUMBER')" width="495"></el-table-column>
      <el-table-column prop="engFirstName" :label="$t('RAO_CHECK.BRANCH_NOCOMPLAY_NUMBER')" width="495"></el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>
          {{
          $t('RAO_CHECK.QUERY_NO_RECORDS')
          }}
        </span>
      </div>
    </el-table>
    <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      v-if="formData.queryType === '2'"
    >
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column prop="referenceNumber" :label="$t('RAO_CHECK.REF_NO')" width="165">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="clickDetail(scope.row)">{{ scope.row.referenceNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="referenceNumber" :label="$t('RAO_CHECK.CIF')" width="165"></el-table-column>
      <el-table-column prop="engLastName" :label="$t('RAO_CHECK.MCY_NO')" width="110"></el-table-column>
      <el-table-column prop="engLastName" :label="$t('RAO_CHECK.EIAO_NO')" width="110"></el-table-column>
      <el-table-column prop="engFirstName" :label="$t('RAO_CHECK.ENG_NAME')" width="120"></el-table-column>
      <el-table-column prop="chineseName" :label="$t('RAO_CHECK.CHS_NAME')" width="120"></el-table-column>
      <el-table-column prop="idType" :label="$t('RAO_CHECK.CARD_TYPE')" width="140">
      </el-table-column>
      <el-table-column prop="idNumber" :label="$t('RAO_CHECK.CARD_NO')" width="160"></el-table-column>
      <el-table-column prop="creationTime" :label="$t('RAO_CHECK.APPLICATION_DATA')" width="130"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.CONTACT_NUMBER')" width="120"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.MCY_STATUS')" width="120"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.EIAO_STATUS')" width="120"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.OTHER_STATUS')" width="120"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.SUBORDINATE_BRANCH')" width="120"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.OPERATER')" width="120"></el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>
          {{
          $t('RAO_CHECK.QUERY_NO_RECORDS')
          }}
        </span>
      </div>
    </el-table> -->
    <!-- <div class="g-bolck">
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
    </div> -->
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
import {
  raoCountReport
} from '@/api/accountOpening/reportQuery'
import {
  downloadFile
} from '@/utils/tools';
export default {
  name: 'QueryEbankStatus',
  components: {
  },
  props: {
    exportBoolean: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    const MONTH = dateTools.formatDate(new Date()).slice(0, 7);
    return {
      formData: {
        queryType: 'raoType', // 报表类型
        queryTime: MONTH
      },
      tableData: [], // table数据
      reportTypeList: [
        {
          label: this.$t('RAO_CHECK.ACC_STATISTIC_REPORT', {month: ''}),
          value: 'raoType'
        },
        {
          label: this.$t('RAO_CHECK.ACC_EACH_BRANCH_REPORT', {month: ''}),
          value: 'branch'
        },
        {
          label: this.$t('RAO_CHECK.APPLY_RECORD_REPORT', {month: ''}),
          value: 'other'
        },
      ], // 报表类型列表
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 365 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 1,
    };
  },

  created() {
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
      // let params = {
      //   ...this.formData,
      //   current: this.currentPage,
      //   size: this.pageSize,
      //   orderByField: ''
      // };
      // params.createTimeFrom = params.applictionData[0] || ''
      // params.createTimeTo = params.applictionData[1] || ''
      // delete params.applictionData;
      // let result = await queryAccountOpenList(params)
      // console.log('queryAccountOpenList', result)
      // if (result.head.returnCode !== '000000') {
      //   this.$showMsg({
      //     message: result.head.returnMessage,
      //     type: 'error'
      //   });
      // } else {
      //   this.tableData = result.body.applicationsVOList || []
      // }
    },
    // 选择报表类型
    selectReport() {

    },
    // 导出excel
    async exportExcel() {
      let params = {
        ...this.formData,
      };
      let result = await raoCountReport(params)
      if (result.type !== 'application/octet-stream') {
        this.$showMsg({
          message: this.$t('RAO_CHECK.EXPORT_ERROR'),
          type: 'error'
        });
      } else {
        downloadFile(
          result,
          this.formData.queryType === 'raoType' 
            ? `${this.$t('RAO_CHECK.ACC_STATISTIC_REPORT', {month: this.formData.queryTime})}.csv` 
            : this.formData.queryType === 'branch' 
              ? `${this.$t('RAO_CHECK.ACC_EACH_BRANCH_REPORT', {month: this.formData.queryTime})}.csv`
              : `${this.$t('RAO_CHECK.APPLY_RECORD_REPORT', {month: this.formData.queryTime})}.csv`,
          'text/csv'
        );
      }
      // }
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
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(1) {
    color: #f06b00;
    // margin-left: 10px;
  }
}
</style>
