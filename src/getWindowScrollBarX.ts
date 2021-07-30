import getBoundingClientRect from './getBoundingClientRect';
import getDocumentElement from './getDocumentElement';
import getWindowScroll from './getWindowScroll';

export default function getWindowScrollBarX(element: Element): number {
  return (
    getBoundingClientRect(getDocumentElement(element)).left +
    getWindowScroll(element).scrollLeft
  );
}