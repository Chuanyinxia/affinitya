import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Radio} from 'antd';

export const TableFilterSelect=({
  setSelectedKeys, confirm, clearFilters,
})=> {
  const [value, setValue] = useState('');

  const onChange = (e) => {
    setSelectedKeys(e.target.value ? [e.target.value] : []);
    setValue(e.target.value);
  };

  const onConfirm = () => {
    confirm();
  };

  const onClear = () => {
    clearFilters();
    setValue('');
  };

  return (
    <>
      <Radio.Group style={{padding: '4px 0', maxHeight: '264px'}} onChange={onChange} value={value}>
        <Radio style={radioStyle} value={'true'}>
          Yes
        </Radio>
        <Radio style={radioStyle} value={'false'}>
          No
        </Radio>
      </Radio.Group>
      <div className="ant-table-filter-dropdown-btns">
        <Button onClick={onClear} type="link" size="small" disabled={value === ''}>Reset</Button>
        <Button onClick={onConfirm} type="primary" size="small">OK</Button>
      </div>
    </>
  );
};

const radioStyle = {
  display: 'block',
  height: '30px',
  padding: '5px 8px',
};

TableFilterSelect.propTypes = {
  setSelectedKeys: PropTypes.func.isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  confirm: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};
export default TableFilterSelect;
