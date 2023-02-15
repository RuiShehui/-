/**
 * @description 项目中常量声明文件
 * @author ex_yemj
 */
import PAYMENT_APIS from './payment-apis';
import TRANS_DRAFT from './transsaction-draft';
import ACCOUNT_MANAGEMENT from './account-management';
import FUND from './fund';
import PUBLIC from './public';

/**
 * 个人网银API
 */
export const URI = {
  // 公共
  ...PUBLIC,

  // 登錄
  preToken: "/Logon/preToken", //登录前TOKEN获取
  login: "/Logon/login", // 登录验证
  checkFirstPwdForAdmin: "/Logon/checkFirstPwdForAdmin", // 管理员首次登录验证
  getEmailPassword: "/Logon/getEmailPassword", // 获取Email初始密码
  checkEmailPassword: "/Logon/checkEmailPassword", //验证Email初始密码
  checkNewLogonInfo: "/Logon/checkNewLogonInfo", // 检查用户新设置的登录名和登录密码
  setNewLogonInfo: "/Logon/setNewLogonInfo", // 设置用户新设置的登录名和登录密码
  checkUserFirstLogin: "/Logon/checkUserFirstLogin", // 检查用户是否需要首次登录
  verifyImg: "/Logon/verifyImg", // 获取验证码
  logout: "/Logon/logout", // 登出
  getOTPCode: "/Logon/getOTPCode", //获取OTP验证码
  checkOTPCode: "/Logon/checkOTPCode", //验证OTP验证码
  retrieveQuestion: "/Logon/retrieveQuestion", //查询私密问题
  createPrivateAnswer: "/Logon/createPrivateAnswer", // 设置私密问题
  loginValid: "/Logon/loginValid",
  checkHKIDCode4Login: "/Logon/checkHKIDCode4Login", //驗證HKDID
  getNewUserName: '/Retrieve/getNewUserName', // 重置用户名提交
  userType: '/Retrieve/userType', //证件类型
  checkFirstPwd: '/Logon/checkFirstPwd', //首次登录密码验证
  setNewLogonPWD: '/Logon/setNewLogonPWD', //设置用户新登录密码
  checkResetPwd: '/Logon/checkResetPwd', //重置密码验证
  checkResetPwdOTPCode: '/Logon/checkResetPwdOTPCode', //验证OTP验证码
  // setPaymentPrompt: "/common/setPaymentPrompt", //出账消息提醒设置

  upolodfile: '/fileManage/uploadFile',

  //首页
  queryMenuList: "/publicInfo/queryMenuList", // 用户菜单查询
  findBankNoticeInfoList: "/notice/findBankNoticeInfoList", // 银行公告分页查询
  findBankNoticeDetail: "/notice/findBankNoticeDetail", // 银行公告详情
  findMsgNotificationPageList: "/message-notification/findMsgNotificationPageList", // 消息提醒
  updateOneMsgMark: "/message-notification/updateOneMsgMark", // 消息提醒-详情
  updateMultipleMsgMark: "/message-notification/updateMultipleMsgMark", // 消息提醒--清除未读
  findMsgCount: "/message-notification/findMsgCount", // 消息提醒--未读消息条数
  updateUserName: "/IndividualSet/updateUserName", //修改用户名
  updatePwd: "/IndividualSet/updatePwd", // 修改密码
  findShortcutMenuDetail: "/cm-shortcut-menu/findShortcutMenuDetail", //快捷菜单-查询
  updateShortcutMenuInfo: "/cm-shortcut-menu/updateShortcutMenuInfo", //快捷菜单-更新
  findRecentTransferPageList: "/recent-transfer/findRecentTransferPageList", //最近转账记录查询
  findRecentTransferDetail: "/recent-transfer/findRecentTransferDetail", // 最近转账记录详情查询
  getChargeFeeOnline: "/publicInfo/getChargeFeeOnline", // 最近转账记录详情查询
  getTyphoonFlag: "/publicInfo/getTyphoonFlag", // 特殊天气查询-适用于电汇/外币转账
  findAssetsViewDetail: "/accountManagement/accountOverview", //资产视图
  queryUserInfo: "/publicInfo/queryUserInfo", // 用户基本信息查询
  getNow: "/publicInfo/getNow",
  getHsmPublicKey: "/publicInfo/getHsmPublicKey", //获取公钥
  personalVerify: "/Retrieve/personalVerify", // 验证证件类型/证件号码/账户号码
  getPrivateAnswerVerify: '/Retrieve/getPrivateAnswerVerify', // 获取私密问题
  privateAnswerVerify: '/Retrieve/privateAnswerVerify', // 私密答案验证
  retrieveOTPVerify: '/Retrieve/retrieveOTPVerify', // 用户名找回OTP验证
  getRetrieveOTPVerifyCode: '/Retrieve/getRetrieveOTPVerifyCode', //获取OTP验证码----验证手机号
  // mock
  todotasks: "/mock/home/todotasks", //待办任务
  findViewDetail: "/mock/home/findViewDetail", //资产视图

  // 网银管理-授权模板维护
  queryListTemplate: "/corpbank/auth-template/queryListPage", //授权模板维护查询
  saveTemplate: "/corpbank/auth-template/saveInBankManage", //授权模板维护新增
  saveInBankManageAuth: "/corpbank/auth-template/saveInBankManageAuth", //授权模板维护新增——授权
  queryDetailIn: "/corpbank/auth-template/queryDetailIn", //授权模板详情查询
  delAuthTemplateCommit: "/corpbank/auth-template/delAuthTemplateCommit", //授权模板和交易授权设置删除 提交
  delAuthTemplateAuth: "/corpbank/auth-template/delAuthTemplateAuth", //授权模板和交易授权设置删除——授权
  updateAuthTemplateCommit: "/corpbank/auth-template/updateAuthTemplateCommit", //授权模板修改 提交
  updateAuthTemplateAuth: '/corpbank/auth-template/updateAuthTemplateAuth', //授权模板修改 授权
  queryReminder: '/corpbank/auth-trade-auth-setting/queryReminder', // 查询提醒人

  //网银管理-交易授权设置
  queryUserAccNo: "/corpbank/auth-trade-auth-setting/queryUserAccNo", //查询账户
  queryAuthALL: "/corpbank/auth-trade-auth-setting/queryAuthTradeAuthSettingByCondition", //查询账户
  queryMenuBy: "/corpbank/auth-trade-auth-setting/queryMenuByCondition", //查询交易类型和对应的交易授权设置
  addAuthTradeAuthSetting: "/corpbank/auth-trade-auth-setting/addAuthTradeAuthSetting", //添加交易授权设置
  addAuthTradeAuthSettingAuth: "/corpbank/auth-trade-auth-setting/addAuthTradeAuthSettingAuth", //交易授权设置批量新增 授权
  queryTranIsAuthing: "/corpbank/auth-trade-auth-setting/queryTranIsAuthing", //当还有交易待授权时，不能去修改授权模板

  // 网银管理-用户管理
  queryOperationListPage: "/userManagement/queryOperationListPage", //操作员分页查询
  queryOperatorInfo: "/userManagement/queryOperatorInfo", //操作员详情查询(个人当前用户基本详情查询)
  queryMenuPermission: "/userManagement/queryMenuPermission", //个人当前用户菜单权限列表查询
  queryUserAccountLimit: "/userManagement/queryUserAccountLimit", //个人当前用户账户限额查询
  queryAccount: "/userManagement/queryAccountList", //查询个人账户
  queryCstUserAcctList: "/userManagement/queryCstUserAcctList", //查询用户可操作的账号
  queryAccountListLimit: "/userManagement/queryAccountListLimit", //查询个人账户限额
  queryAllOperationList: "/userManagement/queryAllOperationList", //查询用户可操作的账号
  queryMenuAll: "/userManagement/queryMenu", //查询个人菜单(查询所有菜单)
  checkOperatorInfo: "/userManagement/checkOperatorInfo", //检查新增用户信息
  checkAccountLimit: "/userManagement/checkAccountLimit", //校验限额信息
  saveOperatorSubmit: "/userManagement/saveOperatorSubmit", //个人用户新增前置提交(操作员新增)
  saveOperatorAuth: "/userManagement/saveOperatorAuth", //个人用户新增交易已授权
  checkUpdateAuthStatus: "/userManagement/checkUpdateAuthStatus", //检查用户修改信息是否还在授权审批中
  updateOperator: "/userManagement/updateOperator", //修改用户信息前置提交(操作员信息修改)
  updateOperatorAuth: "/userManagement/updateOperatorAuth", //修改用户信息交易已授权
  delelteOperator: "/userManagement/delelteOperator", //删除用户前置提交(操作员删除)
  delelteOperatorAuth: "/userManagement/delelteOperatorAuth", //删除用户交易已授权
  getTopVerificationCode: "/mock/userManagement/getTopVerificationCode", //TOP验证码获取
  otpCodeVerification: "/mock/userManagement/otpCodeVerification", //OTP验证码前置验证
  updateSecret: "/userManagement/updateSecret", //重发密码前置提交
  updateSecretAuth: "/userManagement/updateSecretAuth", //重发密码交易已授权
  updateStatus: "/userManagement/updateStatus", //启用/停用用户前置提交
  updateStatusAuth: "/userManagement/updateStatusAuth", //启用/停用用户前置交易已授权
  operatorDetail: "/userManagement/operatorDetail", //个人用户交易详情查询
  getListCardArea: '/userManagement/getListCardArea', //证件签发地/国家查询
  queryOperatorEncryption: "/userManagement/queryOperatorEncryption", //个人当前用户基本信息加密查询
  queryOperatorInfoOtp: '/userManagement/queryOperatorInfoOtp', //个人当前用户基本详情查询 需要验证OTP

  //网银管理-账户管理
  queryAccountList: "/customerAccountManagement/queryAccountList", //账户列表分页查询
  queryUnregisteredAccount: "/customerAccountManagement/queryUnregisteredAccount", //查询未登记账户
  checkAccountAuthStatus: "/customerAccountManagement/checkAccountAuthStatus", //校验账户是否在授权审批中的状态
  checkInTransitTransaction: "/customerAccountManagement/checkInTransitTransaction", //校验账户是否有在途交易
  updateBindStatus: "/customerAccountManagement/updateBindStatus", //解除登记账户前置提交
  saveRegisteredAccount: "/customerAccountManagement/saveRegisteredAccount", //登记账户前置提交
  saveRegisteredAccountAuth: "/customerAccountManagement/saveRegisteredAccountAuth", //登记账户交易已授权
  updateBindStatusAuth: "/customerAccountManagement/updateBindStatusAuth", //解除登记账户已授权交易提交
  customerAccountDetail: "/customerAccountManagement/customerAccountDetail", //用户账户交易详情查询

  //网银管理-服务限额设置
  queryQuotaInfo: "/setServiceQuota/queryQuotaInfo", //查询服务限额设定
  updateQuotaInfo: "/setServiceQuota/updateQuotaInfo", //更新服务限额设定
  queryQuotaSetResult: "/setServiceQuota/querySetResult", //查询服务限额设置结果
  checkAuthQuata: "/setServiceQuota/checkAuthStt", //判断服务限额设置是否有在授权审批中的交易（含待授权）
  updateQuotaInfoAuth: "/setServiceQuota/updateQuotaInfoAuth", //更新服务设定限额授权
  queryAuthDetails: "/setServiceQuota/queryAuthDetails", //查询授权交易详情

  //网银管理-设定小额转账
  querySetResult: "/setUpSmallTransfer/querySetResult", //查询设定小额转账
  setUpSmallTransferSubmit: "/setUpSmallTransfer/setUpSmallTransferSubmit", //设定小额转账提交
  setUpSmallTransferAuth: "/setUpSmallTransfer/setUpSmallTransferAuth", //设定小额转账授权
  checkAuthStt: "/setUpSmallTransfer/checkAuthStt", //判断设定小额转账是否有在授权审批中的交易（含待授权）
  setUpSmallTransferDetails: '/setUpSmallTransfer/setUpSmallTransferDetails', //设定小额转账交易详情查询

  //网银管理-设置交易提示
  transactionPromptSubmit: "/setTransaction/transactionPromptSubmit", //设置交易指示提交
  transactionPromptAuth: "/setTransaction/transactionPromptAuth", //设置交易指示授权
  transactionPromptQuery: "/setTransaction/transactionPromptQuery", //查询交易指示

  setTransactionPromptSubmit: "/setTransaction/setTransactionPromptSubmit", //设置交易指示提交——需求变更
  setTransactionPromptRecurrence: "/setTransaction/setTransactionPromptRecurrence", //设置交易指示返显-需求变更
  setTransactionPromptQuery: "/setTransaction/setTransactionPromptQuery", //查询交易指示-需求变更
  setTransactionPromptAuth: "/setTransaction/setTransactionPromptAuth", //设置交易指示授权-需求变更

  //网银管理-FPS账户绑定
  bindingCheck: "/FPSAccountBinding/check", //校验数据
  queryBindingInfo: "/FPSAccountBinding/queryBindingInfo", //查询FPS账户绑定信息
  queryT24Info: "/FPSAccountBinding/queryT24Info", //客户信息查询
  getInfo: "/FPSAccountBinding/getInfo", //列表信息查询
  fpsAccountUnbindingSubmit: "/FPSAccountBinding/fpsAccountUnbindingSubmit", //解绑提交
  fpsAccountUnbindingAuth: "/FPSAccountBinding/fpsAccountUnbindingAuth", //解绑授权
  fpsAccountUnbindingAuthDetails: "/FPSAccountBinding/fpsAccountUnbindingAuthDetails", //解绑交易详情查询
  fpsAccountBindingSubmit: "/FPSAccountBinding/fpsAccountBindingSubmit", //绑定（修改）提交
  fpsAccountUpdateSubmit: "/FPSAccountBinding/fpsAccountUpdateSubmit", //绑定（修改）提交
  fpsAccountBindingAuth: "/FPSAccountBinding/fpsAccountBindingAuth", //绑定（修改）授权
  fpsAccountBindingAuthDetails: "/FPSAccountBinding/fpsAccountBindingAuthDetails", // 绑定（修改）交易详情查询
  getAcctInfo: "/FPSAccountBinding/getAcctInfo", //账户信息查询
  getPreviousInfo: "/payment/fps/getPreviousInfo",

  //网银管理-设定EDA
  examineApproveTranc: "/elecAuthorization/examineApproveTranc", //审批交易查询
  haveApprovalUpdateSumbit: "/elecAuthorization/haveApprovalUpdateSumbit", //已审批交易修改提交
  haveApprovalUpdateAuth: "/elecAuthorization/haveApprovalUpdateAuth", //已审批交易修改授权
  sendSmsPassword: "/elecAuthorization/sendSmsPassword", //发送一次性短讯密码
  electronicAuthorization: "/elecAuthorization/electronicAuthorization", //验证一次性短讯密码
  examineApproveTrancOperationSubmit: "/elecAuthorization/examineApproveTrancOperationSubmit", //审批交易操作(同意/拒绝/删除)提交
  operationTransaAuth: "/elecAuthorization/operationTransaAuth", //审批交易操作(同意/拒绝/删除)授权
  operationTransaQuery: "/elecAuthorization/operationTransaQuery", //EDDA交易详情查询

  //网银管理-设置电子结单
  queryElecState: "/elecStatements/queryElecState", //查询电子结单
  updateElecState: "/elecStatements/updateElecState", //修改电子结单校验
  updateElecStateSubmit: "/elecStatements/updateElecStateSubmit", //修改电子结单状态提交
  updateElecStateAuth: '/elecStatements/updateElecStateAuth', //修改电子结单状态授权
  updateElecStateQuery: '/elecStatements/updateElecStateQuery', //修改电子结单状态查询


  // 查询服务
  downLoadApp: '/app/queryUrl', //app下载url查询
  rateSavingQuery: '/query/rateSavingQuery', //储蓄存款利率查询

  //交易明细可查询账户列表
  transactionAccount: '/transactionDetails/select',
  downloadLoop: '/transactionDetails/downloadLoop',


  // 定期存款
  judgeDepositAccount: "/openDeposit/judgeDepositAccount", // 判断当前用户是否有定期账户
  queryAccBalance: "/openDeposit/queryAccBalance", // 付款账户余额查询
  queryAcctListPage: "/openDeposit/queryAcctListPage", // 定期存款账户概览分页
  queryAcctList: "/openDeposit/queryAcctList", // 账户查询列表下拉框
  queryDepositListPage: "/openDeposit/queryDepositListPage", //根据账户和币种分页查询定期存款信息列表 未到期
  queryRate: "/openDeposit/queryRate", // 查询利率
  submitOpen: "/openDeposit/openDepositSubmit", //提交开立普通定期
  queryBookingDetail: "/openDeposit/queryBookingDetail", //定期存款预约编号信息查询
  updateInstructionsAuth: "/openDeposit/updateInstructionsAuth", //修改到期指示授权提交
  updateInstructionsSubmit: "/openDeposit/updateInstructionsSubmit", //修改到期指示验证
  openDepositAuth: "/openDeposit/openDepositAuth", //提交开立普通定期授权
  openQueryAccountList: "/openDeposit/queryAccountList", //定期存款概览查询账户下拉框
  calcRate: "/openDeposit/calcRate", //利息计算
  queryAccountStatus: "/openDeposit/queryAccountStatus", // 账户状态查询
  interestRateQuery: "/openDeposit/interestRateQuery", //查询所有币种的所有产品
  queryTime: "/openDeposit/queryTime", // 查询时间
  openVerify:"/openDeposit/openVerify", // 利息查询

  //授权中心
  queryAuthRecord: '/authcenter/gcTransactionAbstract/queryAuthRecord', //查询授权记录
  queryAllMenu: '/authcenter/gcTransactionAbstract/queryAllMenu', //待我授权-待我授权页面/已授权页面：交易类型查询
  searchAuthRecord: "/authcenter/gcTransactionAbstract/searchAuthRecord", //我的提交/待我授权-交易详情页面
  gcTransactionAbstractAbc: "/authcenter/gcTransactionAbstract/abc", // 查询当前交易是否需要授权，几个人授权
  authInEmpower: '/authcenter/gcTransactionAbstract/authInEmpower', //授权鉴权
  authInSubmit: "/authcenter/gcTransactionAbstract/authInSubmit", //提交鉴权
  transactionRevoke: "/authcenter/gcTransactionAbstract/transactionRevoke", //我的提交-待授权页面：交易撤销
  searchAuthorized: "/authcenter/gcTransactionAbstract/searchAuthorized", //待我授权-已授权页面：已授权交易摘要列表查詢
  searchByAuthorizer: "/authcenter/gcTransactionAbstract/searchByAuthorizer", //待我授权-待我授权页面：待我授权交易摘要列表查詢
  searchBySubmitter: "/authcenter/gcTransactionAbstract/searchBySubmitter", //我的提交-待授权/已结束页面：交易摘要列表查詢
  searchSubmitterInAuthorized: "/authcenter/gcTransactionAbstract/searchSubmitterInAuthorized", //待我授权-已授权页面：提交人查詢
  searchSubmitterInToBeAuth: "/authcenter/gcTransactionAbstract/searchSubmitterInToBeAuth", //待我授权-待我授权页面：提交人查詢
  searchAuther: "/authcenter/gcTransactionAbstract/searchAuther", //待我授权-待我授权页面：提交人查詢（未过滤）
  queryAuthsInManagment: '/authcenter/gcTransactionAbstract/queryAuthsInManagment', //网银管理-待我授权：待授权交易列表查询
  submitManagment: '/authcenter/gcTransactionAbstract/submitManagment', ////网银管理-我提交的：我提交的交易列表查询
  queryTranIsAuth: '/corpbank/auth-trade-auth-setting/queryTranIsAuth', //查询一个交易是否需要授权
  queryDetail: "/authcenter/gcTransactionAbstract/queryDetail", // 授权中心-查询详情
  authExecInterBankTx: "/payment/innerBank/authExecInterBankTx", // 待我授权-行内转账授权
  getInnerBankDetail: "/payment/innerBank/getTransferTransactionInfo", // 行内转账详情
  getFPSDetail: "/payment/fps/FPSTransferDetailQuery", // 转数快详情
  getTelegraphicDetail: "/payment/telegraphic/getTransferTransactionInfo", // 转数快详情
  getChatsDetail: "/payment/chats/getTransferTransactionInfo", // 转数快详情

  ...PAYMENT_APIS,
  ...TRANS_DRAFT,

  //查询服务(外汇牌价)
  cashRateQuery: "/query/cashRateQuery", //外币现钞兑港元牌价
  transferRateQuery: "/query/transferRateQuery", //外币电汇兑港元牌价
  rateQuery: "/query/rateQuery", //利率查询
  //服务中心-银行分行信息查询
  getBranchInfo: "/serviceCenter/getBranchInfo",
  historyQuery: "/mock/seriveQuery/historyQuery", //查询服务-网银交易记录查询

  //申领支票簿
  chequeBookAuth: '/claimChequeBook/chequeBookAuth', //申领支票簿授权
  chequeBookQuery: '/claimChequeBook/chequeBookQuery', //申领支票簿查询
  chequeBookSubmit: '/claimChequeBook/chequeBookSubmit', //申领支票簿提交
  currentAcctDropDown: '/claimChequeBook/currentAcctDropDown', //申领支票簿下拉框查询(往来账户信息下拉框)

  //操作日志查询列表分页查询
  queryListPage: '/operationLog/queryListPage', //操作日志查询列表分页查询(现在用mock数据)
  downloadListAll: '/operationLog/downloadListAll', //操作日志查询列表下载

  //账户管理
  ...ACCOUNT_MANAGEMENT,

  //基金
  ...FUND,

  // 预约交易管理
  transferListQuery: '/schedule/transferListQuery', // 现金管理-预约交易管理
  updateScheduleDateAuth: '/schedule/updateScheduleDateAuth', // 现金管理-预约交易授权
  updateScheduleDateSubmit: '/schedule/updateScheduleDateSubmit', // 现金管理-预约交易录入
  updateScheduleDateDetailQuery: 'schedule/UpdateScheduleDateDetailQuery', // 现金管理-预约交易详情

  //缴付服务
  account: '/orderPay/queryPayAccount', //缴付账单-付款账户列表
  queryPayAccountBalance: '/orderPay/queryPayAccountBalance', //缴付账单-账户余额
  queryMerchantTypeList: '/orderPay/queryMerchantTypeList', //缴付账单-商户类别列表
  queryMerchantList: '/orderPay/queryListPage', //缴付账单-商户名称列表
  accountype: '/mock/payService/billPayment/accountype', //缴付账单-账单类别列表
  myMerchantList: '/orderPay/myMerchantList', //缴付账单-我的商户清单
  alllist: '/orderPay/queryAllMerchantListPage', //缴付账单-全部商户名单
  queryCstMessage: '/orderPay/queryCstMessage', //查询个人客户信息-判断是否需要授权
  orderPayConfirmStep: '/orderPay/orderPayConfirmStep', //缴付账单-信息录入提交
  queryMerchantListPage: '/orderPay/queryMerchantListPage', //我的商户清单分页查询
  saletype: '/mock/payService/highRiskBusiness/saletype', //缴费服务-我的商户清单-商户类别列表查询
  salename: '/mock/payService/highRiskBusiness/salename', //缴费服务-我的商户清单-商户名称列表查询
  typeone: '/mock/payService/highRiskBusiness/type', //缴费服务-我的商户清单-账单类别列表查询
  updateMyMerchantSubmit: '/orderPay/updateMyMerchantSubmit', //缴费服务-我的商户清单-高风险商户录入
  myMerchantDetail:'/orderPay/myMerchantDetail',//查询我的商户清单详情
  deleteMyMerchantSubmit: '/orderPay/deleteMyMerchantSubmit', //繳費服務-刪除
  saveMyMerchantSubmit: '/orderPay/saveMyMerchantSubmit', //繳費服務新增提交
  accountone: '/orderPay/subscribePayQuery', //缴费服务-预约缴付-缴付账单列表
  update: '/orderPay/subscribePayModify', //缴费服务-预约缴付-缴付账单修改
  subscribePayCancel: '/orderPay/subscribePayCancel', //预约缴付取消
  orderPayConfirmDetails: '/orderPay/orderPayConfirmDetails', //缴付账单信息-详情查询
  orderPayDetails:'/orderPay/orderPayDetails', //查询缴付账单详情
  orderPayTranAuth: '/orderPay/orderPayTranAuth', //缴付账单信息-授权
  currencyExchangeAuth: '/foreignExchange/currencyExchangeAuth', //货币兑换已授权交易提交
  findCommFlowList: "/commFlow/findCommFlowList", //网银交易记录分页查询
  querySingleTradeDetail: '/commFlow/querySingleTradeDetail', //网银交易记录详情
  subscribePayModifyAuth: '/orderPay/subscribePayModifyAuth', //预约缴付账单修改-授权
  subscribePayCancelAuth: '/orderPay/subscribePayCancelAuth', //预约缴付取消-授权
  saveMyMerchantAuth: '/orderPay/saveMyMerchantAuth', //新增我的商户授权
  updateMyMerchantAuth: '/orderPay/updateMyMerchantAuth', //修改我的商户授权
  deleteMyMerchantAuth: '/orderPay/deleteMyMerchantAuth', //删除我的商户授权
  queryHighMerTypeList: '/orderPay/queryHighMerTypeList', //我的商户清单-高风险商户类别接口
  isHighRiskMerchant: '/orderPay/isHighRiskMerchant', //是否高风险商户校验
  checkMerchantBillNo: '/orderPay/checkMerchantBillNo', //賬單號碼的校驗
  checkMyMerchantBillNo: '/orderPay/checkMyMerchantBillNo', //我的商户清单-账单号码校验接口
  //外汇-货币兑换
  queryT24AccountDetail: '/foreignExchange/queryT24AccountDetail', //可用结余、账户名称
  queryExchangeRate: '/foreignExchange/queryExchangeRate', //查询货币兑换汇率
  queryAccountListone: '/foreignExchange/queryAccountList', //根据个人客户号/币种查询账户列表
  getAmountCalculation: '/foreignExchange/getAmountCalculation', //买入/卖出金额计算接口
  currencyExchangeVerify: '/foreignExchange/currencyExchangeVerify', //货币兑换验证
  currencyExchange: '/foreignExchange/currencyExchange', //货币兑换前置提交
  currencyExchangeDetails: '/foreignExchange/currencyExchangeDetails', //货币兑换交易详情查询
  currencyExchangeTransRecords: '/foreignExchange/currencyExchangeTransRecords',
  queryUserAcctLimit: '/foreignExchange/queryUserAcctLimit',
  judgeHoliday: "/foreignExchange/judgeHoliday", // 查询节假日
  judgeCurrExchangeDate: "/foreignExchange/judgeCurrExchangeDate",
  //批量转账录入
  acctList: '/bthTran/acctList', //批量转账查询付款账户下拉框
  tsubmit: '/bthTran/submit', //批量转账录入
  transferSubmit: '/bthTran/batchTransferSubmit', //批量转账录入
  paydaySubmit: '/bthTran/batchPaydaySubmit', //批量发薪录入
  getPayeeBankOrOrgList: '/thirdPartyAccountReg/getPayeeBankOrOrgList', //批量转账录入，机构数据下拉框
  computeCharge: '/bthTran/computeCharge', //手续费计算
  queryThirdPartyAccount: '/bthTran/queryThirdPartyAccount', //第三者账户查询
  bthTranPage: '/bthTran/page', //查詢接口
  auth: '/bthTran/auth', //批量转账授权
  transferAuth: '/bthTran/batchTransferAuth', //批量转账授权
  paydayAuth: '/bthTran/batchPaydayAuth', //批量转账授权
  detail: '/bthTran/detail', //查询批次详情
  batchDetail: '/bthTran/batchDetail', //查询批次明细
  upload: "/file/upload", //文件上傳
  executeCharge: "/bthTran/executeCharge", //手续费批处理任务
  executeTransfer: "/bthTran/executeTransfer", //转账批处理任务
  valid: '/bthTran/valid', //批量转账/发薪校验行内账户

  // 外币转账
  requestChatsTx: '/payment/chats/requestChatsTx', // 外币轉賬交易校验请求
  submitChatsTx: '/payment/chats/submitChatsTx', // 外币轉賬交易提交
  authExecChatsTx: "/payment/chats/authExecChatsTx", // 授权
  // 电汇
  requestTelegraphicTx: "/payment/telegraphic/requestTelegraphicTx", // 电汇交易校验请求
  submitTelegraphicTx: "/payment/telegraphic/submitTelegraphicTx", // 电汇交易提交
  authExecTelegraphicTx: "/payment/telegraphic/authExecTelegraphicTx", // 电汇交易授权及执行

  // 最近收款人查询
  recentPayeeQuery: "/recentPayeeMange/recentPayeeQuery",

  remindAutherByEmail: "/corpbank/auth-trade-auth-setting/remindAutherByEmail", // 发送邮件

  generateGetSessionKey: "/generateGetSessionKey.do", // 获取秘钥

  submitApply:"/specialInstructApply/submitApply" //特殊指令
}
//

/**
 * 个人网银交易码
 */
export const TRANCODE = {


}
