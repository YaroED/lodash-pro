/**
 * 表单校验、类型校验、正则匹配函数
 */

let _toString = Object.prototype.toString

// 切割引用类型得到后面的基本类型
export const toRawType = v => {
  return _toString.call(v).slice(8, -1)
}

// 判断是否为数组类型，且数组长度大于0
export const isCorrectArray = v => {
  return toRawType(v) === 'Array' && v.length > 0
}

// 判断原始类型是否为Object类型
export const isPlainObject = v => {
  return toRawType(v) === 'Object'
}

// /判断是否为 空对象
export const isEmptyObject = obj => {
  for (let key in obj) {
    return false
  }
  return true
}

// 判断是否有key的Object类型
export const isValidObject = v => {
  return isPlainObject(v) && !isEmptyObject(v)
}

// 判断是否为1开头的11位号码
export const isPhone = v => {
  return /^[1][0-9]{10}$/.test(v)
}

// 判断是否为身份证号
export const isIdCard = v => {
  return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(v)
}

// 判断有两位小数的正实数：
export const isPosRealDecimal = str => {
  return str ? /^[0-9]+(.[0-9]{1,2})?$/.test(str) : false
}

// 判断是否为 非undefined&&非null
export const isDef = v => {
  return v !== undefined && v !== null
}

// 判断是否JSON字符串
export const isJSON = str => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

// 判断由8~16位数字+字母组成
export const isPassWord = str => {
  return str ? /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,16}$/.test(str) : false
}

// 表单检验
export const validation = ({ val, msg = [], rule = ['required'], isPureMsg = false } = {}) => {
  let errMsg = ''
  const RULE_MAP = {
    required: () => val,
    isMobile: isPhone,
    isIdCard: isIdCard,
    isPassWord: isPassWord
  }
  rule.find((ruleItem, idx) => {
    // 校验不通过则返回错误信息
    if (RULE_MAP[ruleItem] && !RULE_MAP[ruleItem](val)) {
      return (errMsg = `${msg[idx] || '请输入正确的内容'}${isPureMsg ? '' : ':' + val}`)
    }
  })
  return errMsg
}
