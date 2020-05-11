type Side = "right" | "left";

export const calculateVisibleItems = (
  widths: Array<number>,
  maxWidth: number,
  activeItem: number,
  visibleItems: Array<number>,
  side?: Side
) => {
  // При расширении/сужении экрана, сторона обхода неизвестна
  const isUnknownSide = !side;
  const newVisibleItems: Array<number> = [];

  if (side === "left" || isUnknownSide) {
    // первоначально считаем элементы в левую сторону
    const resultLeftWidth = widths.reduceRight((value, item, index) => {
      // начало отсчета - активный элемент
      if (index > activeItem) return value;

      // если неизвестна сторона обхода, то при доходе к конечному видимому элементу, необходимо развернуться
      if (index < visibleItems[0] && isUnknownSide) return value;

      // добавляем к общей ширине элемент и его margin
      const curWidth = value + item + 20;

      // если ширина не превышает допустимую, то добавляем
      if (curWidth < maxWidth) newVisibleItems.unshift(index);

      return curWidth;
    }, 0);

    // если сторона извесна, то дополнительный обход не нужен
    if (!isUnknownSide) return newVisibleItems;

    // обходим в другую сторону, для расширения видимых элементов
    const resultRightWidth = widths.reduce((value, item, index) => {
      // начало отсчета - активный элемент
      if (index <= activeItem) return value;

      // добавляем к общей ширине элемент и его margin
      const curWidth = value + item + 20;
      console.log(curWidth, maxWidth);

      // если ширина не превышает допустимую, то добавляем
      if (curWidth < maxWidth) newVisibleItems.push(index);

      return curWidth;
    }, resultLeftWidth);

    // если осталась ширина (когда переходим в мобилку), то добавляем элементы справо
    if (resultRightWidth < maxWidth) {
      widths.reduceRight((value, item, index) => {
        // начало отсчета - следующий за видимым элемент
        if (index >= visibleItems[0]) return value;

        // добавляем к общей ширине элемент и его margin
        const curWidth = value + item + 20;

        // если ширина не превышает допустимую, то добавляем
        if (curWidth < maxWidth) newVisibleItems.unshift(index);

        return curWidth;
      }, 0);
    }

    return newVisibleItems;
  }

  // если идем не влево, то вправо
  widths.reduce((value, item, index) => {
    // начало отсчета - активный элемент
    if (index < activeItem) return value;

    // добавляем к общей ширине элемент и его margin
    const curWidth = value + item + 20;

    // если ширина не превышает допустимую, то добавляем
    if (curWidth < maxWidth) newVisibleItems.push(index);

    return curWidth;
  }, 0);

  return newVisibleItems;
};
