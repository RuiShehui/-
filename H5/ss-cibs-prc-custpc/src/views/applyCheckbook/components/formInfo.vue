<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-09-17 14:40:22
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\applyCheckbook\components\formInfo.vue
-->
<template>
  <div class="g-formInfo" v-loading="requestLoading">
    <!-- 填写区域 -->
    <divider :title="$t('HEAD.Payer_iPayer')"></divider>
    <el-form
      class="m-form"
      ref="form"
      :model="model"
      :rules="rules"
      label-width="calc(50% - 160px)"
      label-suffix=":"
    >
      <el-form-item
        class="m-form-item"
        :label="$t('HEAD.Current_account')"
        prop="accountNo"
      >
        <el-select
          class="m-form-item-component"
          v-model="model.accountNo"
          @change="onAccountNoChange"
        >
          <el-option
            v-for="item of acctList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        class="m-form-item"
        :label="$t('HEAD.Delivery_method')"
        prop="getWay"
      >
      <el-input v-model="model.way" :disabled="true"></el-input>
      
      </el-form-item>
    </el-form>
    <!-- 填写区域 -->
    <!-- 授权选择区域 -->
    <template v-if="entType !== 1">
      <auth-select
        ref="authSelect"
        labelWidth="160px"
        @checkClick="getAuthInfo"
        :authInfo="formData.authInfo"
        :book="true"
        :isMoney="false"
        tradeType="10"
      />
    </template>
    <!-- 授权选择区域 -->
    <!-- 操作区域 -->
    <div class="f-btn">
      <VButton size="w160" style="margin-right:15px;" @click="onResetForm">{{
        $t('HEAD.Reset')
      }}</VButton>
      <VButton size="w160" type="primary" @click="onNextStep">{{
        $t('HEAD.Next')
      }}</VButton>
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

import { formatAcctNo } from '@bank-transfer/utils/function';
import { currentAcctDropDown } from '@/api/applyCheckbook';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import accountManagement from '@/filters/accountManagement';
import { mapState } from 'vuex';

const filterAcctType = accountManagement.accountType;

export default {
  name: 'ApplyCheckbookInput',
  inject: ['entType', 'scrollToTop'],
  props: {
    formData: Object,
    /** 邮寄方式列表 */
    getWayList: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      /** 表单数据 */
      model: {
        accountNo: '', // 选择账户
        getWay: '0', // 邮寄方式
        currency: '', // 交易币种
        accountType: '', // 账户类型
        way:this.$t('AUTHORIZE.Surface_Mail'),
        /** 授权信息 */
        authInfo: {}
      },
      /** 账户列表 */
      acctList: [],
      /** 是否需要授权 */
      yesauthor: false,
    };
  },
  computed: {
    ...mapState(['requestLoading']),
    rules() {
      const self = this;
      return {
        accountNo: {
          required: true,
          trigger: 'change',
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('HEAD.Current_account')
          })
        },
        getWay: {
          required: true,
          trigger: 'change',
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('HEAD.Delivery_method')
          })
        },
      };
    }
  },
  watch: {
    model: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.$emit('setFormData', newVal);
      }
    }
  },
  mounted() {
    this.scrollToTop(); // 页面置顶
    this.initFormData(); // 初始化数据
    this.getAcctList(); // 获取账户列表
    // this.queryTranIsAuthInit(); // 查询此用户是否需要授权
  },
  methods: {
    /** 初始化form中的数据 */
    initFormData() {
      if (Object.getOwnPropertyNames(this.formData).length) {
        for (let key in this.formData) {
          if (key in this.model) {
            const value = this.formData[key];
            this.$set(this.model, key, value);
          }
        }
      }
      // console.log('init form data', this.model);
    },
    /** 获取账户列表 */
    async getAcctList() {
      const result = await currentAcctDropDown();
      if (result) {
        const { currnetNoList } = result;
        this.setAcctList(currnetNoList);
      }
    },
    setAcctList(list) {
      const acctList = list.map(item => {
        const { accountNo, currency } = item,
          accountType = filterAcctType(item.accountType);
        return {
          value: accountNo,
          label: `${formatAcctNo(accountNo)} ${item.currency} ${accountType}`,
          accountType,
          currency
        };
      });
      this.$set(this, 'acctList', acctList);
    },
    /** 
     * 判断当前账户是否为MAM账户
    **/
    async queryTranIsAuthInit() {
      const result = await queryTranIsAuth({
        businessCode: '10' // 交易码
      });
      this.$set(this, 'yesauthor', result);
    },
    /** 选择accountNo之后的回调函数 */
    onAccountNoChange(selectValue) {
      const target = this.acctList.find(item => item.value === selectValue);
      if (target) {
        this.$set(this.model, 'currency', target.currency);
        this.$set(this.model, 'accountType', target.accountType);
      }
    },
    /** 获取授权信息 */
    getAuthInfo(val) {
      this.$set(this.model, 'authInfo', val);
    },
    /** 下一步操作 */
    onNextStep() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit('next', { ...this.model });
      });
    },
    /** 重置表单中的内容 */
    onResetForm() {
      this.$refs['form'].resetFields();
      this.$refs['authSelect'].reset();
    }
  }
};
</script>

<style scoped lang="scss">
.g-formInfo {
  .m-form {
    .m-form-item {
      // margin-bottom: 12px;

      ::v-deep .el-input {
        width: 320px;
      }
      ::v-deep .el-select-dropdown .el-popper {
        width: 320px;
      }
      .m-form-item-component {
        width: 320px;
      }
    }
  }
  .f-btn {
    margin-top: 16px;
    margin-left: 36%;
    display: flex;
  }
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
    margin-top: 10px;
  }
}
</style>
