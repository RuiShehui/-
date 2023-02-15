<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-23 16:47:00
 * @LastEditTime: 2022-04-11 15:26:47
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\accountList\components\SelectFooter.vue
-->
<template>
  <div class="flexc">
    <v-button
      class="mr16"
      v-if="Number(type) === 2"
      size="w160"
      @click="handleCancel"
    >
      {{ $t('COMMON.CANCEL') }}
    </v-button>
    <v-button
      v-else
      size="w160"
      @click="handleDelete"
      class="mr16"
    >
      {{ $t('COMMON.DELETE') }}
    </v-button>
    <v-button size="w160" @click="handleConfirm" type="primary">
      {{ $t('COMMON.CONFIRM') }}
    </v-button>
  </div>
</template>

<script>
export default {
  name: 'SelectFooter',
  props: {
    type: [Number, String],
    /** 是否显示删除按钮 */
    isDelete: Boolean
  },
  methods: {
    handleCancel() {
      this.$emit('handleCancel');
    },
    handleDelete() {
      this.$emit('handleDelete');
    },
    handleConfirm() {
      this.$emit('handleConfirm');
    },
  }
}
</script>

<style>

</style>