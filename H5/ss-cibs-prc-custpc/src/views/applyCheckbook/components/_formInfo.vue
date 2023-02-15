<template>
  <div class="g-formInfo">
    <divider :title="$t('HEAD.Payer_iPayer')"></divider>
    <el-form label-width="390px" ref="form" :model="formData" :rules="rules" class="m-form">
      <el-form-item :label="$t('HEAD.Current_account')" prop="account">
        <el-select v-model="formData.account" @change="selectAccountValue">
          <el-option
            v-for="item in account"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('HEAD.Delivery_method')" prop="getWay">
        <el-select
          v-model="formData.getWay"
          @change="getways"
          :disabled="true"
          :placeholder="$t('AUTHORIZE.Surface_Mail')"
        >
          <el-option
            v-for="item in getWayList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 授权提醒 组件 -->
    <auth-select
      v-if="yesauthor"
      ref="authorizationSelect"
      labelWidth="160px"
      @checkClick="getAuthInfo"
      :authInfo="formData.authInfo"
      :book="true"
    />
    <div class="f-btn">
      <VButton
        size="w160"
        style="margin-right:15px;"
        @click="reset('formData')"
      >{{ $t('HEAD.Reset') }}</VButton>
      <VButton size="w160" type="primary" @click="next">
        {{
        $t('HEAD.Next')
        }}
      </VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{ $t('TIPS.Tips') }}</p>
      <ul class="u-content">
        <li>{{ $t('TIPS.Tips_one') }}</li>
        <li>{{ $t('TIPS.Tips_two') }}</li>
        <li>{{ $t('TIPS.Tips_three') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { currentAcctDropDown } from '@/api/applyCheckbook';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import accountManagement from '@/filters/accountManagement';

const getAccountType = accountManagement.accountType;

export default {
  name: 'ApplyCheckBookFormInfo',
  inject: ['clearLevelLists', 'scrollToTop', 'entType'],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          account: '',
          account1: '',
          getWay: this.$t('AUTHORIZE.Surface_Mail'),
          tips: [],
          authInfo: {}
        };
      }
    }
  },
  data() {
    return {
      account: [],
      getWayList: [
        {
          label: this.$t('AUTHORIZE.Surface_Mail'),
          value: '0'
        }
      ],
      currnetNoList: [],

      rules: {
        account: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.CURRENT')
            }),
            trigger: 'blur'
          }
        ]
      },
      authoA: '', //授权人A
      authoB: '', //授权人B
      authoC: '', //授权人C
      yesauthor: false, //判斷是否需要授權
      flag: false //标识是否重置了
    };
  },
  created() {
    // console.log('formData的数据', this.formData);
    this.getCurrentAccts();
    this.queryTranIsAuthInit();
  },
  methods: {
    async queryTranIsAuthInit() {
      const result = await queryTranIsAuth({
        businessCode: '10' // 交易码
      });
      this.$set(this, 'yesauthor', result);
    },
    async getCurrentAccts() {
      const result = await currentAcctDropDown();
      if (result) {
        const { currnetNoList } = result;
        this.$set(this, 'currnetNoList', [...currnetNoList]);
        this.account = currnetNoList.map((item, index) => {
          const { accountNo } = item;
          const accountType = getAccountType(item.accountType);
          return {
            value: index,
            label: `${accountNo} ${item.currency} ${accountType}`
          };
        });
      }
    },
    selectAccountValue(index) {
      this.formData.data = this.currnetNoList[index];
      this.formData.getWay = this.$t('AUTHORIZE.Surface_Mail');
    },
    getways(index) {
      this.formData.getWays = this.getWayList[index - 1];
    },
    next() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('next', this.formData);
        }
      });
      if (this.$refs['authorizationSelect'].AlevelList.length > 0) {
        this.formData.authInfo.AlevelList.map((item, index) => {
          if (this.authoA == '') {
            this.authoA = item;
          } else {
            this.authoA = this.authoA + ',' + item;
          }
        });
        this.formData.authoA = this.authoA;
      } else {
        this.formData.authoA = '';
      }
      if (this.$refs['authorizationSelect'].BlevelList.length > 0) {
        this.formData.authInfo.BlevelList.map((item, index) => {
          if (this.authoB == '') {
            this.authoB = item;
          } else {
            this.authoB = this.authoB + ',' + item;
          }
        });
        this.formData.authoB = this.authoB;
      } else {
        this.formData.authoB = '';
      }
      if (this.$refs['authorizationSelect'].ClevelList.length > 0) {
        this.formData.authInfo.ClevelList.map((item, index) => {
          if (this.authoC == '') {
            this.authoC = item;
          } else {
            this.authoC = this.authoC + ',' + item;
          }
        });
        this.formData.authoC = this.authoC;
      } else {
        this.formData.authoC = '';
      }
    },
    reset(value) {
      this.formData = {
        account: ''
      };
      this.$refs[value].resetFields();
      console.log('authorizationSelect', this.$refs['authorizationSelect']);
      if (this.$refs['authorizationSelect']) {
        this.$refs['authorizationSelect'].reset();
        this.clearLevelLists();
      }
    },
    // 获取授权信息
    getAuthInfo(val) {
      this.formData.authInfo = val;
      console.log('info', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-form {
  ::v-deep .el-input__inner {
    width: 320px !important;
  }
  ::v-deep .el-input--suffix {
    width: 320px;
  }
}
.f-btn {
  margin-left: 36%;
  display: flex;
}
.u-tips {
  margin-top: 140px;
  .u-title {
    color: rgba($color: #000000, $alpha: 0.85);
    font-size: 14px;
  }
  .u-content {
    color: rgba($color: #000000, $alpha: 0.45);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
  }
}
</style>
