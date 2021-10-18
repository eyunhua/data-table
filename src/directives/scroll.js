/**
 * @file scroll.js
 * @desc 滚动指令
 * @author
 */
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
        throw new Error('the scroll events must be function');
    } else if (el.addEventListener) {
        oldValue && el.removeEventListener('scroll', oldValue);
        el.addEventListener('scroll', e => {
            value && value(e, el);
        }, {
            // 提高滚动性能并减少崩溃
            passive: true
        });
    } else if (el.attachEvent) {
        oldValue && el.detachEvent('onscroll', oldValue);
        el.attachEvent('onscroll', e => {
            value && value(e, el);
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
            el.removeEventListener('scroll', value);
        } else {
            el.detachEvent('onscroll', value);
        }
    }
}

// 导出scroll指令
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
