/**
 * @file mousewheel.js
 * @desc 鼠标滚轮指令
 * @author
 */
import normalizeWheel from 'normalize-wheel';

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 * 绑定指令函数
 * @param {Object} el 指令绑定的元素
 * @param {Object} binding 绑定值属性的对象
 */
function load(el, binding) {
    let {value, oldValue} = binding;
    // 如果当前值与前一值相等，则不再绑定
    if (value === oldValue) {
        return;
    }
    if (typeof value !== 'function') {
        throw new Error('the mousewheel events must be function');
    } else if (el && el.addEventListener) {
        oldValue && el.removeEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', oldValue);
        el.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', event => {
            const normalized = normalizeWheel(event);
            value && value.apply(this, [event, normalized]);
        });
    } else if (el.attachEvent) {
        oldValue && el.detachEvent(isFirefox ? 'DOMMouseScroll' : 'mousewheel', oldValue);
        el.attachEvent(isFirefox ? 'DOMMouseScroll' : 'mousewheel', event => {
            const normalized = normalizeWheel(event);
            value && value.apply(this, [event, normalized]);
        });
    }
}

/**
 * 解绑
 * @param {Object} el 指令绑定的元素
 * @param {Object} value 指令绑定的值
 */
function clear(el, {value}) {
    if (value && typeof value === 'function') {
        if (el.removeEventListener) {
            el.removeEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', value);
        } else {
            el.detachEvent(isFirefox ? 'DOMMouseScroll' : 'mousewheel', value);
        }
    }
}

// 导出mousewheel指令
export default {
    inserted(el, binding) {
        load(el, binding);
    },
    componentUpdated(el, binding) {
        load(el, binding);
    },
    unbind(el, binding) {
        clear(el, binding);
    }
};
