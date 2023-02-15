<template>
  <div class="confirmInfoWapper">
    <div>
      <divider :title="$t('USER_MANAGEMENT.NORMAL_INFORMATION')" class="mt24 mb20" />
      <div class="confirmContent">
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_TYPE')"
          :content="confirmInfo.userType === '1' ? $t('USER_MANAGEMENT.ADMINISTRATOR'): confirmInfo.userType === '3' ? $t('USER_MANAGEMENT.REPORTER') : $t('USER_MANAGEMENT.AUTHORIZER')"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_CHINESE_NAME')"
          :content="confirmInfo.userChsName"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_ENGLISH_NAME')"
          :content="confirmInfo.userEglsName"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')"
          :content="confirmInfo.cardType"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_NUMBER')" :content="confirmInfo.cardNo" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_STATUS')"
          :content="confirmInfo.status === '1' ?$t('USER_MANAGEMENT.ENABLE'):$t('USER_MANAGEMENT.DEACTIVATE')"
        />
        <detail-item
          v-if="confirmInfo.status === '0'"
          :title="$t('USER_MANAGEMENT.STOP')"
          :content="confirmInfo.revokeReason"
        />
        <detail-item
          v-if="confirmInfo.userType !== '3'"
          :title="$t('USER_MANAGEMENT.AUTHORIZATION_LEVEL')"
          :content="confirmInfo.empowerGroup"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.FA')"
          :content="confirmInfo.tfaStatus === '1' ? $t('USER_MANAGEMENT.YES') :$t('USER_MANAGEMENT.NO')"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.ONEC_ATHOR')"
          :content="confirmInfo.cuSoleAuthorizerInd === '1' ? $t('USER_MANAGEMENT.OPEN') : $t('USER_MANAGEMENT.CLOSE')"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_ADDRESS')" :content="confirmInfo.cardArea" />
        <detail-item :title="$t('USER_MANAGEMENT.BIRTHDAY')" :content="confirmInfo.birthday" />
        <detail-item :title="$t('USER_MANAGEMENT.USER_PHONE')" :content="confirmInfo.userPhone" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_PHONE_TWO')"
          :content="confirmInfo.contactsPhone"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_EMAIL')" :content="confirmInfo.email" />
        <detail-item :title="$t('USER_MANAGEMENT.SMS')" :content="confirmInfo.mobilePhone" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_SMS_ADDRESS')"
          :content="confirmInfo.mailAddress"
        />
      </div>
      <div v-if="!otpFlag" class="flexc mt36">
        <v-button @click="back" class="mr16">{{$t('COMMON.BACK')}}</v-button>
        <v-button
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          @click="completionInfo"
          type="primary"
        >{{$t('USER_MANAGEMENT.CHECK_INFORMATHON')}}</v-button>
      </div>
      <div v-if="otpFlag" class="flexc mt36">
        <v-button @click="back" class="mr16">{{$t('COMMON.BACK')}}</v-button>
        <v-button :style="{ overflow: 'hidden' }" size="wMin160" @click="update" class="mr16">{{$t('COMMON.UPDATE')}}</v-button>
      </div>
      <divider :title="$t('USER_MANAGEMENT.SERVE_SETTING')" class="mt24 mb20" />
      <div class="tableClass">
        <el-table
          :data="
          tableData
        "
          ref="tableData"
          row-key="menuCode"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column
            prop="menuName"
            :label="$t('USER_MANAGEMENT.MENU_NAME')"
            label-class-name="labelClass"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.menuName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('RIGHTS_TEMPLATE.ALL')"
            prop="entryPermission"
            label-class-name="labelClass"
          >
            <template slot="header">
              <span>{{$t('USER_MANAGEMENT.SEARCH_AUTHORITH')}}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.queryFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
          <el-table-column
            prop="entryPermission"
            :label="$t('RIGHTS_TEMPLATE.ALL')"
            label-class-name="labelClass"
          >
            <template slot="header">
              <span>{{$t('USER_MANAGEMENT.ENTRY_AUTHORITY')}}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.createFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
          <el-table-column prop="authAll" label-class-name="labelClass">
            <template slot="header">
              <span>{{$t('USER_MANAGEMENT.AUTHORIZATION_AUTHORITY')}}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.grantFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="accountSelect">
        <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ACCOUNT_CHOOSES')" />
        <div style="overflow: auto">
          <div v-for="(item, index) in operatorAccounts" :key="index">
            <span class="accountCheck">{{item.accName}}</span>
          </div>
        </div>
      </div>

      <div class="mb20" v-if="confirmInfo.cuSoleAuthorizerInd === '1'">
        <div style="clear:both">
          <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ONEC_ACCOUNT')" />
        </div>
        <el-table :data="soleTableData" style="width: 100%" stripe>
          <el-table-column
            :label="$t('USER_MANAGEMENT.PRIVILEGED_ACCOUNT')"
            prop="accName"
            align="left"
            min-width="400px"
          ></el-table-column>
          <el-table-column
            :label="$t('USER_MANAGEMENT.QUOTA')"
            prop="accLimitDaily"
            align="left"
            min-width="630px"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  queryMenuPermission,
  queryUserAccountLimit,
  queryMenuAll,
  getListCardArea,
  queryOperatorInfo,
  queryOperatorInfoOtp,
  queryCstUserAcctList
} from '@/api/userManagement';
import { checkUpdateAuthStatus } from '@/api/userManagement';
import tool from '@/dataTools/tools/moneyTools.js';
import { formatTreeData, deepClone, unique } from '@/utils/tree-table.js';
import CONSTANTS from '@/utils/contants';
import { parse } from 'querystring';
import { otpDialog } from '@/components/messageBox';
import mathTools from '@/utils/mathTools.js';
import filters from "@/filters/public.js"
export default {
  components: {},
  data() {
    return {
      operatorAccounts: [], //账户选择数组
      soleTableData: [], //单一批核者数组
      otpFlag: false,
      confirmInfo: {},
      confirmOldInfo: {},
      accountLimitList: [],
      tableData: [],
      queryAll: true, // 控制查询的全部标识
      authAll: true, // 控制授权的全部标识
      entryAll: true // 控制录入的全部标识
    };
  },
  filters,
  computed: {},
  created() {},
  mounted() {
    console.log('this.$route.query.resp',this.$route.query.resp)
    this.confirmInfo = { ...this.$route.query.resp };
    this.confirmOldInfo = { ...this.$route.query.resp };
    console.log('confirmInfo', this.confirmInfo);
    if (this.confirmInfo.empowerGroup && this.confirmInfo.empowerGroup == 0) {
      this.confirmInfo.empowerGroup = this.$t('USER_MANAGERMENT.NONE');
    }

    if (this.confirmInfo.cuSoleAuthorizerInd === '1') {
      this.soleTableData = this.confirmInfo.userAccountLimits;
      this.soleTableData.forEach(item => {
        item.accLimitDaily = tool.currencyFormat(item.limitDaily, '', 2);
        CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
          if (item.accountType === accountItem.value) {
            item.accountTypeName = accountItem.label;
          }

          if (item.currencyType) {
            item.accName =
              item.accountNo +
              '-' +
              item.currencyType +
              '-' +
              item.accountTypeName;
          } else {
            item.accName = item.accountNo + '-' + item.accountTypeName;
          }
        });
      });
    }
    this.searchMenuPermission();
    this.searchUserAccountLimit();
    this.queryArea();
    this.desensitization();
  },
  methods: {
      accountTypeFilter(value) {
      switch (value) {
        case 'SAVING':
          return `${this.$t('ACCOUNT_MANAGEMENT.SAVING')}`;
        case 'MULTICURRENCY':
          return `${this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY')}`;
        case 'CURRENT':
          return `${this.$t('ACCOUNT_MANAGEMENT.CURRENT')}`;
        case 'FIXED':
          return `${this.$t('ACCOUNT_MANAGEMENT.FIXED')}`;
        case 'LOAN':
          return `${this.$t('ACCOUNT_MANAGEMENT.LOAN')}`;
        case 'SECURITIES':
          return `${this.$t('ACCOUNT_MANAGEMENT.SECURITIES')}`;
        case 'INVESTMENT':
          return `${this.$t('ACCOUNT_MANAGEMENT.INVESTMENT')}`;
        default:
          return value;
      }
    },
    /**
     * 服务设定菜单查询
     * queryMenuAll()：查询所有菜单接口
     * queryMenuPermission(): 查询当前用户权限接口
     */
    searchMenuPermission() {
      let self = this;
      let params = {
        cstmNo: self.confirmInfo.ebankCstmNo, //T24200011004, 8460001, 123456789
        userCode: self.confirmInfo.userCode //T242000110040001, T2100012021122310394, 111111
        // cstmNo: '123456789',
        // userCode: '2022000000023'
      };
      Promise.all([queryMenuAll(), queryMenuPermission(params)]).then(resp => {
        resp[0].menuList.forEach(item => {
          if (resp[1].userMenuPermissionList) {
            resp[1].userMenuPermissionList.forEach(curItem => {
              if (item.menuCode === curItem.menuCode) {
                item.queryFlag = curItem.query === '1' ? true : false;
                item.createFlag = curItem.create === '1' ? true : false;
                item.grantFlag = curItem.grant === '1' ? true : false;
              }
            });
          }

          if (!item.queryFlag) {
            this.queryAll = false;
          }
          if (!item.createFlag) {
            this.entryAll = false;
          }
          if (!item.grantFlag) {
            this.authAll = false;
          }
        });
        this.tableData = formatTreeData(
          deepClone(resp[0].menuList),
          'menuCode',
          'pmenuCode'
        );
        // console.log('tableData:', this.tableData);
      });
    },

    //账户权限设定
    searchUserAccountLimit() {
      let self = this;
      self.operatorAccounts = [];
      let params = {
        userCode: self.confirmInfo.userCode
      };
      queryCstUserAcctList(params).then(resp => {
        console.log('userResp:', resp);
        // let uniqueList = unique(resp);
        let uniqueList = resp.acctList.filter((item, index) => {
          return (
            resp.acctList.findIndex(
              item1 => item1.accountCode == item.accountCode
            ) == index
          );
        });
        console.log('uniqueList', uniqueList);
        uniqueList.forEach(unItem => {
          CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
            if (unItem.accountType === accountItem.value) {
              unItem.accountTypeName = accountItem.label;
            }
          });
          if (unItem.accountTypeName) {
            if (unItem.currencyType) {
              unItem.accName =
                this.formatAccountNo(unItem.accountNo) +
                '-' +
                unItem.currencyType +
                '-' +
               this.accountTypeFilter(unItem.accountType);
            } else {
              unItem.accName = this.formatAccountNo(unItem.accountNo) + '-' + this.accountTypeFilter(unItem.accountType);
            }
          } else {
            if (unItem.currencyType) {
              unItem.accName = this.formatAccountNo(unItem.accountNo) + '-' + unItem.currencyType;
            } else {
              unItem.accName = this.formatAccountNo(unItem.accountNo);
            }
          }
          this.operatorAccounts.push(unItem);
        });
      });
    },

    //查询渲染签证地
    queryArea() {
      let lang = 'zh-CN';
      if (localStorage.getItem('lang') == 'zh-CN') {
        lang = 'zh-CN';
      }
      if (localStorage.getItem('lang') == 'zh-HK') {
        lang = 'zh-HK';
      }
      if (localStorage.getItem('lang') == 'en') {
        lang = 'en';
      }
      let params = {
        bigGroupCode: 'language',
        bigGroupName: lang,
        fieldName: 'cardArea'
      };
      let paramsType = {
        bigGroupCode: 'language',
        bigGroupName: lang,
        fieldName: 'cardTypeInd'
      };
      //证件签发地
      getListCardArea(params).then(resp => {
        resp.cardAreaList.forEach(item => {
          if (item.fieldValue === this.confirmInfo.cardArea) {
            this.confirmInfo.cardArea = item.fiedlDescrible;
            this.confirmOldInfo.cardArea = item.fiedlDescrible;
          }
        });
      });
      //证件类型
      getListCardArea(paramsType).then(resp => {
        console.log('respType', resp);
        resp.cardAreaList.forEach(item => {
          if (item.fieldValue === this.confirmInfo.cardType) {
            this.confirmInfo.cardType = item.fiedlDescrible;
            this.confirmOldInfo.cardType = item.fiedlDescrible;
          }
        });
      });
    },

    //脱敏处理
    desensitization() {
      console.log('this.confirmInfo', this.confirmInfo);
      //联络电话
      if (this.confirmInfo.userPhone) {
        let phoneList = this.confirmInfo.userPhone.split('-');
        if (phoneList.length === 3) {
          let userPhoneLength = phoneList[2].length;
          this.confirmInfo.userPhone =
            phoneList[0] +
            '-' +
            phoneList[1] +
            '-' +
            phoneList[2].substring(0, 2) +
            '* **** **' +
            phoneList[2].substring(userPhoneLength - 2, userPhoneLength);
        }
        if (phoneList.length === 2) {
          let userPhoneLength = phoneList[1].length;
          this.confirmInfo.userPhone =
            phoneList[0] +
            '-' +
            phoneList[1].substring(0, 2) +
            '* **** **' +
            phoneList[1].substring(userPhoneLength - 2, userPhoneLength);
        }
      }
      //联络电话2
      if (this.confirmInfo.contactsPhone) {
        let conPhoneList = this.confirmInfo.contactsPhone.split('-');
        if (conPhoneList.length === 3) {
          let contactsPhoneLength = conPhoneList[1].length;
          this.confirmInfo.contactsPhone =
            conPhoneList[0] +
            '-' +
            conPhoneList[1] +
            '-' +
            conPhoneList[2].substring(0, 2) +
            '* **** **' +
            conPhoneList[2].substring(
              contactsPhoneLength - 2,
              contactsPhoneLength
            );
        }
        if (conPhoneList.length === 2) {
          let contactsPhoneLength = conPhoneList[1].length;
          this.confirmInfo.contactsPhone =
            conPhoneList[0] +
            '-' +
            conPhoneList[1].substring(0, 2) +
            '* **** **' +
            conPhoneList[1].substring(
              contactsPhoneLength - 2,
              contactsPhoneLength
            );
        }
      }
      //流动电话
      let mobilePhoneList = this.confirmInfo.mobilePhone.split('-');
      let mobilePhoneLength = mobilePhoneList[1].length;
      this.confirmInfo.mobilePhone =
        mobilePhoneList[0] +
        '-' +
        mobilePhoneList[1].substring(0, 2) +
        '* **** **' +
        mobilePhoneList[1].substring(mobilePhoneLength - 2, mobilePhoneLength);
      //电邮地址
      let emailList = this.confirmInfo.email.split('@');
      let emailLength = emailList[0].length;
      let numberList = (emailLength / 2).toString().split('.');
      console.log('numberList', numberList);
      let emailHalfLength = '';
      if (numberList.length > 1) {
        emailHalfLength = parseInt(numberList[0]) + 1;
      } else {
        emailHalfLength = parseInt(numberList[0]);
      }
      // let emailHalfLength = parseInt(emailLength / 2);
      console.log('parsenInt', emailHalfLength);
      if (this.confirmInfo.email === '' || this.confirmInfo.email === null) {
        this.confirmInfo.email = ''
      }else {
        this.confirmInfo.email =
         emailList[0].substring(0, emailHalfLength) + '***' + '@' + emailList[1];
      }


      //邮寄地址
      if (this.confirmInfo.mailAddress) {
        let mailAddressLenth = this.confirmInfo.mailAddress.length;
        this.confirmInfo.mailAddress =
          this.confirmInfo.mailAddress.substring(
            0,
            mailAddressLenth - parseInt(mailAddressLenth / 3)
          ) + '***';
      }

      //证件号码
      let cardNolength = this.confirmInfo.cardNo.length;
      this.confirmInfo.cardNo =
        this.confirmInfo.cardNo.substring(0, parseInt(cardNolength / 3)) +
        '****' +
        this.confirmInfo.cardNo.substring(
          cardNolength - parseInt(cardNolength / 3),
          cardNolength
        );
    },

    //查询完整信息
    completionInfo() {
      let userCode = this.confirmInfo.userCode;
      let params = {
        // cstmNo:custNo,
        userCode: userCode
      };
      queryOperatorInfoOtp(params).then(result => {
        console.log(result, 'result');
        otpDialog({
          custNo: this.confirmInfo.ebankCstmNo,
          otpType: '0901',
          otpmode: 'otp',
          flag: '9'
        }).then(res => {
          console.log(res, 'res');
          queryOperatorInfoOtp(params).then(res => {
            this.confirmInfo = { ...this.confirmOldInfo };
            if (this.confirmInfo.cardType === 'HKID') {
              let cardList = this.confirmInfo.cardNo.split('-');
              this.confirmInfo.cardNo = cardList[0] + '(' + cardList[1] + ')';
            }
            this.otpFlag = true;
          });
        });
      });
    },
    checkOperator() {
      this.confirmInfo = { ...this.confirmOldInfo };
      let userCode = this.confirmInfo.userCode;
      let params = {
        // cstmNo:custNo,
        userCode: userCode
      };
      queryOperatorInfo(params).then(result => {
        console.log(result, 'result');
        if (result.body) {
          this.confirmInfo = result.body;
          if (this.confirmInfo.cardType === 'HKID') {
            let cardList = this.confirmInfo.cardNo.split('-');
            this.confirmInfo.cardNo = cardList[0] + '(' + cardList[1] + ')';
          }
          if (
            this.confirmInfo.empowerGroup &&
            this.confirmInfo.empowerGroup == 0
          ) {
            this.confirmInfo.empowerGroup = this.$t('USER_MANAGERMENT.NONE');
          }
          this.otpFlag = true;
          this.queryArea();
        }
      });
    },
    back() {
      this.$router.push({ path: '/_businessManagement/operatorMaintain' });
    },
    update() {
      let row = this.confirmInfo;
      checkUpdateAuthStatus({
        operationType: '2',
        userCode: row.userCode
      }).then(resp => {
        console.log('打印resp', resp);
        if (resp === '1') {
          // OTP接口有问题，暂时不调用 20220323 接口通后删掉下面代码
          let params = {
            userCode: this.confirmInfo.userCode
          };
          queryOperatorInfo(params).then(resp => {
            console.log('resp', resp);
            if (resp) {
              this.$set(resp.body, 'openURL', 'updateOperator');
              this.$router.push({
                path: '/_businessManagement/operatorMaintain/updateOperator',
                query: { resp: resp.body, data: this.confirmInfo }
              });
            }
          });
          return;
        } else {
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_CHECK'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      });
      return;
    },
      formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.info {
  width: 800px;
  margin: 0 auto;
  .el-form-item {
    width: 300px;
    //   text-align: center;
  }
}
.accountLimit {
  margin-top: 20px;
}
.accountTable {
  .colAccount {
    margin: 0 100px;
  }
}
.confirmContent {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
/deep/ .el-table td,
.el-table th.is-leaf {
  padding: 6px 0 !important;
}
/deep/ .el-checkbox {
  padding: 0;
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}
/deep/ .el-checkbox__label {
  color: #696969 !important;
}
.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  margin-left: 18px;
}
.el-table tr {
  background-color: #ffffff;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 16px;
}
.accountCheck {
  width: 100%;
  float: left;
  width: 30%;
  // padding: 20px;
  padding: 12px 0;
  padding-left: 3%;
}
</style>
