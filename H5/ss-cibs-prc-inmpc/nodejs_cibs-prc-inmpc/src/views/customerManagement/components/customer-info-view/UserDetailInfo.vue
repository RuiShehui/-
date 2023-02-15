<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 16:09:13
 * @LastEditTime: 2022-11-15 14:38:46
 * @LastEditors: Please set LastEditors
 * @Description: 客户信息概览用户详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\UserDetailInfo.vue
-->
<template>
  <div>
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BASE_INFO')" name="option"></el-tab-pane>
    </el-tabs>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_TYPE') }}</div>
        <div>{{ tableData.userType | userType }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.LOGIN_NAME') }}</div>
        <div>{{ tableData.loginName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_CHS_NAME') }}</div>
        <div>{{ tableData.userChsName || '- -' }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME') }}</div>
        <div>{{ tableData.userEglsName}}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</div>
        <div>{{ tableData.cardType }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') }}</div>
        <div>{{ tableData.cardNo}}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') }}</div>
        <div>{{ tableData.cardArea }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.BIRTHDAY') }}</div>
        <div>{{ tableData.birthday || '- -' }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_STATUS') }}</div>
        <div>{{ tableData.status | userStatus }}</div>
        <div v-if="tableData.status === '0'">停用時間</div>
        <div v-if="tableData.status === '1' && tableData.reactivateDate !==null">啟用時間</div>
        <div
          v-if="tableData.status === '0' || (tableData.status === '1' && tableData.reactivateDate !==null)"
        >{{ tableData.status === '0'?tableData.revokeDte:tableData.reactivateDate }}</div>
      </div>
      <div class="row" v-if="tableData.status === '0'">
        <div>{{ $t('CUSTOMER_MANAGEMENT.USER_STOP_REASON') }}</div>
        <div>{{ tableData.revokeReason || '- -' }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.TFA_STATUS') }}</div>
        <div>{{ tableData.tfaStatus | tfaStatus }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL') }}</div>
        <div>{{ tableData.empowerGroup | empowerGroup }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
        <div>{{ tableData.userPhone || '- -' }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2' }}</div>
        <div>{{ tableData.contactsPhone2 || '- -' }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
        <div>{{ tableData.email}}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
        <div>{{ tableData.mobilePhone }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS') }}</div>
        <div>{{ tableData.mailAddress}}</div>
        <div v-if="tableData.cuSoleAuthorizerInd !== '2' && entType === '2'">單一批核者特權</div>
        <div
          v-if="tableData.cuSoleAuthorizerInd !== '2' && entType === '2'"
        >{{ tableData.cuSoleAuthorizerInd === '1' ? '開' : '關'}}</div>
      </div>
    </div>

    <div style="margin-top: 24px" v-if="tableData.cuSoleAuthorizerInd === '1'">
      <div>
        <span class="privilegedAccount">特權賬戶</span>
      </div>
      <div style="display: flex">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
      <div style="display: flex">
        <el-table :data="tableData.userAccountLimits" border stripe style="width: 100%;">
          <el-table-column align="center" prop="accountNo" label="特權賬戶" min-width="50%" />
          <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
          <el-table-column align="center" label="單一批核限額" min-width="50%">
            <template slot-scope="scope">
              <span>HKD {{scope.row.limitDaily}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <el-tabs v-model="option" class="g-mt-32">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.OP_ACCOUNT_INFO')" name="option"></el-tab-pane>
    </el-tabs>-->
    <!-- <el-table
      :data="accountInfo"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.QUERY')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ENTRY')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.AUTH')"></el-table-column>
    </el-table>
    <el-tabs v-model="option" class="g-mt-32">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.MENU_TREE')" name="option"></el-tab-pane>
    </el-tabs>
    <el-tree :data="menuTree"></el-tree>-->
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import { queryOperatorDetail } from '@/api/customer-management/user';
import { findUserRoleMenuList } from '@/api/menu-management/index.js';
import { getPaymentCommAccountList } from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant';
import tool from '@/utils/moneyTools.js';
import filters from '@/filters/clientManage';
export default {
  name: 'UserDetailInfo',
  props: {
    userCode: {
      type: String,
      default: ''
    },
    entType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: {
        channel: '',
        loginName: '',
        userChsName: '',
        userEglsName: '',
        cardType: '',
        cardNo: '',
        userStatus: '',
        authLevel: '',
        tfaStatus: '',
        cardArea: '',
        birthday: '',
        phone: '',
        emilAddress: '',
        mobilePhone: ''
      },
      option: 'option',
      accountInfo: [
        {
          accountNo: '1'
        },
        {
          accountNo: '1'
        }
      ],
      menuTree: [
        {
          label: '1',
          children: [
            {
              label: '1-1'
            }
          ]
        },
        {
          label: '2',
          children: [
            {
              label: '2-1'
            }
          ]
        },
        {
          label: '3',
          children: [
            {
              label: '3-1'
            }
          ]
        }
      ]
    };
  },
  filters,
  methods: {
    back() {
      this.$emit('backIndex');
    },
    async queryOperatorDetail() {
      const result = await queryOperatorDetail({
        userCode: this.userCode
      });
      if (result.body) {
        if (result.body.cuSoleAuthorizerInd === '1') {
          getPaymentCommAccountList({
            ebankCustNo: result.body.ebankCstmNo
          }).then(resp => {
            console.log('resp', resp);
            if (resp.body) {
              if (resp.body.accList.length > 0) {
                result.body.userAccountLimits.forEach(uItem => {
                  uItem.limitDaily = tool.currencyFormat(
                    uItem.limitDaily,
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

                    if (uItem.accountNo === item.accNo) {
                      uItem.accountNo =
                        item.accNo + ' ' + currencyName + ' ' + accTypeName;
                    }
                  });
                });
                this.tableData = result.body;
              } else {
                this.tableData = result.body;
                this.tableData.userAccountLimits.forEach(item => {
                  item.limitDaily = tool.currencyFormat(item.limitDaily, '', 2);
                });
              }
            } else {
              this.tableData = result.body;
              this.tableData.userAccountLimits.forEach(item => {
                item.limitDaily = tool.currencyFormat(item.limitDaily, '', 2);
              });
            }
          });
        } else {
          this.tableData = result.body;
        }
      }
    },
    async findUserRoleMenuList() {
      const result = await findUserRoleMenuList({
        userCode: this.userCode
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        console.log(result);
      }
    }
  },
  created() {
    this.queryOperatorDetail();
    console.log('this.entType', this.entType);
    // this.findUserRoleMenuList();
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
}
.g-mt-32 {
  margin-top: 32px;
}
</style>
