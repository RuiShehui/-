<!--
 * @Author: zhangcheng
 * @Date: 2021-11-12 14:45:04
 * @LastEditTime: 2022-09-26 10:02:48
 * @LastEditors: zhangcheng
 * @Description: 确认页
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\customer-acc-open-management.vue
-->
<template>
  <div class="transverse-table">
    <!--基本信息-->
    <div class="row">
      <div id="title">{{ $t('CUSTOMER_MANAGEMENT.BASE_INFO') }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') }}</div>
      <div>{{tableData.userMerchant.ebankStatus|ebankStatus}}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME') }}</div>
      <div>{{ tableData.userMerchant.entChsName || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME') }}</div>
      <div>{{ tableData.userMerchant.entEglsName }}</div>
    </div>
    <div v-for="(item,key) in tableData.userMerchant?tableData.userMerchant.cardList:[]" :key="key">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
        <div>{{ cardInfoFilter(item.cardType,cardTypeList) }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
        <div>{{ item.cardNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') }}</div>
        <div>{{ cardInfoFilter(item.cardArea,cardAreaList) }}</div>
      </div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_NAME') }}</div>
      <div>{{ tableData.userMerchant.contactsName }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
      <div>{{ tableData.userMerchant.contactsPhone }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2' }}</div>
      <div>{{ tableData.userMerchant.contactsPhone2 || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
      <div>{{ tableData.userMerchant.mobilePhone }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
      <div>{{ tableData.userMerchant.emailAddress }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
      <div>{{ tableData.userMerchant.entAddress }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
      <div>{{ tableData.userMerchant.entType | entType }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
      <div>{{ tableData.userMerchant.adminEmpower | adminEmpower }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
      <div>{{ tableData.userMerchant.accountManagerTeam }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
      <div>{{ tableData.userMerchant.accountManagerName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
      <div>{{ tableData.userMerchant.applicationDate }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
      <div>{{ tableData.userMerchant.remark }}</div>
    </div>
    <div class="row">
      <div>小額轉賬狀態</div>
      <div>{{ tableData.userMerchant.setStatus | setStatusFilter }}</div>
      <div v-if="tableData.userMerchant.setStatus==='1'">金額</div>
      <div v-if="tableData.userMerchant.setStatus==='1'">HKD {{ moneyFormat(String(tableData.userMerchant.limitAmount)) }}</div>
    </div>
    <div class="row">
      <div>限額級別</div>
      <div>{{ customerClazzFilter(tableData.userMerchant.customerClazz) }}</div>
    </div>
    <!--用户信息-->
    <div class="row">
      <div id="title">{{ $t('CUSTOMER_MANAGEMENT.USER_INFO') }}</div>
    </div>
    <div v-for="(item,index) in tableData.operatorList?tableData.operatorList:[]" :key="index+'0'">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_TYPE') }}</div>
        <div>{{ item.userType | userType }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_CHS_NAME') }}</div>
        <div>{{ item.userChsName || '- -' }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME') }}</div>
        <div>{{ item.userEglsName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
        <div>{{ cardInfoFilter(item.cardType,cardTypeList) }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
        <div>{{ item.cardNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CERTIFICATE_ISSUING_PLACE') }}</div>
        <div>{{ cardInfoFilter(item.cardArea,cardAreaList) }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.BIRTHDAY') }}</div>
        <div>{{ item.birthday || '- -' }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
        <div>{{ item.userPhone || '- -' }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2' }}</div>
        <div>{{ item.contactsPhone || '- -' }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
        <div>{{ item.email }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL') }}</div>
        <div>{{ item.empowerGroup | empowerGroup }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.TFA_STATUS') }}</div>
        <div>{{ item.tfaStatus | tfaStatus }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
        <div>{{ item.mobilePhone }}</div>
      </div>
      <div >
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS') }}</div>
          <div>{{ item.mailAddress }}</div>
          <div v-if="tableData.userMerchant.entType !== '1'">單一批核者</div>
          <div v-if="tableData.userMerchant.entType !== '1'">{{ item.cuSoleAuthorizerInd === '1' ? '開' : '關' }}</div>
        </div>

        <div v-if="item.cuSoleAuthorizerInd === '1' && tableData.userMerchant.entType !== '1'">
          <el-table :data="item.userAccountLimits" border stripe>
            <el-table-column align="center" prop="accountNo" label="特權賬戶" min-width="50%" />
            <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
            <el-table-column align="center" label="單一批核限額" min-width="50%">
              <template slot-scope="scope">
                <span>HKD {{scope.row.limitDailyAccount}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--授权模板-->
    <div v-if="tableData.authSettingList">
      <div class="row">
        <div id="title">{{ $t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE') }}</div>
      </div>
      <div
        v-for="(item,index) in tableData.authTemplateList?tableData.authTemplateList:[]"
        :key="index+'1'"
      >
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME') }}</div>
          <div>{{ item.modelName }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.MODEL_TYPE') }}</div>
          <div>{{ item.modelType|modelType }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.AUTH_PEOPLE_INFO') }}</div>
          <div>
            <p
              v-for="(itm, idx) of item.amuntUserList"
              :key="idx"
            >{{handleShowItem(itm,item.modelType)}}</p>
          </div>
        </div>
      </div>
    </div>
    <!--交易授权-->
    <div v-if="tableData.authTemplateList">
      <div class="row">
        <div id="title">{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_AUTHORIZATION') }}</div>
      </div>
      <div v-for="(item,index) in amountTemplate" :key="index+'2'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_TYPE_WITH_ACC') }}</div>
          <div>{{ item.acctNo }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TRANSACTION_TYPE_WITH_AMOUNT') }}</div>
          <div>{{ item.tradeTypeName }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME') }}</div>
          <div>{{ item.modelName }}</div>
        </div>
      </div>
      <div v-for="(item,index) in unAmountTemplate" :key="index+'3'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.NO_AMOUNT_TRANSACTION_TYPE') }}</div>
          <div>{{ item.tradeTypeName }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME') }}</div>
          <div>{{ item.modelName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import filters from '@/filters/clientManage';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import tool from '@/utils/moneyTools.js';
import { moneyFormat } from '@/utils/tools';
export default {
  name: 'CustomerAccountOpenConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {},
      amountTemplate: [],
      unAmountTemplate: [],
      cardTypeList: [],
      cardAreaList: []
    };
  },
  filters,
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getListCardType();
      this.getListCardArea();
      const { afterMdJson = '{}' } = this.options.temp,
        { body } = JSON.parse(afterMdJson);
      console.log('body', body);
      this.tableData = body;
      this.tableData.operatorList.forEach(item => {
        if (item.cuSoleAuthorizerInd === '1') {
          item.userAccountLimits.forEach(limtItem => {
            limtItem.limitDailyAccount = tool.currencyFormat(
              limtItem.limitDaily,
              '',
              2
            );
          });
        }
      });
      if (this.tableData.authSettingList) {
        this.isUniteAuth();
      }
    },
    moneyFormat,
    isUniteAuth() {
      this.tableData.authSettingList.forEach(item => {
        if (item.approvalType === '1') {
          this.amountTemplate.push(item);
        } else {
          this.unAmountTemplate.push(item);
        }
      });
    },
    handleShowItem(item, index) {
      let tpl;
      if (index === '1') {
        tpl = `${item.amountStart}<${this.$t('CUSTOMER_MANAGEMENT.MONEY')}≤${
          item.amountEnd
        } ${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C ;`;
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
  }
};
</script>

<style lang="scss" scoped>
</style>
