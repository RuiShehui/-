/*
 * @Author: ZhangZhen
 * @Date: 2022-03-24 15:12:10
 * @LastEditTime: 2022-05-30 13:30:05
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\utils\function.js
 */
import _ from 'lodash';
import i18n from '@/i18n';
// import { filterParams } from '@/utils/tools';
import dataTools from '@/dataTools/tools';
import { IDENTIFY_WAY_MAP, identifyWayList, CREDIT_TYPES, REGISTER_TRANSFER_MAP } from './constant';

function hasScrolled(direction = "vertical") {
	let el = document.getElementsByClassName('bank-main-cont-right-content')[0];
	if (direction == 'vertical') {
		return el.scrollHeight > el.clientHeight;
	}
}

function scrollToTop() {
	let el = document.getElementsByClassName('bank-main-cont-right-content')[0];
	el.scrollTop = 0;
}

/**
 * 校验流动电话的validator
 * @param {} formData vm.bankInfoForm
 */
function checkFlowNum({ countryNo, areaNo, phoneNo }) {
	// TODO 流动电话的校验规则

	return (r, val, cb) => {
		if (!countryNo || !countryNo.length) {
			cb(new Error('countryNo should not be empty'));
			return;
		}
		if (!areaNo || !areaNo.length) {
			cb(new Error('areaNo should not be empty'));
			return;
		}
		if (!phoneNo || !phoneNo.length) {
			cb(new Error('phoneNo should not be empty'));
			return;
		}
		cb();
	}
}
/**
 * 校验电邮地址的validator
 */
function checkEmailAddress({ emailAddress }) {
	// 校验电邮的规则
	const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return (r, val, cb) => {
		if (!emailAddress || !emailAddress.length) {
			cb(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
				input: i18n.t('PAYMENT.EMAIL_ADDRESS')
			})));
			return;
		}
		if (!emailReg.test(emailAddress)) {
			cb(new Error(i18n.t('PAYMENT.EMAIL_NO_VALID')));
			return;
		}
		cb();
	}
}
/**
 * 校验FPS ID 的validator
 */
function checkFpsId(r, val, cb) {
	// TODO 校验FPSid的规则
	if (!val || !val.length) {
		cb(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
			input: 'FPS ID'
		})));
		return;
	}
	cb();
}

function getStepsList({
	changeType = 'add',
	resultStatus = 'success', // success | fail
}) {
	switch (changeType) {
		case 'add':
			return [
				{
					title: i18n.t('PAYMENT.ADD_INFOS'),
					description: ''
				},
				{
					title: i18n.t('PAYMENT.CONFIRM_ADD_INFOS'),
					description: ''
				},
				{
					title: i18n.t('PAYMENT.ADD_RESULT'),
					description: '',
					status: resultStatus
				}
			];
		default:
			return [
				{
					title: i18n.t('PAYMENT.UPDATE_INFOS'),
					description: ''
				},
				{
					title: i18n.t('PAYMENT.CONFIRM_UPDATE_INFOS'),
					description: ''
				},
				{
					title: i18n.t('PAYMENT.UPDATE_RESULT'),
					description: '',
					status: resultStatus
				}
			];
	}
}

function getFastSubmitData(params) {
	const _params = _.cloneDeep(params || {});

	const {
		areaNo = '',
		phoneNo = ''
	} = _params;

	const mobilePhone =
		areaNo.length && phoneNo.length ?
			`${areaNo}-${phoneNo}` :
			'';

	// delete _params.countryNo;
	delete _params.areaNo;
	delete _params.phoneNo;

	return {
		..._params,
		mobilePhone
	};
}

/**
 * 创建-校验金额是否合法的回调函数
 * @param {Vue} ctx
 */
function getValidateAmount(ctx) {
	const formsData = ctx.formsData;
	const invalidList = [undefined, null, NaN];

	if (invalidList.includes[formsData]) {
		throw new Error('property "formsData" must be declared in SFC instance!');
	}

	return (rule, value, callback) => {
		const amount = Number(value);
		const { currbal, isScheduleTx, creditCcy, debitCcy, ccy } = formsData;
		/** 转账金额的内容存在 */
		if (!value) {
			callback(new Error(i18n.t('COMMON.PLEASE_INPUT_SOMETHING', {
				input: i18n.t('PAYMENT.TRANSFER_AMOUNT')
			})));
			return;
		}
		/** 转账金额不得小于0 */
		if (amount <= 0) {
			callback(new Error(i18n.t('PAYMENT.AMOUNT_SHOULD_OVER_ZERO')));
			return;
		}
		if (!debitCcy) {
			callback();
			return;
		}
		/**
		 * 转账金额大于付款账户所拥有的金额
		 */
		if (currbal && amount > Number(currbal)) {
			if (!isScheduleTx) {
				callback(new Error(i18n.t('PAYMENT.LACK_OF_BALANCE')));
				return;
			}
		}
		if (formsData.transferAccType === 'intr') {
			if (formsData.creditAcctType !== 'MULTICURRENCY') {
				if ((creditCcy && creditCcy !== debitCcy) || ccy !== debitCcy) {
					callback(new Error(i18n.t('PAYMENT.CURRENCY_NOT_VALID')));
					return;
				}
			}
		} else {
			if ((creditCcy && creditCcy !== debitCcy) || ccy !== debitCcy) {
				callback(new Error(i18n.t('PAYMENT.CURRENCY_NOT_VALID')));
				return;
			}
		}

		callback();
	}
}

