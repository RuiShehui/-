<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-09-23 15:52:11
 * @LastEditors: zhangcheng
 * @Description: 网银交易数据报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\webbank-transfer-data\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="queryData" label-width="auto">
      <el-form-item label="渠道:" prop="channel">
        <el-select class="g-w-270" v-model="queryData.channel" placeholder="全部">
          <el-option
            v-for="(item,index) in channelList"
            :key="index"
            :label="item.channel"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="統計類型:" prop="tradeType">
        <el-select class="g-w-270" v-model="queryData.tradeType" placeholder="全部">
          <el-option
            v-for="(item,index) in typeCodeList"
            :key="index"
            :label="item.typeCode"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item label="交易日期:" prop="transDate">
        <el-date-picker
          class="g-w-270"
          v-model="queryData.transDate"
          type="monthrange"
          range-separator="至"
          :picker-options="pickOptions"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>-->
      <el-form-item label="交易日期:" prop="startTime">
        <el-date-picker
          class="g-w-270"
          v-model="queryData.startTime"
          :picker-options="pickOptions"
          type="month"
          placeholder="請選擇日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="query"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下載</el-button>
    <!-- 列表数据区 -->
    <div class="mt-20 ">
      <!-- 账户统计结果列表 -->
      <el-table
      height="550px"
        :data="tableData"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="transChannel" label="渠道" width="150">
          <template v-slot="{row}">{{ transChannelFilter(row.transChannel) }}</template>
        </el-table-column>
        <el-table-column prop="countTypeName" label="統計類型" width="150">
          <template v-slot="{row}">
            <div v-if="row.position==='L'">{{ row.countTypeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="countTypeName" width="150">
          <template v-slot="{row}">
            <div v-if="row.position==='M'">{{ row.countTypeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="countTypeName" width="150">
          <template v-slot="{row}">
            <div v-if="row.position==='R'">{{ row.countTypeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="saCount" label="SA數量"></el-table-column>
        <el-table-column prop="mamCount" label="MAM數量"></el-table-column>
        <el-table-column prop="totalCount" label="總數"></el-table-column>
      </el-table>
      <div class="transverse" v-if="Object.keys(tradeReportInfo).length>0">
        <div class="row">
          <div class="title">每月统计</div>
          <div></div>
        </div>
        <div class="row">
          <div>取消“線上高風險交易設置”提醒次數</div>
          <div>{{ tradeReportInfo.highRiskReminder }}</div>
        </div>
        <div class="row">
          <div>更改密碼的總用戶數</div>
          <div>{{ tradeReportInfo.changePwdNum }}</div>
        </div>
        <div class="row">
          <div>高風險商戶繳費登記-通過線上</div>
          <div>{{ tradeReportInfo.merchantRegNum }}</div>
        </div>
        <div class="row">
          <div>當月要求提高其他銀行交易限額的老客戶數量</div>
          <div>{{ tradeReportInfo.liftOutwardLimitNum }}</div>
        </div>
        <div class="row">
          <div>當月CHB交易限額內要求提升第三方的老客戶數量</div>
          <div>{{ tradeReportInfo.liftInnerLimitNum }}</div>
        </div>
        <div class="row">
          <div>已提升其他銀行交易限額的客戶總數</div>
          <div>{{ tradeReportInfo.speOutwardLimitTotalNum }}</div>
        </div>
        <div class="row">
          <div>在CHB交易限額內與第三方提升的客戶數</div>
          <div>{{ tradeReportInfo.speInnerTotalNum }}</div>
        </div>
      </div>
      <!-- <el-table
        class="mt-40"
        v-if="tradeReportInfo.length"
        :data="tradeReportInfo"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="highRiskReminder" label width="250"></el-table-column>
        <el-table-column prop="changePwdNum" label="更改密碼的賬戶數" width="138"></el-table-column>
        <el-table-column prop="merchantRegNum" label="高風險商戶繳費登記-通過線上" width="208"></el-table-column>
        <el-table-column prop="liftOutwardLimitNum" label="當月要求提高其他銀行交易限額的老客戶數量" width="300"></el-table-column>
        <el-table-column prop="liftInnerLimitNum" label="當月CHB交易限額內要求提升第三方的老客戶數量" width="335"></el-table-column>
        <el-table-column prop="speOutwardLimitTotalNum" label="已提升其他銀行交易限額的客戶總數"></el-table-column>
        <el-table-column prop="speInnerTotalNum" label="在CHB交易限額內與第三方提升的客戶數" width="290"></el-table-column>
      </el-table>-->
      <!-- 分页区 -->
      <!-- <div class="g-bolck">
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
      </div>-->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import dateTools from '@/utils/dateTools';
const { getPreMonthDay } = dateTools;
function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : '' + (date.getMonth() + 1);
  console.log(`${year}-${month}-01`);
  return getPreMonthDay(`${year}-${month}-01`, 1);
}
const initDate = getDate();
import FormButton from '@/components/common/FormButton.vue';
import {
  tradeStatistics,
  tradeStatisticsDownload
} from '@/api/statiscal-query';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'WebbankTransferData',
  components: {
    FormButton
  },
  // watch: {
  //   'queryData.transDate': {
  //     handler(newVal) {
  //       const [startTime = '', endTime = ''] = newVal;
  //       console.log(startTime, endTime);
  //       this.queryData.startTime = startTime;
  //       this.queryData.endTime = endTime;
  //     }
  //   }
  // },
  data() {
    return {
      queryData: {
        // tradeType: '',
        // transDate: [initDate, initDate],
        startTime: initDate,
        // endTime: initDate,
        channel: ''
      },
      // typeCodeList: [
      //   {
      //     value: '01',
      //     typeCode: '銀行客戶總數'
      //   },
      //   {
      //     value: '02',
      //     typeCode: '網上銀行客戶總數'
      //   },
      //   {
      //     value: '03',
      //     typeCode: '網上銀行賬戶總數'
      //   },
      //   {
      //     value: '04',
      //     typeCode: '非金融交易'
      //   },
      //   {
      //     value: '05',
      //     typeCode: 'FPS統計'
      //   },
      //   {
      //     value: '06',
      //     typeCode: '非金融交易總數'
      //   },
      //   {
      //     value: '07',
      //     typeCode: '服務註冊摘要'
      //   },
      //   {
      //     value: '08',
      //     typeCode: '賬戶數量'
      //   },
      //   {
      //     value: '09',
      //     typeCode: '開通SMS OTP'
      //   },
      //   {
      //     value: '10',
      //     typeCode: '開通 soft token'
      //   },
      //   {
      //     value: '11',
      //     typeCode: '帶有個性化登錄名'
      //   },
      //   {
      //     value: '12',
      //     typeCode: '設定小額轉賬'
      //   },
      //   {
      //     value: '13',
      //     typeCode: '金融交易'
      //   },
      //   {
      //     value: '14',
      //     typeCode: '資金轉賬銀行內'
      //   },
      //   {
      //     value: '15',
      //     typeCode: '其他銀行'
      //   },
      //   {
      //     value: '16',
      //     typeCode: '轉數快'
      //   },
      //   {
      //     value: '17',
      //     typeCode: 'CHATS'
      //   },
      //   {
      //     value: '18',
      //     typeCode: '全球匯款'
      //   },
      //   {
      //     value: '19',
      //     typeCode: '批量轉賬'
      //   },
      //   {
      //     value: '20',
      //     typeCode: '批量發薪'
      //   },
      //   {
      //     value: '21',
      //     typeCode: '自動轉賬收款'
      //   },
      //   {
      //     value: '22',
      //     typeCode: '繳付賬單-按賬戶'
      //   },
      //   {
      //     value: '23',
      //     typeCode: '開立定期存款'
      //   },
      //   {
      //     value: '24',
      //     typeCode: '外幣兌換'
      //   },
      //   {
      //     value: '25',
      //     typeCode: '基金認購'
      //   },
      //   {
      //     value: '26',
      //     typeCode: '基金轉換'
      //   },
      //   {
      //     value: '27',
      //     typeCode: '基金贖回'
      //   },
      //   {
      //     value: '28',
      //     typeCode: '金融交易總數'
      //   },
      //   {
      //     value: '29',
      //     typeCode: '人民幣交易'
      //   }
      // ],
      channelList: [
        {
          channel: '全部',
          value: ''
        },
        {
          channel: '網上銀行',
          value: 'WEB'
        },
        {
          channel: '手機銀行',
          value: 'APP'
        },
        {
          channel: '電子銀行',
          value: 'CIBS'
        }
      ],
      pickOptions: {
        //不能选择跨过3个月的
        disabledDate: time => {
          const nowDate = new Date()
          const lastYear = new Date()
          return time.getTime() > nowDate.setMonth(nowDate.getMonth()) || time.getTime() < lastYear.setYear(lastYear.getFullYear() - 1);
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      tradeReportInfo: {},
      typeCodeObj: {}
    };
  },
  mounted() {
    console.log(getDate());
    this.search();
    this.typeCodeFilter();
  },
  methods: {
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
    query() {
      this.currentPage = 1;
      this.search();
    },
    // 渠道过滤
    transChannelFilter(val) {
      switch (val) {
        case 'WEB':
          return '網上銀行';
        case 'APP':
          return '手機銀行';
        default:
          return '電子銀行';
      }
    },
    typeCodeFilter() {
      this.typeCodeList.forEach(
        item => (this.typeCodeObj[item.value] = item.typeCode)
      );
      console.log(this.typeCodeObj, 'this.typeCodeObj');
    },
    // 查询
    async search() {
      this.showIndex = true;
      const params = {
        size: this.pageSize,
        current: this.currentPage,
        ...this.queryData
      };
      const { body = '' } = await tradeStatistics(params);
      if (body) {
        this.tradeReportInfo = {};
        this.tableData = [];
        if (body.webReportInf) {
          this.tableData = this.tableData.concat(
            this.pushData(body.webReportInf)
          );
        }
        if (body.appReportInf) {
          this.tableData = this.tableData.concat(
            this.pushData(body.appReportInf)
          );
        }
        if (body.cibsReportInf) {
          this.tradeReportInfo = body.cibsReportInf.tradeReportInfo;
          this.tableData = this.tableData.concat(
            this.pushData(body.cibsReportInf)
          );
        }
      }
    },
    pushData(item) {
      console.log(item);
      return [
        ...item.customerList,
        ...item.accountList,
        ...item.nonFinancialList,
        ...item.numAccList,
        ...item.financialList,
        ...item.cnyTradeList
      ];
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    // 改变页面条数
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.currentPage = 1;
    //   this.search();
    // },
    // 改变页码
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.search();
    // },
    // 下载
    async downLoad() {
      const result = await tradeStatisticsDownload(this.queryData);
      if (result) {
        console.log(result);
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
    flex-direction: column;
    align-items: flex-end;
    // margin-top: 32px;
    padding: 32px 20px 20px;
  }
  .detail {
    color: #e34141;
    text-decoration: underline;
    cursor: pointer;
  }
  .middle {
    margin-left: 120px;
  }
  .right {
    margin-left: 180px;
  }
}
.transverse {
  margin-top: 20px;
  .row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    > div {
      padding: 10px 0 10px 10px;
    }
    > div:nth-child(1) {
      width: 500px;
    }
    > div:nth-child(2) {
      flex: 1;
    }
  }
}
</style>