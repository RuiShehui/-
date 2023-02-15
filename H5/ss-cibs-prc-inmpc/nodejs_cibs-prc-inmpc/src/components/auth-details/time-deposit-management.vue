<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 16:44:23
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-21 15:44:22
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\authorization-details\time-deposit-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div class="g-userManagementDetail">
    <section>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t(`CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_LABEL`)"
          width="180"
        >{{ $t(`CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_LABEL`) }}</el-table-column>
        <el-table-column prop="ebankCstmNo"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('CUSTOMER_MANAGEMENT.ENT_NAME')"
          width="180"
        >{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</el-table-column>
        <el-table-column prop="entName"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.STATUS')
          }}
        </el-table-column>
        <el-table-column prop="status"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="cardList" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')"
          width="180"
        >{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') }}</el-table-column>
        <el-table-column prop="cardType"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.CARD_NO')
          }}
        </el-table-column>
        <el-table-column prop="cardNo"></el-table-column>
      </el-table>

      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <!-- <el-table-column
          :label="$t('CUSTOMER_MANAGEMENT.SUSTOMeR_ID')"
          width="180"
          >{{ $t('CUSTOMER_MANAGEMENT.CUSTOMER_ID') }}</el-table-column
        >
        <el-table-column prop="customerID"></el-table-column>-->
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.AMOUNT')
          }}
        </el-table-column>
        <el-table-column prop="amount"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.RATE')
          }}
        </el-table-column>
        <el-table-column prop="rate"></el-table-column>
      </el-table>
      <!-- <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('CUSTOMER_MANAGEMENT.FIXED_DEPOST_PERIOD')"
          width="180"
          >{{ $t('CUSTOMER_MANAGEMENT.FIXED_DEPOST_PERIOD') }}</el-table-column
        >
        <el-table-column prop="fixedFlag"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.RATE')
          }}
        </el-table-column>
        <el-table-column prop="rate"></el-table-column>
      </el-table>-->
      <el-table
        v-if="!dateFlag"
        :show-header="false"
        :data="tableData"
        border
        :cell-style="columnStyle"
      >
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.RECEIVING_RESERVATION_NUMBER_EMAIL')
          }}
        </el-table-column>
        <el-table-column prop="email"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.FIXED_DATE')
          }}
        </el-table-column>
        <el-table-column prop="fixedDate"></el-table-column>
      </el-table>

      <el-table
        v-if="dateFlag"
        :show-header="false"
        :data="tableData"
        :border="true"
        :cell-style="columnStyle"
      >
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.RECEIVING_RESERVATION_NUMBER_EMAIL')
          }}
        </el-table-column>
        <el-table-column prop="email"></el-table-column>
        <el-table-column width="180">
          {{
          $t('CUSTOMER_MANAGEMENT.TIMESPAN')
          }}
        </el-table-column>
        <el-table-column prop="customDate">
          <template v-slot="{ row }">
            {{ row }}
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
import { setThousand, renderDeposTypeDate, moneyFormat } from '@/utils/tools';


export default {
  name: 'TimeDepositManagement',
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [
        //列表数组
        {
          ebankCstmNo: '网银客户号1', //网银客户号
          entName: '客户名称1', //客户名称
          status: '状态1', //状态
          cardType: '证件类型1', //证件类型
          cardNo: '证件号码1', //证件号码
          customerID: 'customer ID', //交易名称
          amount: '存款额1', //存款额
          fixedFlag: '固定存期1', // 固定存期
          rate: '利率1', //利率
          email: '接收预约编号邮箱1', //接收预约编号邮箱1
          customDate: '' //自定义到期日期
        }
      ],
      cardList: [
        {
          cardType: '', //证件类型
          cardNo: '' //证件号码
        }
      ]
    };
  },
  computed: {
    dateFlag() {
      return this.tableData[0].startDate && this.tableData[0].endDate
        ? true
        : false;
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    renderDeposTypeDate,
    init() {
      try {
        const { temp } = this.options,
          { afterMdJson } = temp || '{}',
          { body } = JSON.parse(afterMdJson);
        if (body) {
          this.tableData[0] = body;
          this.cardList = this.tableData[0].cardList;
          this.tableData[0].status = CONSTANTS.ENABLE[this.tableData[0].status];
          this.tableData[0].fixedDate = renderDeposTypeDate(this.tableData[0]);
          CONSTANTS.CONTACT_TYPE_LIST.forEach(item => {
            if (body && item.value === body.contactType) {
              const amount = `${item.label}：${moneyFormat(setThousand(body.amount || '0'))}`;
              // tool.delDecollator(row.limitDaily)
              this.$set(this.tableData[0], 'amount',amount);
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-userManagementDetail {
  // padding: 20px 1%;
  background: #ffffff;
  height: 100%;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
/deep/ .el-table td.el-table__cell div {
  width: 100%;
}
</style>
