<!--
 * @Author: zhangcheng
 * @Date: 2022-06-01 16:26:12
 * @LastEditTime: 2022-08-24 10:39:42
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\custQuotaManage\components\CustQuotaManageAdd.vue
-->
<template>
  <div>
    <el-form label-position="left" label-width="100px">
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.ADD_TYPE')">
        <el-radio-group v-model="saveMethod" @change="changeUploadType">
          <el-radio label="0">{{ $t('BUSINESS_MANAGEMENT.NET_EDIT') }}</el-radio>
          <el-radio label="1">{{ $t('BUSINESS_MANAGEMENT.FILE_UPLOAD') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="saveMethod === '1'" :label="$t('BUSINESS_MANAGEMENT.ADD_WHITE_LIST')">
        <el-upload
          v-show="!uploadFile"
          action="/api"
          :multiple="false"
          :show-file-list="false"
          :limit="1"
          accept=".xlsx, .xls"
          :before-upload="handleUploadFile"
        >
          <el-button>{{ $t('COMMON.SELECT_FILE') }}</el-button>
        </el-upload>
        <el-tag
          v-show="uploadFile"
          class="g-file-name"
          :readonly="true"
          :closable="true"
          @close="handleClose"
        >{{ uploadFile }}</el-tag>
        <p>
          <!-- <span>{{ $t('COMMON.FILE_TEMPLATE') }}</span> -->
          <a class="g-download-btn" @click="handleDownLoad">{{ $t('COMMON.FILE_TEMPLATE') }}</a>
          <br />
          {{ $t('BUSINESS_MANAGEMENT.SUPPORT') }}.xls .xlsx格式
        </p>
      </el-form-item>
    </el-form>
    <div v-if="saveMethod === '0'" class="mg-40">
      <div class="table-title">
        <div>{{ $t('BUSINESS_MANAGEMENT.ADD_MAX') }}</div>
        <div>{{ $t('BUSINESS_MANAGEMENT.ALL_NUMBER',{total:tcBankLimitRelationReqList.length}) }}</div>
      </div>
      <el-table
        class="mg-8"
        :data="tcBankLimitRelationReqList"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column width="50" label>
          <template v-slot="{ $index }">
            <div
              class="symbol"
              v-if="tcBankLimitRelationReqList.length-1 === $index && tcBankLimitRelationReqList.length<50"
              @click="add($index)"
              style="font-size:40px"
            >+</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')">
          <template v-slot="{row}">
            <el-input v-model="row.custNo" :placeholder="$t('COMMON.PLEASE_INPUT')" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')">
          <template v-slot="{row}">
            <el-input v-model="row.custName" :placeholder="$t('COMMON.PLEASE_INPUT')" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')">
          <template v-slot="{row}">
            <el-select v-model="row.customerClazz">
              <el-option
                v-for="item in customerClazzList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="80" label>
          <template v-slot="{ $index }">
            <div
              class="symbol"
              v-if="tcBankLimitRelationReqList.length-1 === $index && $index!==0"
              style="font-size:40px"
              @click="del"
            >×</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backIndex">{{ $t("COMMON.BACK") }}</el-button>
      <el-button type="primary" @click="toConfirm">{{ $t("COMMON.NEXT_STEP") }}</el-button>
    </div>
  </div>
</template>

<script>
import { downloadFile } from '@/utils/tools';
import { downloadTemplate } from '@/api/statiscal-query';
import _ from 'lodash';
import excelUtils from '@/utils/transform-excel';
const { readXlsx } = excelUtils();
export default {
  name: 'CustQuotaManageAdd',
  props: {
    addData: {
      type: Object,
      default() {
        return {
          saveMethod: '0',
          tcBankLimitRelationReqList: [
            {
              custNo: '',
              custName: '',
              customerClazz: ''
            }
          ]
        };
      }
    },
    customerClazzList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      saveMethod: '0',
      tcBankLimitRelationReqList: [],
      uploadFile: ''
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      this.tcBankLimitRelationReqList = _.cloneDeep(
        this.addData.tcBankLimitRelationReqList
      );
      this.saveMethod = this.addData.saveMethod;
    },
    changeUploadType() {
      this.tcBankLimitRelationReqList = [
        {
          custNo: '',
          custName: '',
          customerClazz: ''
        }
      ];
      this.uploadFile = '';
    },
    // 回到首页
    backIndex() {
      this.tcBankLimitRelationReqList = [
        {
          custNo: '',
          custName: '',
          customerClazz: ''
        }
      ];
      this.saveMethod = '0';
      this.uploadFile = '';
      this.$emit('backIndex');
    },
    // 下一步
    toConfirm() {
      if (this.saveMethod === '0') {
        let index = '';
        let flag = '';
        const checkData = this.tcBankLimitRelationReqList.find((item, idx) => {
          index = idx;
          flag =
            item.custNo === '' ||
            item.custName === '' ||
            item.customerClazz === '';
          return flag;
        });
        if (checkData) {
          return this.$showMsg({
            message: this.$t('BUSINESS_MANAGEMENT.CHECK_NULL', {
              index: index + 1
            }),
            type: 'error'
          });
        }
      }
      if (this.saveMethod === '1' && !this.uploadFile) {
        return this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.PLEASE_SELECT_UPLODA_FILE'),
          type: 'error'
        });
      }
      this.$emit('toConfirm', {
        data: {
          saveMethod: this.saveMethod,
          tcBankLimitRelationReqList: this.tcBankLimitRelationReqList
        },
        type: 'add'
      });
    },
    // 新增
    add(index) {
      if (this.tcBankLimitRelationReqList.length < 50) {
        this.tcBankLimitRelationReqList.push({
          custNo: '',
          custName: '',
          customerClazz: ''
        });
      }
    },
    // 删除
    del() {
      this.tcBankLimitRelationReqList.pop();
    },
    async handleUploadFile(file) {
      const acceptList = ['xlsx', 'xls'];
      if (file) {
        const fileName = file.name,
          fileType = fileName.split('.')[fileName.split('.').length - 1];
        if (acceptList.includes(fileType)) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);

          reader.onload = e => {
            const data = e.target.result;
            const { header, result } = readXlsx(data, 'uft-8');
            // this.setExcelColumns(header, '/');
            // console.log(result, 'result');
            console.log(header, 'header');
            if (
              header.length !== 3 ||
              header[0] !==
                `${this.$t('BUSINESS_MANAGEMENT.CIF_CUSNO')}/custNo` ||
              header[1] !==
                `${this.$t('BUSINESS_MANAGEMENT.ENT_NAME')}/custName` ||
              header[2] !==
                `${this.$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')}/customerClazz`
            ) {
              this.$showMsg({
                message: '請使用正確文件模板上傳文件',
                type: 'error'
              });
              return;
            }
            if (result.length === 0) {
              return this.$showMsg({
                message: '上傳文件數據不能為空',
                type: 'error'
              });
            }
            this.setExcelData(result, fileName);
          };
        } else this.$showMsg.error(this.$t('COMMON.UPLOAD_TYPE_ERROR'));
      }

      return false;
    },
    setExcelData(result, fileName) {
      if (result.length > 2000) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.UPLOAD_ERROR'),
          type: 'error'
        });
        return;
      }
      const dataSource = result.map((item, index) => {
        const newItem = {};
        Object.keys(item).forEach(k => {
          const [, key] = k.split('/');
          if (key) {
            newItem[key] = item[k];
          }
        });
        return newItem;
      });
      const nullIndex = dataSource.findIndex(item => {
        return Object.keys(item).length < 3;
      });
      console.log(nullIndex, 'nullIndex');
      if (nullIndex !== -1) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.FILE_CHECK_NULL', {
            index: nullIndex + 2
          }),
          type: 'error'
        });
        return;
      }
      console.log(dataSource, 'dataSource');
      this.$showMsg({
        type: 'success',
        message: this.$t('COMMON.UPLOAD_SUCCESS')
      });
      this.uploadFile = fileName;
      this.tcBankLimitRelationReqList = dataSource.map((item, index) => {
        return {
          ...item,
          customerClazz: this.customerClazzFilter(item.customerClazz, index)
        };
      });
      console.log(
        this.tcBankLimitRelationReqList,
        'this.tcBankLimitRelationReqList'
      );
    },
    handleClose() {
      this.uploadFile = '';
      this.tcBankLimitRelationReqList = [];
    },
    customerClazzFilter(val, index) {
      if (val) {
        const res = val.charCodeAt() - 65;
        const customerClazzMax = Number(
          this.customerClazzList[this.customerClazzList.length - 1].value
        );
        if (res === 0 || res > customerClazzMax) {
          this.handleClose();
          return this.$showMsg({
            message: this.$t('BUSINESS_MANAGEMENT.CLAZZ_ERROR', {
              index: index + 2
            }),
            type: 'error'
          });
        }
        return res;
      } else {
        return val;
      }
    },
    // 下载二进制
    async handleDownLoad() {
      const result = await downloadTemplate({
        current: '1',
        fileTemplate: '3',
        size: 200
      });
      downloadFile(
        result,
        `${this.$t('BUSINESS_MANAGEMENT.CUS_BANK_LIMIT')}.xlsx`,
        'application/x-msdownload'
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import '../style/style.scss';
</style>
