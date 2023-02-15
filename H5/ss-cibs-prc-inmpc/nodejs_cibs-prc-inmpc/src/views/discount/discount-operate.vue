<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2022-06-08 15:55:59
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\discount\discount-operate.vue
-->
<template>
  <div class="contain">
    <el-form
      ref="submitForm"
      class="g-operate-form"
      :model="formData"
      :rules="formRules"
      :disabled="step === 2"
      label-width="calc(50% - 170px)"
      label-position="right"
    >
      <el-form-item
        class="g-operate-item"
        v-for="(value, prop) in formData"
        v-show="showProps.includes(prop)"
        :key="prop"
        :prop="prop"
        :label="formLabels[prop]"
        size="medium"
      >
        
        <component
          class="g-render-component"
          v-show="prop !== 'discountMoney'"
          v-model="formData[prop]"
          :is="renderComponent(prop)"
          :unlink-panels="true"
          :range-separator="$t(`COMMON.DATESPAN_TO`)"
          :start-placeholder="$t(`COMMON.START_TIME`)"
          :disabled="handleDisabledComponent(prop)"
          :isFullNumber="prop === 'discountStandard'"
          :isSaveDot="prop !== 'discountStandard'"
          :end-placeholder="$t(`COMMON.END_TIME`)"
          :picker-options="dateOptions"
          :type="
            prop.toLowerCase().includes('timespan')
              ? 'daterange'
              : prop.toLowerCase().includes('desc')
              ? 'textarea'
              : 'text'
          "
          :maxlength="prop.toLowerCase().includes('desc') ? 300 : 30"
          :show-word-limit="prop.toLowerCase().includes('desc')"
          :rows="5"
          :is-save-dot="true"
          @change="onComponentChange(prop, $event)"
        >
          <!-- :is-full-number="true" -->
          <!-- discountObjectType -->
          <!-- discountDesc -->
          
          <template
            v-if="
              renderComponent(prop)
                .toLowerCase()
                .includes('select')
            "
          >
            <template v-if="prop === 'discountMethod'">
              <el-option
                v-for="(item, index) of discountMethodList"
                :key="index + item.value + prop"
                :value="item.value"
                :label="item.label"
              />
             
            </template>
            
            <template v-if="prop === 'discountWay'">
              <el-option
                v-for="(item, index) of discountWayList"
                :key="index + item.value + prop"
                :value="item.value"
                :label="item.label"
              />
            </template>
          </template>
          <template
            v-if="
              renderComponent(prop)
                .toLowerCase()
                .includes('radio')
            "
          >
            <template v-if="prop === 'channel'">
              <el-radio label="0">{{ $t('COMMON.ENT_BANK') }}</el-radio>
              <el-radio label="1">{{ $t('COMMON.ENTERPRISES_BANK') }}</el-radio>
            </template>
            <template v-if="prop === 'discountObjectType'">
              <!-- <el-radio label="0">{{ $t('BUSINESS_MANAGEMENT.ORGANIZATION') }}</el-radio> -->
              <el-radio label="1">{{ $t('BUSINESS_MANAGEMENT.WHITE_LIST') }}</el-radio>
            </template>
            
          </template>
        </component>
        <template v-if="prop == 'discountStandard'">
           {{ prop === 'discountStandard' ? '%' : '' }}
            <p>折扣方式為百分比，折後費用=原費用*折扣百分比，舉例：匯款電報費HKD110，折扣百分比50%，折後費用=110*50%=55</p>
          </template>
          <template >
          </template>
        <template v-if="discountMoneyList.length > 0">
          <!-- discountMoneyList -->
          <money-input
            class="g-render-component discount-money"
            v-show="prop === 'discountMoney'"
            v-for="item of discountMoneyList"
            :isSaveDot="true"
            :key="item.discountCcy"
            :placeholder="`${item.discountCcy} | ${$t('COMMON.PLEASE_INPUT')}`"
            v-model="item.discountMoney"
          />
            <p v-show="prop == 'discountMoney'">折扣方式為固定金額，折後費用=原費用-折扣金額，舉例：匯款電報費HKD110，固定金額折扣50，折後費用=110-50=60</p>
        </template>
        <!-- 机构列表 -->
        <el-form-item
          v-if="
            prop === 'discountObjectType' &&
              formData['discountObjectType'] === '0'
          "
          :label="$t('BUSINESS_MANAGEMENT.ORGANIZATION')"
          prop="discountObjects"
          label-width="300"
        >
          <!-- 2021-12-16 改成多选 -->
          <!-- // 废弃代码 // v-model="formData['discountObjects'][0]['discountObjectCode']" -->
          <el-select v-model="dOList" :multiple="true" class="g-form-component">
            <el-option
              v-for="(item, index) of objList"
              :key="
                index +
                  'discountObjectTypeList' +
                  $t('BUSINESS_MANAGEMENT.ORGANIZATION')
              "
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-button
            class="g-select-btn"
            :type="selectBtn.type"
            size="mini"
            @click.native="handleSelectObj(selectBtn.name)"
          >{{ selectBtn.name }}</el-button>
        </el-form-item>
        <!-- 机构号上传 -->
        <el-form-item
          v-if="
            prop === 'discountObjectType' &&
              formData['discountObjectType'] === '1'
          "
        >
          <el-tag
            v-show="formData.feilUrl && step !== 2"
            class="g-file-name"
            :readonly="true"
            :closable="true"
            @close="handleClose()"
          >{{ formData.feilUrl }}</el-tag>
          <el-upload
            class="g-render-component upload"
            action="/cibs"
            :multiple="false"
            :show-file-list="false"
            :limit="1"
            :before-upload="handleUploadFile"
            accept=".xlsx, .xls"
          >
            <!-- <el-input class="g-file-name" v-model="formData.feilUrl" :readonly="true" /> -->
            <el-button class="g-upload-btn" :dashed="true">
              <i :class="['el-icon-plus', 'g-upload-icon']">{{ $t('COMMON.SELECT_FILE') }}</i>
            </el-button>
          </el-upload>
          <pagination-card
            v-show="formData.feilUrl.length > 0"
            :title="
              $t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_CODE') + $t('COMMON.LIST')
            "
            :origin="formData['discountObjects']"
            render-prop="discountObjectCode"
          />
          <p>
            <a class="g-download-btn" @click="handleDownLoad">{{ $t('COMMON.FILE_TEMPLATE') }}</a>
            <br />
            {{ $t('BUSINESS_MANAGEMENT.SUPPORT') }}.xls .xlsx格式
          </p>
        </el-form-item>
      </el-form-item>
    </el-form>
    <footer class="g-op-btn-wrapper">
      <!-- <el-button class="g-op-btn" @click.native="handleCancel">{{ $t('COMMON.CANCEL') }}</el-button>
      <el-button
        type="primary"
        class="g-op-btn"
        @click.native="handleSubmit"
      >{{ $t('COMMON.CONFIRM') }}</el-button>-->
      <el-button
        class="g-op-btn"
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
import mapValidator from '@/utils/stategies';
import {
  transToHighCamel,
  isType,
  deepClone,
  downloadFile
} from '@/utils/tools';
import dateTools from '@/utils/dateTools';
import { labelAlign } from '@/directives';
import constant from '@/utils/constant';
import { findOrganizationListInfo } from '@/api/mechanism';
import { addDiscount, editDiscount } from '@/api/business-management';
import excelUtils from '@/utils/transform-excel';
import { downloadTemplate } from '@/api/statiscal-query';

