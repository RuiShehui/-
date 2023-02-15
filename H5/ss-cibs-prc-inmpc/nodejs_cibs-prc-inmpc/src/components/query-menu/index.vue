<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-05-26 16:45:09
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\query-menu\index.vue
-->
<template>
  <div class="g-query-menu">
    <el-form class="transverse-form">
      <!--  label-width="auto" -->
      <template v-for="(label, prop) in properties">
        <el-form-item :label="`${label}:`" :key="`${prop}-label`" v-fix-form-label>
          <el-input
            class="menu-input"
            v-if="inputs.includes(prop)"
            v-model="params[prop]"
            :maxlength="300"
            :key="`${prop}-component`"
            :placeholder="placeholders[prop]"
            @keydown.native="handleInputSearch"
          />
          <el-select
            class="menu-select"
            v-if="prop === 'merchartTypeCode'"
            v-model="params[prop]"
            :key="`${prop}-component`"
          >
            <el-option
              class="menu-option-item"
              v-for="mtc of merchartTypeCodeList"
              :key="mtc.value"
              :label="mtc.label"
              :value="mtc.value"
            >{{ mtc.label }}</el-option>
          </el-select>
          <el-select
            v-if="prop === 'handleSt'"
            v-model="params[prop]"
            :key="`${prop}-component`"
            class="menu-select"
          >
            <el-option
              class="menu-option-item"
              v-for="opt of dealStatusList"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
            />
          </el-select>
          <el-select
            :key="`${prop}-component`"
            v-if="prop === 'discountWay'"
            v-model="params[prop]"
            class="menu-select"
          >
            <el-option
              v-for="dw of discountWayList"
              :key="`${dw.value} ${dw.label}`"
              :value="dw.value"
              :label="dw.label"
            />
          </el-select>
          <el-select
            :key="`${prop}-component`"
            v-if="prop === 'channel'"
            v-model="params[prop]"
            class="menu-select"
          >
            <el-option class="menu-option-item" :label="$t('COMMON.ENT_BANK')" value="0"></el-option>
            <el-option class="menu-option-item" :label="$t('COMMON.ENTERPRISES_BANK')" value="1"></el-option>
          </el-select>
          <el-select
            class="menu-select"
            v-if="prop === 'payeeIdentifyMethod'"
            v-model="params[prop]"
            :key="`${prop}-component`"
          >
            <el-option
              class="menu-option-item"
              v-for="item of payeeIdentifyMethodList"
              :key="`${item.value} ${item.label}`"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <!-- 等待接口请求数据 -->
          <template v-if="['payeeBank', 'payeeBankCode'].includes(prop)">
            <!-- v-if="isShowHk" -->
            <template v-if="localTransferType === 'null'">
              <el-select
                class="menu-select"
                v-if="!isShowHk"
                v-model="params[prop]"
                :key="`${prop}-component`"
                :filterable="true"
                :filter-method="handleSearchBankList"
              >
                <el-option
                  v-for="(bn, bnIdx) of bankList"
                  :key="bnIdx + bn"
                  :value="bn.institution"
                  :label="bn.institution"
                />
              </el-select>
              <el-select
                class="menu-select"
                v-else
                v-model="params[prop]"
                :key="`${prop}-component`"
                :filterable="true"
              >
                <el-option
                  v-for="(bn, bnIdx) of bankInfoList"
                  :key="bnIdx + bn"
                  :value="bn.value"
                  :label="bn.label"
                />
              </el-select>
            </template>
            <template v-if="localTransferType === 'trans'">
              <el-select
                class="menu-select"
                v-model="params[prop]"
                :key="`${prop}-component`"
                :filterable="true"
              >
                <el-option
                  v-for="(bn, bnIdx) of fpsBankList"
                  :key="bnIdx + bn"
                  :value="bn.value"
                  :label="bn.value + ' ' + bn.label"
                />
              </el-select>
            </template>
            <template v-if="localTransferType === 'local'">
              <el-select
                class="menu-select"
                v-model="params[prop]"
                :key="`${prop}-component`"
                :filterable="true"
              >
                <el-option
                  v-for="(bn, bnIdx) of chatsBankList"
                  :key="bnIdx + bn"
                  :value="bn.value"
                  :label="bn.value + ' ' + bn.label"
                />
              </el-select>
            </template>
          </template>

          <el-select
            class="menu-select"
            v-if="prop === 'countryCode'"
            v-model="params[prop]"
            :key="`${prop}-component`"
            :filterable="true"
            @change="handleChangeCountry"
          >
            <!-- @change="handleChangeCountry" -->
            <el-option
              v-for="item of countryList"
              :key="item.countryId"
              :value="item.countryId"
              :label="item.countryShortName"
            />
          </el-select>
          <el-select
            v-if="prop === 'payeeCountryCode'"
            v-model="params[prop]"
            :key="`${prop}-component`"
            :filterable="true"
            class="menu-select"
          >
            <!-- @change="handleChangeCountry" -->
            <el-option
              v-for="item of countryList"
              :key="item.countryId"
              :value="item.countryId"
              :label="item.countryShortName"
            />
          </el-select>
        </el-form-item>
      </template>
      <slot></slot>
      <el-form-item label=" ">
        <!-- :style="btnGroup.length < 3 ? {} : { width: '338px' }" -->
        <div :class="['btn-group', 'f-btns']">
          <el-button
            v-for="btn of btnGroup"
            :key="btn.name"
            :class="['op-btn', btn.type]"
            :type="btn.type"
            :plain="btn.plain"
            @click.native="handleBtnClick(btn)"
          >
            <!-- :icon="`el-icon-${btn.icon}`" -->
            <i v-if="btn.type === 'add'" class="el-icon-plus"></i>
            <span>{{ btn.name }}</span>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  // isType,
  deepClone,
  getPrueObject
} from '@/utils/tools';
import constant from '@/utils/constant';
import { createNamespacedHelpers } from 'vuex';
import { fixFormLabel } from '@/directives';
/*
  mixins
*/
import countryList from '@/mixins/country-list';
import bankInfoList from '@/mixins/bank-infos';

