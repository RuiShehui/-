<!-- 開戶申請記錄查詢 -->
<template>
  <div>
    <search @clickDetail="handleCell" :exportBoolean="true" :checkType="'2'"></search>
  </div>
</template>

<script>
import search from '../components/search'

export default {
  name: 'AccountOpeningReportQuery',
  components: {
    search
  },

  data() {
    return {
    };
  },

  mounted() {
    
  },

  methods: {
    // 详情
    handleCell(row) {
      console.log(row)
      this.$router.push({
        path: '/accountOpening/accountOpeningReportQuery/detail',
        // name: 'AccountOpeningReportDetail',
        query: {
          referenceNumber: row.referenceNumber,
          operateType: ''
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
