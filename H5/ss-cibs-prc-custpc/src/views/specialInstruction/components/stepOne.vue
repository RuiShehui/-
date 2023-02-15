<!--
 * @Author: your name
 * @Date: 2022-10-25 19:26:49
 * @LastEditTime: 2022-11-15 09:19:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\specialInstruction\components\stepOne.vue
-->
<template>
  <div class="u-step">
    <Divider class="d-title" :title="$t('SPECIAL_INSTRUACTION.APPLICATION_INFORMATION')"></Divider>
    <div class="u-materials">
      <el-form
        :model="formData"
        
        class="m-form"
        ref="formData"
        :rules="formDataRules"
      >
        <el-form-item label-width="330px" :label="$t('SPECIAL_INSTRUACTION.ENGLISH_NAME')" prop="englshName">
          <el-input maxlength="65" v-model="formData.englshName"></el-input>
        </el-form-item>
        
          <el-row class="u-rowStyle">
            <el-form-item class="area" label-width="330px" :label="$t('SPECIAL_INSTRUACTION.MOBILE_PHONE_NUMBER')" prop="areaCode">
            <el-input
              class="u-input1"
              maxlength="4"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              v-model="formData.areaCode"
            ></el-input>
             </el-form-item>
            <div class="u-line">-</div>
            <el-form-item prop="mobileNumber">
            <el-input
              class="u-input3"
              mixlength="8"
              maxlength="15"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              v-model="formData.mobileNumber"
              
            ></el-input>
            </el-form-item>
          </el-row>
        
        <el-form-item label-width="330px" :label="$t('SPECIAL_INSTRUACTION.EMAIL')" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <p class="u-tips">
          <span>{{$t('SPECIAL_INSTRUACTION.NOTE')}}</span>
          <span>{{$t('SPECIAL_INSTRUACTION.AFTER_SUBMITTING')}}</span>
        </p>
        <div>
          <span style="color:red">*</span>
          <el-checkbox
            el-checkbox
            label="presonalData"
            v-model="formData.presonalData"
            name="presonalData"
          >
            <span>{{$t('SPECIAL_INSTRUACTION.READ')}}</span>
            <span
              class="u-here"
              @click="jumpPdf"
            >{{$t('SPECIAL_INSTRUACTION.PERSONAL_INFORMATION')}}</span>
            <span>{{$t('SPECIAL_INSTRUACTION.AND')}}</span>
            <span
              class="u-here"
              @click="importantInformation"
            >{{$t('SPECIAL_INSTRUACTION.DISCLAIMER')}}</span>
          </el-checkbox>
        </div>
      </el-form>
    </div>
    <Divider class="d-title" :title="$t('SPECIAL_INSTRUACTION.DOCUMENT_UPLOAD')"></Divider>
    <div class="u-upload">
      <p>{{$t('SPECIAL_INSTRUACTION.UPLOAD_DOCUMENT')}}</p>
      <ul>
        <li>{{$t('SPECIAL_INSTRUACTION.FILE_FORMAT')}}</li>
        <li>{{$t('SPECIAL_INSTRUACTION.MAXIMUN_SIZE')}}</li>
        <li>{{$t('SPECIAL_INSTRUACTION.MAXIMUN_UPLOAD')}}</li>
        <li>{{$t('SPECIAL_INSTRUACTION.FILE_NALE')}}</li>
        <!-- <li>{{$t('SPECIAL_INSTRUACTION.APPLICATION_FROM')}}</li> -->
      </ul>
    </div>
    <div class="u-tables">
      <el-form ref="formTableData" :model="formData" class="m-table" :rules="formDataRules">
        <el-table :data="formData.uploadFile" stripe class="u-table">
          <el-table-column :label="$t('SPECIAL_INSTRUACTION.REQUIRED_SERVICE')">
            <template slot-scope="scope">
              <el-form-item
                :prop="'uploadFile.' + scope.$index + '.fileType'"
                :rules="formDataRules.fileType"
              >
                <el-select
                  v-model="scope.row.fileType"
                  :filterable="true"
                  :placeholder="$t('TRANSFR_INFO.SELECT')"
                  class="u-sel"
                  @change="selectBank($event, scope.$index)"
                  transfer="true"
                >
                  <el-option
                    v-for="item in tableData"
                    :label="item.service"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column :label="$t('SPECIAL_INSTRUACTION.SELECT_FILE')">
            <template slot-scope="scope">
              <el-form-item
                :prop="'uploadFile.' + scope.$index + '.originalFilename'"
                class="table-upload"
                :rules="formDataRules.originalFilename"
              >
                <el-input :disabled="true" v-model="scope.row.originalFilename"></el-input>
                <el-upload
                  class="g-upload-btn"
                  ref="upload"
                  :action="uploadUrl"
                  :multiple="false"
                  :show-file-list="false"
                  :limit="4"
                  accept=".PNG, .JEPG, .PDF"
                  :before-upload="(file)=>{handleUploadFile(file,scope.$index)}"
                  :on-change="(res,file,fileList)=>{
                    handlePreview(res,file,fileList,scope.$index)
                  }
                  "
                  :on-success="(res,file,fileList)=>{
                    upSuccess(res,file,fileList,scope.$index)
                  }"
                  :file-list="fileTableData"
                  :http-request="(file)=>{handleUploadFile2(file,scope.$index)}"
                >
                  <el-button class="up-btn">
                    <span>{{$t('SPECIAL_INSTRUACTION.BROWSE')}}</span>
                  </el-button>
                </el-upload>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t('TRANSFR_INFO.PROLOT')" align="center" width="100">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button @click="del(scope.row, scope.$index)" type="text">{{$t('COMMON.DELETE')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="u-btn" v-show="showTable">
        <v-button
          size="wMin210"
          type="primary"
          class="mr16"
          @click="addTable"
        >{{$t('SPECIAL_INSTRUACTION.add')}}</v-button>
      </div>
      <div v-show="showTables">
        <el-button class="u-adduser" @click="addTable">+ {{$t('SPECIAL_INSTRUACTION.add')}}</el-button>
      </div>
    </div>
    <div class="u-title" style="margin-top:36px;">
      <p>{{$t('SPECIAL_INSTRUACTION.INTERESTED_TOAPPLY')}}</p>

      
    </div>
    <div class="u-tables">
      <el-table :data="tableData" stripe>
        <el-table-column :label="$t('SPECIAL_INSTRUACTION.REQUIRED_SERVICE')" prop="service"></el-table-column>
        <el-table-column :label="$t('SPECIAL_INSTRUACTION.SERVICE_DESCRIPTION')" prop="content"></el-table-column>
      </el-table>
     
    </div>
    <div class="u-importantTips">
      <p>{{$t('SPECIAL_INSTRUACTION.IMPORTANT')}}</p>
      <ul>
        <li v-for="item in liList" :key="item.value">
          {{item.label}}
          <span
            class="u-here"
            @click="jump(item.value)"
          >{{$t('SPECIAL_INSTRUACTION.HERE')}}</span>
        </li>
        <p style="margin-top:8px">5.{{$t('SPECIAL_INSTRUACTION.RMUSER_NAME')}}</p>
        <p style="margin-top:8px">6.{{$t('SPECIAL_INSTRUACTION.SACN_THE_COMPLETED')}}</p>
      </ul>
    </div>
    <div class="u-btn">
      <v-button size="wMin210" type="primary" @click="next">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </div>
  </div>