const { mapState } = createNamespacedHelpers('app');
const { discountWayList } = constant;

export default {
  name: 'QueryMenu',
  mixins: [countryList, bankInfoList],
  directives: {
    fixFormLabel
  },
  props: {
    properties: {
      type: Object,
      default: () => ({}) // { [prop: string]: string } -> [属性]: '标签名'
    },
    btnGroup: {
      type: Array,
      default() {
        return [
          {
            name: this.$t('COMMON.SEARCH'),
            type: 'primary'
          },
          {
            name: this.$t('COMMON.RESET'),
            type: 'reset'
          },
          {
            name: this.$t('COMMON.ADD'),
            type: 'add'
          }
        ]; // { name: string; type?: ElButtonType; plain?: boolean; icon?: string; }[]
      }
    },
    merchartTypeCodeList: {
      type: Array,
      default: () => constant.MERCHART_TYPE_CODE_LIST
    },
    payeeIdentifyMethodList: {
      type: Array,
      default: () => constant.PAYEE_IDENTIFY_METHOD_LIST
    },
    dealStatusList: {
      type: Array,
      default() {
        return [
          // {
          //   label: '全部',
          //   value: ''
          // },
          {
            label: this.$t(`COMMON.PREPEAR_HANDLE`),
            value: '01'
          },
          {
            label: this.$t(`COMMON.IS_HANDLED`),
            value: '00'
          }
        ];
      }
    },
    defaultValue: {
      type: Object,
      default: () => null
    },
    isShowHk: Boolean,
    localTransferType: {
      type: String,
      default: 'null'
    }
  },
  data() {
    return {
      // merchantClass | riskLevel
      params: {},
      inputs: [
        'merchartTypeName',
        'riskClazz',
        'payeeCode',
        'payeeName',
        'regiserCode',
        'swiftCode',
        'registerCode',
        'bankName'
      ],
      discountWayList
    };
  },
  computed: {
    ...mapState({
      lang: state => state.lang
    }),
    placeholders() {
      const placeholders = {};

      Object.keys(this.properties).forEach(prop => {
        placeholders[prop] = this.$t('header.PLEASE_INPUT', {
          property: getPropByLang(this.lang, this.properties, prop)
        });
      });

      return placeholders;
      function getPropByLang(lang, target, prop) {
        switch (lang) {
          case 'zhCN':
            return target[prop];
          case 'zhXG':
            return target[prop];
          case 'en':
            return target[prop];
          default:
            return prop;
        }
      }
    },
    // is-show-new-line
    isShowNewLine() {
      return Object.keys(this.properties).length > 3;
    }
  },
  mounted() {
    this.initParams();
  },
  methods: {
    /**
     * init-request-params
     */
    initParams() {
      if (Object.getOwnPropertyNames(this.properties).length) {
        this.params = {};
        if (this.defaultValue && Object.keys(this.defaultValue).length) {
          for (let k in this.defaultValue) {
            const value = this.defaultValue.hasOwnProperty(k)
              ? this.defaultValue[k]
              : '';
            this.$set(this.params, k, value);
          }
          // 开始时间和结束时间为最近30天
        } else {
          for (let k in this.properties) {
            if (['size', 'total', 'current'].includes(k)) {
              this.$set(this.params, k, 0);
            } else this.$set(this.params, k, '');
          }
          'handleSt' in this.properties &&
            this.$set(this.params, 'handleSt', '01');
        }

        if (this.merchartTypeCodeList.length) {
          this.$set(
            this.params,
            'merchartTypeCode',
            this.merchartTypeCodeList[0].value
          );
        }
      }
      // set merchartTypeCode
    },
    /**
     * handle-btn-click
     */
    handleBtnClick({ name }) {
      switch (name) {
        case this.$t('COMMON.SEARCH'):
          this.handleSearch();
          break;
        case this.$t('COMMON.RESET'):
          this.initParams();
          this.$emit('handleReset');
          break;
        case this.$t('COMMON.ADD'):
          this.handleAdd();
          break;
        default:
          break;
      }
    },
    /**
     * handle-input-search
     * @param {KeyboardEvent} e keyboard-event
     */
    handleInputSearch(e) {
      const enterCode = e.code.toLowerCase();
      if (enterCode.includes('enter')) {
        this.handleSearch();
      }
    },
    /**
     * handle-search
     */
    handleSearch() {
      console.log('this.params', this.params);
      const params = getPrueObject(deepClone(this.params)),
        requestParams = {
          ...params,
          current: 1
        };
      this.$emit('handleSearch', requestParams);
    },
    /**
     * handle-add
     */
    handleAdd() {
      this.$emit('handleAdd');
    },
    /**
     * init-merchart-code
     */
    initMerchartTypeCode() {
      try {
        if (
          this.$parent.requestParams &&
          'merchartTypeCode' in this.$parent.requestParams
        ) {
          let initCode = this.$parent.requestParams.merchartTypeCode;
          this.$set(this.params, 'merchartTypeCode', initCode);
        }
      } catch (err) {
        this.$showMsg({
          message: err,
          type: 'error'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
  width: 270px !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-query-menu {
  display: flex;
  flex-wrap: wrap;
  .g-block {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .menu-label {
    display: inline-block;
    font-size: 14px;
    margin-left: 20px;
    margin-right: 8px;
  }
  .menu-input,
  .menu-select {
    display: inline-block;
    width: 270px;
    margin-right: 20px;
  }

  .f-btns {
    button {
      font-size: 16px;
      width: 90px;
      border-radius: 4px;
    }
    .reset {
      color: rgba(0, 0, 0, 0.45);
      border-color: rgba(0, 0, 0, 0.45);
    }
    .add {
      color: #f06b00;
      border-color: #f06b00;
    }
  }
  .btn-group {
    width: 380px;
    text-align: right;
  }
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>