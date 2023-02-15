<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-08-11 14:11:10
 * @LastEditors: zhangcheng
 * @Description: 已接受的银行间资金转账报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\isreport-bank-transfer\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="queryDate" label-width="auto">
      <el-form-item label="個人網銀客戶號:" prop="custNo">
        <el-input class="g-w-270" v-model="queryDate.custNo" placeholder="請輸入"></el-input>
      </el-form-item>
      <el-form-item label="交易類型:" prop="tradeType">
        <el-select class="g-w-270" v-model="queryDate.tradeType" placeholder="全部">
          <el-option
            v-for="(item,index) in transTypeList"
            :key="index"
            :label="item.tradeType"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易日期:" prop="transDate">
        <el-date-picker
          class="g-w-270"
          v-model="queryDate.transDate"
          type="daterange"
          range-separator
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="渠道:" prop="channel">
        <el-select class="g-w-270" v-model="queryDate.channel" placeholder="全部">
          <el-option
            v-for="(item,index) in channelList"
            :key="index"
            :label="item.channel"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="search"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下載</el-button>
    <!-- 列表数据区 -->
    <div class="mt-20">
      <el-table
        :data="tableData"
        stripe
        height="550px"
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="createTime" width="110" label="提交日期">
          <template v-slot="{ row }">{{ row.createDate }}</template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交時間">
          <template v-slot="{ row }">{{ row.createTime }}</template>
        </el-table-column>
        <el-table-column prop="custNo" width="130" label="個人網銀客戶號"></el-table-column>
        <el-table-column prop="flowNum" width="180" label="交易流水號"></el-table-column>
        <el-table-column prop="tradeTypeName" width="180" label="交易類型"></el-table-column>
        <el-table-column prop="debitAcct" label="付款賬戶"></el-table-column>
        <el-table-column prop="debitAcctCur" label="幣種"></el-table-column>
        <el-table-column prop="amount" label="交易金額"></el-table-column>
        <el-table-column prop="creditAcct" label="收款賬戶"></el-table-column>
        <el-table-column prop="creditAcctCur" label="幣種"></el-table-column>
        <el-table-column prop="rate" label="匯率"></el-table-column>
        <el-table-column prop="equivalent" label="港幣等值"></el-table-column>
        <el-table-column prop="serviceCharge" label="收費金額">
          <template v-slot="{row}">{{ row.serviceCharge||'0.00' }}</template>
        </el-table-column>
        <el-table-column prop="channel" label="渠道">
          <template v-slot="{row}">{{ channelFilter(row.channel) }}</template>
        </el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
      </el-table>
      <!-- 分页区 -->
      <div class="g-bolck">
        <div>交易數量：{{ total }}</div>
        <el-pagination
          :background="true"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import {
  transferStatement,
  transferStatementDownload
} from '@/api/statiscal-query';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'IsreportBankTransfer',
  components: {
    FormButton
  },
  watch: {
    'queryDate.transDate': {
      handler(newVal) {
        const [startTime = '', endTime = ''] = newVal;
        console.log(startTime, endTime);
        this.queryDate.startTime = startTime;
        this.queryDate.endTime = endTime;
      }
    }
  },
  data() {
    return {
      queryDate: {
        custNo: '',
        tradeType: '',
        transDate: [initDate, initDate],
        startTime: initDate,
        endTime: initDate,
        channel: ''
      },
      transTypeList: [
        {
          tradeType: '轉數快',
          value: '03010201'
        },
        {
          tradeType: 'CHATS',
          value: '03010202'
        },
        {
          tradeType: '批量發薪',
          value: '03010501'
        },
        {
          tradeType: '批量轉賬',
          value: '03010401'
        }
      ],
      channelList: [
        {
          value: 'APP',
          channel: 'MB'
        },
        {
          value: 'WEB',
          channel: 'IB'
        }
      ],
      min: '',
      pickOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        disabledDate: time => {
          if (this.min) {
            const m = 30 * 24 * 60 * 60 * 1000;
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now() - 24 * 3600 * 1000
            );
          }

          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      saNum: 0,
      mamNum: 0,
      tableData: []
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    channelFilter(val) {
      switch (val) {
        case 'WEB':
          return '個人網銀';
        case 'APP':
          return '手機銀行 ';
        default:
          return val;
      }
    },
    // 账户详情
    toAccDetail() {
      this.showIndex = false;
      this.showAcctInfo = true;
      this.showUserInfo = false;
    },
    // 用户详情
    toUseDetail() {
      this.showIndex = false;
      this.showUserInfo = true;
      this.showAcctInfo = false;
    },
    // 回到首页
    backIndex() {
      this.showIndex = true;
    },
    // 查询
    async search() {
      this.showIndex = true;
      const params = {
        size: this.pageSize,
        current: this.currentPage,
        ...this.queryDate
      };
      const result = await transferStatement(params);
      if (result && result.body) {
        console.log(result, 'listlistlistlist');
        this.tableData = result.body.list;
        this.total = result.body.total;
      }
    },
    // 重置
    handleReset() {
      this.currentPage = 1;
      this.$refs['formRef'].resetFields();
    },
    // 改变页面条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },
    // 下载
    async downLoad() {
      const result = await transferStatementDownload({
        size: this.pageSize,
        current: this.currentPage,
        ...this.queryDate
      });
      if (result && result.body) {
        downUrl(result.body.url);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
  .transverse-form {
    display: flex;
    flex-wrap: wrap;
    .g-w-270 {
      width: 270px;
    }
    .el-form-item {
      display: flex;
      margin-right: 40px;
      ::v-deep .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .g-bolck {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    // margin-top: 32px;
    padding: 10px 0px 10px;
  }
  .detail {
    color: #e34141;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>