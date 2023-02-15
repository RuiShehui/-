/*
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-01 14:47:59
 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\i18n\lang\en.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
import accountManagement from "../accountManagement/en.js";
import business from "../_businessManagement/en.js";
import invest from "../invest/en.js";
import Logon from "../login/en.js"
import transferRemittance from "../transferRemittance/en.js";
import home from "../home/en.js"
import internationalBusiness from "../internationalBusiness/en.js";
import payService from "../payService/en.js";
import applyCheckBoock from "../applyCheckbook/en.js";
import userManagement from "../userManagement/en.js";
import user from "../user/en.js";
import fixed from "../fixed/en.js"
import bathTransfer from '../batch-transfer/en.js'
import authorizeCenter from '../authorizeCenter/en.js'
import specialIntruction from "../speacialInstruction/en";
export default {
  ...business,
  ...accountManagement,
  ...invest,
  ...transferRemittance,
  ...Logon,
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
  COMMON: {
		"TISHI":"Tips",
		"TIPS":"Reminder",
		"DETERMINE":"Confirm",
		"CANCEL":"Cancel",
		"CONFIRM":"Confirm",
		"SUBMIT":"submit",
		"COMPLETE":"Done",
		"PREVIOUS_STEP":"Back",
		"NEXT_STEP":"Next",
		"TRANSACTION_SUCCESS":"Transaction Successful",
		"EXIT":"Logout",
		"REMIND":"remind",
		"SEARCH":"Enquiry",
		"RESET":"Reset",
		"ADD":"New",
		"DETAIL":"Details",
		"REEDIT":"Re-edit",
		"REVOKE":"Cancel",
		"COPY":"copy",
		"OPERATION":"Operate",
		"UPLOAD":"upload",
		"RESET_PASSWORD":"reset Password",
		"DELETE":"Delete",
		"UPDATE":"Amend",
		"PLEASE_SELECT":"Please select",
		"PLEASE_SELECT_SOMETHING":"Please select %{select}",
		"SERIAL_NUMBER":"Number",
		"BACK":"Back",
		"UPLOAD_TYPE_ERROR":"Upload format is invalid",
		"START_TIME":"From",
		"END_TIME":"To",
		"START_DATE":"Start Date",
		"END_DATE":"End Date",
		"DATESPAN_TO":"To",
		"PLEASE_INPUT":"Please enter",
		"PLEASE_INPUT_SOMETHING":"Please enter %{input}",
		"SELECT_LANGS":"Please select language",
		"PREPEAR_HANDLE":"To be processed",
		"IS_HANDLED":"Processed",
		"QUERY_INTERVAL":"The enquiry period cannot exceed 90 days.",
		"EMAIL_CONTENT_INVALID":"The content of the email is incorrect",
		"EMAIL_NOT_ALLOW_EMPTY":"The content of the mailbox must not be empty",
		"EMAIL_FORMAT_INVALID":"Email format is incorrect",
		"INIT_DATA_SUCCESS":"Initialise data successfully",
		"CHECK_FAIL":"Verification failed",
		"SOMETHING_SUCCESS":"%{op} Success",
		"SOMETHING_FAIL":"%{op}Failed",
		"UPDATE_SUCCESS":"Refreshed",
		"ADD_SUCCESS":"Added successfully!",
		"DELETE_SUCCESS":"Deleted successfully!",
		"TRADE_TYPE":"Transaction type",
		"TRADE_STATUS":"Transaction Status",
		"SUBMITTER":"Submitted by",
		"SUBMIT_TIME":"Submission Time",
		"AUTHORIZATION_STATUS":"Authorisation Status",
		"CREATE_TIME":"Creation Time",
		"MONEY":"Amount",
		"STEPS_FILL_INFORMATION":"Fill in the information",
		"STEPS_COMFIRM_INFORMATION":"Confirm information",
		"STEPS_RESULT_INFORMATION":"transaction result",
		"TRANSACTION_DETAIL":"Transaction details",
		"AGREE":"Accept",
		"DISAGREE":"Not Accepted",
		"PHONE_NUMBER":"Phone Number",
		"TOTAL":"All",
		"FINISH":"Done",
		"YES":"Yes",
		"NO":"No",
		"RECENT_7_DAYS":"Last 7 days",
		"RECENT_14_DAYS":"Last 14 days",
		"RECENT_30_DAYS":"last 30 days",
		"WITHOUT_DATA":"No data currently",
		"SUBMIT_SUCCESS":"Submitted Successfully",
		"SUBMIT_FAIL":"Submission Failed",
		"OTP_ERROR":"The SMS one-time password is incorrect. If an incorrect or expired SMS one-time password is entered for 3 consecutive times, the transaction will be cancelled automatically.",
		"CONFIRM_DELETE_SOMETHING":"Confirm to delete %{content}",
		"GET_VR_CODE":"Verification Code",
		"FLOW_NO":"Reference Number",
		"NOT_SEVER_TIME":"Regular service hours has passed, submitted documents would not be accepted.",
		"SPECIAL_WEATHER":"Affected by typhoon or adverse weather conditions, transaction is currently suspended",
		"SERVICE_ONLOAD":"The connection service timed out, please click 'OK' to refresh the page.",
		"INITIALIZAITON":"Initialisation failed, please click 'OK' to reload.",
		"SYSTEM_EXCEPTION":"[GW]System exception. If you have any questions, please call our Customer Services Hotline at (852) 3768 6888."
	}
}