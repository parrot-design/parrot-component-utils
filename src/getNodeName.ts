//获取当前节点的名称
export default function getNodeName(element?:any):string {
    return element ? (element.nodeName || '').toLowerCase() : null;
}