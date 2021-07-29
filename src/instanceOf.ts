import getWindow from "./getWindow";
//判断是否是节点
export function isElement(node:any):boolean{
    const OwnElement = getWindow(node).Element;
    return node instanceof OwnElement ||node instanceof Element;
}
//判断是否是html节点
export function isHTMLElement(node:any):boolean {
    const OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
}
//判断是否是
export function isShadowRoot(node:any):boolean {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }
    const OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
}