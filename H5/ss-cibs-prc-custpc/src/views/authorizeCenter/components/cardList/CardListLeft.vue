<!--
 * @Author: zhangcheng
 * @Date: 2022-05-20 09:46:34
 * @LastEditTime: 2022-05-23 09:11:21
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardListLeft.vue
-->
<template>
  <div class="m-cardList-wrapper__left">
    <div class="transtype-authstate">
      <span class="revoke">{{ title }}</span>
      <!-- <span class="type">{{item.transactionType}}</span> -->
      <!-- 待授权 -->
      <span v-if="state === '0'" class="auth wait">{{$t('AUTHORIZE.WAITE')}}</span>
      <!-- 授权同意 -->
      <span v-if="state === '1'" class="auth agree">{{$t('AUTHORIZE.ARGESS')}}</span>
      <!-- 授权拒绝 -->
      <span v-if="state === '2'" class="auth refuse">{{$t('AUTHORIZE.REFUSE')}}</span>
      <!-- 已撤销 -->
      <span v-if="state === '3'" class="auth revoked">{{$t('AUTHORIZE.AUTH_CANCLE')}}</span>
      <!-- 授权过期 -->
      <span v-if="state === '4'" class="auth revoked">{{$t('AUTHORIZE.AUTHOR_OUTDATE')}}</span>
      <!-- 正在授权 -->
      <span v-if="state === '5'" class="auth revoked">{{$t('AUTHORIZE.NOW_AUTHOR')}}</span>
      <!-- 校验失败 -->
      <span v-if="state === '6'" class="auth revoked">{{$t('AUTHORIZE.CHECK_FAIL')}}</span>
    </div>
    <div class="trans-info">
      <div class="first">
        <slot name="first"></slot>
      </div>
      <div class="second">
        <slot name="second"></slot>
      </div>
      <div class="third">
        <slot name="third"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardListLeft',
  props: {
    state: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import './common.scss';
@include status();
</style>
