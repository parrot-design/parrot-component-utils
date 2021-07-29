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
function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
}

//判断节点是否滚动
function isScrollParent(element) {
    const { overflow, overflowX, overflowY } = getComputedStyle$1(element);
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

function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getContainingBlock(element) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    const isIE = navigator.userAgent.indexOf('Trident') !== -1;
    if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        const elementCss = getComputedStyle(element);
        if (elementCss.position === 'fixed') {
            return null;
        }
    }
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) &&
        ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        const css = getComputedStyle(currentNode);
        // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
        if (css.transform !== 'none' ||
            css.perspective !== 'none' ||
            css.contain === 'paint' ||
            ['transform', 'perspective'].indexOf(css.willChange) !== -1 ||
            (isFirefox && css.willChange === 'filter') ||
            (isFirefox && css.filter && css.filter !== 'none')) {
            return currentNode;
        }
        else {
            currentNode = currentNode.parentNode;
        }
    }
    return null;
}
function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) ||
        getComputedStyle(element).position === 'fixed') {
        return null;
    }
    return element.offsetParent;
}
//获取最近的祖先定位元素。处理一些边缘情况，
function getOffsetParent(element) {
    const window = getWindow(element);
    let offsetParent = getTrueOffsetParent(element);
    while (offsetParent &&
        isTableElement(offsetParent) &&
        getComputedStyle(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent &&
        (getNodeName(offsetParent) === 'html' ||
            (getNodeName(offsetParent) === 'body' &&
                getComputedStyle(offsetParent).position === 'static'))) {
        return window;
    }
    return offsetParent || getContainingBlock(element);
}

export { getComputedStyle$1 as getComputedStyle, getDocumentElement, getNodeName, getOffsetParent, getParentNode, getScrollParent, getWindow, isElement, isHTMLElement, isScrollParent, isShadowRoot, listScrollParents, reflow };
