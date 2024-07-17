if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  function addUnit(num) {
    return Number.isNaN(Number(num)) ? num : `${num}px`;
  }
  function isObj(value) {
    return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
  }
  function getType(target) {
    const typeStr = Object.prototype.toString.call(target);
    const match = typeStr.match(/\[object (\w+)\]/);
    const type = match && match.length ? match[1].toLowerCase() : "";
    return type;
  }
  const isDef = (value) => value !== void 0 && value !== null;
  function rgbToHex(r, g, b) {
    const hex = (r << 16 | g << 8 | b).toString(16);
    const paddedHex = "#" + "0".repeat(Math.max(0, 6 - hex.length)) + hex;
    return paddedHex;
  }
  function hexToRgb(hex) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2), 16));
    }
    return rgb;
  }
  const gradient = (startColor, endColor, step = 2) => {
    const sColor = hexToRgb(startColor);
    const eColor = hexToRgb(endColor);
    const rStep = (eColor[0] - sColor[0]) / step;
    const gStep = (eColor[1] - sColor[1]) / step;
    const bStep = (eColor[2] - sColor[2]) / step;
    const gradientColorArr = [];
    for (let i = 0; i < step; i++) {
      gradientColorArr.push(
        rgbToHex(parseInt(String(rStep * i + sColor[0])), parseInt(String(gStep * i + sColor[1])), parseInt(String(bStep * i + sColor[2])))
      );
    }
    return gradientColorArr;
  };
  const padZero = (number, length = 2) => {
    let numStr = number.toString();
    while (numStr.length < length) {
      numStr = "0" + numStr;
    }
    return numStr;
  };
  const context = {
    id: 1e3
  };
  function kebabCase(word) {
    const newWord = word.replace(/[A-Z]/g, function(match) {
      return "-" + match;
    }).toLowerCase();
    return newWord;
  }
  function isArray(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === "[object Array]";
  }
  function isString(value) {
    return getType(value) === "string";
  }
  function objToStyle(styles) {
    if (isArray(styles)) {
      return styles.filter(function(item) {
        return item != null && item !== "";
      }).map(function(item) {
        return objToStyle(item);
      }).join(";");
    }
    if (isString(styles)) {
      return styles;
    }
    if (isObj(styles)) {
      return Object.keys(styles).filter(function(key) {
        return styles[key] != null && styles[key] !== "";
      }).map(function(key) {
        return [kebabCase(key), styles[key]].join(":");
      }).join(";");
    }
    return "";
  }
  const requestAnimationFrame = (cb = () => {
  }) => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        clearInterval(timer);
        resolve(true);
        cb();
      }, 1e3 / 30);
    });
  };
  const numericProp = [Number, String];
  const makeRequiredProp = (type) => ({
    type,
    required: true
  });
  const makeBooleanProp = (defaultVal) => ({
    type: Boolean,
    default: defaultVal
  });
  const makeNumberProp = (defaultVal) => ({
    type: Number,
    default: defaultVal
  });
  const makeNumericProp = (defaultVal) => ({
    type: numericProp,
    default: defaultVal
  });
  const makeStringProp = (defaultVal) => ({
    type: String,
    default: defaultVal
  });
  const baseProps = {
    /**
     * 自定义根节点样式
     */
    customStyle: makeStringProp(""),
    /**
     * 自定义根节点样式类
     */
    customClass: makeStringProp("")
  };
  const passwordInputProps = {
    ...baseProps,
    /**
     * 绑定的值
     */
    modelValue: makeStringProp(""),
    /**
     * 是否隐藏密码内容
     */
    mask: makeBooleanProp(true),
    /**
     * 输入框下方文字提示
     */
    info: makeStringProp(""),
    /**
     * 输入框下方错误提示
     */
    errorInfo: makeStringProp(""),
    /**
     * 输入框格子之间的间距，如 20px 2em，默认单位为 px
     */
    gutter: makeNumericProp(0),
    /**
     * 密码最大长度
     */
    length: makeNumberProp(6),
    /**
     * 是否已聚焦，聚焦时会显示光标
     */
    focused: makeBooleanProp(true)
  };
  const __default__$8 = {
    name: "wd-password-input",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: passwordInputProps,
    emits: ["focus"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      function onTouchStart(event) {
        emit("focus", event);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(`wd-password-input ${_ctx.customClass}`),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            vue.createElementVNode(
              "view",
              {
                onTouchstart: onTouchStart,
                class: "wd-password-input__security"
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(_ctx.length, (_, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: index,
                        class: vue.normalizeClass(`wd-password-input__item ${_ctx.gutter ? "" : "is-border"}`),
                        style: vue.normalizeStyle({ marginLeft: index !== 0 && _ctx.gutter ? vue.unref(addUnit)(_ctx.gutter) : 0 })
                      },
                      [
                        _ctx.focused && index === _ctx.modelValue.length ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "wd-password-input__cursor"
                        })) : (vue.openBlock(), vue.createElementBlock("view", {
                          key: 1,
                          class: vue.normalizeClass(`wd-password-input__value`)
                        }, [
                          vue.createElementVNode(
                            "view",
                            {
                              style: vue.normalizeStyle({ visibility: _ctx.mask && _ctx.modelValue[index] ? "visible" : "hidden" }),
                              class: "wd-password-input__mask"
                            },
                            null,
                            4
                            /* STYLE */
                          ),
                          !_ctx.mask && _ctx.modelValue[index] ? (vue.openBlock(), vue.createElementBlock(
                            "text",
                            { key: 0 },
                            vue.toDisplayString(_ctx.modelValue[index]),
                            1
                            /* TEXT */
                          )) : vue.createCommentVNode("v-if", true)
                        ]))
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              32
              /* NEED_HYDRATION */
            ),
            _ctx.info || _ctx.errorInfo ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(`wd-password-input__info ${_ctx.errorInfo ? "is-error" : ""}`)
              },
              vue.toDisplayString(_ctx.errorInfo || _ctx.info),
              3
              /* TEXT, CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-fa6d4629"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-password-input/wd-password-input.vue"]]);
  const transitionProps = {
    ...baseProps,
    /**
     * 是否展示组件
     * 类型：boolean
     * 默认值：false
     */
    show: makeBooleanProp(false),
    /**
     * 动画执行时间
     * 类型：number | boolean | Record<string, number>
     * 默认值：300 (毫秒)
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 动画类型
     * 类型：string
     * 可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in
     * 默认值：'fade'
     */
    name: makeStringProp("fade"),
    /**
     * 是否延迟渲染子组件
     * 类型：boolean
     * 默认值：true
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 进入过渡的开始状态
     * 类型：string
     */
    enterClass: makeStringProp(""),
    /**
     * 进入过渡的激活状态
     * 类型：string
     */
    enterActiveClass: makeStringProp(""),
    /**
     * 进入过渡的结束状态
     * 类型：string
     */
    enterToClass: makeStringProp(""),
    /**
     * 离开过渡的开始状态
     * 类型：string
     */
    leaveClass: makeStringProp(""),
    /**
     * 离开过渡的激活状态
     * 类型：string
     */
    leaveActiveClass: makeStringProp(""),
    /**
     * 离开过渡的结束状态
     * 类型：string
     */
    leaveToClass: makeStringProp("")
  };
  const __default__$7 = {
    name: "wd-transition",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: transitionProps,
    emits: ["click", "before-enter", "enter", "before-leave", "leave", "after-leave", "after-enter"],
    setup(__props, { emit: __emit }) {
      const getClassNames = (name) => {
        if (!name) {
          return {
            enter: `${props.enterClass} ${props.enterActiveClass}`,
            "enter-to": `${props.enterToClass} ${props.enterActiveClass}`,
            leave: `${props.leaveClass} ${props.leaveActiveClass}`,
            "leave-to": `${props.leaveToClass} ${props.leaveActiveClass}`
          };
        }
        return {
          enter: `wd-${name}-enter wd-${name}-enter-active`,
          "enter-to": `wd-${name}-enter-to wd-${name}-enter-active`,
          leave: `wd-${name}-leave wd-${name}-leave-active`,
          "leave-to": `wd-${name}-leave-to wd-${name}-leave-active`
        };
      };
      const props = __props;
      const emit = __emit;
      const inited = vue.ref(false);
      const display = vue.ref(false);
      const status = vue.ref("");
      const transitionEnded = vue.ref(false);
      const currentDuration = vue.ref(300);
      const classes = vue.ref("");
      const enterPromise = vue.ref(null);
      const style = vue.computed(() => {
        return `-webkit-transition-duration:${currentDuration.value}ms;transition-duration:${currentDuration.value}ms;${display.value ? "" : "display: none;"}${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-transition ${props.customClass}  ${classes.value}`;
      });
      vue.onBeforeMount(() => {
        if (props.show) {
          enter();
        }
      });
      vue.watch(
        () => props.show,
        (newVal) => {
          observerShow(newVal);
        },
        { deep: true, immediate: true }
      );
      function handleClick() {
        emit("click");
      }
      function observerShow(value) {
        value ? enter() : leave();
      }
      function enter() {
        if (enterPromise.value)
          return;
        enterPromise.value = new Promise((resolve) => {
          const classNames = getClassNames(props.name);
          const duration = isObj(props.duration) ? props.duration.enter : props.duration;
          status.value = "enter";
          emit("before-enter");
          requestAnimationFrame(() => {
            emit("enter");
            classes.value = classNames.enter;
            currentDuration.value = duration;
            requestAnimationFrame(() => {
              inited.value = true;
              display.value = true;
              requestAnimationFrame(() => {
                transitionEnded.value = false;
                classes.value = classNames["enter-to"];
                resolve();
              });
            });
          });
        });
      }
      function leave() {
        if (!enterPromise.value)
          return;
        enterPromise.value.then(() => {
          if (!display.value)
            return;
          const classNames = getClassNames(props.name);
          const duration = isObj(props.duration) ? props.duration.leave : props.duration;
          status.value = "leave";
          emit("before-leave");
          requestAnimationFrame(() => {
            emit("leave");
            classes.value = classNames.leave;
            currentDuration.value = duration;
            requestAnimationFrame(() => {
              transitionEnded.value = false;
              setTimeout(() => {
                onTransitionEnd();
                enterPromise.value = null;
              }, currentDuration.value);
              classes.value = classNames["leave-to"];
            });
          });
        });
      }
      function onTransitionEnd() {
        if (transitionEnded.value)
          return;
        transitionEnded.value = true;
        if (status.value === "leave") {
          emit("after-leave");
        } else if (status.value === "enter") {
          emit("after-enter");
        }
        if (!props.show && display.value) {
          display.value = false;
        }
      }
      return (_ctx, _cache) => {
        return inited.value ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(rootClass.value),
            style: vue.normalizeStyle(style.value),
            onTransitionend: onTransitionEnd,
            onClick: handleClick
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          38
          /* CLASS, STYLE, NEED_HYDRATION */
        )) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-af59a128"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-transition/wd-transition.vue"]]);
  const overlayProps = {
    ...baseProps,
    /**
     * 是否展示遮罩层
     */
    show: makeBooleanProp(false),
    /**
     * 动画时长，单位毫秒
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 是否锁定滚动
     */
    lockScroll: makeBooleanProp(true),
    /**
     * 层级
     */
    zIndex: makeNumberProp(10)
  };
  const __default__$6 = {
    name: "wd-overlay",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: overlayProps,
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      function handleClick() {
        emit("click");
      }
      function noop() {
      }
      return (_ctx, _cache) => {
        const _component_wd_transition = resolveEasycom(vue.resolveDynamicComponent("wd-transition"), __easycom_0$3);
        return vue.openBlock(), vue.createBlock(_component_wd_transition, {
          show: _ctx.show,
          name: "fade",
          "custom-class": "wd-overlay",
          duration: _ctx.duration,
          "custom-style": `z-index: ${_ctx.zIndex}; ${_ctx.customStyle}`,
          onClick: handleClick,
          onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers(($event) => _ctx.lockScroll ? noop : "", ["stop", "prevent"]))
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          _: 3
          /* FORWARDED */
        }, 8, ["show", "duration", "custom-style"]);
      };
    }
  });
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-6e0d1141"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-overlay/wd-overlay.vue"]]);
  const iconProps = {
    ...baseProps,
    /**
     * 使用的图标名字，可以使用链接图片
     */
    name: makeRequiredProp(String),
    /**
     * 图标的颜色
     */
    color: String,
    /**
     * 图标的字体大小
     */
    size: String,
    /**
     * 类名前缀，用于使用自定义图标
     */
    classPrefix: makeStringProp("wd-icon")
  };
  const __default__$5 = {
    name: "wd-icon",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: iconProps,
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const isImageUrl = vue.ref(false);
      vue.watch(
        () => props.name,
        (val) => {
          isImageUrl.value = val.indexOf("/") > -1;
        },
        { deep: true, immediate: true }
      );
      const rootClass = vue.computed(() => {
        const prefix = props.classPrefix;
        return `${prefix} ${props.customClass} ${isImageUrl.value ? "wd-icon--image" : prefix + "-" + props.name}`;
      });
      const rootStyle = vue.computed(() => {
        const style = {};
        if (props.color) {
          style["color"] = props.color;
        }
        if (props.size) {
          style["font-size"] = props.size;
        }
        return `${objToStyle(style)}; ${props.customStyle}`;
      });
      function handleClick(event) {
        emit("click", event);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            onClick: handleClick,
            class: vue.normalizeClass(rootClass.value),
            style: vue.normalizeStyle(rootStyle.value)
          },
          [
            isImageUrl.value ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              class: "wd-icon__image",
              src: _ctx.name
            }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-24906af6"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-icon/wd-icon.vue"]]);
  const popupProps = {
    ...baseProps,
    transition: String,
    /**
     * 关闭按钮
     */
    closable: makeBooleanProp(false),
    /**
     * 弹出框的位置
     */
    position: makeStringProp("center"),
    /**
     * 点击遮罩是否关闭
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 动画持续时间
     */
    duration: {
      type: [Number, Boolean],
      default: 300
    },
    /**
     * 是否显示遮罩
     */
    modal: makeBooleanProp(true),
    /**
     * 设置层级
     */
    zIndex: makeNumberProp(10),
    /**
     * 是否当关闭时将弹出层隐藏（display: none)
     */
    hideWhenClose: makeBooleanProp(true),
    /**
     * 遮罩样式
     */
    modalStyle: makeStringProp(""),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     */
    safeAreaInsetBottom: makeBooleanProp(false),
    /**
     * 弹出层是否显示
     */
    modelValue: makeBooleanProp(false),
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 是否锁定滚动
     */
    lockScroll: makeBooleanProp(true)
  };
  const __default__$4 = {
    name: "wd-popup",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: popupProps,
    emits: [
      "update:modelValue",
      "before-enter",
      "enter",
      "before-leave",
      "leave",
      "after-leave",
      "after-enter",
      "click-modal",
      "close"
    ],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const getClassNames = (name2) => {
        if (!name2) {
          return {
            enter: "enter-class enter-active-class",
            "enter-to": "enter-to-class enter-active-class",
            leave: "leave-class leave-active-class",
            "leave-to": "leave-to-class leave-active-class"
          };
        }
        return {
          enter: `wd-${name2}-enter wd-${name2}-enter-active`,
          "enter-to": `wd-${name2}-enter-to wd-${name2}-enter-active`,
          leave: `wd-${name2}-leave wd-${name2}-leave-active`,
          "leave-to": `wd-${name2}-leave-to wd-${name2}-leave-active`
        };
      };
      const inited = vue.ref(false);
      const display = vue.ref(false);
      const status = vue.ref("");
      const transitionEnded = vue.ref(false);
      const currentDuration = vue.ref(300);
      const classes = vue.ref("");
      const safeBottom = vue.ref(0);
      const name = vue.ref("");
      const style = vue.computed(() => {
        return `z-index: ${props.zIndex}; padding-bottom: ${safeBottom.value}px; -webkit-transition-duration: ${currentDuration.value}ms; transition-duration: ${currentDuration.value}ms; ${display.value || !props.hideWhenClose ? "" : "display: none;"} ${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-popup wd-popup--${props.position} ${props.customClass || ""} ${classes.value || ""}`;
      });
      vue.onBeforeMount(() => {
        observerTransition();
        if (props.safeAreaInsetBottom) {
          const { safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();
          if (safeArea) {
            safeBottom.value = safeAreaInsets ? safeAreaInsets.bottom : 0;
          } else {
            safeBottom.value = 0;
          }
        }
        if (props.modelValue) {
          enter();
        }
      });
      vue.watch(
        () => props.modelValue,
        (newVal) => {
          observermodelValue(newVal);
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        [() => props.position, () => props.transition],
        () => {
          observerTransition();
        },
        { deep: true, immediate: true }
      );
      function observermodelValue(value) {
        value ? enter() : leave();
      }
      function enter() {
        const classNames = getClassNames(props.transition || props.position);
        const duration = props.transition === "none" ? 0 : isObj(props.duration) ? props.duration.enter : props.duration;
        status.value = "enter";
        emit("before-enter");
        requestAnimationFrame(() => {
          emit("enter");
          classes.value = classNames.enter;
          currentDuration.value = duration;
          requestAnimationFrame(() => {
            inited.value = true;
            display.value = true;
            requestAnimationFrame(() => {
              transitionEnded.value = false;
              classes.value = classNames["enter-to"];
            });
          });
        });
      }
      function leave() {
        if (!display.value)
          return;
        const classNames = getClassNames(props.transition || props.position);
        const duration = props.transition === "none" ? 0 : isObj(props.duration) ? props.duration.leave : props.duration;
        status.value = "leave";
        emit("before-leave");
        requestAnimationFrame(() => {
          emit("leave");
          classes.value = classNames.leave;
          currentDuration.value = duration;
          requestAnimationFrame(() => {
            transitionEnded.value = false;
            const timer = setTimeout(() => {
              onTransitionEnd();
              clearTimeout(timer);
            }, currentDuration.value);
            classes.value = classNames["leave-to"];
          });
        });
      }
      function onTransitionEnd() {
        if (transitionEnded.value)
          return;
        transitionEnded.value = true;
        if (status.value === "leave") {
          emit("after-leave");
        } else if (status.value === "enter") {
          emit("after-enter");
        }
        if (!props.modelValue && display.value) {
          display.value = false;
        }
      }
      function observerTransition() {
        const { transition, position } = props;
        name.value = transition || position;
      }
      function handleClickModal() {
        emit("click-modal");
        if (props.closeOnClickModal) {
          close();
        }
      }
      function close() {
        emit("close");
        emit("update:modelValue", false);
      }
      function noop() {
      }
      return (_ctx, _cache) => {
        const _component_wd_overlay = resolveEasycom(vue.resolveDynamicComponent("wd-overlay"), __easycom_0$2);
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$1);
        return vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          [
            _ctx.modal ? (vue.openBlock(), vue.createBlock(_component_wd_overlay, {
              key: 0,
              show: _ctx.modelValue,
              "z-index": _ctx.zIndex,
              "lock-scroll": _ctx.lockScroll,
              duration: _ctx.duration,
              "custom-style": _ctx.modalStyle,
              onClick: handleClickModal,
              onTouchmove: noop
            }, null, 8, ["show", "z-index", "lock-scroll", "duration", "custom-style"])) : vue.createCommentVNode("v-if", true),
            !_ctx.lazyRender || inited.value ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: vue.normalizeClass(rootClass.value),
                style: vue.normalizeStyle(style.value),
                onTransitionend: onTransitionEnd
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
                _ctx.closable ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                  key: 0,
                  "custom-class": "wd-popup__close",
                  name: "add",
                  onClick: close
                })) : vue.createCommentVNode("v-if", true)
              ],
              38
              /* CLASS, STYLE, NEED_HYDRATION */
            )) : vue.createCommentVNode("v-if", true)
          ],
          64
          /* STABLE_FRAGMENT */
        );
      };
    }
  });
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-25a8a9f7"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-popup/wd-popup.vue"]]);
  const _b64chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"];
  const _mkUriSafe = (src) => src.replace(/[+/]/g, (m0) => m0 === "+" ? "-" : "_").replace(/=+\$/m, "");
  const fromUint8Array = (src, rfc4648 = false) => {
    let b64 = "";
    for (let i = 0, l = src.length; i < l; i += 3) {
      const [a0, a1, a2] = [src[i], src[i + 1], src[i + 2]];
      const ord = a0 << 16 | a1 << 8 | a2;
      b64 += _b64chars[ord >>> 18];
      b64 += _b64chars[ord >>> 12 & 63];
      b64 += typeof a1 !== "undefined" ? _b64chars[ord >>> 6 & 63] : "=";
      b64 += typeof a2 !== "undefined" ? _b64chars[ord & 63] : "=";
    }
    return rfc4648 ? _mkUriSafe(b64) : b64;
  };
  const _btoa = typeof btoa === "function" ? (s) => btoa(s) : (s) => {
    if (s.charCodeAt(0) > 255) {
      throw new RangeError("The string contains invalid characters.");
    }
    return fromUint8Array(Uint8Array.from(s, (c) => c.charCodeAt(0)));
  };
  const utob = (src) => unescape(encodeURIComponent(src));
  function encode(src, rfc4648 = false) {
    const b64 = _btoa(utob(src));
    return rfc4648 ? _mkUriSafe(b64) : b64;
  }
  const loadingProps = {
    ...baseProps,
    /**
     * 加载指示器类型，可选值：'outline' | 'ring'
     */
    type: makeStringProp("ring"),
    /**
     * 设置加载指示器颜色
     */
    color: makeStringProp("#4D80F0"),
    /**
     * 设置加载指示器大小
     */
    size: makeNumericProp("32px")
  };
  const __default__$3 = {
    name: "wd-loading",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: loadingProps,
    setup(__props) {
      const svgDefineId = context.id++;
      const svgDefineId1 = context.id++;
      const svgDefineId2 = context.id++;
      const icon = {
        outline(color = "#4D80F0") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="${svgDefineId}"><stop stop-color="#FFF" offset="0%" stop-opacity="0"/><stop stop-color="#FFF" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#${svgDefineId}) " stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
        },
        ring(color = "#4D80F0", intermediateColor2 = "#a6bff7") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="${svgDefineId1}" gradientUnits="userSpaceOnUse" x1="50" x2="50" y2="180"><stop offset="0" stop-color="${color}"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId1})" d="M20 100c0-44.1 35.9-80 80-80V0C44.8 0 0 44.8 0 100s44.8 100 100 100v-20c-44.1 0-80-35.9-80-80z"></path> <linearGradient id="${svgDefineId2}" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180"><stop offset="0" stop-color="#fff" stop-opacity="0"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId2})" d="M100 0v20c44.1 0 80 35.9 80 80s-35.9 80-80 80v20c55.2 0 100-44.8 100-100S155.2 0 100 0z"></path> <circle cx="100" cy="10" r="10" fill="${color}"></circle></svg>`;
        }
      };
      const props = __props;
      const svg = vue.ref("");
      const intermediateColor = vue.ref("");
      const iconSize = vue.ref("32px");
      vue.watch(
        () => props.size,
        (newVal) => {
          iconSize.value = addUnit(newVal);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.type,
        () => {
          buildSvg();
        },
        {
          deep: true,
          immediate: true
        }
      );
      const rootStyle = vue.computed(() => {
        const style = {
          width: iconSize.value,
          height: iconSize.value
        };
        return `${objToStyle(style)}; ${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-loading  ${props.customClass}`;
      });
      vue.onBeforeMount(() => {
        intermediateColor.value = gradient(props.color, "#ffffff", 2)[1];
        buildSvg();
      });
      function buildSvg() {
        const { type, color } = props;
        let ringType = isDef(type) ? type : "ring";
        const svgStr = `"data:image/svg+xml;base64,${encode(ringType === "ring" ? icon[ringType](color, intermediateColor.value) : icon[ringType](color))}"`;
        svg.value = svgStr;
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(rootClass.value),
            style: vue.normalizeStyle(rootStyle.value)
          },
          [
            !_ctx.type || _ctx.type === "ring" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "wd-loading__body"
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "wd-loading__svg",
                  style: vue.normalizeStyle(`background-image: url(${svg.value});`)
                },
                null,
                4
                /* STYLE */
              )
            ])) : vue.createCommentVNode("v-if", true),
            _ctx.type === "outline" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-loading__body"
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "wd-loading__svg",
                  style: vue.normalizeStyle(`background-image: url(${svg.value});`)
                },
                null,
                4
                /* STYLE */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-f2b508ee"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-loading/wd-loading.vue"]]);
  function useTouch() {
    const direction = vue.ref("");
    const deltaX = vue.ref(0);
    const deltaY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    function touchStart(event) {
      const touch = event.touches[0];
      direction.value = "";
      deltaX.value = 0;
      deltaY.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      startX.value = touch.clientX;
      startY.value = touch.clientY;
    }
    function touchMove(event) {
      const touch = event.touches[0];
      deltaX.value = touch.clientX - startX.value;
      deltaY.value = touch.clientY - startY.value;
      offsetX.value = Math.abs(deltaX.value);
      offsetY.value = Math.abs(deltaY.value);
      direction.value = offsetX.value > offsetY.value ? "horizontal" : offsetX.value < offsetY.value ? "vertical" : "";
    }
    return {
      touchStart,
      touchMove,
      direction,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      startX,
      startY
    };
  }
  const keyProps = {
    type: makeStringProp(""),
    text: makeNumericProp(""),
    wider: makeBooleanProp(false),
    large: makeBooleanProp(false),
    loading: makeBooleanProp(false)
  };
  const __default__$2 = {
    name: "wd-key",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: keyProps,
    emits: ["press"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const touch = useTouch();
      const active = vue.ref(false);
      const keyClass = vue.computed(() => {
        return `wd-key ${props.large ? "wd-key--large" : ""} ${props.type === "delete" ? "wd-key--delete" : ""} ${props.type === "close" ? "wd-key--close" : ""}`;
      });
      function onTouchStart(event) {
        touch.touchStart(event);
        active.value = true;
      }
      function onTouchMove(event) {
        touch.touchMove(event);
        if (touch.direction.value) {
          active.value = false;
        }
      }
      function onTouchEnd() {
        if (active.value) {
          active.value = false;
          emit("press", props.text, props.type);
        }
      }
      return (_ctx, _cache) => {
        const _component_wd_loading = resolveEasycom(vue.resolveDynamicComponent("wd-loading"), __easycom_0);
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$1);
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(`wd-key-wrapper ${_ctx.wider ? "wd-key-wrapper--wider" : ""}`),
            onTouchstart: onTouchStart,
            onTouchmove: onTouchMove,
            onTouchend: onTouchEnd
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(keyClass.value)
              },
              [
                props.loading ? (vue.openBlock(), vue.createBlock(_component_wd_loading, {
                  key: 0,
                  "custom-class": "wd-key--loading-icon"
                })) : vue.createCommentVNode("v-if", true),
                _ctx.type === "delete" ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    _ctx.text ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 0 },
                      [
                        vue.createTextVNode(
                          vue.toDisplayString(_ctx.text),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                      key: 1,
                      name: "keyboard-delete",
                      size: "22px"
                    }))
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : _ctx.type === "extra" ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 2 },
                  [
                    _ctx.text ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 0 },
                      [
                        vue.createTextVNode(
                          vue.toDisplayString(_ctx.text),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                      key: 1,
                      name: "keyboard-collapse",
                      size: "22px"
                    }))
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 3 },
                  [
                    vue.createTextVNode(
                      vue.toDisplayString(_ctx.text),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ],
              2
              /* CLASS */
            )
          ],
          34
          /* CLASS, NEED_HYDRATION */
        );
      };
    }
  });
  const WdKey = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-13f6d252"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-number-keyboard/key/index.vue"]]);
  const numberKeyboardProps = {
    ...baseProps,
    /**
     * 是否可见
     */
    visible: makeBooleanProp(false),
    /**
     * 绑定的值
     */
    modelValue: makeStringProp(""),
    /**
     * 标题
     */
    title: String,
    /**
     * 键盘模式
     */
    mode: makeStringProp("default"),
    /**
     * 层级
     */
    zIndex: makeNumberProp(100),
    /**
     * 最大长度
     */
    maxlength: makeNumberProp(Infinity),
    /**
     * 是否显示删除键
     */
    showDeleteKey: makeBooleanProp(true),
    /**
     * 是否随机键盘按键顺序
     */
    randomKeyOrder: makeBooleanProp(false),
    /**
     * 确认按钮文本
     */
    closeText: String,
    /**
     * 删除按钮文本
     */
    deleteText: String,
    /**
     * 关闭按钮是否显示加载状态
     */
    closeButtonLoading: makeBooleanProp(false),
    /**
     * 是否显示蒙层
     */
    modal: makeBooleanProp(false),
    /**
     * 是否在点击外部时收起键盘
     */
    hideOnClickOutside: makeBooleanProp(true),
    /**
     * 是否锁定滚动
     */
    lockScroll: makeBooleanProp(true),
    /**
     * 是否在底部安全区域内
     */
    safeAreaInsetBottom: makeBooleanProp(true),
    /**
     * 额外按键
     */
    extraKey: [String, Array]
  };
  const __default__$1 = {
    name: "wd-number-keyboard",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: numberKeyboardProps,
    emits: ["update:visible", "input", "close", "delete", "update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const show = vue.ref(props.visible);
      vue.watch(
        () => props.visible,
        (newValue) => {
          show.value = newValue;
        }
      );
      const keys = vue.computed(() => props.mode === "custom" ? genCustomKeys() : genDefaultKeys());
      const showClose = vue.computed(() => {
        return props.closeText && props.mode === "default";
      });
      const showTitle = vue.computed(() => {
        return props.title || showClose.value;
      });
      function shuffleArray(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
      }
      function genBasicKeys() {
        const keys2 = Array.from({ length: 9 }, (_, i) => ({ text: i + 1 }));
        return props.randomKeyOrder ? shuffleArray(keys2) : keys2;
      }
      function genDefaultKeys() {
        return [
          ...genBasicKeys(),
          { text: props.extraKey, type: "extra" },
          { text: 0 },
          {
            // 根据条件是否显示删除键的文本和类型
            text: props.showDeleteKey ? props.deleteText : "",
            type: props.showDeleteKey ? "delete" : ""
          }
        ];
      }
      function genCustomKeys() {
        const keys2 = genBasicKeys();
        const extraKeys = Array.isArray(props.extraKey) ? props.extraKey : [props.extraKey];
        if (extraKeys.length === 1) {
          keys2.push({ text: 0, wider: true }, { text: extraKeys[0], type: "extra" });
        } else if (extraKeys.length === 2) {
          keys2.push({ text: extraKeys[0], type: "extra" }, { text: 0 }, { text: extraKeys[1], type: "extra" });
        }
        return keys2;
      }
      const handleClose = () => {
        emit("close");
        emit("update:visible", false);
      };
      const handlePress = (text, type) => {
        if (text === "" && type === "extra") {
          return handleClose();
        }
        const value = props.modelValue;
        if (type === "delete") {
          emit("delete");
          emit("update:modelValue", value.slice(0, value.length - 1));
        } else if (type === "close") {
          handleClose();
        } else if (value.length < +props.maxlength) {
          emit("input", text);
          emit("update:modelValue", value + text);
        }
      };
      return (_ctx, _cache) => {
        const _component_wd_popup = resolveEasycom(vue.resolveDynamicComponent("wd-popup"), __easycom_0$1);
        return vue.openBlock(), vue.createBlock(_component_wd_popup, {
          modelValue: show.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => show.value = $event),
          position: "bottom",
          "z-index": _ctx.zIndex,
          "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
          "modal-style": _ctx.modal ? "" : "opacity: 0;",
          modal: _ctx.hideOnClickOutside,
          lockScroll: _ctx.lockScroll,
          onClickModal: handleClose
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(`wd-number-keyboard ${_ctx.customClass}`),
                style: vue.normalizeStyle(_ctx.customStyle)
              },
              [
                showTitle.value ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "wd-number-keyboard__header"
                }, [
                  vue.renderSlot(_ctx.$slots, "title", {}, () => [
                    vue.createElementVNode(
                      "text",
                      { class: "wd-number-keyboard__title" },
                      vue.toDisplayString(_ctx.title),
                      1
                      /* TEXT */
                    )
                  ], true),
                  showClose.value ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "wd-number-keyboard__close",
                    "hover-class": "wd-number-keyboard__close--hover",
                    onClick: handleClose
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(_ctx.closeText),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "wd-number-keyboard__body" }, [
                  vue.createElementVNode("view", { class: "wd-number-keyboard__keys" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(keys.value, (key) => {
                        return vue.openBlock(), vue.createBlock(WdKey, {
                          key: key.text,
                          text: key.text,
                          type: key.type,
                          wider: key.wider,
                          onPress: handlePress
                        }, null, 8, ["text", "type", "wider"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _ctx.mode === "custom" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "wd-number-keyboard__sidebar"
                  }, [
                    _ctx.showDeleteKey ? (vue.openBlock(), vue.createBlock(WdKey, {
                      key: 0,
                      large: "",
                      text: _ctx.deleteText,
                      type: "delete",
                      onPress: handlePress
                    }, null, 8, ["text"])) : vue.createCommentVNode("v-if", true),
                    vue.createVNode(WdKey, {
                      large: "",
                      text: _ctx.closeText,
                      type: "close",
                      loading: _ctx.closeButtonLoading,
                      onPress: handlePress
                    }, null, 8, ["text", "loading"])
                  ])) : vue.createCommentVNode("v-if", true)
                ])
              ],
              6
              /* CLASS, STYLE */
            )
          ]),
          _: 3
          /* FORWARDED */
        }, 8, ["modelValue", "z-index", "safe-area-inset-bottom", "modal-style", "modal", "lockScroll"]);
      };
    }
  });
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-b5945d7f"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-number-keyboard/wd-number-keyboard.vue"]]);
  function parseFormat(format, timeData) {
    const { days } = timeData;
    let { hours, minutes, seconds, milliseconds } = timeData;
    if (format.includes("DD")) {
      format = format.replace("DD", padZero(days));
    } else {
      hours += days * 24;
    }
    if (format.includes("HH")) {
      format = format.replace("HH", padZero(hours));
    } else {
      minutes += hours * 60;
    }
    if (format.includes("mm")) {
      format = format.replace("mm", padZero(minutes));
    } else {
      seconds += minutes * 60;
    }
    if (format.includes("ss")) {
      format = format.replace("ss", padZero(seconds));
    } else {
      milliseconds += seconds * 1e3;
    }
    if (format.includes("S")) {
      const ms = padZero(milliseconds, 3);
      if (format.includes("SSS")) {
        format = format.replace("SSS", ms);
      } else if (format.includes("SS")) {
        format = format.replace("SS", ms.slice(0, 2));
      } else {
        format = format.replace("S", ms.charAt(0));
      }
    }
    return format;
  }
  const SECOND = 1e3;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  function parseTime(time) {
    const days = Math.floor(time / DAY);
    const hours = Math.floor(time % DAY / HOUR);
    const minutes = Math.floor(time % HOUR / MINUTE);
    const seconds = Math.floor(time % MINUTE / SECOND);
    const milliseconds = Math.floor(time % SECOND);
    return {
      total: time,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  function isSameSecond(time1, time2) {
    return Math.floor(time1 / 1e3) === Math.floor(time2 / 1e3);
  }
  function raf(fn) {
    return setTimeout(fn, 33);
  }
  function cancelRaf(id) {
    {
      clearTimeout(id);
    }
  }
  function useCountDown(options) {
    let timer = null;
    let endTime;
    let counting;
    const remain = vue.ref(options.time);
    const current = vue.computed(() => parseTime(remain.value));
    const pause = () => {
      counting = false;
      cancelRaf(timer);
    };
    const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);
    const setRemain = (value) => {
      remain.value = value;
      isDef(options.onChange) && options.onChange(current.value);
      if (value === 0) {
        pause();
        isDef(options.onFinish) && options.onFinish();
      }
    };
    const microTick = () => {
      timer = raf(() => {
        if (counting) {
          setRemain(getCurrentRemain());
          if (remain.value > 0) {
            microTick();
          }
        }
      });
    };
    const macroTick = () => {
      timer = raf(() => {
        if (counting) {
          const remainRemain = getCurrentRemain();
          if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
            setRemain(remainRemain);
          }
          if (remain.value > 0) {
            macroTick();
          }
        }
      });
    };
    const tick = () => {
      if (options.millisecond) {
        microTick();
      } else {
        macroTick();
      }
    };
    const start = () => {
      if (!counting) {
        endTime = Date.now() + remain.value;
        counting = true;
        tick();
      }
    };
    const reset = (totalTime = options.time) => {
      pause();
      remain.value = totalTime;
    };
    vue.onBeforeUnmount(pause);
    return {
      start,
      pause,
      reset,
      current
    };
  }
  const countDownProps = {
    ...baseProps,
    /**
     * 倒计时时长，单位毫秒
     */
    time: makeRequiredProp(Number),
    /**
     * 是否开启毫秒
     */
    millisecond: makeBooleanProp(false),
    /**
     * 格式化时间
     */
    format: makeStringProp("HH:mm:ss"),
    /**
     * 是否自动开始
     */
    autoStart: makeBooleanProp(true)
  };
  const __default__ = {
    name: "wd-count-down",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: countDownProps,
    emits: ["change", "finish"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { start, pause, reset, current } = useCountDown({
        time: props.time,
        millisecond: props.millisecond,
        onChange: (current2) => emit("change", current2),
        onFinish: () => emit("finish")
      });
      const timeText = vue.computed(() => parseFormat(props.format, current.value));
      const resetTime = () => {
        reset(props.time);
        if (props.autoStart) {
          start();
        }
      };
      vue.watch(() => props.time, resetTime, { immediate: true });
      __expose({
        start,
        pause,
        reset: resetTime
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(`wd-count-down ${_ctx.customClass}`),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", {
              key: 0,
              current: vue.unref(current)
            }, void 0, true) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                vue.createTextVNode(
                  vue.toDisplayString(timeText.value),
                  1
                  /* TEXT */
                )
              ],
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-dfe7461b"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-count-down/wd-count-down.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        optValue: "1",
        showKeyboard: true,
        errorInfo: "",
        isCountDownVisible: false,
        countDownTime: 60
      };
    },
    onLoad() {
    },
    components: {},
    watch: {
      optValue(newValue, oldValue) {
        if (newValue.length === 6 && newValue !== "123456") {
          this.errorInfo = "密码错误";
        } else {
          this.errorInfo = "";
        }
      }
    },
    methods: {
      onInput(value) {
        formatAppLog("log", "at pages/optLoginPage.vue:48", value, this.optValue.length);
      },
      onDelete() {
      },
      onCountDownClick() {
        this.$refs.countDownItem.start();
        this.isCountDownVisible = true;
        formatAppLog("log", "at pages/optLoginPage.vue:56", this.isCountDownVisible);
      },
      onCountDownFinish() {
        this.$refs.countDownItem.reset();
        this.isCountDownVisible = false;
        formatAppLog("log", "at pages/optLoginPage.vue:61", this.isCountDownVisible);
      },
      onCountDownChange(current) {
        this.countDownTime = current.seconds;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_password_input = resolveEasycom(vue.resolveDynamicComponent("wd-password-input"), __easycom_0$4);
    const _component_wd_number_keyboard = resolveEasycom(vue.resolveDynamicComponent("wd-number-keyboard"), __easycom_1);
    const _component_wd_count_down = resolveEasycom(vue.resolveDynamicComponent("wd-count-down"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "main-container" }, [
      vue.createElementVNode("view", { class: "column" }, [
        vue.createElementVNode("text", { class: "title-text-24" }, "Enter the 6 digit code"),
        vue.createVNode(_component_wd_password_input, {
          modelValue: $data.optValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.optValue = $event),
          mask: false,
          focused: $data.showKeyboard,
          gutter: "2.13vw",
          "error-info": $data.errorInfo,
          onFocus: _cache[1] || (_cache[1] = () => $data.showKeyboard = true),
          class: "opt-input"
        }, null, 8, ["modelValue", "focused", "error-info"]),
        vue.createVNode(_component_wd_number_keyboard, {
          modelValue: $data.optValue,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.optValue = $event),
          visible: $data.showKeyboard,
          "onUpdate:visible": _cache[3] || (_cache[3] = ($event) => $data.showKeyboard = $event),
          maxlength: 6,
          onInput: $options.onInput,
          onDelete: $options.onDelete
        }, null, 8, ["modelValue", "visible", "onInput", "onDelete"]),
        vue.createElementVNode("span", { class: "resend-code-text" }, [
          vue.createElementVNode("text", { style: { "color": "#667085" } }, "Resend Code "),
          vue.createElementVNode("span", null, [
            vue.withDirectives(vue.createElementVNode(
              "text",
              {
                onClick: _cache[4] || (_cache[4] = (...args) => $options.onCountDownClick && $options.onCountDownClick(...args))
              },
              "Here",
              512
              /* NEED_PATCH */
            ), [
              [vue.vShow, !$data.isCountDownVisible]
            ]),
            vue.withDirectives(vue.createElementVNode(
              "text",
              null,
              [
                vue.createTextVNode(
                  vue.toDisplayString($data.countDownTime) + " Sec ",
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_wd_count_down, {
                  ref: "countDownItem",
                  time: 6e4,
                  millisecond: "",
                  "auto-start": false,
                  format: "ss",
                  onChange: $options.onCountDownChange,
                  onFinish: $options.onCountDownFinish,
                  style: { "display": "none" }
                }, null, 8, ["onChange", "onFinish"])
              ],
              512
              /* NEED_PATCH */
            ), [
              [vue.vShow, $data.isCountDownVisible]
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesOptLoginPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/pages/optLoginPage.vue"]]);
  __definePage("pages/optLoginPage", PagesOptLoginPage);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
