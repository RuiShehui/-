/*
 * @Author: your name
 * @Date: 2021-12-01 17:39:17
 * @LastEditTime: 2021-12-01 17:43:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\mixins\formSubmit.js
 */
export default {
  data() {
    return {
      form: {},
      rules: {}
    };
  },
  methods: {
    handleSubmit() {
      this.validate();
    },
    /**
     * 重置表单
     *
     * !在可以调用重置功能的组件中，需要初始化form表单数据。否则重置后会报错
     * @param { Vue | HTMLFormElement } form ref为form的组件
     */
    handleReset(form) {
      this.$refs[form].resetFields();
    },

    validate() {
      console.log(1)
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { form } = this;

          // 在混入的组件中，声明 submit 方法。进行具体的调用
          this.submit(form);
        }
      });
    }
  }
};
