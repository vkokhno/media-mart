import React, { useContext, useState, useRef, useEffect, useLayoutEffect } from "react";
import { autorun } from "mobx";
import { useObserver } from "mobx-react";
import { throttle } from "lodash-es";
import cn from "classnames";

import StoreContext from "store";
import { calculateVisibleItems } from "utils";

import "./styles.css";

const Navigation = () => {
  const store = useContext(StoreContext);
  const [maxWidth, setMaxWidth] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  // вешаем евент на ресайз
  useLayoutEffect(() => {
    const getWidth = () => setMaxWidth(list.current!.offsetWidth);

    getWidth();
    window.addEventListener("resize", throttle(getWidth, 200));

    return () => window.removeEventListener("resize", getWidth);
  }, []);

  // если меняется активный элемент, то проверяем его
  useEffect(() => {
    const { activeItem, visibleItems, itemsWidth, setVisibleItems } = store;

    // если не выходили за границу видимых элементов, то ничего не делаем
    if (activeItem >= visibleItems[0] && activeItem <= visibleItems[visibleItems.length - 1]) return;

    // если вышли за границу влево, то делаем пересчет видимых элементов вправо
    if (activeItem - visibleItems[0] < 0) {
      setVisibleItems(calculateVisibleItems(itemsWidth, maxWidth, activeItem, visibleItems, "right"));
    } else {
      // иначе влево
      setVisibleItems(calculateVisibleItems(itemsWidth, maxWidth, activeItem, visibleItems, "left"));
    }
  }, [store.activeItem]);

  // если изменилась ширина, то делаем пересчет
  useLayoutEffect(() => {
    store.setVisibleItems(calculateVisibleItems(store.itemsWidth, maxWidth, store.activeItem, store.visibleItems));
  }, [maxWidth]);

  // после изменения массива видимых элементов, необходимо переписать стили
  useEffect(
    () =>
      autorun(() => {
        Array.prototype.forEach.call(list.current?.children[0].children, (item) => (item.style.display = "none"));
        Array.prototype.forEach.call(store.visibleItems, (item) => {
          const node = list.current?.children[0].children[item] as HTMLElement;
          node.style.display = "block";
        });
      }),
    [store.visibleItems]
  );

  return useObserver(() => (
    <nav className="navigation">
      <button onClick={store.previousItem}>{"<"}</button>
      <div className="navigation__items" ref={list}>
        <div>
          {store.items.map(({ text }, index: number) => (
            <div
              className={cn("navigation__item", {
                active: store.activeItem === index,
              })}
              onClick={() => store.changeActiveItem(index)}
              key={index}
            >
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={store.nextItem}>{">"}</button>
    </nav>
  ));
};

export default Navigation;
