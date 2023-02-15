/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-05-31 14:49:39
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\dataTools\tools\index.js
 */
import utils from "./utils";
import typeTools from "./typeTools";
import stringTools from "./stringTools";
import objectTools from "./objectTools";
import moneyTools from "./moneyTools";
import dateTools from "./dateTools";
import fileTools from "./fileTools";
// import { trans } from "../dict";

export default {
    // trans,
    ...utils,
    ...typeTools,
    ...stringTools,
    ...objectTools,
    ...moneyTools,
    ...dateTools,
    ...fileTools,
};