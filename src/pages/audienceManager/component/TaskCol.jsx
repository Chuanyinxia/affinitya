import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Input} from 'antd';
import {DeleteOutlined, SearchOutlined} from '@ant-design/icons';
const STATUS_CODE = {
  STATUS_GENERATED: {
    title: 'Generated',
    info: 'Custom audiences generated.',
    search: true,
    icon: false,
  },
  STATUS_TEST:
    {
      title: 'Test',
      info: 'Custom audiences you have under performance testing.',
      search: false,
      icon: false,
    },
  STATUS_WINNER: {
    title: 'Winner',
    info: 'Custom audiences with positive results.',
    search: false,
    icon: false,
  },
  STATUS_ARCHIVE: {
    title: 'Archive',
    info: '',
    search: false,
    icon: true,
  },
};


const TaskCol=({status, children, canDragIn, dragTo, userInfo})=>{
  const [In, setIn]=useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (canDragIn) {
      setIn(false);
    }
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (canDragIn) {
      setIn(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dragTo(status);
    setIn(false);
  };

  return (
    <div
      id={`col-${status}`}
      className={'col'}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragEnter}
      onDrop={handleDrop}
    >
      <header className="col-header">
        <Row>
          <Col span={14} className="col-header-title">{STATUS_CODE[status].title}</Col>
          <Col span={10} className="text-right">
            {STATUS_CODE[status].search&&<Input size="small" addonAfter={<SearchOutlined />}/>}
            {STATUS_CODE[status].icon&&<DeleteOutlined style={{fontSize: 20}}/>}
          </Col>
          <Col span={24}>{STATUS_CODE[status].info}</Col>
        </Row>
      </header>
      <main className={'col-main' + (In ? ' active' : '')}>
        {children}
      </main>
    </div>
  );
};

TaskCol.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  canDragIn: PropTypes.bool.isRequired,
  dragTo: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};
export default TaskCol;
