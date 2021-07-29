//获取window对象
export default function getWindow(node:any){
    if(node===null){
        return window;
    }

    if(node.toString()!=='[object Window]'){
        const ownerDocument=node.ownerDocument;
        return ownerDocument?ownerDocument.defaultView||window:window;
    }

    return node;
}