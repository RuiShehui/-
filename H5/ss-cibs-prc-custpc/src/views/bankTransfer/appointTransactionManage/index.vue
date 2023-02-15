<!-- 预约交易管理 列表-->
<template>
  <div class="appoint-transaction-container" v-loading="requestLoading">
    <div v-if="showListFlag" class="mb20">
      <!-- el-form start -->
      <!-- 交易类型 -->
      <el-form :model="queryForm" ref="queryForm" label-suffix=":">
        <div class="inline-block">
          <el-form-item
            :label="$t('APPOINTTRACTION.TRANS_TYPE')"
            prop="bsnCode"
            class="inline-block mr40 mb24"
            label-width="80px"
          >
            <el-select v-model="queryForm.bsnCode">
              <el-option
                v-for="(item,index) in transferTypeList"
                :label="item.typeName"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 预约处理日期 -->
          <el-form-item
            style="display: flex;"
            :label="$t('PAYMENT.RESPOS_HANDLE_DATE')"
            class="sel-data"
          >
            <el-form-item>
              <el-date-picker
                class="picker"
                v-model="scheduleDateStart"
                @change="changeDateTime"
                value-format="yyyyMMdd"
                :clearable="false"
                range-separator
              ></el-date-picker>
              <span class="line">-</span>
              <el-date-picker
                v-model="scheduleDateEnd"
                @change="changeDateTime"
                value-format="yyyyMMdd"
                :clearable="false"
                range-separator
              ></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
        <div class="inline-block ml32 mb24">
          <v-button
            size="w70"
            @click="handlerReset"
            class="mr16 inline-block"
          >{{ $t('COMMON.RESET') }}</v-button>
          <v-button
            size="w96"
            @click="handlerQuery"
            type="primary"
            class="inline-block"
          >{{ $t('COMMON.SEARCH') }}</v-button>
        </div>
      </el-form>
      <!-- el-form end -->
      <!-- el-tabel start -->
      <el-table :data="record" stripe style="width:100%;" class="mb16">
        <!-- 参考编号 -->
        <el-table-column :label="$t('BILLPAYMENT.ONLINE_BANKING_SERIAL_NUMBER')" width="220">
          <template slot-scope="scope">
            <span
              style="color:#4181fa;cursor: pointer;"
              @click="handlerToDetail(scope.row, 'detail')"
            >{{scope.row.flowNo}}</span>
          </template>
        </el-table-column>
        <!-- 交易类型 -->
        <el-table-column prop="businessCode" :label="$t('APPOINTTRACTION.TRANS_TYPE')" width="200">
          <template v-slot="{row}">{{ transTypeFilter(row.businessCode) }}</template>
        </el-table-column>
        <!-- 金额 -->
        <el-table-column prop="amount" :label="$t('AUTHORIZE.amountDebited')" width="150">
          <template v-slot="{row}">{{row.ccy | ccyFilter}}  {{row.amount | | formatMoneyNew}}</template>
        </el-table-column>
        <!-- 预约处理日期 -->
        <el-table-column prop="valueDate" :label="$t('PAYMENT.RESPOS_HANDLE_DATE')" width="150"></el-table-column>
        <!-- 提交日期 -->
        <el-table-column prop="createTime" :label="$t('APPOINTTRACTION.SUBMIT_TIME')" width="150">
          <template v-slot="{row}">{{ timeFormat(row.createTime) }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('ACCOUNT_MANAGEMENT.OPERATION')" class="flexsb" width="170">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              size="w70"
              @click="handlerToDetail(scope.row, 'change')"
              type="text"
              class="u-tableBtn"
            >{{ $t('COMMON.UPDATE') }}</el-button>
            <!-- 取消 -->
            <el-button
              size="w70"
              @click="handlerCancel(scope.row)"
              type="text"
              class="left-line u-tableBtn"
            >{{ $t('COMMON.CANCEL') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="hangdlerSizeChange"
        @current-change="handlerCurrentChange"
        :current-page="current"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="prev, pager, next, sizes, jumper"
        :total="total"
      ></el-pagination>
      <!-- el_tabel end -->
    </div>
    <div v-else>
      <transfer-detail-page
        v-if="['030101', '03010201', '03010202', '030103' ].includes(bsnCode)"
        :bsnCode="bsnCode"
        :jumpType="jumpType"
        :flowNo="flowNo"
        @clickBack="returnBack"
      ></transfer-detail-page>
      <bulk-collection-detail
        v-if="['03010401', '03010501'].includes(bsnCode)"
        :bsnCode="bsnCode"
        :jumpType="jumpType"
        :flowNo="flowNo"
        @clickBack="returnBack"
      ></bulk-collection-detail>
    </div>
  </div>
</template>

<script>
import TransferDetailPage from './pages/transferDetailPage';
import BulkCollectionDetail from './pages/bulkCollectionDetail';
import { softToken, choosesWay } from '@/components/messageBox';
import {
  transferListQuery,
  updateScheduleDateSubmit
} from '@/api/reservationTransaction';
import tools from '@/dataTools/tools';
import filters from '@/filters/accountManagement';
import { formatMoneyNew } from '@/utils/tools';
const { getYMD } = tools;
import { mapState } from 'vuex';
export default {
  name: 'AppointTransactionManage',
  components: {
    TransferDetailPage,
    BulkCollectionDetail
  },
  filters:{
    ...filters,
    formatMoneyNew:formatMoneyNew
  },
  data() {
    const self = this;

    return {
      showListFlag: true,
      queryForm: {
        bsnCode: '', //交易类型
        scheduleDateStart: '', //开始时间
        scheduleDateEnd: '' //结束时间
      },
      scheduleDateStart: '', //预约处理日期
      scheduleDateEnd: '',
      transferTypeList: [
        { typeName: self.$t('COMMON.TOTAL'), value: '' },
        {
          typeName: self.$t('APPOINTTRACTION.CHATS_TRANSFER'),
          value: '03010202'
        },
        {
          typeName: self.$t('APPOINTTRACTION.TELEGRAPHIC_TRANSFER'),
          value: '030103'
        },
        {
          typeName: self.$t('APPOINTTRACTION.BATCH_TRANSFER'),
          value: '03010401'
        },
        {
          typeName: self.$t('APPOINTTRACTION.BATCH_PAYDAY'),
          value: '03010501'
        },
        // {
        //   typeName: self.$t('APPOINTTRACTION.BATCH_COLLECT'),
        //   value: '03020101'
        // }
      ],
      record: [],
      pickerOption: {
        disabledDate(time) {
          let maxTime = Date.now() + 180 * 24 * 3600 * 1000;
          return (
            time.getTime() + 24 * 3600 * 1000 < new Date() ||
            time.getTime() > maxTime
          );
        }
      },
      bsnCode: '', //交易类型
      jumpType: '', //跳转详情类型 detail-详情 change-修改
      total: 0,
      current: 1,
      pageSize: 10,
      flowNo: '',
      detailsObj: {}
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  watch: {},
  created() {
    this.transferListQuery();
  },
  methods: {
    async transferListQuery() {
      let params = {
        current: this.current,
        size: this.pageSize,
        ...this.queryForm
      };
      console.log('params====>', params);
      const result = await transferListQuery(params);
      if (result) {
        this.record = result.records;
        this.total = result.total;
      }
    },
    // 重置
    handlerReset() {
      this.$refs.queryForm.resetFields();
      this.scheduleDateStart = '';
      this.scheduleDateEnd = '';
      this.queryForm.scheduleDateStart = '';
      this.queryForm.scheduleDateEnd = '';
    },
    // 查询
    handlerQuery() {
      this.current = 1;
      this.transferListQuery();
    },
    // 详情 修改
    async handlerToDetail(val, type) {
      this.flowNo = val.flowNo;
      this.jumpType = type;
      this.bsnCode = val.businessCode;
      this.showListFlag = false;
      let result = '';
    },
    // 取消
    handlerCancel(val) {
      this.$confirm({
        title: '',
        isIcon: true,
        type: 'warn',
        message: this.$t('APPOINTTRACTION.CANCEL_TRANCE'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      })
        .then(async () => {
          console.log(getYMD(new Date()), 'newDate');
          if (val.valueDate === getYMD(new Date())) {
            return this.$message({
              type: 'fail',
              message: this.$t('APPOINTTRACTION.CANNOT_CANCEL')
            });
          }
          this.onConfirm(val);
          
        })
        .catch(() => {
          console.log('cancel');
        });
    },
    onConfirm(val) {
      let params = {
        lastScheduleDate: val.valueDate,
        updateFlowNO: val.flowNo,
        bsnCode: val.businessCode,
        opType: '1' //0修改1取消
      };
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      updateScheduleDateSubmit(params).then(({ body = {}, head = {} }) => {
        const tradeInfo = JSON.stringify(params);
        if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
          }).then(() => {
            this.onConfirm(val);
          });
        } else if (head.returnCode == 'OTP000107' && entType == '1') {
          softToken({
            softTokenCode: '',
            otpType: '0303',
            tradeInfo: {...val, operationType: '3'}
          }).then(() => {
            this.onConfirm(val);
          });
        } else {
          if (body) {
            const { authResultInfo = {} } = body;
            this.$message({
              message: this.messageFilter(authResultInfo.authResultState),
              type: authResultInfo.authResultState === '91' ? 'fail' : 'success'
            });
            this.transferListQuery();
          }
        }
      });
      // this.transferListQuery();
    },
    messageFilter(val) {
      switch (val) {
        case '91':
          return this.$t('COMMON.SUBMIT_FAIL');
        case '03':
          return this.$t('BILLPAYMENT.SUBMIT_SUCCESS');
        default:
          return this.$t('COMMON.SUBMIT_SUCCESS');
      }
    },
    // 返回
    returnBack() {
      this.showListFlag = true;
    },
    // 时间选择
    changeDateTime(val) {
      console.log('val==>', val);
      this.queryForm.scheduleDateStart = this.scheduleDateStart;
      this.queryForm.scheduleDateEnd = this.scheduleDateEnd;
      this.$forceUpdate();
    },
    // 交易类型过滤
    transTypeFilter(trans) {
      switch (trans) {
        case '030101':
          return this.$t('PAYMENT.INNER_TRANSFER');
        case '030102':
          return this.$t('APPOINTTRACTION.LOCAL_INTERBANK');
        case '030103':
          return this.$t('APPOINTTRACTION.TELEGRAPHIC_TRANSFER');
        case '03010201':
          return this.$t('APPOINTTRACTION.FPS_TRANSFEP');
        case '03010202':
          return this.$t('APPOINTTRACTION.CHATS_TRANSFER');
        case '03010401':
          return this.$t('APPOINTTRACTION.BATCH_TRANSFER');
        case '03010501':
          return this.$t('APPOINTTRACTION.BATCH_PAYDAY');
        case '03020101':
          return this.$t('APPOINTTRACTION.BATCH_COLLECT');
      }
    },
    // 時間處理
    timeFormat(time) {
      return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}`;
    },
    hangdlerSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.transferListQuery();
    },
    handlerCurrentChange(current) {
      this.current = current;
      this.transferListQuery();
    }
  }
};
</script>

<style lang="scss" scoped>
.appoint-transaction-container {
  /deep/.el-date-editor--daterange.el-input__inner {
    width: 230px;
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    .el-range-input:nth-of-type(2) {
      margin-left: 0;
    }
  }
  /deep/.el-form-item {
    margin-bottom: 24px;
    .el-form-item__label {
      padding-top: 7px;
      padding-bottom: 7px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      font-size: 14px;
    }
    .el-form-item__content {
      line-height: 36px;
    }
  }
  /deep/.el-table {
    &::before {
      height: 0;
    }
    .el-table__fixed-right::before {
      height: 0;
    }
    .el-table__cell {
      border-bottom: none;
      .cell {
        padding-left: 24px !important;
        padding-right: 24px !important;
        .el-button + .el-button {
          margin-left: 16px;
        }
      }
    }
  }
  .left-line {
    position: relative;
    &::before {
      position: absolute;
      content: '';
      left: -10px;
      top: 11px;
      width: 1px;
      height: 12px;
      background-color: #f0f0f0;
    }
  }
}
.el-table .cell .el-button,
.el-table th > .cell .el-button {
  height: auto;
}
.appoint-transaction-container .left-line::before {
  position: absolute;
  content: '';
  left: -10px;
  top: 2px;
  width: 1px;
  height: 12px;
  background-color: #f0f0f0;
}
.inline-block {
  display: flex;
}
.picker {
  margin-bottom: 16px;
}
.appoint-transaction-container .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 140px !important
}
.line{
  margin: 0 10px;
}
</style>