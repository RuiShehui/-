<!--
 * @Author: zhangcheng
 * @Date: 2022-04-26 10:07:47
 * @LastEditTime: 2022-09-20 09:28:44
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit、
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\authorizetionProcess.vue
-->
<template>
  <div>
    <div class="auth-box" v-if="!isOrder">
      <!-- <img src="@/image/common/jj" alt srcset />
      <img src="@/image/common/ty" alt srcset />
      <img src="@/image/common/refuse-backup" alt srcset />-->
      <div class="sumbit">
        <div class="step">
          <div class="icon finish"></div>
          <div class="line finish"></div>
        </div>
        <div class="auth-info">
          <div class="auth-state">{{ authStateFilter(submiter.authState) }}</div>
          <div class="person-time">
            <!-- 提交人 -->
            <div class="auth-person">{{$t('AUTHORIZE.USER_NAME')}}：{{ submiter.userName }}</div>
            <div class="auth-time">{{ submiter.submitTimes }}</div>
          </div>
        </div>
      </div>
      <div class="finish-auth" v-if="finishAuthList.length">
        <div class="step">
          <div>
            <img class="step-img-finish" src="@/images/common/ty.png" />
          </div>
          <div class="finish line"></div>
        </div>
        <div class="auth-info">
          <!-- 授权同意 -->
          <div class="auth-state">{{$t('AUTHORIZE.ARGESS')}}</div>
          <!-- 审批人 -->
          <div class="approve">{{$t('AUTHORIZE.PEOPLE_CHECK')}}:</div>
          <div class="approve-info" v-for="(item,index) in finishAuthList" :key="index+'agree'">
            <div>
              {{ item.userName }}
              <span class="division">|</span>
              <!-- 级别 -->
              {{ leaveFilter(item.userLevel) }}{{$t('AUTHORIZE.LEVLE')}}
            </div>
            <div class="reason" v-if="item.dealRen">
              <!-- 授权意见 -->
              <span>{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}:</span>
              {{ item.dealRen }}
            </div>
            <div class="submit-time">{{ item.submitTimes }}</div>
          </div>
        </div>
      </div>
      <div class="wait-auth" v-if="waitAuthList.length || refuseAuthList.length">
        <div class="step">
          <div>
            <img
              v-if="!refuseAuthList.length"
              class="step-img-wait"
              src="@/images/common/refuse-backup.png"
            />
            <img v-if="refuseAuthList.length" class="step-img-finish" src="@/images/common/jj.png" />
          </div>
          <div :class="[refuseAuthList.length ? 'finish' :'wait','line']"></div>
        </div>
        <div class="auth-info" v-if="refuseAuthList.length">
          <!-- 授权拒绝 -->
          <div class="auth-state refuse">{{$t('AUTHORIZE.REFUSE')}}</div>
          <!-- 审批人 -->
          <div class="approve c65">{{$t('AUTHORIZE.PEOPLE_CHECK')}}:</div>
          <div
            class="approve-info c65"
            v-for="(item,index) in refuseAuthList"
            :key="index+'refuse'"
          >
            <div>
              {{ item.userName }}
              <span class="division">|</span>
              <!-- 级别 -->
              {{ leaveFilter(item.userLevel) }}{{$t('AUTHORIZE.LEVLE')}}
            </div>
            <div class="auth-option" v-if="item.dealRen">
              <!-- 授权意见 -->
              <span>{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}:</span>
              {{ item.dealRen }}
            </div>
            <div class="submit-time">{{ item.submitTimes }}</div>
          </div>
        </div>
        <div class="auth-info" v-else>
          <!-- 待授权 -->
          <div class="auth-state auth-in">{{$t('AUTHORIZE.WAIT_AUTHOR')}}</div>
          <!-- 审批人 -->
          <div class="approve c65">{{$t('AUTHORIZE.PEOPLE_CHECK')}}:</div>
          <div :class="[personsAll0 ? 'persons-box all' : 'persons-box height-120']">
            <div class="approve-info c65" v-for="(item,index) in waitAuthList" :key="index+'wait'">
              <div>
                {{ item.userName }}
                <span class="division">|</span>
                <!-- 级别 -->
                {{ leaveFilter(item.userLevel) }}{{$t('AUTHORIZE.LEVLE')}}
              </div>
              <div class="reason" v-if="item.dealRen">
                <!-- 授权意见 -->
                <span>{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}:</span>
                {{ item.dealRen }}
              </div>
              <div class="submit-time">{{ item.submitTimes }}</div>
            </div>
          </div>
          <div v-if="!personsAll0 && personsAll0Len > 2" class="persons-btn" @click="personsBtn('0')">{{$t('AUTHORIZE.AUTH_OPEN_BTN')}}</div>
          <div v-if="personsAll0 && personsAll0Len > 2" class="persons-btn" @click="personsBtn('0')">{{$t('AUTHORIZE.AUTH_CLOSE_BTN')}}</div>
        </div>
      </div>
      <!-- 无授权人提示当前没有符合授权人 -->
      <div class="success" v-if="!hasA && !hasB && !hasC && authStatus==='0'">
        <!-- <div class="success"> -->
        <div class="step">
          <img class="step-img-wait" src="@/images/common/jj.png" />
        </div>
        <div class="auth-info">
          <!-- 授权完成 -->
          <div class="refuse">{{ $t('AUTHORIZE.NO_AUTH_PEOPLE') }}</div>
        </div>
      </div>
      <!-- 人数不足提示当前授权人人数不足 -->
      <div
        class="success"
        v-else-if="(needAuthA>aWaitAuth.length || needAuthB>bWaitAuth.length || needAuthC>cWaitAuth.length) && authStatus==='0'"
      >
        <!-- <div class="success"> -->
        <div class="step">
          <img class="step-img-wait" src="@/images/common/jj.png" />
        </div>
        <div class="auth-info">
          <!-- 授权完成 -->
          <div class="refuse">{{ $t('AUTHORIZE.NO_ENOUGH_AUTH_PEOPLE') }}</div>
        </div>
      </div>
      <div class="success" v-else>
        <div class="step">
          <div :class="[waitAuthList.length===0?'finish':'wait', 'icon']"></div>
        </div>
        <div class="auth-info">
          <!-- 授权完成 -->
          <div
            :class="[waitAuthList.length===0 ? '' :'wait', 'auth-state']"
          >{{$t('AUTHORIZE.AUTHOR_FINISH')}}</div>
        </div>
      </div>
    </div>
    <div class="auth-box" v-if="isOrder">
      <!-- <img src="@/image/common/jj" alt srcset />
      <img src="@/image/common/ty" alt srcset />
      <img src="@/image/common/refuse-backup" alt srcset />-->
      <div class="sumbit">
        <div class="step">
          <div class="icon finish"></div>
          <div class="line finish"></div>
        </div>
        <div class="auth-info">
          <div class="auth-state">{{ authStateFilter(submiter.authState) }}</div>
          <div class="person-time">
            <!-- 提交人 -->
            <div class="auth-person">{{$t('AUTHORIZE.USER_NAME')}}：{{ submiter.userName }}</div>
            <div class="auth-time">{{ submiter.submitTimes }}</div>
          </div>
        </div>
      </div>
      <div class="a-auth" v-if="hasA">
        <div class="step">
          <div>
            <img
              v-if="aAuthInfo[0].authState!=='2' && !aFinish"
              class="step-img-wait"
              src="@/images/common/refuse-backup.png"
            />
            <img
              v-if="aAuthInfo[0].authState!=='2' && aFinish"
              class="step-img-finish"
              src="@/images/common/ty.png"
            />
            <img
              v-if="aAuthInfo[0].authState==='2'"
              class="step-img-finish"
              src="@/images/common/jj.png"
            />
          </div>
          <div :class="[aFinish?'finish':'wait','line']"></div>
        </div>
        <!--一个-->
        <div class="auth-info" v-if="aAuthInfo.length === 1 && aAuthInfo[0].authState!=='2'">
          <div
            :class="['auth-state',aAuthInfo[0].authState==='2'?'refuse':'',aWaitAuth.length?'auth-in':'']"
          >{{ authStateFilter(aAuthInfo[0].authState) }}</div>
          <div :class="['person-time',aWaitAuth.length?'auth-in':'']">
            <!-- A级审批人 -->
            <div class="auth-person">{{$t('AUTHORIZE.A_LEVEL')}}：{{ aAuthInfo[0].userName }}</div>
            <div class="reason" v-if="aAuthInfo[0].dealRen">
              <!-- 授权意见 -->
              <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
              {{aAuthInfo[0].dealRen}}
            </div>
            <div class="auth-time">{{ aAuthInfo[0].submitTimes }}</div>
          </div>
        </div>
        <!--多个-->
        <div class="auth-info" v-else>
          <div
            :class="['auth-state',aWaitAuth.length?'auth-in':'',aAuthInfo[0].authState==='2'?'refuse':'']"
          >{{ authStateFilter(aAuthInfo[0].authState) }}</div>
          <div :class="['person-time',aWaitAuth.length?'auth-in':'']">
            <!-- A级审批人 -->
            <div class="auth-person">{{$t('AUTHORIZE.A_LEVEL')}}：</div>
            <div :class="[personsAllA ? 'persons-box all' : 'persons-box']">
              <div class="persons" v-for="(item,index) in aAuthInfo" :key="index+'a'">
                <div>
                  <span class="person">{{item.userName}}</span>
                  <span
                    :class="[item.authState==='2'?'refuse-color':'agree','state']"
                  >{{ authStateFilter(item.authState) }}</span>
                </div>
                <div class="reason" v-if="item.dealRen">
                  <!-- 授权意见 -->
                  <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
                  {{item.dealRen}}
                </div>
                <div class="auth-time">{{item.submitTimes}}</div>
              </div>
            </div>
            <div v-if="!personsAllA && personsAllALen > 2" class="persons-btn" @click="personsBtn('A')">{{$t('AUTHORIZE.AUTH_OPEN_BTN')}}</div>
            <div v-if="personsAllA && personsAllALen > 2" class="persons-btn" @click="personsBtn('A')">{{$t('AUTHORIZE.AUTH_CLOSE_BTN')}}</div>
          </div>
        </div>
      </div>
      <div class="b-auth" v-if="hasB">
        <div class="step">
          <div>
            <img
              v-if="bAuthInfo[0].authState!=='2' && !bFinish && aFinish"
              class="step-img-wait"
              src="@/images/common/refuse-backup.png"
            />
            <img
              v-if="bAuthInfo[0].authState!=='2' && !bFinish && !aFinish"
              class="step-img-wait"
              src="@/images/common/wait_auth.png"
            />
            <img
              v-if="bAuthInfo[0].authState!=='2' && bFinish"
              class="step-img-finish"
              src="@/images/common/ty.png"
            />
            <img
              v-if="bAuthInfo[0].authState==='2'"
              class="step-img-finish"
              src="@/images/common/jj.png"
            />
          </div>
          <div :class="[bFinish?'finish':'wait','line']"></div>
        </div>
        <!--一个-->
        <div class="auth-info" v-if="bAuthInfo.length === 1 && bAuthInfo[0].authState!=='2'">
          <div
            :class="['auth-state',bAuthInfo[0].authState==='2'?'refuse':'',bWaitAuth.length?'auth-in':'']"
          >{{ authStateFilter(bAuthInfo[0].authState) }}</div>
          <div :class="['person-time',bWaitAuth.length?'auth-in':'']">
            <!-- B级审批人 -->
            <div class="auth-person">{{$t('AUTHORIZE.B_LEVEL')}}：{{ bAuthInfo[0].userName }}</div>
            <div class="reason" v-if="bAuthInfo[0].dealRen">
              <!-- 授权意见 -->
              <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
              {{bAuthInfo[0].dealRen}}
            </div>
            <div class="auth-time">{{ bAuthInfo[0].submitTimes }}</div>
          </div>
        </div>
        <!--多个-->
        <div class="auth-info" v-else>
          <div
            :class="['auth-state',bWaitAuth.length?'auth-in':'',bAuthInfo[0].authState==='2'?'refuse':'']"
          >{{ authStateFilter(bAuthInfo[0].authState) }}</div>
          <div :class="['person-time',bWaitAuth.length?'auth-in':'']">
            <!-- B级审批人 -->
            <div class="auth-person auth-in">{{$t('AUTHORIZE.B_LEVEL')}}：</div>
            <div :class="[personsAllB ? 'persons-box all' : 'persons-box']">
              <div class="persons" v-for="(item,index) in bAuthInfo" :key="index+'b'">
                <div>
                  <span class="person">{{item.userName}}</span>
                  <span
                    :class="[item.authState==='2'?'refuse-color':'agree','state']"
                  >{{ authStateFilter(item.authState) }}</span>
                </div>
                <div class="reason" v-if="item.dealRen">
                  <!-- 授权意见 -->
                  <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
                  {{item.dealRen}}
                </div>
                <div class="auth-time">{{item.submitTimes}}</div>
              </div>
            </div>
            <div v-if="!personsAllB && personsAllBLen > 2" class="persons-btn" @click="personsBtn('B')">{{$t('AUTHORIZE.AUTH_OPEN_BTN')}}</div>
            <div v-if="personsAllB && personsAllBLen > 2" class="persons-btn" @click="personsBtn('B')">{{$t('AUTHORIZE.AUTH_CLOSE_BTN')}}</div>
          </div>
        </div>
      </div>
      <div class="c-auth" v-if="hasC">
        <div class="step">
          <div>
            <img
              v-if="cAuthInfo[0].authState!=='2'&&!cFinish && bFinish"
              class="step-img-wait"
              src="@/images/common/refuse-backup.png"
            />
            <img
              v-if="cAuthInfo[0].authState!=='2' && !cFinish && !bFinish"
              class="step-img-wait"
              src="@/images/common/wait_auth.png"
            />
            <img
              v-if="cAuthInfo[0].authState!=='2'&&cFinish"
              class="step-img-finish"
              src="@/images/common/ty.png"
            />
            <img
              v-if="cAuthInfo[0].authState==='2'"
              class="step-img-finish"
              src="@/images/common/jj.png"
            />
          </div>
          <div :class="[cFinish?'finish':'wait','line']"></div>
        </div>
        <!--一个-->
        <div class="auth-info" v-if="cAuthInfo.length === 1 && cAuthInfo[0].authState!=='2'">
          <div
            :class="['auth-state',cWaitAuth.length?'auth-in':'',cAuthInfo[0].authState==='2'?'refuse':'']"
          >{{ authStateFilter(cAuthInfo[0].authState) }}</div>
          <div :class="['person-time',cWaitAuth.length?'auth-in':'']">
            <!-- C级审批人 -->
            <div class="auth-person">{{$t('AUTHORIZE.C_LEVEL')}}：{{ cAuthInfo[0].userName }}</div>
            <div class="reason" v-if="cAuthInfo[0].dealRen">
              <!-- 授权意见 -->
              <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
              {{cAuthInfo[0].dealRen}}
            </div>
            <div class="auth-time">{{ cAuthInfo[0].submitTimes }}</div>
          </div>
        </div>
        <!--多个-->
        <div class="auth-info" v-else>
          <div
            :class="['auth-state',cWaitAuth.length?'auth-in':'',cAuthInfo[0].authState==='2'?'refuse':'']"
          >{{ authStateFilter(cAuthInfo[0].authState) }}</div>
          <div :class="['person-time',cWaitAuth.length?'auth-in':'']">
            <!-- C级审批人 -->
            <div class="auth-person auth-in">{{$t('AUTHORIZE.C_LEVEL')}}：</div>
            <div :class="[personsAllC ? 'persons-box all' : 'persons-box']">
              <div class="persons" v-for="(item,index) in cAuthInfo" :key="index+'c'">
                <div>
                  <span class="person">{{item.userName}}</span>
                  <span
                    :class="[item.authState==='2'?'refuse-color':'agree','state']"
                  >{{ authStateFilter(item.authState) }}</span>
                </div>
                <div class="reason" v-if="item.dealRen">
                  <!-- 授权意见 -->
                  <span class="refuse-color">{{$t('AUTHORIZE.AUTHOUTH_SUGEST')}}：</span>
                  {{item.dealRen}}
                </div>
                <div class="auth-time">{{item.submitTimes}}</div>
              </div>
            </div>
            <div v-if="!personsAllC && personsAllCLen > 2" class="persons-btn" @click="personsBtn('C')">{{$t('AUTHORIZE.AUTH_OPEN_BTN')}}</div>
            <div v-if="personsAllC && personsAllCLen > 2" class="persons-btn" @click="personsBtn('C')">{{$t('AUTHORIZE.AUTH_CLOSE_BTN')}}</div>
          </div>
        </div>
      </div>
      <!--授权结果-->
      <div class="success" v-if="!hasA && !hasB && !hasC && authStatus==='0'">
        <!-- <div class="success"> -->
        <div class="step">
          <img class="step-img-wait" src="@/images/common/jj.png" />
        </div>
        <div class="auth-info">
          <!-- 授权完成 -->
          <div class="refuse">{{ $t('AUTHORIZE.NO_AUTH_PEOPLE') }}</div>
        </div>
      </div>
      <div
        class="success"
        v-else-if="(needAuthA>aWaitAuth.length || needAuthB>bWaitAuth.length || needAuthC>cWaitAuth.length) && authStatus==='0'"
      >
        <!-- <div class="success"> -->
        <div class="step">
          <img class="step-img-wait" src="@/images/common/jj.png" />
        </div>
        <div class="auth-info">
          <!-- 授权完成 -->
          <div class="refuse">{{ $t('AUTHORIZE.NO_ENOUGH_AUTH_PEOPLE') }}</div>
        </div>
      </div>
      <div class="success" v-else>
        <div class="step">
          <div :class="[isFinish?'finish':'wait', 'icon']"></div>
        </div>
        <div class="auth-info">
          <div :class="[isFinish?'':'wait', 'auth-state']">{{$t('AUTHORIZE.AUTHOR_FINISH')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function filterArr(arr1, arr2) {
  return arr1.filter(item1 => {
    if (arr2.some(item2 => item2.code === item1.code)) {
      return false;
    }
    return true;
  });
}

import { searchAuthRecord, searchAuther } from '@/api/authorizeCenter';
import { mapState } from 'vuex';
export default {
  name: 'AuthorizetionProcess',
  data() {
    return {
      language: 'zh-CN', //语言
      isOrder: true, // 有无序
      authFlowInfoList: [],
      userCodeList: [],
      authPersonNum: [],
      needAuthA: 0, // A还需要的授权人数
      needAuthB: 0, // B还需要的授权人数
      needAuthC: 0, // C还需要的授权人数
      refuseAuthList: [], // 拒绝授权人列表
      submiter: {}, // 提交人
      dealPerson: {}, // 正在处理人
      dealPersonArray: [], // 正在处理列表
      aFinishAuth: [], // A完成授权人列表
      bFinishAuth: [], // B完成授权人列表
      cFinishAuth: [], // C完成授权人列表
      aWaitAuth: [], // A等待授权人列表
      bWaitAuth: [], // B等待授权人列表
      cWaitAuth: [], // C等待授权人列表
      personsAll0: false,
      personsAllA: false, // A等待授权人列表展开状态
      personsAllB: false, // B等待授权人列表展开状态
      personsAllC: false, // C等待授权人列表展开状态
      personsAll0Len: 0,
      personsAllALen: 0, // A等待授权人列表展开状态
      personsAllBLen: 0, // B等待授权人列表展开状态
      personsAllCLen: 0, // C等待授权人列表展开状态
    };
  },
  props: {
    flowNo: {
      type: String,
      default: ''
    },
    menuCode: {
      type: String,
      default: ''
    },
    authStatus: {
      type: String,
      default: ''
    }
  },
  watch: {
    lang(newVal) {
      this.language = newVal;
    }
  },
  computed: {
    ...mapState('app', ['lang']),
    // 等待授权人列表（无序）
    waitAuthList() {
      let waitArr = [...this.aWaitAuth, ...this.bWaitAuth, ...this.cWaitAuth];
      this.personsAll0 = waitArr.length < 3;
      this.personsAll0Len = waitArr.length;
      return waitArr;
    },
    // 完成授权人列表（无序）
    finishAuthList() {
      console.log(this.aFinishAuth, '...this.finishAuthList');
      return [...this.aFinishAuth, ...this.bFinishAuth, ...this.cFinishAuth];
    },
    // 全部A授权人信息
    aAuthInfo() {
      let aArr = this.aFinishAuth.concat(this.aWaitAuth);
      this.personsAllA = aArr.length < 3;
      this.personsAllALen = aArr.length;
      return aArr;
    },
    // 全部B授权人信息
    bAuthInfo() {
      let bArr = this.bFinishAuth.concat(this.bWaitAuth);;
      this.personsAllB = bArr.length < 3;
      this.personsAllBLen = bArr.length;
      return bArr;
    },
    // 全部C授权人信息
    cAuthInfo() {
      let cArr = this.cFinishAuth.concat(this.cWaitAuth);
      this.personsAllC = cArr.length < 3;
      this.personsAllCLen = cArr.length;
      return cArr;
    },
    // 是否已完成授权
    isFinish() {
      return !Boolean(
        this.aWaitAuth.length + this.bWaitAuth.length + this.cWaitAuth.length
      );
    },
    // A是否已走完流程
    aFinish() {
      return !Boolean(this.aWaitAuth.length);
    },
    // B是否已走完流程
    bFinish() {
      return !Boolean(this.bWaitAuth.length);
    },
    // C是否已走完流程
    cFinish() {
      return !Boolean(this.cWaitAuth.length);
    },
    // 是否有A级授权人
    hasA() {
      return Boolean(this.aAuthInfo.length);
    },
    // 是否有B级授权人
    hasB() {
      return Boolean(this.bAuthInfo.length);
    },
    // 是否有C级授权人
    hasC() {
      return Boolean(this.cAuthInfo.length);
    }
  },
  async created() {
    console.log(
      this.authStatus,
      this.hasA,
      this.hasB,
      this.hasC,
      'authStatus,this.hasA,this.hasB,this.hasC'
    );
    this.searchAuthRecord();
  },
  methods: {
    // 获取授权流程数据
    async searchAuthRecord() {
      let params = {
        flowNo: this.flowNo
      };
      const result = await searchAuthRecord(params);
      if (result) {
        console.log(result, '获取授权流程数据');
        //过滤数据
        this.authFlowInfoList = result.tcApprovalRecords.map((item, index) => {
          return {
            authState: item.authState,
            submitTimes: item.submitTimes,
            userName: item.userName,
            userLevel: item.userLevel,
            userCode: item.userCode,
            dealRen: item.dealRen
          };
        });
        // 是否有序
        if (result.tcAuthQueues[0].authType === '0') {
          this.isOrder = false;
          this.authFlowInfoList.forEach((item, index) => {
            if (
              index < this.authFlowInfoList.length - 1 &&
              item.authState !== '2'
            ) {
              if (item.userLevel === '1') {
                this.aFinishAuth.push(item);
              }
              if (item.userLevel === '2') {
                this.bFinishAuth.push(item);
              }
              if (item.userLevel === '3') {
                this.cFinishAuth.push(item);
              }
            }
          });
        } else {
          this.isOrder = true;
          // 处理已完成ABC授权
          this.authFlowInfoList.forEach((item, index) => {
            if (index < this.authFlowInfoList.length - 1) {
              if (item.userLevel === '1') {
                this.aFinishAuth.push(item);
              }
              if (item.userLevel === '2') {
                this.bFinishAuth.push(item);
              }
              if (item.userLevel === '3') {
                this.cFinishAuth.push(item);
              }
            }
          });
        }
        this.userCodeList = this.authFlowInfoList.map(item => item.userCode);
        console.log(this.userCodeList, '11111111111111111111');
        this.submiter = this.authFlowInfoList[this.authFlowInfoList.length - 1];
        if (this.authFlowInfoList.length > 1) {
          this.dealPerson = this.authFlowInfoList[0];
          if (this.dealPerson.authState === '2') {
            this.refuseAuthList.push(this.authFlowInfoList[0]);
            return;
          }
        }
        result.tcAuthQueues.forEach((item, index) => {
          if (item.userLevelNum > 0) {
            this.searchAuther(item.userLevel);
          }
          switch (item.userLevel) {
            case 1:
              this.needAuthA = item.userLevelNum;
              break;
            case 2:
              this.needAuthB = item.userLevelNum;
              break;
            case 3:
              this.needAuthC = item.userLevelNum;
              break;
            default:
              return;
          }
        });
        // console.log(this.authFlowInfoList, this.authPersonNum);
      }
    },
    async searchAuther(val) {
      const result = await searchAuther({
        empowerGroup: this.leaveFilter(val),
        menuCode: this.menuCode
      });
      if (result) {
        this.waitAuthInfoFilter(result, val);
      }
    },
    // 过滤未授权人数据,
    waitAuthInfoFilter(data, val) {
      console.log(data, 'val');
      if (val === 1) {
        this.aWaitAuth = data
          .map(item => {
            return {
              authState: '',
              userLevel: val,
              userName: this.langFilter(item),
              userCode: item.userCode
            };
          })
          .filter(item => {
            return this.userCodeList.indexOf(item.userCode) < 0;
          });
      }
      if (val === 2) {
        this.bWaitAuth = data
          .map(item => {
            return {
              authState: '',
              userLevel: val,
              userName: this.langFilter(item),
              userCode: item.userCode
            };
          })
          .filter(item => {
            return this.userCodeList.indexOf(item.userCode) < 0;
          });
      }
      if (val === 3) {
        this.cWaitAuth = data
          .map(item => {
            return {
              authState: '',
              userLevel: val,
              userName: this.langFilter(item),
              userCode: item.userCode
            };
          })
          .filter(item => {
            return this.userCodeList.indexOf(item.userCode) < 0;
          });
      }
      console.log(
        this.aWaitAuth,
        this.bWaitAuth,
        this.cWaitAuth,
        'waitAuthList'
      );
    },
    // 过滤等级
    leaveFilter(val) {
      const valNum = Number(val);
      switch (valNum) {
        case 1:
          return 'A';
        case 2:
          return 'B';
        case 3:
          return 'C';
        default:
          return val;
      }
    },
    // 语言用户名转换
    langFilter(data) {
      // if (data.userChsName && this.language === 'zh-CN') {
      //   return data.userChsName;
      // } else {
      return data.userEglsName;
      // }
    },
    // 授权状态过滤
    authStateFilter(val) {
      switch (val) {
        case '0':
          // '提交成功'
          return this.$t('AUTHORIZE.Success');
        case '1':
          // '授权同意'
          return this.$t('AUTHORIZE.ARGESS');
        case '2':
          // '授权拒绝'
          return this.$t('AUTHORIZE.REFUSE');
        case '3':
          // '已撤销'
          return this.$t('AUTHORIZE.REVOKED');
        default:
          // '待授权'
          return this.$t('AUTHORIZE.WAIT_AUTHOR');
      }
    },
    personsBtn(val) {
      this[`personsAll${val}`] = !this[`personsAll${val}`];
    }
  }
};
</script>

<style scoped lang="scss">
.auth-box {
  width: 100%;
  padding: 20px 60px;
  background: #f7f7f7;
  box-sizing: border-box;
  justify-content: center;
  display: flex;
  > div {
    width: 23%;
    display: flex;
    flex-direction: column;
    .step {
      display: flex;
      align-items: center;
      height: 28px;
      .icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid;
        box-sizing: border-box;
      }
      .line {
        flex: 1;
        height: 0;
        border: 1px solid;
      }
      .finish {
        color: #f06b00;
        border-color: #f06b00;
      }
      .wait {
        color: rgba($color: #bfbfbf, $alpha: 0.45);
        border-color: rgba($color: #bfbfbf, $alpha: 0.45);
      }
      .step-img-finish,
      .step-img-wait {
        width: 20px;
        height: 20px;
      }
      .step-img-in {
        width: 28px;
        height: 28px;
      }
    }
    .auth-info {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      .auth-state {
        font-size: 16px;
        font-weight: 500;
        color: rgba($color: #000000, $alpha: 0.65);
        line-height: 24px;
      }
      .approve {
        margin-top: 4px;
        font-size: 14px;
        line-height: 22px;
        color: rgba($color: #000000, $alpha: 0.45);
      }
      .approve-info {
        flex-wrap: wrap;
        font-size: 14px;
        margin-top: 8px;
        color: rgba($color: #000000, $alpha: 0.45);
        line-height: 22px;
        .auth-option {
          line-height: 22px;
          > span {
            color: #f23f47;
          }
        }
        .division {
          display: inline-block;
          margin: 0 4px;
        }
        .submit-time {
          margin-left: 3px;
        }
        .reason {
          word-break: break-all;
        }
      }
      .c65 {
        color: rgba($color: #000000, $alpha: 0.65);
      }
      .auth-in {
        color: #f06b00;
      }
      .refuse {
        color: #f23f47;
      }
      .wait {
        color: rgba($color: #000000, $alpha: 0.45);
      }
      .person-time {
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        color: rgba($color: #000000, $alpha: 0.45);
        > div {
          line-height: 22px;
          font-size: 14px;
          > div:not(:nth-of-type(1)) {
            margin-top: 20px;
          }
        }
        .auth-time {
          margin-top: 8px;
        }

        .persons {
          display: flex;
          flex-direction: column;
          > div {
            .agree {
              color: #f06b00;
            }
            .state {
              margin-left: 10px;
            }
            .refuse-color {
              color: #f23f47;
            }
          }
          .auth-time {
            color: rgba($color: #000, $alpha: 0.45);
            margin-top: 8px;
          }
          .reason {
            word-break: break-all;
          }
        }
      }
      .auth-in {
        color: rgba($color: #000000, $alpha: 0.65);
      }
    }
  }
  .success {
    width: 10%;
  }
}
.persons-box {
  height: 140px;
  overflow: hidden;
  &.height-120 {
    height: 100px;
  }
  &.all {
    height: auto;
  }
}
.persons-btn {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  font-size: 14px;
}
</style>