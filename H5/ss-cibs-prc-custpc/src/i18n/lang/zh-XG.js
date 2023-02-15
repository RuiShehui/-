/*
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-01 14:47:28
 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\i18n\lang\zh-XG.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
import accountManagement from "../accountManagement/zh-XG.js";
import business from "../_businessManagement/zh-XG.js";
import invest from "../invest/zh-XG.js";
import logon from "../login/zh-XG.js"
import transferRemittance from "../transferRemittance/zh-XG.js";
import internationalBusiness from "../internationalBusiness/zh-XG.js";
import payService from "../payService/zh-XG.js";
import home from "../home/zh-XG.js";
import applyCheckBoock from "../applyCheckbook/zh-XG.js";
import userManagement from "../userManagement/zh-XG.js";
import user from "../user/zh-XG.js";
import fixed from '../fixed/zh-XG';
import bathTransfer from '../batch-transfer/zh-XG.js'
import authorizeCenter from '../authorizeCenter/zh-XG.js'
import specialIntruction from "../speacialInstruction/zh-XG";
export default {
  ...business,
  ...accountManagement,
  ...invest,
  ...transferRemittance,
  ...logon,
  ...home,
  ...internationalBusiness,
  ...payService,
  ...applyCheckBoock,
  ...userManagement,
  ...user,
  ...fixed,
  ...bathTransfer,
  ...authorizeCenter,
	...specialIntruction,
  lang: {
    simplify: "简体",
    traditional: "繁體",
    english: "English"
  },
  // 公共部分
  COMMON: {
		"TISHI":"提示",
		"TIPS":"溫馨提示",
		"DETERMINE":"確定",
		"CANCEL":"取消",
		"CONFIRM":"確認",
		"SUBMIT":"提交",
		"COMPLETE":"完成",
		"PREVIOUS_STEP":"上一步",
		"NEXT_STEP":"下一步",
		"TRANSACTION_SUCCESS":"交易成功",
		"EXIT":"退出",
		"REMIND":"提醒",
		"SEARCH":"查詢",
		"RESET":"重設",
		"ADD":"新增",
		"DETAIL":"詳情",
		"REEDIT":"重新編輯",
		"REVOKE":"撤銷",
		"COPY":"複製",
		"OPERATION":"操作",
		"UPLOAD":"上傳",
		"RESET_PASSWORD":"重置密碼",
		"DELETE":"刪除",
		"UPDATE":"修改",
		"PLEASE_SELECT":"請選擇",
		"PLEASE_SELECT_SOMETHING":"請選擇%{select}",
		"SERIAL_NUMBER":"序號",
		"BACK":"返回",
		"UPLOAD_TYPE_ERROR":"上傳格式有誤",
		"START_TIME":"開始時間",
		"END_TIME":"結束時間",
		"START_DATE":"開始日期",
		"END_DATE":"結束日期",
		"DATESPAN_TO":"至",
		"PLEASE_INPUT":"請輸入",
		"PLEASE_INPUT_SOMETHING":"請輸入%{input}",
		"SELECT_LANGS":"請選擇語言",
		"PREPEAR_HANDLE":"待處理",
		"IS_HANDLED":"已處理",
		"QUERY_INTERVAL":"查詢時期不可超過90天。",
		"EMAIL_CONTENT_INVALID":"郵箱的內容有誤",
		"EMAIL_NOT_ALLOW_EMPTY":"郵箱的內容不得為空",
		"EMAIL_FORMAT_INVALID":"電郵地址格式錯誤",
		"INIT_DATA_SUCCESS":"初始化數據成功",
		"CHECK_FAIL":"校驗失敗",
		"SOMETHING_SUCCESS":"%{op}成功",
		"SOMETHING_FAIL":"%{op}失敗",
		"UPDATE_SUCCESS":"更新成功",
		"ADD_SUCCESS":"新增成功！",
		"DELETE_SUCCESS":"刪除成功！",
		"TRADE_TYPE":"交易類型",
		"TRADE_STATUS":"交易狀態",
		"SUBMITTER":"提交人",
		"SUBMIT_TIME":"提交時間",
		"AUTHORIZATION_STATUS":"授權狀態",
		"CREATE_TIME":"創建時間",
		"MONEY":"金額",
		"STEPS_FILL_INFORMATION":"填寫資訊",
		"STEPS_COMFIRM_INFORMATION":"確認信息",
		"STEPS_RESULT_INFORMATION":"交易結果",
		"TRANSACTION_DETAIL":"交易詳情",
		"AGREE":"接受",
		"DISAGREE":"不接受",
		"PHONE_NUMBER":"電話號碼",
		"TOTAL":"全部",
		"FINISH":"完成",
		"YES":"是",
		"NO":"否",
		"RECENT_7_DAYS":"最近7日",
		"RECENT_14_DAYS":"最近14日",
		"RECENT_30_DAYS":"最近30日",
		"WITHOUT_DATA":"暫無數據",
		"SUBMIT_SUCCESS":"提交成功",
		"SUBMIT_FAIL":"提交失敗",
		"OTP_ERROR":"一次性短訊密碼不正確。如連續3次輸入錯誤或逾時的一次性短訊密碼，該筆交易將自動取消。",
		"CONFIRM_DELETE_SOMETHING":"確認刪除%{content}",
		"GET_VR_CODE":"獲取驗證碼",
		"FLOW_NO":"參考編號",
		"NOT_SEVER_TIME":"服務時間外遞交之指示將不會被接受",
		"SPECIAL_WEATHER":"受颱風或惡劣天氣影響，當前已暫停交易",
		"SERVICE_ONLOAD":"連接服務`逾時，請按「確定」刷新頁面。",
		"INITIALIZAITON":"初始化失敗了，請按「確定」重新加載。",
		"SYSTEM_EXCEPTION":"[GW]系統異常，如有疑問，請致電本行客戶服務熱線(852)3768 6888。"
  },
};