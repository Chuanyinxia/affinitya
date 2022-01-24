import {Countrys} from '@/components/plugin/Country';

export const countryStr=(code)=>{
  const strArr=[];
  code.split(',').forEach((c)=>strArr.push(Countrys.filter((item)=>item.country_code===c)[0].name||''));
  return strArr.join(',');
};
