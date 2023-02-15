<template>
  <div class="tradingTips" v-loading="requestLoading">
    <divider :title="$t('USER_MANAGERMENT.TIPS_NEI')" />
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="auto">
      <el-form-item prop="dyAcc" :label="$t('USER_MANAGERMENT.DONG_JIOA')">
        <el-radio
          style="margin: 11px 0 0 13px"
          v-model="formData.notiType"
          label="0"
        >{{$t('USER_MANAGERMENT.ALL_SEND')}}</el-radio>
        <el-radio
          style="margin-left: 23px"
          v-model="formData.notiType"
          label="1"
        >{{$t('USER_MANAGERMENT.ADD_SEND')}}</el-radio>
      </el-form-item>
      <el-form-item
        prop="money"
        class="moneyClass"
        :label="$t('AUTHORIZE.AUTH_SETMONEY')+':'"
        v-if="formData.notiType==='1'"
      >
        <el-input disabled placeholder="HKD" v-model="formData.preMoney" style="width: 132px"></el-input>
        <el-input
          onkeyup="if(isNaN(value)) execCommand('undo')"
          onafterpaste="if(isNaN(value) execCommand('undo'))"
          :placeholder="$t('AUTHORIZE.AUTH_SETMONEY')"
          v-model="formData.money"
          style="width: 180px"
          @blur="blurChange"
        ></el-input>
      </el-form-item>
      <divider
        :title="$t('USER_MANAGERMENT.JIE_TIP')"
        style="margin-left: -96px; margin-bottom: 27px"
      />
      <div v-for="(item,index) in formData.emailList" :key="index">
        <el-form-item
          :label="index===0?$t('AUTHORIZE.EMAL'):$t('AUTHORIZE.EMAL')+(index)"
          class="u-email"
          maxlength="34"
          :prop="`emailList.${index}.email`"
          :rules="rules.email"
        >
          <el-input
            maxlength="34"
            minlength="6"
            :placeholder="$t('USER_MANAGERMENT.EMTER_EMAIL')"
            v-model="item.email"
          ></el-input>

          <i
            class="el-icon-error"
            style="font-size: 16px;color: #f06b00"
            @click="fDelete(item, index)"
            v-if="formData.emailList.length != 1"
          ></i>
          <v-button
            v-show="showAddButton"
            class="btnadd"
            style="margin-left: 20px"
            @click="pushClick"
            v-if="index===(formData.emailList.length-1) "
          >{{$t('USER_MANAGERMENT.ADD_EMAIL')}}</v-button>
        </el-form-item>
        <p
          v-if="emailFlag"
          style="margin-left: 204px; margin-top: -12px; color: rgba(0,0,0,0.45); font-size: 12px"
        >{{$t('USER_MANAGERMENT.ADD_FIVE_EMAIL')}}</p>
        <p
          v-if="!emailFlag"
          style="margin-left: 204px; margin-top: 24px; color: rgba(0,0,0,0.45); font-size: 12px"
        >{{$t('USER_MANAGERMENT.ADD_FIVE_EMAIL')}}</p>
        <el-form-item :label="$t('AUTHORIZE.AUTH_TIPTYPE')+':'" class="u-tips">
          <el-checkbox v-model="item.accountTrans">{{$t('USER_MANAGERMENT.DONG_JIOA')}}</el-checkbox>
          <el-checkbox v-model="item.reserTransaction">{{$t('USER_MANAGERMENT.FAIL_JIOAYI')}}</el-checkbox>
          <el-checkbox v-model="item.highRiskTips">{{$t('USER_MANAGERMENT.HISH_RISK')}}</el-checkbox>
          <el-checkbox
            v-model="item.monthStatement"
            @change="statementChange(item, index)"
          >{{$t('USER_MANAGERMENT.MONTH_ELE')}}</el-checkbox>
        </el-form-item>
      </div>
    </el-form>
    <el-row class="flexc mt36">
      <v-button class="mr16" @click="reset">{{$t('COMMON.RESET')}}</v-button>
      <v-button type="primary" @click="submit">{{$t('COMMON.SUBMIT')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import {
  transactionPromptSubmit,
  setTransactionPromptSubmit,
  setTransactionPromptRecurrence
} from '@/api/transactionTips.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { mapState } from 'vuex';
const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
export default {
  data() {
    var checkEmail = (rules, value, callback) => {
      console.log(value, 'value');
      this.emailFlag = true;
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
      if (!regEmail.test(value)) {
        this.emailFlag = false;
        return callback(this.$t('USER_MANAGERMENT.PLE_ENT_EMAIL_FORMAT'));
      }
      // console.log(rules, value, callback, 'value');
      if (this.formData.emailList.length === 1) {
        if (this.formData.emailList[0].email == '') {
          this.emailFlag = false;
          return callback(this.$t('USER_MANAGERMENT.EMAILADD_BE_EMPTY'));
        }
      }

      for (let i = 0; i < this.formData.emailList.length; i++) {
        if (this.formData.emailList[i].email == '') {
          this.emailFlag = false;
          return callback(this.$t('USER_MANAGERMENT.EMAILADD_BE_EMPTY'));
        }

        for (let j = 0; j < this.formData.emailList.length; j++) {
          if (i != j) {
            if (
              this.formData.emailList[i].email ==
              this.formData.emailList[j].email
            ) {
              this.emailFlag = false;
              return callback(this.$t('USER_MANAGERMENT.EMAIL_BE_SAME'));
            }
          }
        }
      }
      callback();
    };
    return {
      checkList: [], //复选框数组
      showAddButton: true, //是否展示新增按钮
      emailFlag: true,
      formData: {
        dyAcc: false,
        subscribeTran: false,
        notiType: '0',
        preMoney: 'HKD',
        money: '',
        // 存放邮箱的数组
        emailList: [
          {
            email: '',
            accountTrans: false,
            reserTransaction: false,
            highRiskTips: false,
            monthStatement: false,
            stateFlag: false
          }
        ]
      },
      rules: {
        money: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.HKD_BE_EMPTY'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            validator: checkEmail,
            // message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  mounted() {
    this.queryTransTips();
  },
  methods: {
    //查询数据
    queryTransTips() {
      setTransactionPromptRecurrence().then(resp => {
        console.log(resp, 'resp');
        if (resp.emailList && resp.emailList.length > 0) {
          this.formData.emailList = [];
          this.formData.notiType = resp.noticeType;
          this.formData.money = tool.currencyFormat(resp.amount, '', 2);
          let monthStateFlag = false;
          let arr = [];
          resp.emailList.forEach(item => {
            item.accountTrans = false;
            item.reserTransaction = false;
            item.highRiskTips = false;
            item.monthStatement = false;
            item.stateFlag = false;
            item.transaType.forEach(trItem => {
              if (trItem == '01') {
                item.accountTrans = true;
              }
              if (trItem == '02') {
                item.reserTransaction = true;
              }
              if (trItem == '03') {
                item.highRiskTips = true;
              }
              if (trItem == '04') {
                item.monthStatement = true;
                monthStateFlag = true;
              }
            });
            let obj = {
              email: item.email,
              accountTrans: item.accountTrans,
              reserTransaction: item.reserTransaction,
              highRiskTips: item.highRiskTips,
              monthStatement: item.monthStatement
            };
            arr.push(obj);
          });
          if (monthStateFlag) {
            arr.forEach(item => {
              item.stateFlag = true;
              if (item.monthStatement) {
                item.stateFlag = false;
              }
            });
          }
          this.formData.emailList = arr;
          console.log('this.formData', this.formData.emailList);
        } else {
          this.$refs['formRef'].resetFields();
          this.formData.emailList = [
            {
              email: '',
              accountTrans: false,
              reserTransaction: false,
              highRiskTips: false,
              monthStatement: false,
              stateFlag: false
            }
          ];
        }
      });
    },
    //新增按钮
    pushClick() {
      if (this.formData.emailList.length === 5) {
        return;
      }
      let falg = false;
      this.formData.emailList.forEach(item => {
        if (item.monthStatement) {
          falg = true;
        }
      });
      this.formData.emailList.push({
        email: '',
        accountTrans: false,
        reserTransaction: false,
        highRiskTips: false,
        monthStatement: false,
        stateFlag: falg
      });

      if (this.formData.emailList.length === 5) {
        this.showAddButton = false;
      } else {
        this.showAddButton = true;
      }
      console.log('email', this.formData.emailList);
    },

    //选择电子月结单
    statementChange(item, index) {
      console.log('打印。。。。', item, index);
      if (item.monthStatement) {
        for (let i = 0; i < this.formData.emailList.length; i++) {
          if (i != index) {
            this.formData.emailList[i].stateFlag = true;
          } else {
            this.formData.emailList[i].stateFlag = false;
          }
        }
      } else {
        this.formData.emailList.forEach(item => {
          item.stateFlag = false;
        });
      }
    },
    //删除一个邮箱
    fDelete(item, index) {
      this.formData.emailList.splice(index, 1);
      this.showAddButton = true;
      if (item.monthStatement) {
        this.formData.emailList.forEach(emaliItem => {
          emaliItem.stateFlag = false;
        });
      }
    },
    submit() {
      this.$refs['formRef'].validate(volid => {
        console.log('volid', volid);
        if (volid === false) {
          return;
        }
        this.submitData();
      });
    },
    //提交
    submitData() {
      console.log('this.emailList', this.formData.emailList);
      let emaliArray = [];
      let flag = true; //判断电邮不能为空
      let checkFlag = true;
      this.formData.emailList.forEach((item, index) => {
        if (!item.email) {
          flag = false;
        } else {
          let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (regEmail.test(item.email)) {
            let transaType = [];
            if (item.accountTrans) {
              transaType.push('01');
            }
            if (item.reserTransaction) {
              transaType.push('02');
            }
            if (item.highRiskTips) {
              checkFlag = false;
              transaType.push('03');
            }
            if (item.monthStatement) {
              transaType.push('04');
            }
            let obj = {
              email: item.email,
              transaType: transaType
            };
            emaliArray.push(obj);
          } else {
            flag = false;
          }
        }
      });
      if (checkFlag) {
        return this.$message({
          message: this.$t('USER_MANAGERMENT.EMAIL_CHECK_HIGH_RISK'),
          type: 'warn',
          delay: 3000
        });
      }

      if (flag) {
        let amountMoney = '';
        if (this.formData.money) {
          amountMoney = mathTools.delDecollator(this.formData.money);
        }
        let params = {
          noticeType: this.formData.notiType,
          emailList: emaliArray,
          amount: amountMoney
        };
        console.log('params', params);
        const tradeInfo = JSON.stringify(this.formData.emailList);
        let menuId = localStorage.getItem('sliderMenusAct');
        const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
        const entType = localStorage.getItem('entType');
        setTransactionPromptSubmit(params).then(resp => {
          const { returnCode } = resp.head;
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo
            }).then(() => {
              this.submitData();
            });
          } else if (returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.submitData();
            });
          } else {
            if (resp.body.authResultInfo.flowNo) {
              // if (resp.authResultInfo.authResultState !== '05') {
              if (resp.body.authResultInfo.authResultState === '03') {
                resp.body.authResultInfo.authorMessage = this.$t(
                  'REMITTANCECONFIRM.PROGRESS'
                );
                this.$router.push({
                  path:
                    '/_businessManagement/serviceSetting/tradingTips/result',
                  query: resp.body.authResultInfo
                });
              } else {
                this.$router.push({
                  path:
                    '/_businessManagement/serviceSetting/tradingTips/result',
                  query: resp.body.authResultInfo
                });
              }
            }
          }
        });
      } else {
        this.$message({
          message: this.$t('USER_MANAGERMENT.PLE_ENT_EMAIL_ADD'),
          type: 'warn',
          delay: 3000
        });
      }
    },
    //失焦事件
    blurChange() {
      this.formData.money = tool.currencyFormat(this.formData.money, '', 2);
    },
    reset() {
      this.queryTransTips();
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>