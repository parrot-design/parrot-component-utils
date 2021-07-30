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

function getBoundingClientRect(element) {
    const rect = element.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        x: rect.left,
        y: rect.top,
    };
}

//该元素是否包含另一个元素
function contains(parent, child) {
    //方法返回上下文中的根节点
    const rootNode = child.getRootNode && child.getRootNode();
    // First, attempt with faster native method
    if (parent.contains(child)) {
        return true;
    }
    // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        let next = child;
        do {
            if (next && parent.isSameNode(next)) {
                return true;
            }
            // $FlowFixMe[prop-missing]: need a better way to handle this...
            next = next.parentNode || next.host;
        } while (next);
    }
    // Give up, the result is false
    return false;
}

function getWindowScroll(node) {
    const win = getWindow(node);
    //pageXOffset 和 pageYOffset 属性返回文档在窗口左上角水平和垂直方向滚动的像素。
    const scrollLeft = win.pageXOffset;
    const scrollTop = win.pageYOffset;
    return {
        scrollLeft,
        scrollTop,
    };
}

function getWindowScrollBarX(element) {
    return (getBoundingClientRect(getDocumentElement(element)).left +
        getWindowScroll(element).scrollLeft);
}

function getViewportRect(element) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.
    if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent
        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
        }
    }
    return {
        width,
        height,
        x: x + getWindowScrollBarX(element),
        y,
    };
}

const max$1 = Math.max;
// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable
function getDocumentRect(element) {
    var _a;
    const html = getDocumentElement(element);
    const winScroll = getWindowScroll(element);
    const body = (_a = element.ownerDocument) === null || _a === void 0 ? void 0 : _a.body;
    const width = max$1(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    const height = max$1(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    let x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    const y = -winScroll.scrollTop;
    if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max$1(html.clientWidth, body ? body.clientWidth : 0) - width;
    }
    return { width, height, x, y };
}

function rectToClientRect(rect) {
    return Object.assign(Object.assign({}, rect), { left: rect.x, top: rect.y, right: rect.x + rect.width, bottom: rect.y + rect.height });
}

const max = Math.max;
const min = Math.min;
function getInnerBoundingClientRect(element) {
    const rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === 'viewport'
        ? rectToClientRect(getViewportRect(element))
        : isHTMLElement(clippingParent)
            ? getInnerBoundingClientRect(clippingParent)
            : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
// A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingParents(element) {
    const clippingParents = listScrollParents(getParentNode(element));
    const canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    const clipperElement = canEscapeClipping && isHTMLElement(element)
        ? getOffsetParent(element)
        : element;
    if (!isElement(clipperElement)) {
        return [];
    }
    // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414
    return clippingParents.filter((clippingParent) => isElement(clippingParent) &&
        contains(clippingParent, clipperElement) &&
        getNodeName(clippingParent) !== 'body');
}
// Gets the maximum area that the element is visible in due to any number of
// clipping parents
function getClippingRect(element, boundary, rootBoundary) {
    const mainClippingParents = boundary === 'clippingParents'
        ? getClippingParents(element)
        : [].concat(boundary);
    const clippingParents = [...mainClippingParents, rootBoundary];
    const firstClippingParent = clippingParents[0];
    const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
        const rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
}

// Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.
function getLayoutRect(element) {
    const clientRect = getBoundingClientRect(element);
    // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
    }
    if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
    }
    return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width,
        height,
    };
}

function getHTMLElementScroll(element) {
    return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop,
    };
}

function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
    }
    else {
        return getHTMLElementScroll(node);
    }
}

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed = false) {
    const documentElement = getDocumentElement(offsetParent);
    const rect = getBoundingClientRect(elementOrVirtualElement);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    let scroll = { scrollLeft: 0, scrollTop: 0 };
    let offsets = { x: 0, y: 0 };
    if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
        if (getNodeName(offsetParent) !== 'body' ||
            // https://github.com/popperjs/popper-core/issues/1078
            isScrollParent(documentElement)) {
            scroll = getNodeScroll(offsetParent);
        }
        if (isHTMLElement(offsetParent)) {
            offsets = getBoundingClientRect(offsetParent);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
        }
        else if (documentElement) {
            offsets.x = getWindowScrollBarX(documentElement);
        }
    }
    return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height,
    };
}

export { contains, getBoundingClientRect, getClippingRect, getCompositeRect, getComputedStyle$1 as getComputedStyle, getDocumentElement, getDocumentRect, getHTMLElementScroll, getLayoutRect, getNodeName, getNodeScroll, getOffsetParent, getParentNode, getScrollParent, getViewportRect, getWindow, getWindowScroll, getWindowScrollBarX, isElement, isHTMLElement, isScrollParent, isShadowRoot, listScrollParents, rectToClientRect, reflow };
