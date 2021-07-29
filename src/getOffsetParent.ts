
import getWindow from "./getWindow";
import { isHTMLElement } from "./instanceOf";
import isTableElement from './isTableElement';
import getNodeName from './getNodeName';
import getParentNode from './getParentNode';

function getContainingBlock(element: Element) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    const isIE = navigator.userAgent.indexOf('Trident') !== -1;

    if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        const elementCss = getComputedStyle(element);
        if (elementCss.position === 'fixed') {
            return null;
        }
    }

    let currentNode: any = getParentNode(element);

    while (
        isHTMLElement(currentNode) &&
        ['html', 'body'].indexOf(getNodeName(currentNode)) < 0
    ) {
        const css:any = getComputedStyle(currentNode);

        // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
        if (
            css.transform !== 'none' ||
            css.perspective !== 'none' ||
            css.contain === 'paint' ||
            ['transform', 'perspective'].indexOf(css.willChange) !== -1 ||
            (isFirefox && css.willChange === 'filter') ||
            (isFirefox && css.filter && css.filter !== 'none')
        ) {
            return currentNode;
        } else {
            currentNode = currentNode.parentNode;
        }
    }

    return null;
}

function getTrueOffsetParent(element:any) {
    if (!isHTMLElement(element) ||
        getComputedStyle(element).position === 'fixed'
    ) {
        return null;
    }
    return element.offsetParent;
}

//获取最近的祖先定位元素。处理一些边缘情况，
export default function getOffsetParent(element: any) {
    const window = getWindow(element);

    let offsetParent = getTrueOffsetParent(element);

    while (
        offsetParent &&
        isTableElement(offsetParent) &&
        getComputedStyle(offsetParent).position === 'static'
    ) {
        offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (
        offsetParent &&
        (getNodeName(offsetParent) === 'html' ||
            (getNodeName(offsetParent) === 'body' &&
                getComputedStyle(offsetParent).position === 'static'))
    ) {
        return window;
    }

    return offsetParent || getContainingBlock(element);
}