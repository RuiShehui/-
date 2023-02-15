<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <!-- 基本信息展示 -->
      <div class="u-content">
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.flowNo") }}</div>
          <div class="u-content__item__right">{{tableData.flowNo}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t('COMMON.TRADE_TYPE') }}</div>
          <div class="u-content__item__right">{{tableData.businessCode| bussinessTypeFilter}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.OPERATE_TYPE") }}</div>
          <div class="u-content__item__right">{{tableData.operationType | operationType}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.createTime") }}</div>
          <div class="u-content__item__right">{{tableData.createTime}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_NAME") }}</div>
          <div class="u-content__item__right">{{tableData.userName}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.USER_TYPE") }}</div>
          <div
            class="u-content__item__right"
          >{{userInfo.userType === '1' ? $t("USER_MANAGEMENT.ADMINISTRATOR"): userInfo.userType === '3' ? $t("USER_MANAGEMENT.REPORTER") : $t("USER_MANAGEMENT.AUTHORIZER")}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.AUTHORIZATION_LEVEL") }}</div>
          <div class="u-content__item__right">{{userInfo.empowerGroup}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.USER_CHINESE_NAME") }}</div>
          <div class="u-content__item__right">{{userInfo.userChsName}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.USER_ENGLISH_COLON") }}</div>
          <div class="u-content__item__right">{{userInfo.userEglsName}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.CARDTYPE_COLON") }}</div>
          <div class="u-content__item__right">{{userInfo.cardTypeName}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("RESET_USERNAME.ID_NUMBER") }}</div>
          <div class="u-content__item__right">{{userInfo.cardNo}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGERMENT.user_status") }}</div>
          <div
            class="u-content__item__right"
          >{{userInfo.status === '1' ? $t("USER_MANAGEMENT.ENABLE") : $t("USER_MANAGEMENT.DEACTIVATE")}}</div>
        </div>
        <div class="u-content__item" v-if="userInfo.status === '0'">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_SEAON") }}</div>
          <div class="u-content__item__right">{{userInfo.revokeReason}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("USER_MANAGEMENT.FA") }}</div>
          <div
            class="u-content__item__right"
          >{{userInfo.tfaStatus === '1' ? $t("AUTHORIZE.YES") : $t("AUTHORIZE.NO")}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_SINGLE") }}</div>
          <div
            class="u-content__item__right"
          >{{userInfo.cuSoleAuthorizerInd === '1' ? $t("AUTHORIZE.AUTH_OPEN") : $t("AUTHORIZE.AUTH_CLOSE")}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_ADDRESS") }}</div>
          <div class="u-content__item__right">{{userInfo.cardArea}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_BORN") }}</div>
          <div class="u-content__item__right">{{userInfo.birthday}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_PHONE") }}</div>
          <div class="u-content__item__right">{{userInfo.userPhoneShow}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_PHONETWO") }}</div>
          <div class="u-content__item__right">{{userInfo.userPhoneTowShow}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.EMAL") }}</div>
          <div class="u-content__item__right">{{userInfo.email}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_MOBILE") }}</div>
          <div class="u-content__item__right">{{userInfo.mobilePhone}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_SMS_ADDRESS") }}</div>
          <div class="u-content__item__right">{{userInfo.mailAddress}}</div>
        </div>
      </div>
      <!-- 菜单展示 -->
      <divider :title="$t('AUTHORIZE.SERVICES_SETTING')" class="mt24 mb20" />
      <div>
        <el-table
          :data="
          tableDataArr
        "
          ref="tableDataArr"
          row-key="menuCode"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column
            prop="menuName"
            :label="$t('AUTHORIZE.AUTH_MENU')"
            label-class-name="labelClass"
          >
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
              <span>{{ $t("AUTHORIZE.AUTH_QUERY") }}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.queryFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
          <el-table-column
            prop="entryPermission"
            :label="$t('AUTHORIZE.ALL')"
            label-class-name="labelClass"
          >
            <template slot="header">
              <span>{{ $t("AUTHORIZE.AUTH_ENTRY") }}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.createFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
          <el-table-column prop="authAll" label-class-name="labelClass">
            <template slot="header">
              <span>{{ $t("AUTHORIZE.AUTH_THORITY") }}</span>
            </template>
            <template slot-scope="scope">
              <img v-show="scope.row.grantFlag" src="../../../../images/fixedOpen/hook1.png" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 账户展示 -->
      <div class="accountSelect">
        <divider class="mt24 mb20" :title="$t('AUTHORIZE.AUTH_AccountSelect')" />
        <div style="overflow: auto">
          <div v-for="(item, index) in operatorAccounts" :key="index">
            <span class="accountCheck">
              {{item.accountNo}}-
              <span v-show="item.currencyType">{{item.currencyType}}-</span>
              {{item.accountType | accountType}}
            </span>
          </div>
        </div>
      </div>
      <!-- 单一批核展示 -->
      <div class="mb20" v-if="userInfo.cuSoleAuthorizerInd === '1'">
        <div style="clear:both">
          <divider class="mt24 mb20" :title="$t('AUTHORIZE.AUTH_SINGLEAccount')" />
        </div>
        <el-table :data="userInfo.userAccountLimits" stripe>
          <el-table-column
            :label="$t('AUTHORIZE.AUTH_PRIVILEGED')"
            prop="accountNo"
            align="left"
            min-width="30%"
          ></el-table-column>
          <el-table-column
            :label="$t('AUTHORIZE.AUTH_SINGLELIMIT')"
            prop="accLimitDaily"
            align="left"
            min-width="70%"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="isWaitAuth">
      <divider :title="$t('AUTHORIZE.WAITME')" class="mt24 mb20" />
      <el-form :model="detailForm" label-width="auto" style="margin-left:291px">
        <el-form-item :label="$t('AUTHORIZE.MY_AUTHOR')">
          <el-radio
            v-model="detailForm.authStatus"
            label="1"
            style="margin: 11px 0 0 17px"
          >{{ $t("AUTHORIZE.MY_AGRESS") }}</el-radio>
          <el-radio
            v-model="detailForm.authStatus"
            label="2"
            style="margin-left: 28px"
          >{{ $t("AUTHORIZE.MY_REFUSE") }}</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            autosize
            style="width: 336px; height: 62px"
            :placeholder="$t('AUTHORIZE.AUTH_ENTER_OPINIONS')"
            v-model="detailForm.authActionMessage"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="u-tips">
        <p class="u-title" style="display:flex;">
          <img style="width:14px; padding-right:8px" src="@/images/logo/lingdang.png" />
          <span>{{ $t("AUTHORIZE.DOUBLE_WAY") }}</span>
        </p>
        <el-form ref="forms" :rules="rule" :model="form" style="margin-left:25%">
          <el-form-item :label="$t('AUTHORIZE.DOUBLE_WAYS')" prop="checkWay" label-width="200px">
            <el-radio-group v-model="form.checkWay" style="padding-top:10px">
              <el-radio label="1">{{ $t("AUTHORIZE.PLICE_WAY") }}</el-radio>
              <el-radio label="2">{{ $t("AUTHORIZE.OTP_WAY") }}</el-radio>
              <!-- <el-radio v-for="item in checkWay" :key="item.value" :value="item.value" :label="item.label"></el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="flexc mt36">
        <v-button @click="returnClick()" class="mr16">{{ $t("AUTHORIZE.BACK") }}</v-button>
        <v-button type="primary" @click="submit()">{{ $t("AUTHORIZE.SURE") }}</v-button>
      </el-row>
    </div>

    <div v-else>
      <div class="m-head">{{ $t("AUTHORIZE.AUTH_FORMATION") }}</div>
      <div class="g-card-detail-wrapper__middle">
        <div class="u-content">
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t("AUTHORIZE.authState") }}</div>
            <div class="u-content__item__right status">{{tableData.authState|authStateFilter}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_TIME") }}</div>
            <div class="u-content__item__right">{{tableData.authTime}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_PEOPLE") }}</div>
            <div class="u-content__item__right">{{tableData.autherName}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t("AUTHORIZE.AUTH_OPINION") }}</div>
            <div class="u-content__item__right">{{tableData.dealRen}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="flexc mt20">
        <v-button @click="returnClick()">返回</v-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import {
  saveOperatorAuth,
  delelteOperatorAuth,
  updateOperatorAuth,
  updateSecretAuth,
  updateStatusAuth,
  operatorDetail,
  queryOperatorInfo,
  getListCardArea
} from '@/api/userManagement.js';
import { formatTreeData, deepClone, unique } from '@/utils/tree-table.js';
import tool from '@/dataTools/tools/moneyTools.js';
import CONSTANTS from '@/utils/contants';
import { otpDialog, softToken } from '@/components/messageBox';
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/public';
import filter from '@/filters/accountManagement';
export default {
  props: {
    tableData: {
      type: Object
    }
  },
  watch: {
    tableData: function(val) {
      console.log('tableData', this.tableData);
    }
  },
  filters: {
    ...filters,
    ...filter
  },
  data() {
    return {
      // accountLimitList: [],
      operatorAccounts: [],
      tableDataArr: [],
      queryAll: true, // 控制查询的全部标识
      authAll: true, // 控制授权的全部标识
      entryAll: true, // 控制录入的全部标识
      userInfo: {},
      detailForm: {
        authStatus: '1', //1:通过，2：拒绝
        authActionMessage: ''
      },
      isWaitAuth: true,
      getstatus: '',
      date: '',
      sname: '',
      ager: '',
      form: {
        checkWay: ''
      },
      rule: {
        checkWay: [
          {
            required: true,
            message: this.$t('AUTHORIZE.SELECT_WAY'),
            tigger: 'change'
          }
        ]
      },
      flag: ''
    };
  },
  created() {},
  mounted() {
    console.log(this.tableData, 'tableData');
    switch (this.tableData.operationType) {
      case '1':
        this.flag = '1';
        break;
      case '2':
        this.flag = '2';
        break;
      case '3':
        this.flag = '3';
        break;
      case '5':
        this.flag = '6';
        break;
      case '4':
        this.flag = '7';
        break;
      case '6':
        this.flag = '8';
        break;
    }
    if (
      this.tableData.authState === '0' &&
      this.tableData.authorizationType === 'WAIT_AUTH'
    ) {
      this.isWaitAuth = true;
    } else {
      this.isWaitAuth = false;
    }
    if (!this.tableData.dealRen) {
      this.tableData.dealRen = '- -';
    }
    this.queryDetail();
  },
  methods: {
    //详情查询
    queryDetail() {
      let params = {
        commFlow: this.tableData.flowNo
      };
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
      Promise.all([
        operatorDetail(params),
        getListCardArea({
          bigGroupCode: 'language',
          bigGroupName: lang,
          fieldName: 'cardArea'
        }),
        getListCardArea({
          bigGroupCode: 'language',
          bigGroupName: lang,
          fieldName: 'cardTypeInd'
        })
      ]).then(resp => {
        console.log('resp', resp);
        this.userInfo = resp[0].operatorInfRsp;
        if (this.userInfo.cuSoleAuthorizerInd === '1') {
          if (this.userInfo.userAccountLimits) {
            this.userInfo.userAccountLimits.forEach(item => {
              item.accLimitDaily = tool.currencyFormat(item.limitDaily, '', 2);
            });
          }
        }
        //证件类型
        resp[2].cardAreaList.forEach(item => {
          // let typeList = item.id.split('*');
          if (item.fieldValue == this.userInfo.cardType) {
            this.userInfo.cardTypeName = item.fiedlDescrible;
          }
        });
        //证件签发地
        resp[1].cardAreaList.forEach(item => {
          if (item.fieldValue === this.userInfo.cardArea) {
            this.userInfo.cardArea = item.fiedlDescrible;
          }
        });

        if (this.userInfo.empowerGroup && this.userInfo.empowerGroup == 0) {
          this.userInfo.empowerGroup = this.$t('USER_MANAGEMENT.NONE');
        }
        let menuList = [];
        console.log('打印。。。。菜单数组', resp);
        resp[0].userMenuList.forEach(item => {
          if (item.pmenuCode === '0') {
            item.pmenuCode = null;
          }
          // if (item.createFlag || item.grantFlag || item.queryFlag) {
          //   // menuList.push(item);
          //   this.tableDataArr.push(item);
          // }
        });
        this.tableDataArr = formatTreeData(
          deepClone(resp[0].userMenuList),
          'menuCode',
          'pmenuCode'
        );

        if (
          this.tableData.operationType === '1' ||
          this.tableData.operationType === '2'
        ) {
          this.apLimit(resp[0].operatorAccounts);
        }
        if (
          this.tableData.operationType === '3' ||
          this.tableData.operationType === '4' ||
          this.tableData.operationType === '5' ||
          this.tableData.operationType === '6'
        ) {
          this.otherLimit(resp[0].operatorAccounts);
        }

        if (this.userInfo.userPhone) {
          this.handlePhone();
        } else {
          this.userInfo.userPhoneShow = '';
        }
        if (this.userInfo.contactsPhone) {
          this.handlePhoneTow();
        } else {
          this.userInfo.userPhoneTowShow = '';
        }
      });
      console.log('tableDataArr', this.tableDataArr);
    },

    //新增，编辑时处理限额数据
    apLimit(operatorAccounts) {
      if (operatorAccounts.length > 0) {
        operatorAccounts.forEach(item => {
          CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
            if (item.accountType === accountItem.value) {
              item.accountTypeName = accountItem.label;
            }
          });
          if (item.accountTypeName) {
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
          } else {
            if (item.currencyType) {
              item.accName = item.accountNo + '-' + item.currencyType;
            } else {
              item.accName = item.accountNo;
            }
          }
        });
      }
      // this.accountLimitList = operatorAccounts;
      this.operatorAccounts = operatorAccounts;
    },

    //其他操作时处理限额
    otherLimit(operatorAccounts) {
      let uniqueList = operatorAccounts.filter((item, index) => {
        return (
          operatorAccounts.findIndex(
            item1 => item1.accountNo == item.accountNo
          ) == index
        );
      });

      uniqueList.forEach(unItem => {
        CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
          if (unItem.accountType === accountItem.value) {
            unItem.accountTypeName = accountItem.label;
          }
        });
        if (unItem.accountTypeName) {
          unItem.accName =
            unItem.accountNo +
            '-' +
            unItem.currencyType +
            '-' +
            unItem.accountTypeName;
        } else {
          unItem.accName = unItem.accountNo + '-' + unItem.currencyType;
        }
        // this.accountLimitList.push(unItem);
        this.operatorAccounts.push(unItem);
      });
    },

    //查询用户详情
    queryUserInfo(user) {
      let params = {
        userCode: user.userCode
      };
      queryOperatorInfo(params).then(resp => {
        console.log('查询用户信息：', resp);
        this.userInfo = resp;
      });
    },

    //处理联络电话
    handlePhone() {
      let phoneList = this.userInfo.userPhone.split('-');
      this.userInfo.countryCode = phoneList[0];
      this.userInfo.areaCode = phoneList[1];
      this.userInfo.contactPhoneNo = phoneList[2];
      //页面显示时用的字段
      if (
        this.userInfo.countryCode &&
        this.userInfo.areaCode &&
        this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow =
          this.userInfo.countryCode +
          '-' +
          this.userInfo.areaCode +
          '-' +
          this.userInfo.contactPhoneNo;
      }
      if (
        this.userInfo.countryCode &&
        this.userInfo.areaCode &&
        !this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow =
          this.userInfo.countryCode + '-' + this.userInfo.areaCode;
      }
      if (
        this.userInfo.countryCode &&
        !this.userInfo.areaCode &&
        this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow =
          this.userInfo.countryCode + '-' + this.userInfo.contactPhoneNo;
      }
      if (
        !this.userInfo.countryCode &&
        this.userInfo.areaCode &&
        this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow =
          this.userInfo.areaCode + '-' + this.userInfo.contactPhoneNo;
      }
      if (
        this.userInfo.countryCode &&
        !this.userInfo.areaCode &&
        !this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow = this.userInfo.countryCode;
      }
      if (
        !this.userInfo.countryCode &&
        this.userInfo.areaCode &&
        !this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow = this.userInfo.areaCode;
      }
      if (
        !this.userInfo.countryCode &&
        !this.userInfo.areaCode &&
        this.userInfo.contactPhoneNo
      ) {
        this.userInfo.userPhoneShow = this.userInfo.contactPhoneNo;
      }
    },
    //处理联络电话2
    handlePhoneTow() {
      let phoneList = this.userInfo.contactsPhone.split('-');
      this.userInfo.countryCodeTow = phoneList[0];
      this.userInfo.areaCodeTow = phoneList[1];
      this.userInfo.contactPhoneNoTow = phoneList[2];
      if (
        this.userInfo.countryCodeTow &&
        this.userInfo.areaCodeTow &&
        this.userInfo.contactPhoneNoTow
      ) {
        this.userInfo.userPhoneTowShow =
          this.userInfo.countryCodeTow +
          '-' +
          this.userInfo.areaCodeTow +
          '-' +
          this.userInfo.contactPhoneNoTow;
      } else if (
        this.userInfo.countryCodeTow &&
        !this.userInfo.areaCodeTow &&
        this.userInfo.contactPhoneNoTow
      ) {
        this.userInfo.userPhoneTowShow =
          this.userInfo.countryCodeTow + '-' + this.userInfo.contactPhoneNoTow;
      } else {
        this.userInfo.userPhoneTowShow = '';
      }
    },

    //提交
    submit() {
      let tipContent = '';
      let custNo = sessionStorage.getItem('custNo');
      this.$refs['forms'].validate(valid => {
        if (valid) {
          if (this.form.checkWay == '2') {
            otpDialog({
              otpType: this.tableData.businessCode,
              otpMode: 'otp',
              flag: this.flag
            }).then(() => {
              this.comfirm();
            });
          } else {
            const tradeInfo = JSON.stringify({
              userEglsName: this.userInfo.userEglsName,
              userType: this.userInfo.userType,
              operationType: this.tableData.operationType
            });
            softToken({
              softTokenCode: '',
              otpType: this.tableData.businessCode,
              tradeInfo: tradeInfo
              // randomNum:''
            }).then(() => {
              this.comfirm();
            });
          }
        }
      });
    },
    comfirm() {
      let tipContent = '';
      let custNo = sessionStorage.getItem('custNo');
      if (this.detailForm.authStatus === '1') {
        tipContent = this.$t('AUTHORIZE.AUTH_agree');
      } else {
        tipContent = this.$t('AUTHORIZE.AUTH_REFUSE');
      }
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: tipContent,
        btnText: {
          cancleText: this.$t('AUTHORIZE.CANCLE'),
          confirmText: this.$t('AUTHORIZE.SURE')
        },
        isCancle: true
      }).then(() => {
        this.submitStatus();
      });
    },
    //提交
    async submitStatus() {
      let params = {
        flowNoList: [this.tableData.flowNo],
        authReqInfo: {
          authActionType: this.detailForm.authStatus,
          authActionMessage: this.detailForm.authActionMessage,
          flowNo: this.tableData.flowNo,
          bsnCode: this.tableData.businessCode
        }
      };
      //1:新增;2:修改;3:删除;4:启用;5:停用;6:重置密码
      if (this.tableData.operationType === '1') {
        params.authReqInfo.opType = '1'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await saveOperatorAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
      if (this.tableData.operationType === '3') {
        params.authReqInfo.opType = '3'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await delelteOperatorAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
      if (this.tableData.operationType === '2') {
        params.authReqInfo.opType = '2'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await updateOperatorAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
      if (this.tableData.operationType === '6') {
        params.authReqInfo.opType = '2'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await updateSecretAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
      if (
        this.tableData.operationType === '4' ||
        this.tableData.operationType === '5'
      ) {
        params.authReqInfo.opType = '2'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await updateStatusAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
    },
    //返回
    returnClick() {
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  &__middle {
    margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 36px;
      &__item {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        &__left {
          width: 222px;
          text-align: right;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          line-height: 22px;
          // margin-left: 82px;
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          line-height: 22px;
          margin-left: 24px;
        }
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
  .g-btns {
    // text-align: center;
    // display: flex;
    margin-left: 453px;
    margin-top: 30px;
    .u-hasMargin {
      margin-right: 10px;
      display: initial;
      /deep/ .common-button {
        margin: 0 auto;
      }
    }
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
}
.u-title {
  font-size: 14px;
  color: #f06b00;
  display: flex;
  margin-left: 46px;
  margin-top: 45px;
  justify-content: center;
  align-items: center;
  // flex-direction: column;
}
.accountCheck {
  width: 100%;
  float: left;
  width: 30%;
  // padding: 20px;
  padding: 12px 0;
  padding-left: 3%;
  font-size: 14px;
}
</style>