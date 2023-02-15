<!-- 投资户开户记录查询 -->
<template>
  <div>
    <search 
      @clickDetail="handleCell" 
      :exportBoolean="true"
      :checkType="'4'"
      >
    </search>
  </div>
</template>

<script>
import search from '../components/search'
export default {
  name: 'InvestmentAccountApplyQuery',
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
      this.$router.push({
        path: '/accountOpening/investmentAccountApplyQuery/detail',
        query: {
          referenceNumber: row.referenceNumber,
          operateType: 'view'
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
