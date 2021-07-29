import getNodeName from './getNodeName';
import getDocumentElement from './getDocumentElement';
import { isShadowRoot } from './instanceOf';

//获取父节点
export default function getParentNode(element:any):Element{
    if (getNodeName(element) === 'html') {
        return element;
    }

    return (
        element.assignedSlot||
        element.parentNode||
        (isShadowRoot(element)?element.host:null)||
        getDocumentElement(element)
    )
}   