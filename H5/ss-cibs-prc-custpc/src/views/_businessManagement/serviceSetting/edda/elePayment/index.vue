<template>
  <div class="elePayment" v-loading="requestLoading">
    <el-tabs v-model="activeName" class="m-topTabs">
      <el-tab-pane :label="$t('USER_MANAGERMENT.TRANSACYIONS_APP')" name="first">
        <el-table :data="pendingApproval" stripe>
          <el-table-column :label="$t('USER_MANAGERMENT.APPLICATION_DATA')" prop="reqDate"></el-table-column>
          <el-table-column :label="$t('USER_MANAGERMENT.PAY_PEOPLE')" prop="remitteeName"></el-table-column>
          <el-table-column :label="$t('USER_MANAGERMENT.PAY_TYPE')" prop="supportType">
            <template slot-scope="scope">{{ scope.row.supportType |  supporyType}}</template>
          </el-table-column>
          <el-table-column :label="$t('Tasks.TRANSACTION_TYPE')" prop="tranType">
            <template slot-scope="scope">{{scope.row.tranType | tranTypeType }}</template>
          </el-table-column>
          <el-table-column :label="$t('TRANSFR_INFO.PROLOT')"  :width="lang=='en'?'300':'200'">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-button
                  style="margin-right: 5px;border: 1px solid transparent;"
                  type="text"
                  @click="agreeClick(scope.row)"
                >{{$t('AUTHORIZE.MY_AGRESS')}}</el-button>
                <div class="line"></div>
                <el-button
                  style="margin-right: 5px;border: 1px solid transparent;"
                  type="text"
                  @click="rejectClick(scope.row)"
                >{{$t('AUTHORIZE.MY_REFUSE')}}</el-button>
                <div class="line"></div>
                <el-button
                  style="border: 1px solid transparent;"
                  type="text"
                  @click="detailClick(scope.row, false)"
                >{{$t('AUTHORIZE.DETAIL')}}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt16"
          @size-change="fSizeChange1"
          @current-change="fCurrentChange1"
          :current-page="page1.current"
          :page-size="page1.size"
          :page-sizes="[10,20,30,50]"
          layout="prev,pager,next,sizes,jumper"
          :total="page1.total"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('USER_MANAGERMENT.YI_PI')" name="second">
        <el-table :data="approved" stripe>
          <el-table-column :label="$t('ACCOUNT_MANAGEMENT.START_DATE')" prop="startDate"></el-table-column>
          <el-table-column :label="$t('ACCOUNT_MANAGEMENT.END_DATE')" prop="endDate">
            <template slot-scope="scope">{{ scope.row.endDate ? scope.row.endDate : '--' }}</template>
          </el-table-column>
          <el-table-column :label="$t('USER_MANAGERMENT.PAY_PEOPLE')" prop="remitteeName"></el-table-column>
          <el-table-column :label="$t('USER_MANAGERMENT.PAY_TYPE')" prop="supportType">
            <template slot-scope="scope">{{ scope.row.supportType |  supporyType}}</template>
          </el-table-column>
          <el-table-column :label="$t('TRANSFR_INFO.PROLOT')" :width="lang=='en'?'300':'200'">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-button
                  style="margin-right: 5px;border: 1px solid transparent;"
                  type="text"
                  @click="updateClick(scope.row)"
                >{{$t('AUTHORIZE.UPDATE')}}</el-button>
                <div class="line"></div>
                <el-button
                  style="margin-right: 5px;border: 1px solid transparent;"
                  type="text"
                  @click="detailClick(scope.row, true)"
                >{{$t('AUTHORIZE.DETAIL')}}</el-button>
                <div class="line"></div>
                <el-button
                  style="border: 1px solid transparent;"
                  type="text"
                  @click="deleteClick(scope.row)"
                >{{$t('AUTHORIZE.DELETE')}}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt16"
          @size-change="fSizeChange2"
          @current-change="fCurrentChange2"
          :current-page="page2.current"
          :page-size="page2.size"
          :page-sizes="[10,20,30,50]"
          layout="total,sizes,prev,pager,next,jumper"
          :total="page2.total"
        />
      </el-tab-pane>
    </el-tabs>
    <div v-if="activeName === 'first'" class="u-mt161" style="margin-top: 36px">
      <p class="f14 mb12" style="font-size: 16px">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p class="f12 gray3" style="font-size: 14px">{{$t('USER_MANAGERMENT.TIPSACOMRIDE')}}</p>
    </div>
  </div>
