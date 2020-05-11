import React from "react";
import { useLocalStore } from "mobx-react";

type MenuStoreType = ReturnType<typeof MenuStore>;

const texts = [
  "ALL",
  "NEW",
  "POPULAR",
  "KENO",
  "TABLE",
  "LOTTERY",
  "ALL",
  "NEW",
  "POPULAR",
  "KENO",
  "TABLE",
  "LOTTERY",
];

const menuItems = texts.map((text) => ({ text, width: 0 }));

const MenuStore = () => ({
  items: menuItems,
  visibleItems: [] as Array<number>,
  activeItem: 0,

  get itemsWidth() {
    return this.items.map((item) => item.width);
  },

  setItems(items: typeof menuItems) {
    this.items = items;
  },

  setVisibleItems(items: Array<number>) {
    this.visibleItems = items;
  },

  changeActiveItem(value: number) {
    this.activeItem = value;
  },

  previousItem() {
    if (this.activeItem - 1 < 0) return this.changeActiveItem(this.items.length - 1);
    this.changeActiveItem(this.activeItem - 1);
  },

  nextItem() {
    if (this.activeItem + 1 === this.items.length) return this.changeActiveItem(0);
    this.changeActiveItem(this.activeItem + 1);
  },
});

const StoreContext = React.createContext({} as MenuStoreType);

type Props = {
  children: React.ReactNode;
};

export const MenuStoreProvider = ({ children }: Props) => {
  const store = useLocalStore(MenuStore);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreContext;
