<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-09-29 15:14:50
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\despostiReservation\confirm.vue
-->
<template>
  <div class="contain">
    <div class="g-detail" v-loading="loading">
      <div class="transverse-table">
        <div class="row">
          <div>{{$t("CUSTOMER_MANAGEMENT.ENT_NAME")}}</div>
          <div>{{submitData.entName}}</div>
          <div>{{$t("CUSTOMER_MANAGEMENT.AMOUNT")}}</div>
          <div>
            <span>{{ `${contactTypeList.find(item => item.value === submitData.contactType) ? contactTypeList.find(item => item.value === submitData.contactType).label : ''} : ${setThousand(submitData.amount)}` }}</span>
          </div>
        </div>
        <div class="row">
          <div v-if="submitData.fixedDateType">{{$t("CUSTOMER_MANAGEMENT.FIXED_DATE_TYPE")}}</div>
          <div v-if="submitData.startDate">{{$t("CUSTOMER_MANAGEMENT.TIMESPAN")}}</div>
          <div v-if="submitData.fixedDateType">{{ renderDeposTypeDate(submitData) }}</div>
          <div v-if="submitData.startDate">{{ submitData.startDate }}</div>
          <div>{{$t("CUSTOMER_MANAGEMENT.RATE")}}</div>
          <div>{{submitData.rate+"%"}}</div>
        </div>
        <div class="row">
          <div>{{$t("CUSTOMER_MANAGEMENT.EMAIL")}}</div>
          <div v-if="submitData.hasOwnProperty('email') && submitData.email.length">
            <p
              v-for="(item, index) of submitData.email.split(',')"
              :key="`${index + 1} ${item}`"
            >{{ `${item}${index === submitData.email.split(',').length - 1 ? '' : ', '}` }}</p>
          </div>
        </div>
      </div>
      <div class="g-bottom">
        <el-button class="f-cancel" @click="handleBackTo">{{ $t('COMMON.PREVIOUS_STEP') }}</el-button>
        <el-button @click="handleConfirm" type="primary">{{ $t('COMMON.CONFIRM') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone, setThousand, renderDeposTypeDate } from '@/utils/tools';
import constant from '@/utils/constant';
import { saveNumber } from '@/api/customer-management/desposit-reservation';

const { CONTACT_TYPE_LIST, SELECT_DATE_LIST } = constant;

export default {
  name: 'DRConfirmPage',
  components: {},
  provide: {
    CONTACT_TYPE_LIST,
    SELECT_DATE_LIST
  },
  props: {
    submitData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // is-loading
      loading: false,
      contactTypeList: CONTACT_TYPE_LIST,
      selectDateList: SELECT_DATE_LIST
    };
  },
  mounted() {
    console.log(this.submitData);
  },
  methods: {
    setThousand,
    renderDeposTypeDate,
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    // 返回
    handleBackTo() {
      
      // this.$router.push('/customerManagement/despostiReservation');
      this.$emit('handleBackTo', 1);
    },
    handleConfirm() {
      this.submitData.endDate = this.submitData.startDate;
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.CONFIRM_ADD_DEPOSI_NUM'),
        confirm: () => this.confirmSubmit(this.submitData)
      });
    },
    async confirmSubmit(submitData) {
      this.loading = true;
      try {
        const result = await saveNumber(submitData);
        if (result.hasOwnProperty('body') && result.body) {
          this.$showMsg({
            message: '生成编号成功',
            type: 'success'
          });
        } else {
          this.$showMsg({
            message: '生成编号失败',
            type: 'error'
          });
        }
      } catch (err) {
        this.$showMsg({
          message: `error: ${err}`,
          type: 'error'
        });
      }
      this.loading = false;

      this.$emit('handleBackTo', 0);
    }
  }
};
</script>

<style lang='scss' scoped>
@import './styles/index.scss';
</style>