
export default [
    {
        path: "invitationCodeManagement",
        name: "InvitationCodeManagement",
        component: () => import("@/views/accountOpening/invitationCodeManagement/index.vue"),
        meta: {
            title: "InvitationCodeManagement"
        }
    },
    {
        path: "invitationCodeManagement/detail",
        name: "InvitationCodeDetail",
        component: () => import("@/views/accountOpening/invitationCodeManagement/invitationCodeManagement-detail.vue"),
        meta: {
            title: "InvitationCodeDetail"
        },
        hidden: true
    },
    {
        path: "invitationCodeManagement/add",
        name: "InvitationCodeAdd",
        component: () => import("@/views/accountOpening/invitationCodeManagement/invitationCodeManagement-add.vue"),
        meta: {
            title: "InvitationCodeAdd"
        },
        hidden: true
    },
    {
        path: "invitationCodeManagement/update",
        name: "InvitationCodeUpdate",
        component: () => import("@/views/accountOpening/invitationCodeManagement/invitationCodeManagement-add.vue"),
        meta: {
            title: "InvitationCodeUpdate"
        },
        hidden: true
    },
]