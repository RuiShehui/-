<!--
 * @Author: zhangcheng
 * @Date: 2022-06-01 16:26:43
 * @LastEditTime: 2022-08-24 10:39:01
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\custQuotaManage\components\CustQuotaManageConfirm.vue
-->
<template>
  <div>
    <el-table
      class="mg-8"
      :data="showData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')" prop="custNo"></el-table-column>
      <el-table-column :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')" prop="custName"></el-table-column>
      <el-table-column v-if="operate==='add'" :label="$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.customerClazz) }}</template>
      </el-table-column>
      <el-table-column v-if="operate==='edit'" :label="$t('BUSINESS_MANAGEMENT.ORG_CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.customerClazz) }}</template>
      </el-table-column>
      <el-table-column v-if="operate==='edit'" :label="$t('BUSINESS_MANAGEMENT.UPDATA_CUS_CLAZZ')">
        <template v-slot="{row}">{{ customerClazzFilter(row.updateCustomerClazz) }}</template>
      </el-table-column>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total,sizes,prev,pager,next,jumper"
        :current-page="current"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backOperate">{{ $t('COMMON.PREVIOUS_STEP') }}</el-button>
      <el-button type="primary" @click="submitData">{{ $t('COMMON.CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustQuotaManageConfirm',
  props: {
    confirmData: {
      type: Array,
      default() {
        return [];
      }
    },
    operate: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0
    };
  },
  created() {
    this.total = this.confirmData.length;
    this.getShowData();
  },
  methods: {
    submitData() {
      this.$emit('submitData', this.confirmData);
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getShowData();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getShowData();
    },
    getShowData() {
      console.log(this.current, this.size);
      // if (this.total <= this.size * this.current) {
      this.showData = this.confirmData.slice(
        (this.current - 1) * this.size,
        this.current * this.size
      );
      // } else {
      //   this.showData = this.confirmData.slice(
      //     (this.current - 1) * this.size,
      //     this.size
      //   );
      // }
    },
    backOperate() {
      this.$emit('backOperate');
    },
    customerClazzFilter(val) {
      const number = Number(val);
      if (number === 0 || (number && number < 26)) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        );
      } else {
        return val;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../style/style.scss';
</style>
