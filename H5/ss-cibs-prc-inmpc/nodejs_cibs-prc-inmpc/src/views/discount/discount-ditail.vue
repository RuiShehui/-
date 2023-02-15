<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 16:57:19
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-11 11:41:15
 * @Description: 银行折扣管理--银行折扣详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\discount\discount-ditail.vue
-->
<template>
  <div class="contain">
    <section>
      <el-descriptions :column="2" size="default" :border="true">
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.DISCOUNT_WAY') }}</label>
          <span>{{ tableData[0].discountWay | discountWayName }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.CHANNEL') }}</label>
          <span>{{ tableData[0].channel | channelText }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.SUBMITOR') }}</label>
          <span>{{ tableData[0].creator }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.CREATE_TIME') }}</label>
          <span>{{ tableData[0].createTime }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.DISCOUNT_STANDARD') }}</label>
          <span>
            {{ renderDiscountStandard(tableData[0]) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.EFFECTIVE_TIME') }}</label>
          <span>{{ renderTimespan(tableData[0]) }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label class="column-label" slot="label">{{ $t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE') }}</label>
          <span>{{ tableData[0].discountObjectType | discountObjectTypeText }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <label
            class="column-label"
            slot="label"
          >{{ tableData[0].discountObjectType === '1' ? $t('COMMON.FILE') :$t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECTS') }}</label>
          <div :style="{ maxWidth: '500px', overflowX: 'auto' }">
            <span
            class="g-detail-link"
              v-if="tableData[0].discountObjectType === '1'"
              @click="downloadObjListFun"
            >{{ tableData[0].feilUrl || 'upload.excel' }}</span>
            <template v-else>
              <span
                v-for="(item, index) of tableData[0].discountObjects"
                :key="index + item"
              >{{ `${item.objectName || item.discountObjectCode}${index === tableData[0].discountObjects.length - 1 ? '' : ','}` }}</span>
            </template>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">{{ $t('BUSINESS_MANAGEMENT.DISCOUNT_DESC') }}</template>
          <span>{{ tableData[0].discountDesc }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </section>
    <footer class="g-bottom">
      <el-button class="g-back-btn" type="primary" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
    </footer>
  </div>
</template>

<script>
import businessFilter from '@/filters/business';
import {
  downloadObjList
} from '@/api/business-management/discount';
import { export_excel_file } from './execl_file';
export default {
  components: {},
  filters: {
    ...businessFilter,
    discountWayName(discountWay = '-1') {
      const way = parseInt(discountWay);
      // console.log(this);
      switch (way) {
        case 0:
          return '基金';
        case 1:
          return '汇款(TT)';
        case 2:
          return '汇款(CHATS)';
        case 3:
          return '批量转账';
        case 4:
          return '自动收款';
        default:
          return '暂无类型';
      }
    },
    channelText(channel = '-1') {
      switch (parseInt(channel)) {
        case 0:
          return '个人网银';
        case 1:
          return '银企直连';
        default:
          return '暂无渠道';
      }
    },
    discountObjectTypeText(discountObjectTypeType) {
      switch (parseInt(discountObjectTypeType)) {
        case 0:
          return '机构';
        case 1:
          return '白名单';
        default:
          return '暂无折扣对象';
      }
    }
  },
  data() {
    return {
      discountCode:''
    };
  },
  computed: {
    tableData() {
      const { crtItem = {} } = this.$route.query;
      return [crtItem];
    }
  },
  mounted() {
    this.discountCode = this.$route.query.crtItem.discountCode
  },
  methods: {
    ...businessFilter,
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    backTo() {
      this.$router.push('/businessMangament/discount');
    },
    renderTimespan({ effectiveTime = '', failureTime = '' }) {
      if (failureTime.includes('2999')) {
        return this.$t('BUSINESS_MANAGEMENT.FOREVER_EFFECTED');
      }
      if (effectiveTime.length) {
        return `${effectiveTime} ${this.$t(
          'COMMON.DATESPAN_TO'
        )} ${failureTime}`;
      }
      return '';
    },
    renderDiscountStandard({
      discountMethod = '0',
      discountMoney = '0',
      discountStandard = '0'
    }) {
      if (discountMethod === '1') {
        let arr = JSON.parse(this.tableData[0].discountMoney)
        let discountCcyO = arr[0].discountCcy
        let discountMoneyO = arr[0].discountMoney
        let discountCcyT = arr[1].discountCcy
        let discountMoneT = arr[1].discountMoney
        let demo = discountCcyO + ":"+discountMoneyO+";" +discountCcyT + ":"+discountMoneT
        return demo;
      }
      return `${discountStandard}%`;
    },

    downloadObjListFun() {
      console.log('this.tableData',this.tableData)
      let param = {discountCode:this.discountCode}
      downloadObjList(param).then(res => {
        export_excel_file(res, this.tableData[0].feilUrl);
      });
    },

  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  .g-bottom {
    width: 100%;
    text-align: center;
    .g-back-btn {
      margin-top: 40px;
      width: 210px;
    }
  }
  .g-detail-link {
    color: #4181fa;
    cursor: pointer;
  }
}
</style>