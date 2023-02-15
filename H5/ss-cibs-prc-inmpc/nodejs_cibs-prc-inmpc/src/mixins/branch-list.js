
import { setBranchList, getBranchList } from '@/utils/storageTools';
import {
  queryiMBranchList,
} from '@/api/accountOpening/invitationCodeManagement';

export default {
  data() {
    return {
      // allBranchList: [] // 分行列表
    };
  },
  created() {
  },
  mounted() {
    // this.initBranchList();
  },
  methods: {
    async initBranchList() {
      let allBranchList = getBranchList();
      if (allBranchList && allBranchList.length) {
        return allBranchList;
      } else {
        let params = {
        }
        let result = await queryiMBranchList(params);
        if (result.head.returnCode !== '000000') {
          this.$showMsg({
            message: result.head.returnMessage,
            type: 'error'
          });
        } else {
          allBranchList = result.body || [];
          setBranchList(allBranchList);
          return allBranchList;
        }
      }
    }
  }
};