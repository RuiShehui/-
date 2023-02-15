<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-06-10 17:47:39
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\merchantsMaintain\index.vue
-->
<template>
  <div class="g-merchantsMaintain">
    <query-menu
      ref="queryMenu"
      :properties="{
        merchartTypeCode: $t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE')
      }"
      :default-value="requestParams"
      :merchartTypeCodeList="optionsList"
      @handleSearch="handleSearch"
      @handleAdd="handleAdd"
    />
    <!-- 
      {
        name: '重置',
        type: 'default'
      },
    -->
    <el-table
      class="g-table"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      current-row-key="id"
      row-key="id"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column v-for="col of tableColumns" :key="col.prop" v-bind="col">
        <template v-slot="{ row }">
          <!-- <span v-if="col.prop === 'merchartCode'">
            {{
            row[col.prop] | merchartCodeLabel
            }}
          </span> -->
          <span
            v-if="col.prop === 'merchartNameZht'"
            class="g-link-text"
            @click="openDetailPage(row)"
          >{{ row[col.prop] }}</span>
          <span
            v-else-if="col.prop === 'chargingType'"
          >{{ chargingTypeList.find(item => item.value === row[col.prop]) ? chargingTypeList.find(item => item.value === row[col.prop]).label : '' }}</span>
          <span
            v-else-if="col.prop === 'cardStanded'"
          >{{ cardStandedList.find(item => item.value === row[col.prop]) ? cardStandedList.find(item => item.value === row[col.prop]).label : '' }}</span>
          <span v-else v-html="row[col.prop]" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="120px">
        <template v-slot="{ row }">
          <span
            v-show="
              row.children || (!row.children && row.id.toString().length < 2)
            "
            type="text"
            class="g-op-btn delete"
            @click="handleBtnClick(row, 'delete')"
          >{{ $t('COMMON.DELETE') }}</span>
          <span
            v-show="
              row.children || (!row.children && row.id.toString().length < 2)
            "
            type="text"
            class="g-op-btn modify"
            @click="handleBtnClick(row, 'edit')"
          >{{ $t('COMMON.UPDATE') }}</span>
        </template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-pagination-area">
      <el-pagination
        :background="true"
        :current-page.sync="requestParams.current"
        :page-size="requestParams.size"
        :total="requestParams.total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      />
    </div>
    <article class="article">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TIP')}}
      </p>
    </article>
  </div>
</template>

<script>
import QueryMenu from '@/components/query-menu';

import { getEpsBusinessList } from '@/api/business-management/eps-business';
import {
  getMMList as requestListFn,
  delMMItem,
  getMMDetail
} from '@/api/business-management/merchants-maintain';
import { deepClone, formatYMD } from '@/utils/tools';

import filters from '@/filters/business';

import pageMixin from '@/mixins/table-page';
import listMixin from './mixin-list';

