<template>
  <div class="g-info-write-wrapper">
    <el-form ref="form" :model="form" :rules="formRules">
      <el-row>
        <el-col :push="5">
          <el-form-item label-width="200px" :label="$t('BILLPAYMENT.PAYEE_NICKNAME')">
            <el-input v-model="form.alias"></el-input>
          </el-form-item>
        </el-col>
        <el-col :push="5">
          <el-form-item
            label-width="200px"
            :label="$t('BILLPAYMENT.MERCHANT_CATEGORY')"
            prop="businessType"
          >
            <el-select
              v-model="form.businessType"
              :disabled="type==='edit'"
              filterable
              @change="chooseBusinessType()"
            >
              <el-option
                v-for="item in businessTypeList"
                :key="item.value"
                :label="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                :value="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
            <span
              class="u-merchant"
              @click="allBusiness"
            >{{$t('BILLPAYMENT.VIEW_FULL_MERCHANT_LIST')}}</span>
          </el-form-item>
        </el-col>
        <el-col :push="5">
          <el-form-item
            label-width="200px"
            class="m-noMargin"
            :label="$t('BILLPAYMENT.MERCHANT_NAME')"
            prop="name"
          >
            <el-select
              v-model="form.name"
              :disabled="type==='edit'"
              filterable
              @change="chooseBusinessName()"
            >
              <el-option
                v-for="item in nameList"
                :key="item.accountNo"
                :label="item.lang=='zh-CN'?item.merchartName:item.lang=='zh-HK'?item.merchartNameZht:item.merchartNameEn"
                :value="item.lang=='zh-CN'?item.merchartName:item.lang=='zh-HK'?item.merchartNameZht:item.merchartNameEn"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :push="5">
          <el-form-item
            label-width="200px"
            :label="$t('BILLPAYMENT.BILL_TYPE')"
            prop="billTypeInfo"
            :rules="[{required:this.billTypeInfostatus,message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL'),trigger:'blur'}]"
          >
            <el-select
              v-model="form.billTypeInfo"
              :disabled="type==='edit'"
              @change="billTypeInfo()"
            >
              <el-option
                v-for="item in accountTypeList"
                :key="item.value"
                :label="item.lang=='zh-CN'?item.billTypeInfo:item.lang=='zh-HK'?item.billTypeInfoZht:item.billTypeInfoEn"
                :value="item.lang=='zh-CN'?item.billTypeInfo:item.lang=='zh-HK'?item.billTypeInfoZht:item.billTypeInfoEn"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :push="5">
          <el-form-item
            class="m-noMargin"
            label-width="200px"
            :label="$t('BILLPAYMENT.BILL_NO')"
            prop="phone"
          >
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="auth-check-box" v-if="statustpe">
      <auth-select
        :authInfo="authInfo"
        ref="authorizationSelect"
        labelWidth="160px"
        tradeType="060102"
        @checkClick="getAuthInfo"
        :isMoney="false"
      />
    </div>
    <div class="g-btns">
      <v-button class="f-hasMargin" size="w160" @click="back">{{$t('COMMON.BACK')}}</v-button>
      <v-button size="w160" type="primary" @click="next">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </div>
    <el-dialog :visible.sync="showPopup" width="980px" top="0vh">
      <div class="u-head">{{$t('BILLPAYMENT.FULL_MERCHANT_LIST')}}</div>
      <el-form>
        <el-col :span="10">
          <el-form-item :label="$t('BILLPAYMENT.MERCHANT_CATEGORY') + ' :'" prop="payNo">
            <el-select v-model="form.businessType">
              <el-option
                v-for="item in businessTypeList"
                :key="item.value"
                :label="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
                :value="item.lang=='zh-CN'?item.merchartTypeName:item.lang=='zh-HK'?item.merchartTypeNameZht:item.merchartTypeNameEn"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <v-button
            class="btnStyle"
            size="orange-w75"
            @click="chooseBusinessType()"
          >{{$t('BILLPAYMENT.INQUIRE')}}</v-button>
        </el-col>
      </el-form>
      <el-table max-height="300" :data="businessTable" style="width: 100%;">
        <el-table-column prop="merchartName" :label="$t('BILLPAYMENT.MERCHANT_NAME')" >
          <template
            slot-scope="scope"
          >{{ lang === 'zh-CN'? scope.row.merchartName : lang === 'zh-HK' ? scope.row.merchartNameZht : scope.row.merchartNameEn}}</template>
        </el-table-column>
        <el-table-column prop="billNo" :label="$t('BILLPAYMENT.BILL_NO')" >
          <template slot-scope="scope">{{ scope.row.billNo}}</template>
        </el-table-column>
        <el-table-column prop="billType" :label="$t('BILLPAYMENT.BILL_TYPE')"></el-table-column>
        <el-table-column
          prop="billTypeInfo"
          :label="$t('BILLPAYMENT.BILL_TYPE_DESCRIPTION')"
          
        >
          <template slot-scope="scope">{{ lang === 'zh-CN'? scope.row.billTypeInfo : lang === 'zh-HK' ? scope.row.billTypeInfoZht : scope.row.billTypeInfoEn}}</template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, sizes, jumper"
        :total="Number(total)"
        :current-page="Number(currentPage)"
        :page-size="Number(pageSize)"
        :page-sizes="[10, 20, 30, 50]"
        class="pagination"
      ></el-pagination> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  saletype,
  queryMerchantList,
  queryHighMerTypeList,
  alllist,
  checkMyMerchantBillNo,
  myMerchantDetail
} from '@/api/payService.js';