function payeeIdentifyMethodFilter(origin) {
	const way = origin.identifyWay || origin.payeeIdentifyMethod || origin.creditAcctIdentificationType;
	switch (way) {
		case IDENTIFY_WAY_MAP.payeeAccount:
			return origin.payeeAccount || origin.creditAcct;
		case IDENTIFY_WAY_MAP.mobilePhone:
			return origin.mobilePhone || origin.flowNumber;
		case IDENTIFY_WAY_MAP.emailAddress:
			return origin.emailAddress;
		case IDENTIFY_WAY_MAP.fpsId:
			return origin.fpsId;
		default:
			return '';
	}
}

function getCreditAcctValue(origin) {
	var way = origin.creditAcctIdentificationType || IDENTIFY_WAY_MAP.payeeAccount;
	switch (way) {
		case IDENTIFY_WAY_MAP.payeeAccount:
			return origin.payeeAccount || origin.creditAcct;
		case IDENTIFY_WAY_MAP.mobilePhone:
			return origin.mobilePhone || origin.flowNumber;
		case IDENTIFY_WAY_MAP.emailAddress:
			return origin.emailAddress;
		case IDENTIFY_WAY_MAP.fpsId:
			return origin.fpsId;
		case IDENTIFY_WAY_MAP.creditCard:
			return origin.creditAcct;
		default:
			return '';
	}
}
/**
 * 修改本地跨行付款(FPS/外币)转账提交
 */
function filterIntraBankParams(origin = {}) {

	const {
		debitAcct = '',
		deductAcct = ''
	} = origin;

	return {
		...origin,
		chargeAcct: deductAcct || debitAcct,
		isRegistry: switchBooleanToYN(origin.isRegistry),
		isRetry: switchBooleanToYN(origin.isRetry),
		isScheduleTx: switchBooleanToYN(origin.isScheduleTx),
		identifyWay: getIdentifyWay(origin),
		creditAcct: getCreditAcctValue(origin)
	};

}

// 初始化转账汇款数据
function initPaymentFormData(origin = {}) {
	return {
		...origin,
		isRegistry: switchYNToBoolean(origin.isRegistry),
		isRetry: switchYNToBoolean(origin.isRetry),
		isScheduleTx: switchYNToBoolean(origin.isScheduleTx),
		// identifyWay: getIdentifyWay(origin),
		// creditAcct: getCreditAcctValue(origin),

	};
}

/**
 * 修改电汇转账提交
 */
function filterRemittanceParams(origin = {}) {
	const {
		// debitAcct = '',
		ccy = '',
		scheduleDate = '',
	} = origin;



	return {
		...origin,
		// // chargeAcct: debitAcct, // 手续费扣款账户, 目前先用付款账户
		creditCcy: ccy,
		isRegistry: switchBooleanToYN(origin.isRegistry),
		isRetry: switchBooleanToYN(origin.isRetry),
		isScheduleTx: switchBooleanToYN(origin.isScheduleTx),
		scheduleDate: dataTools.getYMD(scheduleDate),
		bankCodeType: filterBankCodeType(origin)
	};

	function filterBankCodeType({
		creditBankRegion = '',
		bankCodeType
	}) {
		if (creditBankRegion === 'US') {
			return bankCodeType
		} else {
			switch (creditBankRegion) {
				case 'AU':
					return 'BN';
				case 'CA':
					return 'TC';
				case 'GB':
					return 'SC';
				default:
					return creditBankRegion;
			}
		}

	}

}

/**
 * 初始化电汇的数据
 */
function initRemittanceParams(origin = {}) {
	return {
		...origin,
		isRegistry: switchYNToBoolean(origin.isRegistry),
		isRetry: switchYNToBoolean(origin.isRetry),
		isScheduleTx: switchYNToBoolean(origin.isScheduleTx),
	};
}

function switchBooleanToYN(origin) {
	switch (origin) {
		case true:
			return 'Y';
		default:
			return 'N';
	}
}
/**
 * 根据收款人识别方式获取显示标签
 */
function getIdentifyWay(origin) {
	const way = origin.creditAcctIdentificationType || origin.identifyWay,
		target = identifyWayList.find(item => item.value === way);
	if (target) {
		return target.label;
	}
	return '';
}

function switchYNToBoolean(origin) {
	if (typeof (origin) === 'boolean') {
		return origin;
	}
	switch (origin) {
		case 'Y':
			return true;
		default:
			return false;
	}
}

function transToSubmitInnerParams(origin = {}) {
	return {
		...origin,
		isRegistry: switchBooleanToYN(origin.isRegistry),
		isRetry: switchBooleanToYN(origin.isRetry),
		isScheduleTx: switchBooleanToYN(origin.isScheduleTx),
	};
}

