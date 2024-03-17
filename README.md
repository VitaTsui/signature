# [Signature](https://github.com/VitaTsui/signature.git)

## 前言

`Signature` 一个适用于 React 的签字板

## 效果

![竖屏](/image/竖屏.png)
![横屏](/image/横屏.png)

## 安装

```sh
npm install --save @hsu-react/signature
# 或
yarn add @hsu-react/signature
```

## 使用

```react
import Signature from "@hsu-react/signature";

const App:React.FC = () => {
  return (
    <Signature />
  );
}
```

## 参数

| 参数       | 说明         | 类型                                      | 默认值 |
| ---------- | ------------ | ----------------------------------------- | ------ |
| onConfirm  | 点击确认回调 | (src: string, blob: Blob \| null) => void | -      |
| onCancel   | 点击取消回调 | () => void                                | -      |
| horizontal | 是否横屏     | boolean                                   | false  |
| visible    | 是否显示     | boolean                                   | false  |
