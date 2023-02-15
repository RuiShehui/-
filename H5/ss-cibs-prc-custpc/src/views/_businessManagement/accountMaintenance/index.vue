<template>
  <div class="u-accountMain">
    <!-- 查询区 -->
    <el-form ref="accountDataFormRef" class="u-form" :model="accountData" label-width="auto">
      <el-form-item :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_TYPE')" prop="accountType">
        <el-select
          v-model="accountData.accountType"
          :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:$t('USER_MANAGERMENT.ACCOUNT_TYPE')
          })"
        >
          <el-option
            v-for="item in accountTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <div :class="lang=='en'?'cn-btns':'en-btns'">
        <v-button
          :disabled="accountLoadButFlag"
          size="w70"
          @click="fResetForm"
          style="margin-right:16px"
        >{{$t('COMMON.RESET')}}</v-button>
        <v-button
          :disabled="accountLoadButFlag"
          size="w96"
          type="primary"
          @click="search"
          style="margin-right:16px"
        >{{$t('COMMON.SEARCH')}}</v-button>
        <v-button
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          @click="nodengjiPupop"
        >{{$t('ACCOUNT_MAINTENACE.UNREGISTERED_ACCOUNT')}}</v-button>
      </div>
    </el-form>
    <el-table :data="accountFormData" stripe row-class-name="fontStyle" v-loading="accountLoading">
      <el-table-column type="index" width="100" :label="$t('ACCOUNT_MAINTENACE.NUMBER')"></el-table-column>
      <el-table-column
        prop="accountNo"
        :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_NUMBER')"
        min-width="30%"
      >
        <template slot-scope="scope">{{ formatAccountNo(scope.row.accountNo) }}</template>
      </el-table-column>
      <el-table-column
        prop="accountName"
        :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_NAME')"
        min-width="20%"
      ></el-table-column>
      <el-table-column
        prop="accountTypeName"
        :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_TYPE')"
        min-width="20"
      ></el-table-column>
      <el-table-column prop="status" :label="$t('ACCOUNT_MAINTENACE.STATUS')" min-width="15%">
        <template slot-scope="scope">
          {{
          scope.row.status === 'NORMAL' ? $t('ACCOUNT_MAINTENACE.ACTIVE') : scope.row.status === 'DORMANT' ? $t('ACCOUNT_MAINTENACE.DORMANT') : scope.row.status === 'FROZEN' ? $t('ACCOUNT_MAINTENACE.FROZEN') : scope.row.status === 'ACTIVE' ? $t('ACCOUNT_MAINTENACE.ACTIVE') : scope.row.status === 'CLOSED' ? $t('ACCOUNT_MAINTENACE.STATUS_CLOSE') : scope.row.status === 'OVERDUE' ? $t('AUTHORIZE.MORE_THAN_DATE') : scope.row.status === 'O' ? $t('ACCOUNT_MANAGEMENT.ACCOUNT_OPEN') : scope.row.status === 'C' ? $t('ACCOUNT_MAINTENACE.STATUS_CLOSE') : scope.row.status === 'F' ? $t('ACCOUNT_MAINTENACE.STATUS_FROZEN') : scope.row.status === 'OPEN' ? $t('AUTHORIZE.OPEN') : scope.row.status === 'CLOSE' ? $t('ACCOUNT_MAINTENACE.STATUS_CLOSE') : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ACCOUNT_MAINTENACE.OPTION')"
        min-width="25%"
        label-class-name="cell"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="fHanderClick(scope.row)"
          >{{$t('ACCOUNT_MAINTENACE.DEREGISTRATION')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt16"
      @size-change="fSizeChange"
      @current-change="fCurrentChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="[10,20,30,50]"
      layout="prev,pager,next,sizes,total,jumper"
      :total="totalCount"
    />

    <div v-if="nodengjiPupopFlag">
      <popup
        v-loading="saveFlag"
        :visible="nodengjiPupopFlag"
        :cancelField="this.$t('COMMON.CANCEL')"
        :confirmField="this.$t('ACCOUNT_MAINTENACE.DISORDER_ACCOUNT')"
        @close="fClose"
        class="popupClass"
        @confirm="nodeSave"
        width="980px"
      >
        <div
          style="margin: 32px 0 24px; text-align: center;font-size: 18px;color: rgba(0, 0, 0, 0.85);font-weight: 500; "
        >
          <span class="unregistered">{{$t('ACCOUNT_MAINTENACE.UNREGISTERED_ACCOUNT')}}</span>
        </div>
        <el-form :model="nodengjiForm" label-width="auto" style="width: 100%">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_TYPE')" prop="accountType">
                <el-select
                  v-model="nodengjiForm.accountType"
                  :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:$t('USER_MANAGERMENT.ACCOUNT_TYPE')
          })"
                >
                  <el-option
                    v-for="item in accountTypeList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="2" class="flexc">
              <v-button
                :disabled="loadButFlag"
                size="w70"
                @click="fUnregResetForm"
                class="mr16"
              >{{$t('COMMON.RESET')}}</v-button>
              <v-button
                :disabled="loadButFlag"
                size="w70"
                type="primary"
                @click="fQueryUnregClick"
              >{{$t('COMMON.SEARCH')}}</v-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          style="flex: auto; width: 900px"
          :data="nodengjiTable"
          stripe
          row-class-name="fontStyle"
          v-loading="loading"
        >
          <el-table-column :label="$t('ACCOUNT_MAINTENACE.SELECT')" width="100px" align="center">
            <template slot-scope="scope">
              <el-checkbox
                :disabled="!scope.row.displayFlag"
                v-if="scope.row.accountNo"
                @change="fChange(scope.row, $event)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountNo"
            :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_NUMBER')"
            align="center"
          >
            <template slot-scope="scope">{{ formatAccountNo(scope.row.accountNo) }}</template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_NAME')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="accountTypeName"
            :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_TYPE')"
            align="center"
          ></el-table-column>
          <el-table-column prop="status" :label="$t('ACCOUNT_MAINTENACE.STATUS')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountName">
                {{ scope.row.status | accountStateFilter }}
                <!-- {{
                scope.row.status === 'NORMAL' ? $t('ACCOUNT_MAINTENACE.ACTIVE') : scope.row.status === 'DORMANT' ? $t('ACCOUNT_MAINTENACE.DORMANT') : scope.row.status === 'FROZEN' ? $t('ACCOUNT_MAINTENACE.FROZEN') : scope.row.status === 'ACTIVE' ? $t('AUTHORIZE.ACTIVE') : scope.row.status === 'CLOSED' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : scope.row.status === 'OVERDUE' ? $t('AUTHORIZE.MORE_THAN_DATE') : scope.row.status === 'O' ? $t('ACCOUNT_MANAGEMENT.ACTIVE') : scope.row.status === 'C' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : scope.row.status === 'F' ? $t('ACCOUNT_MANAGEMENT.FROZEN') : scope.row.status === 'OPEN' ? $t('AUTHORIZE.OPEN') : scope.row.status === 'CLOSE' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : ''
                }} -->
              </span>
            </template>
          </el-table-column>
        </el-table>
      </popup>
    </div>
    <div v-if="tipsFlag" class="updatePass">
      <confirm-box :visible="tipsFlag" @confirm="fConfirmPass" @close="close">
        <div>
          <p class="descTitle">{{tipsTitle}}</p>
        </div>
        <p class="descContent">{{tipsConent}}</p>
      </confirm-box>
    </div>
  </div>
</template>
<script>
import Popup from '../../../components/common/PopUp';
import mathTools from '@/utils/mathTools.js';
import tools from '@/dataTools/tools';
import ConfirmBox from '../components/confirmBox';
import filters from '@/filters/accountManagement';
import {
  queryAccountList,
  checkAccountAuthStatus,
  checkInTransitTransaction,
  updateBindStatus,
  queryUnregisteredAccount,
  saveRegisteredAccount
} from '@/api/bankingAccountManagement';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('app');
export default {
  components: {
    Popup,
    ConfirmBox
  },
  data() {
    return {
      loading: true,
      loadButFlag: false, //未登记按钮控制
      accountLoading: true,
      accountLoadButFlag: false, //已登记按钮控制
      saveFlag: false, //保存提交登记
      tipsFlag: false,
      tipsTitle: '',
      tipsConent: '',
      relieveFlag: false, //判断账号是否在授权审批状态中， true：是， false：否
      transactionFlag: false, //判断是否正在账户正在交易，true： 是， false: 否
      registerObj: {}, //选择的对象
      accountData: {
        accountType: ''
      },
      // accStatus： 0 正常 1 休眠 2 冻结
      accountTypeList: [
        {
          value: '',
          label: this.$t('RIGHTS_TEMPLATE.ALL')
        },
        {
          value: 'SAVING',
          label: this.$t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
        },
        {
          value: 'MULTICURRENCY',
          label: this.$t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
        },
        {
          value: 'CURRENT',
          label: this.$t('USER_MANAGEMENT.CURRENT_ACCOUNT')
        },
        {
          value: 'FIXED',
          label: this.$t('USER_MANAGEMENT.FIXED')
        },
        {
          value: 'LOAN',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'SECURITIES',
          label: this.$t('USER_MANAGEMENT.SECURITIES_ACCOUNT')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ], //账户类别数组
      totalCount: 0, //列表总条数
      accountFormData: [],
      accountFormDataTotal: '', //总页数

      nodengjiForm: {
        accountType: ''
      },
      nodengjiTable: [],

      page: {
        currentPage: 1,
        pageSize: 10
      },
      nodengjiPupopFlag: false,
      accData: {},
      ischeckedIndex: 0
    };
  },
  filters: {
    ...filters,
    ...tools
  },
  computed: {
    ...mapState(['lang'])
  },
  watch: {
    lang(newValue, oldValue) {
      console.log(newValue, 'new');
      console.log(oldValue, '');
    }
  },
  created() {
    this.SET_LANG();
  },
  mounted() {
    this.fQueryClick();
  },
  methods: {
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    ...mapActions(['SET_LANG']),
    // 查询-已登记
    fQueryClick() {
      this.accountFormData = [];
      this.accountLoading = true;
      let params = {
        accountType: this.accountData.accountType,
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      this.accountLoadButFlag = true;
      queryAccountList(params).then(resp => {
        this.accountLoadButFlag = false;
        this.accountLoading = false;
        if (resp.customerAccountRsps && resp.customerAccountRsps.length > 0) {
          resp.customerAccountRsps.forEach(item => {
            this.accountTypeList.forEach(accountItem => {
              if (item.accountType === accountItem.value) {
                item.accountTypeName = accountItem.label;
              }
            });
            if (item.accountTypeName) {
              if (item.currencyType) {
                item.accountTypeName =
                  this.ccyFilter(item.currencyType) + ' ' + item.accountTypeName;
              }
            }
          });
          this.totalCount = resp.total;
          this.accountFormData = resp.customerAccountRsps;
        }
      });
    },

    //查询按钮
    search() {
      this.page.pageSize = 10;
      this.page.currentPage = 1;
      this.fQueryClick();
    },

    // 重置-已登记
    fResetForm() {
      this.accountData.accountType = '';
      this.page.pageSize = 10;
      this.page.currentPage = 1;
      this.fQueryClick();
    },

    nodengjiPupop() {
      this.nodengjiPupopFlag = true;
      this.fQueryUnregClick();
    },

    //查询-未登记
    fQueryUnregClick() {
      this.nodengjiTable = [];
      this.loading = true;
      let params = {
        accountType: this.nodengjiForm.accountType
      };
      this.loadButFlag = true;
      queryUnregisteredAccount(params).then(resp => {
        this.loadButFlag = false;
        this.loading = false;
        console.log('resp', resp);
        this.nodengjiTable = resp.unregisteAccounts;
        if (resp.unregisteAccounts && resp.unregisteAccounts.length > 0) {
          this.nodengjiTable.forEach(item => {
            item.selectFlag = false;
            this.accountTypeList.forEach(accountItem => {
              if (item.accountType === accountItem.value) {
                item.accountTypeName = accountItem.label;
              }
            });
            if (item.accountTypeName) {
              if (item.currencyType) {
                item.accountTypeName =
                  item.currencyType + ' ' + item.accountTypeName;
              }
            }
          });
        }
      });
    },

    //重置-未登记
    fUnregResetForm() {
      this.nodengjiForm.accountType = '';
      this.fQueryUnregClick();
    },

    //解除登记
    fHanderClick(row) {
      this.registerObj = row;
      let params = {
        accountName: row.accountName,
        accountNo: row.accountNo,
        accountType: row.accountType,
        currencyType: row.currencyType
      };
      //判断是否已在授权登记
      checkAccountAuthStatus(params).then(resp => {
        if (resp == 1) {
          (this.tipsTitle = this.$t('ACCOUNT_MAINTENACE.DEREGISTRATION')),
            (this.tipsConent = this.$t('ACCOUNT_MAINTENACE.ARE_YOU_SURE', {
              account: tools.formatBank(row.accNo)
            }));
          this.tipsFlag = true;
        } else {
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('ACCOUNT_MAINTENACE.IS_REPEAT'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      });
    },
    //确定
    fConfirmPass() {
      this.tipsFlag = false;
      let params = {
        accountName: this.registerObj.accountName,
        accountNo: this.registerObj.accountNo,
        accountType: this.registerObj.accountType,
        currencyType: this.registerObj.currencyType
      };
      checkInTransitTransaction(params).then(resp => {
        if (!resp.authTransaction && resp.reservationTransaction == 0) {
          this.bindStatus();
        } else {
          let message = '';
          if (resp.authTransaction && resp.reservationTransaction > 0) {
            message = this.$t('ACCOUNT_MAINTENACE.AUTHORIZED_TRANSACTION', {
              authorized: resp.authTransaction,
              appointment: resp.reservationTransaction
            });
          }
          if (resp.authTransaction && resp.reservationTransaction == 0) {
            message = this.$t('ACCOUNT_MAINTENACE.AUTHORIZED_TR', {
              authorized: resp.authTransaction
            });
          }
          if (!resp.authTransaction && resp.reservationTransaction > 0) {
            message = this.$t('ACCOUNT_MAINTENACE.APPOINTMENT_TR', {
              authorized: resp.reservationTransaction
            });
          }
          this.$message({
            message: message,
            type: 'warn',
            delay: 3000
          });
        }
      });
    },
    bindStatus() {
      let uparams = {
        accountNo: this.registerObj.accountNo,
        accountName: this.registerObj.accountName,
        accountType: this.registerObj.accountType,
        category: this.registerObj.category,
        currencyType: this.registerObj.currencyType,
        bindStatus: this.registerObj.bindStatus
      };
      const tradeInfo = JSON.stringify(this.registerObj);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      updateBindStatus(uparams).then(resp => {
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '11',
            operationType:'8',
            // status: status
          }).then(() => {
            this.bindStatus();
          });
        } else if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: {
              // ...obj,
              type: 'del',
               operationType:'8',
              accountNo: this.registerObj.accountNo,
              ccy: this.registerObj.currencyType,
              accountType: this.registerObj.accountType
            }
          }).then(() => {
            this.bindStatus();
          });
        } else {
          if (resp.body.authResultInfo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );
              this.$router.push({
                path: '/_businessManagement/result',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/result',
                query: resp.body.authResultInfo
              });
            }
          }
        }
      });
    },
    //取消
    close() {
      this.tipsFlag = false;
    },
    fSizeChange(size) {
      this.page.pageSize = size;
      this.fQueryClick();
    },
    fCurrentChange(page) {
      this.page.currentPage = page;
      this.fQueryClick();
    },

    //提交登记
    nodeSave() {
      let selectAccountList = [];
      this.nodengjiTable.forEach(item => {
        if (item.selectFlag) {
          selectAccountList.push(item);
        }
      });
      if (selectAccountList.length === 0) {
        this.$confirm({
          title: this.$t('COMMON.TIPS'),
          message: this.$t('ACCOUNT_MAINTENACE.NO_ACCOUNT'),
          btnText: {
            confirmText: this.$t('ACCOUNT_MAINTENACE.OK')
          },
          isCancle: false
        });
        return;
      }
      console.log('selectAccountList', selectAccountList);
      let obj = {
        unregisteAccountList: selectAccountList
      };
      this.saveFlag = true;
      const tradeInfo = JSON.stringify(this.nodengjiTable);
      const menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      saveRegisteredAccount(obj).then(resp => {
        this.saveFlag = false;
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '10',
            operationType:'7'
          }).then(() => {
            this.nodeSave();
          });
        } else if (returnCode == 'OTP000107') {
          console.log();
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: {
              ...obj,
              type: 'add',
              operationType:'7'
            }
          }).then(() => {
            this.nodeSave();
          });
        } else {
          if (resp.body.authResultInfo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );
              this.$router.push({
                path: '/_businessManagement/result',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/result',
                query: resp.body.authResultInfo
              });
            }
          }
        }
      });
    },
    //关闭弹框
    fClose(val) {
      this.pupopFlag = val;
      this.nodengjiPupopFlag = val;
    },
    fChange(row, e) {
      row.selectFlag = e;
    },
    ccyFilter(val) {
    switch (val) {
      case 'HKD':
        return this.$t('ACCOUNT_MANAGEMENT.HKD')
      case 'AUD':
        return this.$t('ACCOUNT_MANAGEMENT.AUD')
      case 'CAD':
        return this.$t('ACCOUNT_MANAGEMENT.CAD')
      case 'CNY':
        return this.$t('ACCOUNT_MANAGEMENT.CNY')
      case 'EUR':
        return this.$t('ACCOUNT_MANAGEMENT.EUR')
      case 'GBP':
        return this.$t('ACCOUNT_MANAGEMENT.GBP')
      case 'JPY':
        return this.$t('ACCOUNT_MANAGEMENT.JPY')
      case 'NZD':
        return this.$t('ACCOUNT_MANAGEMENT.NZD')
      case 'SGD':
        return this.$t('ACCOUNT_MANAGEMENT.SGD')
      case 'TWD':
        return this.$t('ACCOUNT_MANAGEMENT.TWD')
      case 'USD':
        return this.$t('ACCOUNT_MANAGEMENT.USD')
      case 'CHF':
        return this.$t('ACCOUNT_MANAGEMENT.CHF')
      case 'CNH':
        return this.$t('ACCOUNT_MANAGEMENT.CNH')
      case 'DKK':
        return this.$t('ACCOUNT_MANAGEMENT.DKK')
      case 'SEK':
        return this.$t('ACCOUNT_MANAGEMENT.SEK')
      case 'THB':
        return this.$t('ACCOUNT_MANAGEMENT.THB')
      default:
        return val
    }
  },
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>