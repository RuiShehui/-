<!-- 投资户开户审核查询 -->
<template>
  <div>
    <search @clickDetail="handleCell" @check="check" :checkType="'3'" @recheck="recheck"></search>
  </div>
</template>

<script>
import search from '../components/search'
import {
  getRoleDetail
} from '@/utils/user';
import {
  eiaoBinding
} from '@/api/accountOpening/investmentAccountOpeningCheck'
export default {
  name: 'InvestmentAccountOpeningCheck',
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
        path: '/accountOpening/investmentAccountOpeningCheck/detail',
        query: {
          referenceNumber: row.referenceNumber,
          operateType: 'view'
        }
      })
    },
    // 审核
    async check(row) {
      await this.lockRecord(row)
    },
    // 复核
    async recheck(row) {
      await this.lockRecord(row)
    },
    // 锁单
    async lockRecord(obj) {
      this.$router.push({
          path: '/accountOpening/investmentAccountOpeningCheck/detail',
          query: {
            referenceNumber: obj.referenceNumber,
            operateType: 'investment'
          }
        })
        return
      let params = {
        lockType: 'lock',
        referenceNumber: obj.referenceNumber,
        userCode: getRoleDetail().userNames,
        userName: getRoleDetail().userName,
      }
      let result = await eiaoBinding(params);
      // 锁单成功
      if (result.body) {
        this.$router.push({
          path: '/accountOpening/investmentAccountOpeningCheck/detail',
          query: {
            referenceNumber: obj.referenceNumber,
            operateType: 'investment'
          }
        })
        return
      }
      // 非改
      if (result.body === false) {
        this.$showMsg({
          type: 'error',
          message: this.$t('RAO_CHECK.CHECKING', {name: obj.bindStaffName})
        });
        return
      }
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        });
        return
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
