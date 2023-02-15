/*
 * @Author: your name
 * @Date: 2022-05-09 09:59:53
 * @LastEditTime: 2022-05-09 10:01:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\openFixed\components\openFix\utils\acccoutFormatter.js
 */


function formatAcctNo(origin) {
	const _origin = origin || '';
	const str1 = _origin.slice(0, 3),
		str2 = _origin.slice(3, 5),
		str3 = _origin.slice(5, _origin.length);

	return `${str1}-${str2}-${str3}`;
}

export {
  formatAcctNo
}