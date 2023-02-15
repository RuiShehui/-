<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-05 10:12:58
 * @LastEditTime: 2022-04-15 10:17:00
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\despostiReservation\display-list.vue
-->
<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.AMOUNT')" prop="amount" min-width="160px">
        <template v-slot="{ row }">
          <span class="show-amount">
            {{
            `${CONTACT_TYPE_LIST.find(item => item.value ===row.contactType) ? CONTACT_TYPE_LIST.find(item => item.value ===row.contactType).label : ''}: ${moneyFormat(row.amount)}`
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('CUSTOMER_MANAGEMENT.FIXED_DATE')"
        prop="fixedDate"
        min-width="120px"
      >
        <template v-slot="{ row }">
          {{
          renderDeposTypeDate(row)
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.RATE')" prop="rate" min-width="120px">
        <template v-slot="{ row }">{{ `${row.rate || '0'}%` }}</template>
      </el-table-column>
      <el-table-column
        :label="$t('CUSTOMER_MANAGEMENT.RECEIVING_RESERVATION_NUMBER_EMAIL')"
        prop="email"
        min-width="200px"
      />
      <el-table-column
        :label="$t('CUSTOMER_MANAGEMENT.DESPOSTI_NUM')"
        prop="reservationNo"
        min-width="180px"
      />
      <el-table-column
        label="歷史預約編號"
        prop="reservationCode"
        min-width="180px"
      />
      <el-table-column :label="$t('HOME.EFFECT_TIME')" prop="modifyTime" min-width="180px" />
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page.sync="requestParams.current"
        :page-size.sync="requestParams.size"
        :page-sizes="[10, 15, 20, 25, 30, 50]"
        :total="requestParams.total"
        layout="total,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      />
      <!-- sizes,total,prev,pager,next,jumper -->
    </div>
  </div>
</template>

<script>
import { getNumberList as requestListFn } from '@/api/customer-management/desposit-reservation';
import pageMixin from '@/mixins/table-page';
import constant from '@/utils/constant';
import { setThousand, renderDeposTypeDate, moneyFormat } from '@/utils/tools';
const { CONTACT_TYPE_LIST, SELECT_DATE_LIST } = constant;

export default {
  name: 'DisplayList',
  mixins: [pageMixin],
  data() {
    return {
      tableData: [],
      requestParams: {
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo') || '',
        size: 15,
        current: 1,
        total: 0
      },
      CONTACT_TYPE_LIST,
      SELECT_DATE_LIST
    };
  },
  async mounted() {
    await this.getContentData(this.requestParams);
  },
  methods: {
    requestListFn,
    setThousand,
    moneyFormat,
    renderDeposTypeDate
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;

  .g-bolck {
    text-align: right;
    margin-top: 32px;
    padding: 0 20px;
  }
}
</style>
