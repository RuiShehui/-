<!--
 * @Author: ZhangZhen
 * @Date: 2021-12-07 14:39:27
 * @LastEditTime: 2021-12-07 16:14:48
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\src\components\money-input\README.md
-->

# 输入金额

- 描述: 限制金额输入的输入框

- 属性 (props)

```TypeScript
interface Props {
  value: string | number;
  type?: 'text' | 'textarea' | 'number' | 'tel' | 'email';
  placeholder?: string;
  htmlFor: string;
}
```

- 事件 (events)

```TypeScript
interface Events {
  onInput: (e: Event) => void;
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}
```
