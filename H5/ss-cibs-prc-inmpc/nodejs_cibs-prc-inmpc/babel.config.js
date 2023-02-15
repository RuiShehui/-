/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2021-12-17 16:58:22
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\babel.config.js
 */
const prodPlugins = [];

// if (['production'].includes(process.env.NODE_ENV)) {
//   prodPlugins.push('transform-remove-console');
// }

module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    ["transform-class-properties", { "spec": true }],
    ...prodPlugins
  ]
}
