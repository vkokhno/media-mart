import React, { useContext, useState, useRef, useEffect } from "react";

import StoreContext from "store";

import "./styles.css";

const Test = () => {
  const { items, setItems } = useContext(StoreContext);
  const [isOver, setIsOver] = useState(false);
  const testElement = useRef<HTMLDivElement>(null);

  // узнаем ширины элементов
  useEffect(() => {
    setItems(
      items.map((item) => {
        const node = testElement.current!;
        node.textContent = item.text;
        return { ...item, width: node.offsetWidth };
      })
    );
    // удаляем блок из dom'a
    setIsOver(true);
  }, []);

  return !isOver ? <div className="test" ref={testElement} /> : null;
};

export default Test;
