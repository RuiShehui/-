<!--
 * @Author: zhutao
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-11-04 17:17:15
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\user-maintenance-management.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>參考編號</div>
      <div>{{ tableData.flowNo }}</div>
      <div>網銀客戶編號</div>
      <div>{{ tableData.ebankCstmNo }}</div>
      <div>提交日期</div>
      <div>{{ tableData.createTime }}</div>
      
    </div>
    <div class="row">
      <div>提交人</div>
      <div>{{ tableData.linkUserName }}</div>
      <div>聯絡電話</div>
      <div>{{ tableData.mobilePhone }}</div>
      <div>聯絡郵箱</div>
      <div>{{ tableData.linkEmail}}</div>
      <!-- <div>郵箱</div>
      <div>{{ tableData.rmEmail}}</div>-->
    </div>
    <!-- <div class="row">
      <div>備註</div>
      <div>{{ tableData.remak }}</div>
    </div>-->
    <div class="u-table">
      <el-table :data="fileData">
        <el-table-column label="文件名稱" prop="originalFilename">
          <template slot-scope="scope">
            <span @click="downLoadImage(scope.row)" class="downLoad">{{scope.row.originalFilename}}</span>
            <!-- <a
              :href="scope.row.filePath"
              :download="scope.row.filePath"
              class="downLoad"
            >{{scope.row.originalFilename}}</a> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="申請類型"></el-table-column> -->
        <el-table-column label="文件檢查狀態" prop="status">
          <template slot-scope="scope">{{fileType(scope.row.status)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="u-bank">
      <p style="margin-left:24px;">銀行處理</p>
      <div class="row">
        <div>操作记录</div>
        <div>{{tableData.operationHistory}}</div>
      </div>
      <div class="row">
        <div>审批状态</div>
        <el-radio-group v-model="tableData.status">
          <el-radio :disabled="true" label="20">處理中</el-radio>
          <el-radio :disabled="status" label="21">完成</el-radio>
          <el-radio :disabled="defaults" label="29">拒絕</el-radio>
        </el-radio-group>
      </div>
      <div class="row">
        <div>添加备注</div>
        <div>
          <el-input type="textarea" :disabled="status" v-model="tableData.remark"></el-input>
        </div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button type="primary" @click="back">返回</el-button>
      <el-button
        type="primary"
        v-if="confirm"
        @click="submit"
      >{{ $t('CUSTOMER_MANAGEMENT.CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  queryApplyDetail,
  processApply,
  markInProcess,
  downloadFiles
} from '@/api/specialInstruction/index';
import {
  ShowMessage,
} from '@/plugins';
import store from '@/store';
import {
  downloadFile
} from '@/utils/tools';
export default {
  name: 'UserMaintainConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {},
      fileData: [],
      cardTypeList: [],
      cardAreaList: [],
      ebankCsInfo: [{ entName: '', authStatus: '' }],
      remark: '',
      status: false,
      defaults: false,
      confirm: true,
      imageStr:{}
    };
  },
  mounted() {
    this.getDetail();
    this.markInProcess();
  },
  methods: {
    async markInProcess() {
      const result = await markInProcess({
        id: this.row.id
      });
      if(result.body && this.tableData.status!=='21' && this.tableData.status!=='29'){
        this.$set(this.tableData,'status','20')
        this.status = false;
        this.defaults = false;
        this.confirm = true;
        // this.tableData.statu ='20'
      }
      console.log(result, 'result');
    },
    getDetail() {
      queryApplyDetail({
        id: this.row.id
      }).then(res => {
        console.log(res, 'res');
        if (res && res.body) {
          if (res.body.status == '20') {
            this.status = false;
            this.defaults = false;
            this.confirm = true;
          } else {
            this.status = true;
            this.defaults = true;
            this.confirm = false;
          }
          this.tableData = res.body;
          if (this.tableData.fileList.length !== 0) {
            this.fileData = this.tableData.fileList;
          } else {
            this.fileData = [];
          }
        } else {
          this.tableData = {};
        }
      });
    },
    back() {
      this.$emit('back');
    },
    submit() {
      processApply({
        id: this.row.id,
        opinion: this.tableData.status,
        remark: this.tableData.remark
      }).then(res => {
        console.log(res, 'res');
        if (res && res.body) {
          this.$showMsg({
            type: 'success',
            message: '修改成功'
          });
          this.$emit('back');
        }else{
           this.$showMsg({
            type: 'error',
            message: '修改失敗'
          });
          this.$emit('back');
        }
      });
    },
    fileType(val) {
      switch (val) {
        case 'DFS_UPLOADED':
          return '上传完成';
        case 'UPLOADED':
          return '上传完成';
        case 'NOT_UPLOAD_DFS':
          return '未上传FDS';
        case 'UNCHECK':
          return '没有检查';
        case 'FINISHED':
          return '检查完成';
        case 'FAILURE':
          return '检查失败';
        case 'LASTLINE_DANGER':
          return '危险文件';
        case 'MCCAFE_DANGER':
          return '危险文件';
      }
    },
  //  async downLoad(row) {
  //     let params ={
  //       // refNum: '1537726337271939073',
  //       refNum: row.refNum,
  //       scenarioCode: ''
  //     }
  //     let result = await downloadFile(params)
  //     console.log(result, 'path');
  //     var imgStr = 
  //   },
    // 下载图片
    async downLoadImage(row) {
      // 文件状态是否是FINISHED
      console.log(row,'row')
      if (row.status && row.status !== 'FINISHED') {
        ShowMessage({
          message: `${this.$t('RAO_CHECK.DOWNLOAD_ERROR')} - 文件未掃描完成，請等待`,
          type: 'error',
        });
        return false
      }
      let fileInfo = await this.getDownloadFileInfo(row.refNum) || {}
      let  blobType = row.fileType
       console.log(fileInfo,'fleInfo')
      // base64转blob
      let bstr = window.atob(fileInfo.file)
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      downloadFile(
        u8arr,
        // `${fileInfo.filename}.${fileInfo.fileType}`,
        `${fileInfo.filename}`,
        blobType
      );
    },
    // 获取图片、文件信息
    async getDownloadFileInfo(row) {
      // otp = '1547143535800451073'
      let params = {
        // refNum: '1537726337271939073',
        refNum: row,
        scenarioCode: ''
      }
      store.commit('loading/SET_LOADING', false);
      let result = await downloadFiles(params)
      this.imageStr = result.body
      console.log(this.imageStr,'imageStr')
      return result.body || {}
    },
  }
};
</script>

<style lang="scss" scoped>
.u-table {
  margin-top: 24px;
}
.u-bank {
  margin-top: 28px;
  padding-left: 14px;
  font-size: 18px;
  height: 46px;
  line-height: 46px;
  background: #f3f3f3;
  font-weight: bold;
}
.g-bottom {
  margin-top: 280px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.downLoad {
  color: blue;
  cursor: pointer;
}
</style>
