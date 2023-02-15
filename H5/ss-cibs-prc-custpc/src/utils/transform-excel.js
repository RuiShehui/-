/*
 * @Author: ZhangZhen
 * @Date: 2021-11-30 16:36:14
 * @LastEditTime: 2022-03-09 10:19:47
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\transform-excel.js
 */
// import { ShowMessage } from '@/plugins';
import i18n from '@/i18n';
function excelUtils() {
  const XLSX = window.XLSX;

  /**
   * 获取excel文件的表头数据和表单数据
   * @param {} data 原始数据
   * @param {} type 导入的类型
   * @param {number} maxSizeLen 导出的最大数量限制
   */
  function readXlsx(data, type, maxSizeLen = 500) {
    const workbook = XLSX.read(data, { type, charCodeAt: 'utf-8' });
    console.log("1-1", workbook);
    const firstSheetName = workbook.SheetNames[0];
    console.log("1-2", firstSheetName);
    const worksheet = workbook.Sheets[firstSheetName];
    console.log("1-3", worksheet);
    // const header = _getHeaderRow(worksheet);
    const headers =["Sequence Number", "debitAcctName", "bankCode", "bankName", "debitAcct", "amount", "additionalComment"]
    console.log("1-4", headers);
    const results = XLSX.utils.sheet_to_json(worksheet,{header:headers});

    console.log("1-5", results);
    const result = results.slice(1);
    console.log("1-6", result);
    var messageErr = ''
    if (result.length > maxSizeLen) {
      messageErr = i18n.t('BRANCH_TRANSFER.FILE_ERROR')
      return {
        headers,
        result: [],
        messageErr
      };
    }

    return {
      headers,
      result,
    };
  }

  /**
   * 根据数据导出excel表格
   * @interface IExportArrayToExcel { key: string; data: Buffer; title: string; filename?: string }
   */
  function exportArrayToExcel({
    key,
    data,
    title,
    filename = 'template',
  }) {
    const wb = XLSX.utils.book_new();
    const arr = jsonToArray(key, data);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    console.log(arr, ws, wb);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }

  function jsonToArray(key, jsonData) {
    return jsonData.map(v => key.map(j => v[j]));
  }

  /**
   * 获取EXCEL表头数据
   */
  function _getHeaderRow(sheet) {
    // const headers = [];
    // const range = XLSX.utils.decode_range(sheet['!ref']);
    // console.log('range',range)
    
    // const R = range.s.r;
    // console.log('R',R)

    // for (let C = range.s.c; C <= range.e.c; ++C) {
    //   let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })],
    //     hdr = `UNKNOWN COLLUMN_ITEM: ${C}`;

    //   if (cell && cell.t) {
    //     hdr = XLSX.utils.format_cell(cell);
    //   }
    //   headers.push(hdr);
    // }
    // console.log('headers',headers)
    const headers =["Sequence Number", "debitAcctName", "bankCode", "bankName", "debitAcctName", "amount", "additionalComment"]
    return headers;
  }

  return {
    readXlsx,
    exportArrayToExcel,
  };
}

export default excelUtils;
