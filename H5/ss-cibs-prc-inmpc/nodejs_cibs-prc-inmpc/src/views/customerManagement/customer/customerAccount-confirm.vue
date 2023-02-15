<!--
 * @Author: zhangcheng
 * @Date: 2021-11-12 14:45:04
 * @LastEditTime: 2022-07-05 16:47:16
 * @LastEditors: zhangcheng
 * @Description: 确认页
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerAccount-confirm.vue
-->
<template>
  <div class="contain">
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BASE_INFO_CONFIRM')" name="option">
        <div class="transverse-table">
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
            <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2' }}</div>
            <div>{{ userMerchant.contactsPhone2 }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
            <div>{{ userMerchant.emailAddress }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
            <div>{{ userMerchant.entAddress }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
            <div>{{ userMerchant.entType | entType }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
            <div>{{ userMerchant.adminEmpower | adminEmpower }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
            <div>{{ userMerchant.accountManagerTeam }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
            <div>{{ userMerchant.accountManagerName }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
            <div>{{ userMerchant.applicationDate }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
            <div>{{ userMerchant.remark }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="option" class="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.USER_SETTING_CONFIRM')" name="option">
        <el-table
          class="g-table"
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
          <el-table-column
            width="110"
            prop="userPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')"
          />
          <el-table-column
            width="110"
            prop="contactsPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2'"
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
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
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
          :data="hasTrandeMo"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')" prop="tradeType"></el-table-column>
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
            <template slot-scope="scope">
              <p>{{scope.row.modelName}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="f-h-30"></div>
        <el-table
          class="g-margint15"
          :data="withoutTrandeMo"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')" prop="tradeType"></el-table-column>
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
  </div>
</template>

<script>
import _ from 'lodash';
import filters from '@/filters/clientManage';
import {
  openAccountConfirm,
  queryOpenStemp,
  queryOpenMerchantDetail
} from '@/api/customer-management/customer';

import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
export default {
  name: 'CustomerAccountOpenConfirm',
  data() {
    return {
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
      cardAreaList: []
    };
  },
  filters,
  methods: {
    async init() {
      this.getListCardType();
      this.getListCardArea();
      this.step = +this.$route.params.step;
      this.ebankCstmNo = this.$route.params.ebankCstmNo;
      const result = await queryOpenMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      this.entType = result.body.userMerchant.entType;
      this.operatorList = result.body.operatorList;
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
        this.$router.replace({
          name: 'CustomerAccountOpen',
          params: {
            submitData: result.body,
            step: this.step,
            ebankCstmNo: this.ebankCstmNo,
            entType: this.entType
          }
        });
        setTimeout(() => {
          this.$store.commit(
            'tabs/DELETE_TABS',
            '/customerManagement/customerAccountOpen/confirm' 
          );
        }, 0);
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
        this.$router.push({
          name: 'CustomerQueryOpen'
        });
        setTimeout(() => {
          this.$store.commit(
            'tabs/DELETE_TABS',
            '/customerManagement/customerAccountOpen' 
          );
          this.$store.commit(
            'tabs/DELETE_TABS',
            '/customerManagement/customerAccountOpen/confirm' 
          );
        }, 0);
      }
    },
    handleShowItem(item, index) {
      let tpl;
      if (index === '1') {
        tpl = `${item.amountStart}<${this.$t('CUSTOMER_MANAGEMENT.MONEY')}≤${
          item.amountEnd
        }, ${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C`;
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
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
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
.option {
  margin-top: 32px;
}
.g-margint15 {
  margin-top: 15px;
}
</style>