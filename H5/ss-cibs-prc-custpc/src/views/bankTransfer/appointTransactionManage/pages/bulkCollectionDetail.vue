<!--预约交易管理 批量转账/批量发薪/自动收款  详情/预约修改页面-->
<template>
  <div class="bulk-collection-detail" v-loading="requestLoading">
    <div v-if="!changeResult">
      <!-- 修改 -->
      <div v-if="jumpType == 'change'">
        <!-- 预约修改 -->
        <title-tab :title="$t('PAYMENT.MODIFY_APPOINTMENT')" />
        <el-form
          ref="bankInfoForm"
          :model="bankInfoForm"
          label-width="200px"
          :rules="rules"
          class="formW_650 mb16"
        >
          <el-form-item :label="`${$t('PAYMENT.APPOINTMENT_DATE')}：`" prop="scheduleDate">
            <!-- 请选择预约处理日期 -->
            <el-date-picker
              v-model="bankInfoForm.scheduleDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{select:$t('PAYMENT.APPOINTMENT_DATE')})"
              :picker-options="option"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- 详情 -->
      <title-tab :title="$t('PAYMENT.DETAIL')" class="mb24" />
      <div class="m-detail">
        <div class="m-detail-content">
          <!-- 收款账户 -->
          <detail-item
            :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
            :content="
          `${formatAcctNo(detailsObj.creditAcct)} ${
            detailsObj.cur
          } ${getProcessType(detailsObj.creditAcctType)}`
        "
          ></detail-item>
          <!-- 手续费扣款账户 -->
          <detail-item
            :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
            :content="
          `${formatAcctNo(detailsObj.feeAcct)} ${
            detailsObj.cur
          } ${getProcessType(detailsObj.feeAcctType)}`
        "
          ></detail-item>
          <!-- 预约处理日期 -->
          <detail-item
            :title="$t('PAYMENT.APPOINTMENT_DATE')"
            :content="detailsObj.modifiedScheduleDate"
          ></detail-item>
          <!-- 预约处理 -->
          <detail-item
            v-if="bsnCode !== '03020101'"
            :title="$t('PAYMENT.APPOINTMENT_PROCESS')"
            :content="detailsObj.isSchedule|yesOrNo"
          ></detail-item>
          <!-- 总笔数 -->
          <detail-item
            :title="$t('PAYMENT.TOTAL_TRANS')"
            :content="`${detailsObj.tradeNumber}${$t('PAYMENT.TOTAL_TRANS')}`"
          ></detail-item>
          <!-- 重试扣账 -->
          <detail-item
            v-if="bsnCode !== '03020101'"
            :title="$t('PAYMENT.RETRY_DEDUCTION')"
            :content="detailsObj.isRetry|yesOrNo"
          ></detail-item>
          <!-- 手续费 -->
          <detail-item
            :title="$t('PAYMENT.CHARGE_CCY')"
            :content="`${detailsObj.cur}  ${detailsObj.serviceCharge}`"
          ></detail-item>
          <!-- 总金额 -->
          <detail-item :title="$t('PAYMENT.TOTAL_AMOUNT')" :content="`${detailsObj.cur}  ${detailsObj.tradeAmount}`"></detail-item>
          <!-- A级授权人 -->
          <detail-item
            :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
            v-if="AAuth.length"
            :content="AAuth.join(';')"
          ></detail-item>
          <!-- B级授权人 -->
          <detail-item
            :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
            v-if="BAuth.length"
            :content="BAuth.join(';')"
          ></detail-item>
          <!-- C级授权人 -->
          <detail-item
            :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
            v-if="CAuth.length"
            :content="CAuth.join(';')"
          ></detail-item>
          <!-- A级授权人 -->
      
        </div>
      </div>

      <!-- 批量转账和批量发薪 -->
      <!-- el-tabel start -->
      <div v-if="bsnCode=='03010401' || bsnCode=='03010501'" class="mt8 mb36">
        <el-table :data="branchTransDate" stripe style="width:100%;" class="mb16">
          <!-- 收款账户 -->
          <el-table-column prop="debitAcct" :label="$t('PAYMENT.RECEIVE_ACCOUNT')"></el-table-column>
          <!-- 收款户名 -->
          <el-table-column prop="debitAcctName" :label="$t('PAYMENT.PAYEE_NAME')"></el-table-column>
          <!-- 收款机构/银行 -->
          <el-table-column prop="bankCode" :label="$t('PAYMENT.RECEIVE_BANK')">
            <template v-slot="{row}">{{row.bankCode}} {{filterBankInfo(row.bankCode)}}</template>
          </el-table-column>
          <!-- 金额(元) -->
          <el-table-column prop="amount" :label="$t('REMITTANCECONFIRM.AMOUNT')">
            <template v-slot="{row}">{{detailsObj.cur}}  {{row.amount | formatMoneyNew}}</template>
          </el-table-column>
          <el-table-column prop="additionalComment" :label="$t('AUTHORIZE.ZHI_PERSON')">
            <template v-slot="{row}">{{row.additionalComment? row.additionalComment: '--'}}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="hangdlerSizeChange"
          @current-change="handlerCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 50]"
          layout="prev, pager, next, sizes, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- el_tabel end -->
      <!-- 自动收款 -->
      <!-- el-tabel start -->
      <div v-if="bsnCode=='06'" class="mt8 mb36">
        <el-table :data="recordList" stripe style="width:100%;" class="mb16">
          <!-- 授权编号 -->
          <el-table-column prop="authorizationCode" :label="$t('PAYMENT.AUTH_NO')" width="200"></el-table-column>
          <!-- 付款账号 -->
          <el-table-column prop="paymentBankNo" :label="$t('PAYMENT.PAYMENT_ACCOUNT')" width="300"></el-table-column>
          <!-- 付款户名 -->
          <el-table-column prop="paymentName" :label="$t('PAYMENT.PAYER_NAME')" width="200"></el-table-column>
          <!-- 付款银行/机构 -->
          <el-table-column prop="paymentBankName" :label="$t('PAYMENT.PAYER_BANK')" width="200"></el-table-column>
          <!-- 付款金额 -->
          <el-table-column prop="paymentAmount" :label="$t('PAYMENT.PAYER_AMOUNT')" width="200"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="hangdlerSizeChange"
          @current-change="handlerCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          layout="prev, pager, next, sizes, jumper"
          :total="pageInfo.totalPage"
        ></el-pagination>
      </div>
      <!-- el_tabel end -->

      <el-row v-if="jumpType=='detail'">
        <!-- 返回 -->
        <v-button
          class="btn-marginauto"
          size="w210"
          @click="$emit('clickBack')"
        >{{ $t('COMMON.BACK') }}</v-button>
      </el-row>
      <el-row v-if="jumpType=='change'" class="flexc">
        <!-- 返回 -->
        <v-button size="w160" @click="$emit('clickBack')" class="mr16">{{ $t('COMMON.BACK') }}</v-button>
        <!-- 确定 -->
        <v-button size="w160" type="primary" @click="onConfirm">{{ $t('COMMON.CONFIRM') }}</v-button>
      </el-row>
    </div>

    <div v-if="changeResult">
      <!-- 网银流水编号 -->
      <el-result
        :icon="status"
        :title="title"
        :subTitle="`${$t('PAYMENT.WEBBANK_FLOW_NO')}：${subTitle}`"
      >
        <template slot="extra">
          <!-- 请至授权中心查看授权进度 -->
          <div v-if="showWaitAuth" class="wait-auth">{{ $t('TRANSFR_INFO.GOTO_AUTHOR') }}</div>
          <!-- 返回 -->
          <v-button @click="$emit('clickBack')">{{ $t('COMMON.BACK') }}</v-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
