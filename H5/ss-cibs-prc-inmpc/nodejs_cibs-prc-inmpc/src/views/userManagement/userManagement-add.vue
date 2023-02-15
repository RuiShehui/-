<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 10:08:01
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 09:46:56
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\userManagement\userManagement-add.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <header class="g-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="calc(50% - 170px)">
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_NAME_SYMBOL`)" prop="userName">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model.trim="ruleForm.userName"
            maxlength="30"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`USER_MANAGEMENT.USER_REALNAME_SYMBOL`)" prop="userRealName">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model.trim="ruleForm.userRealName"
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
            :filterable="true"
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
            :filterable="true"
            v-model="ruleForm.depName"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectBelongGroupCode"
          >
            <el-option
              v-for="item in groupList"
              :key="item.depCode"
              :label="item.depName"
              :value="item.depCode"
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
        <el-form-item class="phone" :label="$t(`USER_MANAGEMENT.CONTAC_TNUMBER_SYMBOL`)" required>
          <el-form-item prop="coreNumber">
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
        <el-form-item
          :label="$t(`USER_MANAGEMENT.USER_DESCRIBE_SYMBOL`)"
          prop="userDescrible"
          :rules="statusFlag?[{
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_DESCRIBE'),
            trigger: 'blur'
          }]:[]"
        >
          <el-input
            class="g-w-340"
            type="textarea"
            :disabled="isSubmit"
            rows="5"
            resize="none"
            maxlength="300"
            v-model="ruleForm.userDescrible"
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
  addUserInfo,
  findUserRuleInfoList,
  validateUserName
} from '@/api/user-management/index.js';
import { findORGMainListInfo } from '@/api/mechanism/index.js';
import { getFindRuleInfoPageList } from '@/api/role-management/index.js';
export default {
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
      //   const regPhoneTow = /^[0-9]{3,4}[-][0-9]{6,7}$/;
      //   if (regPhone.test(value) || regPhoneTow.test(value)) {
      //     callback();
      //   } else {
      //     return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      //   }
      // };
      var checkEmail = (rules, value, callback) => {
        // const regEmail = /^.[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
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
          // { min: 5, max: 30, message: '长度在3到5个字符', trigger: 'blur' }
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
            trigger: 'change'
          }
        ],
        depCode: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_BELONG_ROUP_CODE'),
            trigger: 'change'
          }
        ],
        depName: [
          {
            required: true,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_BELONG_ROUP_NAME'),
            trigger: 'change'
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
        // linkPhone: [
        //   {
        //     required: true,
        //     message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_CONTACT_NUMBER'),
        //     trigger: 'blur'
        //   }
        // ],
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
          // {
          //   required: false,
          //   validator: checkLinkPhone,
          //   message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_CONTACT_NUMBER')
          // }
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
        ]
        // userDescrible: [
        //   {
        //     required: this.statusFlag,
        //     message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_USER_DESCRIBE'),
        //     trigger: 'blur'
        //   }
        // ]
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
        liasPhone: '' //电话号码
      },
      userObject: {},
      userStatusList: [
        //用户状态数组
        {
          value: '0',
          label: '停用'
        },
        {
          value: '1',
          label: '启用'
        }
      ],
      userRoleList: [], //用户角色数组
      groupList: [] //用户角色数组
    };
  },
  watch: {},
  created() {},

  mounted() {
    let self = this;
    self.getUserRole();
    self.getMechanismInfo();
  },

  methods: {
    //提交
    submitForm() {
      let self = this;
      console.log('打印self.ruleForm', self.ruleForm);
      self.$refs.ruleForm.validate(valid => {
        if (valid) {
          self.isSubmit = true;
          if (self.ruleForm.coreNumber && self.ruleForm.liasPhone) {
            self.ruleForm.linkPhone =
              self.ruleForm.coreNumber + '-' + self.ruleForm.liasPhone;
          } else {
            self.ruleForm.linkPhone = '';
          }

          self.processingData(self.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //处理提交的数据
    processingData(ruleForm) {
      let self = this;
      let userRoleRLATInfoParamsVOS = [];
      ruleForm.userRoleRLATInfoParamsVOS.forEach(item => {
        console.log('item,', item);
        userRoleRLATInfoParamsVOS.push({
          roleCode: item
        });
      });
      self.userObject = {
        depCode: ruleForm.depCode,
        depName: ruleForm.depName,
        email: ruleForm.email,
        linkPhone: ruleForm.linkPhone,
        userDescrible: ruleForm.userDescrible,
        userName: ruleForm.userName,
        userRealName: ruleForm.userRealName,
        userStatus: ruleForm.userStatus,
        userRoleRLATInfoParamsVOS: userRoleRLATInfoParamsVOS
      };
      this.addRole();
      console.log('打印处理后的对象数据：', self.userObject);
    },

    //添加拼接用户角色方法
    addRole() {
      let self = this;
      getFindRuleInfoPageList({ current: 1, size: 50 }).then(resp => {
        let roleName = '';
        self.userObject.userRoleRLATInfoParamsVOS.forEach(item => {
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
        self.userObject.roleNames = roleName;
      });
    },

    //取消
    cancel() {
      this.$router.push('/systemManagement/userManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/userManagement/add' 
      );
    },

    //确认
    confirm(formName) {
      let self = this;
      addUserInfo(self.userObject).then(resp => {
        // console.log('打印新增resp', resp);
        if (resp.body) {
          self.$showMsg({
            type: 'success',
            message: self.$t('USER_MANAGEMENT.ADD_USER_SUCCESS')
          });
          self.cancel();
        } else {
          // self.$showMsg.error('新增失败！');
        }
      });
    },

    //上一步
    perviousStep() {
      let self = this;
      self.isSubmit = false;
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
      let self = this;
      findUserRuleInfoList().then(resp => {
        // console.log('打印。。。resp', resp);
        if (resp.body && resp.body.length > 0) {
          self.userRoleList = resp.body;
          self.userRoleList.forEach(item => {
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
      console.log('e', e);
    },

    //获取机构信息——渲染机构下拉框
    getMechanismInfo() {
      let self = this;
      findORGMainListInfo().then(resp => {
        // console.log('打印获取的机构信息', resp);
        if (resp.body && resp.head) {
          self.groupList = resp.body;
        }
      });
    },
    //选择所属机构编号
    selectBelongGroupCode(depCode) {
      const targetItem = this.groupList.find(item => item.depCode === depCode);

      if (targetItem) {
        const { depName, depCode } = targetItem;
        this.ruleForm.depName = depName;
        this.ruleForm.depCode = depCode;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 30px 24px;
  box-sizing: border-box;
  min-width: 600px;
  background: #fff;
  min-height: 100%;
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
