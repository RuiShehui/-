import accountOpeningCheck from "./accountOpeningCheck";
import investmentAccountOpeningCheck from "./investmentAccountOpeningCheck"
import accountOpeningReportQuery from "./accountOpeningReportQuery"
import invitationCodeManagement from "./invitationCodeManagement"
import queryATMStatus from "./queryATMStatus"
import queryEbankStatus from "./queryEbankStatus"
import investmentAccountApplyQuery from "./investmentAccountApplyQuery"
import reportQuery from "./reportQuery"
export default {
  path: "/accountOpening",
  component: () => import("@/views/accountOpening/index.vue"),
  meta: {
    title: "AccountOpening",
  },
  children: [
    ...accountOpeningReportQuery,
    ...accountOpeningCheck,
    ...investmentAccountApplyQuery,
    ...investmentAccountOpeningCheck,
    ...queryATMStatus,
    ...queryEbankStatus,
    ...reportQuery,
    ...invitationCodeManagement
  ]
}