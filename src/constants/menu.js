export const menuData = [
  {
    id: "collections",
    icon: "iconsminds-library",
    label: "menu.collections",
    to: "/app/collections"
  },
];

export const loginMenuData = [
  {
    id: "collections",
    icon: "iconsminds-library",
    label: "menu.collections",
    to: "/app/collections"
  },
  {
    id: "assets",
    icon: "iconsminds-bucket",
    label: "menu.assets",
    to: "/app/assets",
    subs: [
      {
        icon: "simple-icon-briefcase",
        label: "menu.my-collections",
        to: "/app/assets/my-collections"
      },
      {
        icon: "simple-icon-pie-chart",
        label: "menu.new-card",
        to: "/app/assets/new-card"
      },
      {
        icon: "iconsminds-library",
        label: "menu.my-cards",
        to: "/app/assets/my-cards"
      },
      {
        icon: "iconsminds-quotes",
        label: "menu.transactions",
        to: "/app/assets/transactions"
      }
    ]
  },
  {
    id: "chaindiscover",
    icon: "iconsminds-library",
    label: "menu.chain-discover",
    to: "/app/chain-discover"
  },
];
