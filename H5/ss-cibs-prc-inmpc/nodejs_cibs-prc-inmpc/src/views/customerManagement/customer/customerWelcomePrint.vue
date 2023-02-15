<!-- 欢迎信封打印 -->
<template>
  <div class="g-quota">
    <main class="u-tabs">
      <el-tabs @tab-click="handleSwitchTab" v-model="activeName">
        <el-tab-pane :label="$t(`MENU_PAGE_ITEMS.ENTERPRISR_WELCOME_PRINT`)" name="1"></el-tab-pane>
        <el-tab-pane :label="$t(`MENU_PAGE_ITEMS.USER_WELCOME_PRINT`)" name="2"></el-tab-pane>
      </el-tabs>
    </main>
    <div class="contain">
      <!-- 查询 -->
      <el-form class="transverse-form" label-width="auto" ref="formRef" :model="queryData">
        <el-form class="transverse-form" label-width="auto" ref="formRef" :model="queryData">
          <!-- 客户编号 -->
          <el-form-item :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_EBCN`)">
            <el-input
              class="g-w-270"
              v-model="queryData.ebankCstmNo"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            ></el-input>
            <!-- 用户编号 -->
          </el-form-item>
          <el-form-item
            v-show="this.showType !== '1'"
            :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_U`)"
          >
            <el-input
              class="g-w-270"
              v-model="queryData.userCode"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            ></el-input>
          </el-form-item>
          <!-- 查询日期 -->
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.PRINT_PASS_DATE')">
            <el-date-picker
              class="g-w-270"
              v-model="submitTime"
              type="daterange"
              unlink-panels
              :clearable="false"
              :range-separator="$t('AUTHORIZATION_CENTER.TO')"
              :start-placeholder="$t('AUTHORIZATION_CENTER.START_DATE')"
              :end-placeholder="$t('AUTHORIZATION_CENTER.END_DATE')"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="selectDate"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label=" ">
            <div style="width:270px;">
              <div style="float:right">
                <!-- 外部查询 -->
                <el-button
                  v-show="this.showType === '1' || this.showType === '2'"
                  class="query"
                  type="primary"
                  @click="search(1)"
                >{{ $t('COMMON.SEARCH')}}</el-button>
                <!-- 内部查询 -->
                <el-button
                  v-show="this.showType === '3'"
                  class="query"
                  type="primary"
                  @click="search(2)"
                >{{ $t('COMMON.SEARCH')}}</el-button>
                <el-button class="reset" @click="handleReset">{{ $t('COMMON.RESET') }}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-form>
      <!-- 批次号维度 -->
      <el-table
        v-show="this.showType === '2'"
        class="g-table"
        :data="BatchData"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <!-- 单选框 -->
        <el-table-column label width="100">
          <template slot-scope="scope">
            <el-radio
              :label="scope.$index"
              v-model="radio"
              @change="getCurrentRow(scope.row)"
            >{{''}}</el-radio>
          </template>
        </el-table-column>
        <!-- 批次号 -->
        <el-table-column
          prop="batchCode"
          :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PBC`)"
          width="290"
        >
          <template slot-scope="scope">
            <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.batchCode }}</div>
          </template>
        </el-table-column>
        <!-- 总比数 -->
        <el-table-column
          prop="batchNum"
          :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_NUM`)"
          width="240"
        ></el-table-column>
        <div slot="empty" class="g-empty">
          <img src="@/img/table-empty.png" alt />
          <span>
            {{
            $t(`AUTHORIZATION_CENTER.NOT_SUBMITTED_BY_ME`)
            }}
          </span>
        </div>
      </el-table>
      <!-- 正常维度 -->
      <el-table
        v-show="this.showType === '1' ||this.showType === '3' "
        class="g-table"
        :data="BatchDetailData"
        @selection-change="handleSelectionChange"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column
          v-if="this.showType === '1'"
          prop="createTime"
          :label="$t(`RAO_CHECK.DATE`)"
          width="240"
        ></el-table-column>
        <!-- 团队编号/客户号 -->
        <el-table-column
          v-if="this.showType === '1' || this.showType === '3'"
          prop="ebankCstmNo"
          :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_EBCN`)"
          width="240"
        ></el-table-column>
        <el-table-column
          v-if="this.showType === '3'"
          prop="userCode"
          :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_UC`)"
          width="140"
        ></el-table-column>
        <!-- 批次号 -->
        <el-table-column
          v-if="this.showType === '3'"
          prop="printWlcmBatchCode"
          :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PBC`)"
          min-width="130"
        ></el-table-column>
        <div slot="empty" class="g-empty">
          <img src="@/img/table-empty.png" alt />
          <span>
            {{
            $t(`AUTHORIZATION_CENTER.NOT_SUBMITTED_BY_ME`)
            }}
          </span>
        </div>
      </el-table>
      <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page.sync="pages.current"
          :page-size="pages.size"
          :total="pages.total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)"
        />
      </div>
      <el-button
        class="query"
        type="primary"
        @click="printFun"
      >{{ $t('CUSTOMER_MANAGEMENT.PRINT_PASS_PRINT') }}</el-button>
      <el-button
        class="reset"
        v-show="this.showType !== '3'"
        @click="refreshFun"
      >{{ $t('CUSTOMER_MANAGEMENT.PRINT_PASS_REFRESH') }}</el-button>
      <el-button
        class="reset"
        v-show="this.showType === '3'"
        @click="bankFun"
      >{{ $t('CUSTOMER_MANAGEMENT.BACK') }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  queryWclmPrintBatchPage,
  queryPrintBatchDetailPage,
  batchPrintPINMail,
  queryMerchantWclmPage,
  batchDownloadFile,
  batchDownloadMerchantFile
} from '@/api/customer-management/user';
import dateTools from '@/utils/dateTools';
import CONSTANTS from '@/utils/constant.js';

const { PPS_STATUS_LIST } = CONSTANTS;
export default {
  name: 'CustomerWelcomePrint',
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 1 * 365 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          var thatDay = time.getTime();
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      activeName: '1',
      showType: '1', //个人1，用户批次2，用户详情3
      queryData: {
        ebankCstmNo: '', //团体编号
        userCode: '', //用户编号
        printBatchCode: '', //批次号
        startDate: '',
        endDate: ''
      },
      queryTest: {
        batchCode: '',
        operator: '',
        userCodeList: [],
        url: []
      },
      pages: {
        //分页公用
        current: 1,
        size: 10,
        total: 0
      },
      bizStatusList: PPS_STATUS_LIST,
      radio: -1, //是否单选选中
      submitTime: '', //查询日期
      BatchData: [], //批次号维度返回内容
      BatchDetailData: [], // 正常列表查询维度返回内容
      btnCode: '' //暂存刚刚进去的批次号
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    // 切换导航栏
    handleSwitchTab(tab, eve) {
      this.pages = {
        current: 1,
        size: 10,
        total: 0
      };
      this.queryData = {
        ebankCstmNo: '', //团体编号
        userCode: '', //用户编号
        printBatchCode: '', //批次号
        startDate: '',
        endDate: ''
      };
      this.queryTest = {
        batchCode: '',
        operator: '',
        userCodeList: [],
        url: []
      };
      this.radio = -1;
      if (tab.name === '1') {
        this.showType = '1';
        this.queryMerchantWclmPageFun();
      } else if (tab.name === '2') {
        this.showType = '2';
        this.queryWclmPrintBatchPageFun();
      }
      console.log('tab', tab);
      console.log('eve', eve);
    },
    // 初始化
    init() {
      this.queryTypeFun();
    },

    //选择时间
    selectDate([startTime, endTime]) {
      //判断时间段是否超过90天
      const { getGapDay } = dateTools;
      let days = getGapDay(startTime, endTime);
      if (days > 90) {
        this.submitTime = '';
        this.$showBox({
          content: this.$t(`COMMON.QUERY_INTERVAL`)
        });
      }
    },
    // 查询
    search(val) {
      console.log(val, this.showType);
      if (this.showType === '1') {
        if (this.queryData.ebankCstmNo === '' && this.submitTime === '') {
          this.$showMsg({
            type: 'error',
            message: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_QUERYNULL')
          });
          return;
        }
      }
      if (this.showType === '2' || this.showType === '3') {
        console.log('jinlailewei');
        if (
          this.queryData.ebankCstmNo === '' &&
          this.queryData.userCode === '' &&
          this.submitTime === ''
        ) {
          this.$showMsg({
            type: 'error',
            message: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_QUERYNULL')
          });
          return;
        }
      }
      if (this.showType === '2' && val === 1) {
        console.log('123123123');
        this.showType = '3';
      }
      this.queryTypeFun();
      console.log('会不会到结尾', this.queryData);
    },
    //重置
    handleReset() {
      this.queryData = {
        ebankCstmNo: '',
        userCode: '',
        startDate: '',
        endDate: ''
      };
      this.submitTime = '';
    },
    // 列表操作
    // 单选框
    getCurrentRow(row) {
      console.log('getCurrentRow----row', row);
      this.queryTest.batchCode = row.batchCode;
    },
    //批次号详情
    handleCell(row) {
      this.queryData = {
        ebankCstmNo: '',
        userCode: '',
        printBatchNo: '',
        printPwdStatus: '',
        startDate: '',
        endDate: ''
      };
      this.submitTime = '';
      this.queryData.printBatchCode = row.batchCode;
      this.queryTest.batchCode = row.batchCode;
      this.btnCode = row.batchCode;
      this.pages = {
        current: 1,
        size: 10,
        total: 0
      };
      this.showType = '3';
      this.queryPrintBatchDetailPageFun();
    },
    // 多选框
    handleSelectionChange(val) {
      console.log('handleSelectionChange----row', val);
      let arr = [];
      if (this.showType === '1') {
        arr = val.map(item => {
          return item.ebankCstmNo;
        });
      } else if (this.showType === '3') {
        arr = val.map(item => {
          return item.userCode;
        });
      }

      this.queryTest.userCodeList = arr;
    },
    //切换每页显示条数
    handleSizeChange(val) {
      this.pages.size = val;
      this.pages.current = 1;
      this.queryTypeFun();
    },
    //切换当前页
    handleCurrentChange(val) {
      this.pages.current = val;
      this.queryTypeFun();
    },
    // 底部--------------btn
    //打印
    printFun() {
      if (this.showType === '1' || this.showType === '3') {
        if (this.queryTest.userCodeList.length === 0) {
          this.$showBox({
            content: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_ISDETAILS'),
            showCancelButton: false
          });
          return;
        } else {
          console.log('this.queryTest----usercode', this.queryTest);
          this.batchDownloadFileFun();
        }
      }
      if (this.showType === '2') {
        this.queryTest.url = [];
        console.log('this.radio', this.radio);
        if (this.radio === -1) {
          this.$showBox({
            content: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_ISRADIO'),
            showCancelButton: false
          });
          return;
        } else {
          // batchCode: "20220823001"
          console.log('批次號', this.queryTest.batchCode);
          this.batchDownloadFileFun();
        }
      }
    },
    //打印PDF
    //function
    batchDownloadFileFun() {
      if (this.showType === '1') {
        batchDownloadMerchantFile({
          userCodeList: this.queryTest.userCodeList
        }).then(({ body }) => {
          console.log('body', body);
          if (body.url) {
            this.printPDFFun(body.url);
          }
        });
      } else if (this.showType === '2') {
        batchDownloadFile({
          batchCode: this.queryTest.batchCode
        }).then(({ body }) => {
          console.log('body', body);
          if (body.url) {
            this.printPDFFun(body.url);
          }
        });
      } else if (this.showType === '3') {
        batchDownloadFile({
          userCodeList: this.queryTest.userCodeList
        }).then(({ body }) => {
          console.log('body', body);
          if (body.url) {
            this.printPDFFun(body.url);
          }
        });
      }
    },
    //打印PDF
    printPDFFun(url) {
      let filePath = url + '&preview=pdf';
      let iframe = document.createElement('iframe');
      iframe.style.border = '0px';
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.hright = '0px';
      iframe.style.right = '0px';
      iframe.style.top = '0px';
      iframe.setAttribute('src', filePath);
      iframe.onload = () => {
        iframe.contentWindow.print();
      };
      document.body.append(iframe);
    },
    // 刷新
    refreshFun() {
      this.queryTypeFun();
    },
    // 返回
    bankFun() {
      this.showType = '2';
    },
    //三个请求方法
    queryTypeFun() {
      if (this.showType === '2') {
        this.queryWclmPrintBatchPageFun();
      } else if (this.showType === '3') {
        this.queryPrintBatchDetailPageFun();
      } else if (this.showType === '1') {
        this.queryMerchantWclmPageFun();
      }
    },
    queryMerchantWclmPageFun() {
      console.log('queryData', this.queryData);
      let params = {
        current: this.pages.current,
        size: this.pages.size,
        ebankCstmNo: this.queryData.ebankCstmNo,
        endDate: this.submitTime[1],
        startDate: this.submitTime[0]
      };
      queryMerchantWclmPage(params).then(({ body }) => {
        this.BatchDetailData = body.records;
        this.pages.total = body.total;
      });
    },
    queryWclmPrintBatchPageFun() {
      let params = {
        current: this.pages.current,
        size: this.pages.size,
        printType: '1'
      };
      queryWclmPrintBatchPage(params).then(({ body }) => {
        this.BatchData = body.records;
        this.pages.total = body.total;
      });
    },
    queryPrintBatchDetailPageFun() {
      this.BatchDetailData = [];
      let params = {
        ebankCstmNo: this.queryData.ebankCstmNo, //团体编号
        userCode: this.queryData.userCode, //用户编号
        printBatchCode: this.queryData.printBatchCode, //批次号
        printBatchNo: this.queryData.printBatchNo, //打印序号
        startDate: this.submitTime[0],
        endDate: this.submitTime[1],
        size: this.pages.size,
        current: this.pages.current,
        printType: '1'
      };
      queryPrintBatchDetailPage(params).then(resp => {
        this.BatchDetailData = resp.body.records;
        this.pages.total = resp.body.total;
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.g-quota {
  padding: 32px 24px;
  box-sizing: border-box;
  background: #fff;
  min-height: 100%;
  position: relative;
}
.u-tabs {
  /deep/ .el-tabs__item {
    text-align: center;
    width: 138px;
    padding-left: 20px;
  }
  /deep/ .el-tabs__item.is-active,
  /deep/ .el-tabs__item:hover {
    color: #f06b00 !important;
  }
}
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-width: 600px;
  min-height: 100%;
  background: #fff;
}
/deep/ .el-table__empty-block {
  text-align: center;
  @media screen and (max-width: 1919px) {
    text-align: initial;
  }
}

/deep/ .el-table {
  width: auto;
}
.g-table {
  margin-top: 20px;
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 25%;
    left: 48%;
  }
}
.btn {
  cursor: pointer;
}
.g-bolck {
  text-align: right;
  margin: 40px 10px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
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
  span:nth-of-type(2) {
    margin-left: 10px;
    color: #f06b00;
  }
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
  .el-input {
    width: 270px;
  }
}
.g-w-270 {
  width: 270px;
}
</style>