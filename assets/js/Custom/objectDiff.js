/*
* Functions for Comparing 2 objects
*/

const arraysMatch = (ref, arr) => {
  if (ref.length !== arr.length) return false;

  for (var i = 0; i < ref.length; i++) {
    if (ref[i] !== arr[i]) return false;
  }

  return true;
};

const diff = (ref, obj) => {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return ref;
  }

  var diffs = {};
  var key;

  var compareObj = (refVal, val, key) => {
    const refType = Object.prototype.toString.call(refVal);
    const valType = Object.prototype.toString.call(val);
    // object property does not exist
    if (valType === '[object Undefined]') {
      diffs[key] = null;
      return;
    }
    // different types, return type of the comapred object
    if (refType !== valType) {
      diffs[key] = valType;
      return;
    }
    // object type, do recursion
    if (refType === '[object Object]') {
      var objDiff = diff(refVal, val);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }
    // array type, compare using arrays match
    if (refType === '[object Array]') {
      if (!arraysMatch(refVal, val)) {
        diffs[key] = val;
      }
      return;
    }
    // string type, compare
    if (refVal !== val) {
      diffs[key] = val;
    }
  };

  // check items present in ref that are not present in object
  for (key in ref) {
    if (ref.hasOwnProperty(key)) {
      compareObj(ref[key], obj[key], key);
    }
  }

  // check items present in object that are not present in ref
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!ref[key] && ref[key] !== obj[key] ) {
        diffs[key] = obj[key];
      }
    }
  }

  return diffs;
};