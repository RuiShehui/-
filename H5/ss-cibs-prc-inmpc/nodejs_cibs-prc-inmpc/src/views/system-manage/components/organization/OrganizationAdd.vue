<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 10:08:01
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 09:46:39
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\system-manage\components\organization\OrganizationAdd.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <el-form
      :disabled="isSubmit"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="calc(50% - 170px)"
    >
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_CODE_SYMBOL`)" prop="depCode">
        <el-input
          class="g-w-340"
          maxlength="9"
          oninput="value=value.replace(/[^\w\.\/]/ig, '')"
          v-model="ruleForm.depCode"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_NAME_SYMBOL`)" prop="depName">
        <el-input
          class="g-w-340"
          v-model="ruleForm.depName"
          maxlength="100"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_LEVEL_SYMBOL`)" prop="depClazz">
        <el-select
          v-model="ruleForm.depClazz"
          :placeholder="$t(`COMMON.PLEASE_SELECT`)"
          :style="{ width: '340px' }"
        >
          <el-option
            v-for="item in groupTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
          :label="$t(`GROUP_MANAGEMENT.GROUP_STATUS_SYMBOL`)"
          prop="depStatus"
        >
          <el-select
            v-model="ruleForm.depStatus"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectStatus"
          >
            <el-option
              v-for="item in groupStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </el-form-item>-->
      <el-form-item
        v-if="groupDepClazzFlag"
        :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_NAME_SYMBOL`)"
        prop="pDepName"
      >
        <el-select
          v-model="ruleForm.pDepName"
          :placeholder="$t(`COMMON.PLEASE_SELECT`)"
          :style="{ width: '340px' }"
          @change="selectPGroup"
        >
          <el-option
            v-for="item in pGroupList"
            :key="item.depCode"
            :label="item.depName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="groupDepClazzFlag"
        :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_CODE_SYMBOL`)"
        prop="pDepCode"
      >
        <el-select
          :disabled="true"
          v-model="ruleForm.pDepCode"
          :placeholder="$t(`COMMON.PLEASE_SELECT`)"
          :style="{ width: '340px' }"
          @change="selectPGroup"
        >
          <el-option
            v-for="item in pGroupList"
            :key="item.depCode"
            :label="item.depCode"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t(`GROUP_MANAGEMENT.PERSON_SYMBOL`)" prop="linkMan">
        <el-input
          class="g-w-340"
          v-model="ruleForm.linkMan"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="linkPhone"
        :label="$t(`USER_MANAGEMENT.CONTAC_TNUMBER_SYMBOL`)"
        class="phone"
      >
        <el-form-item class="g_from_phone" prop="coreNumber">
          <el-input
            class="g-w-120"
            maxlength="10"
            :disabled="isSubmit"
            v-model="ruleForm.coreNumber"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <div class="g-w-20">-</div>
        <el-form-item prop="liasPhone">
          <el-input
            class="g-w-180"
            :disabled="isSubmit"
            v-model="ruleForm.liasPhone"
            minlength="8"
            maxlength="11"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
            onkeyup="value=value.replace(/[^\d\-]/g, '')"
          ></el-input>
        </el-form-item>
      </el-form-item>
      <!-- <el-form-item :label="$t(`GROUP_MANAGEMENT.PHONE_SYMBOL`)" prop="linkPhone">
          <el-input
          class="g-w-340"
            v-model="ruleForm.linkPhone"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
            onkeyup="value=value.replace(/[^\d]/g, '')"
          ></el-input>
      </el-form-item>-->
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_ADDRESS_SYMBOL`)" prop="depAddress">
        <el-input
          class="g-w-340"
          v-model="ruleForm.depAddress"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_DESCRIBLE_SYMBOL`)" prop="depDescrible">
        <el-input
          class="g-w-340"
          rows="5"
          resize="none"
          type="textarea"
          v-model="ruleForm.depDescrible"
          :style="{ width: '340px', height: '120px' }"
        ></el-input>
      </el-form-item>
    </el-form>

    <footer class="g-btn" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">
        {{
        $t(`COMMON.CANCEL`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="submitForm()">
        {{
        $t(`COMMON.SUBMIT`)
        }}
      </el-button>
    </footer>

    <footer class="g-btn" v-if="isSubmit">
      <el-button class="f-cancel" @click="perviousStep">
        {{
        $t(`COMMON.PREVIOUS_STEP`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="confirm()">
        {{
        $t(`COMMON.CONFIRM`)
        }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import {
  findORGMainListInfo,
  findOrganizationListInfo,
  saveOrganizationInfo
} from '@/api/mechanism/index.js';
export default {
  name: 'OrganizationAdd',
  components: {},
  computed: {
    rules() {
      var validate_Type = (rules, value, callback) => {
        if (this.ruleForm.type == '') {
          callback(new Error(this.$t('message.rule.qxzdhzjlx')));
        }
        callback();
      };
      // var checkLinkPhone = (rules, value, callback) => {
      //   const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      //   if (!value || regPhone.test(value)) {
      //     callback();
      //   } else {
      //     callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      //   }
      // };
      return {
        depCode: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_CODE'),
            trigger: 'blur'
          },
          {
            min: 9,
            max: 9,
            message: this.$t('GROUP_MANAGEMENT.GROUP_CODE_LENGTH_NINE'),
            trigger: 'blur'
          }
        ],
        depName: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_NAME'),
            trigger: 'blur'
          }
        ],
        depClazz: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_LEVEL'),
            trigger: 'blur'
          }
        ],
        depStatus: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_STATUS'),
            trigger: 'blur'
          }
        ],
        pDepCode: [
          {
            required: true,
            message: this.$t(
              'GROUP_MANAGEMENT.PLEASE_INPUT_BELONGING_GROUP_CODE'
            ),
            trigger: 'blur'
          }
        ],
        pDepName: [
          {
            required: true,
            message: this.$t(
              'GROUP_MANAGEMENT.PLEASE_INPUT_BELONGING_GROUP_NAME'
            ),
            trigger: 'blur'
          }
        ],
        // linkMan: [
        //   {
        //     required: true,
        //     message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_PERSON'),
        //     trigger: 'blur'
        //   }
        // ],
        // coreNumber: [
        //   {
        //     required: true,
        //     message: this.$t(
        //       'USER_MANAGEMENT.PLEASE_INPUT_COUNTRY_REGION_NUMBER'
        //     ),
        //     trigger: 'blur'
        //   }
        // ],
        liasPhone: [
          {
            required: false,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_CONTACT_NUMBER'),
            trigger: 'blur'
          },
          {
            min: 8,
            max: 11,
            message: this.$t('USER_MANAGEMENT.USER_PHONE_LENGTH_BETWEENL'),
            trigger: 'blur'
          }
        ],
        // linkPhone: [
        //   // {
        //   //   required: true,
        //   //   message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_PHONE'),
        //   //   trigger: 'blur'
        //   // },
        //   {
        //     required: false,
        //     validator: checkLinkPhone,
        //     message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_CORRECT_PHONE'),
        //     trigger: 'blur'
        //   }
        // ],
        depAddress: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_ADRESS'),
            trigger: 'blur'
          }
        ]
        // depDescrible: [
        //   {
        //     required: this.statusFlag,
        //     message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_DESCRIBLE'),
        //     trigger: 'blur'
        //   }
        // ]
      };
    }
  },
  data() {
    return {
      // statusFlag: false, //机构状态判断描述是否为必填，停用为false，启用为true
      groupDepClazzFlag: true,
      isSubmit: false, //是否提交，false未提交，true已提交
      ruleForm: {
        depCode: '', //机构编号
        depName: '', //机构名称
        depClazz: '', //机构级别
        depStatus: '', //机构状态
        pDepCode: '', //所属机构编号
        pDepName: '', //所属机构
        linkMan: '', //联系人
        linkPhone: '', //联系电话
        depAddress: '', //机构地址
        depDescrible: '', //机构描述
        depDescribleRequir: '', //机构描述
        coreNumber: '', //国家/地区编号
        liasPhone: '' //电话号码
      },
      groupTypeList: [
        //机构级别数组
        {
          value: '0',
          label: '总行',
          disabled: true
        },
        {
          value: '1',
          label: '分行/其他'
        }
        // {
        //   value: '2',
        //   label: '部门'
        // }
      ],
      // groupStatusList: [
      //   //机构状态数组
      //   {
      //     value: '0',
      //     label: '停用'
      //   },
      //   {
      //     value: '1',
      //     label: '启用'
      //   }
      // ],
      pGroupList: [] //机构数组——下拉框
    };
  },
  watch: {},
  created() {},

  mounted() {
    this.loadGroup();
  },

  methods: {
    //提交
    submitForm() {
      if (this.ruleForm.coreNumber && !this.ruleForm.liasPhone) {
        return this.$showMsg.error(
          this.$t('GROUP_MANAGEMENT.AREA_NUMBER_CONTACT_NUMBER')
        );
      }
      if (!this.ruleForm.coreNumber && this.ruleForm.liasPhone) {
        return this.$showMsg.error(
          this.$t('GROUP_MANAGEMENT.AREA_NUMBER_CONTACT_NUMBER')
        );
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isSubmit = true;
          if (this.ruleForm.coreNumber && this.ruleForm.liasPhone) {
            this.ruleForm.linkPhone =
              this.ruleForm.coreNumber + '-' + this.ruleForm.liasPhone;
          } else {
            this.ruleForm.linkPhone = '';
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // let obj = {
      //   url: "/mechanism/add"
      // };
      // this.$router.push({ path: "/mechanism/submit", query: obj });
    },

    //取消
    cancel() {
      this.$emit('backIndex');
    },

    //确认
    confirm(formName) {
      saveOrganizationInfo(this.ruleForm).then(resp => {
        // console.log('打印新增机构', resp);
        if (resp.body) {
          // this.$showMsg.success('操作成功！');
          // this.$showMsg.success(this.$t('GROUP_MANAGEMENT.ADD_GROUP_SUCCESS'));
          this.$showMsg({
            type: 'success',
            message: this.$t('GROUP_MANAGEMENT.ADD_GROUP_SUCCESS')
          });
          this.cancel();
        } else {
          // this.$showMsg.error('操作失败！');
        }
      });
    },

    //上一步
    perviousStep() {
      this.isSubmit = false;
    },
    // //选择机构状态
    // selectStatus(e) {
    //   if (e === '0') {
    //     this.statusFlag = true;
    //   } else {
    //     this.statusFlag = false;
    //   }
    // },
    //选择所属机构
    selectPGroup(e) {
      // console.log('打印机构编号：', e);
      this.ruleForm.pDepName = e.depName;
      this.ruleForm.pDepCode = e.depCode;
    },

    //加载机构
    loadGroup() {
      this.pGroupList = [];
      findOrganizationListInfo().then(resp => {
        if (resp.body) {
          resp.body.forEach(item => {
            if (item.depClazz == '0') {
              this.pGroupList.push(item);
            }
          });
        }
        // console.log('打印过滤后菜单：', this.pGroupList);
      });
    }

    //选择级别
    // selectGroupDepClazz(e) {
    //
    //   if (e === '0') {
    //     this.groupDepClazzFlag = false;
    //   } else {
    //     let groupDepClazz = e - 1;
    //     this.groupDepClazzFlag = true;
    //     this.pGroupList = [];
    //     findOrganizationListInfo().then(resp => {
    //       if (resp.body) {
    //         resp.body.forEach(item => {
    //           if (item.depClazz == groupDepClazz) {
    //             this.pGroupList.push(item);
    //           }
    //         });
    //       }
    //     });
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  // padding: 32px 24px;
  // box-sizing: border-box;
  // min-width: 600px;
  // background: #fff;
  // min-height: 100%;
  .g-btn {
    display: flex;
    justify-content: center;
    align-content: center;
    // margin-top: 3.6%;
    padding-bottom: 30px;
    margin-left: 3%;
    button {
      width: 210px;
      height: 40px;
      border-radius: 4px;
      font-size: 18px;
      text-align: center;
      border-color: #f06b00;
    }
    .f-cancel {
      color: #f06b00;
    }
    .f-confirm {
      background: #f06b00;
      color: #ffffff;
    }
  }
}
.g-w-340 {
  width: 340px;
}
.g-w-180 {
  width: 200px;
}
.g-w-20 {
  display: inline-block;
  text-align: center;
  width: 20px;
}
.g-w-120 {
  width: 120px;
}
.phone {
  ::v-deep .el-form-item__content {
    display: flex;
  }
}
</style>
