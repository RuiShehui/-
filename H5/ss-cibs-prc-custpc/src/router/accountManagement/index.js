/*
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:31
 * @LastEditTime: 2022-05-10 09:55:20
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\accountManagement\index.js
 */
export default [{
    path: "/accountManagement/assetOverview",
    name: "assetOverview",
    component: () => import(`@/views/accountManagement/assetOverview`),
    mate: {
      keepAlive: true
    }
  },
  {
    path: "/accountManagement/accountDetails",
    name: "accountDetails",
    component: () => import(`@/views/accountManagement/accountDetails`)
  },
  {
    path: "/accountManagement/transactionDetailEnquiry",
    name: "transactionDetailEnquiry",
    component: () => import(`@/views/accountManagement/transactionDetailEnquiry`)
  },
  {
    path: "/accountManagement/electronicStatement",
    name: "electronicStatement",
    component: () => import(`@/views/accountManagement/electronicStatement`)
  },
  {
    path: "/accountManagement/toTransactionDetail",
    name: "toTransactionDetail",
    component: () => import(`@/views/accountManagement/toTransactionDetail`)
  },
  {
    path: "/accountManagement/electronicReceipt",
    name: "electronicReceipt",
    component: () => import(`@/views/accountManagement/electronicReceipt`)
  }
]