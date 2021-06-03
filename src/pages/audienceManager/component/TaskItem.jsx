import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Typography} from 'antd';
const {Text} = Typography;
const TaskItem=({info, active, onDragEnd, onDragStart, onClicks, userInfo})=>{
  const handleDragStart=(e)=>{
    onDragStart(info.id);
  };

  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      id={`item-${info.id}`}
      className={'item' + (active ? ' active' : '')}
      draggable="true"
    >
      <Row onClick={onClicks} className="item-link">
        <Col span={24} className="item-header" >
          <Text
            style={{width: '100%'}}
            ellipsis={{tooltip: info.campaignName}}
          >
            {info.campaignName}
          </Text>
        </Col>
        <Col span={8} className="item-main">{info.type}</Col>
        <Col span={16} className="text-right item-time">{info.createTime}</Col>
      </Row>
    </div>
  );
};
TaskItem.propTypes = {
  info: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onClicks: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default TaskItem;
