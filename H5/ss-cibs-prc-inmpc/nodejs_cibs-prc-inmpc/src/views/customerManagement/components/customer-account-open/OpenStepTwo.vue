<template>
  <div class="g-form">
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ENT_USER_SETTING')" name="option">
        <el-form
          :model="operatorList"
          label-position="right"
          label-width="150px"
          ref="operatorList"
          :rules="userRules"
          label-suffix=":"
        >
          <el-form-item class="el-f" :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')" prop="userType">
            <el-radio-group v-model="operatorList.userType" @change="changeUserType">
              <el-radio label="1">{{ $t('CUSTOMER_MANAGEMENT.ADMAIN') }}</el-radio>
              <el-radio label="2">{{ $t('CUSTOMER_MANAGEMENT.AUTH_USER') }}</el-radio>
              <el-radio label="3">{{ $t('CUSTOMER_MANAGEMENT.INPUT_USER') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item></el-form-item>
          <!-- <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')"
            prop="loginName"
            
          >
            <el-input
              v-model="operatorList.loginName"
              maxlength="24"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>-->
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')" prop="userChsName">
            <el-input
              v-model="operatorList.userChsName"
              maxlength="200"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')" prop="userEglsName">
            <el-input
              v-model="operatorList.userEglsName"
              maxlength="200"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')" prop="cardType">
            <el-select
              v-model="operatorList.cardType"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
              @change="changeCardType"
            >
              <el-option
                v-for="(item,index) in cardTypeList"
                :label="item.fiedlDescrible"
                :key="index"
                :value="item.fieldValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"
            :rules="operatorList.cardType!=='HKID'?userRules.cardNo:hkdId"
            prop="cardNo"
          >
            <el-input
              v-model="operatorList.cardNo"
              maxlength="200"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')" prop="cardArea">
            <el-select
              v-model="operatorList.cardArea"
              filterable
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
            >
              <el-option
                v-for="(item,index) in cardAreaList"
                :label="item.fiedlDescrible"
                filterable
                :key="index"
                :value="item.fieldValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.BIRTHDAY')" prop="birthday">
            <el-date-picker
              class="f-w-340"
              v-model="operatorList.birthday"
              type="date"
              :placeholder="$t('CUSTOMER_MANAGEMENT.BIRTHDAY')"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="operatorList.userType!=='2'"
            :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
            prop="empowerGroup"
            :rules="[]"
          >
            <el-select
              v-model="operatorList.empowerGroup"
              :disabled="operatorList.userType==='3'"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
            >
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option :label="$t('CUSTOMER_MANAGEMENT.NONE')" value="0"></el-option>
            </el-select>
            <div
              v-if="operatorList.userType==='1'"
              class="son"
            >{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AND_AUTH') }}</div>
          </el-form-item>
          <el-form-item
            v-if="operatorList.userType==='2'"
            :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
            prop="empowerGroup"
          >
            <el-select
              v-model="operatorList.empowerGroup"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
            >
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')" prop="tfaStatus">
            <el-select
              class="f-w-340"
              v-model="operatorList.tfaStatus"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
              :disabled="operatorList.userType === '1'"
            >
              <el-option :label="$t('CUSTOMER_MANAGEMENT.YES')" value="1"></el-option>
              <el-option :label="$t('CUSTOMER_MANAGEMENT.NO')" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')" class="g-formitems">
            <el-form-item prop="userPhoneCountry">
              <money-input
                v-model="operatorList.userPhoneCountry"
                :is-all-num="true"
                class="f-w-100"
                maxlength="10"
                :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
              />
            </el-form-item>
            <span class="num-span">-</span>
            <el-form-item prop="userPhoneArea">
              <money-input
                v-model="operatorList.userPhoneArea"
                maxlength="10"
                :is-all-num="true"
                class="f-w-100"
                :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
              />
            </el-form-item>
            <span class="num-span">-</span>
            <el-form-item prop="userPhonePhone">
              <money-input
                v-model="operatorList.userPhonePhone"
                maxlength="11"
                :is-all-num="true"
                class="f-w-100"
                :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2'" class="g-formitems">
            <el-form-item prop="userPhoneCountry2">
              <money-input
                v-model="operatorList.userPhoneCountry2"
                :is-all-num="true"
                class="f-w-100"
                maxlength="10"
                :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
              />
            </el-form-item>
            <span class="num-span">-</span>
            <el-form-item prop="userPhoneArea2">
              <money-input
                v-model="operatorList.userPhoneArea2"
                maxlength="10"
                :is-all-num="true"
                class="f-w-100"
                :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
              />
            </el-form-item>
            <span class="num-span">-</span>
            <el-form-item prop="userPhonePhone2">
              <money-input
                v-model="operatorList.userPhonePhone2"
                maxlength="11"
                :is-all-num="true"
                class="f-w-100"
                :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')" prop="email">
            <el-input
              v-model="operatorList.email"
              maxlength="34"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')"
            required
            class="g-formitems"
            style="box-sizing:border-box;height:40px"
          >
            <el-form-item prop="mobilePhoneCountry">
              <money-input
                v-model="operatorList.mobilePhoneCountry"
                :is-all-num="true"
                maxlength="10"
                class="f-w-160"
                :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
              />
            </el-form-item>
            <span class="num-span">-</span>
            <el-form-item prop="mobilePhonePhone">
              <money-input
                v-model="operatorList.mobilePhonePhone"
                :is-all-num="true"
                class="f-w-160"
                :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
                maxlength="11"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')" prop="mailAddress">
            <el-input
              v-model="operatorList.mailAddress"
              maxlength="200"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item>
            <span class="f-btnColor" v-if="entType=='2'" @click="changeUser">用戶權限配置</span>
          </el-form-item>
          <el-form-item v-if="entType === '2'" label="單一批核者特權" prop="cuSoleAuthorizerInd">
            <el-radio-group v-model="operatorList.cuSoleAuthorizerInd" @change="changeApproval">
              <el-radio label="1">開</el-radio>
              <el-radio label="0">關</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div v-if="operatorList.cuSoleAuthorizerInd === '1'">
          <div>
            <span class="privilegedAccount">特權賬戶</span>
          </div>
          <div style="display: flex">
            <div class="line1"></div>
            <div class="line2"></div>
          </div>
          <div style="display: flex">
            <el-table
              :data="tableData"
              border
              stripe
              style="width: 85%; margin-left: 110px; border: 1px solid #ebeef5"
            >
              <el-table-column align="center" label="特權賬戶" prop="accName" min-width="45%">
                <template slot-scope="scope">
                  <el-select
                    style="width: 80%"
                    v-model="scope.row.accountNo"
                    @change="customerSelect(scope.row.accountNo)"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
                  >
                    <el-option
                      v-for="(item,index) in accountList"
                      :label="item.label"
                      :key="index"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="單一批核限額" min-width="45%">
                <template slot-scope="scope">
                  <span>HKD</span>
                  <el-input
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
                    style="width: 80%"
                    :maxlength="17"
                    v-model="scope.row.limitDaily"
                    @blur="changeBlur(scope.row)"
                    @focus="changeFocus(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column min-width="10%">
                <template slot-scope="scope">
                  <span @click="delApproval(scope.row, scope.$index)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <span
              v-if="tableData.length === 0"
              style="height: 25px; padding: 10px 32px; border: solid 1px #f06b00;color: #f06b00;"
              @click="addApproval"
            >添加</span>
            <div
              v-if="tableData.length > 0"
              style="margin-left: 24px; margin-right: 10%; margin-top: 25px;"
            >
              <div v-for="(item, index) in tableData" :key="index">
                <div style="margin-top: 45px">
                  <span style="color: transparent">添加</span>
                  <span
                    style="padding: 10px 32px; border: solid 1px #f06b00;color: #f06b00;"
                    v-show="index === (tableData.length - 1)"
                    @click="addApproval"
                  >添加</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="g-bottom">
          <el-button
            v-if="edit"
            class="f-cancel"
            @click="resetData"
          >{{ $t('CUSTOMER_MANAGEMENT.RESET') }}</el-button>
          <el-button
            v-if="!edit"
            class="f-cancel"
            @click="handleReset('operatorList')"
          >{{ $t('CUSTOMER_MANAGEMENT.RESET') }}</el-button>
          <el-button
            type="primary"
            @click="add('operatorList')"
          >{{ $t('CUSTOMER_MANAGEMENT.APPEND') }}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <article class="article">
      <p>
        <span class="note">{{ $t('CUSTOMER_MANAGEMENT.NOTE') }}</span>
        {{ $t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_2_TIP') }}
      </p>
    </article>
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ENTERED_ENT_USER')" name="option">
        <el-table
          class="g-table"
          :data="finishUser"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column type="index" width="80" :label="$t('CUSTOMER_MANAGEMENT.INDEX')" />
          <el-table-column prop="userType" :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')">
            <template slot-scope="scope">{{ userTypeFilter(scope.row.userType) }}</template>
          </el-table-column>
          <!-- <el-table-column
            width="100"
            prop="loginName"
            :label="$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')"
          />-->
          <el-table-column
            width="100"
            prop="userChsName"
            :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')"
          />
          <el-table-column
            width="100"
            prop="userEglsName"
            :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')"
          />
          <el-table-column width="100" :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')">
            <template slot-scope="scope">{{ cardInfoFilter(scope.row.cardType,cardTypeList) }}</template>
          </el-table-column>
          <el-table-column width="180" prop="cardNo" :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')" />
          <el-table-column width="140" :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')">
            <template slot-scope="scope">{{ cardInfoFilter(scope.row.cardArea,cardAreaList) }}</template>
          </el-table-column>
          <el-table-column width="110" prop="birthday" :label="$t('CUSTOMER_MANAGEMENT.BIRTHDAY')" />
          <el-table-column
            width="110"
            prop="userPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')"
          />
          <el-table-column
            width="110"
            prop="contactsPhone"
            :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2'"
          />
          <el-table-column
            width="170"
            prop="email"
            :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')"
          />
          <el-table-column prop="empowerLevel" :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')">
            <template slot-scope="scope">{{ empowerGroupFilter(scope.row.empowerGroup) }}</template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="tfaStatus"
            :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')"
          >
            <template slot-scope="scope">{{ tfaStatusFilter(scope.row.tfaStatus) }}</template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="mobilePhone"
            :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')"
          />
          <el-table-column
            width="120"
            prop="mailAddress"
            :label="$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')"
          />
          <el-table-column
            width="120"
            v-if="entType === '2'"
            prop="cuSoleAuthorizerInd"
            label="單一批核者特權"
          >
            <template slot-scope="scope">{{ scope.row.cuSoleAuthorizerInd === '1' ? '開' : '關' }}</template>
          </el-table-column>
          <el-table-column width="120" v-if="entType === '2'" prop="privilegedAccount" label="特權賬戶">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="u-btnColor"
                @click="detailBtn(scope.row)"
              >{{ scope.row.privilegedAccount }}</el-button>
            </template>
          </el-table-column>

          <el-table-column :label="$t('CUSTOMER_MANAGEMENT.OPERATION')" width="240">
            <template slot-scope="scope">
              <div class="f-span-btns">
                <span @click="del(scope.$index)">{{ $t('CUSTOMER_MANAGEMENT.DELETE') }}</span>
                <span
                  @click="editUser(scope.row, scope.$index)"
                >{{ $t('CUSTOMER_MANAGEMENT.EDIT') }}</span>
                <span
                  @click="modifyMenuList(scope.row, scope.$index)"
                >權限配置</span>
              </div>
            </template>
          </el-table-column>
          <el-empty
            slot="empty"
            :image="require('@/img/table-empty.png')"
            :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
          ></el-empty>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="lastStep">{{ $t('CUSTOMER_MANAGEMENT.BACK') }}</el-button>
      <el-button type="primary" @click="nextStep">{{ $t('CUSTOMER_MANAGEMENT.SAVE') }}</el-button>
    </div>

    <!-- 特权账号详情 -->
    <PopUp ref="detail" width="1026px">
      <el-table :data="approvalData" border stripe style="border: 1px solid #ebeef5">
        <el-table-column align="center" prop="accountNo" label="特權賬戶" min-width="50%" />
        <!-- <el-table-column align="center" prop="limitDaily" label="单一批核限额" min-width="50%" /> -->
        <el-table-column align="center" label="單一批核限額" min-width="50%">
          <template slot-scope="scope">
            <span>HKD {{scope.row.limitDaily}}</span>
          </template>
        </el-table-column>
      </el-table>
    </PopUp>
    <!-- 用戶權限配置 -->
    <PopUp
      ref="userPermission"
      width="1026px"
      :confirmField="confirmField"
      @confirm="confirmPopUp('intestRate')"
    >
      <el-table
        :data="
          menuList
        "
        ref="tableData"
        row-key="menuCode"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column prop="menuName" label="菜單名稱" label-class-name="labelClass">
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="全選" prop="entryPermission" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="queryAll"
              :indeterminate="isIndeterminate1"
              v-model="queryAll"
              @change="querySelectAll"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-show="scope.row.queryShowFlag"
              v-model="scope.row.queryFlag"
              @change="querySelect($event,scope.$index, scope.row)"
            >查詢</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="entryPermission" label="全選" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="entryAll"
              :indeterminate="isIndeterminate2"
              v-model="entryAll"
              @change="entrySelectAll"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.createFlag"
              @change="entrySelect($event, scope.$index, scope.row)"
              :disabled="scope.row.createDisabledFlag"
            >錄入 </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="authAll" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="authAll"
              :indeterminate="isIndeterminate3"
              v-model="authAll"
              @change="authSelectAll"
              :disabled="grantGroupDisabledFlag"
            >全部</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.grantFlag"
              @change="authSelect($event, scope.$index, scope.row)"
              :disabled="scope.row.grantDisabledFlag"
            >審批</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </PopUp>

    <PopUp ref="accountNo" width="1026px" :confirmField="confims" @confirm="confirm">
      <div class="divider">
        <div class="bill"></div>
        <div class="title">賬戶選擇設置</div>
        <slot />
      </div>
      <div class="accountSelectAll">
        <el-checkbox style="padding-left: 3%;" v-model="allChecked" @change="selectAll">全選</el-checkbox>
      </div>
      <div class="p-checkBox" style="overflow: auto">
        <div v-for="(item, index) in PopAccount" :key="index" style="margin:12px">
          <el-checkbox
            class="accountCheck"
            v-model="item.checked"
            :disabled="item.disabled"
            @change="selectChecked"
          >{{item.accName}}</el-checkbox>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import { setElStyles, setValidateForm } from '@/utils/tools';
import PopUp from '@/components/common/dialog/PopUp.vue';
// import { repeatLoginName } from '@/api/customer-management/user';
import _ from 'lodash';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import {
  getPaymentCommAccountList,
  queryCBMenu,
  getCustAcctList
} from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant';
import tool from '@/utils/moneyTools.js';
import {
  formatTreeData,
  deepClone,
  unique,
  treeToArray
} from '@/utils/tree-table.js';
import filter from '@/filters/public.js';
export default {
  components: {
    PopUp
  },
  name: 'OpenStepTwo',
  props: {
    adminEmpower: {
      type: String,
      default: '0'
    },
    finishUser: {
      type: Array,
      default: () => []
    },
    ebankCstmNo: {
      type: String,
      default: ''
    },
    entType: {
      type: String,
      default: ''
    },
    cstmNo: {
      type: String,
      default: ''
    }
  },
  filter: {
    ccyFilter: filter.ccyFilter,
    accountType: filter.accountType,
    formatBankNo: filter.formatBankNo
  },
  watch: {
    'operatorList.userType': {
      handler(val) {
        if (val === '3') {
          this.operatorList.tfaStatus = '0';
        } else {
          this.operatorList.tfaStatus = '1';
        }
      }
    }
  },
  data() {
    return {
      approvalData: [], //特权账号数组
      tableData: [],
      accountList: [],
      edit: false,
      option: 'option',
      operatorList: {
        userType: '1',
        // loginName: '',
        userChsName: '',
        userEglsName: '',
        cardType: '',
        cardNo: '',
        cardArea: '',
        userPhone: '',
        contactsPhone: '',
        email: '',
        empowerGroup: '',
        tfaStatus: '1',
        mailAddress: '',
        userPhoneCountry: '',
        userPhoneArea: '',
        userPhonePhone: '',
        userPhoneCountry2: '',
        userPhoneArea2: '',
        userPhonePhone2: '',
        mobilePhoneCountry: '',
        mobilePhonePhone: '',
        status: '1',
        cuSoleAuthorizerInd: '0'
      }, // 个人用户设置
      userRules: {
        cuSoleAuthorizerInd: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        userType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.USER_TYPE_RULES'),
            trigger: 'blur'
          }
        ],
        // loginName: [
        //   {
        //     required: true,
        //     message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
        //       msg: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')
        //     }),
        //     trigger: 'blur'
        //   },
        //   {
        //     pattern: /^(\d|\w){3,24}$/,
        //     message: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME_RULES'),
        //     trigger: 'blur'
        //   }
        // ],
        userEglsName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')
            }),
            trigger: 'blur'
          }
        ],
        cardType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_TYPE')
            }),
            trigger: 'change'
          }
        ],
        cardNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_NO')
            }),
            trigger: 'blur'
          }
        ],
        cardArea: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_AREA')
            }),
            trigger: 'change'
          }
        ],
        empowerGroup: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')
            }),
            trigger: 'change'
          }
        ],
        tfaStatus: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.TFA_STATUS')
            }),
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')
            }),
            trigger: 'blur'
          },
          {
            min: 6,
            max: 34,
            message: this.$t('CUSTOMER_MANAGEMENT.EMAIL_ADRESS_LENGTH'),
            trigger: 'blur'
          },
          {
            pattern: /^(\w|\d|\_|\-)+\@(\w|\d)+(\.+|\w)+$/,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_TRUE_EMAIL'),
            trigger: 'blur'
          }
        ],
        mobilePhoneCountry: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')
            }),
            trigger: 'blur'
          }
        ],
        mobilePhonePhone: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.PHONE_NO')
            }),
            trigger: 'blur'
          }
        ],
        mailAddress: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')
            }),
            trigger: 'blur'
          }
        ]
      }, // 验证规则
      hkdId: [
        {
          required: true,
          pattern: /^(\w|\d){8,9}$/,
          message: '請輸入正確格式的香港身份證',
          trigger: 'blur'
        }
      ],
      cardTypeList: [],
      cardAreaList: [],
      menuList: [],
      entryData: [],
      authData: [],
      queryData: [],
      queryAll: false,
      isIndeterminate1: false,
      entryAll: false,
      isIndeterminate2: false,
      authAll: false,
      isIndeterminate3: false,
      grantGroupDisabledFlag: false,
      confirmField: '下一步',
      confims: '確認',
      allChecked: false,
      PopAccount: [],
      flag: false,
      changeMune: false,
      menuPermissions: []
    };
  },
  mounted() {
    console.log(this.entType, 'entType');
    if (this.finishUser.length > 0) {
      this.finishUser.forEach(item => {
        if (item.userAccountLimits && item.userAccountLimits.length > 0) {
          item.privilegedAccount = item.userAccountLimits.length;
        } else {
          item.privilegedAccount = '無';
        }
      });
    }

    getPaymentCommAccountList({
      ebankCustNo: this.ebankCstmNo
    }).then(resp => {
      if (resp.body) {
        if (resp.body.accList.length > 0) {
          resp.body.accList.forEach(item => {
            let accTypeName = '';
            let currencyName = '';
            if (item.accType) {
              accTypeName = CONSTANTS.accountTypes[item.accType];
            }
            if (item.currency) {
              currencyName = item.currency;
            }
            item.label = item.accNo + ' ' + currencyName + ' ' + accTypeName;
            item.value = item.accNo;
            this.accountList.push(item);
          });
        } else {
          this.accountList = [];
        }
      }
    });
  },
  methods: {
    handleReset(formName) {
      // const submitForm = this.$refs[formName];
      this.$refs[formName].resetFields();
      this.tableData = [];
    },
    changeUserType(val) {
      this.$refs['operatorList'].clearValidate();

      if (val === '3') {
        this.operatorList.tfaStatus = '0';
        this.operatorList.empowerGroup = '0';
      } else {
        this.operatorList.tfaStatus = '1';
        this.operatorList.empowerGroup = '';
      }
    },
    empowerGroupFilter(val) {
      switch (val) {
        case 'A':
          return 'A';
        case 'B':
          return 'B';
        case 'C':
          return 'C';
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NONE');
        default:
          return '';
      }
    },
    tfaStatusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO');
        case '1':
        default:
          return this.$t('CUSTOMER_MANAGEMENT.YES');
      }
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ADMAIN');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.AUTH_USER');
        case '3':
          return this.$t('CUSTOMER_MANAGEMENT.INPUT_USER');
        default:
          return '';
      }
    },
    cardInfoFilter(val, array) {
      if (array && array.length !== 0) {
        const result = array.find(item => item.fieldValue === val);
        if (result) {
          return result.fiedlDescrible;
        } else {
          return val;
        }
      }
    },
    //聚焦
    changeFocus(row) {
      if (row.limitDaily) {
        row.limitDaily = tool.delDecollator(row.limitDaily);
      }
    },
    //失焦事件
    changeBlur(row) {
      row.limitDaily = tool.currencyFormat(row.limitDaily, '', 2);
    },
    add(formName) {
      if (this.operatorList.cuSoleAuthorizerInd === '1') {
        if (this.tableData.length === 0) {
          return this.$showMsg({
            type: 'error',
            message: '單一批核者特權未開，特權賬號不能為空'
          });
        } else {
          let flag = false;
          this.tableData.forEach(item => {
            if (item.accountNo === '' || item.limitDaily === '') {
              flag = true;
            }
          });
          if (flag) {
            return this.$showMsg({
              type: 'error',
              message: '特權賬號有內容未填寫，請先填寫特權賬號內容'
            });
          }
        }
      } else {
        this.tableData = [];
      }
      const submitForm = this.$refs[formName];
      submitForm.validate(valid => {
        console.log(this.edit, 'this.edit');
          if (valid) {
            const isExist = this.finishUser.some(item => {
              if (item.cardNo !== '') {
                return (
                  item.cardNo === this.operatorList.cardNo &&
                  item.cardType === this.operatorList.cardType &&
                  item.cardArea === this.operatorList.cardArea
                );
              }
            });
            const isEglsName = this.finishUser.some(
              item => item.userEglsName === this.operatorList.userEglsName
            );
            if (
              !(
                this.operatorList.userPhoneCountry === '' &&
                this.operatorList.userPhonePhone === ''
              ) &&
              !(
                this.operatorList.userPhoneCountry !== '' &&
                this.operatorList.userPhonePhone !== ''
              )
            ) {
              this.$showMsg({
                message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
                type: 'error'
              });
              return;
            }
            if (
              !(
                this.operatorList.userPhoneCountry2 === '' &&
                this.operatorList.userPhonePhone2 === ''
              ) &&
              !(
                this.operatorList.userPhoneCountry2 !== '' &&
                this.operatorList.userPhonePhone2 !== ''
              )
            ) {
              this.$showMsg({
                message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
                type: 'error'
              });
              return;
            }
            if (isExist) {
              this.$showMsg({
                message: this.$t('CUSTOMER_MANAGEMENT.CARD_NO_MESSAGE'),
                type: 'error'
              });
              return;
            }
            if (isEglsName) {
              this.$showMsg({
                message: this.$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME_MESSAGE'),
                type: 'error'
              });
              return;
            }
            if (
              this.operatorList.userPhoneCountry !== '' &&
              this.operatorList.userPhoneArea !== '' &&
              this.operatorList.userPhonePhone !== ''
            ) {
              this.operatorList.userPhone =
                this.operatorList.userPhoneCountry +
                '-' +
                this.operatorList.userPhoneArea +
                '-' +
                this.operatorList.userPhonePhone;
            } else if (
              this.operatorList.userPhoneCountry !== '' &&
              this.operatorList.userPhonePhone !== ''
            ) {
              this.operatorList.userPhone =
                this.operatorList.userPhoneCountry +
                '-' +
                this.operatorList.userPhonePhone;
            } else {
              this.operatorList.userPhone = '';
            }
            if (
              this.operatorList.userPhoneCountry2 !== '' &&
              this.operatorList.userPhoneArea2 !== '' &&
              this.operatorList.userPhonePhone2 !== ''
            ) {
              this.operatorList.contactsPhone =
                this.operatorList.userPhoneCountry2 +
                '-' +
                this.operatorList.userPhoneArea2 +
                '-' +
                this.operatorList.userPhonePhone2;
            } else if (
              this.operatorList.userPhoneCountry2 !== '' &&
              this.operatorList.userPhonePhone2 !== ''
            ) {
              this.operatorList.contactsPhone =
                this.operatorList.userPhoneCountry2 +
                '-' +
                this.operatorList.userPhonePhone2;
            } else {
              this.operatorList.contactsPhone = '';
            }
            this.operatorList.mobilePhone =
              this.operatorList.mobilePhoneCountry +
              '-' +
              this.operatorList.mobilePhonePhone;
            // if (!this.repeatLoginName(this.finishUser.loginName)) {
            //   return;
            // }
            if (this.operatorList.empowerGroup === '') {
              this.operatorList.empowerGroup = '0';
            }
            // 显示添加重置
            this.edit = false;
            this.operatorList.ebankCstmNo = this.ebankCstmNo;
            this.operatorList.userEglsName = this.operatorList.userEglsName.trim();
            this.operatorList.userChsName = this.operatorList.userChsName.trim();
            let userAccountLimitList = [];
            this.PopAccount.forEach(item => {
              if (item.checked) {
                userAccountLimitList.push({
                  accountNo: item.accNo,
                  accountType: item.accType,
                  currencyType: item.currency,
                  accountCode: item.acCode
                });
              }
            });
            this.finishUser.push({
              ...this.operatorList,
              mobilePhone:
                this.operatorList.mobilePhoneCountry +
                '-' +
                this.operatorList.mobilePhonePhone,
              cuSoleAuthorizerInd: this.operatorList.cuSoleAuthorizerInd,
              privilegedAccount:
                this.tableData.length > 0 ? this.tableData.length : '无',
              userAccountLimits: this.tableData,

              menuPermissions: treeToArray(this.menuList),
              operatorAccounts: userAccountLimitList
            });
            this.PopAccount.forEach(item=>{
              item.checked =false;
              item.disabled = false
            })
            this.$nextTick(() => {
              this.$refs[formName].resetFields();
              this.tableData = [];
            });
          
        }
      });
      this.changeMune = false;
    },
    lastStep() {
      this.$emit('lastStep');
    },
    nextStep() {
      let admin = 0;
      let unAdmin = 0;
      let empowerGroupNum = 0;
      this.finishUser.forEach(item => {
        if (item.userType === '1') {
          admin++;
        } else {
          unAdmin++;
        }
        if (item.empowerGroup !== '0') {
          empowerGroupNum++;
        }
        if (item.cuSoleAuthorizerInd === '1') {
          item.userAccountLimits.forEach(item => {
            item.limitDaily = tool.delDecollator(item.limitDaily);
          });
        }
      });
      if (admin === 0) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.ASLESS_ONE_ADMIN'),
          type: 'error'
        });
        return;
      }

      if (this.entType === '1' && (admin > 1 || unAdmin > 0)) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.ONLY_ONE_ADMIN'),
          type: 'error'
        });
        return;
      }
      if (this.adminEmpower === '1' && admin < 2) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.ASLESS_TWO_ADMIN'),
          type: 'error'
        });
        return;
      }
      if (!empowerGroupNum) {
        this.$showBox({
          content: this.$t('CUSTOMER_MANAGEMENT.EMPOWER_GROUP_NULL'),
          confirm: () => {
            this.$emit('nextStepTwo', this.finishUser);
          },
          confirmButtonText: this.$t('CUSTOMER_MANAGEMENT.YES'),
          cancelButtonText: this.$t('CUSTOMER_MANAGEMENT.NO')
        });
        return;
      }
      console.log(this.finishUser, '');
      this.$emit('nextStepTwo', this.finishUser);
    },
    editUser(row, index) {
      console.log(row, 'row');
      // 显示修改重置（修改不清空远数据）
      this.edit = true;
      this.editData = _.cloneDeep(row);
      if (row.userPhone) {
        const userPhone = row.userPhone.split('-');
        if (userPhone.length === 2) {
          this.$set(this.editData, 'userPhoneCountry', userPhone[0]);
          this.$set(this.editData, 'userPhoneArea', '');
          this.$set(this.editData, 'userPhonePhone', userPhone[1]);
        } else {
          this.$set(this.editData, 'userPhoneCountry', userPhone[0]);
          this.$set(this.editData, 'userPhoneArea', userPhone[1]);
          this.$set(this.editData, 'userPhonePhone', userPhone[2]);
        }
      } else {
        this.$set(this.editData, 'userPhoneCountry', '');
        this.$set(this.editData, 'userPhoneArea', '');
        this.$set(this.editData, 'userPhonePhone', '');
      }
      if (row.mobilePhone) {
        const mobilePhone = row.mobilePhone.split('-');
        this.$set(this.editData, 'mobilePhoneCountry', mobilePhone[0]);
        this.$set(this.editData, 'mobilePhonePhone', mobilePhone[1]);
      } else {
        this.$set(this.editData, 'mobilePhoneCountry', '');
        this.$set(this.editData, 'mobilePhonePhone', '');
      }
      if (row.contactsPhone) {
        const contactsPhone = row.contactsPhone.split('-');
        if (contactsPhone.length === 2) {
          this.$set(this.editData, 'userPhoneCountry2', contactsPhone[0]);
          this.$set(this.editData, 'userPhoneArea2', '');
          this.$set(this.editData, 'userPhonePhone2', contactsPhone[1]);
        } else {
          this.$set(this.editData, 'userPhoneCountry2', contactsPhone[0]);
          this.$set(this.editData, 'userPhoneArea2', contactsPhone[1]);
          this.$set(this.editData, 'userPhonePhone2', contactsPhone[2]);
        }
      } else {
        this.$set(this.editData, 'userPhoneCountry2', '');
        this.$set(this.editData, 'userPhoneArea2', '');
        this.$set(this.editData, 'userPhonePhone2', '');
      }

      console.log(
        this.editData.menuPermissions,
        'this.editData.menuPermissions'
      );
      this.operatorList = _.cloneDeep(this.editData);
      this.tableData = _.cloneDeep(this.editData.userAccountLimits);
      this.menuPermissions = _.cloneDeep(this.editData.menuPermissions);
      this.operatorAccounts = _.cloneDeep(this.editData.operatorAccounts);
      this.finishUser.splice(index, 1);
    },
    resetData() {
      this.operatorList = _.cloneDeep(this.editData);
      this.tableData = _.cloneDeep(this.editData.userAccountLimits);
    },
    del(index) {
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.DELETE_CONFIRM'),
        confirm: () => {
          this.finishUser.splice(index, 1);
        }
      });
    },
    modifyMenuList(row,index){
      this.menuList = this.menuPermissions
      console.log(this.menuPermissions,'this.menuPermissions')
      this.$refs.userPermission.showDialog();
    },
    async getListCardType() {
      const result = await getListCardType({
        bigGroupCode: 'language',
        fieldName: 'cardTypeInd'
      });
      if (result.body) {
        this.cardTypeList = result.body.cardTypeList;
      }
    },
    async getListCardArea() {
      const result = await getListCardArea({
        bigGroupCode: 'language',
        fieldName: 'cardArea'
      });
      if (result.body) {
        this.cardAreaList = result.body.cardAreaList;
      }
    },
    //单一批核者特权
    changeApproval(e) {
      if (e === 0) {
        this.tableData = [];
      } else {
        this.tableData = [
          {
            accountNo: '',
            limitDaily: ''
          }
        ];
      }
    },
    //添加一个批核账号
    addApproval() {
      if (this.tableData.length === 0) {
        let obj = {
          accountNo: '',
          limitDaily: ''
        };
        this.tableData.push(obj);
      } else {
        if (
          this.tableData[this.tableData.length - 1].accountNo &&
          this.tableData[this.tableData.length - 1].limitDaily
        ) {
          let obj = {
            accountNo: '',
            limitDaily: ''
          };
          this.tableData.push(obj);
        } else {
          return this.$showMsg({
            type: 'error',
            message: '特權賬號有內容未填寫，請先填寫特權賬號內容'
          });
        }
      }
    },
    //删除一个批核账号
    delApproval(row, index) {
      console.log(row,'23232')
      this.PopAccount.forEach(item=>{
        if(row.accountNo===item.accNo){
          item.checked =false
          item.disabled = false
        }
      })
      this.tableData.splice(index, 1);
    },
    //特权账户详情
    detailBtn(row) {
      this.approvalData = row.userAccountLimits;
      this.$refs.detail.showDialog();
    },
    // 清空證件號碼
    changeCardType() {
      this.operatorList.cardNo = '';
    },

    // 配置權限
    async changeUser() {
      const result = await queryCBMenu();
      this.menuList = result.body.menuList;
      console.log(this.edit, '第一次menuList');
      this.menuList.forEach(item => {
        item.queryFlag = false;
        item.grantFlag = false;
        item.createFlag = false;
        if (item.transType == '1') {
          item.createDisabledFlag = true; //录入禁用
          item.grantDisabledFlag = true; //授权禁用
        } else {
          item.createDisabledFlag = false; //录入禁用
          if (
            this.operatorList.userType == '3' ||
            this.operatorList.empowerGroup == '0' ||
            this.operatorList.userType === '0'
          ) {
            item.grantDisabledFlag = true; //授权禁用
          } else {
            item.grantDisabledFlag = false; //授权禁用
          }
        }

        if (
          item.transType == '2' ||
          item.transType == '3' ||
          item.transType == 'P'
        ) {
          item.queryShowFlag = false;
        } else {
          item.queryShowFlag = true;
        }
      });
      this.authAll = false;
      this.queryAll = false;
      this.entryAll = false;

      if (this.edit) {
        this.editMenuList(this.menuList)
      } else {
        this.menuList = formatTreeData(
          deepClone(this.menuList),
          'menuCode',
          'pmenuCode'
        );
      }
      this.$refs.userPermission.showDialog();
    },
    editMenuList(menuList){
        menuList.forEach(item => {
          this.menuPermissions.forEach(type => {
            if (item.menuCode === type.menuCode) {
              type.transType = item.transType;
            }
          });
        });
        let newMenuPermissions = this.menuPermissions;
        console.log(newMenuPermissions, 'newMenuPermissions');
        newMenuPermissions.forEach(item => {
         
          if (
            item.transType == '2' ||
            item.transType == '3' ||
            item.transType == 'P'
          ) {
            item.queryShowFlag = false;
          } else {
            item.queryShowFlag = true;
          }
          if (item.menuClazz == '0') {
            item.pmenuCode = null;
          }
          if (item.menuClazz == '0') {
            item.pmenuCode = null;
          }
           if (item.transType == '1') {
          item.createDisabledFlag = true; //录入禁用
          item.grantDisabledFlag = true; //授权禁用
        } else {
          item.createDisabledFlag = false; //录入禁用
          if (
            this.operatorList.userType == '3' ||
            this.operatorList.empowerGroup == '0' ||
            this.operatorList.userType === '0'
          ) {
            item.grantDisabledFlag = true; //授权禁用
          } else {
            item.grantDisabledFlag = false; //授权禁用
          }
        }
        });
        this.menuList = formatTreeData(
          deepClone(newMenuPermissions),
          'menuCode',
          'pmenuCode'
        );
        console.log(this.menuList, 'sdsdsdsdsdsds');
    },
    // 查询权限的全部change事件
    querySelectAll(val) {
      this.queryAll = val;
      this.isIndeterminate1 = false;
      this.menuList.map(el => {
        el.queryFlag = val;
        if (el.children) {
          this.changeQuery(el.children, val);
        }
      });
      if (this.queryAll) {
        this.menuList.map(item => {
          console.log(item, 'queryDataItem');
          this.queryData.push(item);
        });
      } else {
        this.queryData = [];
      }
      this.render();
    },
    // 录入权限的全部change事件
    entrySelectAll(val) {
      this.entryAll = val;
      this.isIndeterminate2 = false;
      this.menuList.map(el => {
        if (!el.createDisabledFlag) {
          el.createFlag = val;
        }

        if (el.children) {
          this.changeEntry(el.children, val);
        }
      });
      if (this.entryAll) {
        this.menuList.map(item => {
          console.log(item, 'entryDataItem');
          this.entryData.push(item);
        });
      } else {
        this.entryData = [];
      }
      this.render();
    },
    //录入权限——全选
    changeEntry(tabData, val) {
      tabData.map(item => {
        if (!item.createDisabledFlag) {
          item.createFlag = val;
        }
        if (item.children) {
          this.changeEntry(item.children, val);
        }
      });
    },

    // 授权权限的全部change事件
    authSelectAll(val) {
      this.authAll = val;
      this.isIndeterminate3 = false;
      this.menuList.map(el => {
        if (!el.grantDisabledFlag) {
          el.grantFlag = val;
        }
        if (el.children) {
          this.changeAuth(el.children, val);
        }
      });
      if (this.authAll) {
        this.menuList.map(item => {
          this.authData.push(item);
        });
      } else {
        this.authData = [];
      }
      this.render();
    },

    //录入权限——全选
    changeAuth(tabData, val) {
      tabData.map(item => {
        if (!item.grantDisabledFlag) {
          item.grantFlag = val;
        }
        if (item.children) {
          this.changeAuth(item.children, val);
        }
      });
    },
    changeQuery(tabData, val) {
      tabData.map(item => {
        item.queryFlag = val;
        if (item.children) {
          this.changeQuery(item.children, val);
        }
      });
    },
    //查询选择
    querySelect(e, index, row) {
      if (e) {
        this.checkQuery(this.menuList);
      } else {
        this.checkoutQuery(this.menuList);
      }
      if (row.children) {
        this.parentQuery(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentQueryChange(row);
      }
      if (row.queryFlag) {
        this.queryData.push(row);
      }
      this.render();
    },
    //取消选择的子菜单，判断总菜单是否勾选——查询
    checkoutQuery(menuList) {
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (item.queryFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate1 = false;
      } else {
        this.isIndeterminate1 = true;
      }
    },

    //查询权限-有子菜单
    parentQuery(tabData, e) {
      tabData.map(item => {
        item.queryFlag = e;
        if (item.children) {
          this.parentQuery(item.children, e);
        }
      });
      if (e) {
        // this.isIndeterminate1 = true;
        this.checkQuery(this.menuList);
      } else {
        this.checkoutQuery(this.menuList);
      }
    },
    //查询权限-父级菜单
    parentQueryChange(crtItem) {
      this.menuList = treeToArray(this.menuList);
      const pItem = this.menuList.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.menuList.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        const checkedSome = children.some(item => item.queryFlag);
        if (checkedSome) {
          pItem.queryFlag = true;
        } else {
          pItem.queryFlag = false;
        }
        if (this.menuList.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentQueryChange(pItem);
        }
      }
      this.menuList = formatTreeData(
        deepClone(this.menuList),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.queryFlag) {
        // this.isIndeterminate1 = true;
        this.checkQuery(this.menuList);
      } else {
        this.checkoutQuery(this.menuList);
      }
    },
    checkQuery(menuList) {
      this.isIndeterminate1 = true;
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (!item.queryFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.queryAll = true;
      } else {
        this.queryAll = false;
      }
    },
    //录入选择
    entrySelect(e, index, row) {
      if (e) {
        this.checkEntry(this.menuList);
      } else {
        this.checkoutEntry(this.menuList);
      }
      if (row.children) {
        this.parentEntry(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentEntryChange(row);
      }
      if (row.createFlag) {
        this.entryData.push(row);
      }
      this.render();
    },
    //勾选子菜单，判断总菜单——录入
    checkEntry(menuList) {
      this.isIndeterminate2 = true;
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (!item.createFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.entryAll = true;
      } else {
        this.entryAll = false;
      }
    },
    //取消选择的子菜单，判断总菜单是否勾选——录入
    checkoutEntry(menuList) {
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (item.createFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate2 = false;
      } else {
        this.isIndeterminate2 = true;
      }
    },
    //录入权限-有子菜单
    parentEntry(tabData, e) {
      tabData.map(item => {
        if (!item.createDisabledFlag) {
          item.createFlag = e;
        }
        if (item.children) {
          this.parentEntry(item.children, e);
        }
      });
      if (e) {
        this.checkEntry(this.menuList);
      } else {
        this.checkoutEntry(this.menuList);
      }
    },
    //录入权限-父级菜单
    parentEntryChange(crtItem) {
      this.menuList = treeToArray(this.menuList);
      const pItem = this.menuList.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.menuList.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        if (!pItem.createDisabledFlag) {
          const checkedSome = children.some(item => item.createFlag);
          if (checkedSome) {
            pItem.createFlag = true;
          } else {
            pItem.createFlag = false;
          }
        }

        if (this.menuList.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentEntryChange(pItem);
        }
      }
      this.menuList = formatTreeData(
        deepClone(this.menuList),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.createFlag) {
        this.checkEntry(this.menuList);
      } else {
        this.checkoutEntry(this.menuList);
      }
    },

    //授权选择
    authSelect(e, index, row) {
      // this.isIndeterminate3 = true;
      if (e) {
        this.checkAuth(this.menuList);
      } else {
        this.checkoutAuth(this.menuList);
      }
      if (row.children) {
        this.parentAuth(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentAuthChange(row);
      }
      if (row.grantFlag) {
        this.authData.push(row);
      }
      this.render();
    },

    //勾选子菜单，判断总菜单——授权
    checkAuth(menuList) {
      this.isIndeterminate3 = true;
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (!item.grantFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.entryAll = true;
      } else {
        this.entryAll = false;
      }
    },
    //取消选择的子菜单，判断总菜单是否勾选——授权
    checkoutAuth(menuList) {
      let flag = true;
      treeToArray(menuList).forEach(item => {
        if (item.grantFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate3 = false;
      } else {
        this.isIndeterminate3 = true;
      }
    },
    //授权权限-有子菜单
    parentAuth(tabData, e) {
      tabData.map(item => {
        if (!item.grantDisabledFlag) {
          item.grantFlag = e;
        }
        if (item.children) {
          this.parentAuth(item.children, e);
        }
      });
      if (e) {
        this.checkAuth(this.menuList);
      } else {
        this.checkoutAuth(this.menuList);
      }
    },
    //授权权限-父级菜单
    parentAuthChange(crtItem) {
      this.menuList = treeToArray(this.menuList);
      const pItem = this.menuList.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.menuList.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        if (!pItem.grantDisabledFlag) {
          const checkedSome = children.some(item => item.grantFlag);
          if (checkedSome) {
            pItem.grantFlag = true;
          } else {
            pItem.grantFlag = false;
          }
        }

        if (this.menuList.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentAuthChange(pItem);
        }
      }
      this.menuList = formatTreeData(
        deepClone(this.menuList),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.grantFlag) {
        this.checkAuth(this.menuList);
      } else {
        this.checkoutAuth(this.menuList);
      }
    },
   async getAcccountList(){
      const res = await getCustAcctList({
          ebankCustNo: this.ebankCstmNo
        });
        res.body.accList.forEach(item => {
          if (item.currency) {
            item.accName =
              this.accountFormat(item.accNo) +
              '-' +
              this.curFilter(item.currency) +
              '-' +
              this.accountTypeFilter(item.accType);
          } else {
            item.accName =
              this.accountFormat(item.accNo) +
              '-' +
              this.accountTypeFilter(item.accType);
          }
          item.checked = false;
          this.PopAccount.push(item);
        });
    },
    async confirmPopUp() {
      this.menuPermissions = this.menuList;
      this.changeMune = true;
     
      // this.PopAccount.forEach(item => {
      //     item.checked = false;
      // });
      this.$refs.accountNo.showDialog();
    },
    confirm() {
      console.log(this.PopAccount, 'this.PopAccount');
    },
    //账户全选
    selectAll() {
      this.PopAccount.forEach(item => {
        item.checked = this.allChecked;
      });
    },
    //账户单选
    selectChecked() {
      let flag = true;
      this.PopAccount.forEach(item => {
        if (!item.checked) {
          flag = false;
        }
      });
      if (flag) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    //重新渲染列列表
    render() {
      console.log('render', this.menuList);
      this.menuList = treeToArray(this.menuList);
      this.menuList = formatTreeData(
        deepClone(this.menuList),
        'menuCode',
        'pmenuCode'
      );
    },
    curFilter(val) {
      return filter.ccyFilter(val);
    },
    accountTypeFilter(val) {
      return filter.accountType(val);
    },
    accountFormat(val) {
      return filter.formatBankNo(val);
    },
    customerSelect(row){
      let list = this.PopAccount.find(item=> item.accNo === row)
        this.PopAccount.forEach(item=>{
          if(list.accNo==item.accNo){
            item.checked = true
            item.disabled = true
          }
        }
      )
    }
  },
  created() {
    this.getListCardType();
    this.getListCardArea();
    this.getAcccountList()
  }
};
</script>

<style lang="scss" scoped>
.f-w-340 {
  width: 340px;
}
.f-w-110 {
  width: 110px;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    margin-left: 10px;
    color: #f06b00;
  }
  span:nth-of-type(3) {
    margin-left: 10px;
    // color: #f06b00;
  }
}
.g-bottom {
  padding-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.g-form {
  ::v-deep .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
  }
}
.g-formitems {
  ::v-deep .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 110px;
    }
  }
}
.f-margin-5 {
  display: inline-block;
  margin: 0 5px;
}
.g-mgb-32 {
  margin-bottom: 32px;
}
.g-formitems {
  ::v-deep .el-form-item__content {
    display: flex;
    .el-form-item {
      width: auto;
      display: inline-block;
    }
  }
}
.num-span {
  width: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-form-item__label {
  padding-right: 8px;
}
.f-w-160 {
  width: 160px;
}
.f-w-100 {
  width: 100px;
}
.son {
  position: absolute;
  top: 30px;
  left: 16px;
  color: #e34141;
}
.article {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 32px 0px 24px;
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
.g-table {
  margin-top: 20px;
}
.line1 {
  width: 120px;
  border: solid 3px transparent;
  border-bottom-color: #000000;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 10px;
}
.line2 {
  width: 100%;
  border: solid 1px transparent;
  border-bottom-color: #000000;
  margin-bottom: 20px;
  margin-top: 10px;
}
.f-btnColor {
  color: #4181fa;
  cursor: pointer;
}
.accountSelect {
  height: 100%;
  border-bottom-color: red;
}
.accountSelectAll {
  // height: 46px;
  text-align: left;
  width: 100%;
  margin-top: 12px;
  // padding-left: 3%;
}
.accountCheck {
  width: 100%;
  float: left;
  width: 30%;
  // padding: 20px;
  padding: 12px 0;
  padding-left: 3%;
}

/deep/ .el-checkbox__inner {
  border-radius: 0 !important;
}
.p-checkBox {
  width:100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  div:nth-child(1){
    padding-left: 10px
  }
}
.divider {
  // float:left;
  // margin: 10px 0;
  display: flex;
  // align-items: s;
  background: #f3f3f3;
  height: 46px;
  width: 100%;
  .bill {
    width: 4px;
    height: 46px;
    background: #f06b00;
    // border-radius: 8px;
  }

  .title {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    padding-left: 10px;
    font-weight: 500;
    line-height: 46px;
    text-align: left;
  }
}
</style>