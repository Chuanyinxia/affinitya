export const Email=()=>{
  const search = window.location.search.substring(1).split('&').toString().split('=');
  if (search.length>1) {
    return (search[1]);
  }
  return '';
};
export const isEmail=()=>{
  const search = window.location.search.substring(1).split('&').toString().split('=');
  if (search.length>1) {
    return true;
  }
  return false;
};
export const type=()=>{
  const search = window.location.search.substring(1).split('&');
  const arr={};
  if (search.length>1) {
    search.forEach((item)=>{
      arr[item.split('=')[0]]=item.split('=')[1];
    });
    return arr.type;
  }
  return '';
};
export const search=()=>{
  const search = window.location.search.substring(1).split('&');
  const arr={};
  search.forEach((item)=>{
    arr[item.split('=')[0]]=item.split('=')[1];
  });
  if (search.length>1) {
    return arr;
  }
  return false;
};
