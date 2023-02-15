<!-- 密码信封打印 -->
<template>
  <div class="contain">
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
      <el-form-item :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_UC`)">
        <el-input
          class="g-w-270"
          v-model="queryData.userCode"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <!-- 查询日期 -->
      <el-form-item v-show="!isClickBatchCode" :label="$t('CUSTOMER_MANAGEMENT.PRINT_PASS_DATE')">
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
      <!-- 打印序号 -->
      <el-form-item
        v-show="isBatchDetail && isClickBatchCode"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PBCN`)"
      >
        <el-input
          class="g-w-270"
          v-model="queryData.printBatchNo"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <!-- 打印状态 -->
      <el-form-item
        v-show="isBatchDetail && isClickBatchCode"
        :label="$t('CUSTOMER_MANAGEMENT.PRINT_PASS_PPS')"
      >
        <el-select
          class="g-w-270"
          v-model="queryData.printPwdStatus"
          :placeholder="$t(`CUSTOMER_MANAGEMENT.SELECT`)"
        >
          <el-option
            v-for="item in bizStatusList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <div style="width:270px;">
          <div style="float:right">
            <!-- 正常查询 -->
            <el-button
              class="query"
              type="primary"
              v-show="!isClickBatchCode"
              @click="search(1)"
            >{{ $t('COMMON.SEARCH')}}</el-button>
            <!-- 批次查询 -->
            <el-button
              class="query"
              type="primary"
              v-show="isClickBatchCode"
              @click="search(2)"
            >{{ $t('COMMON.SEARCH')}}</el-button>
            <el-button class="reset" @click="handleReset">{{ $t('COMMON.RESET') }}</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 批次号维度 -->
    <el-table
      class="g-table"
      :data="BatchData"
      v-show="!isBatchDetail"
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
          <el-radio :label="scope.$index" v-model="radio" @change="getCurrentRow(scope.row)">{{''}}</el-radio>
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
      <!-- 已打印笔数 -->
      <el-table-column
        prop="printedNum"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PRINTEDNUM`)"
        width="140"
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
      class="g-table"
      :data="BatchDetailData"
      v-show="isBatchDetail"
      @selection-change="handleSelectionChange"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column type="selection" width="80"></el-table-column>
      <!-- 团队编号/客户号 -->
      <el-table-column
        prop="ebankCstmNo"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_EBCN`)"
        width="240"
      ></el-table-column>
      <!-- 用户编号/CRN -->
      <el-table-column prop="userCode" :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_UC`)" width="140"></el-table-column>
      <!-- 批次号 -->
      <el-table-column
        v-show="!isBatchDetail"
        prop="printBatchCode"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PBC`)"
        min-width="130"
      ></el-table-column>
      <!-- 打印序号 -->
      <el-table-column
        prop="printBatchNo"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PBCN`)"
        min-width="180"
      ></el-table-column>
      <!-- 打印状态 -->
      <el-table-column
        prop="printPwdStatus"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PPS`)"
        width="120"
      >
        <template v-slot="{ row }">
          {{
          bizStatusList.find(item => item.value === row.printPwdStatus) ? bizStatusList.find(item => item.value === row.printPwdStatus).label : ''
          }}
        </template>
      </el-table-column>
      <!-- 打印次数 -->
      <el-table-column
        prop="printNum"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_PASS_PRINTNUM`)"
        min-width="180"
      ></el-table-column>
      <!-- 最后打印时间 -->
      <el-table-column
        prop="printPwdDate"
        :label="$t(`CUSTOMER_MANAGEMENT.PRINT_END_DATE`)"
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
      v-show="!isBatchDetail"
      @click="init"
    >{{ $t('CUSTOMER_MANAGEMENT.PRINT_PASS_REFRESH') }}</el-button>
    <el-button
      class="reset"
      v-show="isBatchDetail"
      @click="bankFun"
    >{{ $t('CUSTOMER_MANAGEMENT.BACK') }}</el-button>
    <el-button
      class="reset"
      @click="printTestFun"
    >{{ $t('CUSTOMER_MANAGEMENT.PRINT_PASS_PRINTTEST') }}</el-button>
  </div>
</template>

<script>
import {
  queryPrintBatchPage,
  queryPrintBatchDetailPage,
  printPINMailTest,
  batchPrintPINMail
} from '@/api/customer-management/user';
import dateTools from '@/utils/dateTools';
import CONSTANTS from '@/utils/constant.js';

const { PPS_STATUS_LIST } = CONSTANTS;

export default {
  name: 'CustomerEnvelopePrint',

  data() {
    const _self = this;

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
      radio: -1, //是否单选选中
      queryData: {
        ebankCstmNo: '', //团体编号
        userCode: '', //用户编号
        printBatchCode: '', //批次号
        printBatchNo: '', //打印序号
        printPwdStatus: '', //密码信封打印状态 0-未打印 1已打印
        startDate: '',
        endDate: ''
      },
      pages: {
        //分页公用
        current: 1,
        size: 10,
        total: 0
      }, //打印公用
      queryTest: {
        batchCode: '',
        operator: '',
        userCodeList: []
      },
      isBatchDetail: false, //是否进入内部列表页
      isClickBatchCode: false, // 是否点击批次号进入
      BatchData: [], //批次号维度返回内容
      BatchDetailData: [], // 正常列表查询维度返回内容
      submitTime: '', //查询日期
      bizStatusList: PPS_STATUS_LIST,
      btnCode: '' //暂存刚刚进去的批次号
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    // 初始化---------------start
    init() {
      let params = {
        current: this.pages.current,
        size: this.pages.size,
        printType:'0'
      };
      queryPrintBatchPage(params).then(({ body }) => {
        this.BatchData = body.records;
        this.pages.total = body.total;
      });
    },
    // 初始化---------------end

    // 查询重置---------------start
    //查询
    search(val) {
      let self = this;
      if (val === 1) {
        if (
          this.queryData.ebankCstmNo === '' &&
          this.queryData.userCode === '' &&
          this.submitTime === ''
        ) {
          this.$showMsg({
            type: 'error',
            message: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_QUERYNULL')
          });
        } else {
          self.isClickBatchCode = false;
          self.query = {
            batchCode: '',
            operator: '',
            userCodeList: []
          };
          this.queryPrintBatchDetailPageFun();
        }
      } else if (val === 2) {
        self.queryData.printBatchCode = self.btnCode;
        self.isClickBatchCode = true;
        this.queryPrintBatchDetailPageFun();
      }
    },
    queryPrintBatchDetailPageFun() {
      this.BatchDetailData = [];
      this.isBatchDetail = true;
      let params = {
        ebankCstmNo: this.queryData.ebankCstmNo, //团体编号
        userCode: this.queryData.userCode, //用户编号
        printBatchCode: this.queryData.printBatchCode, //批次号
        printBatchNo: this.queryData.printBatchNo, //打印序号
        printPwdStatus: this.queryData.printPwdStatus, //密码信封打印状态 0-未打印 1已打印
        startDate: this.submitTime[0],
        endDate: this.submitTime[1],
        size: this.pages.size,
        current: this.pages.current,
        printType:'0'
      };
      queryPrintBatchDetailPage(params).then(resp => {
        this.BatchDetailData = resp.body.records;
        this.pages.total = resp.body.total;
      });
    },
    // 查询重置---------------end
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

    // 单选框
    getCurrentRow(row) {
      this.queryTest.batchCode = row.batchCode;
    },
    // 多选框
    handleSelectionChange(val) {
      let arr = [];
      arr = val.map(item => {
        return item.userCode;
      });
      this.queryTest.userCodeList = arr;
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
      this.isClickBatchCode = true;
      this.isBatchDetail = true;
      this.btnCode = row.batchCode;
      this.pages = {
        current: 1,
        size: 10,
        total: 0
      };
      this.queryPrintBatchDetailPageFun();
    },

    //切换每页显示条数
    handleSizeChange(val) {
      let batchType = ''; //批次号是2，正常是1
      if (!this.isClickBatchCode) {
        batchType = 1;
      } else {
        batchType = 2;
      }
      this.pages.size = val;
      this.pages.current = 1;
      if (this.isBatchDetail) {
        this.search(batchType);
      } else {
        this.init();
      }
    },

    //切换当前页
    handleCurrentChange(val) {
      let batchType = ''; //批次号是2，正常是1
      if (!this.isClickBatchCode) {
        batchType = 1;
      } else {
        batchType = 2;
      }
      this.pages.current = val;
      if (this.isBatchDetail) {
        this.search(batchType);
      } else {
        this.init();
      }
    },

    // 底部按钮-----------------start
    //打印
    printFun() {
      // 先判断是否在detail页
      // 在判断是否是点击批次号进来的
      if (this.radio < 0 && !this.isBatchDetail) {
        this.$showBox({
          content: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_ISRADIO'),
          showCancelButton: false
        });
        return;
      }
      if (this.queryTest.userCodeList.length == 0 && this.isBatchDetail) {
        this.$showBox({
          content: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_ISDETAILS'),
          showCancelButton: false
        });
        return;
      }
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.PRINT_PASS_ALERTREADY'),
        confirm: () => {
          this.batchPrintPINMailFun();
        },
        cancel: () => {}
      });

      //补充逻辑
      //请确认打印纸张是否已经准备好   取消隐藏，确认-开始打印
    },
    batchPrintPINMailFun() {
      let params = {
        ...this.queryTest
      };
      if (!this.isBatchDetail) {
        params.userCodeList = []
        params.a = []
      }
      batchPrintPINMail(params).then(({ body }) => {
        let type = '';
        let msg = '';
        if (body.failCode == 'SUCCESS') {
          type = 'success';
          msg = body.failReason+'。共打印'+body.total+'筆，成功'+body.successNum+'筆，失败'+body.failNum+'筆'
        } else {
          type = 'error';
          msg = body.failReason+'。共打印'+body.total+'筆，成功'+body.successNum+'筆，失败'+body.failNum+'筆'

        }
      this.$showBox({
        content: msg,
        confirm: () => {},
        cancel: () => {}
      });
      });
    },
    //重置
    handleReset() {
      this.queryData = {
        ebankCstmNo: '',
        userCode: '',
        printBatchNo: '',
        printPwdStatus: '',
        startDate: '',
        endDate: ''
      };
      this.submitTime = '';
      if (this.isBatchDetail) {
        // this.search();
      } else {
        this.init();
      }
    },
    //打印测试
    printTestFun() {
      printPINMailTest().then(({ body }) => {
        let type = '';
        if (body.failCode == 'SUCCESS') {
          type = 'success';
        } else {
          type = 'error';
        }
        this.$showMsg({
          type: type,
          message: body.failReason
        });
      });
    },
    //返回
    bankFun() {
      this.isBatchDetail = false;
      this.isClickBatchCode = false;
      this.queryTest = {
        batchCode: '',
        operator: '',
        userCodeList: []
      };
      this.pages = {
        current: 1,
        size: 10,
        total: 0
      };
      this.btnCode = '';
      this.radio = -1;
      this.handleReset();
    }
    // 底部按钮-----------------end
  }
};
</script>

<style lang="scss" scoped>
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
