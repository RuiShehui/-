<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 10:08:01
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 09:46:51
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\system-manage\components\user\UserManageEdit.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <header class="g-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="calc(50% - 170px)">
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_NAME_SYMBOL`)" prop="userName">
          <el-input
            class="g-w-340"
            :disabled="true"
            v-model.trim="ruleForm.userName"
            maxlength="30"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_REALNAME_SYMBOL`)" prop="userRealName">
          <el-input
            class="g-w-340"
            :disabled="true"
            v-model="ruleForm.userRealName"
            maxlength="50"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_STATUS_SYMBOL`)" prop="userStatus">
          <el-select
            :disabled="isSubmit"
            v-model="ruleForm.userStatus"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectStatus"
          >
            <el-option
              v-for="item in userStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t(`USER_MANAGEMENT.USER_ROLE_SYMBOL`)"
          prop="userRoleRLATInfoParamsVOS"
        >
          <el-select
            :disabled="isSubmit"
            multiple
            v-model="ruleForm.userRoleRLATInfoParamsVOS"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="roleChange"
          >
            <el-option
              v-for="item in userRoleList"
              :key="item.roleCode"
              :label="item.roleName"
              :value="item.roleCode"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_NAME_SYMBOL`)" prop="depName">
          <el-select
            :disabled="isSubmit"
            v-model="ruleForm.depName"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectBelongGroupCode"
          >
            <el-option
              v-for="item in groupList"
              :key="item.depCode"
              :label="item.depName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_CODE_SYMBOL`)" prop="depCode">
          <el-select
            disabled
            v-model="ruleForm.depCode"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
          >
            <el-option
              v-for="item in groupList"
              :key="item.depCode"
              :label="item.depCode"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="phone"
          prop="linkPhone"
          required
          :label="$t(`USER_MANAGEMENT.CONTAC_TNUMBER_SYMBOL`)"
        >
          <el-form-item prop="coreNumber">
            <el-input
              class="g-w-120"
              :disabled="isSubmit"
              v-model="ruleForm.coreNumber"
              :placeholder="$t(`COMMON.PLEASE_INPUT`)"
            ></el-input>
          </el-form-item>
          <div class="g-w-20">-</div>
          <el-form-item class="g_from_phone" prop="liasPhone">
            <el-input
              class="g-w-200"
              :disabled="isSubmit"
              v-model="ruleForm.liasPhone"
              minlength="8"
              maxlength="11"
              :placeholder="$t(`COMMON.PLEASE_INPUT`)"
              onkeyup="value=value.replace(/[^\d\-]/g, '')"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t(`USER_MANAGEMENT.MAILBOX_SYMBOL`)" prop="email">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model="ruleForm.email"
            maxlength="200"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item  :label="$t(`USER_MANAGEMENT.USER_OWNING_REGION`)" prop="udf1">
            <el-select v-model="ruleForm.udf1" :style="{ width: '340px' }" :disabled="isSubmit">
              <el-option key="H" :label="this.$t('RAO_CHECK.CN_HK')" value="H"></el-option>
              <el-option key="M" :label="this.$t('RAO_CHECK.CN_CN')" value="M"></el-option> 
            </el-select>
        </el-form-item>
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_DESCRIBE_SYMBOL`)" prop="userDescrible">
          <el-input
            class="g-w-340"
            type="textarea"
            :disabled="isSubmit"
            rows="5"
            resize="none"
            v-model="ruleForm.userDescrible"
            maxlength="300"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
      </el-form>
    </header>

    <footer class="g-btn" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">
        {{
        $t(`COMMON.CANCEL`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="submitForm">
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
      <el-button class="f-confirm" @click="confirm">
        {{
        $t(`COMMON.CONFIRM`)
        }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import {
  updateUserInfo,
  findUserRuleInfoList
} from '@/api/user-management/index.js';
import { findORGMainListInfo } from '@/api/mechanism/index.js';
import { getFindRuleInfoPageList } from '@/api/role-management/index.js';
import _ from 'lodash';
export default {
  name: 'UserManageEdit',
  props: {
    editData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  computed: {
    rules() {
      // var validate_Type = (rules, value, callback) => {
      //   if (this.ruleForm.type == '') {
      //     callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      //   }
      //   callback;
      // };
      // var checkLinkPhone = (rules, value, callback) => {
      //   const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      //   const regPhoneTow = /^[0-9]{3,4}[-][0-9]{6,7}$/;
      //   if (regPhone.test(value) || regPhoneTow.test(value)) {
      //     callback();
      //   } else {
      //     return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      //   }
      // };
      var checkEmail = (rules, value, callback) => {
        // const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regEmail = /^([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (regEmail.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
        }
      };
      return {
        userName: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_NAME'),
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: this.$t('USER_MANAGEMENT.USER_NAME_LENGTH_BETWEEN'),
            trigger: 'blur'
          }
        ],
        userRealName: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_REALNAME'),
            trigger: 'blur'
          }
        ],
        userStatus: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_SELECT_USER_STATUS'),
            trigger: 'blur'
          }
        ],
        userRoleRLATInfoParamsVOS: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_SELECT_USER_ROLE'),
            trigger: 'blur'
          }
        ],
        depCode: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_BELONG_ROUP_CODE'),
            trigger: 'blur'
          }
        ],
        depName: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_BELONG_ROUP_NAME'),
            trigger: 'blur'
          }
        ],
        coreNumber: [
          {
            required: true,
            message: this.$t(
              'USER_MANAGEMENT.PLEASE_INPUT_COUNTRY_REGION_NUMBER'
            ),
            trigger: 'blur'
          }
        ],
        liasPhone: [
          {
            required: true,
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
        email: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_MAILBOX'),
            trigger: 'blur'
          },
          {
            required: false,
            validator: checkEmail,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_MAILBOX')
          },
          {
            min: 6,
            max: 34,
            message: this.$t('COMMON.MAILBOX_LENGTH'),
            trigger: 'blur'
          }
        ],
        userDescrible: [
          {
            required: this.statusFlag,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_DESCRIBE'),
            trigger: 'blur'
          }
        ],
        // udf1:[{ 
        //   required: true,
        //   message:this.$t('RAO_CHECK.PLEASE_SELECT')
        // }]
      };
    }
  },
  data() {
    return {
      statusFlag: false, //菜单状态判断描述是否为必填，停用为false，启用为true
      isSubmit: false, //是否提交，false未提交，true已提交
      ruleForm: {
        userName: '', //用户编号
        userRealName: '', //用户名称
        userStatus: '', //用户状态
        userRoleRLATInfoParamsVOS: [], //用户角色
        depCode: '', //所属机构编号
        depName: '', //所属机构
        // belongDepartmentCode: "", //所属部门
        linkPhone: '', //联系电话
        email: '', //邮箱
        userDescrible: '', //用户描述
        coreNumber: '', //国家/地区编号
        liasPhone: '' ,//电话号码
        udf1:''
      },
      userObject: {},
      userStatusList: [
        //用户状态数组
        {
          value: '0',
          label: this.$t('COMMON.STOP_USING')
        },
        {
          value: '1',
          label: this.$t('COMMON.USING')
        }
      ],
      userRoleList: [], //用户角色数组
      groupList: [] //用户角色数组
    };
  },
  watch: {},
  created() {
    // if(!this.ruleForm.udf1)this.ruleForm.udf1="H"
    // console.log('this.ruleForm.udf1:',this.ruleForm.udf1);
  },

  mounted() {
    this.selectStatus(this.editData.userStatus);
    // this.ruleForm = this.$route.query;
    this.ruleForm = _.cloneDeep(this.editData);
    this.getUserRole();
    this.getMechanismInfo();
  },

  methods: {
    //提交
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isSubmit = true;
          if (this.ruleForm.coreNumber && this.ruleForm.liasPhone) {
            this.ruleForm.linkPhone =
              this.ruleForm.coreNumber + '-' + this.ruleForm.liasPhone;
          } else {
            this.ruleForm.linkPhone = '';
          }
          this.processingData(this.ruleForm);
        } else {
          return false;
        }
      });
    },

    //处理提交的数据
    processingData(ruleForm) {
      let userRoleRLATInfoParamsVOS = [];
      ruleForm.userRoleRLATInfoParamsVOS.forEach(item => {
        userRoleRLATInfoParamsVOS.push({
          roleCode: item
        });
      });
      
      this.userObject = {
        ...this.ruleForm,
        // userCode: ruleForm.userCode,
        // depCode: ruleForm.depCode,
        // depName: ruleForm.depName,
        // email: ruleForm.email,
        // linkPhone: ruleForm.linkPhone,
        // userDescrible: ruleForm.userDescrible,
        // userName: ruleForm.userName,
        // userRealName: ruleForm.userRealName,
        // userStatus: ruleForm.userStatus,
      
        userRoleRLATInfoParamsVOS: userRoleRLATInfoParamsVOS
      };
      this.addRole();
    },

    //添加拼接用户角色方法
    addRole() {
      getFindRuleInfoPageList({ current: 1, size: 50 }).then(resp => {
        let roleName = '';
        this.userObject.userRoleRLATInfoParamsVOS.forEach(item => {
          resp.body.records.forEach(roleItem => {
            if (item.roleCode === roleItem.roleCode) {
              if (roleName) {
                roleName = roleName + ',' + roleItem.roleName;
              } else {
                roleName = roleItem.roleName;
              }
            }
          });
        });
        this.userObject.roleNames = roleName;
      });
    },

    //取消
    cancel() {
      this.$emit('backIndex');
    },

    //确认
    confirm(formName) {
      console.log('this.userObject:',this.userObject);
      updateUserInfo(this.userObject).then(resp => {
        if (resp.body) {
          this.$showMsg({
            type: 'success',
            message: this.$t('USER_MANAGEMENT.EDIT_USER_SUCCESS')
          });
          this.cancel();
        }
      });
    },

    //上一步
    perviousStep() {
      this.isSubmit = false;
    },

    //选择菜单状态
    selectStatus(e) {
      console.log('e', e);
      if (e === '0') {
        this.statusFlag = true;
      } else {
        this.statusFlag = false;
      }
    },

    //获取选择的角色
    getUserRole() {
      findUserRuleInfoList().then(resp => {
        if (resp.body && resp.body.length > 0) {
          this.userRoleList = resp.body;
          this.userRoleList.forEach(item => {
            if (item.roleCode === '999999') {
              item.disabled = true;
            }
          });
        }
      });
    },

    //限制角色最多选取5个
    roleChange(e) {
      if (e.length > 5) {
        this.$showMsg.error(this.$t('USER_MANAGEMENT.ROLE_SELECT_FIVE'));
        this.ruleForm.userRoleRLATInfoParamsVOS.splice(-1);
      }
    },

    //获取机构信息——渲染机构下拉框
    getMechanismInfo() {
      findORGMainListInfo().then(resp => {
        if (resp.body) {
          this.groupList = resp.body;
        }
      });
    },
    //选择所属机构编号
    selectBelongGroupCode({ depCode, depName }) {
      this.ruleForm.depName = depName;
      this.ruleForm.depCode = depCode;
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  // min-width: 600px;
  // padding: 32px 20px;
  // box-sizing: border-box;
  // background: #fff;
  // min-height: 100%;
  .g-btn {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-content: center;
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
