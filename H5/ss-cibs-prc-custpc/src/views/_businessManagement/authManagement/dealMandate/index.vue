<template>
  <div class="u-dealMandate" v-loading="requestLoading">
    <div>
      <div class="titleSp1">
        <span>{{$t('RIGHTS_TEMPLATE.SET_AUTHORIZATION_TYPE')}}</span>
      </div>
      <div class="line1"></div>
      <div class="line3"></div>
    </div>

    <div class="u-srtTemplate">
      <el-form :model="setAuthorizationTemplate" ref="setAuthorizationTemplate" label-width="auto">
        <el-form-item :label="$t('RIGHTS_TEMPLATE.SET_AUTHORIZATION_TYPE')" required>
          <el-radio
            @change="changeModeType(0)"
            v-model="setAuthorizationTemplate.modelSort"
            label="0"
            style="margin-left: 26px"
          >{{$t('RIGHTS_TEMPLATE.DIOSRDER')}}</el-radio>
          <el-radio
            @change="changeModeType(1)"
            v-model="setAuthorizationTemplate.modelSort"
            label="1"
          >{{$t('RIGHTS_TEMPLATE.ORDERLY')}}</el-radio>
        </el-form-item>
      </el-form>
    </div>

    <div class="noAmount">
      <div class="titleSp2">
        <span>{{$t('RIGHTS_TEMPLATE.NO_CASH_MODULE')}}</span>
      </div>
      <div class="line2"></div>
      <div class="line4"></div>
    </div>
    <el-table :data="noAmountTable" stripe>
      <el-table-column prop="tradeType" :label="$t('OPERATORLOG.TRANSCATION_TYPE')" min-width="35">
        <template slot-scope="scope">{{ scope.row.tradeType | tradeTypeFilter }}</template>
      </el-table-column>
      <el-table-column :label="$t('RIGHTS_TEMPLATE.APPROVAL_TEMPLATES')" min-width="35">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.modelCode"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            @change="changeWithout($event, scope.$index)"
          >
            <el-option
              v-for="(item,index) in withoutMoneyType"
              :label="item.modelName"
              :value="item.modelCode"
              :key="index"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="35">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="fDetail(scope.row)"
          >{{$t('RIGHTS_TEMPLATE.CHECK_TEMPLATES')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <div class="titleSp2">
        <span>{{$t('RIGHTS_TEMPLATE.CASH_MODULE')}}</span>
      </div>
      <div class="line2"></div>
      <div class="line4"></div>
    </div>
    <el-table :data="haveAmountTable" stripe>
      <!-- 交易账户 -->
      <el-table-column :label="$t('RIGHTS_TEMPLATE.TRADING_ACCOUNT')" min-width="25%">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.acctNo"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            @change="changeAcc($event, scope.$index)"
          >
            <el-option
              v-for="(item,index) in cardList"
              :label="item.accountNo | ccyFilter"
              :value="item.accountNo"
              :key="index"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 交易类型 -->
      <el-table-column :label="$t('OPERATORLOG.TRANSCATION_TYPE')" min-width="25%">
        <template slot-scope="scope">
          <el-select
            :disabled="scope.row.tradeTypeFlag"
            v-model="scope.row.tradeType"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            @change="changeMenu($event, scope.$index)"
          >
            <el-option
              v-for="(item,index) in hasMoneyAll"
              :label="item.menuCode | tradeTypeFilter"
              :value="item.menuCode"
              :key="index"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 审批模板 -->
      <el-table-column :label="$t('RIGHTS_TEMPLATE.APPROVAL_TEMPLATES')" min-width="25%">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.modelCode"
            :placeholder="$t('COMMON.PLEASE_SELECT')"
            @change="changeModel($event, scope.$index)"
          >
            <el-option
              v-for="(item,index) in hasMoneyType"
              :label="item.modelName"
              :value="item.modelCode"
              :key="index"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="25">
        <template slot-scope="scope">
          <el-button
            style="position:relative; left: -5%;"
            type="text"
            @click="handleDelete($event, scope.$index)"
          >{{$t('COMMON.DELETE')}}</el-button>
          <el-button
            type="text"
            @click="fDetail(scope.row)"
          >{{$t('RIGHTS_TEMPLATE.CHECK_TEMPLATES')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="f-span-btns" @click="handleAdd()">
      <span>
        <i class="el-icon-plus"></i>
        {{$t('COMMON.ADD')}}
      </span>
    </div>
    <div class="flexc mt36">
      <v-button :disabled="resButFlag" @click="fClearClick" class="mr16">{{$t('COMMON.RESET')}}</v-button>
      <v-button :disabled="butFlag" @click="fSubmitClick" type="primary">{{$t('COMMON.SUBMIT')}}</v-button>
    </div>
  </div>
</template>
<script>
import {
  queryMenuBy,
  addAuthTradeAuthSetting,
  queryTranIsAuthing,
  queryUserAccNo,
  queryAuthALL
} from '@/api/transactionAuthorization.js';
import { queryListTemplate, queryDetailIn } from '@/api/authModeManagement.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import _ from 'lodash';
import filters from '@/filters/public';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      ebankCstmNo: '',
      resButFlag: false, //重置按钮防重点击控制
      butFlag: false, //按钮防重点击控制
      setAuthorizationTemplate: {
        modelSort: '0'
      },
      opType: '2',
      cardList: [], //所有账户数据
      hasMoneyAll: [], //有金额交易类型全部
      hasMoneyType: [], //有金额交易模板

      withoutMoneyType: [], //无金额交易模板
      noMenuList: [], //无金额交易类型数据

      haveAmountTable: [], //目前所设置好有金额数据
      noAmountTable: [], //目前所设置好无金额数据

      oldNoAmountTable: [], //无金额旧数组
      oldHaveAmountTable: [], //有金额旧数组
      oldModelSort: '', //有序无序旧数据
      dataList: []
    };
  },
  filters: {
    ...filters
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  created() {},
  mounted() {
    this.queryTransac();
  },
  methods: {
    //查询列表
    queryTransac() {
      this.haveAmountTable = [];
      this.noAmountTable = [];
      //无金额模式
      let noAmountParams = {
        transType: '2'
      };
      //有金额模式
      let amountParams = {
        transType: '3'
      };
      this.resButFlag = true;
      queryUserAccNo().then(res => {
        this.cardList = res;
        this.cardList.unshift({ accountNo: 'ALL', currencyType: 'ALL' });
      });
      Promise.all([
        queryAuthALL(noAmountParams),
        queryAuthALL(amountParams)
      ]).then(resp => {
        this.resButFlag = false;
        if (resp[0].menuList[0].modelCode || resp[1].menuList[0].modelCode) {
          this.opType = '2';
        } else {
          this.opType = '1';
        }
        console.log(resp,'resp')
        this.dataList = resp[0].authTradeAuthSettingList;
        this.dataList.forEach(item => {
          if (item.approvalType === '1') {
            item.acctNo === null ? (item.acctNo = 'ALL') : item.acctNo;
            item.tradeTypeFlag = false;
            if (item !== 'ALL') {
              let fourString = item.acctNo.substring(3, 4);
              let fiveString = item.acctNo.substring(4, 5);
              if (fourString === '6' && fiveString === '7') {
                item.tradeTypeFlag = true;
              }
            }
            this.haveAmountTable.push(item);
          } else {
            item.acctNo = '0';
            this.noAmountTable.push(item);
          }
        });
        this.hasMoneyAll = resp[1].menuList;
        this.ebankCstmNo = resp[1].menuList[0].ebankCstmNo;
        this.hasMoneyAll.unshift({
          approvalType: '1',
          ebankCstmNo: this.ebankCstmNo,
          empowerTradeCode: '1',
          menuCode: 'ALL',
          modelName: '',
          tradeType: 'ALL',
          tradeTypeName: this.$t('USER_MANAGERMENT.ALL_TRANSACTION_TYPE')
        });
        this.setAuthorizationTemplate.modelSort = this.noAmountTable[0].sequence;
       
        this.oldNoAmountTable = _.cloneDeep(this.noAmountTable);
         console.log(
          'this.noAmountTable',
          this.oldNoAmountTable
        );
        this.oldHaveAmountTable = _.cloneDeep(this.haveAmountTable);
        if (resp[0].menuList.length > 0) {
          this.oldModelSort = _.cloneDeep(resp[0].menuList[0].sequence);
        }
        if (resp[1].menuList.length > 0) {
          this.oldModelSort = _.cloneDeep(resp[1].menuList[0].sequence);
        }
      });
      Promise.all([
        queryListTemplate({ modelType: '0', modelName: '' }),
        queryListTemplate({ modelType: '1', modelName: '' })
      ]).then(rep => {
        this.hasMoneyType = rep[1];
        this.withoutMoneyType = rep[0];
      });
    },

    changeAcc(val, row) {
      this.haveAmountTable[row].acctNo = val;
      this.haveAmountTable[row].accountNo = val;
      if (val !== 'ALL') {
        let fourString = val.substring(3, 4);
        let fiveString = val.substring(4, 5);
        if (fourString === '6' && fiveString === '7') {
          this.haveAmountTable[row].tradeType = '0403';
          this.haveAmountTable[row].tradeTypeFlag = true;
        } else {
          this.haveAmountTable[row].tradeTypeFlag = false;
        }
      } else {
        this.haveAmountTable[row].tradeTypeFlag = false;
      }
      console.log('changeAcc', val, this.haveAmountTable[row]);
      let identicalFlag = false;
      if (this.haveAmountTable.length > 1) {
        this.haveAmountTable.forEach((item, index) => {
          if (index !== row) {
            if (
              item.acctNo === this.haveAmountTable[row].accountNo &&
              item.tradeType === this.haveAmountTable[row].tradeType
            ) {
              identicalFlag = true;
            }
          }
        });
      }

      if (identicalFlag) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.REPEAT'),
          delay: 3000
        });
      }
    },
    //交易类型选择
    changeMenu(val, row) {
      let arrTypeName = {};
      arrTypeName = this.hasMoneyAll.find(item => {
        return item.menuCode === val;
      });
      if (arrTypeName.menuCode === 'ALL') {
        arrTypeName.menuName = 'ALL';
      }
      this.haveAmountTable[row].tradeType = arrTypeName.menuCode;
      this.haveAmountTable[row].tradeTypeName = arrTypeName.menuName;
      this.haveAmountTable[row].menuCode = arrTypeName.menuCode;
      let identicalFlag = false;
      if (this.haveAmountTable.length > 1) {
        this.haveAmountTable.forEach((item, index) => {
          if (index !== row) {
            if (
              item.acctNo === this.haveAmountTable[row].accountNo &&
              item.tradeType === this.haveAmountTable[row].tradeType
            ) {
              identicalFlag = true;
            }
          }
        });
      }

      if (identicalFlag) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.REPEAT'),
          delay: 3000
        });
      }
    },
    //审批模板
    changeModel(val, row) {
      let arrTypeName = {};
      arrTypeName = this.hasMoneyType.find(item => {
        return item.modelCode === val;
      });
      this.haveAmountTable[row].modelName = arrTypeName.modelName;
      this.haveAmountTable[row].modelCode = arrTypeName.modelCode;
      this.haveAmountTable[row].modelType = arrTypeName.modelType;
    },
    changeWithout(val, row) {
      console.log('changeWithout', val, row);
      let arrTypeName = {};
      arrTypeName = this.withoutMoneyType.find(item => {
        return item.modelCode === val;
      });
      this.noAmountTable[row].modelName = arrTypeName.modelName;
      this.noAmountTable[row].modelCode = arrTypeName.modelCode;
      this.noAmountTable[row].modelType = arrTypeName.modelType;
    },

    handleDelete(row, index) {
      this.haveAmountTable.splice(index, 1);
      console.log(row, index);
    },
    handleAdd() {
      let obj = {
        modelCode: '',
        modelName: '',
        modelType: '',
        acctNo: '',
        tradeType: '',
        tradeTypeName: '',
        sequence: '0',
        approvalType: '1',
        ebankCstmNo: this.ebankCstmNo,
        empowerTradeCode: '', //模板详情字段
        menuCode: ''
      };
      this.haveAmountTable.push(obj);
    },
    //   详情
    fDetail(row) {
      console.log('row', row);
      if (!row.modelName) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.CHOOSE_TEMPLATE'),
          delay: 3000
        });
      }
      queryDetailIn({ modelCode: row.modelCode }).then(resp => {
        row.modelName = resp.modelName;
        row.modelInfo = resp;
        row.noAmountTable = this.noAmountTable;
        row.haveAmountTable = this.haveAmountTable;
        this.$router.push({
          path: '/_businessManagement/authManagement/tranDetail',
          query: row
        });
      });
    },
    //重置
    fClearClick() {
      // this.setAuthorizationTemplate.modelSort = '0';
      this.queryTransac();
    },
    // 提交
    fSubmitClick() {
      let identicalFlag = false;
      if (this.haveAmountTable.length > 1) {
        this.haveAmountTable.forEach((item, index) => {
          this.haveAmountTable.forEach((haItem, haIndex) => {
            if (index !== haIndex) {
              if (
                item.acctNo === haItem.acctNo &&
                item.tradeType === haItem.tradeType
              ) {
                identicalFlag = true;
              }
            }
          });
        });
      }

      if (identicalFlag) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.REPEAT'),
          delay: 3000
        });
      }
      queryTranIsAuthing().then(rep => {
        if (rep) {
          let params = {
            amounts: this.haveAmountTable,
            noAmounts: this.noAmountTable,
            authReqInfo: {
              opType: '2'
            }
          };
          console.log('params', params);
          this.butFlag = true;
          addAuthTradeAuthSetting(params).then(resp => {
            const { returnCode } = resp.head;
            const tradeInfo = JSON.stringify(this.detailObj);
            let menuId = localStorage.getItem('sliderMenusAct');
            const { adminEmpower, entType } = JSON.parse(
              sessionStorage.getItem('userInfo')
            );
            this.butFlag = false;
            if (returnCode == 'OTP000107' && entType == '1') {
              softToken({
                softTokenCode: '',
                otpType: menuId,
                tradeInfo: tradeInfo
              }).then(() => {
                this.fSubmitClick();
              });
            } else if (returnCode == 'OTP000107') {
              choosesWay({
                checkWay: '',
                tradeInfo: tradeInfo,
                flag: '4'
              }).then(() => {
                this.fSubmitClick();
              });
            } else {
              this.operationJump(resp);
            }
          });
        } else {
          this.$confirm({
            title: this.$t('ACCOUNT_MAINTENACE.TIPS'),
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_REPEAT'),
            btnText: {
              confirmText: this.$t('ACCOUNT_MAINTENACE.DETERMINE')
            },
            isCancle: false
          });
        }
      });
    },
    operationJump(resp) {
      console.log(resp, 'resprespres');
      if (resp.body.authResultInfo.flowNo) {
        if (resp.body.authResultInfo.authResultState === '03') {
          resp.body.authResultInfo.authorMessage = this.$t(
            'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
          );
          this.$router.push({
            path: '/_businessManagement/authManagement/dealMandate/result',
            query: resp.body.authResultInfo
          });
        } else {
          this.$router.push({
            path: '/_businessManagement/authManagement/dealMandate/result',
            query: resp.body.authResultInfo
          });
        }
      }
    },
    //切换
    changeModeType(e) {
      console.log('e', e);
      console.log(
        'setAuthorizationTemplate',
        this.setAuthorizationTemplate.modelSort
      );
      if (this.noAmountTable.length > 0) {
        this.noAmountTable.forEach(item => {
          item.sequence = this.setAuthorizationTemplate.modelSort;
        });
      }

      if (this.haveAmountTable.length > 0) {
        this.haveAmountTable.forEach(item => {
          item.sequence = this.setAuthorizationTemplate.modelSort;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
.f-span-btns {
  width: 100%;
  color: #f06b00;
  display: flex;
  height: 36px;
  border: dashed 1px #f06b00;
  align-items: center;
  margin: 24px auto 0;
  span {
    display: inline-block;
    cursor: pointer;
    margin: auto;
  }
}
</style>