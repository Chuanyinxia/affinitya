import moment from 'moment';

export const timeFormat=(v)=>{
  const zoneNum=(0 - new Date().getTimezoneOffset())/60;
  const utcTime=v?moment(moment(v).valueOf()-(8-zoneNum)*60*60*1000).format('YYYY-MM-DD HH:mm:ss'):'';
  return utcTime;
};
