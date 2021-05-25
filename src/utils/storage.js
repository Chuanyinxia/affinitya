const _localStorage = window.localStorage;
const _sessionStorage = window.sessionStorage;

const saveData = (type='session', name, data) => {
  const d = (typeof data === 'object') ? JSON.stringify(data) : data;
  if (type === 'local') {
    _localStorage.setItem(name, d);
  } else {
    _sessionStorage.setItem(name, d);
  }
};

const getData = (name) => {
  let session = _sessionStorage.getItem(name) ?? {};
  try {
    if (typeof session === 'string') session = JSON.parse(session);
  } catch (error) {
    console.log(error);
  }
  if (Object.keys(session).length > 0) {
    return session;
  }
  let local = _localStorage.getItem(name) ?? {};
  try {
    if (typeof local === 'string') local = JSON.parse(local);
  } catch (error) {
    console.log(error);
  }
  if (Object.keys(local).length > 0) {
    return local;
  }
  return null;
};

const clearData = (type='clearAll', dataKey) => {
  if (type === 'clearAll') {
    _localStorage.clear();
    _sessionStorage.clear();
  } else {
    _localStorage.removeItem(dataKey);
    _sessionStorage.removeItem(dataKey);
  }
};


export const storage = {
  saveData,
  getData,
  clearData,
};


