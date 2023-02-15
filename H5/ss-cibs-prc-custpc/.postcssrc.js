module.exports = {
    plugins: {
      autoprefixer: {},
      "postcss-px-to-viewport": {
        unitToConvert: "px", // 需要转换的单位
        viewportWidth: 1440, //UI设计稿的宽度
        unitPrecision: 2, //转换后的精度
        propList: ["*"], // 指定转换的css属性单位，*代表全部css属性的单位进行转换
        viewportUnit: "vw", // 指定转换成的视窗单位
        fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位
        selectorBlackList: [""], // 指定不转换为视窗单位的类名
        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
        mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认flase
        replace: true, // 是否转换后直接更换属性值
        exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
        landscape: false // 是否处理横屏情况
      }
    }
  }