</template>

<script>
import fileTools from '@/dataTools/tools/fileTools.js';
import excelUtils from '@/utils/transform-excel';
import CryptoJS from 'crypto-js';
import { uploadFiles } from '@/api/cashManage';
import { createNamespacedHelpers } from 'vuex';
function ckeckTableDataItem(list = []) {
  let errMsg = '';
  const hasIlegal = list.find((item, index) => {
    if (!item.authorNum.length) {
      errMsg = `${this.$t('TRANSFR_INFO.PLASE_IPUT')}${index + 1}${this.$t(
        'TRANSFR_INFO.PAU_XIANACCOUNT'
      )}`;
      return true;
    }
    return false;
  });
  if (hasIlegal) {
    return errMsg;
  }
  return '';
}
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
export default {
  data() {
    var checkEmail = (rules, value, callback) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
      if (regEmail.test(value)) {
        callback();
      } else {
        return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      }
    };
    var checkMobileNo = (rule, value, callback) => {
      console.log(value,'formData')
      let reg = /^\d{8,15}$/;
      // let mobileNo = this.$refs.mobileNo.value;
      if (reg.test(value)) {
        console.log(1)
        callback();
      } else {
        console.log(2)
       callback(
            this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_COUNTRY')
            })
          );
      }
    };
    var checkArea = (rule,value,callback)=>{
      if(value!=='852'){
        return callback(new Error("暫不支持中國內地及海外手提電話號碼"));
      }
    }
    return {
      tableData: [
        {
          service: this.$t('SPECIAL_INSTRUACTION.TWO_SERVCIE_SETTING'),
          content: this.$t('SPECIAL_INSTRUACTION.ACTIVATE'),
          value: '0'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.BENEFICIARY_SETTING'),
          content: this.$t('SPECIAL_INSTRUACTION.TELEGRAPHIC_TRANSFER'),
          value: '1'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.LIMIT_SETTING'),
          content: this.$t('SPECIAL_INSTRUACTION.CHANGE_TRANSACTION'),
          value: '2'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.LOAN_REPAYMENT'),
          content: this.$t('SPECIAL_INSTRUACTION.LOAN_REPAYMENTS'),
          value: '3'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.MANAGED_DIRECTIVES'),
          content: this.$t('SPECIAL_INSTRUACTION.MANAGED_DIRECTIVES'),
          value: '4'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.SAME_NAME'),
          content: this.$t('SPECIAL_INSTRUACTION.SAME_NAMES'),
          value: '5'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.FUND_TRANSFER'),
          content: this.$t('SPECIAL_INSTRUACTION.FUND_TRANSFER'),
          value: '6'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.LOAN_WITHDRAWAL'),
          content: this.$t('SPECIAL_INSTRUACTION.LOAN_WITHDRAWAL'),
          value: '7'
        },
        {
          service: this.$t('SPECIAL_INSTRUACTION.OTHERS'),
          content: this.$t('SPECIAL_INSTRUACTION.OTHERS'),
          value: '8'
        }
      ],
      formData: {
        englshName: '',
        mobileNumber: '',
        email: '',
        areaCode: '',
        presonalData: false,
        tableData: [{}],
        uploadFile: [{}]
      },
      formDataRules: {
        englshName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.ENGLISH_NAME')
            }),
            trigger: 'blur'
          }
        ],
        areaCode:[
          {
            required: true,
            message:this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.COUNTRY_NUMBER')
            }),
            trigger: 'blur'
          },
          // {
          //   required: true,
          //   validator: checkArea,
          //   message: "暫不支持中國內地及海外手提電話號碼"
          // }
        ],
        mobileNumber: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.MOBILE_PHONE_NUMBER')
            }),
            trigger: 'blur'
          },
          {
            required: true,
            validator: checkMobileNo,
            message: this.$t('SPECIAL_INSTRUACTION.VALIDATE_PHONE'),
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.EMAIL')
            }),
            trigger: 'blur'
          },
          {
            required: true,
            validator: checkEmail,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.EMAIL')
            })
          }
        ],
        payBank: [
          {
            required: true,
            message:this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.EMAIL')
            }),
            trigger: 'blur'
          }
        ],
        // presonalData: [
        //   {
        //     required: true,
        //     message: '请勾选收集个人资料声明和重要声明',
        //     trigger: 'change'
        //   }
        // ],
        fileType: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.REQUIRED_SERVICE')
            }),
            trigger: 'change'
          }
        ],
        originalFilename: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('SPECIAL_INSTRUACTION.SELECT_FILE')
            }),
            trigger: 'blur'
          }
        ],
        uploadFile: {
          required: true,
          validator: (rule, value, callback) => {
            const errorMessage = ckeckTableDataItem(value);
            !errorMessage.length
              ? callback()
              : callback(new Error(errorMessage));
          }
        }
      },
      showTable: true,
      showTables: false,
      uploadUrl: '/api',
      formData1: {
        totalMoney: 0,
        allsum: 0
      },
      fileTableData: [],
      fileTableDatas: [],
      fileName: '',
      result: '',
      liList: [
        {
          value: '0',
          label: this.$t('SPECIAL_INSTRUACTION.SERCURITY_SERVICE')
        },
        {
          value: '1',
          label: this.$t('SPECIAL_INSTRUACTION.BANK_DISCLAMER')
        },
        {
          value: '2',
          label: this.$t('SPECIAL_INSTRUACTION.BANK_PERSONALINFORMATION')
        },
        {
          value: '3',
          label: this.$t('SPECIAL_INSTRUACTION.BANK_PRIVCK')
        }
      ]
    };
  },
  created() {
    this.SET_LANG();
  },
  computed: {
    ...mapState(['lang'])
  },

  methods: {
    ...mapActions(['SET_LANG']),
    selectBank(row, index) {
      console.log(index, 'index');
      this.service = row;
    },
    addTable() {
      if (this.formData.uploadFile.length < 3) {
        let obj = {
          fileType: '', //所需服务
          originalFilename: '' // 选取档案
        };
        this.formData.uploadFile.push(obj);
        this.showTables = true;
        this.showTable = false;
      } else {
        // '最近多添加50条'
        this.msgFun('warn', '最多上载3个档案');
      }
    },
    async handleUploadFile(file, index) {
      let isLt2k = file.size / 1024 / 1024 < 5;
      if (!isLt2k) {
        // '文件大小不能超过5M'
        this.msgFun('warning', this.$t('TRANSFR_INFO.FILE_BIG'));
        return;
      }

      const acceptList = [
        'JPG',
        'PDF',
        'GIF',
        'PNG',
        'jpg',
        'pdf',
        'gif',
        'png'
      ];
      this.index = index;
      let fileNames = file.name.split('.')[0];
      if (/[!@#$%^&]$/i.test(fileNames)) {
        // '文件大小不能超过5M'
        this.$set(this.formData.uploadFile[index], 'originalFilename', '');
        // this.msgFun('warning', '文件名不能包含特殊字符');
        return;
      }

      console.log(fileNames, 'filefilefilefilefilefile');
      if (file) {
        const fileName = file.name,
          fileType = fileName.split('.')[fileName.split('.').length - 1];
        this.fileName = fileName;
        // console.log(this.fileName,'row')

        if (acceptList.includes(fileType)) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = e => {
            const data = e.target.result;

            this.result = data;
            // if (messageErr) {
            //   this.msgFun('error', messageErr);
            // }
          };
        } else {
          // '上传文件格式错误'
          this.msgFun('warning', this.$t('TRANSFR_INFO.WARNING_WAY'));
          this.$set(this.formData.uploadFile[index], 'originalFilename', '');
        }
      }
      return false;
    },
    async handleUploadFile2(item, index) {
      return new Promise(async (resolve, reject) => {
        // console.log('测试是否能提交代码11', fileList);
        let formData = new FormData();
        let fileContent = await fileTools.fileToDataURL(item.file);
        // console.log("fileContent",fileContent);
        let nFile = item.file;
        // console.log("fileContent",fileContent);
        // let blob = await fileTools.dataURLtoBlob(fileContent);
        let contentMD5 = CryptoJS.MD5(fileContent.split(',')[1]).toString();
        // let fileContent = fileTools.fileToDataURL(nFile);
        formData.filename = this.fileName;
        formData.md5 = contentMD5;
        formData.scenarioCode = 'SPECIAL_INSTRUCTION';
        formData.fileType = this.fileName.split('.')[
          this.fileName.split('.').length - 1
        ];
        formData.type = 'SPECIAL_INSTRUCTION'; // BATCH_PAYOFF
        formData.content = fileContent.split(',')[1];

        this.loading3 = true;
        uploadFiles(formData)
          .then(res => {
            console.log('res---->handleUploadFile2', nFile);
            // this.fileName = res.originalFilename;
            this.formData.fileId = res.refNum;
            this.loading3 = false;
            if (res.refNum) {
              this.refNum = res.refNum;
              this.$set(this.formData.uploadFile[index], 'refNum', res.refNum);
            }
          })
          .catch(err => {
            console.log(err);
            this.$refs.upload.clearFiles();
            this.fileName = '';
            this.formData.fileId = '';
            this.formData1.allsum = 0;
            this.formData1.totalMoney = 0;
          });
      });
    },
    handlePreview(response, file, fileList, index) {
      console.log(fileList, 'fileListsssssss');
      console.log(file, 'filessssss');
      console.log(response, 'response');
      console.log(index, 'indexsssssss');
      this.$set(
        this.formData.uploadFile[index],
        'originalFilename',
        response.name
      );
    },
    getUploadList() {
      if (this.formData.uploadFile.length == 1) {
        this.formData.uploadFile.forEach(item => {
          item.originalFilename = this.fileName;
          item.refNum = this.refNum;
        });
      } 
    },
    upSuccess(response, file, fileList, index) {
      console.log('成功回调');
      this.$refs.upload.clearFiles();
      // console.log('response', response);
      if (response.status == 200) {
        this.msgFun('success', response.message);
        console.log(response, file, fileList, index);
        // this.formData.uploadFile
      } else {
        this.msgFun('error', response.message);
      }
    },
    del(row, index) {
      console.log('删除的行数', row, index);
      this.formData.uploadFile.splice(index, 1);
      // this.$refs.fileTableData.validate();
    },
    msgFun(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },
    next() {
      // // this.formData.uploadFile = this.fileTableData;
      console.log(this.formData, 'fomData');
      if (!this.formData.presonalData) {
       
        this.$message({
          type: 'fail',
          message:this.$t('SPECIAL_INSTRUACTION.MUST_CONFIRM'),
          delay: 3000
        });
        return
      }
      if(this.formData.uploadFile.length == 0){
        this.$message({
          type: 'fail',
          message:this.$t('SPECIAL_INSTRUACTION.LEST_FILE'),
          delay: 3000
        });
        return
      }
       this.$refs['formData'].validate(vaild => {
         console.log(vaild,'vaild')
          if (vaild) {
            this.$refs['formTableData'].validate(vailds=>{
              console.log(vailds,'vailds')
              if(vailds){
                this.$emit('next', this.formData);
              }
            })
            // 
          }
        });
    },
    jump(index) {
      console.log(index, 'index');
      let lang = '';
      if (this.lang == 'zh-CN') {
        lang = 'sc';
      } else if (this.lang == 'zh-HK') {
        lang = 'tc';
      } else {
        lang = 'en';
      }
      console.log(lang, 'index,tc,en,sc');
      console.log(this.lang, 'index,tc,en,sc');
      switch (index) {
        case '0':
          return window.open(
            `http://www.chbank.com/${lang}/personal/digital-services/internet-banking/security/index.shtml`
          );
        case '1':
          return window.open(
            `http://www.chbank.com/${lang}/personal/footer/others/disclaimer/index.shtml`
          );
        case '2':
          return window.open(
            `http://www.chbank.com/${lang}/personal/footer/others/privacy-policy/pics.shtml`
          );
        case '3':
          return window.open(
            `http://www.chbank.com/${lang}/personal/footer/others/privacy-policy/pps.shtml`
          );
      }
    },
    jumpPdf() {
      // http://www.chbank.com/sc/personal/footer/others/privacy-policy/pics.shtml
      let lang = '';
      if (this.lang == 'zh-CN') {
        lang = 'sc';
      } else if (this.lang == 'zh-HK') {
        lang = 'tc';
      } else {
        lang = 'en';
      }
      window.open(
        `http://www.chbank.com/${lang}/personal/footer/others/privacy-policy/pics.shtml`
      );
    },
    importantInformation() {
      let lang = '';
      if (this.lang == 'zh-CN') {
        lang = 'sc';
      } else if (this.lang == 'zh-HK') {
        lang = 'tc';
      } else {
        lang = 'en';
      }
      // http://www.chbank.com/sc/personal/footer/others/disclaimer/index.shtml
      window.open(
        `http://www.chbank.com/${lang}/personal/footer/others/disclaimer/index.shtml`
      );
    },
   
  }
};
</script>

