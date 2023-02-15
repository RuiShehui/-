 <!--
 * @Author: your name
 * @Date: 2022-06-20 20:53:34
 * @LastEditTime: 2022-09-22 14:36:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\user\safe\phoneMode.vue
-->
<template>
  <div>
    <el-table :data="tabelData">
      <el-table-column :label="$t('MOBILE_TOKEN.REGISTERED_DEVICE')" prop="custNo">
        <template slot-scope="scope">
          <span>{{$t('MOBILE_TOKEN.BRAND')}}:{{scope.row.deviceModel}}</span>
          <span style="padding-left:20px">{{$t('MOBILE_TOKEN.OS_VERSION')}}:{{scope.row.deviceOS}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('MOBILE_TOKEN.REGISTERED_SERVICE')">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { softTokenInfo } from '@/api/public';
export default {
  data() {
    return {
      tabelData: []
    };
  },
  mounted() {
    this.getList();
    console.log(2323);
  },
  methods: {
    async getList() {
      const userCode = JSON.parse(sessionStorage.getItem('userInfo'));
      let params = {
        custNo: sessionStorage.getItem('custNo'),
        userCode: userCode.userCode
      };
      const result = await softTokenInfo(params);
      console.log(result, 'result');
      switch (result.status) {
        case '0':
          this.$router.replace('/user/safe/setSfotToken')
          break;
        case '1':
           result.status= this.$t('SOFT_TOKEN.TOKEN_TO_DOWNLOAD')
          break;
        case '2':
           result.status= this.$t('SOFT_TOKEN.TO_BE_ACTIVATED')
          break;
        case '3':
           result.status= this.$t('SOFT_TOKEN.WAITTING_VERIFICATION')
          break;
        case '4':
           result.status=this.$t('SOFT_TOKEN.MOBILE_SECURITY')
          break;
        case '5':
           result.status=this.$t('SOFT_TOKEN.MOBILE_SECURITY')
          break;
      }
      // if(result.status=='4'){
      //   result.status='流动保安认证服务'
      // }
      this.tabelData.push(result);

      //  .then(res => {
      //     this.tabelData.push(res);
      //     console.log(res, 'res');
      //   });
    }
  }
};
</script>

<style>
</style>