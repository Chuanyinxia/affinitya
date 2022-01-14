import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

import {Button, DatePicker, Input, Space} from 'antd';
import {FilterFilled, SearchOutlined} from '@ant-design/icons';
import TableFilterSelect from './TableFilterSelect';
export const getColumnSearchProps = (data, dataIndex, values) => ({
  // eslint-disable-next-line react/display-name
  filterDropdown: ({
    // eslint-disable-next-line react/prop-types
    selectedKeys, setSelectedKeys, confirm, clearFilters,
  }) => {
    return (
      <div style={{padding: 8}}>
        <Input
          placeholder={`Search ${data}`}
          defaultValue={values}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            values='';
          }}
          style={{marginBottom: 8, display: 'block', height: 32}}
        />
        <Space>
          <Button onClick={() => {
            if (values&&values.length>0) {
              setSelectedKeys(['']);
              values='';
              confirm();
              clearFilters();
              setTimeout(()=>{
                setSelectedKeys([]);
              }, 300);
            } else {
              setSelectedKeys([]);
              clearFilters();
              confirm();
            }
          }} size="small" style={{width: 90, fontSize: 14}}>
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              confirm();
            }}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90, fontSize: 14}}
          >
            Search
          </Button>
        </Space>
      </div>
    );
  },
  // eslint-disable-next-line react/display-name
  filterIcon: (filtered) => {
    return (<SearchOutlined style={{color: (!values&&!filtered)? undefined:'#5f5aa7'}}/>);
  },
  onFilter: (value, record) => record,
});

export const getColumnSearchTimeProps = (data, format) => ({
  // eslint-disable-next-line react/display-name
  filterDropdown: ({
    // eslint-disable-next-line react/prop-types,no-unused-vars
    selectedKeys, setSelectedKeys, confirm, clearFilters,
  }) => (
    <div style={{padding: 8}}>
      <DatePicker
        value={selectedKeys?moment(selectedKeys[0]):''}
        format="YYYY-MM-DD HH:mm"
        showTime
        placeholder={`Search ${data}`}
        onChange={(value) => setSelectedKeys(value ? [moment(value).format(format)] : [])}
        style={{marginBottom: 8, display: 'block'}}
      />
      <Space>
        <Button onClick={() => {
          clearFilters();
          setSelectedKeys(null);
          confirm();
        }} size="small" style={{width: 90}}>
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          icon={<SearchOutlined/>}
          size="small"
          style={{width: 90}}
        >
          Search
        </Button>
      </Space>
    </div>
  ),
  // eslint-disable-next-line react/display-name
  filterIcon: (filtered) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}} />,
  onFilter: (value, record) => record,
});

export const createColumnSelectProps = (column, filter)=> {
  const filterValue = filter[column.key];
  return {
    filteredValue: (filterValue == null) ? [] : [filterValue],
    filterDropdown: TableFilterSelect,
    filterIcon: <FilterFilled style={{fontSize: '0.9rem'}} />,
  };
};
