import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import getWindow from './getWindow'; 
import isScrollParent from './isScrollParent';

export default function listScrollParents(
    element: Node,
    list: Array<Element | Window> = []
  ): Array<Element | Window> {
    const scrollParent = getScrollParent(element);
    const isBody = scrollParent === element.ownerDocument?.body;
    const win = getWindow(scrollParent);
    const target = isBody
      ? [win].concat(
          win.visualViewport || [],
          isScrollParent(scrollParent) ? scrollParent : []
        )
      : scrollParent;
    const updatedList = list.concat(target);
  
    return isBody
      ? updatedList
      : updatedList.concat(listScrollParents(getParentNode(target)));
  }