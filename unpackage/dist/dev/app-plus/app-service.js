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
  function isObj(value) {
    return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
  }
  function getType(target) {
    const typeStr = Object.prototype.toString.call(target);
    const match = typeStr.match(/\[object (\w+)\]/);
    const type = match && match.length ? match[1].toLowerCase() : "";
    return type;
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
  const makeArrayProp = () => ({
    type: Array,
    default: () => []
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
  const __default__$1 = {
    name: "wd-icon",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-24906af6"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-icon/wd-icon.vue"]]);
  function useParent(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance = vue.getCurrentInstance();
      const { link, unlink, internalChildren } = parent;
      link(instance);
      vue.onUnmounted(() => unlink(instance));
      const index = vue.computed(() => internalChildren.indexOf(instance));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  const CELL_GROUP_KEY = Symbol("wd-cell-group");
  function useCell() {
    const { parent: cellGroup, index } = useParent(CELL_GROUP_KEY);
    const border = vue.computed(() => {
      return cellGroup && cellGroup.props.border && index.value;
    });
    return { border };
  }
  const FORM_KEY = Symbol("wd-form");
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
  const messages = vue.reactive({
    "zh-CN": zhCN
  });
  const Locale = {
    messages() {
      return messages[lang.value];
    },
    use(newLang, newMessage) {
      lang.value = newLang;
      if (newMessage) {
        this.add({ [newLang]: newMessage });
      }
    },
    add(newMessages = {}) {
      deepAssign(messages, newMessages);
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
  const inputProps = {
    ...baseProps,
    customInputClass: makeStringProp(""),
    customLabelClass: makeStringProp(""),
    // 原生属性
    /**
     * 占位文本
     */
    placeholder: String,
    /**
     * 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight
     */
    placeholderStyle: String,
    /**
     * 原生属性，指定 placeholder 的样式类
     */
    placeholderClass: makeStringProp(""),
    /**
     * 原生属性，指定光标与键盘的距离。取 input 距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离
     */
    cursorSpacing: makeNumberProp(0),
    /**
     * 原生属性，指定focus时的光标位置
     */
    cursor: makeNumberProp(-1),
    /**
     * 原生属性，光标起始位置，自动聚集时有效，需与selection-end搭配使用
     */
    selectionStart: makeNumberProp(-1),
    /**
     * 原生属性，光标结束位置，自动聚集时有效，需与selection-start搭配使用
     */
    selectionEnd: makeNumberProp(-1),
    /**
     * 原生属性，键盘弹起时，是否自动上推页面
     */
    adjustPosition: makeBooleanProp(true),
    /**
     * focus时，点击页面的时候不收起键盘
     */
    holdKeyboard: makeBooleanProp(false),
    /**
     * 设置键盘右下角按钮的文字，仅在type='text'时生效，可选值：done / go / next / search / send
     */
    confirmType: makeStringProp("done"),
    /**
     * 点击键盘右下角按钮时是否保持键盘不收起
     */
    confirmHold: makeBooleanProp(false),
    /**
     * 原生属性，获取焦点
     */
    focus: makeBooleanProp(false),
    /**
     * 类型，可选值：text / number / digit / idcard
     */
    type: makeStringProp("text"),
    /**
     * 原生属性，最大长度
     */
    maxlength: {
      type: Number,
      default: -1
    },
    /**
     * 原生属性，禁用
     */
    disabled: makeBooleanProp(false),
    /**
     * 微信小程序原生属性，强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)
     */
    alwaysEmbed: makeBooleanProp(false),
    // 原生属性结束
    /**
     * 输入框的值靠右展示
     */
    alignRight: makeBooleanProp(false),
    /**
     * 绑定值
     */
    modelValue: makeNumericProp(""),
    /**
     * 显示为密码框
     */
    showPassword: makeBooleanProp(false),
    /**
     * 显示清空按钮
     */
    clearable: makeBooleanProp(false),
    /**
     * 只读
     */
    readonly: makeBooleanProp(false),
    /**
     * 使用 后置图标 插槽
     */
    useSuffixSlot: makeBooleanProp(false),
    /**
     * 使用 前置图标 插槽
     */
    usePrefixSlot: makeBooleanProp(false),
    /**
     * 前置图标，icon组件中的图标类名
     */
    prefixIcon: String,
    /**
     * 后置图标，icon组件中的图标类名
     */
    suffixIcon: String,
    /**
     * 显示字数限制，需要同时设置 maxlength
     */
    showWordLimit: makeBooleanProp(false),
    /**
     * 设置左侧标题
     */
    label: String,
    /**
     * 设置左侧标题宽度
     */
    labelWidth: makeStringProp("33%"),
    /**
     * 使用 label 插槽
     */
    useLabelSlot: makeBooleanProp(false),
    /**
     * 设置输入框大小，可选值：large
     */
    size: String,
    /**
     * 设置输入框错误状态，错误状态时为红色
     */
    error: makeBooleanProp(false),
    /**
     * 当有label属性时，设置标题和输入框垂直居中，默认为顶部居中
     */
    center: makeBooleanProp(false),
    /**
     * 非 cell 类型下是否隐藏下划线
     */
    noBorder: makeBooleanProp(false),
    /**
     * 是否必填
     */
    required: makeBooleanProp(false),
    /**
     * 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 表单验证规则，结合wd-form组件使用
     */
    rules: makeArrayProp()
  };
  const __default__ = {
    name: "wd-input",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: inputProps,
    emits: [
      "update:modelValue",
      "clear",
      "change",
      "blur",
      "focus",
      "input",
      "keyboardheightchange",
      "confirm",
      "linechange",
      "clicksuffixicon",
      "clickprefixicon",
      "click"
    ],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("input");
      const showClear = vue.ref(false);
      const showWordCount = vue.ref(false);
      const isPwdVisible = vue.ref(false);
      const clearing = vue.ref(false);
      const isFocus = vue.ref(false);
      const inputValue = vue.ref("");
      const cell = useCell();
      vue.watch(
        () => props.focus,
        (newValue) => {
          isFocus.value = newValue;
        },
        { immediate: true, deep: true }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          const { disabled, readonly, clearable } = props;
          if (newValue === void 0) {
            newValue = "";
            formatAppLog("warn", "at uni_modules/wot-design-uni/components/wd-input/wd-input.vue:135", "[wot-design] warning(wd-input): value can not be undefined.");
          }
          inputValue.value = newValue;
          showClear.value = Boolean(clearable && !disabled && !readonly && newValue);
        },
        { immediate: true, deep: true }
      );
      const { parent: form } = useParent(FORM_KEY);
      const errorMessage = vue.computed(() => {
        if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
          return form.errorMessages[props.prop];
        } else {
          return "";
        }
      });
      const isRequired = vue.computed(() => {
        let formRequired = false;
        if (form && form.props.rules) {
          const rules = form.props.rules;
          for (const key in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
              formRequired = rules[key].some((rule) => rule.required);
            }
          }
        }
        return props.required || props.rules.some((rule) => rule.required) || formRequired;
      });
      const rootClass = vue.computed(() => {
        return `wd-input  ${props.label || props.useLabelSlot ? "is-cell" : ""} ${props.center ? "is-center" : ""} ${cell.border.value ? "is-border" : ""} ${props.size ? "is-" + props.size : ""} ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""}  ${inputValue.value && String(inputValue.value).length > 0 ? "is-not-empty" : ""}  ${props.noBorder ? "is-no-border" : ""} ${props.customClass}`;
      });
      const labelClass = vue.computed(() => {
        return `wd-input__label ${props.customLabelClass} ${isRequired.value ? "is-required" : ""}`;
      });
      const inputPlaceholderClass = vue.computed(() => {
        return `wd-input__placeholder  ${props.placeholderClass}`;
      });
      const labelStyle = vue.computed(() => {
        return props.labelWidth ? objToStyle({
          "min-width": props.labelWidth,
          "max-width": props.labelWidth
        }) : "";
      });
      vue.onBeforeMount(() => {
        initState();
      });
      function initState() {
        const { disabled, readonly, clearable, maxlength, showWordLimit } = props;
        let newVal = "";
        if (showWordLimit && maxlength && inputValue.value.toString().length > maxlength) {
          newVal = inputValue.value.toString().substring(0, maxlength);
        }
        showClear.value = Boolean(!disabled && !readonly && clearable && inputValue.value);
        showWordCount.value = Boolean(!disabled && !readonly && maxlength && showWordLimit);
        inputValue.value = newVal || inputValue.value;
        emit("update:modelValue", inputValue.value);
      }
      function togglePwdVisible() {
        isPwdVisible.value = !isPwdVisible.value;
      }
      function clear() {
        inputValue.value = "";
        requestAnimationFrame().then(() => requestAnimationFrame()).then(() => requestAnimationFrame()).then(() => {
          isFocus.value = true;
          emit("change", {
            value: ""
          });
          emit("update:modelValue", inputValue.value);
          emit("clear");
        });
      }
      function handleBlur() {
        isFocus.value = false;
        emit("change", {
          value: inputValue.value
        });
        emit("update:modelValue", inputValue.value);
        emit("blur", {
          value: inputValue.value
        });
      }
      function handleFocus({ detail }) {
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        isFocus.value = true;
        emit("focus", detail);
      }
      function handleInput() {
        emit("update:modelValue", inputValue.value);
        emit("input", inputValue.value);
      }
      function handleKeyboardheightchange(event) {
        emit("keyboardheightchange", event.detail);
      }
      function handleConfirm({ detail }) {
        emit("confirm", detail);
      }
      function onClickSuffixIcon() {
        emit("clicksuffixicon");
      }
      function onClickPrefixIcon() {
        emit("clickprefixicon");
      }
      function handleClick(event) {
        emit("click", event);
      }
      return (_ctx, _cache) => {
        const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_0$1);
        return vue.openBlock(), vue.createElementBlock(
          "view",
          {
            class: vue.normalizeClass(rootClass.value),
            style: vue.normalizeStyle(_ctx.customStyle),
            onClick: handleClick
          },
          [
            _ctx.label || _ctx.useLabelSlot ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(labelClass.value),
                style: vue.normalizeStyle(labelStyle.value)
              },
              [
                _ctx.prefixIcon || _ctx.usePrefixSlot ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "wd-input__prefix"
                }, [
                  _ctx.prefixIcon && !_ctx.usePrefixSlot ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                    key: 0,
                    "custom-class": "wd-input__icon",
                    name: _ctx.prefixIcon,
                    onClick: onClickPrefixIcon
                  }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "prefix", { key: 1 }, void 0, true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "wd-input__label-inner" }, [
                  _ctx.label ? (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    { key: 0 },
                    [
                      vue.createTextVNode(
                        vue.toDisplayString(_ctx.label),
                        1
                        /* TEXT */
                      )
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : vue.renderSlot(_ctx.$slots, "label", { key: 1 }, void 0, true)
                ])
              ],
              6
              /* CLASS, STYLE */
            )) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 输入域 "),
            vue.createElementVNode("view", { class: "wd-input__body" }, [
              vue.createElementVNode("view", { class: "wd-input__value" }, [
                (_ctx.prefixIcon || _ctx.usePrefixSlot) && !_ctx.label ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "wd-input__prefix"
                }, [
                  _ctx.prefixIcon ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                    key: 0,
                    "custom-class": "wd-input__icon",
                    name: _ctx.prefixIcon,
                    onClick: onClickPrefixIcon
                  }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
                  vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true)
                ])) : vue.createCommentVNode("v-if", true),
                vue.withDirectives(vue.createElementVNode("input", {
                  class: vue.normalizeClass([
                    "wd-input__inner",
                    _ctx.prefixIcon ? "wd-input__inner--prefix" : "",
                    showWordCount.value ? "wd-input__inner--count" : "",
                    _ctx.alignRight ? "is-align-right" : "",
                    _ctx.customInputClass
                  ]),
                  type: _ctx.type,
                  password: _ctx.showPassword && !isPwdVisible.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputValue.value = $event),
                  placeholder: _ctx.placeholder || vue.unref(translate)("placeholder"),
                  disabled: _ctx.disabled,
                  maxlength: _ctx.maxlength,
                  focus: isFocus.value,
                  "confirm-type": _ctx.confirmType,
                  "confirm-hold": _ctx.confirmHold,
                  cursor: _ctx.cursor,
                  "cursor-spacing": _ctx.cursorSpacing,
                  "placeholder-style": _ctx.placeholderStyle,
                  "selection-start": _ctx.selectionStart,
                  "selection-end": _ctx.selectionEnd,
                  "adjust-position": _ctx.adjustPosition,
                  "hold-keyboard": _ctx.holdKeyboard,
                  "always-embed": _ctx.alwaysEmbed,
                  "placeholder-class": inputPlaceholderClass.value,
                  onInput: handleInput,
                  onFocus: handleFocus,
                  onBlur: handleBlur,
                  onConfirm: handleConfirm,
                  onKeyboardheightchange: handleKeyboardheightchange
                }, null, 42, ["type", "password", "placeholder", "disabled", "maxlength", "focus", "confirm-type", "confirm-hold", "cursor", "cursor-spacing", "placeholder-style", "selection-start", "selection-end", "adjust-position", "hold-keyboard", "always-embed", "placeholder-class"]), [
                  [vue.vModelDynamic, inputValue.value]
                ]),
                _ctx.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "wd-input__readonly-mask"
                })) : vue.createCommentVNode("v-if", true),
                showClear.value || _ctx.showPassword || _ctx.suffixIcon || showWordCount.value || _ctx.useSuffixSlot ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "wd-input__suffix"
                }, [
                  showClear.value ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                    key: 0,
                    "custom-class": "wd-input__clear",
                    name: "error-fill",
                    onClick: clear
                  })) : vue.createCommentVNode("v-if", true),
                  _ctx.showPassword ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                    key: 1,
                    "custom-class": "wd-input__icon",
                    name: isPwdVisible.value ? "view" : "eye-close",
                    onClick: togglePwdVisible
                  }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
                  showWordCount.value ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 2,
                    class: "wd-input__count"
                  }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass([
                          inputValue.value && String(inputValue.value).length > 0 ? "wd-input__count-current" : "",
                          String(inputValue.value).length > _ctx.maxlength ? "is-error" : ""
                        ])
                      },
                      vue.toDisplayString(String(inputValue.value).length),
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createTextVNode(
                      " /" + vue.toDisplayString(_ctx.maxlength),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
                    key: 3,
                    "custom-class": "wd-input__icon",
                    name: _ctx.suffixIcon,
                    onClick: onClickSuffixIcon
                  }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
                  vue.renderSlot(_ctx.$slots, "suffix", {}, void 0, true)
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              errorMessage.value ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "wd-input__error-message"
                },
                vue.toDisplayString(errorMessage.value),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ],
          6
          /* CLASS, STYLE */
        );
      };
    }
  });
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-4e0c9774"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/uni_modules/wot-design-uni/components/wd-input/wd-input.vue"]]);
  const _sfc_main$2 = {
    name: "StyledButton",
    props: {
      width: {
        type: String,
        default: "auto"
      },
      height: {
        type: String,
        default: "auto"
      },
      borderRadius: {
        type: String,
        default: "24rpx"
      },
      backgroundColor: {
        type: String,
        default: "#3498db"
      }
    },
    computed: {
      computedStyles() {
        return {
          width: this.width,
          height: this.height,
          borderRadius: this.borderRadius,
          backgroundColor: this.backgroundColor,
          color: "white",
          // Default text color
          padding: "14rpx, 24rpx, 14rpx, 24rpx",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s"
        };
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "button",
      {
        style: vue.normalizeStyle($options.computedStyles)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      4
      /* STYLE */
    );
  }
  const StyledButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-74e340f7"], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/components/StyledButton.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        title: "Hellod"
      };
    },
    onLoad() {
    },
    components: {
      StyledButton
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_0);
    const _component_StyledButton = vue.resolveComponent("StyledButton");
    return vue.openBlock(), vue.createElementBlock("view", { class: "main-container" }, [
      vue.createElementVNode("view", { class: "column" }, [
        vue.createElementVNode("view", { class: "title-container" }, [
          vue.createElementVNode("text", { class: "title-text-24" }, "Login/Sign")
        ]),
        vue.createVNode(_component_wd_input, {
          type: "text",
          modelValue: _ctx.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value = $event),
          style: { "margin-bottom": "33rpx" }
        }, null, 8, ["modelValue"]),
        vue.createVNode(_component_StyledButton, {
          width: "100%",
          height: "content-fit",
          backgroundColor: "#161616",
          borderRadius: "24rpx"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("text", {
              class: "title-text-24",
              style: { "font-size": "20rpx" }
            }, "Next")
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/User/Documents/HBuilderProjects/app_ui_hk/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
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
