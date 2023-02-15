<!--
 * @Author: zhangcheng
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-11-14 08:58:10
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\user\confirm.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_TYPE') }}</div>
      <div>{{ detailData.userType | userType }}</div>
      <div v-if="showLoginName">{{ $t('CUSTOMER_MANAGEMENT.USER_CODE') }}</div>
      <div v-if="showLoginName">{{ detailData.userCode }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_CHS_NAME') }}</div>
      <div>{{ detailData.userChsName || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME') }}</div>
      <div>{{ detailData.userEglsName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
      <div v-if="showLoginName">{{ detailData.cardType }}</div>
      <div v-else>{{ detailData.cardType }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
      <div>{{ detailData.cardNo }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') }}</div>
      <div v-if="showLoginName">{{ cardAreaFilter(detailData.cardType) }}</div>
      <div v-else>{{ detailData.cardArea }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.BIRTHDAY') }}</div>
      <div>{{ detailData.birthday }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_STATUS') }}</div>
      <div>{{ detailData.status | userStatus }}</div>
      <div v-if="detailData.status === '0'">停用時間</div>
      <div v-if="detailData.status === '1' && detailData.reactivateDate !==null">啟用時間</div>
      <div v-if="detailData.status === '0' || (detailData.status === '1' && detailData.reactivateDate !==null)"
      >{{ detailData.status === '0'?detailData.revokeDte:detailData.reactivateDate }}</div>
    </div>
    <div class="row" v-if="detailData.status === '0'">
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_STOP_REASON') }}</div>
      <div>{{ detailData.revokeReason || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL') }}</div>
      <div>{{ detailData.empowerGroup | empowerGroup }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.TFA_STATUS') }}</div>
      <div>{{ detailData.tfaStatus | tfaStatus }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
      <div>{{ detailData.userPhone || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2' }}</div>
      <div>{{ detailData.contactsPhone || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
      <div>{{ detailData.email }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
      <div>{{ detailData.mobilePhone }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS') }}</div>
      <div>{{ detailData.mailAddress }}</div>
      <div v-if="detailData.cuSoleAuthorizerInd !== '2'">單一批核者特權</div>
      <div
        v-if="detailData.cuSoleAuthorizerInd !== '2'"
      >{{ detailData.cuSoleAuthorizerInd === '1' ? '開' : '關' }}</div>
    </div>

    <div style="margin-top: 24px" v-if="detailData.cuSoleAuthorizerInd === '1'">
      <div>
        <span class="privilegedAccount">特權賬戶</span>
      </div>
      <div style="display: flex">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
      <div style="display: flex">
        <el-table
          :data="detailData.userAccountLimits"
          border
          stripe
          style="width: 85%; margin-left: 110px"
        >
          <el-table-column align="center" prop="accountNoCury" label="特權賬戶" min-width="50%" />
          <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
          <el-table-column align="center" label="單一批核限額" min-width="50%">
            <template slot-scope="scope">
              <span>HKD {{scope.row.limitDaily}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="divider" v-if="entType=='2'">
      <div class="bill"></div>
      <div class="title">服务设定</div>
      <slot />
    </div>
    <div style="margin-top:20px;" v-if="entType=='2'">
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
          :label="$t('AUTHORIZE.ALL')"
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
          :label="$t('AUTHORIZE.ALL')"
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
    <div class="divider"  v-if="entType=='2'">
      <div class="bill"></div>
      <div class="title">账户选择设置</div>
      <slot />
    </div>
    <div class="p-checkBox"  v-if="entType=='2'">
      <div  class="p-checkBox-div"   v-for="(item, index) in operatorAccounts" :key="index">
        <span class="u-span">
          {{accountFormat(item.accountNo)}} 
          <span v-show="item.currencyType">-{{curFilter(item.currencyType)}}-</span>
          {{accountTypeFilter(item.accountType)}};
        </span>
      </div>
    </div>
    <div class="g-bottom" v-if="isBack">
      <el-button type="primary" @click="backIndex">{{ $t('CUSTOMER_MANAGEMENT.BACK') }}</el-button>
    </div>
    <div class="g-bottom" v-if="isAdd">
      <el-button class="f-cancel" @click="backOperate">{{ $t('CUSTOMER_MANAGEMENT.LASTSTEP') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('CUSTOMER_MANAGEMENT.CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import CONSTANTS from '@/utils/constant';
import tool from '@/utils/moneyTools.js';
import { formatTreeData, deepClone, treeToArray } from '@/utils/tree-table.js';
import { queryCBMenu } from '@/api/customer-management/customer';
import filter from '@/filters/public.js';
export default {
  name: 'UserMaintainConfirm',
  props: {
    detailData: {
      type: Object,
      default: () => ({})
    },
    showLoginName: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    entType: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  filters,
  filter: {
    
    ccyFilter: filter.ccyFilter,
    accountType: filter.accountType,
    formatBankNo: filter.formatBankNo
  },
  data() {
    return {
      cardTypeList: [],
      cardAreaList: [],
      tableDataArr: [],
      operatorAccounts:[]
    };
  },
  mounted() {
    console.log(this.showLoginName, 'showLoginName');
    this.handleData();
    this.getCardTypeList();
    this.getCardAreaList();
    if(this.detailData.menuPermissions.length!== 0){
      console.log(1)
      this.getMenuList();
    }
    if(this.detailData.operatorAccounts.length!==0){
       this.operatorAccounts = this.detailData.operatorAccounts
    }
   
  },
  methods: {
    getMenuList() {
      queryCBMenu().then(res => {
        res.body.menuList.forEach(item => {
          this.detailData.menuPermissions.forEach(type => {
            if (item.menuCode === type.menuCode) {
              type.transType = item.transType;
            }
          });
        });
        let newMenuPermissions = this.detailData.menuPermissions;
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
    backIndex() {
      this.$emit('backIndex');
    },
    backOperate() {
      this.$emit('backIndex', this.detailData);
    },
    submit() {
      if (this.detailData.cuSoleAuthorizerInd === '1') {
        this.detailData.userAccountLimits.forEach(item => {
          item.limitDaily = tool.delDecollator(item.limitDaily);
        });
      }
      // if(this.detailData.userType=='1'){
      //   consoloe.log(1)
      //   this.showLoginName = true 
      // }
      console.log(this.isAdd,'this.showLoginName')
      this.$emit('submitData',{ showLoginName: this.detailData.showLoginName,confirmData:{...this.detailData}})
    },
    //
    handleData() {
      console.log('daaadad', this.detailData);
      if (this.detailData.cuSoleAuthorizerInd === '1') {
        this.detailData.userAccountLimits.forEach(item => {
          if (item.accountNo === 'ALL') {
            item.accountNoCury = item.accountNo;
          }
          item.limitDaily = tool.currencyFormat(item.limitDaily, '', 2);
          if (this.detailData.accountList) {
            this.detailData.accountList.forEach(accItem => {
              if (item.accountNo === accItem.accNo) {
                item.accountNoCury = accItem.label;
              }
            });
          } else {
            let accTypeName = '';
            let currencyName = '';
            if (item.accountType) {
              accTypeName = CONSTANTS.accountTypes[item.accountType];
            }
            if (item.currencyType) {
              currencyName = item.currencyType;
            }
            item.accountNoCury =
              item.accountNo + ' ' + currencyName + ' ' + accTypeName;
          }
        });
      }
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
      const value = this.cardTypeList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : val;
    },
    cardAreaFilter(val) {
      const value = this.cardAreaList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : val;
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
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}

.privilegedAccount {
  font-size: 18px;
  font-weight: 500;
  margin-left: 25px;
}
.line1 {
  width: 120px;
  border: solid 3px transparent;
  border-bottom-color: #000000;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 10px;
}
.line2 {
  width: 100%;
  border: solid 1px transparent;
  border-bottom-color: #000000;
  margin-bottom: 20px;
  margin-top: 10px;
}
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