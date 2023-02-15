<template>
  <div class="u-bindingAccount">
    <p>
      <i class="el-icon-bell u-color"></i>
      <span class="f12 gray3">{{$t('USER_MANAGERMENT.STATEMENTS')}}</span>
    </p>
    <div class="u-inputInfo">
      <el-table :data="accountData" v-loading="loading" stripe>
        <el-table-column prop="contactInfomation" :label="$t('USER_MANAGERMENT.CONTACT_INFORMATION')" min-width="15%"></el-table-column>
        <el-table-column prop="numberDesen" :label="$t('USER_MANAGERMENT.NUMBER')" min-width="30"></el-table-column>
        <el-table-column :label="$t('FIXED_DEPOSIT_OVERVIEW.STATUS')" min-width="10%">
          <template slot-scope="scope">{{ scope.row.status === "1" ? $t('USER_MANAGERMENT.Y_BIND') : $t('USER_MANAGERMENT.N_BIND') }}</template>
        </el-table-column>
        <el-table-column prop="bindingAccount" :label="$t('USER_MANAGERMENT.BIND_ACCOUNT')" min-width="30%">
          <template slot-scope="scope">
            <div
              style="margin-left: 0px"
              v-for="(item,index) in scope.row.bindingAccount"
              :key="index"
            >
              <span>{{item}}</span>
            </div>
            <div v-if="scope.row.bindingAccount.length === 0">
              <span>- -</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ACCOUNT_MANAGEMENT.OPERATION')" min-width="15%" align="left">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== '1'"
              class="u-tableBtn"
              @click="contactClick(scope.row)"
              type="text"
            >{{$t('USER_MANAGERMENT.BIND')}}</el-button>
            <el-button
              v-if="scope.row.status === '1'"
              class="u-tableBtn"
              @click="fUncontactClick(scope.row)"
              type="text"
            >{{$t('USER_MANAGERMENT.UNBOUND')}}</el-button>
            <el-button v-if="scope.row.status === '1'" @click="fModify(scope.row)" type="text">{{$t('AUTHORIZE.UPDATE')}}</el-button>
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
        layout="prev,pager,next,sizes,jumper"
        :total="accountData.length"
      />
    </div>
    <div class="u-mt161">
      <p class="f14 mb12" style="font-size: 16px">{{$t('ACCOUNT_MANAGEMENT.TIPS_TITLE')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.ONE_TIPS')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.TWO_TIPS')}}</p>
      <p class="f12 gray3" style="font-size: 14px">{{$t('USER_MANAGERMENT.TWO_TIPS_O')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.TWO_TIPS_T')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.THREE_TIPS')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.FOUR_TIPS')}}</p>
      <p
        class="f12 gray3"
        style="font-size: 14px"
      >{{$t('USER_MANAGERMENT.FIVE_TIPS')}}</p>
      <p class="f12 gray3" style="font-size: 14px">{{$t('USER_MANAGERMENT.SIX_TIPS')}}</p>
      <p class="f12 gray3" style="font-size: 14px">{{$t('USER_MANAGERMENT.SEVEN_TIPS')}}</p>
    </div>
  </div>
</template>
<script>
import {
  checkLanguage,
  checkCustomInfo,
  checkPhoneInfo,
  checkEmailInfo,
  queryBindingInfo,
  bindingCheck,
  queryT24Info,
  getInfo
} from '@/api/FPSAccountBinding.js';
import CONSTANTS from '@/utils/contants.js';
import { dsMobile } from '@/utils/mathTools';
export default {
  data() {
    return {
      // N 未绑定  Y 已绑定
      accountData: [],
      // 分页控制
      page: {
        currentPage: 1,
        pageSize: 10
      },
      loading: true,
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
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.checkBinding();
    // this.queryBinding();
  },
  methods: {
    //判断客户名是否已变更
    checkBinding() {
      bindingCheck().then(resp => {
        console.log('resp', resp);
        if (resp.checkCode === 'SUCCESS') {
          this.queryBinding();
        } else {
          let tipsTitle = '';
          if (resp.checkCode === '1') {
            tipsTitle = this.$t('USER_MANAGERMENT.BIAN_HUA');
            this.$confirm({
              title: this.$t('COMMON.TISHI'),
              message: tipsTitle,
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText:this.$t('COMMON.DETERMINE')
              },
              isCancle: true
            }).then(() => {});
            this.queryBinding();
          } else {
            if (resp.checkCode === '2') {
              tipsTitle =
                this.$t('USER_MANAGERMENT.YULIU_PHONE');
            }
            if (resp.checkCode === '3') {
              tipsTitle =
                this.$t('USER_MANAGERMENT.YULIU_EMAIL');
            }
            if (resp.checkCode === '4') {
              tipsTitle =
               this.$t('USER_MANAGERMENT.YULIU_PHONE_EMAIL');
            }
            this.$confirm({
              title: this.$t('COMMON.TISHI'),
              message: tipsTitle,
              btnText: {
                confirmText: this.$t('COMMON.CONFIRM'),
              },
              isCancle: false
            }).then(() => {
              this.queryBinding();
            });
          }
        }
      });
    },

    //查询列表
    queryBinding() {
      this.accountData = [];
      getInfo().then(resp => {
        this.loading = false;
        if (resp.cusList.length === 0) {
          if (resp.emailAdd) {
            let obj = {
              customerName: resp.enCusName,
              customerNameDesen: resp.enCusNameDesen,
              contactInfomation: this.$t('AUTHORIZE.EMAL'),
              bindingType: '1',
              number: resp.emailAdd,
              numberDesen: resp.emailAddDesen,
              // otherChannels:resp.mobPhone||'',
              otherChannels: resp.mobPhone,
              otherChannelsDesen: resp.mobPhoneDesen,
              status: '0',
              // bindingAccount: '',
              bindingAccount: [],
              bindAccount: '',
              raccountNo: '',
              presetAcct: '0' //预设收款账户
            };
            this.accountData.push(obj);
          }

          if (resp.mobPhone) {
            let obj = {
              customerName: resp.enCusName,
              customerNameDesen: resp.enCusNameDesen,
              contactInfomation: this.$t('AUTHORIZE.AUTH_MOBILE'),
              bindingType: '2',
              number: resp.mobPhone,
              numberDesen: resp.mobPhoneDesen,
              otherChannels: resp.emailAdd,
              otherChannelsDesen: resp.emailAddDesen,
              status: '0',
              // bindingAccount: '',
              bindingAccount: [],
              bindAccount: '',
              raccountNo: '',
              presetAcct: '0' //预设收款账户
            };
            this.accountData.push(obj);
          }
        }
        if (resp.cusList.length > 0) {
          resp.cusList.forEach(item => {
            item.raccountNo = '';
            item.bindAccount = '';
            item.bindingAccount = [];
            if (item.bankAccList && item.bankAccList.length > 1) {
              item.bankAccList.forEach(bankItem => {
                this.accountTypeList.forEach(accItem => {
                  if (bankItem.accType === accItem.value) {
                    bankItem.accTypeName = accItem.label;
                  }
                });

                if (bankItem.linkCCY === 'CNY') {
                  item.raccountNo =
                    bankItem.linkAcIntNo +
                    ' ' +
                    bankItem.linkCCY +
                    ' ' +
                    bankItem.accTypeName;
                }
                if (bankItem.linkCCY === 'HKD') {
                  item.bindAccount =
                    bankItem.linkAcIntNo +
                    ' ' +
                    bankItem.linkCCY +
                    ' ' +
                    bankItem.accTypeName;
                }
                // item.bindingAccount = item.bindAccount + ';' + item.raccountNo;
              });
            } else {
              if (item.bankAccList && item.bankAccList.length === 1) {
                this.accountTypeList.forEach(accItem => {
                  if (item.bankAccList[0].accType === accItem.value) {
                    item.bankAccList[0].accTypeName = accItem.label;
                  }
                });
                item.bindAccount =
                  item.bankAccList[0].linkAcIntNo +
                  ' ' +
                  item.bankAccList[0].linkCCY +
                  ' ' +
                  item.bankAccList[0].accTypeName;
              }
            }

            if (item.bindAccount) {
              item.bindingAccount.push(item.bindAccount);
            }
            if (item.raccountNo) {
              item.bindingAccount.push(item.raccountNo);
            }
          });

          if (resp.cusList.length == 1) {
            resp.cusList.forEach(item => {
              if (!item.proxyId) {
                if (resp.emailAdd) {
                  let obj = {
                    customerName: resp.enCusName,
                    customerNameDesen: resp.enCusNameDesen,
                    contactInfomation: this.$t('AUTHORIZE.EMAL'),
                    bindingType: '1',
                    number: resp.emailAdd,
                    numberDesen: resp.emailAddDesen,
                    // otherChannels:resp.mobPhone||'',
                    otherChannels: resp.mobPhone,
                    otherChannelsDesen: resp.mobPhoneDesen,
                    status: '0',
                    // bindingAccount: '',
                    bindingAccount: [],
                    bindAccount: '',
                    raccountNo: '',
                    presetAcct: '0' //预设收款账户
                  };
                  this.accountData.push(obj);
                }

                if (resp.mobPhone) {
                  console.log(resp, 'email');
                  let obj = {
                    customerName: resp.enCusName,
                    customerNameDesen: resp.enCusNameDesen,
                    contactInfomation: this.$t('AUTHORIZE.AUTH_MOBILE'),
                    bindingType: '2',
                    number: resp.mobPhone,
                    numberDesen: resp.mobPhoneDesen,
                    otherChannels: resp.emailAdd,
                    otherChannelsDesen: resp.emailAddDesen,
                    status: '0',
                    // bindingAccount: '',
                    bindingAccount: [],
                    bindAccount: '',
                    raccountNo: '',
                    presetAcct: '0' //预设收款账户
                  };
                  this.accountData.push(obj);
                }
              } else {
                let arr = item.proxyId.split('@');
                console.log('打印arr', arr);
                if (arr.length > 1) {
                  item.contactInfomation = this.$t('AUTHORIZE.EMAL');
                  item.otherChannels = resp.alterEmailAdr;
                  item.bindingType = '1';
                  if (resp.mobPhone) {
                    let obj1 = {
                      customerName: resp.enCusName,
                      customerNameDesen: resp.enCusNameDesen,
                      contactInfomation: this.$t('AUTHORIZE.AUTH_MOBILE'),
                      bindingType: '2',
                      number: resp.mobPhone,
                      numberDesen: resp.mobPhoneDesen,
                      otherChannels: resp.emailAdd,
                      otherChannelsDesen: resp.emailAddDesen,
                      status: '0',
                      // bindingAccount: '',
                      bindingAccount: [],
                      bindAccount: '',
                      raccountNo: '',
                      presetAcct: '0' //预设收款账户
                    };
                    this.accountData.push(obj1);
                  }
                } else {
                  item.contactInfomation = this.$t('AUTHORIZE.AUTH_MOBILE');
                  item.otherChannels = resp.alterMobNb;
                  item.bindingType = '2';
                  if (resp.emailAdd) {
                    let obj1 = {
                      customerName: resp.enCusName,
                      customerNameDesen: resp.enCusNameDesen,
                      contactInfomation: this.$t('AUTHORIZE.EMAL'),
                      bindingType: '1',
                      number: resp.emailAdd,
                      numberDesen: resp.emailAddDesen,
                      otherChannels: resp.mobPhone,
                      otherChannelsDesen: resp.mobPhoneDesen,
                      status: '0',
                      // bindingAccount: '',
                      bindingAccount: [],
                      bindAccount: '',
                      raccountNo: '',
                      presetAcct: '0' //预设收款账户
                    };
                    this.accountData.push(obj1);
                  }
                }

                let obj = {
                  customerName: resp.enCusName,
                  customerNameDesen: resp.enCusNameDesen,
                  contactInfomation: item.contactInfomation,
                  bindingType: item.bindingType,
                  number: item.proxyId,
                  numberDesen: item.proxyIdDesen,
                  otherChannels: item.otherChannels,
                  status: item.fpssts === 'ACTIVE' ? '1' : '0',
                  bindingAccount: item.bindingAccount,
                  bindAccount: item.bindAccount,
                  raccountNo: item.raccountNo,
                  presetAcct: item.dflt === 'Yes' ? '0' : '1' //预设收款账户
                };

                this.accountData.push(obj);
              }
            });
          }

          if (resp.cusList.length > 1) {
            resp.cusList.forEach(item => {
              let arr = item.proxyId.split('@');
              if (arr.length > 1) {
                item.contactInfomation = this.$t('AUTHORIZE.EMAL');
                item.otherChannels = resp.alterEmailAdr;
                item.bindingType = '1';
              } else {
                item.contactInfomation = this.$t('AUTHORIZE.AUTH_MOBILE');
                item.otherChannels = resp.alterMobNb;
                item.bindingType = '2';
              }

              let obj = {
                customerName: resp.enCusName,
                customerNameDesen: resp.enCusNameDesen,
                contactInfomation: item.contactInfomation,
                bindingType: item.bindingType,
                number: item.proxyId,
                numberDesen: item.proxyIdDesen,
                otherChannels: item.otherChannels,
                status: item.fpssts === 'ACTIVE' ? '1' : '0',
                bindingAccount: item.bindingAccount,
                bindAccount: item.bindAccount,
                raccountNo: item.raccountNo,
                presetAcct: item.dflt === 'Yes' ? '0' : '1' //预设收款账户
              };
              this.accountData.push(obj);
            });
          }
        }
      });
    },

    //绑定
    contactClick(row) {
      console.log(row, 'row');
      this.$router.push({
        path: '/_businessManagement/serviceSetting/bindingAccount/contact',
        query: { row }
      });
    },
    //解绑
    fUncontactClick(row) {
      this.$router.push({
        path: '/_businessManagement/serviceSetting/bindingAccount/uncontact',
        query: { row }
      });
    },
    //修改
    fModify(row) {
      this.$router.push({
        path: '/_businessManagement/serviceSetting/bindingAccount/modify',
        query: { row }
      });
    },
    // 每页大小发生变化时
    fSizeChange(pageSize) {
      console.log('pageSize', pageSize);
    },

    // 当前页数发生变化时
    fCurrentChange(currentPage) {
      console.log('currentPage', currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>