import {
  setDataDitionaryList,
  getDataDitionaryList
} from '@/utils/storageTools';
import {
  dataDitionaryShowList,
} from '@/api/accountOpening/index.js'

export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    async getDataDitionaryListMixin(otp) {

      let dataDitionaryList = getDataDitionaryList(otp);
      
      if (dataDitionaryList && dataDitionaryList.length) {
        return dataDitionaryList
      } else {
        let params = {
          queryType: otp
        }
        const result = await dataDitionaryShowList(params);
        
        if (result.head.returnCode !== '000000') {
          this.$showMsg({
            message: result.head.returnMessage,
            type: 'error'
          });
        } else {
          dataDitionaryList = result.body || [];
          setDataDitionaryList(result.body, otp);
          return dataDitionaryList
        }
      }

    }
  }
};