import titleTab from '@bank-transfer/components/title-tab';
import { detail } from '@/api/cashManage';
import { updateScheduleDateSubmit } from '@/api/reservationTransaction.js';
import { softToken, choosesWay } from '@/components/messageBox';
import { scrollToTop } from '@bank-transfer/utils/function';
import filters from '@/filters/public';
import { formatMoneyNew } from '@/utils/tools';
import { mapState } from 'vuex';
import { searchAuthRecord } from '@/api/authorizeCenter';
import { bankInfos } from '@/mixins';
import { confirm } from '@bank-transfer/mixins';
export default {
  name: 'BulkCollectionDetail',
  components: {
    titleTab
  },
  props: {
    jumpType: { type: String, default: 'detail' },
    bsnCode: String,
    flowNo: {
      type: String,
      default: ''
    }
  },
  mixins: [bankInfos,confirm],
  filters: {
    ...filters,
    formatMoneyNew: formatMoneyNew
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      bankInfoForm: {
        scheduleDate: ''
      },
      // 限制所选日期大于当前日期
      option: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6
          );
        }
      },
      AAuth: [],
      BAuth: [],
      CAuth: [],
      recordList: [],
      changeResult: false,
      total: 0,
      current: 1,
      pageSize: 10,
      detailsObj: {},
      branchTransDate: [],
      status: 'error',
      subTitle: '',
      title: '',
      showWaitAuth: false,
      rules: {
        scheduleDate: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('PAYMENT.APPOINTMENT_DATE')
            }),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.branchTrans();
    this.scrollToTop();
  },
  methods: {
    // 查授权人
    async searchAuthRecord() {
      let params = {
        flowNo: this.flowNo
      };
      const result = await searchAuthRecord(params);
      if (result && result.tcApprovalRecords) {
        result.tcApprovalRecords.pop();
        result.tcApprovalRecords.forEach(item => {
          if (item.userLevel === '1') {
            this.AAuth.push(item.userName);
          }
          if (item.userLevel === '2') {
            this.BAuth.push(item.userName);
          }
          if (item.userLevel === '3') {
            this.CAuth.push(item.userName);
          }
        });
      }
      console.log(result, 'result');
    },
    async branchTrans() {
      const result = await detail({
        batchNo: this.flowNo,
        current: this.current,
        size: this.pageSize
      });
      if (result) {
        this.detailsObj = result;
        this.branchTransDate = result.bthTradeDetails.records;
        this.total = result.bthTradeDetails.total;
        this.pageSize = result.bthTradeDetails.size;
      }
    },
    scrollToTop,
    // 确定 提交修改
    async onConfirm() {
      this.$refs['bankInfoForm'].validate(async valid => {
        if (valid) {
          if (this.bankInfoForm.scheduleDate === this.detailsObj.scheduleDate) {
            return this.$message({
              message: this.$t('PAYMENT.REVISE_RESERVE_ERROR'),
              type: 'fail'
            });
          }
          let params = {
            lastScheduleDate: this.detailsObj.scheduleDate,
            scheduleDate: this.bankInfoForm.scheduleDate,
            updateFlowNO: this.flowNo,
            bsnCode: this.bsnCode,
            opType: '0' //0修改1取消
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
                this.onConfirm();
              });
            } else if (head.returnCode == 'OTP000107' && entType == '1') {
              softToken({
                softTokenCode: '',
                otpType: '0303',
                tradeInfo: tradeInfo
              }).then(() => {
                this.onConfirm();
              });
            } else {
              if (body) {
                console.log(body, 'change result');
                const { authResultInfo = {} } = body;
                if (authResultInfo.authResultState !== '91') {
                  this.status = 'success';
                } else {
                  this.status = 'error';
                }
                this.title = this.titleFilter(authResultInfo.authResultState);
                this.subTitle = authResultInfo.flowNo;
                this.changeResult = true;
              }
            }
          });
        }
      });
    },
    titleFilter(val) {
      switch (val) {
        case '91':
          return this.$t('COMMON.SUBMIT_FAIL');
        case '03':
          this.showWaitAuth = true;
          return this.$t('COMMON.SUBMIT_SUCCESS');
        default:
          return this.$t('COMMON.SUBMIT_SUCCESS');
      }
    },
    hangdlerSizeChange(val) {
      this.pageSize = val;
      this.current = 1;
      this.branchTrans();
    },
    handlerCurrentChange(val) {
      this.current = val;
      this.branchTrans();
    }
  }
};
</script>

<style lang="scss" scoped>
.bulk-collection-detail {
  .el-form-item {
    .el-input {
      width: 320px;
    }
  }
  .btn-marginauto {
    /deep/ .vbutton {
      margin: 0 auto;
    }
  }
  .m-detail-content {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
}
.wait-auth {
  margin-bottom: 56px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
</style>