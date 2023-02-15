<!--
 * @Author: zhangcheng
 * @Date: 2021-11-12 14:45:04
 * @LastEditTime: 2022-11-03 16:42:26
 * @LastEditors: Please set LastEditors
 * @Description: 确认页
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-account-open\CustomerAccountConfirm.vue
-->
<template>
  <div>
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BASE_INFO_CONFIRM')" name="option">
        <div class="transverse-table mt25">
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') }}</div>
            <div>{{ userMerchant.ebankStatus | ebankStatus }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME') }}</div>
            <div>{{ userMerchant.entChsName }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME') }}</div>
            <div>{{ userMerchant.entEglsName }}</div>
          </div>
          <div v-for="(item,index) in userMerchant?userMerchant.cardList:[]" :key="index">
            <div class="row">
              <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (index+1) }}</div>
              <div>{{ cardInfoFilter(item.cardType,cardTypeList) }}</div>
              <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') + (index+1) }}</div>
              <div>{{ item.cardNo }}</div>
            </div>
            <div class="row">
              <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') + (index+1) }}</div>
              <div>{{ cardInfoFilter(item.cardArea,cardTypeList) }}</div>
            </div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_NAME') }}</div>
            <div>{{ userMerchant.contactsName }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
            <div>{{ userMerchant.contactsPhone }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') +'2' }}</div>
            <div>{{ userMerchant.contactsPhone2 }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
            <div>{{ userMerchant.mobilePhone }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
            <div>{{ userMerchant.emailAddress }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
            <div>{{ userMerchant.entAddress }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
            <div>{{ userMerchant.entType | entType }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
            <div>{{ userMerchant.adminEmpower | adminEmpower }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
            <div>{{ userMerchant.accountManagerTeam }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
            <div>{{ userMerchant.accountManagerName }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
            <div>{{ userMerchant.applicationDate }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
            <div>{{ userMerchant.remark }}</div>
          </div>
          <div class="row">
            <div>小額轉賬狀態</div>
            <div>{{ userMerchant.setStatus | setStatusFilter }}</div>
            <div v-if="userMerchant.setStatus==='1'">金額</div>
            <div
              v-if="userMerchant.setStatus==='1'"
            >HKD {{ moneyFormat(String(userMerchant.limitAmount)) }}</div>
          </div>
          <div class="row">
            <div>限額級別</div>
            <div>{{ customerClazzFilter(userMerchant.customerClazz) }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="option" class="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.USER_SETTING_CONFIRM')" name="option">
        <el-table
          class="mt25"
          :data="operatorList"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')" />
          <el-table-column prop="userType" :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')">
            <template slot-scope="scope">{{ scope.row.userType | userType }}</template>
          </el-table-column>
          <!-- <el-table-column
            width="100"
            prop="loginName"
            :label="$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')"
          />-->
          <el-table-column
            width="100"
            prop="userChsName"
            :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')"
          />
          <el-table-column
            width="100"
            prop="userEglsName"
            :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')"
          />
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')">
            <template slot-scope="scope">{{cardInfoFilter(scope.row.cardType,cardTypeList)}}</template>
          </el-table-column>
          <el-table-column width="180" prop="cardNo" :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')" />
          <el-table-column width="100" :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')">
            <template slot-scope="scope">{{cardInfoFilter(scope.row.cardArea,cardAreaList)}}</template>
          </el-table-column>
          <el-table-column width="110" prop="birthday" :label="$t('CUSTOMER_MANAGEMENT.BIRTHDAY')" />
          <el-table-column
            width="110"
            prop="userPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')"
          />
          <el-table-column
            width="110"
            prop="contactsPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') +'2'"
          />
          <el-table-column
            width="170"
            prop="email"
            :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')"
          />
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')">
            <template slot-scope="scope">{{ scope.row.empowerGroup | empowerGroup }}</template>
          </el-table-column>
          <el-table-column width="150" :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')">
            <template slot-scope="scope">{{ scope.row.tfaStatus | tfaStatus }}</template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="mobilePhone"
            :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')"
          />
          <el-table-column
            width="120"
            prop="mailAddress"
            :label="$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')"
          />
          <el-table-column
            width="120"
            v-if="entType === '2'"
            prop="cuSoleAuthorizerInd"
            label="單一批核者特權"
          >
            <template slot-scope="scope">{{scope.row.cuSoleAuthorizerInd === '1' ? '開' : '關'}}</template>
          </el-table-column>
          <el-table-column width="120" v-if="entType === '2'" prop="privilegedAccount" label="特權賬戶">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="u-btnColor"
                @click="detailBtn(scope.row)"
              >{{ scope.row.privilegedAccount }}</el-button>
            </template>
          </el-table-column>
          <el-table-column width="120" v-if="entType === '2'" label="操作">
            <template slot-scope="scope">
              <el-button type="text" class="u-btnColor" @click="toMenuList(scope.row)">查看權限</el-button>
            </template>
          </el-table-column>
          <el-empty
            slot="empty"
            :image="require('@/img/table-empty.png')"
            :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
          ></el-empty>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-if="step === 4" v-model="option" class="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_SETTING_CONFIRM')" name="option">
        <el-table
          :data="authTemplateList"
          class="mt25"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')" width="80"></el-table-column>
          <el-table-column prop="modelName" :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')"></el-table-column>
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.APPROVAL_TYPE')">
            <template slot-scope="scope">{{ scope.row.modelType | modelType }}</template>
          </el-table-column>
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.AUTH_PEOPLE_INFO')">
            <template slot-scope="scope">
              <p
                v-for="(itm, idx) of scope.row.amuntUserList"
                :key="idx"
              >{{ handleShowItem(itm,scope.row.modelType) }}</p>
            </template>
          </el-table-column>
          <el-empty
            slot="empty"
            :image="require('@/img/table-empty.png')"
            :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
          ></el-empty>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-if="step === 4" v-model="option" class="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.TRANS_AUTH_SETTING_CONFIRM')" name="option">
        <el-table
          class="mt25"
          :data="hasTrandeMo"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_CARD')" prop="acctNo"></el-table-column>
          <el-table-column
            :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')"
            prop="tradeTypeName"
          >
            <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
          </el-table-column>
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
            <template slot-scope="scope">
              <p>{{scope.row.modelName}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="f-h-30"></div>
        <el-table
          class="mt25"
          :data="withoutTrandeMo"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column
            :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')"
            prop="tradeTypeName"
          >
            <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
          </el-table-column>
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
            <template slot-scope="scope">
              <p>{{scope.row.modelName}}</p>
            </template>
          </el-table-column>
        </el-table>
        <el-form label-suffix=":" class="m-t-20">
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.SETTING_TEMPLATE')"
          >{{ authSettingList[0].sequence | sequence }}</el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="g-bottom">
      <el-button class="f-cancel" @click="lastStep">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>

    <!-- 特权账号详情 -->
    <PopUp ref="detail" width="1026px">
      <el-table :data="approvalData" border stripe>
        <el-table-column align="center" prop="accountNo" label="特權賬戶" min-width="50%" />
        <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
        <el-table-column align="center" label="單一批核限額" min-width="50%">
          <template slot-scope="scope">
            <span>HKD {{scope.row.limitDailyAccount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </PopUp>

    <PopUp
      ref="userPermission"
      width="1026px"
      :confirmField="confirmField"
      @confirm="confirmPopUp('intestRate')"
    >
      <el-table
        :data="
          menuList
        "
        ref="tableData"
        row-key="menuCode"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column width="350" prop="menuName" label="菜单名稱" label-class-name="labelClass">
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="全選" prop="entryPermission" label-class-name="labelClass">
          <template slot="header">
            <el-checkbox
              :indeterminate="isIndeterminate1"
              v-model="queryAll"
              disabled
              @change="querySelectAll"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-show="scope.row.queryShowFlag"
              v-model="scope.row.queryFlag"
              disabled
              @change="querySelect(scope.$index, scope.row)"
            >查詢</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="entryPermission" label="全選" label-class-name="labelClass">
          <template slot="header">
            <el-checkbox
              :indeterminate="isIndeterminate2"
              v-model="entryAll"
              disabled
              @change="entrySelectAll"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.createFlag"
              disabled
              @change="entrySelect(scope.$index, scope.row)"
            >錄入</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="authAll" label-class-name="labelClass">
          <template slot="header">
            <el-checkbox
              :indeterminate="isIndeterminate3"
              v-model="authAll"
              disabled
              @change="authSelectAll"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.grantFlag"
              disabled
              @change="authSelect(scope.$index, scope.row)"
            >審批</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </PopUp>

    <PopUp ref="accountNo" width="1026px" :confirmField="confims">
      <div class="divider">
        <div class="bill"></div>
        <div class="title">賬戶選擇設置</div>
        <slot />
      </div>
      <div class="p-checkBox" style="overflow: auto">
        <div v-for="(item, index) in PopAccount" :key="index" style="margin:12px">
          <div
            class="accountCheck"
          >{{item.accountNo}}-{{item.currencyType}}-{{item.accountType}}</div>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import _ from 'lodash';
import PopUp from '@/components/common/dialog/PopUp.vue';
import filters from '@/filters/clientManage';
import businessFilters from '@/filters/business.js';
import tool from '@/utils/moneyTools.js';
import { moneyFormat } from '@/utils/tools';
import {
  openAccountConfirm,
  queryOpenStemp,
  queryOpenMerchantDetail
} from '@/api/customer-management/customer';

import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import {
  formatTreeData,
  deepClone,
  unique,
  treeToArray
} from '@/utils/tree-table.js';
import { queryCBMenu } from '@/api/customer-management/customer';
export default {
  components: {
    PopUp
  },
  name: 'CustomerAccountOpenConfirm',
  data() {
    return {
      approvalData: [], //特权账号数组
      option: 'option',
      step: 1,
      authSettingList: [{}],
      authTemplateList: [],
      userMerchant: [],
      operatorList: [],
      hasTrandeMo: [],
      withoutTrandeMo: [],
      entType: '',
      cardTypeList: [],
      cardAreaList: [],
      menuList: [],
      queryAll: true, // 控制查询的全部标识
      authAll: true, // 控制授权的全部标识
      entryAll: true, // 控制录入的全部标识
      isIndeterminate1: false,
      isIndeterminate2: false,
      isIndeterminate3: false,
      update: false,
      queryData: [], // 用于存储【查询权限】
      authData: [], // 用于存储【授权权限】
      entryData: [], // 用于存储【录入权限】
       confirmField: '下一步',
      confims: '確認',
      PopAccount:[]
    };
  },
  props: {
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    cstmNo: {
      type: String,
      default: ''
    }
  },
  filters: {
    ...filters,
    ...businessFilters
  },
  methods: {
    moneyFormat,
    async init() {
      this.getListCardType();
      this.getListCardArea();
      this.step = Number(this.params.step);
      this.ebankCstmNo = this.params.ebankCstmNo;
      const result = await queryOpenMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      console.log('打印resp', result);
      this.entType = result.body.userMerchant.entType;
      this.operatorList = result.body.operatorList;
      if (this.operatorList.length > 0) {
        this.operatorList.forEach(item => {
          if (item.userAccountLimits && item.userAccountLimits.length > 0) {
            item.privilegedAccount = item.userAccountLimits.length;
          } else {
            item.privilegedAccount = '無';
          }
        });
      }
      this.userMerchant = result.body.userMerchant;
      this.authSettingList = result.body.authSettingList;
      this.authTemplateList = result.body.authTemplateList;
      if (this.authSettingList) {
        this.hasTrandeMo = [];
        this.withoutTrandeMo = [];
        this.authSettingList.forEach(item => {
          if (item.approvalType === '1') {
            this.hasTrandeMo.push(item);
          } else {
            this.withoutTrandeMo.push(item);
          }
        });
      }
    },
    async lastStep() {
      const result = await queryOpenStemp({
        ebankCstmNo: this.ebankCstmNo,
        stemp: this.step + ''
      });
      if (result.body) {
        const data = {
          submitData: result.body,
          step: this.step,
          cstmNo: this.cstmNo,
          ebankCstmNo: this.ebankCstmNo,
          entType: this.entType,
          oprarete: this.params.oprarete
        };
        console.log('data', data);
        this.$emit('showIndex', data);
      }
    },
    async confirm() {
      let result = await openAccountConfirm({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.OPEN_ACCOUNT_SUCCESS'),
          type: 'success'
        });
        this.$emit('showQuery');
      }
    },
    handleShowItem(item, index) {
      let tpl;
      if (index === '1') {
        tpl = `${moneyFormat(item.amountStart)}<${this.$t(
          'CUSTOMER_MANAGEMENT.MONEY'
        )}≤${moneyFormat(item.amountEnd)}, ${item.levelANumber}A ${
          item.levelBNumber
        }B ${item.levelCNumber}C`;
      } else {
        tpl = `${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C`;
      }
      return tpl;
    },
    cardInfoFilter(val, array) {
      if (array && array.length !== 0) {
        const result = array.find(item => item.fieldValue === val);
        if (result) {
          return result.fiedlDescrible;
        } else {
          return val;
        }
      }
    },
    async getListCardType() {
      const result = await getListCardType({
        bigGroupCode: 'language',
        fieldName: 'cardTypeInd'
      });
      if (result.body) {
        this.cardTypeList = result.body.cardTypeList;
      }
    },
    async getListCardArea() {
      const result = await getListCardArea({
        bigGroupCode: 'language',
        fieldName: 'cardArea'
      });
      if (result.body) {
        this.cardAreaList = result.body.cardAreaList;
      }
    },
    //特权账户详情
    detailBtn(row) {
      console.log('row', row);
      if (row.cuSoleAuthorizerInd === '1') {
        row.userAccountLimits.forEach(item => {
          item.limitDailyAccount = tool.currencyFormat(item.limitDaily, '', 2);
        });
        this.approvalData = row.userAccountLimits;
        this.$refs.detail.showDialog();
      }
    },
    toMenuList(row) {
      console.log(this.menuList,'menU')
      if(this.menuList.length==0){
         queryCBMenu().then(res => {
        row.menuPermissions;
        res.body.menuList.forEach(item => {
          row.menuPermissions.forEach(type => {
            if (item.menuCode === type.menuCode) {
              type.transType = item.transType;
            }
          });
        });
        let newMenuPermissions = row.menuPermissions;
        let resut = [...new Set(newMenuPermissions)];
        resut.forEach(item => {
          if (
            item.transType == '2' ||
            item.transType == '3' ||
            item.transType == 'P'
          ) {
            item.queryShowFlag = false;
          } else {
            item.queryShowFlag = true;
          }
          if (item.menuClazz == '0') {
            item.pmenuCode = null;
          }
          if (item.transType == '1') {
            item.createDisabledFlag = true; //录入禁用
            item.grantDisabledFlag = true; //授权禁用
          } else {
            item.createDisabledFlag = false; //录入禁用
            if (
              row.userType == '3' ||
              row.empowerGroup == '0' ||
              row.userType === '0'
            ) {
              item.grantDisabledFlag = true; //授权禁用
            } else {
              item.grantDisabledFlag = false; //授权禁用
            }
          }
        });
        this.menuList = formatTreeData(
          deepClone(resut),
          'menuCode',
          'pmenuCode'
        );
      });
      }
     
      this.PopAccount = row.operatorAccounts
      this.$refs.userPermission.showDialog();
      
      console.log(row, 'row');
    },
    // 授权权限的全部change事件
    entrySelectAll(val) {
      this.isIndeterminate2 = false;
      this.menuList.map(el => {
        el.entryChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.entryChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.entryChecked = val));
            }
          });
        }
      });
      if (this.entryAll) {
        this.menuList.map(item => {
          this.entryData.push(item);
        });
      } else {
        this.entryData = [];
      }
    },

    // 授权权限的全部change事件
    authSelectAll(val) {
      this.isIndeterminate3 = false;
      this.menuList.map(el => {
        el.authChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.authChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.authChecked = val));
            }
          });
        }
      });
      if (this.authAll) {
        this.menuList.map(item => {
          this.authData.push(item);
        });
      } else {
        this.authData = [];
      }
    },
    confirmPopUp(){
      console.log(this.PopAccount )
      this.$refs.accountNo.showDialog();
    },
    querySelect(index, row) {
      this.isIndeterminate1 = true;
      if (row.queryChecked) {
        this.queryData.push(row);
      }
    },
    entrySelect(index, row) {
      this.isIndeterminate2 = true;
      if (row.entryChecked) {
        this.entryData.push(row);
      }
    },
    authSelect(index, row) {
      this.isIndeterminate3 = true;
      if (row.authChecked) {
        this.authData.push(row);
      }
    },
    querySelectAll(val) {
      this.isIndeterminate1 = false;
      this.menuList.map(el => {
        el.queryChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.queryChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.queryChecked = val));
            }
          });
        }
      });
      if (this.queryAll) {
        this.menuList.map(item => {
          this.queryData.push(item);
        });
      } else {
        this.queryData = [];
      }
    },
    customerClazzFilter(val) {
      const number = Number(val);
      if (number === 0 || (number && number < 26)) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        ) + '級';
      } else {
        return val;
      }
    }
  },
  created() {
    this.init();
    console.log('进入结果确认页', this.params);
    console.log('进入结果确认页', this.cstmNo);
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
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.m-t-20 {
  margin-top: 20px;
}
.mt25 {
  margin-top: 25px;
}
.option {
  margin-top: 32px;
}
.divider {
  // float:left;
  // margin: 10px 0;
  display: flex;
  // align-items: s;
  background: #f3f3f3;
  height: 46px;
  width: 100%;
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
</style>