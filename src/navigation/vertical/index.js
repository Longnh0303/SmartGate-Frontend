const navigation = () => {
  return [
    {
      title: "Home",
      path: "/home",
      icon: "tabler:smart-home",
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
    },
  ];
};

export default navigation;
