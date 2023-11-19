const navigation = () => {
  return [
    {
      title: "Thống kê",
      path: "/home",
      icon: "tabler:layout-dashboard",
      action: "read",
      subject: "home-page",
    },
    {
      title: "Quản lý tài khoản",
      path: "/user",
      icon: "tabler:user",
    },
    {
      title: "Quản lý thẻ RFID",
      path: "/rfid",
      icon: "tabler:id",
    },
    {
      title: "Lịch sử vào/ra",
      path: "/history",
      icon: "tabler:history",
      action: "read",
      subject: "history-page",
    },
    {
      title: "Quản lý thiết bị",
      path: "/devices",
      icon: "tabler:door-enter",
    },
    {
      title: "Giám sát hoạt động",
      path: "/real-time",
      icon: "tabler:device-tv",
      action: "read",
      subject: "real-time-page",
    },
  ];
};

export default navigation;
