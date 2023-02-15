<!-- 资料信息 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.INFORMATION') }}</div>
    </div>
    <template v-if="acctOpen">
      <div class="row">
        <div>{{ $t('RAO_CHECK.CARD_FRONT') }}</div>
        <div class="img-btn-layout">
          <template  v-if="fileInfos.certImgFront">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+certImgFrontInfo.file"
              :preview-src-list="certImgFrontList"
              >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('certImgFront', certImgFrontInfo, $t('RAO_CHECK.CARD_FRONT'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CARD_REVERSE') }}</div>
        <div class="img-btn-layout">
          <template  v-if="fileInfos.certImgBack">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+certImgBackInfo.file"
              :preview-src-list="certImgBackList"
              >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('certImgBack', certImgBackInfo, $t('RAO_CHECK.CARD_REVERSE'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.FACE_FRONT') }}</div>
        <div class="img-btn-layout">
          <template v-if="fileInfos.selfIeImg">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+selfIeImgInfo.file"
              :preview-src-list="selfIeImgList"
              >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('selfIeImg', selfIeImgInfo, $t('RAO_CHECK.FACE_FRONT'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.FACE_CLOSE_EYES') }}</div>
        <div class="img-btn-layout">
          <template v-if="fileInfos.selfIeImgClosedEye">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+selfIeImgClosedEyeInfo.file"
              :preview-src-list="selfIeImgClosedEyeList"
              >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('selfIeImgClosedEye', selfIeImgClosedEyeInfo, $t('RAO_CHECK.FACE_CLOSE_EYES'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div>
      <!-- <div class="row">
        <div>{{ $t('RAO_CHECK.CARD_NO_BG_FRONT') }}</div>
        <div class="img-btn-layout">
          <template v-if="fileInfos.certImgFrontCropped">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+certImgFrontCroppedInfo.file"
              :preview-src-list="certImgFrontCroppedList"
              >
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('certImgFrontCropped', certImgFrontCroppedInfo, $t('RAO_CHECK.CARD_NO_BG_FRONT'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div> -->
      <!-- <div class="row">
        <div>{{ $t('RAO_CHECK.CARD_NO_BG_BACK') }}</div>
        <div class="img-btn-layout">
          <template v-if="fileInfos.certImgBackCropped">
            <el-image
              style="width:200px;min-height:100px;"
              :src="'data:image/png;base64,'+certImgBackCroppedInfo.file"
              :preview-src-list="certImgBackCroppedList"
              >
            </el-image>
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('certImgBackCropped', certImgBackCroppedInfo, $t('RAO_CHECK.CARD_NO_BG_BACK'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </template>
        </div>
      </div> -->
    </template>
    <template v-if="eiaoOpen">
      <!-- 地址证明 -->
      <div>
        <table>
          <tr>
            <td class="td1">{{ $t('RAO_CHECK.ADRESS_PROOF') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <template v-if="fileInfos.eiaoAddressSeq">
                  <el-image
                    style="width:200px;min-height:100px;"
                    :src="'data:image/png;base64,'+eiaoAddressSeqInfo.file"
                    :preview-src-list="eiaoAddressSeqList"
                    >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <div class="m-l-16">
                    <el-button 
                      class="g-upload-btn" 
                      @click="downLoadImage('eiaoAddressSeq', eiaoAddressSeqInfo, $t('RAO_CHECK.ADRESS_PROOF'))">
                      {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                  </div>
                </template>
              </div>
            </td>
            <td class="td3" v-if="operateType === 'investment' && pcsdOperate">
              <template v-if="addFileStatus === '0'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.FURTHER_INFO') }}</el-button></div>
              </template>
              <template v-if="addFileStatus === '1'">
                <div><el-button class="g-upload-btn" @click="furtherInfo('Y')">{{ $t('RAO_CHECK.CANCEL_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.WAIT_FURTHER') }}</div>
              </template>
              <template v-if="addFileStatus === '2'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.CONTINUE_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.SUBMIT_WAIT_CHECK') }}</div>
              </template>
            </td>
          </tr>
        </table>
      </div>
      <!-- 补充的地址证明 -->
      <div v-if="addFileStatus === '2' && showNewInfo">
        <table>
          <tr>
            <td class="td1">{{ $t('RAO_CHECK.ADRESS_PROOF_SUP') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+newEiaoAddressSeqInfo.file"
                  :preview-src-list="newEiaoAddressSeqList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button 
                    class="g-upload-btn" 
                    @click="downLoadImage('newEiaoAddressSeq', newEiaoAddressSeqInfo, $t('RAO_CHECK.ADRESS_PROOF_SUP'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
            <td class="td3"  v-if="operateType === 'investment'">
              <el-button @click="checkChange" class="g-upload-btn">{{ $t('RAO_CHECK.CHECK_AND_CHANGE') }}</el-button>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="acctOpen">
      <!-- 辅助证件 identityType !== 'HKPID'-->
      <div>
        <table>
          <tr v-if="supportingType === 'PP'">
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_PASSPORT') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+passportInfo.file"
                  :preview-src-list="passportList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <input type="file" v-show="false" ref="fileRef" @change="fileChange">
                <div class="m-l-16">
                  <el-button class="g-upload-btn" :dashed="true" @click="clickUploadFile('PP')" v-if="infoConfirmShow">
                    <i :class="['el-icon-plus', 'g-upload-icon']">
                      {{ $t('COMMON.UPLOAD') }}
                    </i>
                  </el-button>
                  <el-button
                    class="g-upload-btn"
                    @click="downLoadImage('passport', passportInfo, $t('RAO_CHECK.ASSIST_CARD_PASSPORT'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
            <td class="td3" :rowspan="1" v-if="operateType === 'check' && makerOperate">
              <template v-if="addFileStatus === '0'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.FURTHER_INFO') }}</el-button></div>
              </template>
              <template v-if="addFileStatus === '1'">
                <div><el-button class="g-upload-btn" @click="furtherInfo('Y')">{{ $t('RAO_CHECK.CANCEL_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.WAIT_FURTHER') }}</div>
              </template>
              <template v-if="addFileStatus === '2'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.CONTINUE_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.SUBMIT_WAIT_CHECK') }}</div>
              </template>
            </td>
          </tr>
          <tr v-if="supportingType === 'HKMAC'">
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_FRONT') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+eepPositiveInfo.file"
                  :preview-src-list="eepPositiveList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button class="g-upload-btn" :dashed="true" @click="clickUploadFile('HM-FRON')" v-if="infoConfirmShow">
                    <i :class="['el-icon-plus', 'g-upload-icon']">
                      {{ $t('COMMON.UPLOAD') }}
                    </i>
                  </el-button>
                  <el-button
                    class="g-upload-btn"
                    @click="downLoadImage('eepPositive', eepPositiveInfo, $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_FRONT'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
            <td class="td3" :rowspan="2" v-if="operateType === 'check' && makerOperate">
              <template v-if="addFileStatus === '0'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.FURTHER_INFO') }}</el-button></div>
              </template>
              <template v-if="addFileStatus === '1'">
                <div><el-button class="g-upload-btn" @click="furtherInfo('Y')">{{ $t('RAO_CHECK.CANCEL_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.WAIT_FURTHER') }}</div>
              </template>
              <template v-if="addFileStatus === '2'">
                <div><el-button class="g-upload-btn" @click="furtherInfo()">{{ $t('RAO_CHECK.CONTINUE_FURTHER') }}</el-button></div>
                <div class="m-t-16">{{ $t('RAO_CHECK.SUBMIT_WAIT_CHECK') }}</div>
              </template>
            </td>
          </tr>
          <tr v-if="supportingType === 'HKMAC'">
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_BACK') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+eepSidoInfo.file"
                  :preview-src-list="eepSidoList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button class="g-upload-btn" :dashed="true" @click="clickUploadFile('HM-BACK')" v-if="infoConfirmShow">
                    <i :class="['el-icon-plus', 'g-upload-icon']">
                      {{ $t('COMMON.UPLOAD') }}
                    </i>
                  </el-button>
                  <el-button 
                    class="g-upload-btn" 
                    @click="downLoadImage('eepSido', eepSidoInfo, $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_BACK'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <!-- 补充的辅助证件-护照 -->
      <div v-if="fileInfos.newPassport && addFileStatus === '2' && showNewInfo">
        <table>
          <tr>
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_PASSPORT_SUP') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+newPassportInfo.file"
                  :preview-src-list="newPassportList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button
                    class="g-upload-btn"
                    @click="downLoadImage('newPassport', newPassportInfo, $t('RAO_CHECK.ASSIST_CARD_PASSPORT_SUP'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
            <td class="td3" v-if="operateType === 'check' && makerOperate">
              <el-button class="g-upload-btn" @click="checkChange" :disabled="btnDisabled">{{ $t('RAO_CHECK.CHECK_AND_CHANGE') }}</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 补充的辅助证件-港澳通行证 -->
      <div v-if="fileInfos.newEepPositive && addFileStatus === '2' && showNewInfo">
        <table>
          <tr>
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_FRONT_SUP') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+newEepPositiveInfo.file"
                  :preview-src-list="newEepPositiveList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button
                    class="g-upload-btn"
                    @click="downLoadImage('newEepPositive', newEepPositiveInfo, $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_FRONT_SUP'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
            <td class="td3" :rowspan="2"  v-if="operateType === 'check' && makerOperate">
              <el-button class="g-upload-btn" @click="checkChange" :disabled="btnDisabled">{{ $t('RAO_CHECK.CHECK_AND_CHANGE') }}</el-button>
            </td>
          </tr>
          <tr>
            <td class="td1">{{ $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_BACK_SUP') }}</td>
            <td class="td2">
              <div class="img-btn-layout">
                <el-image
                  style="width:200px;min-height:100px;"
                  :src="'data:image/png;base64,'+newEepSidoInfo.file"
                  :preview-src-list="newEepSidoList"
                  >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="m-l-16">
                  <el-button 
                    class="g-upload-btn" 
                    @click="downLoadImage('newEepSido', newEepSidoInfo, $t('RAO_CHECK.ASSIST_CARD_HK_MACAO_BACK_SUP'))">
                    {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    
      <div class="row">
        <div>{{ $t('RAO_CHECK.NAME_CHECK') }}</div>
        <div class="img-btn-layout">
          <div class="w-250">{{ fileCodeInfos.nameCheckFileId }}</div>
          <el-upload
            class="g-render-component upload"
            action="/cibs/inmpc/raoreview/uploadFile"
            :headers="{token: getToken}"
            :multiple="false"
            :show-file-list="false"
            :file-list="nameCheckFileInfo"
            :data="{tradeType: 'NM-CHECK', referenceNumber: referenceNumber, dmsStatusUpdate: dmsStatusUpdateVal}"
            accept=".pdf"
            :before-upload="handleUploadFile"
            :on-success="(res, file, fileList) => { handleUploadFileSuccess(res, file, fileList, 'nameCheckFileId') }"
            :on-error="handleUploadFileError"
          >
            <el-button class="g-upload-btn" :dashed="true" v-if="(operateType === 'check' && makerOperate) || infoConfirmShow">
              <i :class="['el-icon-plus', 'g-upload-icon']">
                {{ $t('COMMON.UPLOAD') }}
              </i>
            </el-button>
          </el-upload>
          <div class="m-l-16" v-if="fileCodeInfos.nameCheckFileId">
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('nameCheckFileId', nameCheckFileInfo, $t('RAO_CHECK.NAME_CHECK'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.E_CARA') }}</div>
        <div class="img-btn-layout">
          <div class="w-250">{{ fileCodeInfos.ecaraFileId }}</div>
          <el-upload
            class="g-render-component upload"
            action="/cibs/inmpc/raoreview/uploadFile"
            :headers="{token: getToken}"
            :multiple="false"
            :show-file-list="false"
            :file-list="ecaraFileInfo"
            :data="{tradeType: 'ECARA', referenceNumber: referenceNumber, dmsStatusUpdate: dmsStatusUpdateVal}"
            accept=".xlsx, .xls,.pdf,.png,.jpg,.jpeg,.bmp"
            :before-upload="handleUploadFile"
            :on-success="(res, file, fileList) => { handleUploadFileSuccess(res, file, fileList, 'ecaraFileId') }"
            :on-error="handleUploadFileError"
          >
            <el-button class="g-upload-btn" :dashed="true" v-if="(operateType === 'check' && makerOperate) || infoConfirmShow">
              <i :class="['el-icon-plus', 'g-upload-icon']">
                {{ $t('COMMON.UPLOAD') }}
              </i>
            </el-button>
          </el-upload>
          <div class="m-l-16" v-if="fileCodeInfos.ecaraFileId">
            <el-button
              class="g-upload-btn" 
              @click="downLoadImage('ecaraFileId', ecaraFileInfo, $t('RAO_CHECK.E_CARA'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.E_CDD') }}</div>
        <div class="img-btn-layout">
          <div class="w-250">{{ fileCodeInfos.ecddFileId }}</div>
          <el-upload
            class="g-render-component upload"
            action="/cibs/inmpc/raoreview/uploadFile"
            :multiple="false"
            :show-file-list="false"
            :headers="{token: getToken}"
            :data="{tradeType: 'ECDD', referenceNumber: referenceNumber, dmsStatusUpdate: dmsStatusUpdateVal}"
            :file-list="ecddFileInfo"
            :before-upload="handleUploadFile"
            :on-success="(res, file, fileList) => { handleUploadFileSuccess(res, file, fileList, 'ecddFileId') }"
            :on-error="handleUploadFileError"
            accept=".xlsx, .xls"
          >
            <el-button class="g-upload-btn" :dashed="true" v-if="(operateType === 'check' && makerOperate) || infoConfirmShow">
              <i :class="['el-icon-plus', 'g-upload-icon']">
                {{ $t('COMMON.UPLOAD') }}
              </i>
            </el-button>
          </el-upload>
          <div class="m-l-16" v-if="fileCodeInfos.ecddFileId">
            <el-button 
              class="g-upload-btn"
              @click="downLoadImage('ecddFileId', ecddFileInfo, $t('RAO_CHECK.E_CDD'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.ACC_APPLY_TABLE') }}</div>
        <div class="img-btn-layout">
          <div class="w-250">{{ fileCodeInfos.applicationFormId }}</div>
          <el-upload
            v-if="infoConfirmShow"
            class="g-render-component upload"
            action="/cibs/inmpc/raoreview/uploadFile"
            :multiple="false"
            :show-file-list="false"
            :headers="{token: getToken}"
            :data="{tradeType: 'APP-FORM', referenceNumber: referenceNumber, dmsStatusUpdate: dmsStatusUpdateVal}"
            :file-list="applicationFormIdInfo"
            :before-upload="handleUploadFile"
            :on-success="(res, file, fileList) => { handleUploadFileSuccess(res, file, fileList, 'applicationFormId') }"
            :on-error="handleUploadFileError"
            accept=".pdf"
          >
            <el-button class="g-upload-btn" :dashed="true">
              <i :class="['el-icon-plus', 'g-upload-icon']">
                {{ $t('COMMON.UPLOAD') }}
              </i>
            </el-button>
          </el-upload>
          <div class="m-l-16" v-if="fileCodeInfos.applicationFormId">
            <el-button 
              class="g-upload-btn" 
              @click="downLoadImage('applicationFormId', applicationFormIdInfo, $t('RAO_CHECK.ACC_APPLY_TABLE'))">
              {{ $t('RAO_CHECK.DOWNLOAD') }}</el-button>
          </div>
        </div>
      </div>
    </template>
    <div class="row" v-if="operateType === 'confirm' || operateType === 'confirmView'">
      <div>{{ $t('RAO_CHECK.PGEONHOLE_STATUS') }}</div>
      <div class="img-btn-layout">
        <div>{{ dmsStatusVal }}</div>
        <el-button 
          v-if="operateType === 'confirm' && dmsStatusVal !=='Success'"
          class="g-upload-btn" 
          @click="pgeonhole">
          {{ $t('RAO_CHECK.PGEONHOLE') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import excelUtils from '@/utils/transform-excel';
import {
  uploadFile,
  queryFileInfo,
  suppleCertificates
} from '@/api/accountOpening/index'
import {
  checkerUpdateFile,
  archiveByAlone
} from '@/api/accountOpening/accountOpeningCheck'
import {
  eiaoCheckerUpdateFile,
  eiaoSuppleCertificates
} from '@/api/accountOpening/investmentAccountOpeningCheck'
import {
  getToken,
  getRoleDetail
} from '@/utils/user';
import {
  downloadFile
} from '@/utils/tools';
import store from '@/store';
import {
  ShowMessage,
} from '@/plugins';
import CONSTANTS from '@/utils/constant';
const { readXlsx } = excelUtils();
export default {
  name: 'CustomerInformation',
  inject: ['reload'],
  components: {
  },
  props: {
    referenceNumber: {
      type: String,
      default: ''
    }, // 参考编号
    fileInfos: {
      type: Object,
      default: () => {}
    }, // 文件信息
    operateType: {
      type: String,
      default: ''
    }, // 操作类型
    status: {
      type: String,
      default: ''
    }, // 审核状态
    isAddDoc: {
      type: String,
      default: ''
    }, // 是否需要补充文件 0 不需要 1 需要 2 已提交
    identityType: {
      type: String,
      default: ''
    }, // 身份证类型
    supportingType: {
      type: String,
      default: ''
    }, // 辅助证件类型 PP 护照 HKMAC 港澳通行证
    dmsStatus: {
      type: String,
      default: ''
    }, // 归档状态
    checkType: {
      type: String,
      default: ''
    }, // 审核类型 1 普通開戶审核 2 普通開戶查詢 3 eiao審核 4 eiao查詢
  },

  data() {
    return {
      fileCodeInfos: {}, // 文件流水编号
      certImgFrontInfo: {}, // 证件正面信息
      certImgBackInfo: {}, // 证件反面信息
      certImgFrontCroppedInfo: {}, // 证件去背景正面信息
      certImgBackCroppedInfo: {}, // 证件去背景反面信息
      selfIeImgInfo: {}, // 人脸正面信息
      selfIeImgClosedEyeInfo: {}, // 人脸闭眼信息
      passportInfo: {}, // 护照信息
      eepPositiveInfo: {}, // 港澳通行证正面信息
      eepSidoInfo: {}, // 港澳通行证背面信息
      newPassportInfo: {}, // 补充的护照信息
      newEepPositiveInfo: {}, // 补充的港澳通行证正面
      newEepSidoInfo: {}, // 补充的港澳通行证背面
      nameCheckFileInfo: [], // name check信息
      ecaraFileInfo: [], // ecara信息
      ecddFileInfo: [], // ecdd信息
      applicationFormIdInfo: [], // 开户申请表
      eiaoAddressSeqInfo: {}, // 住址证明
      newEiaoAddressSeqInfo: {}, // 补充的住址证明
      certImgFrontList: [], // 证件正面预览列表
      certImgBackList: [], // 证件背面预览列表
      certImgFrontCroppedList: [], // 证件去背景正面预览列表
      certImgBackCroppedList: [], // 证件去背景反面预览列表
      selfIeImgList: [], // 人脸正面预览列表
      selfIeImgClosedEyeList: [], // 人脸闭眼预览列表
      passportList: [], // 护照预览列表
      eepPositiveList: [], // 港澳通行证正面预览列表
      eepSidoList: [], // 港澳通行证背面预览列表
      newPassportList: [], // 补充的护照预览列表
      newEepPositiveList: [], // 补充的港澳通行证正面面预览列表
      newEepSidoList: [], // 补充的港澳通行证背面预览列表
      eiaoAddressSeqList: [], // 住址证明预览列表
      newEiaoAddressSeqList: [], // 补充的住址证明预览列表
      btnDisabled: false, // 审核变更按钮状态
      addFileStatus: this.isAddDoc, // 0 不需要 1 需要 2 已补充
      // dmsStatusVal: '', // 归档状态 Submitted,Success,To be archived,System failure,Manual
      showNewInfo: true, // 判断补充的辅助证件信息显示
    };
  },
  watch: {
    fileInfos() {
      this.fileCodeInfos = this.fileInfos || {};
      this.getImgFileInfo();
    },
    isAddDoc() {
      this.addFileStatus = this.isAddDoc;
    },
  },
  computed: {
    getToken() {
      return getToken()
    },
    // maker的操作
    makerOperate() {
      return ['分行 Maker', '中台 Maker'].includes(getRoleDetail().roleName) &&  this.status === 'Pending for info maker'
    },
    // MCIS 操作
    MCISOperate() {
      return ['MCIS Maker', 'MCIS Checker', 'Amender'].includes(getRoleDetail().roleName) && this.operateType == 'confirm'
    },
    // PCSD的操作
    pcsdOperate() {
      return getRoleDetail().roleName === 'PCSD' &&  this.status === 'Pending for PCSD'
    },
    // 开户
    acctOpen() {
      return this.checkType === '1' || this.checkType === '2'
    },
    // 投资户
    eiaoOpen() {
      return this.checkType === '3' || this.checkType === '4'
    },
    infoConfirmShow() {
      return this.operateType === 'confirm' && ['中台 Checker', '中台 Maker'].includes(getRoleDetail().roleName) || this.MCISOperate
    },
    dmsStatusUpdateVal() {
      return this.operateType === 'confirm' ? 'Y' : 'N'
    },
    // 归档状态
    dmsStatusVal: {
      get() {
        console.log('get', this.dmsStatus)
        return this.dmsStatus
      },
      set(value) {
        console.log('set', value)
        this.dmsStatus = value
      }
    }
  },
  created() {
    // alert(this.operateType)
  },

  mounted() {
  },

  methods: {
    // 下载图片
    async downLoadImage(otp, fileObj, name) {
      // 文件状态是否是FINISHED
      if (fileObj.status && fileObj.status !== 'FINISHED') {
        ShowMessage({
          message: `${this.$t('RAO_CHECK.DOWNLOAD_ERROR')} - ${fileObj.status}`,
          type: 'error',
        });
        return false
      }
      let fileInfo = await this.getDownloadFileInfo(this.fileCodeInfos[otp]) || {}
      let blobType = ''
      if (['xlsx', 'xls'].includes(fileInfo.fileType)) {
        blobType = 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
      } else if (fileInfo.fileType === 'pdf') {
        blobType = 'application/pdf'
      } else {
        blobType = 'image/png'
      }
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
        `${name}-${this.referenceNumber}.${fileInfo.fileType}`,
        blobType
      );
    },
    
    // 获取图片、文件信息
    async getDownloadFileInfo(otp) {
      // otp = '1547143535800451073'
      let params = {
        // refNum: '1537726337271939073',
        refNum: otp,
        scenarioCode: ''
      }
      store.commit('loading/SET_LOADING', false);
      let result = await queryFileInfo(params)
      return result.body || {}
    },
    // 获取所有图片、文件信息
    async getImgFileInfo() {
      if(this.acctOpen) {
        // 證件正面
        this.certImgFrontInfo = this.fileInfos.certImgFront 
          ? await this.getDownloadFileInfo(this.fileInfos.certImgFront)
          : {}
        let certImgFrontPre = this.certImgFrontInfo.file ? 'data:image/png;base64,' + this.certImgFrontInfo.file : '';
        this.certImgFrontList.push(certImgFrontPre)
        // 證件背面
        this.certImgBackInfo = this.fileInfos.certImgBack
          ? await this.getDownloadFileInfo(this.fileInfos.certImgBack)
          : {}
        let certImgBackPre = this.certImgBackInfo.file ? 'data:image/png;base64,' + this.certImgBackInfo.file : '';
        this.certImgBackList.push(certImgBackPre)
        // 证件去背景正面照
        // this.certImgFrontCroppedInfo = this.fileInfos.certImgFrontCropped 
        //   ? await this.getDownloadFileInfo(this.fileInfos.certImgFrontCropped)
        //   : {}
        // let certImgFrontCroppedPre = this.certImgFrontInfo.file ? 'data:image/png;base64,' + this.certImgFrontInfo.file : '';
        // this.certImgFrontCroppedList.push(certImgFrontCroppedPre)
        // // 证件去背景背面照
        // this.certImgBackCroppedInfo = this.fileInfos.certImgBackCropped 
        //   ? await this.getDownloadFileInfo(this.fileInfos.certImgBackCropped)
        //   : {}
        // let certImgBackCroppedPre = this.certImgBackCroppedInfo.file ? 'data:image/png;base64,' + this.certImgBackCroppedInfo.file : ''
        // this.certImgBackCroppedList.push(certImgBackCroppedPre)
        // 人脸正面照 
        this.selfIeImgInfo = this.fileInfos.selfIeImg 
          ? await this.getDownloadFileInfo(this.fileInfos.selfIeImg)
          : {}
        let selfIeImgPre = this.selfIeImgInfo.file ? 'data:image/png;base64,' + this.selfIeImgInfo.file : ''
        this.selfIeImgList.push(selfIeImgPre)
        // 人脸闭眼照
        this.selfIeImgClosedEyeInfo = this.fileInfos.selfIeImgClosedEye 
          ? await this.getDownloadFileInfo(this.fileInfos.selfIeImgClosedEye)
          : {}
        let selfIeImgClosedEyePre = this.selfIeImgClosedEyeInfo.file ? 'data:image/png;base64,' + this.selfIeImgClosedEyeInfo.file : ''
        this.selfIeImgClosedEyeList.push(selfIeImgClosedEyePre)
        // 护照
        this.passportInfo = this.fileInfos.passport
          ? await this.getDownloadFileInfo(this.fileInfos.passport)
          : {}
        let passportPre = this.passportInfo.file ? 'data:image/png;base64,' + this.passportInfo.file : ''
        this.passportList.push(passportPre)
        // 补充的护照
        this.newPassportInfo = this.fileInfos.newPassport
          ? await this.getDownloadFileInfo(this.fileInfos.newPassport)
          : {}
        let newPassportPre = this.newPassportInfo.file ? 'data:image/png;base64,' + this.newPassportInfo.file : ''
        this.newPassportList.push(newPassportPre)
        // 港澳通行证正面
        this.eepPositiveInfo = this.fileInfos.eepPositive
          ? await this.getDownloadFileInfo(this.fileInfos.eepPositive)
          : {}
        let eepPositivePre = 'data:image/png;base64,' + this.eepPositiveInfo.file
        this.eepPositiveList.push(eepPositivePre)
  
        // 补充的港澳通行证正面
        this.newEepPositiveInfo = this.fileInfos.newEepPositive
          ? await this.getDownloadFileInfo(this.fileInfos.newEepPositive)
          : {}
        let newEepPositivePre = this.newEepPositiveInfo.file ? 'data:image/png;base64,' + this.newEepPositiveInfo.file : '';
        this.newEepPositiveList.push(newEepPositivePre)
        // 港澳通行证背面
        this.eepSidoInfo = this.fileInfos.eepSido
          ? await this.getDownloadFileInfo(this.fileInfos.eepSido)
          : {}
        let eepSidoPre = this.eepSidoInfo.file ? 'data:image/png;base64,' + this.eepSidoInfo.file : '';
        this.eepSidoList.push(eepSidoPre)
  
        // 补充的港澳通行证背面
        this.newEepSidoInfo = this.fileInfos.newEepSido
          ? await this.getDownloadFileInfo(this.fileInfos.newEepSido)
          : {}
        let newEepSidoPre = this.newEepSidoInfo.file ? 'data:image/png;base64,' + this.newEepSidoInfo.file : '';
        this.newEepSidoList.push(newEepSidoPre)
        // name check
        // let nameCheckFileIdObj = this.fileInfos.nameCheckFileId
        //   ? await this.getDownloadFileInfo(this.fileInfos.nameCheckFileId)
        //   : {}
        // if (nameCheckFileIdObj.filename) {
        //   this.$set(this.nameCheckFileInfo, 0, {name: nameCheckFileIdObj.filename + '.' + nameCheckFileIdObj.fileType, url: nameCheckFileIdObj.file})
        // }
        // ecara
        // let ecaraObj = this.fileInfos.ecaraFileId
        //   ? await this.getDownloadFileInfo(this.fileInfos.ecaraFileId)
        //   : {}
        // if (ecaraObj.filename) {
        //   this.$set(this.ecaraFileInfo, 0, {name: ecaraObj.filename + '.' + ecaraObj.fileType, url: ecaraObj.file})
        // }
        // // ecdd
        // let ecddObj = this.fileInfos.ecddFileId 
        //   ? await this.getDownloadFileInfo(this.fileInfos.ecddFileId)
        //   : {}
        // if (ecddObj.filename) {
        //   this.$set(this.ecddFileInfo, 0, {name: ecddObj.filename + '.' + ecddObj.fileType, url: ecddObj.file})
        // }
        // // 开户申请表
        // let applicationFormIdObj = this.fileInfos.applicationFormId 
        //   ? await this.getDownloadFileInfo(this.fileInfos.applicationFormId)
        //   : {}
        // if (applicationFormIdObj.filename) {
        //   this.$set(this.applicationFormIdInfo, 0, {name: applicationFormIdObj.filename + '.' + applicationFormIdObj.fileType, url: applicationFormIdObj.file})
        // }
      }
      // 投资户地址证明
      if(this.eiaoOpen) {
        // 住址证明
        this.eiaoAddressSeqInfo = this.fileInfos.eiaoAddressSeq
          ? await this.getDownloadFileInfo(this.fileInfos.eiaoAddressSeq)
          : {}
        let eiaoAddressSeqPre = this.eiaoAddressSeqInfo.file ? 'data:image/png;base64,' + this.eiaoAddressSeqInfo.file : '';
        this.eiaoAddressSeqList.push(eiaoAddressSeqPre)
  
        // 补充的住址证明
        this.newEiaoAddressSeqInfo = this.fileInfos.newEiaoAddressSeq
          ? await this.getDownloadFileInfo(this.fileInfos.newEiaoAddressSeq)
          : {}
        let newEiaoAddressSeqPre = this.newEiaoAddressSeqInfo.file ? 'data:image/png;base64,' + this.newEiaoAddressSeqInfo.file : '';
        this.newEiaoAddressSeqList.push(newEiaoAddressSeqPre)
      }
    },
    // 成功回调
    async handleUploadFileSuccess(res, file, fileList, key) {
      store.commit('loading/SET_LOADING', false);
      if(res.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: this.$t('RAO_CHECK.UPLOAD_SUCCESS')
        });
        this.dmsStatusVal = 'To be archived'
        if(fileList.length > 1) {
          fileList.splice(0, 1)
        }
        this.fileCodeInfos[key] = res.body.refNum
      } else {
        if(key == 'ecaraFileId') {
          this.ecaraFileInfo = []
        } else if (key == 'ecddFileId') {
          this.ecddFileInfo = []
        } else if (key == 'nameCheckFileId') {
          this.nameCheckFileInfo = []
        }
        this.$showMsg({
          type: 'error',
          message: this.$t('RAO_CHECK.UPLOAD_FAIL')
        });
      }
    },
    // 失败回调
    handleUploadFileError(err, file, fileList) {
      store.commit('loading/SET_LOADING', false);
      this.$showMsg({
        type: 'error',
        message: this.$t('RAO_CHECK.UPLOAD_FAIL')
      });
      console.log("handleUploadFileError", err, file, fileList)
    },
    /**
     * 上传操作
     * @param {File} file
     */
    handleUploadFile(file) {
      let fileName = file.name,
        fileType = fileName.split('.')[fileName.split('.').length - 1];
      // if(!['xlsx', 'xls'].includes(fileType)) {
      //   this.$showMsg({
      //     type: 'error',
      //     message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
      //   });
      //   return
      // }store
      store.commit('loading/SET_LOADING', true);
    },
    // 通知补充资料
    async furtherInfo(otp) {
      let params = {
        isCancel: otp === 'Y' ? otp : '',
        referenceNumber: this.referenceNumber
      }
      let result = this.acctOpen
        ? await checkerUpdateFile(params)
        : await eiaoCheckerUpdateFile(params);
      
      
      if(result.body.flog) {
        // this.$showMsg({
        //   type: 'success',
        //   message: '通知成功！'
        // })
        this.addFileStatus = result.body.isAddDoc
        // 补充资料成功
      this.$emit('further-info', result.body.isAddDoc)
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // 审核并变更
    async checkChange() {
      let params = {
        certificatesType: '', // PP(护照) HKMAC(港澳通行证） rao系统前端传入
        eepPositive: '', // 港澳通行证正面流水号 rao系统前端传入
        eepSido: '', // 港澳通行证反面流水号 rao系统前端传入
        passPort: '', // 护照流水号 rao系统前端传入
        referenceNumber: this.referenceNumber, // 开户流水号
        type: '3', // 护照流水号 rao系统前端传入
      }
      let result = this.acctOpen 
        ? await suppleCertificates(params)
        : await eiaoSuppleCertificates(params);
      if(result.body) {
        this.$parent.init()
        // this.$showMsg({
        //   type: 'success',
        //   message: '审核并变更成功'
        // })
        // 开户 辅助证件
        if(this.acctOpen) {
          console.log("supportingType", this.supportingType)
          if(this.supportingType === 'PP') {
            this.fileInfos.passport = this.fileInfos.newPassport;
            // 护照
            this.passportInfo = this.fileInfos.passport
              ? await this.getDownloadFileInfo(this.fileInfos.passport)
              : {}
            let passportPre = this.passportInfo.file ? 'data:image/png;base64,' + this.passportInfo.file : ''
            this.passportList.push(passportPre)
          }
          if(this.supportingType === 'HKMAC') {
            this.fileInfos.eepPositive = this.fileInfos.newEepPositive;
            this.fileInfos.eepSido = this.fileInfos.newEepSido;
            // 港澳通行证正面
            this.eepPositiveInfo = this.fileInfos.eepPositive
              ? await this.getDownloadFileInfo(this.fileInfos.eepPositive)
              : {}
            let eepPositivePre = 'data:image/png;base64,' + this.eepPositiveInfo.file
            this.eepPositiveList.push(eepPositivePre)
            // 港澳通行证背面
            this.eepSidoInfo = this.fileInfos.eepSido
              ? await this.getDownloadFileInfo(this.fileInfos.eepSido)
              : {}
            let eepSidoPre = this.eepSidoInfo.file ? 'data:image/png;base64,' + this.eepSidoInfo.file : '';
            this.eepSidoList.push(eepSidoPre)
          }
        }
        // 投资开户 地址证明
        if(this.eiaoOpen) {
          this.fileInfos.eiaoAddressSeq = this.fileInfos.newEiaoAddressSeq;
          // 护照
          this.eiaoAddressSeqInfo = this.fileInfos.eiaoAddressSeq
            ? await this.getDownloadFileInfo(this.fileInfos.eiaoAddressSeq)
            : {}
          let eiaoAddressSeqPre = this.eiaoAddressSeqInfo.file ? 'data:image/png;base64,' + this.eiaoAddressSeqInfo.file : ''
          this.passportList.push(eiaoAddressSeqPre)
        }
        this.showNewInfo = false
        this.addFileStatus = '0'
      } else {
        this.$showMsg({
          type: 'error',
          message: result.header.returnMessage
        })
      }
    },
    // 确认信息上传文件
    clickUploadFile(key) {
      this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
      this.fileKey = key
    },
    // 确认信息选择文件
    async fileChange(e) {
      let file = e.target.files[0]
      let fileName = file.name,
        fileType = fileName.split('.')[fileName.split('.').length - 1];
      console.log('e.target.files', this.fileKey)
      if(!['png', 'jpeg', 'jpg'].includes(fileType)) {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.UPLOAD_TYPE_ERROR')
        });
        return
      }
      // return
      let formData = new FormData()
      formData.append('file', file)
      formData.append('tradeType', this.fileKey)
      formData.append('dmsStatusUpdate', this.dmsStatusUpdateVal)
      formData.append('referenceNumber', this.referenceNumber)
      let result = await uploadFile(formData)
      if(result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: this.$t('RAO_CHECK.UPLOAD_SUCCESS')
        });
        this.dmsStatusVal = 'To be archived'
        // 护照
        if (this.fileKey === 'PP') {
          // this.newPassportList = []
          this.fileCodeInfos['passport'] = result.body.refNum
          let copyObj = this.fileInfos.passport
            ? await this.getDownloadFileInfo(this.fileInfos.passport)
            : {}
          this.passportInfo = Object.assign({}, copyObj)
          let passportPre = this.passportInfo.file ? 'data:image/png;base64,' + this.passportInfo.file : ''
          this.$set(this.passportList, 0, passportPre)
        }
        // 港澳通行证正面
        if (this.fileKey === 'HM-FRON') {
          this.fileCodeInfos['eepPositive'] = result.body.refNum
          this.copyObj = this.fileInfos.eepPositive
            ? await this.getDownloadFileInfo(this.fileInfos.eepPositive)
            : {}
          this.eepPositiveInfo = Object.assign({}, copyObj)
          let eepPositivePre = 'data:image/png;base64,' + this.eepPositiveInfo.file
          this.$set(this.passportList, 0, eepPositivePre)
        }
        // 港澳通行证背面
        if (this.fileKey === 'HM-BACK') {
          this.fileCodeInfos['eepSido'] = result.body.refNum
          this.copyObj = this.fileInfos.eepSido
            ? await this.getDownloadFileInfo(this.fileInfos.eepSido)
            : {}
          this.eepSidoInfo = Object.assign({}, copyObj)
          let eepSidoPre = this.eepSidoInfo.file ? 'data:image/png;base64,' + this.eepSidoInfo.file : '';
          this.$set(this.passportList, 0, eepSidoPre)
        }
      } else {
        this.$showMsg({
          type: 'error',
          message: this.$t('RAO_CHECK.UPLOAD_FAIL')
        });
      }
    },
    // 歸檔
    async pgeonhole() {
      let params = {
        referenceNumber: this.referenceNumber, // 开户流水号
      }
      let result = await archiveByAlone(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
        this.$parent.init()
      } else {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'success'
        });
        this.$parent.init()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
// .transverse-table {
//   margin-top: 25px;
// }
.g-render-component {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  width: 100%;
  /deep/ .el-icon-close {
  display: none;
}
}
.img-btn-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /deep/ .el-upload-list__item-status-label {
    display: none;
  }
  /deep/ .el-upload-list__item-actions .el-upload-list__item-delete {
    display: none;
  }
  // /deep/ .el-upload--picture-card {
  //   display: none;
  // }
  /deep/ .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 200px;
    min-height: 100px;
    background-color: #f5f7fa;
    color: #909399;
  }
  /deep/ .el-icon-picture-outline:before {
    font-size: 30px;
  }
}
.f-w-340 {
  width: 340px;
}
.m-l-16 {
  margin-left: 16px;
}
.m-t-16 {
  margin-top: 16px;
}
.w-250 {
  width: 250px;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
  color: #606266;
  width: 100%;
  tr {
    td {
      padding: 12px 10px;
      word-break: break-all;
      word-wrap: break-word;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      line-height: 23px;
    }
    .td1 {
      width: 159px;
      background: #f3f6fc;
    }
    .td2 {
    }
    .td3 {
      width: 180px;
    }
  }
  
}
tr th td {
  margin: 0;
  padding: 0;
  min-width: none;
}
</style>
