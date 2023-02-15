<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-08 10:18:23
 * @LastEditTime: 2022-06-10 17:51:45
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\merchantsMaintain\merchantsMaintain-operate.vue
-->

<template>
  <div class="contain">
    <el-form
      ref="form1"
      :model="submitData"
      :rules="submitRules"
      :disabled="readonly || stepIndex > 1"
      label-position="right"
      label-width="calc(50% - 170px)"
      label-suffix=":"
    >
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE')" prop="merchartTypeCode">
        <el-select
          class="g-form-select"
          v-model="submitData.merchartTypeCode"
          v-loading="!merchainTypeList.length"
          :disabled="routeQuery.type && routeQuery.type === 'edit'"
        >
          <el-option
            v-for="item in merchainTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(簡)'" prop="merchartName">
        <el-input
          class="g-form-input"
          v-model="submitData.merchartName"
          :maxlength="300"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(繁)'" prop="merchartNameZht">
        <el-input
          class="g-form-input"
          v-model="submitData.merchartNameZht"
          :maxlength="300"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(英)'" prop="merchartNameEn">
        <el-input
          class="g-form-input"
          v-model="submitData.merchartNameEn"
          :maxlength="300"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE')" prop="merchartCode">
        <el-input
          :disabled="routeQuery.type && routeQuery.type === 'edit'"
          class="g-form-input"
          v-model="submitData.merchartCode"
          :maxlength="100"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" class="u-tabs">
      <el-tab-pane :label="$t('BUSINESS_MANAGEMENT.BILL_SETTINGS')" name="options">
        <el-button
          class="f-add"
          v-show="stepIndex === 1"
          :disabled="!ableAdd || readonly"
          icon="el-icon-plus"
          @click="handleAdd"
        >{{ $t('COMMON.ADD') }}</el-button>
        <el-form
          ref="form2"
          :model="submitData"
          :rules="submitRules"
          :disabled="readonly || stepIndex > 1"
        >
          <el-form-item prop="commEpsMerchantBills">
            <el-table
              :data="submitData.commEpsMerchantBills"
              :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
              stripe
            >
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_NO_DETIAL')+'(簡)'"
                prop="billNumberInfo"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="300"
                    :disabled="readonly"
                    v-model="row.billNumberInfo"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_NO_DETIAL')+'(繁)'"
                prop="billNumberInfoZht"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="300"
                    :disabled="readonly"
                    v-model="row.billNumberInfoZht"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_NO_DETIAL')+'(英)'"
                prop="billNumberInfoEn"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="300"
                    :disabled="readonly"
                    v-model="row.billNumberInfoEn"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_TYPE_LABEL')"
                prop="billType"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="100"
                    :disabled="readonly"
                    v-model="row.billType"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL')+'(簡)'"
                prop="billTypeInfo"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="500"
                    :disabled="readonly"
                    v-model="row.billTypeInfo"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL')+'(繁)'"
                prop="billTypeInfoZht"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="500"
                    :disabled="readonly"
                    v-model="row.billTypeInfoZht"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL')+'(英)'"
                prop="billTypeInfoEn"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="500"
                    :disabled="readonly"
                    v-model="row.billTypeInfoEn"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_NUM_LIMIT')"
                prop="billNumLimit"
                width="250px"
              >
                <template v-slot="{ row }" width="250px">
                  <money-input
                    class="g-form-input short"
                    :disabled="readonly"
                    type="number"
                    v-model="row.billNumLimit"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                    :maxlength="2"
                  />
                </template>
              </el-table-column>-->
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_EFFECTIVE_TIME')"
                prop="billEffectiveTime"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-date-picker
                    class="g-form-input short"
                    v-model="row.billEffectiveTime"
                    :picker-options="pickerOptions"
                    :placeholder="$t('COMMON.PLEASE_SELECT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.BILL_FAILURE_TIME')"
                prop="billFailureTime"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-date-picker
                    class="g-form-input short"
                    v-model="row.billFailureTime"
                    :picker-options="pickerOptions"
                    :placeholder="$t('COMMON.PLEASE_SELECT')"
                  />
                </template>
              </el-table-column>
              <!-- todo -->
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.MINMIUM_AMOUNT')"
                prop="minmiumAmount"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="500"
                    :disabled="readonly"
                    v-model="row.minmiumAmount"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.MAXMIUM_AMOUNT')"
                prop="maxmiumAmount"
                width="250px"
              >
                <template v-slot="{ row }">
                  <el-input
                    class="g-form-input short"
                    :maxlength="500"
                    :disabled="readonly"
                    v-model="row.maxmiumAmount"
                    :placeholder="$t('COMMON.PLEASE_INPUT')"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.CHARGING_TYPE')"
                prop="chargingType"
                width="185px"
              >
                <template v-slot="{ row }">
                  <el-select v-model="row.chargingType" :placeholder="$t('COMMON.PLEASE_SELECT')">
                    <el-option
                      v-for="item of chargingTypeList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </template>
              </el-table-column> -->
              <!-- <el-table-column
                :label="$t('BUSINESS_MANAGEMENT.CARD_STANDED')"
                prop="cardStanded"
                width="185px"
              >
                <template v-slot="{ row }">
                  <el-select v-model="row.cardStanded" :placeholder="$t('COMMON.PLEASE_SELECT')">
                    <el-option
                      v-for="item of cardStandedList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('COMMON.OPERATION')" width="200px">
                <template v-slot="{ $index, row }">
                  <el-button
                    v-show="$index > 0"
                    :disabled="
                  submitData.commEpsMerchantBills.length <= 1 || readonly
                "
                    type="text"
                    class="f-del"
                    @click="handleDeleteItem(row, $index)"
                  >{{ $t('COMMON.DELETE') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <footer class="g-btn">
      <el-button
        :class="['g-bottom-btn', btnIdx > 0 ? 'confirm' : 'cancel']"
        v-for="(btn, btnIdx) of bottomBtns"
        :key="btnIdx"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click="handleOperations(btn.name)"
      >{{ btn.name }}</el-button>
    </footer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import mapValidators from '@/utils/stategies';
import {
  setNRandomNumber,
  deepClone,
  isType,
  transToHighCamel
} from '@/utils/tools';
import dateTools from '@/utils/dateTools';
import { getEpsBusinessList } from '@/api/business-management/eps-business';
import {
  addMMItem,
  editMMItem
} from '@/api/business-management/merchants-maintain';
import listMixin from './mixin-list';
import constants from '@/utils/constant';

const { RISK_LEVEL_LIST } = constants;

const { mapMutations } = createNamespacedHelpers('tabs');
const { formatDate } = dateTools;

export default {
  name: 'MerchantMaintainOperate',
  components: {},
  mixins: [listMixin],
  data() {
    return {
      submitData: {
        /** 类别 */
        merchartTypeCode: '',
        merchartName: '',//商户类别
        merchartNameZht:'',
        merchartNameEn:'',
        merchartCode: '',
        commEpsMerchantBills: [
          {
            // "billCode": "",
            billNumberInfo: '',//账单号码详情
            billNumberInfoEn:'',
            billNumberInfoZht:'',
            billType: '',
            billTypeInfo: '',//账单类别详情
            billTypeInfoEn:'',
            billTypeInfoZht:'',
            billCode: String(setNRandomNumber(4)),
            billNumLimit: '10',
            billEffectiveTime: '',
            billFailureTime: '',
            // chargingType: '',
            // cardStanded: '',
            // merchartCode: '' // 和上面的要一致
            minmiumAmount:'',
            maxmiumAmount:'',
          }
        ]
      },
      activeName: 'options',
      merchainTypeList: [],
      pickerOptions: {
        disabledDate(date) {
          return !(new Date(date).getTime() > new Date().getTime());
        }
      },
      stepIndex: 1,
      // 风险等级列表
      RISK_LEVEL_LIST
    };
  },
  computed: {
    routeQuery() {
      const { query } = this.$route;
      return query;
    },
    ableAdd() {
      const { commEpsMerchantBills } = this.submitData;
      if (!commEpsMerchantBills || !commEpsMerchantBills.length) {
        return true;
      }
      const _len = commEpsMerchantBills.length;
      const lastItem = commEpsMerchantBills[_len - 1];
      if (!lastItem.billNumberInfo.length ||!lastItem.billNumberInfoZht.length ||!lastItem.billNumberInfoEn.length) {
        return false
      }
      return true;
    },
    readonly() {
      const { meta } = this.$route;
      const { type } = meta;
      return type === 'detail' ? true : false;
    },
    submitRules() {
      const {
        STR_NOT_EMPTY,
        CHECK_COMM_EPS_MERCHANT_BILLS //
      } = mapValidators(this);
      return {
        merchartTypeCode: STR_NOT_EMPTY(
          this.$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE'),
          'change'
        ),
        merchartName: STR_NOT_EMPTY(this.$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')),
        merchartNameZht: STR_NOT_EMPTY(this.$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')),
        merchartNameEn: STR_NOT_EMPTY(this.$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')),
        merchartCode: STR_NOT_EMPTY(
          this.$t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE')
        ),
        commEpsMerchantBills: CHECK_COMM_EPS_MERCHANT_BILLS(),
        // billEffectiveTime: {
        //   required: true,
        //   trigger: 'change',
        //   validator: (r, val, cb) => {
        //     if (!val || !val.length) {
        //       cb(
        //         new Error(
        //           this.$t('BUSINESS_MANAGEMENT.PLEASE_SELECT_EFFECTIVE_TIME')
        //         )
        //       );
        //       return;
        //     }
        //     cb();
        //   }
        // },
        // billFailureTime: {
        //   required: true,
        //   trigger: 'change',
        //   validator: (r, val, cb) => {
        //     const { billFailureTime } = this.submitData;
        //     if (!billFailureTime || !billFailureTime.length) {
        //       cb(
        //         new Error(this.$t('BUSINESS_MANAGEMENT.PLEASE_SELECT_FAILURE_TIME'))
        //       );
        //       return;
        //     }
        //     cb();
        //   }
        // }
      };
    },
    form1() {
      const { form1 } = this.$refs;
      return form1 || null;
    },
    form2() {
      const { form2 } = this.$refs;
      console.log('form2:',form2);
      return form2 || null;
    },
    bottomBtns() {
      if (this.readonly) {
        return [
          {
            name: this.$t('COMMON.BACK')
          }
        ];
      }
      switch (this.stepIndex) {
        case 1:
          return [
            {
              name: this.$t('COMMON.BACK')
            },
            {
              name: this.$t('COMMON.CONFIRM')
            }
          ];
        case 2:
          return [
            {
              name: this.$t('COMMON.BACK')
            },
            {
              name: this.$t('COMMON.SUBMIT')
            }
          ];
        default:
          return [];
      }
    }
  },

  mounted() {
    this.getOptionList();

    const { type } = this.routeQuery;
    if (['edit', 'detail'].includes(type)) {
      this.initEdit();
    }
  },

  methods: {
    ...mapMutations(['DELETE_TABS']),
    initEdit() {
      const { crtItem } = this.routeQuery,
        {
          // merchartCode = '',
          merchartName = '',
          merchartNameZht = '',
          merchartNameEn = '',
          commEpsMerchantBills = [],
          merchartTypeCode = '',
          merchartCode = '',
          riskClazz = ''
        } = crtItem;
      if (Object.keys(crtItem).length) {
        this.submitData.merchartTypeCode = merchartTypeCode;
        this.submitData.riskClazz = riskClazz;
        this.submitData.merchartCode = crtItem.merchartCode; // this.submitData.merchartCode = merchartCode;
        this.submitData.merchartName = merchartName;
        this.submitData.merchartNameZht = merchartNameZht;
        this.submitData.merchartNameEn = merchartNameEn;
        this.submitData.merchartCode = merchartCode;
        if (commEpsMerchantBills && commEpsMerchantBills.length) {
          this.submitData.commEpsMerchantBills = [];
          commEpsMerchantBills.forEach(item => {
            this.submitData.commEpsMerchantBills.push({
              billNumberInfo: item.billNumberInfo || '',
              billNumberInfoZht: item.billNumberInfoZht || '',
              billNumberInfoEn: item.billNumberInfoEn || '',
              billType: item.billType || '',
              billTypeInfo: item.billTypeInfo || '',
              billTypeInfoEn: item.billTypeInfoEn || '',
              billTypeInfoZht: item.billTypeInfoZht || '',
              billCode: item.billCode || '',
              billEffectiveTime: item.billEffectiveTime || '',
              billNumLimit: '10',
              billFailureTime: item.billFailureTime || '',
              maxmiumAmount:item.maxmiumAmount||'',
              minmiumAmount:item.minmiumAmount||'',
              // chargingType: item.chargingType || '',
              // cardStanded: item.cardStanded || '',
              merchartCode: this.submitData.merchartCode
            });
          });
        }
      }
    },
    async getOptionList(params = { current: 1, size: 100 }) {
      try {
        const result = await getEpsBusinessList(params);
        if (result.body && Object.keys(result.body).length) {
          this.setMerchainTypeList(result.body);
        }
      } catch (err) {
        this.$showMsg.error(err);
      }
    },
    setMerchainTypeList({ records }) {
      if (Array.isArray(records) && records.length) {
        this.merchainTypeList = records.map((item, index) => {
          return {
            value: item.merchartTypeCode || index + 1,
            label: item.merchartTypeNameZht || `name${index + 1}`,
            riskClazz: item.riskClazz
          };
        });
      }
    },
    handleDeleteItem(row, index) {
      this.submitData.commEpsMerchantBills.splice(index, 1);
    },
    handleAdd() {
      let listItem = {
        billNumberInfo: '',
        billNumberInfoZht:'',
        billNumberInfoEn:'',
        billType: '',
        billCode: '',
        merchartCode: this.submitData.merchartCode,
        billEffectiveTime: '',
        billNumLimit: '10',
        billFailureTime: '',
        // chargingType: '',
        // cardStanded: ''
      };
      this.submitData.commEpsMerchantBills.push(listItem);
    },
    handleOperations(tarText) {
      switch (tarText) {
        case this.$t('COMMON.BACK'):
          this.handleBack();
          break;
        case this.$t('COMMON.CONFIRM'):
          this.handleNextStep();
          break;
        case this.$t('COMMON.SUBMIT'):
          this.handleSubmit();
          break;
        default:
          break;
      }
    },
    handleBack() {
      if (this.stepIndex === 2) {
        this.stepIndex--;
        return;
      }
      this.$router.push('/businessMangament/merchantsMaintain');

      this.DELETE_TABS('/businessMangament/merchantMaintain/add');
      this.DELETE_TABS('/businessMangament/merchantMaintain/edit');
      this.DELETE_TABS('/businessMangament/merchantMaintain/detail');
    },
    handleNextStep() {
      const ctx = this;
console.log('2:',2);
      ctx['form1'].validate(valid1 => {
        ctx['form2'].validate(valid2 => {
          if (valid1 && valid2) {
            ctx.stepIndex++;
          } else {
            ctx.$showMsg({
              type: 'error',
              message: ctx.$t('COMMON.CHECK_FAIL')
            });
          }
        });
      });
    },
    handleSubmit() {
      const ctx = this;
      const targetTypeItem = ctx.merchainTypeList.find(
        item => item.value === ctx.submitData.merchartTypeCode
      );
      const submitData = {
        ...deepClone(ctx.submitData),
        merchantTypeName: targetTypeItem.label || '',
        riskClazz: RISK_LEVEL_LIST.find(
          item => item.value === targetTypeItem.riskClazz
        )
          ? RISK_LEVEL_LIST.find(
              item => item.value === targetTypeItem.riskClazz
            ).label
          : ''
      };
      const { crtItem } = ctx.routeQuery;
      const { title } = this.$route.meta,
        operation = this.$t(`MENU_PAGE_ITEMS.${transToHighCamel(title)}`);

      submitData.commEpsMerchantBills = ctx.submitData.commEpsMerchantBills.map(
        item => {
          return {
            ...item,
            billEffectiveTime: isType(item.billEffectiveTime, 'String')
              ? item.billEffectiveTime
              : formatDate(item.billEffectiveTime),
            billFailureTime: isType(item.billFailureTime, 'String')
              ? item.billFailureTime
              : formatDate(item.billFailureTime),
            ...(crtItem && crtItem.merchartCode
              ? { merchartCode: crtItem.merchartCode }
              : {})
          };
        }
      );
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM')}-${operation}?`,
        confirm: () => {
          this.stepIndex++;
          this.confirmSubmit({
            ...submitData,
            commEpsMerchantBills:
            submitData.commEpsMerchantBills.map(item => ({
              ...item,
              merchartCode: submitData.merchartCode
            }))
          }, operation);
        }
      });
    },
    async confirmSubmit(params = {}, op = this.$t('COMMON.UPDATE')) {
      try {
        const { crtItem } = this.routeQuery,
          isEdit =
            crtItem && Object.getOwnPropertyNames(crtItem).length
              ? true
              : false;
        const fn = isEdit ? editMMItem : addMMItem,
          result = await fn(params),
          { body } = result;
        if (body && body === true) {
          this.$showMsg({
            message: `"${op}"${this.$t('COMMON.SUBMIT_SUCCESS')}, ${this.$t(
              'COMMON.RETURN_AFTER_3_SECOND'
            )}`,
            type: 'success'
          });
        }
      } catch (err) {
        this.$showMsg({
          message: err,
          type: 'error'
        });
      }
      setTimeout(() => {
        this.handleBack();
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './styles/operate.scss';
</style>
