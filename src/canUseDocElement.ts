import canUseDom from './canUseDom';

const canUseDocElement = () => canUseDom() && window.document.documentElement;

export default canUseDocElement;