export default function throttle(
  fn,
  wait,
  { leading = true, trailing = true } = {}
) {
  // result 记录method的执行返回值
  let timeout, result;
  // 记录上次原函数执行的时间（非每次更新）
  let methodPrevious = 0;
  // 记录上次回调触发时间（每次都更新）
  let throttledPrevious = 0;
  let throttled = function(...args) {
    let context = this;
    // 使用Promise，可以在触发回调时拿到原函数执行的返回值
    return new Promise(resolve => {
      let now = new Date().getTime();
      // 两次相邻触发的间隔
      let interval = now - throttledPrevious;
      // 更新本次触发时间供下次使用
      throttledPrevious = now;
      // 重置methodPrevious为now，remaining = wait > 0，假装刚执行过，实现禁止立即执行
      // 统一条件：leading为false
      // 加上以下条件之一
      // 1. 首次触发（此时methodPrevious为0）
      // 2. trailing为true时，停止触发时间超过wait，定时器内函数执行（methodPrevious被置为0），然后再次触发
      // 3. trailing为false时（不设定时器，methodPrevious不会被置为0），停止触发时间超过wait后再次触发（interval > wait）
      if (leading === false && (!methodPrevious || interval > wait)) {
        methodPrevious = now;
        // 保险起见，清除定时器并置为null
        // 假装刚执行过要假装的彻底XD
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      }
      // 距离下次执行原函数的间隔
      let remaining = wait - (now - methodPrevious);
      // 1. leading为true时，首次触发就立即执行
      // 2. 到达下次执行原函数时间
      // 3. 修改了系统时间
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        // 更新对比时间戳，执行函数并记录返回值，传给resolve
        methodPrevious = now;
        result = fn.apply(context, args);
        resolve(result);
        // 解除引用，防止内存泄漏
        if (!timeout) context = args = null;
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(() => {
          // leading为false时将methodPrevious设为0的目的在于
          // 若不将methodPrevious设为0，如果定时器触发后很长时间没有触发回调
          // 下次触发时的remaining为负，原函数会立即执行，违反了leading为false的设定
          methodPrevious = leading === false ? 0 : new Date().getTime();
          timeout = null;
          result = fn.apply(context, args);
          resolve(result);
          // 解除引用，防止内存泄漏
          if (!timeout) context = args = null;
        }, remaining);
      }
    });
  };
  // 加入取消功能，使用方法如下
  // let throttledFn = throttle(otherFn)
  // throttledFn.cancel()
  throttled.cancel = function() {
    clearTimeout(timeout);
    // previous = 0;
    timeout = null;
  };

  return throttled;
}
