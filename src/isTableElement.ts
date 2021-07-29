import getNodeName from './getNodeName';

export default function isTableElement(element:any): boolean {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}