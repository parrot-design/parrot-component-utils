import getParentNode from './getParentNode';
import isScrollParent from './isScrollParent';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';

//获取滚动属性的父节点
export default function getScrollParent(node: any): HTMLElement {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return (node as HTMLElement);
  }

  return getScrollParent(getParentNode(node));
}