import { queryTranIsAuth } from '@/api/authorizeCenter';
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    chuangdate: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      lang: '',
      // pageSize: '1',
      // currentPage: '1',
      // total: '0',
      statustpe: false,
      billTypeInfostatus: true,
      payNoList: [],
      radio: '',
      arrone: '',
      showPopup: false,
      businessTable: [{}],
      form: {
        alias: '',
        name: '',
        businessType: '',
        billType: '',
        phone: '',
        accountType: '',
        radio1: '',
        radio2: '',
        radio3: '',
        billCode: '',
        status: '',
        mertchartTypeCode: '',
        mertchantCode: '',
        billTypeInfo: ''
      },
      authInfo: {}, // 授权人信息返显
      nameList: [{ value: 'AUD', label: 'AUD' }],
      businessTypeList: [{ value: 'AUD', label: 'AUD' }],
      accountTypeList: [{ value: 'AUD', label: 'AUD' }],
      formRules: {
        alias: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_NICKNAME'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_NAME'),
            trigger: 'change'
          }
        ],
        businessType: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_CATEGORY'),
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL_NO'),
            trigger: 'blur'
          }
        ],
        accountType: [
          {
            required: true,
            message: this.$t('BILLPAYMENT.PLEASE_ENTER_BILL'),
            trigger: 'change'
          }
        ]
      }
    };
  },
  async created() {
    this.lang = localStorage.getItem('lang');
    this.Datalist();
    let paramsthree = {};
    alllist(paramsthree).then(res => {
      this.businessTable = res;
    });
    this.form.status = this.type;
    const ressix = await queryTranIsAuth({ businessCode: '060102' });
    this.statustpe = ressix;
    if (this.type == 'edit') {
      let paramsdetail = {
        id: this.chuangdate.billCode,
        langFlag:
          localStorage.getItem('lang') == 'zh-CN'
            ? '0'
            : localStorage.getItem('lang') == 'zh-HK'
            ? '1'
            : '2'
      };
      myMerchantDetail(paramsdetail).then(res => {
        this.form.name = res.merchantName;
        this.form.phone = res.billNo;
        this.form.accountType = res.billTypeInfo;
        this.form.billTypeInfo = res.billTypeInfo;
        this.form.businessType = res.merchantTypeInfo;
        this.form.alias = res.merchantAlias;
        this.form.billCode = res.billCode;
        this.form.mertchantCode = res.merchantCode;
        this.form.billType = res.billType;
        this.form.mertchartTypeCode = res.merchantType;
      });

      if (this.form.billTypeInfo) {
        this.billTypeInfostatus = true;
      } else {
        this.billTypeInfostatus = false;
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler: function() {
        if (JSON.stringify(this.formData) == '{}') return;
        this.form = this.formData;
      }
    }
  },
  methods: {
    async Datalist() {
      let params = {};
      // //查询商户类别
      const resone = await queryHighMerTypeList({});
      this.businessTypeList = resone;
      for (let i = 0; i < this.businessTypeList.length; i++) {
        const lang = localStorage.getItem('lang');
        this.businessTypeList[i].lang = lang;
      }
      console.log('this.businessTypeList', this.businessTypeList);
    },
    getAuthInfo(data) {
      console.log(data);
      this.$set(this.form, 'authInfo', data);
      //获取授权人数信息
    },
    async chooseBusinessType() {
      this.form.name = '';
      //查询商户名称
      for (let i = 0; i < this.businessTypeList.length; i++) {
        if (
          this.form.businessType == this.businessTypeList[i].merchartTypeName ||
          this.form.businessType ==
            this.businessTypeList[i].merchartTypeNameZht ||
          this.form.businessType == this.businessTypeList[i].merchartTypeNameEn
        ) {
          this.arrone = this.businessTypeList[i].merchartTypeCode;
        }
      }
      this.form.mertchartTypeCode = this.arrone;
      let paramstwo = {
        merchartTypeCode: this.arrone
      };
      const restwo = await queryMerchantList(paramstwo);
      this.businessNameList = restwo;
      this.nameList = restwo;
      for (let i = 0; i < this.nameList.length; i++) {
        const lang = localStorage.getItem('lang');
        this.nameList[i].lang = lang;
      }
      let paramsthreedemo = {
        merchartTypeCode: this.arrone
      };
      alllist(paramsthreedemo).then(res => {
        this.businessTable = res;
      });
    },
    demo() {
      this.form.billTypeInfo = '';
      for (let i = 0; i < this.nameList.length; i++) {
        if (this.form.name == this.nameList[i].merchartName) {
          this.accountTypeList = this.nameList[i].commEpsMerchantBills;
          this.form.mertchantCode = this.nameList[i].merchartCode;
        }
      }
    },
    chooseBusinessName() {
      this.form.billTypeInfo = '';
      for (let i = 0; i < this.businessNameList.length; i++) {
        if (
          this.form.name == this.businessNameList[i].merchartName ||
          this.form.name == this.businessNameList[i].merchartNameZht ||
          this.form.name == this.businessNameList[i].merchartNameEn
        ) {
          this.accountTypeList = this.businessNameList[i].commEpsMerchantBills;
          this.form.mertchantCode = this.businessNameList[i].merchartCode;
          if (this.accountTypeList[0].billTypeInfo == null) {
            this.billTypeInfostatus = false;
          } else {
            this.billTypeInfostatus = true;
          }
          for (let i = 0; i < this.accountTypeList.length; i++) {
            const lang = localStorage.getItem('lang');
            this.accountTypeList[i].lang = lang;
          }
        }
      }
    },
    billTypeInfo() {
      for (let i = 0; i < this.accountTypeList.length; i++) {
        if (
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfo ||
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfoZht ||
          this.form.billTypeInfo == this.accountTypeList[i].billTypeInfoEn
        ) {
          this.form.billType = this.accountTypeList[i].billType;
        }
      }
    },
    allBusiness() {
      console.log(11);
      this.showPopup = true;
    },
    reset() {
      this.$refs.form.resetFields();
    },
    back() {
      this.$router.go(-1);
    },
    next() {
      let params = {
        merchantCode: this.form.mertchantCode,
        billType: this.form.billType,
        billNo: this.form.phone,
        merchantType: this.form.mertchartTypeCode
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          checkMyMerchantBillNo(params).then(res => {
            if (res) {
              this.$emit('next', this.form);
            }
          });
        }
      });
    },
    // handleSizeChange(size) {
    //   this.pageSize = size;
    // },
    // handleCurrentChange(currentPage) {
    //   this.currentPage = currentPage;
    // }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  text-align: center;
  padding-top: 46px;
  padding-bottom: 20px;
  padding-left: 1px;
  justify-content: center;
}
.f-hasMargin {
  margin-right: 24px;
}
.u-dotted {
  float: left;
  width: 4px;
  height: 18px;
  background: #f06b00;
  margin-top: 3.5px;
}
.u-top {
  width: 72px;
  height: 26px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: 0;
  line-height: 26px;
  font-weight: 500;
  padding-left: 16px;
}
.g-tip {
  height: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  font-weight: 400;
  padding-left: 10px;
}
.u-merchant {
  width: 112px;
  height: 22px;
  font-size: 14px;
  color: #f06b00;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
  padding-left: 16px;
}
.u-head {
  text-align: center;
  letter-spacing: 0;
  width: 916px;
  height: 26px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 26px;
  font-weight: 500;
  padding-bottom: 24px;
}
.btnStyle {
  /deep/.el-button {
    padding: 12px 20px !important;
  }
}

/deep/.el-form-item__content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
  margin-left: 80px;
}
/deep/.el-col-push-6 {
  position: relative;
  left: 13%;
}
.auth-check-box {
  ::v-deep .el-checkbox-group {
    height: 36px;
  }
  ::v-deep .el-checkbox {
    padding-top: 0px;
    height: 36px;
    line-height: 36px;
  }
}
</style>