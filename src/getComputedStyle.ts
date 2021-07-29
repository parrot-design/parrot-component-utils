import getWindow from './getWindow';
//返回一个包含元素所有 CSS 属性值的对象
export default function getComputedStyle(element:Element){ 
    return getWindow(element).getComputedStyle(element); 
}   