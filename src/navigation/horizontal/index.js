const navigation = () => [
  {
    title: "Home",
    path: "/home",
    icon: "tabler:smart-home",
  },
  {
    title: "Quản lý tài khoản",
    path: "/user-page",
    icon: "tabler:user",
  },
  {
    path: "/acl",
    action: "read",
    subject: "acl-page",
    title: "Access Control",
    icon: "tabler:shield",
  },
];

export default navigation;