<style lang="scss" scoped>
.u-step {
  font-size: 14px;
  .u-title {
    text-indent: 2em;

    text-emphasis: 2em;
  }
  .u-tables {
    margin-top: 16px;
    p {
      margin-top: 8px;
      font-size: 14px;
      text-emphasis: 2em;
    }
  }
  .d-title {
    margin-top: 24px;
  }
}
.u-materials {
  .m-form {
    margin-top: 22px;
    margin-left: 4%;
  }
  .u-tips {
    width: 490px;
    margin-left: 330px;
    font-size: 14px;
    span {
      color: red;
    }
  }
}
::v-deep .u-rowStyle {
  width: 320px;
  display: flex;
  .u-input1 {
    width: 80px !important;
  }

  .u-input3 {
    width: 130px !important;
    display: inline-table;
  }
  .u-line {
    margin: 6px 6px;
  }
}
.u-upload {
  padding: 15px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  margin: 10px 0 20px;
  p {
    margin-bottom: 25px;
  }
  ul {
    padding-left: 20px;
    li {
      line-height: 25px;
    }
  }
}
.u-btn {
  margin-left: 38%;
  margin-top: 36px;
}
.u-adduser {
  margin-top: 6px;
  width: 100%;
  border: 1px dashed #f06b00;
  color: #f06b00;
}
.up-btn {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 14px;
  }
  span {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    margin-left: 6px;
  }
  &:hover {
    background-image: linear-gradient(90deg, #ffc32b 0%, #fc8f28 100%);
    border: none;
    span {
      color: #fff !important;
    }
  }
}
.u-importantTips {
  margin-top: 24px;
  ul {
    li {
      margin-top: 8px;
    }
  }
}
::v-deep .table-upload .el-form-item__content {
  display: flex;
}
.u-here {
  color: #00f;
  text-decoration: underline;
  cursor: pointer;
}
.area ::v-deep .el-form-item__error{
  width: 320px;
  padding-top:20px;
}
::v-deep .el-form-item__error{
  width: 320px;
 
}
</style>