export default {
  name: 'MerchantsMaintainIndexPage',
  components: {
    QueryMenu
  },
  mixins: [pageMixin, listMixin],
  filters,
  data() {
    return {
      requestParams: {
        current: 1,
        size: 10,
        // id: 2,
        total: 0,
        merchantClass: ''
      },
      optionsList: [],
      tableColumns: [
        {
          label: this.$t('COMMON.SERIAL_NUMBER'),
          prop: 'id',
          minWidth: 80
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.MERCHANT_NAME'),
          prop: 'merchartNameZht',
          minWidth: 90
        },
        {
          prop: 'outwardMerchartCode',
          label: this.$t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE'),
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_NO_DETIAL'),
          prop: 'billNumberInfoZht',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_TYPE_LABEL'),
          prop: 'billType',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL'),
          prop: 'billTypeInfoZht',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.MINMIUM_AMOUNT'),
          prop: 'minmiumAmount',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.MAXMIUM_AMOUNT'),
          prop: 'maxmiumAmount',
          minWidth: 90
        },
        // {
        //   label: this.$t('BUSINESS_MANAGEMENT.CHARGING_TYPE'),
        //   prop: 'chargingType',
        //   minWidth: 90
        // },
        // {
        //   label: this.$t('BUSINESS_MANAGEMENT.CARD_STANDED'),
        //   prop: 'cardStanded',
        //   minWidth: 90
        // }
      ]
    };
  },
  computed: {},
  watch: {
    optionsList() {
      this.tableColumns = [
        {
          label: this.$t('COMMON.SERIAL_NUMBER'),
          prop: 'id',
          minWidth: 100
        },

        {
          label: this.$t('BUSINESS_MANAGEMENT.MERCHANT_NAME'),
          prop: 'merchartNameZht',
          minWidth: 90
        },
        {
          prop: 'merchartCode',
          label: this.$t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE'),
          minWidth: 90
        },
                {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_NO_DETIAL'),
          prop: 'billNumberInfoZht',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_TYPE_LABEL'),
          prop: 'billType',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL'),
          prop: 'billTypeInfoZht',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_EFFECTIVE_TIME'),
          prop: 'billEffectiveTime',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.BILL_FAILURE_TIME'),
          prop: 'billFailureTime',
          minWidth: 90
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.MINMIUM_AMOUNT'),
          prop: 'minmiumAmount',
          minWidth: 80
        },
        {
          label: this.$t('BUSINESS_MANAGEMENT.MAXMIUM_AMOUNT'),
          prop: 'maxmiumAmount',
          minWidth: 80
        },
        // {
        //   label: this.$t('BUSINESS_MANAGEMENT.CHARGING_TYPE'),
        //   prop: 'chargingType',
        //   minWidth: 90
        // },
        // {
        //   label: this.$t('BUSINESS_MANAGEMENT.CARD_STANDED'),
        //   prop: 'cardStanded',
        //   minWidth: 120
        // }
      ];
    }
  },
  async mounted() {
    await this.getOptionList();
    await this.initContentData();
  },
  methods: {
    requestListFn,
    initContentData() {
      this.$refs.queryMenu.initMerchartTypeCode();
      this.getContentData(this.requestParams);
    },
    async getOptionList(params = { current: 1, size: 90 }) {
      try {
        const result = await getEpsBusinessList(params);
        if (result.body && Object.keys(result.body).length) {
          this._setOptionsList(result.body);
        }
      } catch (err) {
        this.$showMsg.error(err);
      }
    },
    _setOptionsList({ records }) {
      if (Array.isArray(records) && records.length) {
        this.optionsList = records.map((item, index) => {
          return {
            value: item.merchartTypeCode || index + 1,
            label: item.merchartTypeNameZht || `name${index + 1}`
          };
        });
      }
      // init request params
      // const merchartTypeCode = this.optionsList.length ? this.optionsList[0].value : '';
      this.$set(
        this.requestParams,
        'merchartTypeCode',
        this.optionsList[0].value
      );
    },
    handleSearch(params = {}) {
      const _requestParams = deepClone(this.requestParams);
      for (let k in params) {
        const v = params[k] || _requestParams[k];
        this.$set(this.requestParams, k, v);
      }
      this.getContentData(this.requestParams);
    },
    handleBtnClick(row, type) {
      switch (type) {
        case 'edit':
          this.handleEdit(row);
          break;
        case 'delete':
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    handleAdd() {
      this.$router.push({
        name: 'MerchantsMaintainAdd',
        query: {
          type: 'add'
        }
      });
    },
    async handleEdit(row) {
      const item = await this.getCrtItem(row),
        crtItem = {
          ...item,
          commEpsMerchantBills: item.commEpsMerchantBills.map(item1 => {
            return {
              ...item1,
              billEffectiveTime: formatYMD(item1.billEffectiveTime),
              billFailureTime: formatYMD(item1.billFailureTime),
            }
          })
        };

      console.log(crtItem);

      this.$router.push({
        name: 'MerchantsMaintainEdit',
        query: {
          type: 'edit',
          crtItem
        }
      });
    },
    async openDetailPage(row) {
      const item = await this.getCrtItem(row),
        crtItem = {
          ...item,
          commEpsMerchantBills: item.commEpsMerchantBills.map(item1 => {
            return {
              ...item1,
              billEffectiveTime: formatYMD(item1.billEffectiveTime),
              billFailureTime: formatYMD(item1.billFailureTime),
            }
          })
        };

      this.$router.push({
        name: 'MerchantsMaintainDetail',
        query: {
          type: 'edit',
          crtItem
        }
      });
    },
    async handleDelete(row) {
      const crtItem = await this.getCrtItem(row);
      this.$showBox({
        content: '确认要删除该条商户信息吗?',
        confirm: () => this.confirmDelete(crtItem)
      });
    },
    async getCrtItem(listItem) {
      const { body } = await getMMDetail(listItem);
      if (body) {
        const crtItem = {
          ...listItem,
          ...body
        };
        // crtItem.commEpsMerchantBills = [];
        // crtItem.commEpsMerchantBills.push(...(crtItem.children || []));
        delete crtItem.children;
        return crtItem;
      }
    },
    async confirmDelete(crtItem) {
      const result = await delMMItem({
        ...crtItem
      });
      this.checkResult(result, '删除', [this.requestParams]);
      this.getContentData(this.requestParams);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './styles/index.scss';
</style>
