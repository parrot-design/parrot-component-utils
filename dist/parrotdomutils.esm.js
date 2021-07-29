function reflow(node) { return node.scrollTop; }

//获取window对象
function getWindow(node) {
    if (node === null) {
        return window;
    }
    if (node.toString() !== '[object Window]') {
        const ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
}

//判断是否是节点
function isElement(node) {
    const OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
}
//判断是否是html节点
function isHTMLElement(node) {
    const OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
}
//判断是否是
function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
        return false;
    }
    const OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
}

//获取当前节点的名称
function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
}

//一个会返回文档对象（document）的根元素的只读属性如<html>
function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}

//获取父节点
function getParentNode(element) {
    if (getNodeName(element) === 'html') {
        return element;
    }
    return (element.assignedSlot ||
        element.parentNode ||
        (isShadowRoot(element) ? element.host : null) ||
        getDocumentElement(element));
}

//返回一个包含元素所有 CSS 属性值的对象
function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
}

//判断节点是否滚动
function isScrollParent(element) {
    const { overflow, overflowX, overflowY } = getComputedStyle(element);
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

//获取滚动属性的父节点
function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
    }
    if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
    }
    return getScrollParent(getParentNode(node));
}

function listScrollParents(element, list = []) {
    var _a;
    const scrollParent = getScrollParent(element);
    const isBody = scrollParent === ((_a = element.ownerDocument) === null || _a === void 0 ? void 0 : _a.body);
    const win = getWindow(scrollParent);
    const target = isBody
        ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : [])
        : scrollParent;
    const updatedList = list.concat(target);
    return isBody
        ? updatedList
        : updatedList.concat(listScrollParents(getParentNode(target)));
}

export { getComputedStyle, getDocumentElement, getNodeName, getParentNode, getScrollParent, getWindow, isElement, isHTMLElement, isScrollParent, isShadowRoot, listScrollParents, reflow };