</template>
<script>
import {
  examineApproveTranc,
  examineApproveTrancOperationSubmit
} from '@/api/setUpEDDA.js';
import { mapState } from 'vuex';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import business from '@/filters/business.js';
export default {
  data() {
    return {
      activeName: 'first',
      pendingApproval: [], //待审批交易
      approved: [], //已审批交易
      page1: {
        current: 1,
        size: 10,
        total: 0
      },
      page2: {
        current: 1,
        size: 10,
        total: 0
      }
    };
  },
  computed: {
    ...mapState('app', ['requestLoading','lang'])
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === 'first') {
          this.queryTransaction('00');
        } else {
          this.queryTransaction('01');
        }
      }
    }
  },
  filters: {
    supporyType:business.supporyType,
    tranTypeType:business.tranTypeType,
  },
  mounted() {
    if (this.$route.query && this.$route.query.activeName) {
      if (this.$route.query.activeName === 'first') {
        this.queryTransaction('00');
      } else {
        this.activeName = this.$route.query.activeName;
      }
    } else {
      this.queryTransaction('00');
    }
  },
  methods: {
    //查询审批交易
    queryTransaction(transType) {
      let params;
      if (transType === '00') {
        params = {
          ...this.page1,
          examineCode: transType
        };
      } else {
        params = {
          ...this.page2,
          examineCode: transType
        };
      }
      examineApproveTranc(params).then(resp => {
        if (transType === '00') {
          this.pendingApproval = resp.eddaList;
          this.page1.total = resp.total;
        } else {
          this.approved = resp.eddaList;
          this.page2.total = resp.total;
        }
      });
    },
    //同意
    agreeClick(row) {
      console.log('row', row);
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.AGREE_REQUEST'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        row.action = '00';
        row.approveFlag = false;
        console.log('row',row)
        examineApproveTrancOperationSubmit(row).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(row);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.agreeClick(row);
            });
          } else if (returnCode == 'OTP000107') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '4'
            }).then(() => {
              this.agreeClick(row);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },
    //拒绝
    rejectClick(row) {
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.REJECT_REQUEST'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        row.action = '01';
        examineApproveTrancOperationSubmit(row).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(row);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '5'
              // status: status
            }).then(() => {
              this.rejectClick(row);
            });
          } else if (returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.rejectClick(row);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },

    //删除
    deleteClick(row) {
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.DELETE_REQUEST'),
       btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        row.action = '02';
        examineApproveTrancOperationSubmit(row).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(row);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '3'
            }).then(() => {
              this.deleteClick(row);
            });
          } else if (returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.deleteClick(row);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },

    //同意、拒绝、删除操作后判断跳转结果页
    operationJump(resp) {
      if (resp.body.authResultInfo) {
        if (resp.body.authResultInfo.authResultState === '03') {
          resp.body.authResultInfo.authorMessage = this.$t('REMITTANCECONFIRM.PROGRESS');
          this.$router.push({
            path:
              '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
            query: resp.body.authResultInfo
          });
        } else {
          this.$router.push({
            path:
              '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
            query: resp.body.authResultInfo
          });
        }
      }
    },

    //详情
    detailClick(row, flag) {
      if (flag) {
        row.activeName = 'second';
      } else {
        row.activeName = 'first';
      }
      row.approveFlag = flag;
      this.$router.push({
        path: '/_businessManagement/serviceSetting/edda/elePayment/detail',
        query: { row }
      });
    },

    //修改
    updateClick(row) {
      row.activeName = 'second';
      this.$router.push({
        path: '/_businessManagement/serviceSetting/edda/elePayment/modify',
        query: { row }
      });
    },
    fSizeChange1(size) {
      this.page1.size = size;
      this.page2.current = 1;
      this.queryTransaction('00');
    },
    fCurrentChange1(start) {
      this.page1.current = start;
      this.queryTransaction('00');
    },
    fSizeChange2(size) {
      console.log(size);
      this.page2.size = size;
      this.page2.current = 1;
      this.queryTransaction('01');
    },
    fCurrentChange2(start) {
      console.log(start);
      this.page2.current = start;
      this.queryTransaction('01');
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>