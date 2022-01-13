import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

import {Button, DatePicker, Select, Space} from 'antd';
import {FilterFilled, SearchOutlined} from '@ant-design/icons';
import TableFilterSelect from './TableFilterSelect';
import {Countrys} from '@/components/plugin/Country';

export const getColumnSelectProps = (data, dataIndex) => ({
  // eslint-disable-next-line react/display-name
  filterDropdown: ({
    // eslint-disable-next-line react/prop-types
    selectedKeys, setSelectedKeys, confirm, clearFilters,
  }) => (
    <div style={{padding: 8}}>
      <Select
        placeholder={`Search ${data}`}
        value={selectedKeys[0]}
        size="small"
        className="small-select"
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        style={{marginBottom: 8, display: 'block', height: 32}}
        optionFilterProp="children"
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
        }
      >
        {Countrys.map((item) => (
          <Select.Option key={item.country_code} value={item.country_code}>{item.name}</Select.Option>
        ))}
      </Select>
      <Space>
        <Button onClick={()=>{
          clearFilters();
          confirm();
        }} size="small" style={{width: 90, fontSize: 14}}>
          Reset
        </Button>
        <Button
          type="primary"
          onClick={()=> {
            confirm();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{width: 90, fontSize: 14}}
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
