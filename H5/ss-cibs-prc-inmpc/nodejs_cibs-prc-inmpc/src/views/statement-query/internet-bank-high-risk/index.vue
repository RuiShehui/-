<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:36:21
 * @LastEditTime: 2022-08-24 09:59:43
 * @LastEditors: zhangcheng
 * @Description: 网上银行每日高风险交易设置报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\internet-bank-high-risk\index.vue
-->
<template>
  <div class="contain">
    <el-form
      :model="queryData"
      class="transverse-form"
      label-width="auto"
      ref="formRef"
      label-suffix=":"
      label-position="right"
    >
      <!-- 个人网银客户号 -->
      <el-form-item :label="$t('STATEMENT_QUERY.CRN')" class="g-project" prop="custNo">
        <el-input
          v-model="queryData.custNo"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-270"
        ></el-input>
      </el-form-item>
      <!-- 个人类型 -->
      <el-form-item :label="$t('STATEMENT_QUERY.ENTERPRISK_TYPE')" prop="entType">
        <el-select v-model="queryData.entType" class="f-w-270">
          <el-option :label="$t('STATEMENT_QUERY.ALL')" value></el-option>
          <el-option :label="$t('STATEMENT_QUERY.SINGLE_AUTH')" value="1"></el-option>
          <el-option :label="$t('STATEMENT_QUERY.JOINT_AUTH')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 启用/停用日期 -->
      <el-form-item label="啟用/停用日期:" prop="transDate">
        <el-date-picker
          class="f-w-270"
          v-model="queryData.transDate"
          type="daterange"
          range-separator
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button @click="OnlineBankHighRiskTransDownload">下載</el-button>
    <el-table
      height="550px"
      class="m-t-20"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 个人类型 -->
      <el-table-column :label="$t('STATEMENT_QUERY.ENTERPRISK_TYPE')" prop="entType" width="130">
        <template v-slot="{row}">{{ entTypeFilter(row.entType) }}</template>
      </el-table-column>
      <!-- 个人网银客户号 -->
      <el-table-column :label="$t('STATEMENT_QUERY.CRN')" prop="custNo"></el-table-column>
      <!-- 启用 -->
      <el-table-column :label="$t('STATEMENT_QUERY.START_STOP_DATA')" prop="enaDeaDate"></el-table-column>
      <!-- 操作类型 -->
      <el-table-column :label="$t('STATEMENT_QUERY.OPERATE_TYPE')" prop="operaType" width="120">
        <template v-slot="{row}">{{ operaTypeFilter(row.operaType) }}</template>
      </el-table-column>
      <!-- 执行高风险交易的最后日期 -->
      <el-table-column :label="$t('STATEMENT_QUERY.HIGH_RISK_OPERATE')" prop="impleDate">
        <template v-slot="{row}">{{ impleDateFilter(row.impleDate) }}</template>
      </el-table-column>
      <!-- 操作更新者 -->
      <el-table-column :label="$t('STATEMENT_QUERY.OPETATOR')" prop="operator"></el-table-column>
      <!-- 操作者类型 -->
      <!-- <el-table-column :label="$t('STATEMENT_QUERY.OPERATOR_TYPE')" prop="operatorType"></el-table-column> -->
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <div class="total">
        <span>{{ `${$t('STATEMENT_QUERY.SA_START_STOP')}：${SAStart}/${SAStop}` }}</span>
        <span>{{ `${$t('STATEMENT_QUERY.MAM_START_STOP')}：${MAMStart}/${MAMStop}` }}</span>
        <span>{{ `${$t('STATEMENT_QUERY.TOTAL')}：${total}` }}</span>
      </div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getPreMonthDay, getDateStr } = dateTools;
const endDate = getDateStr(new Date(), -1);
const startDate = getPreMonthDay(endDate, 1);
import filters from '@/filters/clientManage';
import FormButton from '@/components/common/FormButton.vue';
import {
  OnlineBankHighRiskTransSelect,
  OnlineBankHighRiskTransDownload
} from '@/api/apply-checkbook';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'HightRisk',
  filters,
  components: {
    FormButton
  },
  watch: {
    'mySubmitForm.transDate': {
      handler(val) {
        this.mySubmitForm.startDate = val[0];
        this.mySubmitForm.endDate = val[1];
      }
    }
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0,
      queryData: {
        custNo: '',
        entType: '',
        transDate: [startDate, endDate],
        startDate: startDate,
        endDate: endDate
      },
      min: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过3个月的
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now() - 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
          // console.log('time----', time);
        }
      },
      tableData: [],
      SAStart: '1',
      SAStop: '0',
      MAMStart: '1',
      MAMStop: '0'
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      let params = {
        ...this.queryData,
        pageNum: this.current,
        pageSize: this.size,
        startDate: this.queryData.transDate[0],
        endDate: this.queryData.transDate[1]
      };
      OnlineBankHighRiskTransSelect(params).then(res => {
        this.tableData = res.body.onlineBankList;
        this.total = res.body.total;
        this.saNum = res.body.satotal;
        this.mamNum = res.body.mamtotal;
        this.SAStart = res.body.saenaNum;
        this.SAStop = res.body.sadeaNum;
        this.MAMStart = res.body.mamenaNum;
        this.MAMStop = res.body.mamdeaNum;
      });
    },
    entTypeFilter(entType) {
      switch (entType) {
        case '1':
          return 'SA個人';
        case '2':
          return 'MAN個人';
        default:
          return entType;
      }
    },
    operaTypeFilter(operaType) {
      switch (operaType) {
        case '0':
          return '停用';
        case 'N':
          return '停用';
        case '1':
          return '啟用';
        case '5':
          return '啟用';
        default:
          return operaType;
      }
    },
    impleDateFilter(impleDate) {
      switch (impleDate) {
        case null:
          return '--';
        default:
          return impleDate;
      }
    },

    async OnlineBankHighRiskTransDownload() {
      const result = await OnlineBankHighRiskTransDownload();
      if (result && result.body) {
        downUrl(result.body);
      }
    },
    handleSizeChange(val) {
      this.current = 1;
      this.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    },
    query() {
      this.current = 1;
      this.queryList();
    },
    handleReset() {
      this.$refs['formRef'].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.g-bolck {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 20px;
  .total {
    span:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
  }
}
.f-w-270 {
  width: 270px;
}

.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.m-t-20 {
  margin-top: 20px;
}
</style>