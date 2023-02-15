<!--
 * @Author: ZhangZhen
 * @Date: 2022-04-12 15:38:52
 * @LastEditTime: 2022-04-13 15:02:41
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\build.md
-->
# 网银部署文档说明

## 打包项目

  - 执行打包命令 `npm run build`

## 压缩项目 (linux tar包)

  - 执行压缩命令 `tar -zcvf dist.tar.gz dist`

## **MobaXTerm**的使用

 - MobaXTerm存放位置: `Z:\科技开发文件交换\易诚文件交换\常用软件\MobaXterm_Portable_v12.1`

 - 百宝箱说明文件位置: `Z:\科技开发文件交换\02项目资料\2021年项目\06.个人网银\个人网银项目WIKI（百宝箱）.xlsx`

 - 共享文件位置: `???`

## 使用步骤

   - 打开**MobaXTerm**, 首次使用需要先添加相应的hosthost (如果设置过了可以跳过第2步)

   - **设置host**: 点击 **new sessions**, 根据百宝箱设置相应的host配置 (host, username, port, password)

   - 点击已经设置好的**host session**, 点击进入相应的虚拟终端

   - 进入项目的根路径 (具体参考项目配置文件说明), 将项目拉进项目的根路径

   - 项目备份: 通常我们不希望在部署完成意外出错而导致无法回滚的情况发生。因此, 项目备份是不可或缺的

  - - 备份步骤 (在项目根目录下执行, 其中**__DATE__**表示当前日期)

  ``` nginx
  cd wb-backup && mkdir __DATE__ && cd .. ** cp -r webbank/* wb-backup/__DATE__
  ```

  - 解压tar包

  ``` nginx
  tar -zxvf dist.tar.gz
  ```

  - 拷贝项目

  - - 执行下面的命令复制dist文件下的内容到`webbank`中

  ``` nginx
  cp -r dist/* webbbank
  ```

  - 重启nginx

  ``` nginx
  nginx -s reload
  ```
  
  - 删除之前的tar包相关内容 (可选)

  ```
  rm -rf dist dist.tar.gz
  ```
