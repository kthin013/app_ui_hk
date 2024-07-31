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
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
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
  const checkNumRange = (num, label = "value") => {
    if (num < 0) {
      throw new Error(`${label} shouldn't be less than zero`);
    }
  };
  function getRect(selector, all, scope) {
    return new Promise((resolve, reject) => {
      let query = null;
      if (scope) {
        query = uni.createSelectorQuery().in(scope);
      } else {
        query = uni.createSelectorQuery();
      }
      query[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
        if (all && isArray(rect) && rect.length > 0) {
          resolve(rect);
        } else if (!all && rect) {
          resolve(rect);
        } else {
          reject(new Error("No nodes found"));
        }
      }).exec();
    });
  }
  function kebabCase(word) {
    const newWord = word.replace(/[A-Z]/g, function(match) {
      return "-" + match;
    }).toLowerCase();
    return newWord;
  }
  function camelCase(word) {
    return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
  function isArray(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === "[object Array]";
  }
  function isFunction(value) {
    return getType(value) === "function";
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
  function deepAssign(target, source) {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const newObjValue = source[key];
      if (isObj(targetValue) && isObj(newObjValue)) {
        deepAssign(targetValue, newObjValue);
      } else {
        target[key] = newObjValue;
      }
    });
    return target;
  }
  const getPropByPath = (obj, path) => {
    const keys = path.split(".");
    try {
      return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
    } catch (error) {
      return void 0;
    }
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
  const __default__$4 = {
    name: "wd-icon",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-24906af6"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-icon/wd-icon.vue"]]);
  const progressProps = {
    ...baseProps,
    /**
     * 进度数值，最大值100
     */
    percentage: makeNumberProp(0),
    /**
     * 是否隐藏进度条上的文字，默认值为false
     */
    hideText: makeBooleanProp(false),
    /**
     * 进度条颜色
     */
    color: {
      type: [String, Array, Object],
      default: "linear-gradient(315deg, rgba(81,124,240,1) 0%,rgba(118,158,245,1) 100%)"
    },
    /**
     * 进度增加1%所需毫秒数
     */
    duration: makeNumberProp(30),
    /**
     * 进度条状态
     */
    status: String
  };
  const __default__$3 = {
    name: "wd-progress",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: progressProps,
    setup(__props) {
      const props = __props;
      const showColor = vue.ref("");
      const showPercent = vue.ref(0);
      const changeCount = vue.ref(0);
      const progressClass = vue.ref("");
      let timer = null;
      const rootStyle = vue.computed(() => {
        const style = {
          background: showColor.value,
          width: showPercent.value + "%",
          "transition-duration": changeCount.value * props.duration * 1e-3 + "s"
        };
        return objToStyle(style);
      });
      vue.watch(
        () => props.percentage,
        (newValue) => {
          if (Number.isNaN(newValue) || newValue < 0 || newValue > 100) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-progress/wd-progress.vue:59", "The value of percentage must be between 0 and 100");
          }
          controlProgress();
        }
      );
      vue.watch(
        () => props.color,
        () => {
          controlProgress();
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.status,
        () => {
          computeProgressClass();
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.duration,
        (newValue) => {
          checkNumRange(newValue);
        },
        {
          deep: true,
          immediate: true
        }
      );
      function computeProgressClass() {
        const { status } = props;
        let progressClasses = [];
        status && progressClasses.push(`is-${status}`);
        progressClass.value = progressClasses.join(" ");
      }
      function update(targetPercent, color) {
        if (timer)
          return;
        const { duration } = props;
        changeCount.value = Math.abs(targetPercent - showPercent.value);
        setTimeout(() => {
          showPercent.value = targetPercent;
          showColor.value = color;
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            controlProgress();
          }, changeCount.value * duration);
        }, 50);
      }
      function controlProgress() {
        const {
          // 目标百分比
          percentage,
          // 传入的color数组
          color
        } = props;
        if (showPercent.value === percentage || !percentage)
          return;
        let colorArray = isArray(color) ? color : [color];
        if (colorArray.length === 0)
          throw Error("The colorArray is empty");
        const isStrArray = colorArray.every((item) => typeof item === "string");
        const isObjArray = colorArray.every((color2) => color2.hasOwnProperty("color") && color2.hasOwnProperty("percentage"));
        if (!isStrArray && !isObjArray) {
          throw Error("Color must be String or Object with color and percentage");
        }
        if (isObjArray && colorArray.some(({ percentage: percentage2 }) => Number.isNaN(parseInt(percentage2)))) {
          throw Error("All the percentage must can be formatted to Number");
        }
        const partNum = parseInt(`${100 / colorArray.length}`);
        const partList = isObjArray ? colorArray.sort((a, b) => a.percentage - b.percentage) : colorArray.map((item, index) => {
          return {
            color: item,
            percentage: (index + 1) * partNum
          };
        });
        showPercent.value > percentage ? (
          // 减小不加动画，找到第一个比target大的锚点，取锚点颜色并设置target值
          partList.some((part) => {
            if (percentage <= part.percentage) {
              update(percentage, part.color);
              return true;
            }
          })
        ) : (
          // 增加使用分段动画
          partList.some((part, index) => {
            if (showPercent.value < part.percentage && part.percentage <= percentage) {
              update(part.percentage, part.color);
              return true;
            } else if (index === partList.length - 1) {
              update(percentage, part.color);
            }
          })
        );
      }
      return (_ctx, _cache) => {
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$1);
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(`wd-progress ${_ctx.customClass}`),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            vue.createCommentVNode("进度条"),
            vue.createElementVNode("view", { class: "wd-progress__outer" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(`wd-progress__inner ${progressClass.value}`),
                  style: vue.normalizeStyle(rootStyle.value)
                },
                null,
                6
                /* CLASS, STYLE */
              )
            ]),
            vue.createCommentVNode("文案、图标"),
            !_ctx.hideText ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "wd-progress__label"
              },
              vue.toDisplayString(_ctx.percentage) + "%",
              1
              /* TEXT */
            )) : _ctx.status ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
              key: 1,
              "custom-class": `wd-progress__label wd-progress__icon ${progressClass.value}`,
              name: _ctx.status == "danger" ? "close-outline" : "check-outline",
              color: typeof _ctx.color === "string" ? _ctx.color : ""
            }, null, 8, ["custom-class", "name", "color"])) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-a240b147"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-progress/wd-progress.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal$1 = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$a = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal$1(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$6], ["__scopeId", "data-v-d31e1c47"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$9 = {
    name: "UniStatusBar",
    data() {
      return {
        statusBarHeight: 20
      };
    },
    mounted() {
      this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + "px";
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle({ height: $data.statusBarHeight }),
        class: "uni-status-bar"
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      4
      /* STYLE */
    );
  }
  const statusBar = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$5], ["__scopeId", "data-v-7920e3e0"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar.vue"]]);
  const getVal = (val) => typeof val === "number" ? val + "px" : val;
  const _sfc_main$8 = {
    name: "UniNavBar",
    components: {
      statusBar
    },
    emits: ["clickLeft", "clickRight", "clickTitle"],
    props: {
      dark: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      leftText: {
        type: String,
        default: ""
      },
      rightText: {
        type: String,
        default: ""
      },
      leftIcon: {
        type: String,
        default: ""
      },
      rightIcon: {
        type: String,
        default: ""
      },
      fixed: {
        type: [Boolean, String],
        default: false
      },
      color: {
        type: String,
        default: ""
      },
      backgroundColor: {
        type: String,
        default: ""
      },
      statusBar: {
        type: [Boolean, String],
        default: false
      },
      shadow: {
        type: [Boolean, String],
        default: false
      },
      border: {
        type: [Boolean, String],
        default: true
      },
      height: {
        type: [Number, String],
        default: 44
      },
      leftWidth: {
        type: [Number, String],
        default: 60
      },
      rightWidth: {
        type: [Number, String],
        default: 60
      },
      stat: {
        type: [Boolean, String],
        default: ""
      }
    },
    computed: {
      themeBgColor() {
        if (this.dark) {
          if (this.backgroundColor) {
            return this.backgroundColor;
          } else {
            return this.dark ? "#333" : "#FFF";
          }
        }
        return this.backgroundColor || "#FFF";
      },
      themeColor() {
        if (this.dark) {
          if (this.color) {
            return this.color;
          } else {
            return this.dark ? "#fff" : "#333";
          }
        }
        return this.color || "#333";
      },
      navbarHeight() {
        return getVal(this.height);
      },
      leftIconWidth() {
        return getVal(this.leftWidth);
      },
      rightIconWidth() {
        return getVal(this.rightWidth);
      }
    },
    mounted() {
      if (uni.report && this.stat && this.title !== "") {
        uni.report("title", this.title);
      }
    },
    methods: {
      onClickLeft() {
        this.$emit("clickLeft");
      },
      onClickRight() {
        this.$emit("clickRight");
      },
      onClickTitle() {
        this.$emit("clickTitle");
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_status_bar = vue.resolveComponent("status-bar");
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-navbar", { "uni-dark": $props.dark, "uni-nvue-fixed": $props.fixed }])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-navbar__content", { "uni-navbar--fixed": $props.fixed, "uni-navbar--shadow": $props.shadow, "uni-navbar--border": $props.border }]),
            style: vue.normalizeStyle({ "background-color": $options.themeBgColor })
          },
          [
            $props.statusBar ? (vue.openBlock(), vue.createBlock(_component_status_bar, { key: 0 })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                style: vue.normalizeStyle({ color: $options.themeColor, backgroundColor: $options.themeBgColor, height: $options.navbarHeight }),
                class: "uni-navbar__header"
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args)),
                    class: "uni-navbar__header-btns uni-navbar__header-btns-left",
                    style: vue.normalizeStyle({ width: $options.leftIconWidth })
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "left", {}, () => [
                      $props.leftIcon.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "uni-navbar__content_view"
                      }, [
                        vue.createVNode(_component_uni_icons, {
                          color: $options.themeColor,
                          type: $props.leftIcon,
                          size: "20"
                        }, null, 8, ["color", "type"])
                      ])) : vue.createCommentVNode("v-if", true),
                      $props.leftText.length ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 1,
                          class: vue.normalizeClass([{ "uni-navbar-btn-icon-left": !$props.leftIcon.length > 0 }, "uni-navbar-btn-text"])
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            {
                              style: vue.normalizeStyle({ color: $options.themeColor, fontSize: "12px" })
                            },
                            vue.toDisplayString($props.leftText),
                            5
                            /* TEXT, STYLE */
                          )
                        ],
                        2
                        /* CLASS */
                      )) : vue.createCommentVNode("v-if", true)
                    ], true)
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", {
                  class: "uni-navbar__header-container",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.onClickTitle && $options.onClickTitle(...args))
                }, [
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    $props.title.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "uni-navbar__header-container-inner"
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "uni-nav-bar-text uni-ellipsis-1",
                          style: vue.normalizeStyle({ color: $options.themeColor })
                        },
                        vue.toDisplayString($props.title),
                        5
                        /* TEXT, STYLE */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ], true)
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.onClickRight && $options.onClickRight(...args)),
                    class: "uni-navbar__header-btns uni-navbar__header-btns-right",
                    style: vue.normalizeStyle({ width: $options.rightIconWidth })
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "right", {}, () => [
                      $props.rightIcon.length ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                        vue.createVNode(_component_uni_icons, {
                          color: $options.themeColor,
                          type: $props.rightIcon,
                          size: "22"
                        }, null, 8, ["color", "type"])
                      ])) : vue.createCommentVNode("v-if", true),
                      $props.rightText.length && !$props.rightIcon.length ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "uni-navbar-btn-text"
                      }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "uni-nav-bar-right-text",
                            style: vue.normalizeStyle({ color: $options.themeColor })
                          },
                          vue.toDisplayString($props.rightText),
                          5
                          /* TEXT, STYLE */
                        )
                      ])) : vue.createCommentVNode("v-if", true)
                    ], true)
                  ],
                  4
                  /* STYLE */
                )
              ],
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        $props.fixed ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-navbar__placeholder"
        }, [
          $props.statusBar ? (vue.openBlock(), vue.createBlock(_component_status_bar, { key: 0 })) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: "uni-navbar__placeholder-view",
              style: vue.normalizeStyle({ height: $options.navbarHeight })
            },
            null,
            4
            /* STYLE */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$4], ["__scopeId", "data-v-26544265"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue"]]);
  var pattern = {
    email: /^\S+?@\S+?\.\S+?$/,
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    url: new RegExp(
      "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
      "i"
    )
  };
  const FORMAT_MAPPING = {
    "int": "integer",
    "bool": "boolean",
    "double": "number",
    "long": "number",
    "password": "string"
    // "fileurls": 'array'
  };
  function formatMessage(args, resources = "") {
    var defaultMessage = ["label"];
    defaultMessage.forEach((item) => {
      if (args[item] === void 0) {
        args[item] = "";
      }
    });
    let str = resources;
    for (let key in args) {
      let reg = new RegExp("{" + key + "}");
      str = str.replace(reg, args[key]);
    }
    return str;
  }
  function isEmptyValue(value, type) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (typeof value === "string" && !value) {
      return true;
    }
    if (Array.isArray(value) && !value.length) {
      return true;
    }
    if (type === "object" && !Object.keys(value).length) {
      return true;
    }
    return false;
  }
  const types = {
    integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    string(value) {
      return typeof value === "string";
    },
    number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    "boolean": function(value) {
      return typeof value === "boolean";
    },
    "float": function(value) {
      return types.number(value) && !types.integer(value);
    },
    array(value) {
      return Array.isArray(value);
    },
    object(value) {
      return typeof value === "object" && !types.array(value);
    },
    date(value) {
      return value instanceof Date;
    },
    timestamp(value) {
      if (!this.integer(value) || Math.abs(value).toString().length > 16) {
        return false;
      }
      return true;
    },
    file(value) {
      return typeof value.url === "string";
    },
    email(value) {
      return typeof value === "string" && !!value.match(pattern.email) && value.length < 255;
    },
    url(value) {
      return typeof value === "string" && !!value.match(pattern.url);
    },
    pattern(reg, value) {
      try {
        return new RegExp(reg).test(value);
      } catch (e) {
        return false;
      }
    },
    method(value) {
      return typeof value === "function";
    },
    idcard(value) {
      return typeof value === "string" && !!value.match(pattern.idcard);
    },
    "url-https"(value) {
      return this.url(value) && value.startsWith("https://");
    },
    "url-scheme"(value) {
      return value.startsWith("://");
    },
    "url-web"(value) {
      return false;
    }
  };
  class RuleValidator {
    constructor(message) {
      this._message = message;
    }
    async validateRule(fieldKey, fieldValue, value, data, allData) {
      var result = null;
      let rules = fieldValue.rules;
      let hasRequired = rules.findIndex((item) => {
        return item.required;
      });
      if (hasRequired < 0) {
        if (value === null || value === void 0) {
          return result;
        }
        if (typeof value === "string" && !value.length) {
          return result;
        }
      }
      var message = this._message;
      if (rules === void 0) {
        return message["default"];
      }
      for (var i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let vt = this._getValidateType(rule);
        Object.assign(rule, {
          label: fieldValue.label || `["${fieldKey}"]`
        });
        if (RuleValidatorHelper[vt]) {
          result = RuleValidatorHelper[vt](rule, value, message);
          if (result != null) {
            break;
          }
        }
        if (rule.validateExpr) {
          let now = Date.now();
          let resultExpr = rule.validateExpr(value, allData, now);
          if (resultExpr === false) {
            result = this._getMessage(rule, rule.errorMessage || this._message["default"]);
            break;
          }
        }
        if (rule.validateFunction) {
          result = await this.validateFunction(rule, value, data, allData, vt);
          if (result !== null) {
            break;
          }
        }
      }
      if (result !== null) {
        result = message.TAG + result;
      }
      return result;
    }
    async validateFunction(rule, value, data, allData, vt) {
      let result = null;
      try {
        let callbackMessage = null;
        const res = await rule.validateFunction(rule, value, allData || data, (message) => {
          callbackMessage = message;
        });
        if (callbackMessage || typeof res === "string" && res || res === false) {
          result = this._getMessage(rule, callbackMessage || res, vt);
        }
      } catch (e) {
        result = this._getMessage(rule, e.message, vt);
      }
      return result;
    }
    _getMessage(rule, message, vt) {
      return formatMessage(rule, message || rule.errorMessage || this._message[vt] || message["default"]);
    }
    _getValidateType(rule) {
      var result = "";
      if (rule.required) {
        result = "required";
      } else if (rule.format) {
        result = "format";
      } else if (rule.arrayType) {
        result = "arrayTypeFormat";
      } else if (rule.range) {
        result = "range";
      } else if (rule.maximum !== void 0 || rule.minimum !== void 0) {
        result = "rangeNumber";
      } else if (rule.maxLength !== void 0 || rule.minLength !== void 0) {
        result = "rangeLength";
      } else if (rule.pattern) {
        result = "pattern";
      } else if (rule.validateFunction) {
        result = "validateFunction";
      }
      return result;
    }
  }
  const RuleValidatorHelper = {
    required(rule, value, message) {
      if (rule.required && isEmptyValue(value, rule.format || typeof value)) {
        return formatMessage(rule, rule.errorMessage || message.required);
      }
      return null;
    },
    range(rule, value, message) {
      const {
        range,
        errorMessage
      } = rule;
      let list = new Array(range.length);
      for (let i = 0; i < range.length; i++) {
        const item = range[i];
        if (types.object(item) && item.value !== void 0) {
          list[i] = item.value;
        } else {
          list[i] = item;
        }
      }
      let result = false;
      if (Array.isArray(value)) {
        result = new Set(value.concat(list)).size === list.length;
      } else {
        if (list.indexOf(value) > -1) {
          result = true;
        }
      }
      if (!result) {
        return formatMessage(rule, errorMessage || message["enum"]);
      }
      return null;
    },
    rangeNumber(rule, value, message) {
      if (!types.number(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let {
        minimum,
        maximum,
        exclusiveMinimum,
        exclusiveMaximum
      } = rule;
      let min = exclusiveMinimum ? value <= minimum : value < minimum;
      let max = exclusiveMaximum ? value >= maximum : value > maximum;
      if (minimum !== void 0 && min) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMinimum ? "exclusiveMinimum" : "minimum"]);
      } else if (maximum !== void 0 && max) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMaximum ? "exclusiveMaximum" : "maximum"]);
      } else if (minimum !== void 0 && maximum !== void 0 && (min || max)) {
        return formatMessage(rule, rule.errorMessage || message["number"].range);
      }
      return null;
    },
    rangeLength(rule, value, message) {
      if (!types.string(value) && !types.array(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let min = rule.minLength;
      let max = rule.maxLength;
      let val = value.length;
      if (min !== void 0 && val < min) {
        return formatMessage(rule, rule.errorMessage || message["length"].minLength);
      } else if (max !== void 0 && val > max) {
        return formatMessage(rule, rule.errorMessage || message["length"].maxLength);
      } else if (min !== void 0 && max !== void 0 && (val < min || val > max)) {
        return formatMessage(rule, rule.errorMessage || message["length"].range);
      }
      return null;
    },
    pattern(rule, value, message) {
      if (!types["pattern"](rule.pattern, value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      return null;
    },
    format(rule, value, message) {
      var customTypes = Object.keys(types);
      var format = FORMAT_MAPPING[rule.format] ? FORMAT_MAPPING[rule.format] : rule.format || rule.arrayType;
      if (customTypes.indexOf(format) > -1) {
        if (!types[format](value)) {
          return formatMessage(rule, rule.errorMessage || message.typeError);
        }
      }
      return null;
    },
    arrayTypeFormat(rule, value, message) {
      if (!Array.isArray(value)) {
        return formatMessage(rule, rule.errorMessage || message.typeError);
      }
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        let formatResult = this.format(rule, element, message);
        if (formatResult !== null) {
          return formatResult;
        }
      }
      return null;
    }
  };
  class SchemaValidator extends RuleValidator {
    constructor(schema, options) {
      super(SchemaValidator.message);
      this._schema = schema;
      this._options = options || null;
    }
    updateSchema(schema) {
      this._schema = schema;
    }
    async validate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async validateAll(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, true, allData);
      }
      return result;
    }
    async validateUpdate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidateUpdate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async invokeValidate(data, all, allData) {
      let result = [];
      let schema = this._schema;
      for (let key in schema) {
        let value = schema[key];
        let errorMessage = await this.validateRule(key, value, data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    async invokeValidateUpdate(data, all, allData) {
      let result = [];
      for (let key in data) {
        let errorMessage = await this.validateRule(key, this._schema[key], data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    _checkFieldInSchema(data) {
      var keys = Object.keys(data);
      var keys2 = Object.keys(this._schema);
      if (new Set(keys.concat(keys2)).size === keys2.length) {
        return "";
      }
      var noExistFields = keys.filter((key) => {
        return keys2.indexOf(key) < 0;
      });
      var errorMessage = formatMessage({
        field: JSON.stringify(noExistFields)
      }, SchemaValidator.message.TAG + SchemaValidator.message["defaultInvalid"]);
      return [{
        key: "invalid",
        errorMessage
      }];
    }
  }
  function Message() {
    return {
      TAG: "",
      default: "验证错误",
      defaultInvalid: "提交的字段{field}在数据库中并不存在",
      validateFunction: "验证无效",
      required: "{label}必填",
      "enum": "{label}超出范围",
      timestamp: "{label}格式无效",
      whitespace: "{label}不能为空",
      typeError: "{label}类型无效",
      date: {
        format: "{label}日期{value}格式无效",
        parse: "{label}日期无法解析,{value}无效",
        invalid: "{label}日期{value}无效"
      },
      length: {
        minLength: "{label}长度不能少于{minLength}",
        maxLength: "{label}长度不能超过{maxLength}",
        range: "{label}必须介于{minLength}和{maxLength}之间"
      },
      number: {
        minimum: "{label}不能小于{minimum}",
        maximum: "{label}不能大于{maximum}",
        exclusiveMinimum: "{label}不能小于等于{minimum}",
        exclusiveMaximum: "{label}不能大于等于{maximum}",
        range: "{label}必须介于{minimum}and{maximum}之间"
      },
      pattern: {
        mismatch: "{label}格式不匹配"
      }
    };
  }
  SchemaValidator.message = new Message();
  const deepCopy = (val) => {
    return JSON.parse(JSON.stringify(val));
  };
  const typeFilter = (format) => {
    return format === "int" || format === "double" || format === "number" || format === "timestamp";
  };
  const getValue = (key, value, rules) => {
    const isRuleNumType = rules.find((val) => val.format && typeFilter(val.format));
    const isRuleBoolType = rules.find((val) => val.format && val.format === "boolean" || val.format === "bool");
    if (!!isRuleNumType) {
      if (!value && value !== 0) {
        value = null;
      } else {
        value = isNumber(Number(value)) ? Number(value) : value;
      }
    }
    if (!!isRuleBoolType) {
      value = isBoolean(value) ? value : false;
    }
    return value;
  };
  const setDataValue = (field, formdata, value) => {
    formdata[field] = value;
    return value || "";
  };
  const getDataValue = (field, data) => {
    return objGet(data, field);
  };
  const realName = (name, data = {}) => {
    const base_name = _basePath(name);
    if (typeof base_name === "object" && Array.isArray(base_name) && base_name.length > 1) {
      const realname = base_name.reduce((a, b) => a += `#${b}`, "_formdata_");
      return realname;
    }
    return base_name[0] || name;
  };
  const isRealName = (name) => {
    const reg = /^_formdata_#*/;
    return reg.test(name);
  };
  const rawData = (object = {}, name) => {
    let newData = JSON.parse(JSON.stringify(object));
    let formData = {};
    for (let i in newData) {
      let path = name2arr(i);
      objSet(formData, path, newData[i]);
    }
    return formData;
  };
  const name2arr = (name) => {
    let field = name.replace("_formdata_#", "");
    field = field.split("#").map((v) => isNumber(v) ? Number(v) : v);
    return field;
  };
  const objSet = (object, path, value) => {
    if (typeof object !== "object")
      return object;
    _basePath(path).reduce((o, k, i, _) => {
      if (i === _.length - 1) {
        o[k] = value;
        return null;
      } else if (k in o) {
        return o[k];
      } else {
        o[k] = /^[0-9]{1,}$/.test(_[i + 1]) ? [] : {};
        return o[k];
      }
    }, object);
    return object;
  };
  function _basePath(path) {
    if (Array.isArray(path))
      return path;
    return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  const objGet = (object, path, defaultVal = "undefined") => {
    let newPath = _basePath(path);
    let val = newPath.reduce((o, k) => {
      return (o || {})[k];
    }, object);
    return !val || val !== void 0 ? val : defaultVal;
  };
  const isNumber = (num) => {
    return !isNaN(Number(num));
  };
  const isBoolean = (bool) => {
    return typeof bool === "boolean";
  };
  const isRequiredField = (rules) => {
    let isNoField = false;
    for (let i = 0; i < rules.length; i++) {
      const ruleData = rules[i];
      if (ruleData.required) {
        isNoField = true;
        break;
      }
    }
    return isNoField;
  };
  const isEqual = (a, b) => {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a == null || b == null) {
      return a === b;
    }
    var classNameA = toString.call(a), classNameB = toString.call(b);
    if (classNameA !== classNameB) {
      return false;
    }
    switch (classNameA) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) {
          return +b !== +b;
        }
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
    }
    if (classNameA == "[object Object]") {
      var propsA = Object.getOwnPropertyNames(a), propsB = Object.getOwnPropertyNames(b);
      if (propsA.length != propsB.length) {
        return false;
      }
      for (var i = 0; i < propsA.length; i++) {
        var propName = propsA[i];
        if (a[propName] !== b[propName]) {
          return false;
        }
      }
      return true;
    }
    if (classNameA == "[object Array]") {
      if (a.toString() == b.toString()) {
        return true;
      }
      return false;
    }
  };
  const _sfc_main$7 = {
    name: "uniForms",
    emits: ["validate", "submit"],
    options: {
      virtualHost: true
    },
    props: {
      // 即将弃用
      value: {
        type: Object,
        default() {
          return null;
        }
      },
      // vue3 替换 value 属性
      modelValue: {
        type: Object,
        default() {
          return null;
        }
      },
      // 1.4.0 开始将不支持 v-model ，且废弃 value 和 modelValue
      model: {
        type: Object,
        default() {
          return null;
        }
      },
      // 表单校验规则
      rules: {
        type: Object,
        default() {
          return {};
        }
      },
      //校验错误信息提示方式 默认 undertext 取值 [undertext|toast|modal]
      errShowType: {
        type: String,
        default: "undertext"
      },
      // 校验触发器方式 默认 bind 取值 [bind|submit]
      validateTrigger: {
        type: String,
        default: "submit"
      },
      // label 位置，默认 left 取值  top/left
      labelPosition: {
        type: String,
        default: "left"
      },
      // label 宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: "left"
      },
      border: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        uniForm: this
      };
    },
    data() {
      return {
        // 表单本地值的记录，不应该与传如的值进行关联
        formData: {},
        formRules: {}
      };
    },
    computed: {
      // 计算数据源变化的
      localData() {
        const localVal = this.model || this.modelValue || this.value;
        if (localVal) {
          return deepCopy(localVal);
        }
        return {};
      }
    },
    watch: {
      // 监听数据变化 ,暂时不使用，需要单独赋值
      // localData: {},
      // 监听规则变化
      rules: {
        handler: function(val, oldVal) {
          this.setRules(val);
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let getbinddata = getApp().$vm.$.appContext.config.globalProperties.binddata;
      if (!getbinddata) {
        getApp().$vm.$.appContext.config.globalProperties.binddata = function(name, value, formName) {
          if (formName) {
            this.$refs[formName].setValue(name, value);
          } else {
            let formVm;
            for (let i in this.$refs) {
              const vm = this.$refs[i];
              if (vm && vm.$options && vm.$options.name === "uniForms") {
                formVm = vm;
                break;
              }
            }
            if (!formVm)
              return formatAppLog("error", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:182", "当前 uni-froms 组件缺少 ref 属性");
            formVm.setValue(name, value);
          }
        };
      }
      this.childrens = [];
      this.inputChildrens = [];
      this.setRules(this.rules);
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules) {
        this.formRules = Object.assign({}, this.formRules, rules);
        this.validator = new SchemaValidator(rules);
      },
      /**
       * 外部调用方法
       * 设置数据，用于设置表单数据，公开给用户使用 ， 不支持在动态表单中使用
       * @param {Object} key
       * @param {Object} value
       */
      setValue(key, value) {
        let example = this.childrens.find((child) => child.name === key);
        if (!example)
          return null;
        this.formData[key] = getValue(key, value, this.formRules[key] && this.formRules[key].rules || []);
        return example.onFieldChange(this.formData[key]);
      },
      /**
       * 外部调用方法
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      validate(keepitem, callback) {
        return this.checkAll(this.formData, keepitem, callback);
      },
      /**
       * 外部调用方法
       * 部分表单校验
       * @param {Array|String} props 需要校验的字段
       * @param {Function} 回调函数
       */
      validateField(props = [], callback) {
        props = [].concat(props);
        let invalidFields = {};
        this.childrens.forEach((item) => {
          const name = realName(item.name);
          if (props.indexOf(name) !== -1) {
            invalidFields = Object.assign({}, invalidFields, {
              [name]: this.formData[name]
            });
          }
        });
        return this.checkAll(invalidFields, [], callback);
      },
      /**
       * 外部调用方法
       * 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
       * @param {Array|String} props 需要移除校验的字段 ，不填为所有
       */
      clearValidate(props = []) {
        props = [].concat(props);
        this.childrens.forEach((item) => {
          if (props.length === 0) {
            item.errMsg = "";
          } else {
            const name = realName(item.name);
            if (props.indexOf(name) !== -1) {
              item.errMsg = "";
            }
          }
        });
      },
      /**
       * 外部调用方法 ，即将废弃
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      submit(keepitem, callback, type) {
        for (let i in this.dataValue) {
          const itemData = this.childrens.find((v) => v.name === i);
          if (itemData) {
            if (this.formData[i] === void 0) {
              this.formData[i] = this._getValue(i, this.dataValue[i]);
            }
          }
        }
        if (!type) {
          formatAppLog("warn", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:289", "submit 方法即将废弃，请使用validate方法代替！");
        }
        return this.checkAll(this.formData, keepitem, callback, "submit");
      },
      // 校验所有
      async checkAll(invalidFields, keepitem, callback, type) {
        if (!this.validator)
          return;
        let childrens = [];
        for (let i in invalidFields) {
          const item = this.childrens.find((v) => realName(v.name) === i);
          if (item) {
            childrens.push(item);
          }
        }
        if (!callback && typeof keepitem === "function") {
          callback = keepitem;
        }
        let promise;
        if (!callback && typeof callback !== "function" && Promise) {
          promise = new Promise((resolve, reject) => {
            callback = function(valid, invalidFields2) {
              !valid ? resolve(invalidFields2) : reject(valid);
            };
          });
        }
        let results = [];
        let tempFormData = JSON.parse(JSON.stringify(invalidFields));
        for (let i in childrens) {
          const child = childrens[i];
          let name = realName(child.name);
          const result = await child.onFieldChange(tempFormData[name]);
          if (result) {
            results.push(result);
            if (this.errShowType === "toast" || this.errShowType === "modal")
              break;
          }
        }
        if (Array.isArray(results)) {
          if (results.length === 0)
            results = null;
        }
        if (Array.isArray(keepitem)) {
          keepitem.forEach((v) => {
            let vName = realName(v);
            let value = getDataValue(v, this.localData);
            if (value !== void 0) {
              tempFormData[vName] = value;
            }
          });
        }
        if (type === "submit") {
          this.$emit("submit", {
            detail: {
              value: tempFormData,
              errors: results
            }
          });
        } else {
          this.$emit("validate", results);
        }
        let resetFormData = {};
        resetFormData = rawData(tempFormData, this.name);
        callback && typeof callback === "function" && callback(results, resetFormData);
        if (promise && callback) {
          return promise;
        } else {
          return null;
        }
      },
      /**
       * 返回validate事件
       * @param {Object} result
       */
      validateCheck(result) {
        this.$emit("validate", result);
      },
      _getValue: getValue,
      _isRequiredField: isRequiredField,
      _setDataValue: setDataValue,
      _getDataValue: getDataValue,
      _realName: realName,
      _isRealName: isRealName,
      _isEqual: isEqual
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-forms" }, [
      vue.createElementVNode("form", null, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$3], ["__scopeId", "data-v-9a1e3c32"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/uni-forms/components/uni-forms/uni-forms.vue"]]);
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
  const buttonProps = {
    ...baseProps,
    /**
     * 幽灵按钮
     */
    plain: makeBooleanProp(false),
    /**
     * 圆角按钮
     */
    round: makeBooleanProp(true),
    /**
     * 禁用按钮
     */
    disabled: makeBooleanProp(false),
    /**
     * 是否细边框
     */
    hairline: makeBooleanProp(false),
    /**
     * 块状按钮
     */
    block: makeBooleanProp(false),
    /**
     * 按钮类型，可选值：primary / success / info / warning / error / text / icon
     */
    type: makeStringProp("primary"),
    /**
     * 按钮尺寸，可选值：small / medium / large
     */
    size: makeStringProp("medium"),
    /**
     * 图标类名
     */
    icon: String,
    /**
     * 加载中按钮
     */
    loading: makeBooleanProp(false),
    /**
     * 加载图标颜色
     */
    loadingColor: String,
    /**
     * 开放能力
     */
    openType: String,
    formType: String,
    /**
     * 指定是否阻止本节点的祖先节点出现点击态
     */
    hoverStopPropagation: Boolean,
    /**
     * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
     */
    lang: String,
    /**
     * 会话来源，open-type="contact"时有效
     */
    sessionFrom: String,
    /**
     * 会话内消息卡片标题，open-type="contact"时有效
     */
    sendMessageTitle: String,
    /**
     * 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
     */
    sendMessagePath: String,
    /**
     * 会话内消息卡片图片，open-type="contact"时有效
     */
    sendMessageImg: String,
    /**
     * 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
     */
    appParameter: String,
    /**
     * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效
     */
    showMessageCard: Boolean
  };
  const __default__$2 = {
    name: "wd-button",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: buttonProps,
    emits: [
      "click",
      "getuserinfo",
      "contact",
      "getphonenumber",
      "error",
      "launchapp",
      "opensetting",
      "chooseavatar",
      "agreeprivacyauthorization"
    ],
    setup(__props, { emit: __emit }) {
      const loadingIcon = (color = "#4D80F0", reverse = true) => {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="a"><stop stop-color="${reverse ? color : "#fff"}" offset="0%" stop-opacity="0"/><stop stop-color="${reverse ? color : "#fff"}" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${reverse ? "#fff" : color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#a)" stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
      };
      const props = __props;
      const emit = __emit;
      const hoverStartTime = vue.ref(20);
      const hoverStayTime = vue.ref(70);
      const loadingIconSvg = vue.ref("");
      const loadingStyle = vue.computed(() => {
        return `background-image: url(${loadingIconSvg.value});`;
      });
      vue.watch(
        () => props.loading,
        () => {
          buildLoadingSvg();
        },
        { deep: true, immediate: true }
      );
      function handleClick(event) {
        if (!props.disabled && !props.loading) {
          emit("click", event.detail);
        }
      }
      function handleGetuserinfo(event) {
        emit("getuserinfo", event.detail);
      }
      function handleConcat(event) {
        emit("contact", event.detail);
      }
      function handleGetphonenumber(event) {
        emit("getphonenumber", event.detail);
      }
      function handleError(event) {
        emit("error", event.detail);
      }
      function handleLaunchapp(event) {
        emit("launchapp", event.detail);
      }
      function handleOpensetting(event) {
        emit("opensetting", event.detail);
      }
      function handleChooseavatar(event) {
        emit("chooseavatar", event.detail);
      }
      function handleAgreePrivacyAuthorization(event) {
        emit("agreeprivacyauthorization", event.detail);
      }
      function buildLoadingSvg() {
        const { loadingColor, type, plain } = props;
        let color = loadingColor;
        if (!color) {
          switch (type) {
            case "primary":
              color = "#4D80F0";
              break;
            case "success":
              color = "#34d19d";
              break;
            case "info":
              color = "#333";
              break;
            case "warning":
              color = "#f0883a";
              break;
            case "error":
              color = "#fa4350";
              break;
            case "default":
              color = "#333";
              break;
          }
        }
        const svg = loadingIcon(color, !plain);
        loadingIconSvg.value = `"data:image/svg+xml;base64,${encode(svg)}"`;
      }
      return (_ctx, _cache) => {
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$1);
        return vue.openBlock(), vue.createElementBlock("button", {
          "hover-class": `${_ctx.disabled || _ctx.loading ? "" : "wd-button--active"}`,
          style: vue.normalizeStyle(_ctx.customStyle),
          class: vue.normalizeClass([
            "wd-button",
            "is-" + _ctx.type,
            "is-" + _ctx.size,
            _ctx.plain ? "is-plain" : "",
            _ctx.disabled ? "is-disabled" : "",
            _ctx.round ? "is-round" : "",
            _ctx.hairline ? "is-hairline" : "",
            _ctx.block ? "is-block" : "",
            _ctx.loading ? "is-loading" : "",
            _ctx.customClass
          ]),
          "hover-start-time": hoverStartTime.value,
          "hover-stay-time": hoverStayTime.value,
          "open-type": _ctx.openType,
          "send-message-title": _ctx.sendMessageTitle,
          "send-message-path": _ctx.sendMessagePath,
          "send-message-img": _ctx.sendMessageImg,
          "app-parameter": _ctx.appParameter,
          "show-message-card": _ctx.showMessageCard,
          "session-from": _ctx.sessionFrom,
          lang: _ctx.lang,
          "hover-stop-propagation": _ctx.hoverStopPropagation,
          "form-type": _ctx.formType,
          onClick: handleClick,
          onGetuserinfo: handleGetuserinfo,
          onContact: handleConcat,
          onGetphonenumber: handleGetphonenumber,
          onError: handleError,
          onLaunchapp: handleLaunchapp,
          onOpensetting: handleOpensetting,
          onChooseavatar: handleChooseavatar,
          onAgreeprivacyauthorization: handleAgreePrivacyAuthorization
        }, [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "wd-button__loading"
          }, [
            vue.createElementVNode(
              "view",
              {
                class: "wd-button__loading-svg",
                style: vue.normalizeStyle(loadingStyle.value)
              },
              null,
              4
              /* STYLE */
            )
          ])) : _ctx.icon ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
            key: 1,
            "custom-class": "wd-button__icon",
            name: _ctx.icon
          }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "wd-button__text" }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ], 46, ["hover-class", "hover-start-time", "hover-stay-time", "open-type", "send-message-title", "send-message-path", "send-message-img", "app-parameter", "show-message-card", "session-from", "lang", "hover-stop-propagation", "form-type"]);
      };
    }
  });
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-d858c170"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-button/wd-button.vue"]]);
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function flattenVNodes(children) {
    const result = [];
    const traverse = (children2) => {
      if (Array.isArray(children2)) {
        children2.forEach((child) => {
          var _a;
          if (isVNode(child)) {
            result.push(child);
            if ((_a = child.component) == null ? void 0 : _a.subTree) {
              result.push(child.component.subTree);
              traverse(child.component.subTree.children);
            }
            if (child.children) {
              traverse(child.children);
            }
          }
        });
      }
    };
    traverse(children);
    return result;
  }
  const findVNodeIndex = (vnodes, vnode) => {
    const index = vnodes.indexOf(vnode);
    if (index === -1) {
      return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
    }
    return index;
  };
  function sortChildren(parent, publicChildren, internalChildren) {
    const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree.children) : [];
    internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
    const orderedPublicChildren = internalChildren.map((item) => item.proxy);
    publicChildren.sort((a, b) => {
      const indexA = orderedPublicChildren.indexOf(a);
      const indexB = orderedPublicChildren.indexOf(b);
      return indexA - indexB;
    });
  }
  function useChildren(key) {
    const publicChildren = vue.reactive([]);
    const internalChildren = vue.reactive([]);
    const parent = vue.getCurrentInstance();
    const linkChildren = (value) => {
      const link = (child) => {
        if (child.proxy) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      };
      const unlink = (child) => {
        const index = internalChildren.indexOf(child);
        publicChildren.splice(index, 1);
        internalChildren.splice(index, 1);
      };
      vue.provide(
        key,
        Object.assign(
          {
            link,
            unlink,
            children: publicChildren,
            internalChildren
          },
          value
        )
      );
    };
    return {
      children: publicChildren,
      linkChildren
    };
  }
  const TABBAR_KEY = Symbol("wd-tabbar");
  const tabbarProps = {
    ...baseProps,
    /**
     * 选中标签的索引值或者名称
     */
    modelValue: makeNumericProp(0),
    /**
     * 是否固定在底部
     */
    fixed: makeBooleanProp(false),
    /**
     * 是否显示顶部边框
     */
    bordered: makeBooleanProp(true),
    /**
     * 是否设置底部安全距禿（iPhone X 类型的机型）
     */
    safeAreaInsetBottom: makeBooleanProp(false),
    /**
     * 标签栏的形状。可选项：default/round
     */
    shape: makeStringProp("default"),
    /**
     * 激活标签的颜色
     */
    activeColor: String,
    /**
     * 未激活标签的颜色
     */
    inactiveColor: String,
    /**
     * 固定在底部时，是否在标签位置生成一个等高的占位元素
     */
    placeholder: makeBooleanProp(false),
    /**
     * 自定义组件的层级
     */
    zIndex: makeNumberProp(99)
  };
  const __default__$1 = {
    name: "wd-tabbar",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: tabbarProps,
    emits: ["change", "update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const height = vue.ref("");
      const { proxy } = vue.getCurrentInstance();
      const { linkChildren } = useChildren(TABBAR_KEY);
      linkChildren({
        props,
        setChange
      });
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.zIndex)) {
          style["z-index"] = props.zIndex;
        }
        return `${objToStyle(style)};${props.customStyle}`;
      });
      vue.watch(
        [() => props.fixed, () => props.placeholder],
        () => {
          setPlaceholderHeight();
        },
        { deep: true, immediate: false }
      );
      vue.onMounted(() => {
        if (props.fixed && props.placeholder) {
          vue.nextTick(() => {
            setPlaceholderHeight();
          });
        }
      });
      function setChange(child) {
        let active = child.name;
        emit("update:modelValue", active);
        emit("change", {
          value: active
        });
      }
      function setPlaceholderHeight() {
        if (!props.fixed || !props.placeholder) {
          return;
        }
        getRect(".wd-tabbar", false, proxy).then((res) => {
          height.value = Number(res.height);
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass({ "wd-tabbar__placeholder": _ctx.fixed && _ctx.placeholder && _ctx.safeAreaInsetBottom && _ctx.shape === "round" }),
            style: vue.normalizeStyle({ height: vue.unref(addUnit)(height.value) })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(`wd-tabbar wd-tabbar--${_ctx.shape} ${_ctx.customClass} ${_ctx.fixed ? "is-fixed" : ""} ${_ctx.safeAreaInsetBottom ? "is-safe" : ""} ${_ctx.bordered ? "is-border" : ""}`),
                style: vue.normalizeStyle(rootStyle.value)
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ],
              6
              /* CLASS, STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-70467ab8"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-tabbar/wd-tabbar.vue"]]);
  const zhCN = {
    calendar: {
      placeholder: "请选择",
      title: "选择日期",
      day: "日",
      week: "周",
      month: "月",
      confirm: "确定",
      startTime: "开始时间",
      endTime: "结束时间",
      to: "至",
      timeFormat: "YY年MM月DD日 HH:mm:ss",
      dateFormat: "YYYY年MM月DD日",
      weekFormat: (year, week) => `${year} 第 ${week} 周`,
      startWeek: "开始周",
      endWeek: "结束周",
      startMonth: "开始月",
      endMonth: "结束月",
      monthFormat: "YYYY年MM月"
    },
    calendarView: {
      startTime: "开始",
      endTime: "结束",
      weeks: {
        sun: "日",
        mon: "一",
        tue: "二",
        wed: "三",
        thu: "四",
        fri: "五",
        sat: "六"
      },
      rangePrompt: (maxRange) => `选择天数不能超过${maxRange}天`,
      rangePromptWeek: (maxRange) => `选择周数不能超过${maxRange}周`,
      rangePromptMonth: (maxRange) => `选择月份不能超过${maxRange}个月`,
      monthTitle: "YYYY年M月",
      yearTitle: "YYYY年",
      month: "M月",
      hour: (value) => `${value}时`,
      minute: (value) => `${value}分`,
      second: (value) => `${value}秒`
    },
    collapse: {
      expand: "展开",
      retract: "收起"
    },
    colPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择"
    },
    datetimePicker: {
      start: "开始时间",
      end: "结束时间",
      to: "至",
      placeholder: "请选择",
      confirm: "完成",
      cancel: "取消"
    },
    loadmore: {
      loading: "正在努力加载中...",
      finished: "已加载完毕",
      error: "加载失败",
      retry: "点击重试"
    },
    messageBox: {
      inputPlaceholder: "请输入",
      confirm: "确定",
      cancel: "取消",
      inputNoValidate: "输入的数据不合法"
    },
    numberKeyboard: {
      confirm: "完成"
    },
    pagination: {
      prev: "上一页",
      next: "下一页",
      page: (value) => `当前页：${value}`,
      total: (total) => `当前数据：${total}条`,
      size: (size) => `分页大小：${size}`
    },
    picker: {
      cancel: "取消",
      done: "完成",
      placeholder: "请选择"
    },
    imgCropper: {
      confirm: "完成",
      cancel: "取消"
    },
    search: {
      search: "搜索",
      cancel: "取消"
    },
    steps: {
      wait: "未开始",
      finished: "已完成",
      process: "进行中",
      failed: "失败"
    },
    tabs: {
      all: "全部"
    },
    upload: {
      error: "上传失败"
    },
    input: {
      placeholder: "请输入..."
    },
    selectPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择",
      confirm: "确认",
      filterPlaceholder: "搜索"
    },
    tag: {
      placeholder: "请输入",
      add: "新增标签"
    },
    textarea: {
      placeholder: "请输入..."
    },
    tableCol: {
      indexLabel: "序号"
    }
  };
  const lang = vue.ref("zh-CN");
  const messages$1 = vue.reactive({
    "zh-CN": zhCN
  });
  const Locale = {
    messages() {
      return messages$1[lang.value];
    },
    use(newLang, newMessage) {
      lang.value = newLang;
      if (newMessage) {
        this.add({ [newLang]: newMessage });
      }
    },
    add(newMessages = {}) {
      deepAssign(messages$1, newMessages);
    }
  };
  const useTranslate = (name) => {
    const prefix = name ? camelCase(name) + "." : "";
    const translate = (key, ...args) => {
      const currentMessages = Locale.messages();
      const message = getPropByPath(currentMessages, prefix + key);
      return isFunction(message) ? message(...args) : message;
    };
    return { translate };
  };
  const searchProps = {
    ...baseProps,
    /**
     * 输入框内容，双向绑定
     * 类型: string
     * 默认值: ''
     */
    modelValue: makeStringProp(""),
    /**
     * 是否使用输入框右侧插槽
     * 类型: boolean
     * 默认值: false
     * @deprecated 该属性已废弃，将在下一个minor版本被移除，直接使用插槽即可
     */
    useSuffixSlot: makeBooleanProp(false),
    /**
     * 搜索框占位文本
     * 类型: string
     */
    placeholder: String,
    /**
     * 搜索框右侧文本
     * 类型: string
     */
    cancelTxt: String,
    /**
     * 搜索框亮色（白色）
     * 类型: boolean
     * 默认值: false
     */
    light: makeBooleanProp(false),
    /**
     * 是否隐藏右侧文本
     * 类型: boolean
     * 默认值: false
     */
    hideCancel: makeBooleanProp(false),
    /**
     * 是否禁用搜索框
     * 类型: boolean
     * 默认值: false
     */
    disabled: makeBooleanProp(false),
    /**
     * 原生属性，设置最大长度。-1 表示无限制
     * 类型: string / number
     * 默认值: -1
     */
    maxlength: makeNumericProp(-1),
    /**
     * placeholder 居左边
     * 类型: boolean
     * 默认值: false
     */
    placeholderLeft: makeBooleanProp(false),
    /**
     * 是否自动聚焦
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focus: makeBooleanProp(false),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focusWhenClear: makeBooleanProp(false)
  };
  const __default__ = {
    name: "wd-search",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: searchProps,
    emits: ["update:modelValue", "change", "clear", "search", "focus", "blur", "cancel"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("search");
      const isFocused = vue.ref(false);
      const showInput = vue.ref(false);
      const str = vue.ref("");
      const showPlaceHolder = vue.ref(true);
      const clearing = vue.ref(false);
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          str.value = newValue;
          if (newValue) {
            showInput.value = true;
          }
        },
        { immediate: true }
      );
      vue.watch(
        () => props.focus,
        (newValue) => {
          if (newValue) {
            if (props.disabled)
              return;
            closeCover();
          }
        }
      );
      vue.onMounted(() => {
        if (props.focus) {
          closeCover();
        }
      });
      const rootClass = vue.computed(() => {
        return `wd-search  ${props.light ? "is-light" : ""}  ${props.hideCancel ? "is-without-cancel" : ""} ${props.customClass}`;
      });
      const coverStyle = vue.computed(() => {
        const coverStyle2 = {
          display: str.value === "" && showPlaceHolder.value ? "flex" : "none"
        };
        return objToStyle(coverStyle2);
      });
      function hackFocus(focus) {
        showInput.value = focus;
        requestAnimationFrame(() => {
          isFocused.value = focus;
        });
      }
      function closeCover() {
        if (props.disabled)
          return;
        requestAnimationFrame().then(() => requestAnimationFrame()).then(() => requestAnimationFrame()).then(() => {
          showPlaceHolder.value = false;
          hackFocus(true);
        });
      }
      function inputValue(event) {
        str.value = event.detail.value;
        emit("update:modelValue", event.detail.value);
        emit("change", {
          value: event.detail.value
        });
      }
      function clearSearch() {
        str.value = "";
        clearing.value = true;
        if (props.focusWhenClear) {
          isFocused.value = false;
        }
        requestAnimationFrame().then(() => requestAnimationFrame()).then(() => requestAnimationFrame()).then(() => {
          if (props.focusWhenClear) {
            showPlaceHolder.value = false;
            hackFocus(true);
          } else {
            showPlaceHolder.value = true;
            hackFocus(false);
          }
          emit("change", {
            value: ""
          });
          emit("update:modelValue", "");
          emit("clear");
        });
      }
      function search({ detail: { value } }) {
        emit("search", {
          value
        });
      }
      function searchFocus() {
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        showPlaceHolder.value = false;
        emit("focus", {
          value: str.value
        });
      }
      function searchBlur() {
        if (clearing.value)
          return;
        showPlaceHolder.value = !str.value;
        showInput.value = !showPlaceHolder.value;
        isFocused.value = false;
        emit("blur", {
          value: str.value
        });
      }
      function handleCancel() {
        emit("cancel", {
          value: str.value
        });
      }
      return (_ctx, _cache) => {
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$1);
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(rootClass.value),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            vue.createCommentVNode("自定义label插槽"),
            vue.createCommentVNode("搜索框主体"),
            vue.createElementVNode("view", { class: "wd-search__block" }, [
              vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true),
              vue.createElementVNode("view", { class: "wd-search__field" }, [
                !_ctx.placeholderLeft ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    style: vue.normalizeStyle(coverStyle.value),
                    class: "wd-search__cover",
                    onClick: closeCover
                  },
                  [
                    vue.createVNode(_component_wd_icon, {
                      name: "search",
                      size: "18px",
                      "custom-class": "wd-search__search-icon"
                    }),
                    vue.createElementVNode(
                      "text",
                      { class: "wd-search__placeholder-txt" },
                      vue.toDisplayString(_ctx.placeholder || vue.unref(translate)("search")),
                      1
                      /* TEXT */
                    )
                  ],
                  4
                  /* STYLE */
                )) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode("icon:search"),
                showInput.value || str.value || _ctx.placeholderLeft ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                  key: 1,
                  name: "search",
                  size: "18px",
                  "custom-class": "wd-search__search-left-icon"
                })) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode("搜索框"),
                showInput.value || str.value || _ctx.placeholderLeft ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                  key: 2,
                  placeholder: _ctx.placeholder || vue.unref(translate)("search"),
                  "placeholder-class": "wd-search__placeholder-txt",
                  "confirm-type": "search",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => str.value = $event),
                  class: "wd-search__input",
                  onFocus: searchFocus,
                  onInput: inputValue,
                  onBlur: searchBlur,
                  onConfirm: search,
                  disabled: _ctx.disabled,
                  maxlength: _ctx.maxlength,
                  focus: isFocused.value
                }, null, 40, ["placeholder", "disabled", "maxlength", "focus"])), [
                  [vue.vModelText, str.value]
                ]) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode("icon:clear"),
                str.value ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                  key: 3,
                  "custom-class": "wd-search__clear wd-search__clear-icon",
                  name: "error-fill",
                  size: "16px",
                  onClick: clearSearch
                })) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            vue.createCommentVNode("the button behind input,care for hideCancel without displaying"),
            !_ctx.hideCancel ? vue.renderSlot(_ctx.$slots, "suffix", { key: 0 }, () => [
              vue.createCommentVNode("默认button"),
              vue.createElementVNode(
                "view",
                {
                  class: "wd-search__cancel",
                  onClick: handleCancel
                },
                vue.toDisplayString(_ctx.cancelTxt || vue.unref(translate)("cancel")),
                1
                /* TEXT */
              )
            ], true) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-cc0202be"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-search/wd-search.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang2 = startsWith(locale, locales);
    if (lang2) {
      return lang2;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-search-bar.cancel": "cancel",
    "uni-search-bar.placeholder": "Search enter content"
  };
  const zhHans = {
    "uni-search-bar.cancel": "取消",
    "uni-search-bar.placeholder": "请输入搜索内容"
  };
  const zhHant = {
    "uni-search-bar.cancel": "取消",
    "uni-search-bar.placeholder": "請輸入搜索內容"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$3 = {
    name: "UniSearchBar",
    emits: ["input", "update:modelValue", "clear", "cancel", "confirm", "blur", "focus"],
    props: {
      placeholder: {
        type: String,
        default: ""
      },
      radius: {
        type: [Number, String],
        default: 5
      },
      clearButton: {
        type: String,
        default: "auto"
      },
      cancelButton: {
        type: String,
        default: "auto"
      },
      cancelText: {
        type: String,
        default: ""
      },
      bgColor: {
        type: String,
        default: "#F8F8F8"
      },
      textColor: {
        type: String,
        default: "#000000"
      },
      maxlength: {
        type: [Number, String],
        default: 100
      },
      value: {
        type: [Number, String],
        default: ""
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      focus: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        showSync: false,
        searchVal: ""
      };
    },
    computed: {
      cancelTextI18n() {
        return this.cancelText || t("uni-search-bar.cancel");
      },
      placeholderText() {
        return this.placeholder || t("uni-search-bar.placeholder");
      }
    },
    watch: {
      modelValue: {
        immediate: true,
        handler(newVal) {
          this.searchVal = newVal;
          if (newVal) {
            this.show = true;
          }
        }
      },
      focus: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            if (this.readonly)
              return;
            this.show = true;
            this.$nextTick(() => {
              this.showSync = true;
            });
          }
        }
      },
      searchVal(newVal, oldVal) {
        this.$emit("input", newVal);
        this.$emit("update:modelValue", newVal);
      }
    },
    methods: {
      searchClick() {
        if (this.readonly)
          return;
        if (this.show) {
          return;
        }
        this.show = true;
        this.$nextTick(() => {
          this.showSync = true;
        });
      },
      clear() {
        this.searchVal = "";
        this.$nextTick(() => {
          this.$emit("clear", { value: "" });
        });
      },
      cancel() {
        if (this.readonly)
          return;
        this.$emit("cancel", {
          value: this.searchVal
        });
        this.searchVal = "";
        this.show = false;
        this.showSync = false;
        plus.key.hideSoftKeybord();
      },
      confirm() {
        plus.key.hideSoftKeybord();
        this.$emit("confirm", {
          value: this.searchVal
        });
      },
      blur() {
        plus.key.hideSoftKeybord();
        this.$emit("blur", {
          value: this.searchVal
        });
      },
      emitFocus(e) {
        this.$emit("focus", e.detail);
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-searchbar" }, [
      vue.createElementVNode(
        "view",
        {
          style: vue.normalizeStyle({ borderRadius: $props.radius + "px", backgroundColor: $props.bgColor }),
          class: "uni-searchbar__box",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.searchClick && $options.searchClick(...args))
        },
        [
          vue.createElementVNode("view", { class: "uni-searchbar__box-icon-search" }, [
            vue.renderSlot(_ctx.$slots, "searchIcon", {}, () => [
              vue.createVNode(_component_uni_icons, {
                color: "#c0c4cc",
                size: "18",
                type: "search"
              })
            ], true)
          ]),
          $data.show || $data.searchVal ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            focus: $data.showSync,
            disabled: $props.readonly,
            placeholder: $options.placeholderText,
            maxlength: $props.maxlength,
            class: "uni-searchbar__box-search-input",
            "confirm-type": "search",
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchVal = $event),
            style: vue.normalizeStyle({ color: $props.textColor }),
            onConfirm: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args)),
            onBlur: _cache[2] || (_cache[2] = (...args) => $options.blur && $options.blur(...args)),
            onFocus: _cache[3] || (_cache[3] = (...args) => $options.emitFocus && $options.emitFocus(...args))
          }, null, 44, ["focus", "disabled", "placeholder", "maxlength"])), [
            [vue.vModelText, $data.searchVal]
          ]) : (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "uni-searchbar__text-placeholder"
            },
            vue.toDisplayString($props.placeholder),
            1
            /* TEXT */
          )),
          $data.show && ($props.clearButton === "always" || $props.clearButton === "auto" && $data.searchVal !== "") && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "uni-searchbar__box-icon-clear",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.clear && $options.clear(...args))
          }, [
            vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              vue.createVNode(_component_uni_icons, {
                color: "#c0c4cc",
                size: "20",
                type: "clear"
              })
            ], true)
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      $props.cancelButton === "always" || $data.show && $props.cancelButton === "auto" ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          onClick: _cache[6] || (_cache[6] = (...args) => $options.cancel && $options.cancel(...args)),
          class: "uni-searchbar__cancel"
        },
        vue.toDisplayString($options.cancelTextI18n),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-f07ef577"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue"]]);
  const _sfc_main$2 = {
    name: "tuiActionsheet",
    props: {
      //点击遮罩 是否可关闭
      maskClosable: {
        type: Boolean,
        default: true
      },
      //显示操作菜单
      show: {
        type: Boolean,
        default: true
      },
      //菜单按钮数组，自定义文本颜色，红色参考色：#e53a37
      itemList: {
        type: Array,
        default: function() {
          return [{
            text: "确定",
            color: "#1a1a1a"
          }];
        }
      },
      //提示文字
      tips: {
        type: String,
        default: ""
      },
      //提示文字颜色
      color: {
        type: String,
        default: "#9a9a9a"
      },
      //提示文字大小 rpx
      size: {
        type: Number,
        default: 26
      },
      //是否需要取消按钮
      isCancel: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleClickMask() {
        if (!this.maskClosable)
          return;
        this.handleClickCancel();
      },
      handleClickItem(e) {
        if (!this.show)
          return;
        const dataset = e.currentTarget.dataset;
        this.$emit("click", {
          index: dataset.index
        });
      },
      handleClickCancel() {
        this.$emit("chooseCancel");
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_2$1);
    const _component_wd_search = resolveEasycom(vue.resolveDynamicComponent("wd-search"), __easycom_1);
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["country-actionsheet", [$props.show ? "country-actionsheet-show" : ""]])
        },
        [
          vue.createElementVNode("view", { class: "actionsheet-header" }, [
            vue.createVNode(_component_uni_icons, {
              type: "down",
              size: "6.4vw"
            }),
            vue.createElementVNode("text", { class: "actionsheet-header-title" }, "Languages")
          ]),
          vue.createCommentVNode(` 			<view :class="[isCancel?'country-operate-box':'']">\r
				<block v-for="(item,index) in itemList" :key="index">\r
					<view class="country-actionsheet-btn country-actionsheet-divider"\r
						:class="[(!isCancel && index==itemList.length-1)?'country-btn-last':'']"\r
						hover-class="country-actionsheet-hover" :hover-stay-time="150" :data-index="index"\r
						:style="{color:item.color || '#1a1a1a'}" @tap="handleClickItem">{{item.text}}</view>\r
				</block>\r
			</view> `),
          vue.createVNode(_component_wd_search, {
            class: "country-search-box",
            placeholder: "Search language",
            cancelButton: "none"
          }),
          vue.createElementVNode("view", { class: "actionsheet-body-container" }, [
            vue.createVNode(_component_uni_search_bar, {
              class: "country-search-box",
              placeholder: "Search language",
              cancelButton: "none"
            })
          ]),
          vue.createCommentVNode(' 			<view class="country-actionsheet-btn country-actionsheet-cancel" hover-class="country-actionsheet-hover"\r\n				:hover-stay-time="150" v-if="isCancel" @tap="handleClickCancel">取消</view> ')
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(` <view class="country-actionsheet-mask" :class="[show?'country-mask-show':'']" @tap="handleClickMask"></view> `)
    ]);
  }
  const countryActionModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-07c36198"], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/components/countryActionModal.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        // progressPercentage: 0,				
        progressPercentage: 3,
        progressPercentageArray: [1e-7, 10, 20, 30],
        genderValue: "",
        nickname: "",
        birthday: [0, 0, 0],
        isGenderListExpand: false,
        isBackButtonDisable: true,
        isNextButtonDisable: true,
        relationshipGoal: 0,
        genderItems: [
          {
            value: "male",
            name: "male",
            icon: "👨",
            id: 0
          },
          {
            value: "female",
            name: "female",
            icon: "👩‍",
            id: 0
          },
          {
            value: "more",
            name: "more",
            icon: "👩‍",
            id: 0
          },
          {
            value: "1",
            name: "1",
            icon: "👩‍",
            id: 0
          },
          {
            value: "2",
            name: "2",
            icon: "👩‍",
            id: 0
          },
          {
            value: "3",
            name: "3",
            icon: "👩‍",
            id: 0
          },
          {
            value: "4",
            name: "4",
            icon: "👩‍",
            id: 0
          }
        ],
        relationshipGoalList: [
          {
            id: 1,
            name: "dating",
            icon: "👩‍❤️‍👨‍"
          },
          {
            id: 2,
            name: "Friendship",
            icon: "🙌"
          },
          {
            id: 3,
            name: "Casual",
            icon: "😄‍"
          },
          {
            id: 4,
            name: "Serious Relationship",
            icon: "💍‍"
          },
          {
            id: 5,
            name: "Open to Options",
            icon: "🌟‍"
          },
          {
            id: 6,
            name: "Learning English",
            icon: "🤝"
          },
          {
            id: 7,
            name: "Exploration",
            icon: "🌍"
          }
        ],
        registerFormData: {},
        showActionSheet: {
          show: false,
          maskClosable: true,
          tips: "请选择申请节点身份，不同的节点消耗福卡不同",
          itemList: [
            {
              text: "红包节点",
              color: "#333"
            },
            {
              text: "广告节点",
              color: "#333"
            }
          ],
          color: "#9a9a9a",
          size: 26,
          isCancel: true
        }
      };
    },
    onLoad() {
    },
    components: {
      countryActionModal
    },
    methods: {
      onGenderRadioChange(value) {
        this.genderValue = value.detail.value;
        this.onCheckPageTurn();
      },
      onGenderOtherClick() {
        this.isGenderListExpand = true;
      },
      onBirthdayChange(item) {
        let birthdayString = item.detail.value;
        this.birthday = birthdayString.split("-");
        this.onCheckPageTurn();
      },
      onRelationshipRadioChange(value) {
        this.relationshipGoal = value.detail.value;
        this.onCheckPageTurn();
      },
      onCheckPageTurn() {
        if (this.progressPercentage == 0) {
          this.isBackButtonDisable = true;
          if (this.genderValue != "") {
            this.isNextButtonDisable = false;
            return true;
          }
        }
        if (this.progressPercentage == 1) {
          this.isBackButtonDisable = false;
          formatAppLog("log", "at pages/login/registerFormPage.vue:257", this.nickname, this.birthday);
          if (this.nickname != "" && !this.birthday.includes(0)) {
            this.isNextButtonDisable = false;
            return true;
          }
        }
        if (this.progressPercentage == 2) {
          this.isBackButtonDisable = false;
          formatAppLog("log", "at pages/login/registerFormPage.vue:266", this.relationshipGoal);
          if (this.relationshipGoal != 0) {
            this.isNextButtonDisable = false;
            return true;
          }
        }
        return false;
      },
      onPageTurn(action) {
        if (action == "next") {
          this.progressPercentage += 1;
          this.isNextButtonDisable = true;
        } else if (action == "back") {
          this.progressPercentage -= 1;
          formatAppLog("log", "at pages/login/registerFormPage.vue:281", this.progressPercentage);
        }
        this.onCheckPageTurn();
      },
      chooseMenu() {
        this.showActionSheet.show = true;
      },
      // 弹窗关闭
      chooseCancel() {
        this.showActionSheet.show = false;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_progress = resolveEasycom(vue.resolveDynamicComponent("wd-progress"), __easycom_0);
    const _component_uni_nav_bar = resolveEasycom(vue.resolveDynamicComponent("uni-nav-bar"), __easycom_1$1);
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_2$1);
    const _component_countryActionModal = vue.resolveComponent("countryActionModal");
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_3);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_4);
    const _component_wd_tabbar = resolveEasycom(vue.resolveDynamicComponent("wd-tabbar"), __easycom_5);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_uni_nav_bar, {
          statusBar: "",
          border: "false",
          leftWidth: "0px",
          rightWidth: "0px",
          class: "progress-nav-bar"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", { class: "progressBarContainer" }, [
              vue.createVNode(_component_wd_progress, {
                percentage: $data.progressPercentageArray[$data.progressPercentage],
                "hide-text": "",
                color: "#161616",
                "custom-class": "register-progress-bar"
              }, null, 8, ["percentage"])
            ])
          ]),
          _: 1
          /* STABLE */
        }),
        vue.createElementVNode("view", { class: "main-container" }, [
          vue.createElementVNode("view", { class: "column" }, [
            vue.createVNode(_component_uni_forms, {
              modelValue: $data.registerFormData,
              class: "register-form"
            }, {
              default: vue.withCtx(() => [
                vue.createCommentVNode(" page 0 "),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  null,
                  [
                    vue.createElementVNode("span", null, [
                      vue.createElementVNode("text", { class: "title-text-24" }, "Please select an option below your identification 🌟")
                    ]),
                    vue.createElementVNode(
                      "radio-group",
                      {
                        onChange: _cache[1] || (_cache[1] = (...args) => $options.onGenderRadioChange && $options.onGenderRadioChange(...args))
                      },
                      [
                        !$data.isGenderListExpand ? (vue.openBlock(), vue.createElementBlock("span", {
                          key: 0,
                          class: "gender-radio-group"
                        }, [
                          vue.createElementVNode("radio", {
                            value: $data.genderItems[0].value,
                            class: vue.normalizeClass(["gender-radio-select-container", $data.genderValue == $data.genderItems[0].value ? "gender-radio-checked" : ""])
                          }, [
                            vue.createElementVNode(
                              "span",
                              { class: "gender-radio-icon" },
                              vue.toDisplayString($data.genderItems[0].icon),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "title-text-24 gender-radio-text" },
                              vue.toDisplayString($data.genderItems[0].name),
                              1
                              /* TEXT */
                            )
                          ], 10, ["value"]),
                          vue.createElementVNode("radio", {
                            value: $data.genderItems[1].value,
                            class: vue.normalizeClass(["gender-radio-select-container", $data.genderValue == $data.genderItems[1].value ? "gender-radio-checked" : ""])
                          }, [
                            vue.createElementVNode(
                              "span",
                              { class: "gender-radio-icon" },
                              vue.toDisplayString($data.genderItems[1].icon),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "title-text-24 gender-radio-text" },
                              vue.toDisplayString($data.genderItems[1].name),
                              1
                              /* TEXT */
                            )
                          ], 10, ["value"]),
                          vue.createElementVNode("span", {
                            class: "gender-radio-select-container gender-radio-select-container-other",
                            onClick: _cache[0] || (_cache[0] = (...args) => $options.onGenderOtherClick && $options.onGenderOtherClick(...args))
                          }, [
                            vue.createElementVNode("text", { class: "title-text-24 gender-radio-text gender-text-other" }, "other"),
                            vue.createVNode(_component_uni_icons, {
                              type: "right",
                              size: "2em",
                              class: "title-text-24 gender-icon-other"
                            })
                          ])
                        ])) : (vue.openBlock(), vue.createElementBlock("span", { key: 1 }, [
                          vue.createElementVNode("span", { class: "gender-radio-group" }, [
                            (vue.openBlock(true), vue.createElementBlock(
                              vue.Fragment,
                              null,
                              vue.renderList($data.genderItems, (item) => {
                                return vue.openBlock(), vue.createElementBlock("radio", {
                                  value: item.value,
                                  class: vue.normalizeClass(["gender-radio-select-container", $data.genderValue == item.value ? "gender-radio-checked" : ""])
                                }, [
                                  vue.createElementVNode(
                                    "span",
                                    { class: "gender-radio-icon" },
                                    vue.toDisplayString(item.icon),
                                    1
                                    /* TEXT */
                                  ),
                                  vue.createElementVNode(
                                    "text",
                                    { class: "title-text-24 gender-radio-text" },
                                    vue.toDisplayString(item.name),
                                    1
                                    /* TEXT */
                                  )
                                ], 10, ["value"]);
                              }),
                              256
                              /* UNKEYED_FRAGMENT */
                            ))
                          ])
                        ]))
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $data.progressPercentage == 0]
                ]),
                vue.createCommentVNode(" page 1 "),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  null,
                  [
                    vue.createElementVNode("span", null, [
                      vue.createElementVNode("text", { class: "title-text-24" }, "What is your nickname and birthday?")
                    ]),
                    vue.createElementVNode("span", { class: "nick-name-birthday-container" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "input",
                        {
                          type: "nickname",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.nickname = $event),
                          placeholder: "",
                          class: "nick-name-input",
                          maxlength: "20",
                          onInput: _cache[3] || (_cache[3] = (...args) => $options.onCheckPageTurn && $options.onCheckPageTurn(...args))
                        },
                        null,
                        544
                        /* NEED_HYDRATION, NEED_PATCH */
                      ), [
                        [vue.vModelText, $data.nickname]
                      ]),
                      vue.createElementVNode("picker", {
                        mode: "date",
                        value: $data.birthday,
                        onChange: _cache[4] || (_cache[4] = (...args) => $options.onBirthdayChange && $options.onBirthdayChange(...args)),
                        fields: "year month day"
                      }, [
                        $data.birthday.includes(0) ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 0,
                          class: "date-placeholder birthday-picker next-button-text-20"
                        }, [
                          vue.createElementVNode("view", { class: "date-container" }, "YY"),
                          vue.createElementVNode("view", { class: "date-container date-middle-container" }, "MM"),
                          vue.createElementVNode("view", { class: "date-container" }, "DD")
                        ])) : (vue.openBlock(), vue.createElementBlock("div", {
                          key: 1,
                          class: "date-input-text birthday-picker next-button-text-20"
                        }, [
                          vue.createElementVNode(
                            "view",
                            { class: "date-container" },
                            vue.toDisplayString($data.birthday[0]),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            { class: "date-container date-middle-container" },
                            vue.toDisplayString($data.birthday[1]),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            { class: "date-container" },
                            vue.toDisplayString($data.birthday[2]),
                            1
                            /* TEXT */
                          )
                        ]))
                      ], 40, ["value"])
                    ])
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $data.progressPercentage == 1]
                ]),
                vue.createCommentVNode(" page 2 "),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  null,
                  [
                    vue.createElementVNode("span", null, [
                      vue.createElementVNode("text", { class: "title-text-24" }, "Your relationship goals 💘")
                    ]),
                    vue.createElementVNode(
                      "radio-group",
                      {
                        onChange: _cache[5] || (_cache[5] = (...args) => $options.onRelationshipRadioChange && $options.onRelationshipRadioChange(...args)),
                        class: "relationship-radio-group"
                      },
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.relationshipGoalList, (item) => {
                            return vue.openBlock(), vue.createElementBlock("radio", {
                              value: item.id,
                              class: vue.normalizeClass(["title-text-24 relationship-item-container", $data.relationshipGoal == item.id ? "relationship-radio-checked" : ""])
                            }, [
                              vue.createElementVNode(
                                "span",
                                { class: "relationship-item-text" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "relationship-item-icon" },
                                vue.toDisplayString(item.icon),
                                1
                                /* TEXT */
                              )
                            ], 10, ["value"]);
                          }),
                          256
                          /* UNKEYED_FRAGMENT */
                        ))
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $data.progressPercentage == 2]
                ]),
                vue.createCommentVNode(" page 2 "),
                vue.withDirectives(vue.createElementVNode(
                  "div",
                  null,
                  [
                    vue.createElementVNode("div", { class: "nationality-container" }, [
                      vue.createElementVNode("span", null, [
                        vue.createElementVNode("text", { class: "title-text-24 .nationality-question-text" }, "Where are you from")
                      ]),
                      vue.createElementVNode("button", { class: "next-button-text-20 nationality-question-button" }, "Choose Country"),
                      vue.createElementVNode("span", null, [
                        vue.createElementVNode("text", { class: "title-text-24 nationality-question-text" }, "What is your national language")
                      ]),
                      vue.createElementVNode("button", { class: "next-button-text-20 nationality-question-button" }, "Choose Country")
                    ]),
                    vue.createElementVNode("view", {
                      style: { "height": "100px", "width": "100px", "border": "1px solid black" },
                      onClick: _cache[6] || (_cache[6] = (...args) => $options.chooseMenu && $options.chooseMenu(...args))
                    }),
                    vue.createVNode(_component_countryActionModal, {
                      tips: $data.showActionSheet.tips,
                      itemList: $data.showActionSheet.itemList,
                      show: true,
                      maskClosable: $data.showActionSheet.maskClosable,
                      isCancel: $data.showActionSheet.isCancel,
                      onChooseCancel: $options.chooseCancel
                    }, null, 8, ["tips", "itemList", "maskClosable", "isCancel", "onChooseCancel"])
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $data.progressPercentage == 3]
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        vue.createVNode(_component_wd_tabbar, {
          fixed: "",
          safeAreaInsetBottom: "",
          placeholder: "",
          class: "next-page-tabbar"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_button, {
              disabled: $data.isBackButtonDisable,
              class: "back-button",
              onClick: _cache[7] || (_cache[7] = ($event) => $options.onPageTurn("back"))
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_icons, {
                  type: "left",
                  size: "2em"
                })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["disabled"]),
            vue.createVNode(_component_wd_button, {
              disabled: $data.isNextButtonDisable,
              class: "next-button next-button-text-20",
              onClick: _cache[8] || (_cache[8] = ($event) => $options.onPageTurn("next"))
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("Next")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["disabled"])
          ]),
          _: 1
          /* STABLE */
        })
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesLoginRegisterFormPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/pages/login/registerFormPage.vue"]]);
  __definePage("pages/login/registerFormPage", PagesLoginRegisterFormPage);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/tamyu/OneDrive/Documents/HBuilderProjects/app_ui_hk/App.vue"]]);
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
