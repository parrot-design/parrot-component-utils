import { isElement } from './instanceOf';
//一个会返回文档对象（document）的根元素的只读属性如<html>
export default function getDocumentElement(element:any):HTMLElement{
    return ((isElement(element)?element.ownerDocument:element.document)|| window.document).documentElement;
}