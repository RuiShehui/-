<!--
 * @Author: zhutao
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-11-15 15:32:15
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\user-maintenance-management.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO') }}</div>
      <div>{{ tableData.ebankCstmNo }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</div>
      <div>{{ ebankCsInfo[0].entName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.STATUS') }}</div>
      <div>{{ ebankCsInfo[0].authStatus }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_TYPE') }}</div>
      <div>{{ tableData.userType }}</div>
    </div>
    <!-- todo -->
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_NO') }}</div>
      <div>{{ tableData.userCode }}</div>
      <div v-if="tableData.loginName">{{ $t('CUSTOMER_MANAGEMENT.LOGIN_NAME') }}</div>
      <div v-if="tableData.loginName">{{ tableData.loginName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_CHS_NAME') }}</div>
      <div>{{ tableData.userChsName || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME') }}</div>
      <div>{{ tableData.userEglsName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
      <div>{{ cardTypeFilter(tableData.cardType) }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
      <div>{{ tableData.cardNo }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CERTIFICATE_ISSUING_PLACE') }}</div>
      <div>{{ cardAreaFilter(tableData.cardArea) }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.BIRTHDAY') }}</div>
      <div>{{ tableData.birthday || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_STATUS') }}</div>
      <div>{{ CONSTANTS.ENABLE[tableData.status] }}</div>
      <div v-if="tableData.status === '0'">{{ $t('CUSTOMER_MANAGEMENT.USER_STOP_REASON') }}</div>
      <div v-if="tableData.status === '0'">{{ tableData.revokeReason || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL') }}</div>
      <div>{{ tableData.empowerGroup }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.TFA_STATUS') }}</div>
      <div>{{ tableData.tfaStatus }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
      <div>{{ tableData.userPhone || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2' }}</div>
      <div>{{ tableData.contactsPhone || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
      <div>{{ tableData.email }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
      <div>{{ tableData.mobilePhone }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS') }}</div>
      <div>{{ tableData.mailAddress }}</div>
      <div v-if="tableData.cuSoleAuthorizerInd !== '2'">單一批核者</div>
      <div
        v-if="tableData.cuSoleAuthorizerInd !== '2'"
      >{{ tableData.cuSoleAuthorizerInd === '1' ? '開' : '關' }}</div>
    </div>
    <div v-if="tableData.cuSoleAuthorizerInd === '1'">
      <el-table :data="tableData.userAccountLimits" border stripe>
        <el-table-column align="center" prop="accountNo" label="特權賬戶" min-width="50%" />
        <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
        <el-table-column align="center" label="單一批核限額" min-width="50%">
          <template slot-scope="scope">
            <span>HKD {{scope.row.limitDaily}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="divider" v-if="entType==='2'">
      <div class="bill"></div>
      <div class="title">服务设定</div>
      <slot />
    </div>
    <div style="margin-top:20px;" v-if="entType==='2'" >
      <el-table
        :data="
          tableDataArr
        "
        ref="tableDataArr"
        row-key="menuCode"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column prop="menuName" label="菜单名称" label-class-name="labelClass">
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="全部"
          prop="entryPermission"
          label-class-name="labelClass"
        >
          <template slot="header">
            <span>查询权限</span>
          </template>
          <template slot-scope="scope">
            <img v-show="scope.row.queryFlag" src="@/img/hook1.png" />
          </template>
        </el-table-column>
        <el-table-column
          prop="entryPermission"
          label="全部"
          label-class-name="labelClass"
        >
          <template slot="header">
            <span>录入权限</span>
          </template>
          <template slot-scope="scope">
            <img v-show="scope.row.createFlag" src="@/img/hook1.png" />
          </template>
        </el-table-column>
        <el-table-column prop="authAll" label-class-name="labelClass">
          <template slot="header">
            <span>授权权限</span>
          </template>
          <template slot-scope="scope">
            <img v-show="scope.row.grantFlag" src="@/img/hook1.png" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="divider" v-if="entType==='2'">
      <div class="bill"></div>
      <div class="title">账户选择设置</div>
      <slot />
    </div>
    <div class="p-checkBox" v-if="entType==='2'">
      <div class="p-checkBox-div" v-for="(item, index) in operatorAccounts" :key="index">
        <span class="u-span">
          {{accountFormat(item.accountNo)}}
          <span
            v-show="item.currencyType"
          >-{{curFilter(item.currencyType)}}-</span>
          {{accountTypeFilter(item.accountType)}};
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { queryMerchantList } from '@/api/customer-management/customer';
import { getPaymentCommAccountList } from '@/api/customer-management/customer';
import tool from '@/utils/moneyTools.js';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import CONSTANTS from '@/utils/constant.js';
import { queryCBMenu } from '@/api/customer-management/customer';
import { formatTreeData, deepClone, treeToArray } from '@/utils/tree-table.js';
import filter from '@/filters/public.js';
export default {
  name: 'UserMaintainConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  filter: {
    ccyFilter: filter.ccyFilter,
    accountType: filter.accountType,
    formatBankNo: filter.formatBankNo
  },
  data() {
    return {
      tableData: {
        ebankCstmNo: '', //网银客户号
        authStatus: '', //状态
        userType: '', //用户类型
        loginName: '', //用户名
        userChsName: '', //用户中文名称
        userEglsName: '', //用户英文名称
        cardType: '', //证件类型
        cardNo: '', //证件号码
        userTypeOne: '', //用户状态
        empowerGroup: '', //授权级别
        cardArea: '', //是否开通双重认证
        cardAreaOne: '', //证件签发地
        birthday: '', //出生日期
        userPhone: '', //联络电话
        email: '', //电邮地址
        mobilePhone: '', //流动电话号码
        mailAddress: '' //邮寄地址
      },
      CONSTANTS,
      cardTypeList: [],
      cardAreaList: [],
      ebankCsInfo: [{ entName: '', authStatus: '' }],
      tableDataArr: [],
      operatorAccounts: [],
      entType:''
    };
  },
  
  async mounted() {
   
    this.getCardTypeList();
    this.getCardAreaList();
    let userTypeObj = { 1: '管理員', 2: '授權員', 3: '錄入員' };
    let cardAreaObj = { 0: '否', 1: '是' };
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
     console.log(this.tableData,'tableDta')
    if (this.tableData.cuSoleAuthorizerInd === '1') {
      getPaymentCommAccountList({
        ebankCustNo: this.tableData.ebankCstmNo
      }).then(resp => {
        if (resp.body) {
          if (resp.body.accList.length > 0) {
            this.tableData.userAccountLimits.forEach(accItem => {
              accItem.limitDaily = tool.currencyFormat(
                accItem.limitDaily,
                '',
                2
              );
              resp.body.accList.forEach(item => {
                let accTypeName = '';
                let currencyName = '';
                if (item.accType) {
                  accTypeName = CONSTANTS.accountTypes[item.accType];
                }
                if (item.currency) {
                  currencyName = item.currency;
                }
                if (accItem.accountNo === item.accNo) {
                  accItem.accountNo =
                    item.accNo + ' ' + currencyName + ' ' + accTypeName;
                }
              });
            });
          }
        }
      });
    }
    this.tableData.userType = userTypeObj[this.tableData.userType];
    this.tableData.tfaStatus = cardAreaObj[this.tableData.tfaStatus];
    if (this.tableData.empowerGroup === '0') {
      this.tableData.empowerGroup = '无';
    }
    const result = await queryMerchantList({
      ebankCstmNo: this.tableData.ebankCstmNo,
      serchType: '1'
    });
    this.entType = result.body[0].entType
    console.log(this.entType,'entType')
    let lang = JSON.parse(sessionStorage.getItem('head')).lang;
    if (lang !== 'en' && result.body[0].entChsName !== '') {
      this.ebankCsInfo[0].entName = result.body[0].entChsName;
    } else {
      this.ebankCsInfo[0].entName = result.body[0].entEglsName;
    }
    this.ebankCsInfo[0].authStatus = CONSTANTS.ENABLE[result.body[0].status];
    if (this.tableData.menuPermissions.length !== 0) {
      this.getMenuList();
    }
    if (this.tableData.operatorAccounts.length !== 0) {
      this.operatorAccounts = this.tableData.operatorAccounts;
    }
    // this.ebankCsInfo[0].cardArea = cardAreaObj[result.body[0].cardArea];
  },
  methods: {
    getMenuList() {
       queryCBMenu().then(res => {
        res.body.menuList.forEach(item => {
          this.tableData.menuPermissions.forEach(type => {
            if (item.menuCode === type.menuCode) {
              type.transType = item.transType;
            }
          });
        });
        let newMenuPermissions = this.tableData.menuPermissions;
        newMenuPermissions.forEach(item => {
          if (item.menuClazz == '0') {
            item.pmenuCode = null;
          }
        });
        console.log(newMenuPermissions, 'this.detailData.menuPermissions');
        this.tableDataArr = formatTreeData(
          deepClone(newMenuPermissions),
          'menuCode',
          'pmenuCode'
        );
      });
    },
    async getCardTypeList() {
      if (sessionStorage.getItem('cardTypeList')) {
        this.cardTypeList = JSON.parse(sessionStorage.getItem('cardTypeList'));
      } else {
        const result = await getListCardType({
          bigGroupCode: 'language',
          fieldName: 'cardTypeInd'
        });
        if (result.body) {
          this.cardTypeList = result.body.cardTypeList;
          sessionStorage.setItem(
            'cardTypeList',
            JSON.stringify(this.cardTypeList)
          );
        }
      }
    },
    async getCardAreaList() {
      if (sessionStorage.getItem('cardAreaList')) {
        this.cardAreaList = JSON.parse(sessionStorage.getItem('cardAreaList'));
      } else {
        const result = await getListCardArea({
          bigGroupCode: 'language',
          fieldName: 'cardArea'
        });
        if (result.body) {
          this.cardAreaList = result.body.cardAreaList;
          sessionStorage.setItem(
            'cardAreaList',
            JSON.stringify(this.cardAreaList)
          );
        }
      }
    },
    cardTypeFilter(val) {
      console.log(this.cardTypeList, val);
      const value = this.cardTypeList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : '';
    },
    cardAreaFilter(val) {
      const value = this.cardAreaList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : '';
    },
    curFilter(val) {
      return filter.ccyFilter(val);
    },
    accountTypeFilter(val) {
      return filter.accountType(val);
    },
    accountFormat(val) {
      return filter.formatBankNo(val);
    },
  }
};
</script>

<style lang="scss" scoped>
.divider {
  // float:left;
  // margin: 10px 0;
  display: flex;
  // align-items: s;
  // background: #f3f3f3;
  height: 46px;
  width: 100%;
  margin-top: 36px;
  .bill {
    width: 4px;
    height: 46px;
    background: #f06b00;
    // border-radius: 8px;
  }

  .title {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    padding-left: 10px;
    font-weight: 500;
    line-height: 46px;
    text-align: left;
  }
}
.p-checkBox{
  width: 100%;
  padding: 10px 20px; 
  .p-checkBox-div{
    display: inline-block;
    padding: 5px 6px;
  }
}
</style>
