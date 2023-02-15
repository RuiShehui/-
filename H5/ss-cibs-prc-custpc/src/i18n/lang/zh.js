/*
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-01 14:47:06

 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\i18n\lang\zh.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
import business from "../_businessManagement/zh";
import accountManagement from "../accountManagement/zh";
import payService from "../payService/zh";
import logon from "../login/zh";
import invest from "../invest/zh";
import transferRemittance from "../transferRemittance/zh";
import internationalBusiness from "../internationalBusiness/zh";
import home from "../home/zh";
import applyCheckBoock from "../applyCheckbook/zh";
import userManagement from "../userManagement/zh";
import user from "../user/zh";
import fixed from "../fixed/zh"
import bathTransfer from '../batch-transfer/zh'
import authorizeCenter from '../authorizeCenter/zh.js'
import specialIntruction from "../speacialInstruction/zh";
export default {
  ...business,
  ...accountManagement,
  ...transferRemittance,
  ...home,
  ...payService,
  ...logon,
  ...invest,
  ...internationalBusiness,
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
	"TIPS":"温馨提示",
	"DETERMINE":"确定",
	"CANCEL":"取消",
	"CONFIRM":"确认",
	"SUBMIT":"提交",
	"COMPLETE":"完成",
	"PREVIOUS_STEP":"上一步",
	"NEXT_STEP":"下一步",
	"TRANSACTION_SUCCESS":"交易成功",
	"EXIT":"退出",
	"REMIND":"提醒",
	"SEARCH":"查询",
	"RESET":"重设",
	"ADD":"新增",
	"DETAIL":"详情",
	"REEDIT":"重新编辑",
	"REVOKE":"撤销",
	"COPY":"复制",
	"OPERATION":"操作",
	"UPLOAD":"上传",
	"RESET_PASSWORD":"重置密码",
	"DELETE":"删除",
	"UPDATE":"修改",
	"PLEASE_SELECT":"请选择",
	"PLEASE_SELECT_SOMETHING":"请选择%{select}",
	"SERIAL_NUMBER":"序号",
	"BACK":"返回",
	"UPLOAD_TYPE_ERROR":"上传格式有误",
	"START_TIME":"开始时间",
	"END_TIME":"结束时间",
	"START_DATE":"开始日期",
	"END_DATE":"结束日期",
	"DATESPAN_TO":"至",
	"PLEASE_INPUT":"请输入",
	"PLEASE_INPUT_SOMETHING":"请输入%{input}",
	"SELECT_LANGS":"请选择语言",
		"PREPEAR_HANDLE":"待处理",
		"IS_HANDLED":"已处理",
		"QUERY_INTERVAL":"查询时期不可超过90天。",
		"EMAIL_CONTENT_INVALID":"邮箱的内容有误",
		"EMAIL_NOT_ALLOW_EMPTY":"邮箱的内容不得为空",
		"EMAIL_FORMAT_INVALID":"电邮地址格式错误",
		"INIT_DATA_SUCCESS":"初始化数据成功",
		"CHECK_FAIL":"校验失败",
		"SOMETHING_SUCCESS":"%{op}成功",
		"SOMETHING_FAIL":"%{op}失败",
		"UPDATE_SUCCESS":"更新成功",
		"ADD_SUCCESS":"新增成功！",
		"DELETE_SUCCESS":"删除成功！",
		"TRADE_TYPE":"交易类型",
		"TRADE_STATUS":"交易状态",
		"SUBMITTER":"提交人",
		"SUBMIT_TIME":"提交时间",
		"AUTHORIZATION_STATUS":"授权状态",
		"CREATE_TIME":"创建时间",
		"MONEY":"金额",
		"STEPS_FILL_INFORMATION":"填写信息",
		"STEPS_COMFIRM_INFORMATION":"确认信息",
		"STEPS_RESULT_INFORMATION":"交易结果",
		"TRANSACTION_DETAIL":"交易详情",
		"AGREE":"接受",
		"DISAGREE":"不接受",
		"PHONE_NUMBER":"电话号码",
		"TOTAL":"全部",
		"FINISH":"完成",
		"YES":"是",
		"NO":"否",
		"RECENT_7_DAYS":"最近7日",
		"RECENT_14_DAYS":"最近14日",
		"RECENT_30_DAYS":"最近30日",
		"WITHOUT_DATA":"暂无数据",
		"SUBMIT_SUCCESS":"提交成功",
		"SUBMIT_FAIL":"提交失败",
		"OTP_ERROR":"一次性短讯密码不正确。如连续3次输入错误或逾时的一次性短讯密码，该笔交易将自动取消。",
		"CONFIRM_DELETE_SOMETHING":"确认删除%{content}",
		"GET_VR_CODE":"获取验证码",
		"FLOW_NO":"参考编号",
		"NOT_SEVER_TIME":"服务时间外递交之指示将不会被接受",
		"SPECIAL_WEATHER":"受台风或恶劣天气影响，当前已暂停交易",
		"SERVICE_ONLOAD":"连接服务`逾时，请按「确定」刷新页面。",
		"INITIALIZAITON":"初始化失败了，请按「确定」重新加载。",
		"SYSTEM_EXCEPTION":"[GW]系统异常，如有疑问，请致电本行客户服务热线(852)3768 6888。"
	}
}