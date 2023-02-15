/*
 * @Author: ZhangZhen
 * @Date: 2022-05-12 14:05:09
 * @LastEditTime: 2022-05-18 12:39:48
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\utils\pdf-generator\index.js
 */
import {
  isType,
  getTotalTemplate,
  getAllStyles
} from './utils';

const html2canvas = window.html2canvas;
const jspdf = window.jspdf,
  {
    jsPDF
  } = jspdf;

const rootElId = 'rootEl';
const docElement = document.documentElement || document.body;

class PDFGenerator {

  /** @type {{}} inner options */
  _options = {};
  /** @type {HTMLElement} root element */
  _rootEl;

  constructor(options) {
    if (!isType(options, 'Object')) {
      throw new TypeError('arguments[0] "options" should be an object for class "PDFGenerator"');
    }
    /* downloaded pdf's title */
    this._options.title = options.title || 'Pdf template';
    /* downloaded pdf's template */
    this._options.template = options.template || '<h1>template</h1>';
    /* downloaded pdf's scale, defaultValue: 1 */
    this._options.scale = options.scale || 1;
    /** set _options className */
    this._options.className = options.className || 'pdf-wrapper';

    this.init();
  }

  init() {
    this._initEl();
  }
  /** init root element */
  _initEl() {
    /** remove pre */
    document.getElementById(rootElId) &&
      document.getElementById(rootElId).remove();
    /** set current root element */
    const rootEl = document.createElement('div');
    rootEl.id = rootElId;
    docElement.appendChild(rootEl);
    this._rootEl = rootEl;
  }
  /**
   * @public preview
   * @param {HTMLElement} el 传进来的元素
   */
  async preview(el) {
    this._rootEl.innerHTML = getTotalTemplate({
      template: el && `<div class="${el.className}">${el.innerHTML}</div>` || this._options.template || `<h1>TEMPLATE</h1>`,
      style: getAllStyles()
    });
    const canvas = await this._getNewCanvas(this._rootEl),
      img = canvas.toDataURL('img/png', 1);

    window.open(img);
  }
  /**
   * @public download
   * @param { HTMLElement } el render-element
   */
  async download(el) {
    this._rootEl.innerHTML = getTotalTemplate({
      template: el && `<div class="${this._options.className}">${el.innerHTML}</div>` || this._options.template || `<h1>TEMPLATE</h1>`,
      style: getAllStyles()
    });
    // console.log(this._rootEl.innerHTML);
    const canvas = await this._getNewCanvas(this._rootEl);
    this._rootEl.style.display = 'none';
    this._createPDF(canvas);
  }
  /**
   * create pdf's canvas
   * @param { HTMLElement } el render-element
   * @return { Promise<HTMLCanvasElement> }
   */
  async _getNewCanvas(el) {
    if (!html2canvas) {
      return;
    }
    console.log(this._options);
    const scale = this._options.scale || 3,
      canvas = document.createElement('canvas');

    const context = canvas.getContext('2d'),
      elWidth = el.clientWidth,
      elHeight = el.clientHeight;

    canvas.width = elWidth;
    canvas.height = elHeight;
    // canvas.style.width = elWidth + 'px';
    // canvas.style.height = elHeight + 'px';

    context.scale(scale, scale);

    const opts = {
      scale,
      width: elWidth,
      height: elHeight,
      canvas,
      useCORS: true,
      backgroundColor: '#fff'
    };

    return await html2canvas(el, {
      ...opts,
    });
  }
  /**
   * add pdf img && download pdf by canvas
   * @param {HTMLCanvasElement} canvas
   */
  _createPDF(canvas) {
    if (!canvas) {
      return;
    }
    const contentWidth = canvas.width,
      contentHeight = canvas.height;

    const pdf = new jsPDF('l', 'px', [contentWidth, contentHeight]);
    const img = canvas.toDataURL('img/png', 1);

    pdf.addImage(img, 0, 0, contentWidth, contentHeight);
    pdf.save(`${this._options.title || 'template'}.pdf`);
  }
}

function createPdf({
  title = 'template',
  template = '<h1>PDF TEMPLATE</h1>',
  className = 'pdf-wrapper'
}) {
  return new PDFGenerator({
    title,
    template,
    className,
  });
}

/**
 * Vue.prototype.$pdf = createPdf
 * 
 * @usage
 * this.$pdf({ title: 'xxx', template: 'dsadsadsa' }).download()
 * 
 * 需要下载的内容: <div ref="pdf" class="pdf-wrapper"></div>
 */

export default createPdf;