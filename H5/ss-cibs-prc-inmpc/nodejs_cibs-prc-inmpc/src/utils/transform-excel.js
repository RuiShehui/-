/*
 * @Author: ZhangZhen
 * @Date: 2021-11-30 16:36:14
 * @LastEditTime: 2022-06-09 08:53:59
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\transform-excel.js
 */
import { ShowMessage } from '@/plugins';

/**
 * Excel相关的工具
 */
function excelUtils() {
  const XLSX = window.XLSX;

  /**
   * 获取excel文件的表头数据和表单数据
   * @param {} data 原始数据
   * @param {} type 导入的类型
   * @param {number} maxSizeLen 导出的最大数量限制
   */
  function readXlsx(data, type, maxSizeLen = 999999) {
    const workbook = XLSX.read(data, { type, charCodeAt: 'utf-8' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = _getHeaderRow(worksheet);
    const result = XLSX.utils.sheet_to_json(worksheet);

    if (result.length > maxSizeLen) {
      ShowMessage({
        message: `单次上传数据不能超过${maxSizeLen}条`,
        type: 'error'
      });
      return {
        header,
        result: [],
      };
    }

    return {
      header,
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
    // console.log(arr, ws, wb);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }
  /**
   * json-to-array
   */
  function jsonToArray(key, jsonData) {
    return jsonData.map(v => key.map(j => v[j]));
  }

  /**
   * 获取EXCEL表头数据
   */
  function _getHeaderRow(sheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    
    const R = range.s.r;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })],
        hdr = `UNKNOWN COLLUMN_ITEM: ${C}`;

      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
      }
      headers.push(hdr);
    }

    return headers;
  }

  return {
    readXlsx,
    exportArrayToExcel,
  };
}

export default excelUtils;
