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

export { getWindow, isElement, isHTMLElement, isShadowRoot, reflow };
