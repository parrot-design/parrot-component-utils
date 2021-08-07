import getComputedStyle from './getComputedStyle';

export default function isHidden(
    element:any
){
    if(!element) return false;

    const style=getComputedStyle(element);
    const hidden=style.display==='none';

    // offsetParent在以下情况下返回null:
    // 1。元素或其父元素的display属性设置为none。
    // 2。元素的position属性设置为fixed
    const parentHidden=element.offsetParent===null && style.position !== 'fixed';

    return hidden || parentHidden;
}