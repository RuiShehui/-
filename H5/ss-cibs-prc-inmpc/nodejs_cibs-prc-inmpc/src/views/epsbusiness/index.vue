<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-05-19 16:35:20
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\epsbusiness\index.vue
-->
<template>
  <div class="contain">
    <!-- <query-menu
      :btn-group="[
        {
          name: $t('COMMON.ADD'),
          plain: true,
          type: 'add'
        },
      ]"
      @handleSearch="handleSearch"
      @handleAdd="handleAdd"
    />-->
    <div class="g-menu">
      <el-button :plain="true" class="op-btn" @click="handleAdd">{{ $t('COMMON.ADD') }}</el-button>
    </div>
    <el-table
      class="g-table"
      :data="tableData"
      :stripe="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column
        v-for="col of tableColumns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :min-width="`${col.minWidth}px`"
      >
        <template v-slot="{ row }">
          <span v-if="col.prop === 'riskClazz'">
            {{
            riskLevelList.some(rl => rl.value === row[col.prop])
            ? riskLevelList.find(rl => rl.value === row[col.prop]).label :
            $t('BUSINESS_MANAGEMENT.WITHOUT_RISK_LEVEL')
            }}
          </span>
          <span
            v-else-if="col.prop === 'merchartTypeNameZht'"
            class="g-link-text"
            @click="handleToDetail(row)"
          >
          {{ row[col.prop] }}
          </span>
          <span v-else v-html="row[col.prop]"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')">
        <!-- width="240px" -->
        <template v-slot="{ row }">
          <div class="f-span-btns">
            <span @click="handleDelete(row)">{{$t('COMMON.DELETE')}}</span>
            <!-- <span @click="handleEdit(row)">{{$t('COMMON.UPDATE')}}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-empty slot="empty" :image="require('@/img/table-empty.png')" description="暂无收费项目设置,请新增"></el-empty>
    </el-table>
    <div class="g-footer">
      <el-pagination
        :background="true"
        :current-page.sync="requestParams.current"
        :page-size="requestParams.size"
        :total="requestParams.total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      ></el-pagination>
    </div>
    <article class="article">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('BUSINESS_MANAGEMENT.MERCHANT_MAINTAIN_TIP')}}
      </p>
    </article>
  </div>
</template>

<script>
import {
  getEpsBusinessList as requestListFn,
  delEpsBusiness
} from '@/api/business-management/eps-business';
import { deepClone, setNRandomNumber } from '@/utils/tools';
import constant from '@/utils/constant';
import pageMixin from '@/mixins/table-page';

const { RISK_LEVEL_LIST } = constant;

export default {
  name: 'EpsBusiness',
  components: {
  },
  mixins: [pageMixin],
  data() {
    const self = this;
    return {
      requestParams: {
        current: 1,
        size: 10,
        total: 0,
        merchartTypeName: '',
        riskClazz: ''
      },
      riskLevelList: RISK_LEVEL_LIST,
      tableColumns: [
        {
          label: self.$t('COMMON.SERIAL_NUMBER'),
          prop: 'number',
          minWidth: 80
        },
        {
          label: self.$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME'),
          prop: 'merchartTypeNameZht',
          minWidth: 120
        },
        // {
        //   label: self.$t('BUSINESS_MANAGEMENT.RISK_CLAZZ'),
        //   prop: 'riskClazz',
        //   minWidth: 120
        // }
      ],
      visible: false
    };
  },
  mounted() {
    this.getContentData();
  },
  methods: {
    requestListFn,
    handleAdd() {
      this.$router.push({
        name: 'epsbusinessAdd',
        query: {
          authStatus: '',
          createTime: '',
          creator: '',
          current: 0,
          size: 0, // this.requestParams.size
          deleteStatus: '',
          flowNum: '',
          legalPersonCode: '',
          maintainer: '',
          merchartTypeCode: String(setNRandomNumber(2)), // 必填, 相当于数据库校验码 (商户管理模块会用到)
          // merchartTypeName: `${new Date().getTime()}-name`, // 数据库交验名 (商户管理模块会用到)
          modifyTime: ''
        }
      });
    },
    handleEdit(crtItem) {
      const query = {
        ...crtItem,
        isEdit: true
      };
      this.$router.push({
        name: 'epsbusinessEdit',
        query
      });
    },
    handleToDetail(crtItem) {
      const query = {
        ...crtItem
      };
      this.$router.push({
        name: 'epsbusinessDetail',
        query
      });
    },
    handleDelete(crtItem) {
      this.$showBox({
        content: `${this.$t('COMMON.DELETE')} "${this.$t(
          'MENU_PAGE_ITEMS.EPS_MAINTAIN'
        )}" ?`,
        confirm: () => {
          this.confirmDelete(deepClone(crtItem));
        },
        cancel: () => {}
      });
    },
    async confirmDelete(crtItem) {
      const result = await delEpsBusiness(crtItem);
      this.checkResult(result, this.$t('COMMON.DELETE'));
      this.getContentData(this.requestParams);
    }
  }
};
</script>

<style lang='scss' scoped>
@import './styles/index.scss';
</style>
