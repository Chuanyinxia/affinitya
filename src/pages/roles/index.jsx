import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Table, Space, Tooltip,
} from 'antd';
import {
  httpLoading,
} from '@/store/actions';


const Roles = () => {
  const data = [
    {
      id: '1',
      permission: 'All',
      name: 'Admin',
    },
    {
      id: '2',
      permission: 'Face Recognition,Falling,Tracing',
      name: 'Security',
    },
    {
      id: '3',
      permission: 'Falling,Waiting',
      name: 'Nurse',
    },
  ];
  return <div>
    <h1 className="page-title">Roles</h1>
    <Table dataSource={data} pagination={{
      size: 'small',
    }}>
      <Table.Column title="ID" dataIndex="id" key="id"/>
      <Table.Column title="Role" dataIndex="name" key="name"/>
      <Table.Column title="Permission" dataIndex="permission" key="permission"/>
      <Table.Column title="Action" key="action" render={ () => (
        <Space size="middle">
          <Tooltip title="This function is not available yet.">
            <a>Edit</a>
          </Tooltip>
          <Tooltip title="This function is not available yet.">
            <a>Delete</a>
          </Tooltip>
        </Space>
      )}/>
    </Table>
  </div>;
};

const mapStateToProps = (state) => {
  return {
    httpLoading: state.toggleHttpLoading.loading,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f)=>dispatch(httpLoading(f)),

  };
};

Roles.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Roles);
