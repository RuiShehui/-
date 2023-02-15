<template>
  <div class="g-business-setup">
    <el-form
      ref="submitForm"
      class="g-form"
      :model="formData"
      :rules="submitRules"
      :disabled="step === 2"
      label-width="calc(50% - 170px)"
      label-position="right"
      label-suffix=":"
    >
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MENU_NAME')" prop="menuName">
        <el-input class="g-input" :disabled="true" v-model="formData.menuName" maxlength="200" />
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.MENU_STATUS')" prop="menuStatus">
        <el-checkbox v-model="menuStatus">
          {{
          menuStatus ? $t('COMMON.USING') : $t('COMMON.STOP_USING')
          }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE')" prop="suitableObject">
        <el-radio-group v-model="formData.suitableObject">
          <el-radio label="1">{{ $t('BUSINESS_MANAGEMENT.WHITE_LIST') }}</el-radio>
          <el-radio label="2">{{ $t('BUSINESS_MANAGEMENT.ALL') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="formData.suitableObject === '1'"
        class="g-upload-wrapper"
        prop="commNetbankMenuObjects"
        :label="$t('BUSINESS_MANAGEMENT.PLEASE_SELECT_UPLODA_FILE')"
      >
        <el-tag
          v-show="uploadFile"
          class="g-file-name"
          :readonly="true"
          :closable="true"
          @close="handleClose"
        >{{ uploadFile }}</el-tag>
        <el-upload
          class="g-upload-btn"
          :action="uploadUrl"
          :multiple="false"
          :show-file-list="false"
          :limit="1"
          accept=".xlsx, .xls"
          :before-upload="handleUploadFile"
        >
          <el-button>{{ $t('COMMON.SELECT_FILE') }}</el-button>
        </el-upload>
        <p v-show="uploadFile" style="margin-top:5px;">
          <a class="g-download-btn" @click="downloadMenuObjList">
            {{ this.uploadFile}}
            <span class="btnbox">點擊下載</span>
          </a>
        </p>
        <p>
          <a class="g-download-btn" @click="handleDownLoad">{{ $t('COMMON.FILE_TEMPLATE') }}</a>
          <br />
          {{ $t('BUSINESS_MANAGEMENT.SUPPORT') }}.xls .xlsx格式
        </p>
        <pagination-card
          v-show="uploadFile.length > 0"
          :title="
            $t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_CODE') + $t('COMMON.LIST')
          "
          :origin="formData['commNetbankMenuObjects']"
          render-prop="customerCode"
        />
      </el-form-item>
    </el-form>

    <footer class="g-btn">
      <el-button
        :class="['g-op-btn', btnIdx === 1 ? 'confirm' : '']"
        v-for="(btn, btnIdx) of btnGroup"
        :key="btn"
        :type="btnIdx === 1 ? 'primary' : 'default'"
        @click.native="handleBtnClick(btn)"
      >{{ btn }}</el-button>
    </footer>
  </div>
</template>

<script>
import PaginationCard from '@/components/pagination-card';
import { createNamespacedHelpers } from 'vuex';
import { editNetback } from '@/api/business-management/business-start';
import { deepClone, setNRandomNumber, downloadFile } from '@/utils/tools';
import { findOrganizationListInfo } from '@/api/mechanism';
import excelUtils from '@/utils/transform-excel';
import mapValidators from '@/utils/stategies';
import { export_excel_file } from './execl_file';
import { downloadMenuObjList } from '@/api/business-management/business-start';
// import _ from 'lodash';
import { downloadTemplate } from '@/api/statiscal-query';

const { mapMutations } = createNamespacedHelpers('tabs');

const { readXlsx } = excelUtils();

function getCommNetbankMenuObjects(ctx) {
  const { customerCode } = ctx.formData;
  if (!parseInt(customerCode)) {
    return ctx.objList
      .filter(item => item.label !== ctx.$t('COMMON.TOTAL'))
      .map(item => {
        return {
          customerCode: item.value,
          menuObjectCode: setNRandomNumber(2)
        };
      });
  } else {
    return [
      {
        customerCode: 0,
        commNetbankMenuObjects: setNRandomNumber(2)
      }
    ];
  }
}

export default {
  name: 'BusinessStartSetup',
  components: {
    PaginationCard
  },
  data() {
    return {
      formData: {
        menuName: '',
        menuCode: '',
        menuStatus: '0', // 0-停用, 1-启用
        suitableObject: '2', // 0-机构, 1-白名单 2-全部
        commNetbankMenuObjects: [],
        uploadFile: '',
        pacPath: ''
      },
      isShowInstitution: true,
      menuStatus: true,
      objList: [],
      dOList: [],
      uploadUrl: '/api',
      excelColumns: [],
      excelData: [],
      uploadFile: '',
      step: 1
    };
  },
  computed: {
    /**
     * 提交数据
     */
    submitParams() {
      if (this.isShowInstitution) {
        const institutionParams = {
          ...this.formData
          // commNetbankMenuObjects: this.excelData.length ? this.excelData : getCommNetbankMenuObjects(this)
        };
        delete institutionParams.uploadFile;
        return institutionParams;
      } else {
        return {
          ...this.formData,
          commNetbankMenuObjects: this.excelData
        };
      }
    },
    /**
     * 动态校验规则
     */
    submitRules() {
      // 配合国际化按需引入
      const ctx = this;
      const { STR_NOT_EMPTY } = mapValidators(ctx);

      if (ctx.isShowInstitution) {
        return {
          menuName: STR_NOT_EMPTY(
            ctx.$t('BUSINESS_MANAGEMENT.BUSINESS_MANAGEMENT')
          ),
          menuStatus: STR_NOT_EMPTY(ctx.$t('BUSINESS_MANAGEMENT.MENU_STATUS')),
          suitableObject: STR_NOT_EMPTY(
            ctx.$t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE')
          ),
          customerCode: {
            required: true,
            trigger: 'change',
            validator: (r, val, cb) => {
              const { dOList } = ctx;
              if (!dOList || !dOList.length) {
                cb(new Error(ctx.$t(`COMMON.PLEASE_SELECT`)));
                return;
              }
              cb();
            }
          }
        };
      }
      return {
        menuName: STR_NOT_EMPTY(ctx.$t('BUSINESS_MANAGEMENT.MENU_NAME')),
        menuStatus: STR_NOT_EMPTY(ctx.$t('BUSINESS_MANAGEMENT.MENU_STATUS')),
        suitableObject: STR_NOT_EMPTY(
          ctx.$t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE')
        )
      };
    },
    /**
     * 操作按钮组
     */
    btnGroup() {
      switch (this.step) {
        case 1:
          return [this.$t('COMMON.CANCEL'), this.$t('COMMON.NEXT_STEP')];
        case 2:
          return [this.$t('COMMON.PREVIOUS_STEP'), this.$t('COMMON.CONFIRM')];
        default:
          return [];
      }
    },
    /**
     * 机构号全选按钮
     */
    selectBtn() {
      // objList dOList
      const { objList, dOList } = this;
      if (objList.length === dOList.length) {
        return {
          type: 'warning',
          name: this.$t('COMMON.CANCEL')
        };
      }
      return {
        type: 'info',
        name: this.$t('COMMON.SELECT_ALL')
      };
    }
  },
  watch: {
    dOList() {
      this.setCusInfos();
    },
    excelData(newVal) {
      if (newVal && newVal.length) {
        this.$set(this.formData, 'commNetbankMenuObjects', newVal);
      }
    },
    menuStatus(newVal) {
      const submitMenuStatus = newVal ? '1' : '0';
      this.$set(this.formData, 'menuStatus', submitMenuStatus);
    }
  },

  async mounted() {
    await this.getObjList();
    this.initEdit();
  },

  methods: {
    ...mapMutations(['DELETE_TABS', 'ADD_TABS']),

    initEdit() {
      const { query } = this.$route;
      const { commNetbankMenuObjects = [] } = query;

      Object.keys(this.formData).forEach(k => {
        this.formData[k] = query[k] || '0';
      });

      this.$set(
        this.formData,
        'commNetbankMenuObjects',
        commNetbankMenuObjects
      );
      if (commNetbankMenuObjects.length) {
        this.$set(this, 'uploadFile', 'template');
      }

      this.dOList = commNetbankMenuObjects
        .filter(item => item.customerCode || item.depCode)
        .map(item => item.customerCode || item.depCode);

      this.menuStatus = parseInt(query.menuStatus) === 0 ? false : true;
    },
    handleBtnClick(btn) {
      switch (btn) {
        case this.$t('COMMON.NEXT_STEP'):
          this.handleNextStep();
          break;
        case this.$t('COMMON.PREVIOUS_STEP'):
          this.step = 1;
          break;
        case this.$t('COMMON.CONFIRM'):
          this.handleSubmit();
          break;
        case this.$t('COMMON.CANCEL'):
          this.handleCancel();
          break;
        default:
          break;
      }
    },
    handleCancel() {
      this.DELETE_TABS(
        '/businessMangament/businessStart/setup'
      );
      this.ADD_TABS({
        path: '/businessMangament/businessStart',
        name: 'BusinessStart',
        meta: {
          title: 'BusinessStart'
        }
      });
      this.$router.push({
        name: 'BusinessStart'
      });
    },
    downloadMenuObjList() {
      console.log(this.formData);
      let param = { menuCode: this.formData.menuCode };
      downloadMenuObjList(param).then(res => {
        console.log('res', res);
        export_excel_file(res, this.uploadFile);
      });
    },
    // 下载二进制
    async handleDownLoad() {
      const result = await downloadTemplate({
        current: '1',
        fileTemplate: '1',
        size: 500
      });
      downloadFile(
        result,
        `${this.$t('MENU_PAGE_ITEMS.BUSINESS_START_TEMPLATE')}.xlsx`,
        'application/x-msdownload'
      );
    },
    handleNextStep() {
      if (this.submitParams.suitableObject === '1') {
        const { commNetbankMenuObjects } = this.submitParams;
        if (!commNetbankMenuObjects || !commNetbankMenuObjects.length) {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.SHOULD_NOT_EMPTY', {
              content: this.$t('COMMON.CONTENT')
            })
          });
          return;
        }
      }

      this.$refs['submitForm'].validate(valid => {
        if (valid) {
          this.step = 2;
        } else {
          this.$showMsg({
            message: this.$t('COMMON.CHECK_FAIL'),
            type: 'error'
          });
        }
      });
    },
    handleSubmit() {
      const submitParams = deepClone(this.submitParams);
      this.$showBox({
        content: `${this.$t('MENU_PAGE_ITEMS.BUSINESS_START_SETUP')} ?`,
        confirm: () => {
          this.confirmSubmit(submitParams);
        }
      });
    },
    async confirmSubmit(submitParams) {
      try {
        const result = await editNetback(submitParams);
        if (result.hasOwnProperty('body') && result.body === true) {
          this.$showMsg({
            message: this.$t('COMMON.OPERATE_SUCCESS'),
            type: 'success'
          });
        } else {
          this.$showMsg({
            message: this.$t('COMMON.OPERATE_FAIL'),
            type: 'error'
          });
        }
      } catch (err) {
        this.$showMsg({
          message: `${this.$t('COMMON.OPERATE_FAIL')}: ${err}`,
          type: 'error'
        });
      }

      this.handleCancel();
    },
    /**
     * handle-upload-file
     * @param {File} file 上传文件
     */
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
            this.setExcelColumns(header, '/');
            this.setExcelData(result, fileName);
          };
        } else this.$showMsg.error(this.$t('COMMON.UPLOAD_TYPE_ERROR'));
      }

      return false;
    },
    setExcelColumns(header, splitTag = '/') {
      const columns = header.map(h => {
        const [
          label = ''
          // prop = ''
        ] = h.split(splitTag);
        return {
          label,
          prop: 'customerCode'
        };
      });
      this.excelColumns = columns;
    },
    setExcelData(
      result,
      fileName
      // splitTag = '/'
    ) {
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        if (result[i].__rowNum__ !== i + 1) {
          console.log('判断内', i);
          this.$showMsg({
            type: 'error',
            //  message: this.$t('BUSINESS_MANAGEMENT.DATA_CUTOFF') + '(' +(i+1) + ')'
            message: this.$t('BUSINESS_MANAGEMENT.DATA_CUTOFF')
          });
          this.$set(this.formData, 'discountObjects', []);
          this.$set(this.formData, 'feilUrl', '');
          return;
        }
        console.log('判断外', i);
      }
      const dataSource = result.map(item => {
        const newItem = {};
        Object.keys(item).forEach(k => {
          // const [, key] = k.split(splitTag);
          newItem['customerCode'] = item[k];
        });
        return newItem;
      });
      const eptIdx = dataSource.findIndex(item => {
        const { customerCode = '' } = item;
        return !String(customerCode) || !String(customerCode).length;
      });
      if (result.length > 2000) {
        this.$showMsg({
          type: 'error',
          message: this.$t('BUSINESS_MANAGEMENT.DOC_MAX_ITEM')
        });
        this.uploadFile = '';
        this.excelData = [];
        return;
      }
      if (eptIdx > -1) {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
        });
        this.uploadFile = '';
        this.excelData = [];
      } else {
        // 目前白名单只能是数字
        const hasNotValid = dataSource.some(item =>
          isNaN(Number(item.customerCode))
        );
        if (hasNotValid) {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
          });
          this.uploadFile = '';
          this.excelData = [];
        } else {
          this.$showMsg({
            type: 'success',
            message: this.$t('COMMON.UPLOAD_SUCCESS')
          });
          this.uploadFile = fileName;
          this.$set(this, 'excelData', dataSource);
        }
      }
      // customerCode
      // console.log(this.excelData);
    },
    handleClose() {
      this.uploadFile = '';
      this.excelData = [];
    },
    async getObjList() {
      this.loading = true;
      try {
        const result = await findOrganizationListInfo({ current: 1, size: 50 }),
          { body } = result;
        this.objList = body.map(({ depCode, depName }, index) => ({
          value: depCode || index + 1,
          label: depName || `name${index + 1}`
        }));
      } catch (err) {
        this.$showMsg({
          message: `error: ${err}`,
          type: 'error'
        });
      }
      this.loading = false;
    },
    handleSelectObj(btnName) {
      switch (btnName) {
        case this.$t('COMMON.SELECT_ALL'):
          this.$set(this, 'dOList', this.objList.map(item => item.value));
          break;
        case this.$t('COMMON.CANCEL'):
          this.$set(this, 'dOList', []);
          break;
        default:
          break;
      }
    },
    setCusInfos() {
      let filterObjectList;
      if (this.objList.length) {
        filterObjectList = this.objList
          .filter(item => this.dOList.includes(item.value))
          .map(item => ({
            discountObjectCode: item.value,
            customerCode: item.value,
            objectName: item.label
          }));
      } else {
        filterObjectList = [];
      }
      this.$set(this.submitParams, 'commNetbankMenuObjects', filterObjectList);
    },
    onSwitchMenuStatus(menuStatus) {
      switch (menuStatus) {
        case '0':
          this.$set(this.formData, 'menuStatus', '0');
          break;
        case '1':
          this.$set(this.formData, 'menuStatus', '1');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './styles/setup.scss';
.btnbox {
  display: inline-block;
  border: 1px solid #4181fa;
  line-height: 30px;
  padding: 0px 4px;
  border-radius: 5px;
}
</style>
