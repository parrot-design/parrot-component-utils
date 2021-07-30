
import getWindow from './getWindow'; 

export default function getWindowScroll(node: any) {
  const win = getWindow(node);
  //pageXOffset 和 pageYOffset 属性返回文档在窗口左上角水平和垂直方向滚动的像素。
  const scrollLeft = win.pageXOffset;
  const scrollTop = win.pageYOffset;

  return {
    scrollLeft,
    scrollTop,
  };
}