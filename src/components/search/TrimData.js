export const toTrim=(obj)=>{
  if (obj) {
    const data={};
    Object.keys(obj).forEach((key)=>{
      if (obj[key]) {
        if (typeof(obj[key][0]) === 'string') {
          data[key]=obj[key][0].trim();
        } else {
          data[key]=obj[key][0];
        }
      }
    });
    return data;
  }

  return {};
};
export const toTrimParam=(obj)=>{
  if (obj) {
    Object.keys(obj).forEach((key)=>{
      if (obj[key]) {
        if (typeof(obj[key]) === 'string') {
          obj[key]=obj[key].trim();
        }
      }
    });
    return obj;
  }

  return {};
};

export const toTrimParamArr =(Arr)=>{
  const arr=[];
  if (Arr) {
    Arr.forEach((item)=>{
      arr.push(toTrimParam(item));
    });
  }
  return arr;
};

export const toDecodeSort = (obj)=>{
  const data={};
  if (obj.column) {
    data.sort=obj.columnKey;
    data.order= obj.order==='ascend'?1:2;
  }
  return data;
};
