import getComputedStyle from './getComputedStyle';
//判断节点是否滚动
export default function isScrollParent(element: any): boolean {
  const { overflow, overflowX, overflowY } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
