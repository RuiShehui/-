<!-- 開戶審核 -->
<template>
  <div>
    <search 
      @clickDetail="handleCell" 
      @check="check"  
      @recheck="recheck" 
      @confirmAcc="confirmAcc"
      :checkType="'1'"
      >
    </search>
  </div>
</template>

<script>
import search from '../components/search'
import {
  getRoleDetail
} from '@/utils/user';
import {
  binding
} from '@/api/accountOpening/accountOpeningCheck'
export default {
  name: 'AccountOpeningCheck',
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
      console.log("row", row)
      this.$router.push({
        path: row.status === 'Pending for info maker'
                ? '/accountOpening/accountOpeningCheck/detail'
                :  row.status === 'Pending for info checker'
                  ? '/accountOpening/accountOpeningCheck/recheckDetail'
                  : '/accountOpening/accountOpeningCheck/confirmDetail',
        // name: 'AccountOpeningCheckDetail',
        query: {
          referenceNumber: row.referenceNumber,
          operateType: ['Confirm completed', 'Partly completed'].includes(row.status) 
                        ? 'confirmView'
                        : 'view'
        }
      })
    },
    // 审核
    async check(row) {
      console.log("row", row)
      await this.lockRecord(row, '0')
    },
    // 复核
    async recheck(row) {
      await this.lockRecord(row, '1')
    },
    // 确认
    async confirmAcc(row, role) {
      this.$router.push({
          path: '/accountOpening/accountOpeningCheck/detail',
          query: {
            referenceNumber: row.referenceNumber,
            operateType: 'confirm',
            checkerType: ''
          }
        })
    },
    // 锁单 sign 0 审核 1 复核
    async lockRecord(obj, sign) {
      let params = {
        lockType: 'lock',
        referenceNumber: obj.referenceNumber,
        userCode: getRoleDetail().userCode,
        userName: getRoleDetail().userName
      }
      let result = await binding(params);
      // 锁单成功
      if (result.body) {
        this.$router.push({
          path: sign === '0' 
                  ? '/accountOpening/accountOpeningCheck/detail'
                  : '/accountOpening/accountOpeningCheck/recheckDetail',
          query: {
            referenceNumber: obj.referenceNumber,
            operateType: 'check',
            checkerType: ''
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
/deep/ .message-inner {
  width: 600px;
}
</style>
