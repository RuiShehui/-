<template>
  <div>
    <el-dialog
      append-to-body
      class="pop-up"
      :visible.sync="dialogVisible"
      @close="close"
      width="360px"
      top="0vh"
    >
      <div class="u-titles" >
        <img style="width:24px;height:24px;" src="@/images/fixedOpen/calactor.png" />
        {{$t('FIXED_DEPOSIT_OVERVIEW.FIXED_CLACATOR')}}
      </div>
      <el-form
        :rules="calactorDataRules"
        class="m-calacortForm"
        ref="calactorData"
        :model="calactorData"
         v-loading='calactor'
      >
        <el-form-item :label="$t('TRANSFR_INFO.CUR')" prop="depositCurrency">
          <el-select v-model="calactorData.depositCurrency">
            <el-option
              v-for="item in depositCurrency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR')" prop="fixedTerm">
          <el-select v-model="calactorData.fixedTerm">
            <el-option
              v-for="item in fixedTerm"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')" prop="depositAmount">
          <el-input @blur="changeDepositAmount" v-model="calactorData.depositAmount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES')">
          <el-input v-model="calactorData.interestRate"></el-input>
        </el-form-item>
      </el-form>
      <img style="width:12px;padding-right:6px;" src="~@/images/fixedOpen/reset.png" />
      <span class="u-rate" @click="checkRater">{{$t('FIXED_DEPOSIT_OVERVIEW.TO_USE')}}</span>
      <div slot="footer" class="flexc">
        <VButton size="w300" type="primary" @click="checkRate">{{$t('FIXED_DEPOSIT_OVERVIEW.CALCATOR')}}</VButton>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      class="pop-up"
      :visible.sync="dialogVisibles"
      @close="close"
      width="360px"
    >
      <div v-loading="checkRates">
        <ul class="u-ul">
          <div class="u-content">
            <li class="m-content">
              <p class="u-title" style="margin-top:24px;">{{$t('TRANSFR_INFO.CUR')}}</p>
              <p style="margin-top:8px;">{{this.calactorData.depositCurrency}}</p>
            </li>
            <li class="m-content" style="border:none">
              <p class="u-title" style="margin-top:24px;">{{$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')}}</p>
              <p style="margin-top:8px;">{{this.calactorData.depositAmount}}</p>
            </li>
          </div>
          <div class="u-content" style="margin-top:36px">
            <li class="m-content">
              <p class="u-title" style="margin-top:24px;">{{$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR')}}</p>
              <p style="margin-top:8px;">{{this.calactorData.fixedTerm}}</p>
            </li>
            <li class="m-content" style="border:none">
              <p class="u-title" style="margin-top:24px;">{{$t('OPEN_FIXED.RATE')}}</p>
              <p style="margin-top:8px;">{{this.calactorData.interestRate}}%p.a</p>
            </li>
          </div>
          <div class="u-content" style="margin-top:36px">
            <li class="m-content">
              <p class="u-title" style="margin-top:24px;">{{$t('FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST')}}</p>
              <p
                style="margin-top:8px;"
              >{{this.calactorData.depositCurrency}}{{this.calactorData.preAvailableInterest}}</p>
            </li>
            <li class="m-content" style="border:none">
              <p class="u-title" style="margin-top:24px;">{{$t('FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL')}}</p>
              <p
                style="margin-top:8px;"
              >{{this.calactorData.depositCurrency}}{{this.calactorData.preAvailablePrincipalInterest}}</p>
            </li>
          </div>
        </ul>
      </div>
      <div class="u-tips">{{$t('FIXED_DEPOSIT_OVERVIEW.TO_CANKAO')}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { queryRate } from '@/api/openFixed.js';
// import OperateBtn from './OperateBtn'
import CONSTANTS from '@/utils/contants.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
export default {
  name: 'PopUp',
  components: {
    // OperateBtn
  },
  props: {
    options: {
      type: Boolean,
      default: true
    },
    confirmField: {
      type: String,
      default:''
    },
    cancelField: {
      type: String,
      default:''
    },
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 在PopUp组件内部控制显隐
      dialogVisible: this.visible || false,
      dialogVisibles: false,
      calactorData: {
        depositCurrency: '',
        fixedTerm: '',
        depositAmount: '',
        interestRate: '',
        preAvailableInterest: '',
        preAvailablePrincipalInterest: ''
      },
      depositCurrency: [
        {
          value: 1,
          label: 'HKD'
        }
      ],
      fixedTerm: [],
      calactorDataRules: {
        depositCurrency: [{ required: true, message: this.$t('OPEN_FIXED.TO_REQUIRED',{
          input:this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_CUR')
        }) }],
        fixedTerm: [{ required: true, message: this.$t('OPEN_FIXED.TO_REQUIRED',{
          input:this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR')
        }) }],
        depositAmount: [{ required: true, message: this.$t('OPEN_FIXED.TO_REQUIRED',{
          input:this.$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT')
        }) }]
      },
      checkRates: false,
      calactor:false
    };
  },
  created() {
    this.fixedTerm = CONSTANTS.SELECT_DATE_LISTS;
    this.depositCurrency = CONSTANTS.CONTACT_TYPE_LIST;
  },
  methods: {
    hideDialog() {
      this.dialogVisible = false;
      this.dialogVisibles = true;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    close() {
      this.$emit('close', false);
    },
    checkRate() {
      this.calactorData.depositAmount = mathTools.delDecollator(
        this.calactorData.depositAmount
      );
      let params = {
        depositAmount: this.calactorData.depositAmount, // 存款额
        depositCurrency: this.calactorData.depositCurrency, //币种
        depositTermType: 0,
        fixedTerm: this.calactorData.fixedTerm //固定存期
      };
      this.$refs.calactorData.validate(vaild => {
        if (vaild) {
          this.dialogVisible = false;
          this.dialogVisibles = true;
          this.checkRates = true;
          queryRate(params).then(res => {
            console.log(res, 'dialog');
            this.calactorData.interestRate = res.rate;
            this.calactorData.interestRate = res.rate;
               this.$set(this.calactorData,'preAvailableInterest',tool.currencyFormat(
              res.preAvailableInterest,
              '',
              2
            ))
        
               this.$set(this.calactorData,'preAvailablePrincipalInterest',tool.currencyFormat(
              res.preAvailablePrincipalInterest,
              '',
              2
            ))
               this.$set(this.calactorData,'depositAmount',tool.currencyFormat(
              this.calactorData.depositAmount,
              '',
              2
            ))
            this.checkRates = false;
          });
        }
      });
    },
    checkRater() {
      this.calactorData.depositAmount = mathTools.delDecollator(
        this.calactorData.depositAmount
      );
      let params = {
        depositAmount: this.calactorData.depositAmount, // 存款额
        depositCurrency: this.calactorData.depositCurrency, //币种
        depositTermType: 0,
        fixedTerm: this.calactorData.fixedTerm //固定存期
      };
      this.$refs.calactorData.validate(vaild => {
         this.calactor = true;
        if (vaild) {
          queryRate(params).then(res => {
            this.calactorData.interestRate = res.rate;
               this.$set(this.calactorData,'preAvailableInterest',tool.currencyFormat(
              res.preAvailableInterest,
              '',
              2
            ))
          
               this.$set(this.calactorData,'preAvailablePrincipalInterest',tool.currencyFormat(
              res.preAvailablePrincipalInterest,
              '',
              2
            ))
               this.$set(this.calactorData,'depositAmount',tool.currencyFormat(
              this.calactorData.depositAmount,
              '',
              2
            ))
           this.calactor = false;
          }).catch(()=>{
             this.calactor = false;
          })
       
        }
      });
    },
    changeDepositAmount() {
      this.calactorData.depositAmount = tool.currencyFormat(
        this.calactorData.depositAmount,
        '',
        2
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-up {
  .m-calacortForm {
    margin-top: 24px;
  }
  ::v-deep .el-dialog__header {
    height: 40px;
    padding: 0;
    .el-dialog__title {
      font-size: 18px;
      line-height: 26px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
    }
    .el-dialog__headerbtn {
      top: 10px;
      right: 10px;
      .el-icon-close:before {
        content: '\E6DB';
      }
    }
  }

  // ::v-deep .el-dialog__header {
  //   padding: 0;
  // }

  ::v-deep .el-dialog__footer {
    margin-top: 24px;
    padding-top: 0;
    padding-bottom: 24px;
  }
  .u-titles {
    display: flex;
    font-size: 18px;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 500;
    text-align: left;
  }
  .el-form .el-input {
    width: 300px;
    ::v-deep .el-input__inner {
      width: 300px !important;
    }
  }
  ::v-deep .el-input--suffix {
    width: 300px !important;
  }
  ::v-deep .el-input__inner {
    width: 300px !important;
  }
  .u-rate {
    color: rgba($color: #999, $alpha: 0.85);
    font-size: 12px;
    cursor: pointer;
  }
  .u-ul {
    .u-content {
      display: flex;
      // width: 180px;
      // margin-left: 53px;
    }
    .m-content {
      text-align: center;
      width: 190px;
      height: 75px;
      border-right: 1px dashed #ccc;
    }
    .u-title {
      font-size: 14px;
      text-align: center;
      color: rgba($color: #000000, $alpha: 0.25);
    }
  }
  .u-tips {
    text-align: center;
    margin-top: 36px;
    margin-bottom: 36px;
    color: rgba($color: #000000, $alpha: 0.25);
  }
  //  ::v-deep .el-input--suffix {
  //     ::v-deep .el-input__inner {
  //       width: 300px;
  //     }
  //   }
}
</style>