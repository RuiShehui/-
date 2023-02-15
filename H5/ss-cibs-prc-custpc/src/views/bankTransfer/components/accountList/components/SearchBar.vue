<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-23 17:20:11
 * @LastEditTime: 2022-08-24 10:19:58
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\accountList\components\SearchBar.vue
-->
<template>
  <el-form
    class="search-bar"
    ref="searchBar"
    v-if="data && data.length"
    :model="queryData"
    :rules="rules"
    label-suffix=": "
    label-width="auto"
    label-position="right"
  >
    <el-form-item
      :class="lang == 'en'?'u-bar-item':'search-bar-item'"
      v-for="(item, index) in data"
      :key="`${index + 1} ${item.prop}`"
      :label="item.label"
      :prop="item.prop"
    >
      <component
        class="search-bar-component"
        :is="item.component | transToElComponent"
        v-model="queryData[item.prop]"
        :placeholder="
          item.component.includes('select')
            ? $t('COMMON.PLEASE_SELECT_SOMETHING',{
              select: item.lable
            })
            : item.component.includes('input')
            ? $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: item.label
              })
            : `${item.label}`
        "
        :filterable="
          [
            'payeeBank',
            'payeeBankCode',
            'creditBankCode',
            'payeeCountryCode',
            'countryCode',
            'creditBankRegion',
            'creditRegion'
          ].includes(item.prop)
        "
      >
        <template
          v-if="
            item.component === 'select' && filterOptionList(item.prop).length
          "
        >
          <el-option
            class="search-bar-component-option"
            v-for="(item, index) of filterOptionList(item.prop)"
            :key="`${index + 1} ${item.label}`"
            :style="{ width: '320px', margin: '0' }"
            v-bind="item"
          />
        </template>
      </component>
    </el-form-item>
    <div class="search-bar-item btns">
      <v-button type size="w70" @click="handleReset">
        {{
        $t('COMMON.RESET')
        }}
      </v-button>
      <v-button type="primary" size="w96" @click="handleQuery">
        {{
        $t('COMMON.SEARCH')
        }}
      </v-button>
    </div>
  </el-form>
</template>

<script>
import { transToElComponent } from '@/utils/tools';
import { bankInfos, countryInfos } from '@/mixins';
import { setOptionList } from '../utils/tools';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('app');
import {
  identifyWayList,
  IDENTIFY_WAY_MAP
} from '@bank-transfer/utils/constant';

export default {
  name: 'SearchBar',
  mixins: [bankInfos, countryInfos],
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    rules: {
      type: Object,
      default() {
        return {};
      }
    },
    payType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      queryData: {},
      identifyWayList: [
        {
          label: this.$t('PAYMENT.RECEIVE_ACCOUNT'), // 收款账户
          value: IDENTIFY_WAY_MAP.payeeAccount
        },
        {
          label: 'FPS ID', // FPS ID
          value: IDENTIFY_WAY_MAP.fpsId
        },
        {
          label: this.$t('PAYMENT.EMAIL_ADDRESS'), // 电邮地址
          value: IDENTIFY_WAY_MAP.emailAddress
        },
        {
          label: this.$t('PAYMENT.MOBILE_PHONE_NUMBER'), // 流动电话号码
          value: IDENTIFY_WAY_MAP.mobilePhone
        }
      ]
    };
  },
  filters: {
    transToElComponent
  },
  computed: {
    ...mapState(['lang']),
    searchBar() {
      const { searchBar } = this.$refs;
      return searchBar;
    }
  },
  watch: {
    // queryData(newVal) {
    //   this.$emit('handleQuery', newVal);
    // }
  },
  mounted() {
    this.initQueryData();
  },
  methods: {
    ...mapActions(['SET_LANG']),
    transToElComponent,
    initQueryData() {
      this.data.forEach(item => {
        const { prop, value = '' } = item;
        this.$set(this.queryData, prop, value);
      });
    },
    handleQuery() {
      this.$emit('handleQuery', this.queryData);
    },
    handleReset() {
      this.searchBar && this.searchBar.resetFields();
      this.$emit('handleQuery', this.queryData);
    },
    filterOptionList(prop) {
      const self = this;
      switch (prop) {
        case 'payeeBankCode':
          return setOptionList(self.filterTransBank);
        case 'creditBankCode':
          return setOptionList(self.filterTransBank);
        case 'countryCode':
          return setOptionList(self.countryInfoList);
        case 'creditRegion':
          return setOptionList(self.countryInfoList);
        case 'payeeCountryCode':
          return setOptionList(self.countryInfoList);
        case 'creditBankRegion':
          return setOptionList(self.countryInfoList);
        case 'creditAcctIdentificationType':
          return setOptionList(
            this.identifyWayList.filter(
              item => item.value !== IDENTIFY_WAY_MAP.creditCard
            )
          );
        case 'payeeIdentifyMethod':
          return setOptionList(
            this.identifyWayList.filter(
              item => item.value !== IDENTIFY_WAY_MAP.creditCard
            )
          );
        default:
          return [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '~@/style/mixin.scss';

.search-bar {
  width: 100%;
  text-align: center;
  position: relative;

  .search-bar-item {
    display: inline-block;
    text-align: right;
    width: 340px;
    margin-right: 40px;

    ::v-deep .el-form-item__label-wrap {
      position: relative;
      .el-form-item__label {
        position: relative;
        right: -5px;
      }
    }

    &.btns {
      // width: 100%;
      text-align: center;
      padding: 8px 0;
      .common-button {
        display: inline-block;
        margin-left: 12px;
      }
    }

    .search-bar-component {
      display: inline-block;
      .el-input {
        width: 320px;
      }

      // ::v-deep .search-bar-component-option {
      //   width: 320px;
      //   @include text-overflow;
      // }

      // &.el-select {
      //   position: relative;

      //   .el-select-dropdown.el-popper {
      //     position: absolute;
      //     left: 0;
      //     z-index: 100;
      //     width: 320px;
      //   }

      // }
    }
  }
  .u-bar-item {
    // display: inline-block;
    text-align: right;
    width: 340px;
    margin-right: 40px;

    ::v-deep .el-form-item__label-wrap {
      position: relative;
      .el-form-item__label {
        position: relative;
        right: -5px;
      }
    }

    &.btns {
      // width: 100%;
      text-align: center;
      padding: 8px 0;
      .common-button {
        display: inline-block;
        margin-left: 12px;
      }
    }

    .search-bar-component {
      display: inline-block;
      .el-input {
        width: 320px;
      }

      // ::v-deep .search-bar-component-option {
      //   width: 320px;
      //   @include text-overflow;
      // }

      // &.el-select {
      //   position: relative;

      //   .el-select-dropdown.el-popper {
      //     position: absolute;
      //     left: 0;
      //     z-index: 100;
      //     width: 320px;
      //   }

      // }
    }
  }
}
</style>
