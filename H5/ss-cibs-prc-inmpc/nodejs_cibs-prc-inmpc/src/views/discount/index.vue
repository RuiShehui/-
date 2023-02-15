<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 16:26:49
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-06-08 11:25:55
 * @Description: 银行收费折扣管理--银行收费折扣列表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\discount\index.vue
-->
<template>
  <div class="contain">
    <query-menu
      v-if="!loading"
      :properties="{
        discountWay: $t('BUSINESS_MANAGEMENT.DISCOUNT_WAY'),
        channel: $t('BUSINESS_MANAGEMENT.CHANNEL')
      }"
      :default-value="requestParams"
      @handleSearch="handleSearch"
      @handleAdd="handleAdd"
      @handleReset="handleReset"
    />
    <!-- 
      {
        discountWay: requestParams.discountWay, // requestParams.discountWay 0
        channel: requestParams.channel, // requestParams.channel '0'
      }
    -->
    <el-table
      class="g-main-content"
      :data="tableData"
      :stripe="true"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column
        type="index"
        :label="$t('COMMON.SERIAL_NUMBER')"
        width="60"
      />
      <el-table-column
        prop="discountWay"
        :label="$t('BUSINESS_MANAGEMENT.DISCOUNT_WAY')"
        width="120px"
      >
        <template v-slot="{ row }">
          <span class="g-detail-link" @click="handleCheck(row)">{{
            discountWayList.find(item => item.value === row.discountWay)
              ? discountWayList.find(item => item.value === row.discountWay)
                  .label
              : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="channel"
        :label="$t('BUSINESS_MANAGEMENT.CHANNEL')"
        width="100px"
      >
        <template v-slot="{ row }">
          <span>{{
            discountChannelList.find(item => item.value === row.channel)
              ? discountChannelList.find(item => item.value === row.channel)
                  .label
              : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="discountStandard"
        :label="$t('BUSINESS_MANAGEMENT.DISCOUNT_STANDARD')"
        width="120px"
        min-width="120px"
      >
        <template v-slot="{ row }">
          <template v-if="row.discountMethod !== '1'">
            <p>{{ `${row.discountStandard}%` }}</p>
          </template>
          <template v-else>
            <p
              v-for="(moneyInfo) of JSON.parse(row.discountMoney || '[]')"
              :key="moneyInfo.discountCcy"
            >
              {{ `${moneyInfo.discountCcy} ${moneyInfo.discountMoney}` }}
            </p>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="discountObjectType"
        :label="$t(`BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE`)"
        width="120px"
      >
        <!-- discountMethodList row.discountObjectType -->
        <template v-slot="{ row }">
          <span v-if="row.discountObjectType === '0'">{{
            $t('BUSINESS_MANAGEMENT.ORGANIZATION')
          }}</span>
          <span v-if="row.discountObjectType === '1'">{{
            $t('BUSINESS_MANAGEMENT.WHITE_LIST')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="$t(`BUSINESS_MANAGEMENT.SUBMIT_TIME`)"
        min-width="160"
      >
        <template v-slot="{ row }">{{
          row.createTime | fomtmatTtime
        }}</template>
      </el-table-column>
      <el-table-column
        prop="effectiveTime"
        :label="$t('BUSINESS_MANAGEMENT.EFFECTIVE_TIME')"
        min-width="160"
      >
        <template v-slot="{ row }">{{
          row.effectiveTime && row.effectiveTime.length
            ? `${row.effectiveTime} ${$t('COMMON.DATESPAN_TO')} ${
                row.failureTime
              }`
            : $t('BUSINESS_MANAGEMENT.FOREVER_EFFECTED')
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="120">
        <template v-slot="{ row }">
          <div class="f-span-btns">
            <span class="del" @click="handleDelete(row)">{{
              $t('COMMON.DELETE')
            }}</span>
            <span @click="handleEdit(row)">{{ $t('COMMON.UPDATE') }}</span>
          </div>
        </template>
      </el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('BUSINESS_MANAGEMENT.DISCOUNT_IS_EMPTY') }}</footer>
      </div>
    </el-table>
    <div class="g-bolck">
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
  </div>
</template>

<script>
import QueryMenu from '@/components/query-menu';

import pageMixin from '@/mixins/table-page';
import {
  getDiscountList as requestListFn,
  deleteDiscount,
  getDiscountDetail
} from '@/api/business-management';
import businessFilter from '@/filters/business';
import constant from '@/utils/constant';
import _ from 'lodash';
import { useStorage } from '@/hooks';
import { DISCOUNT_REQUEST_PARAMS } from '@/configs/keys';

const { discountWayList, discountChannelList, discountMethodList } = constant;
const [getStorage, setStorage, initStorage] = useStorage(
  DISCOUNT_REQUEST_PARAMS,
  {
    page: 1,
    size: 10,
    total: 10,
    discountWay: '',
    channel: '0'
  }
);

export default {
  name: 'DiscountIndexPage',
  components: {
    QueryMenu
  },
  mixins: [pageMixin],
  filters: {
    ...businessFilter
  },
  data() {
    return {
      requestParams: {
        page: 1,
        size: 10,
        discountWay: '',
        channel: '0'
      },
      discountWayList,
      discountChannelList,
      discountMethodList
    };
  },
  watch: {
    requestParams(newVal) {
      setStorage(newVal);
    }
  },
  mounted() {
    this.requestParams = getStorage();
    // this.getContentData({ current: 1, size: 5 });
    this.getContentData(this.requestParams);
  },
  methods: {
    requestListFn,
    handleSearch(params) {
      this.requestParams = {
        ...params,
        discountWay: params.discountWay || '',
        channel: params.channel || '0',
        size: this.requestParams.size
      };
      const requestParams = _.cloneDeep(this.requestParams);
      delete requestParams.total;
      // console.log(requestParams);
      this.getContentData(this.requestParams);
    },
    // handle-add
    async handleAdd() {
      await this.$router.push({
        name: 'discountAdd',
        query: {},
        params: {}
      });

      this.$store.commit('tabs/DELETE_TABS', '/businessMangament/discount');
    },
    // 删除
    async handleDelete(row) {
      const result = await getDiscountDetail(row);
      if (
        result.hasOwnProperty('body') &&
        Object.getOwnPropertyNames(result.body)
      ) {
        this.$showBox({
          content: `${this.$t('COMMON.CONFIRM_DELETE')}`,
          confirm: () =>
            this.confirmDelete({
              ...row,
              ...result.body
            })
        });
      }
    },
    async confirmDelete(crtItem) {
      const result = await deleteDiscount(crtItem);
      if (result.hasOwnProperty('body') && result.body === true) {
        this.$showMsg({
          type: 'success',
          message: this.$t('COMMON.DELETE_SUCCESS')
        });
      } else {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.DELELTE_FAIL')
        });
      }
      this.getContentData(this.requestParams);
    },
    // 编辑
    async handleEdit(row) {
      this.loading = true;
      const result = await getDiscountDetail(row);
      const { discountObjects } = result.body;
      if (discountObjects) {
        await this.$router.push({
          name: 'discountEdit',
          query: {
            crtItem: {
              ...row,
              discountObjects: discountObjects.length
                ? discountObjects
                : [{ discountObjectCode: '', objectName: '' }]
            }
          }
          // params: {}
        });

        this.$store.commit('tabs/DELETE_TABS', '/businessMangament/discount');
      } else
        this.$showMsg({
          message: this.$t('COMMON.CAN_NOT_EDIT'),
          type: 'warning'
        });
      this.loading = false;
    },
    async handleCheck(row) {
      console.log('handleCheck',row)
      this.loading = true;
      try {
        const result = await getDiscountDetail(row);
        const { discountObjects } = result.body;
        await this.$router.push({
          name: 'discountDetail',
          query: {
            crtItem: {
              ...row,
              discountObjects: discountObjects.length
                ? discountObjects
                : [{ discountObjectCode: '', objectName: '' }]
            }
          },
          params: {}
        });
        this.$store.commit('tabs/DELETE_TABS', '/businessMangament/discount');
      } catch (err) {
        this.$showMsg({
          type: 'error',
          message: 'error'
        });
      }
      this.loading = false;
    },
    /** reset */
    handleReset() {
      initStorage();
      this.$set(this, 'requestParams', getStorage());
      this.getContentData(this.requestParams);
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
  .g-main-content {
    margin-top: 20px;
    .g-detail-link {
      color: #4181fa;
      cursor: pointer;
    }
  }
  .f-span-btns {
    width: 100%;
    color: #f06b00;
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      cursor: pointer;
    }
    span:nth-of-type(2) {
      margin-left: 10px;
    }
    .del {
      color: #e34141;
    }
  }
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
</style>