/**
 * 获取收款人类型列表
 * 1. 本人名下演示账户
 * 2. 已登记第三者账户
 * 3. 未登记账户
 */
function getCreditTypeLabel(type) {
	const key = String(type);
	if (CREDIT_TYPES[key]) {
		return CREDIT_TYPES[key];
	}
	return '';
}

/**
 * 使用SwiftCode反显收款银行国家地区, 银行名称, 银行地址
 */
function setTransferBankInfoBySwiftCode(swiftInfo = {}, target) {
	/* const {
		countryCode = '',
		countryShortName = '',
		bankName = '',
		bankAddress = ''
	} = swiftInfo; */
	const mapper = {
		creditBankRegion: 'countryCode',
		// creditBankCode: 'countryCode',
		creditBankName: 'bankName',
		// bankName: 'bankName',
		creditBankAddress: 'bankAddress',
	};

	for (let k in mapper) {
		target[k] = swiftInfo[mapper[k]];
	}
}

function formatAcctNo(origin) {
	const _origin = origin || '';
	const str1 = _origin.slice(0, 3),
		str2 = _origin.slice(3, 5),
		str3 = _origin.slice(5, _origin.length);

	return `${str1}-${str2}-${str3}`;
}

function getChargeAmount({
	chAmount,
	commissionAmt, // 电报/代理费用
	// chargeAmt, // 手续费

	chCCY,
	debitCurrency,
}, self) {
	if (self.payType === 'fast') {
		return `${chCCY} ${chAmount}`;
	}
	return `${commissionAmt && commissionAmt.length ? debitCurrency : ''} ${commissionAmt}`;
}
/**
 * 过滤账户列表
 * @param {[]} list 原列表
 */
function reduceAcctList(list) {
	return list.reduce((prev, cur) => {
		if (!prev.some(
			item => item.acctNo === cur.acctNo &&
				item.cur === cur.cur &&
				item.typeLabel === cur.typeLabel
		)
		) {
			prev.push(cur);
		}
		return prev;
	}, []);
}

/**
 * 将账户信息过滤为收款人信息
 */
function transToCreditAcct(origin = {}) {
	var target = {};

	for (var k in origin) {
		if (REGISTER_TRANSFER_MAP.hasOwnProperty(k)) {
			var tarKey = REGISTER_TRANSFER_MAP[k];
			target[tarKey] = origin[k];
		}
	}
	if (!target.creditAcct) {
		target.creditAcct = getValueByPayeeIdentifyMethod(origin) || origin['payeeAccount'];
	}
	if (!target.creditAcctName) {
		target.creditAcctName = origin['payeeName'];
	}
	return target;

	function getValueByPayeeIdentifyMethod(origin) {
		const {
			payeeIdentifyMethod
		} = origin;
		switch (payeeIdentifyMethod) {
			case IDENTIFY_WAY_MAP.payeeAccount:
				return origin.payeeAccount;
			case IDENTIFY_WAY_MAP.mobilePhone:
				return origin.mobilePhone;
			case IDENTIFY_WAY_MAP.emailAddress:
				return origin.emailAddress;
			case IDENTIFY_WAY_MAP.fpsId:
				return origin.fpsId;
			default:
				return '';
		}
	}
}

/**
 * 格式化授权编码
 */
function formatTransferType(transferType) {
	if (['1', '030101'].includes(transferType)) {
		return '030101';
	}
	if (['2', '03010201'].includes(transferType)) {
		return '03010201';
	}
	if (['3', '03010202'].includes(transferType)) {
		return '03010202';
	}
	if (['4', '030103'].includes(transferType)) {
		return '030103';
	}
	return '';
}
/**
 * 获取转账方式对应的页面路由
 */
function getTransferPath(transferType) {
	if (['1', '030101'].includes(transferType)) {
		return '/bankTransfer/paymentSettlement/intraBankTransfer';
	}
	if (['2', '03010201'].includes(transferType)) {
		return '/bankTransfer/paymentSettlement/fast';
	}
	if (['3', '03010202'].includes(transferType)) {
		return '/bankTransfer/paymentSettlement/localtransfer';
	}
	if (['4', '030103'].includes(transferType)) {
		return '/bankTransfer/paymentSettlement/remittance';
	}
	return '';
}

export {
	hasScrolled,
	scrollToTop,
	checkFlowNum,
	checkEmailAddress,
	checkFpsId,
	getStepsList,
	getFastSubmitData,
	getValidateAmount,
	payeeIdentifyMethodFilter,
	getCreditAcctValue,
	filterIntraBankParams,
	switchYNToBoolean,
	initPaymentFormData,
	transToSubmitInnerParams,
	getCreditTypeLabel,
	getIdentifyWay,
	filterRemittanceParams,
	setTransferBankInfoBySwiftCode,
	initRemittanceParams,
	formatAcctNo,
	getChargeAmount,
	reduceAcctList,
	transToCreditAcct,
	formatTransferType,
	getTransferPath,
}