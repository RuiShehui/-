<!--
 * @Autor: 赵霖
 * @Date: 2021-10-28 16:04:41
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-24 17:15:23
 * @Description: 个人账单修改
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\billMainrenace\billChange.vue
-->
<template>
  <div>
    <el-form :model="billForm" ref="billForm" :rules="rules">
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_TYPE')"
        label-width="calc(50% - 170px)"
        prop="merchantType"
      >
        <el-select
          filterable
          v-model="billForm.merchantType"
          @change="changeMerchartType($event)"
          class="f-w-340"
        >
          <el-option
            v-for="item in options"
            :value="item.merchartTypeCode"
            :label="item.merchartTypeNameZht"
            :key="item.merchartTypeCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_NAME')"
        label-width="calc(50% - 170px)"
        prop="merchartCode"
      >
        <el-select
          filterable
          v-model="billForm.merchartCode"
          @change="dealMerchantName($event)"
          class="f-w-340"
        >
          <el-option
            v-for="item in optionName"
            :value="item.merchartCode"
            :label="item.merchartNameZht"
            
            :key="item.merchartCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE')"
        label-width="calc(50% - 170px)"
        prop="billType"
        :rules="[{required:this.optionTypeIsTrue,message:'請選擇賬單類別',trigger:'change'}]"
      >
        <el-select v-model="billForm.billType" @change="dealMerchantType($event)" :disabled="!optionTypeIsTrue" class="f-w-340">
          <el-option
            v-for="item in optionType"
            :value="item.billType"
            :label="item.billTypeInfoZht"
            :key="item.billType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.BILL_NO')"
        label-width="calc(50% - 170px)"
        prop="billNo"
      >
        <el-input
          v-model="billForm.billNo"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_ALIAS')"
        label-width="calc(50% - 170px)"
        prop="merchantAlias"
      >
        <el-input v-model="billForm.merchantAlias" class="f-w-340"></el-input>
      </el-form-item>
      <div class="g-bottom">
        <el-button class="f-cancel" @click="backTo">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
        <el-button class="f-reset" @click="handleReset">{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
        <el-button type="primary" @click="confrim">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getAllEpsTypeList,
  getEps,
  getBillTypeList,
  checkMyMercharntBillNo
} from '@/api/business-management/eps-business';
import _ from 'lodash';
export default {
  name: 'BillChange',
  components: {},
  props: {
    billData: {
      type: Object,
      default: () => ({})
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this;

    return {
      rules: {
        merchantType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.MERCHANT_TYPE_RULES'),
            trigger: 'change'
          }
        ],
        merchartCode: [
          {
            required: true,
            message: self.$t('CUSTOMER_MANAGEMENT.MERCHANT_NAME_RULES'),
            trigger: 'change'
          }
        ],
        billType: [
          {
            required: false,
            message: this.$t('CUSTOMER_MANAGEMENT.BILL_TYPE_RULES'),
            trigger: 'change'
          }
        ],
        billNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.BILL_NO_RULES'),
            trigger: 'blur'
          },
          {
            pattern: /^\d+$/,
            message: this.$t('CUSTOMER_MANAGEMENT.BILL_RULES'),
            trigger: 'blur'
          }
        ]
      },
      billForm: {
        merchantTypeInfo: '', //商户类别详情
        merchantType: '', //商户类别

        merchartCode: '', //
        merchantCode: '', //商户编号
        merchantName: '', //商户名称

        billNo: '', //账单号码---手输

        billType: '', //账单类别
        billTypeInfo: '', //账单类别详情

        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'), //网银客户号

        merchantAlias: '', //商户别名

        merchartTypeCode: ''
      },
      options: [],
      optionName: [],
      optionType: [],
      optionTypeIsTrue: false //是否必选
    };
  },
  watch: {
    'optionType.length'(val) {
      console.log('val---01001',val);
      if (val > 0) {
        this.optionTypeIsTrue = true;
      } else {
        this.optionTypeIsTrue = false;
      }
    }
  },
  computed: {},
  async created() {
    this.billForm = _.cloneDeep(this.billData);
    // 获取商户类别
    const result = await getAllEpsTypeList({});
    console.log('result:',result);
    if (result.body) {
      this.options = result.body.epsTypes;
      console.log('this.options:',this.options);
    }
    if (this.isUpdate) {
      // 获取商户名称
      const resultgetEps = await getEps({
        merchartTypeCode: this.billForm.merchantType
      });
      if (resultgetEps.body) {
        this.optionName = resultgetEps.body.epsInfs;
        console.log('this.optonName:',this.optonName);
      }
      const result = await getBillTypeList({
        merchartCode: this.billForm.merchantCode
      });
      if (result.body) {
        this.optionType = result.body.billTypeList;
      }
      this.$set(this.billForm, 'merchartCode', this.billData.merchantCode);
      this.changeMerchartType(this.billData.merchantType);
      this.dealMerchantName(this.billData.merchantCode);
      this.dealMerchantType(this.billData.billType);
    }
  },
  methods: {
    confrim() {
      this.$refs['billForm'].validate(async valid => {
        if (valid) {
          if (this.optionTypeIsTrue && !this.billForm.billType) {
            this.$showMsg({
              type: 'error',
              message: "請選擇賬單類別"
            });
            return;
          } else {
          const res= await checkMyMercharntBillNo(this.billForm)
          if(res!=true && !res.body) {
            return false
          }
            this.$emit('confirm', this.billForm);
          }
        } else {
          return false;
        }
      });
    },
    backTo() {
      this.$emit('backTo');
    },
    // 获取商户名称列表方法--ok
    async dealMerchartType(newVal) {
      const res = this.options.find(item => item.merchartTypeCode === newVal);
      console.log('res:',res);
      if (res) {
        this.billForm.merchartTypeCode = res.merchartTypeCode;
        const result = await getEps({
          merchartTypeCode: res.merchartTypeCode
        });
        if (result.body) {
          this.optionName = result.body.epsInfs;
        }
      }
    },
    // 获取账单类别编号
    async dealMerchartCode(newVal) {
      const res = this.optionName.find(item => item.merchartCode === newVal);
      if (res) {
        const result = await getBillTypeList({
          merchartCode: res.merchartCode
        });
        if (result.body) {
          this.optionType = result.body.billTypeList;
        }
      }
    },
    // 商户类别选择框
    changeMerchartType(val) {
      let merchant = {};
      merchant = this.options.find(item => {
        return item.merchartTypeCode === val;
      });
      this.billForm.merchantTypeInfo = merchant.merchartTypeName;
      this.billForm.merchantType = merchant.merchartTypeCode;
      this.billForm.merchantName = '';
      this.billForm.merchantCode = '';
      this.billForm.merchartCode = '';
      this.billForm.billType = '';
      this.billForm.billTypeInfo = '';
      this.$nextTick(() => {
        this.$refs['billForm'].clearValidate(['merchartCode']);
      });
      this.dealMerchartType(val);
    },
    // 商户名称选择框
    dealMerchantName(newVal) {
      const res = this.optionName.find(item => {
        return item.merchartCode === newVal;
      });
      if (res) {
        this.billForm.merchartCode = res.merchartCode;
        this.billForm.merchantCode = res.merchartCode;
        this.billForm.merchantName = res.merchartName; //商户名称
        this.billForm.billType = '';
        this.billForm.billTypeInfo = '';
        this.dealMerchartCode(newVal);
      }
    },
    // 账单类别选择框
    dealMerchantType(val) {
      const res = this.optionType.find(item => {
        return item.billType === val;
      });
      if (res) {
        this.billForm.billType = res.billType;
        this.billForm.billTypeInfo = res.billTypeInfo;
      }
    },
    handleReset() {
      (this.billForm = {
        merchantTypeInfo: '', //商户类别详情
        merchantType: '', //商户类别
        merchartCode: '', //
        merchantCode: '', //商户编号
        merchantName: '', //商户名称
        billNo: '', //账单号码---手输
        billType: '', //账单类别
        billTypeInfo: '', //账单类别详情
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'), //网银客户号
        merchantAlias: '', //商户别名
        merchartTypeCode: ''
      }),
        this.$refs['billForm'].resetFields();
      this.optionName = [];
    }
  }
};
</script>

<style lang='scss' scoped>
.f-w-340 {
  width: 340px;
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
  .f-reset {
    color: rgba(0, 0, 0, 0.45);
    border-color: rgba(0, 0, 0, 0.45);
  }
}
</style>