const { formatDate } = dateTools;
const { discountMethodList, discountWayList } = constant;
const {
  readXlsx
  // exportArrayToExcel
} = excelUtils();

export default {
  name: 'DiscountOperatePage',
  components: {
    PaginationCard
  },
  directives: {
    labelAlign
  },
  props: {},
  data() {
    const ctx = this;
    const {
      STR_NOT_EMPTY,
      // TIMESPAN_VALIDATOR,
      CHECK_DISCOUNT_STANDARD
    } = mapValidator(ctx);
    return {
      formData: {
        channel: '0', // 折扣渠道
        discountWay: '1', // 折扣项目
        discountMethod: '0', // 折扣方式 0-百分比 1-固定金额
        discountMoney: '100', // 折扣金额 (与折扣标准2选1) (12位金额 (用以前的金额) $)
        discountStandard: '0', // 折扣标准 (% $ 0-100)
        activateTimespan: ['', ''], // 生效日期-失效日期
        discountObjectType: '1', // 适用对象
        // 折扣对象名称
        discountObjects: [
          {
            // discountObjectCode: '', // 折扣对象编号（机构号、客户号）
            // objectName: '' // 折扣对象名称 (机构号需要传递名称)
          }
        ],
        discountDesc: '', // 优惠描述
        feilUrl: '' // 文件名称
      },
      // 折扣金额列表
      discountMoneyList: [
        /*
          {
            "discountCcy": "", // 币种
            "discountMoney": "" // 金额
          }
        */
      ],
      // loading-status
      loading: false,
      // excel-datas
      excelColumns: [],
      // 机构列表
      objList: [],
      // 日期选择范围
      dateOptions: {
        disabledDate(date) {
          return new Date(date) <= new Date();
        }
      },
      // 折扣方式列表
      discountMethodList,
      // 折扣方式列表
      discountWayList: discountWayList.filter(item => item.value !== 0),
      // 步骤条
      step: 1,
      // discount-objects-list
      dOList: [],
      formRules: {
        channel: STR_NOT_EMPTY(
          ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('channel')}`)
        ),
        discountMethod: STR_NOT_EMPTY(
          ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('discountMethod')}`)
        ),
        discountWay: STR_NOT_EMPTY(
          ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('discountWay')}`)
        ),
        discountStandard: CHECK_DISCOUNT_STANDARD(
          ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('discountStandard')}`)
        ),
        // discountMoney: STR_NOT_EMPTY(
        //     ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('discountMoney')}`)
        //   ),
        // activateTimespan: [TIMESPAN_VALIDATOR()],
        discountObjectType: STR_NOT_EMPTY(
          ctx.$t(
            `BUSINESS_MANAGEMENT.${transToHighCamel('discountObjectType')}`
          )
        )
      }
    };
  },
  computed: {
    // formLabels
    formLabels() {
      const labels = {};
      for (let prop in this.formData) {
        if (
          prop === 'discountObjectCode' &&
          this.formData.discountObjectType === '1'
        ) {
          labels[prop] = '';
        } else {
          labels[prop] = this.$t(
            `BUSINESS_MANAGEMENT${prop ? `.${transToHighCamel(prop)}` : ''}`
          );
        }
      }
      return labels;
    },
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm || null;
    },
    routeQuery() {
      const { query } = this.$route;
      return query || {};
    },
    showProps() {
      const propList = [
        'channel',
        'discountMethod',
        'discountMoney',
        'discountWay',
        'discountStandard',
        'activateTimespan',
        'discountObjectType',
        'discountDesc',
      ];
      let renderList = [];
      if (this.formData.discountMethod === '0') {
        renderList = propList.filter(item => item !== 'discountMoney');
        console.log('renderList:',renderList);
      } else {
        renderList = propList.filter(item => item !== 'discountStandard');
        console.log('renderList:',renderList);

      }

      return renderList;
    },
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
    'formData.activateTimespan'(newVal) {
      if (!newVal) {
        this.formData.activateTimespan = ['', ''];
      }
    },
    'formData.discountMethod': {
      deep: true,
      handler(newVal) {
        const { IS_VALID_MONEY, STR_NOT_EMPTY } = mapValidator(this);
        console.log('formData.discountMethod:',this.formData.discountMethod);
        switch (newVal) {
          case '0':
            this.formRules.discountStandard = IS_VALID_MONEY(
              this.$t(
                `BUSINESS_MANAGEMENT.${transToHighCamel('discountStandard')}`
              )
            );
            this.formRules.discountMoney = {};
            break;
          case '1':
            this.formRules.discountStandard = {};
            this.onDiscountWayChange(this.formData.discountWay);
            this.formRules.discountMoney = STR_NOT_EMPTY(
              this.$t(
                `BUSINESS_MANAGEMENT.${transToHighCamel('discountMoney')}`
              )
            );
            break;
          default:
            break;
        }
      }
    },
    dOList() {
      this.setDiscountObjects();
    }
  },
  mounted() {
    this.getObjList();
    this.initEditData();
    setTimeout(() => {
      this.onDiscountWayChange(this.formData.discountWay);
      const { crtItem } = this.routeQuery;
      if (crtItem && crtItem.hasOwnProperty('discountMoney')) {
        const discountMoneyList = JSON.parse(crtItem.discountMoney || '[]');
        this.$set(this, 'discountMoneyList', discountMoneyList);
      }
    }, 0);
  },
  methods: {
    renderComponent(prop) {
      const inputs = ['discountDesc'], // 普通输入
        selects = ['discountMethod', 'discountWay'],
        mInputs = ['discountMoney', 'discountStandard'], // 金额输入
        radios = ['channel', 'discountObjectType'],
        datespans = ['activateTimespan'];
      if (inputs.includes(prop)) {
        return 'ElInput';
      }
      if (selects.includes(prop)) {
        return 'ElSelect';
      }
      if (mInputs.includes(prop)) {
        return 'MoneyInput';
      }
      if (radios.includes(prop)) {
        return 'ElRadioGroup';
      }
      if (datespans.includes(prop)) {
        return 'ElDatePicker';
      }
      return 'div';
    },
    handleBtnClick(btn) {
      switch (btn) {
        case this.$t('COMMON.CANCEL'):
          this.handleCancel();
          break;
        case this.$t('COMMON.NEXT_STEP'):
          this.handleNextTick();
          break;
        case this.$t('COMMON.PREVIOUS_STEP'):
          this.step--;
          break;
        case this.$t('COMMON.CONFIRM'):
          this.handleSubmit();
          break;
        default:
          break;
      }
    },
    handleNextTick() {
      /** 判断交易金额 */
      // const { STR_NOT_EMPTY } = mapValidator(this);
      if (
        this.formData.discountMethod === '1' &&
        this.discountMoneyList.some(item => !item.discountMoney)
      ) {
        this.$showMsg({
          type: 'error',
          //  message: STR_NOT_EMPTY(
          //   this.$t(`BUSINESS_MANAGEMENT.${transToHighCamel('discountMoney')}`)
          // )
          message: '請輸入折扣金額'
        });
        return;
      }
      
      /* 先判断折扣列表长度 */
      const { discountObjects } = this.formData;
      var status = discountObjects[0].discountObjectCode ? true : false;
      if (!discountObjects || !discountObjects.length || !status) {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.SHOULD_NOT_EMPTY', {
            content: this.$t(`BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_TYPE`)
          })
        });
        return;
      }
      this.submitForm.validate(valid => {
        if (valid) {
          this.step++;
        } else {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
        }
      });
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
    // checkDiscountMoneyList({ discountMoneyList = [], discountWay }) {
    //   switch (discountWay) {
    //     case '1':
    //       return discountMoneyList.some(item => Number(item.discountMoney) > 110);
    //     case '3':
    //     case '4':
    //     case '5':
    //       return discountMoneyList.some(item => Number(item.discountMoney) > 1);
    //     default:
    //       return false;
    //   }
    // },
    handleSubmit() {
      this.submitForm.validate(valid => {
        if (!valid) {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
        } else {
          let submitData = this.getSubmitData();
          if (submitData.discountMethod === '0') {
            submitData.discountStandard = parseInt(submitData.discountStandard);
            submitData.discountMoneyList = [];
          } else {
            // submitData.discountStandard = '';
            // if (this.checkDiscountMoneyList(submitData)) {
            //   this.$showMsg({
            //     type: 'error',
            //     message: `銀行收費折扣額超過規定範圍`,
            //     duration: 1500
            //   });
            //   return;
            // }
          }
          // submitData.discountMoney = '';
          this.$showBox({
            content: Object.keys(this.routeQuery).length
              ? this.$t('BUSINESS_MANAGEMENT.EDIT_DISCOUNT_TIP')
              : this.$t('BUSINESS_MANAGEMENT.ADD_DISCOUNT_TIP'),
            confirm: () =>
              Object.keys(this.routeQuery).length
                ? this.confirmSubmit(submitData, editDiscount)
                : this.confirmSubmit(submitData, addDiscount)
          });
        }
      });
    },
    async confirmSubmit(submitData, fn) {
      const result = await fn(submitData);
      const op = Object.keys(this.routeQuery).length
        ? this.$t('COMMON.UPDATE')
        : this.$t('COMMON.ADD');
        console.log('op:',op);
      if (result.body === true) {
        this.$showMsg({
          type: 'success',
          message: this.$t('COMMON.SOMETHING_SUCCESS', { op })
        });
        setTimeout(() => {
        this.$router.push({
          name: 'discount',
          query: {}
        });
        this.handleCancel();
      }, 3000);
      }
      console.log('to the out')
      // todo
      // setTimeout(() => {
      //   this.$router.push({
      //     name: 'discount',
      //     query: {}
      //   });
      //   this.handleCancel();
      // }, 3000);
    },
    getSubmitData() {
      const sFormData = deepClone(this.formData);
      let start = this.formData.activateTimespan[0];
      let end = this.formData.activateTimespan[1];

      if (isType(start, 'String')) {
        sFormData.effectiveTime = start;
      } else {
        sFormData.effectiveTime = formatDate(start);
      }
      if (isType(end, 'String')) {
        sFormData.failureTime = end;
      } else {
        sFormData.failureTime = formatDate(end);
      }

      delete sFormData.activateTimespan;

      // 选择了全部的机构号
      if (sFormData.discountObjects[0]['discountObjectCode'] === '0') {
        sFormData.discountObjects = this.objList
          .filter(item => parseInt(item.value))
          .map(item => ({
            objectName: item.label,
            discountObjectCode: item.value
          }));
      }

      // 是否为编辑
      if (this.routeQuery) {
        const { crtItem } = this.routeQuery;
        if (crtItem && crtItem.discountCode) {
          sFormData.discountCode = crtItem.discountCode;
        }
      }

      if (sFormData.discountMethod === '1') {
        sFormData.discountMoneyList = [...this.discountMoneyList];
      }

      return sFormData;
    },
    initEditData() {
      if (Object.keys(this.routeQuery).length) {
        const { crtItem } = this.routeQuery,
          _formData = deepClone(this.formData);
        // console.log(crtItem, _formData);
        // console.log(crtItem);
        for (let k in this.formData) {
          const value = crtItem.hasOwnProperty(k) ? crtItem[k] : _formData[k];
          this.$set(this.formData, k, value);
        }
        const { effectiveTime = '', failureTime = '' } = crtItem;
        this.$set(this.formData, 'activateTimespan', [
          effectiveTime,
          failureTime
        ]);
        if (crtItem.discountObjectType === '0') {
          this.dOList = crtItem.discountObjects.map(
            item => item.discountObjectCode
          );
        }
        if (crtItem.discountObjectType === '1') {
          this.formData.feilUrl = this.$t('COMMON.CURRENT_UPLOAD_FILE');
        }
      }
    },
    /**
     * 上传操作
     * @param {File} file
     */
    handleUploadFile(file) {
      Uint8Array.prototype.slice = Array.prototype.slice;
      if (file) {
        const acceptList = ['xlsx', 'xls'],
          fileName = file.name,
          fileType = fileName.split('.')[fileName.split('.').length - 1];
        if (acceptList.includes(fileType)) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = e => {
            const data = e.target.result,
              { header, result } = readXlsx(data, 'uft-8');
            this.setExcelColumns(header, '/');
            this.setExcelData(result, fileName);
          };
        } else
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
          });
      }

      return false;
    },
    setExcelColumns(header, splitTag = '/') {
      Uint8Array.prototype.slice = Array.prototype.slice;
      const columns = header.map(h => {
        const [
          label = ''
          // prop = ''
        ] = h.split(splitTag);
        return {
          label,
          prop: 'discount'
        };
      });
      this.excelColumns = columns;
    },
    setExcelData(
      result = [],
      fileName
      // splitTag = '/'
    ) {
      console.log('result', result);
      console.log('fileName', fileName);
      if (result.length == 0 || result == []) {
        this.$showMsg({
          type: 'error',
          message: this.$t('BUSINESS_MANAGEMENT.DOC_CONTENT_EMPTY')
        });
        this.$set(this.formData, 'discountObjects', []);
        this.$set(this.formData, 'feilUrl', '');
        return;
      }
      if (result.length > 2000) {
        this.$showMsg({
          type: 'error',
          message: this.$t('BUSINESS_MANAGEMENT.DOC_MAX_ITEM')
        });
        this.$set(this.formData, 'discountObjects', []);
        this.$set(this.formData, 'feilUrl', '');
        return;
      }
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
      if (result.isRepeat()) {
        this.$showMsg({
          type: 'error',
          message: this.$t('BUSINESS_MANAGEMENT.CSTM_NO_REPEAT')
        });
        this.$set(this.formData, 'discountObjects', []);
        this.$set(this.formData, 'feilUrl', '');
        return;
      }
      const dataSource = result.map(item => {
        const newItem = {};
        Object.keys(item).forEach(k => {
          // const [, key] = k.split(splitTag);
          newItem['discountObjectCode'] = item[k];
        });
        return newItem;
      });
      const eptIdx = dataSource.findIndex(item => {
        const { discountObjectCode = '' } = item;
        return (
          !String(discountObjectCode) || !String(discountObjectCode).length
        );
      });
      if (eptIdx > -1) {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
        });
        this.formData.feilUrl = '';
        this.$set(this.formData, 'discountObjects', []);
      } else {
        // 目前白名单只能是数字
        const hasNotValid = dataSource.some(item =>
          isNaN(Number(item.discountObjectCode))
        );
        if (hasNotValid) {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
          });
          this.formData.feilUrl = '';
          this.$set(this.formData, 'discountObjects', []);
        } else {
          this.$showMsg({
            type: 'success',
            message: this.$t('COMMON.UPLOAD_SUCCESS')
          });
          this.formData.feilUrl = fileName;
          this.$set(this.formData, 'discountObjects', dataSource);
        }
      }
    },
    handleCancel() {
      this.$set(this, 'formData', {
        channel: '0',
        discountWay: '1',
        discountMethod: '0',
        discountMoney: '',
        discountStandard: '0',
        activateTimespan: ['', ''],
        discountObjectType: '0',
        discountObjects: [],
        discountDesc: ''
      });
      // clear this page
      this.$store.commit('tabs/DELETE_TABS', '/businessMangament/discount/add');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/businessMangament/discount/edit'
      );
      // add index page
      // this.$store.commit('tabs/ADD_TABS', '/businessMangament/discount');
      this.$store.commit('tabs/ADD_TABS', {
        path: '/businessMangament/discount',
        name: 'BankDiscount',
        meta: {
          title: 'BankDiscount'
        }
      });
      this.$router.push('/businessMangament/discount');
    },
    async handleDownLoad() {
      const result = await downloadTemplate({
        current: '1',
        fileTemplate: '2',
        size: 500
      });
      downloadFile(
        result,
        `${this.$t('MENU_PAGE_ITEMS.BANK_DISCOUNT_TEMPLATE')}.xlsx`,
        'application/x-msdownload'
      );
      // const params = {
      //   title: ['折扣对象号/discountObjectCode'],
      //   key: ['discountObjectCode'],
      //   data: [],
      //   filename: '白名单模板'
      // };
      // exportArrayToExcel(params);
    },
    handleClose() {
      this.formData.feilUrl = '';
      this.$set(this.formData, 'discountObjects', [
        // {
        //   discountObjectCode: '', // 折扣对象编号（机构号、客户号）
        //   objectName: '' // 折扣对象名称 (机构号需要传递名称)
        // }
      ]);
    },
    // handleCheckedOption(value) {
    //   /*
    //     1.判断是否选择"全部" ?
    //       1.1 如果选择"全部", 动态将所有的值付给vm.formData['discountObjects'];
    //       1.2 如果不是"全部", 观察所有的值, 判断是否要选择全部
    //     2. 数据赋值
    //   */
    //   const objList = deepClone(this.objList);
    //   if (value === 'total') {
    //     if (this.dOList.includes('total')) {
    //       this.dOList = objList.map(item => item.value);
    //       this.dOList.push('total');
    //     }
    //     else this.dOList = [];
    //   } else {
    //     const _objList = objList.filter(item => item.value !== 'total');
    //     if (_objList.length === this.dOList.length) {
    //       this.dOList.push('total');
    //     } else {
    //     }
    //   }
    // }
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
    setDiscountObjects() {
      const filterObjectList = this.objList
        .filter(item => this.dOList.includes(item.value))
        .map(item => ({
          discountObjectCode: item.value,
          objectName: item.label
        }));

      this.$set(this.formData, 'discountObjects', filterObjectList);
    },
    onComponentChange(prop = '', ...args) {
      if (prop === 'discountObjectType') {
        this.formData.feilUrl = '';
        this.dOList = [];
        this.$set(this.formData, 'discountObjects', []);
      }
      if (prop === 'discountWay') {
        this.onDiscountWayChange(...args);
      }
      if (prop === 'discountMethod') {
        this.discountMethod = prop;
      }
    },
    handleDisabledComponent(prop) {
      if (['channel', 'discountWay'].includes(prop)) {
        const { type } = this.$route.meta;
        if (type && type === 'edit') {
          return true;
        }
      }
      return false;
    },
    onDiscountWayChange(newVal) {
      switch (newVal) {
        // case '0':
        //   this.setFundMoneyList();
        //   break;
        case '1':
          this.setTtMoneyList();
          break;
        case '2':
          this.setChatsMoneyList();
          break;
        case '3':
          this.setMultiMoneyList();
          break;
        case '4':
          this.setAutoSalaryMoneyList();
          break;
        case '5':
          this.setAutoInjectMoneyList();
          break;
        default:
          break;
      }
    },
    /**
     * fund money-list setting (unsure)
     */
    setFundMoneyList() {
      this.$set(this, 'discountMoneyList', []);
    },
    /**
     * tt-payment money-list setting
     */
    setTtMoneyList() {
      this.$set(this, 'discountMoneyList', [
        {
          discountCcy: 'HKD',
          discountMoney: ''
        }
      ]);
    },
    /**
     * chats-payment money-list setting
     */
    setChatsMoneyList() {
      this.$set(this, 'discountMoneyList', [
        {
          discountCcy: 'HKD',
          discountMoney: ''
        },
        {
          discountCcy: 'USD',
          discountMoney: ''
        },
        {
          discountCcy: 'CNY',
          discountMoney: ''
        },
        {
          discountCcy: 'EUR',
          discountMoney: ''
        }
      ]);
    },
    /**
     * multi-payment money-list setting
     */
    setMultiMoneyList() {
      this.$set(this, 'discountMoneyList', [
        {
          discountCcy: 'HKD',
          discountMoney: ''
        },
        {
          discountCcy: 'CNY',
          discountMoney: ''
        }
      ]);
    },
    setAutoSalaryMoneyList() {
      this.$set(this, 'discountMoneyList', [
        {
          discountCcy: 'HKD',
          discountMoney: ''
        },
        {
          discountCcy: 'CNY',
          discountMoney: ''
        }
      ]);
    },
    /**
     * auto-inject money-list setting
     */
    setAutoInjectMoneyList() {
      this.$set(this, 'discountMoneyList', [
        {
          discountCcy: 'HKD',
          discountMoney: ''
        },
        {
          discountCcy: 'CNY',
          discountMoney: ''
        }
      ]);
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  .g-render-component {
    width: 340px;
    .g-table {
      width: 300px !important;
    }
    &.upload {
      display: inline-block;
      width: 100px;
    }
    &.discount-money {
      display: block;
      margin-bottom: 5px;
    }
  }
  .g-form-component {
    // border: 1px solid rgba(0, 0, 0, 0.05);
    // max-height: 200px;
    // overflow-y: auto;
  }
  .g-file-name {
    display: inline;
    min-width: 160px;
    margin: 0 5px;
    padding: 5px;
  }
  .g-op-btn-wrapper {
    text-align: center;
    margin-top: 40px;
    .g-op-btn {
      width: 210px !important;
    }
  }
  .g-excel-list {
    width: 300px;
    height: 250px;
    margin-top: 10px;
    overflow-y: auto;
    .g-excel-list-header {
      line-height: 1;
    }
    .g-excel-list-text {
      line-height: 1.5;
    }
  }
  .g-select-btn {
    border: 0;
    width: 60px;
    height: 30px;
    margin-left: 10px;
  }
  .g-download-btn {
    color: #4181fa;
    cursor: pointer;
  }
}
p{
  width: 340px;
}
</style>
