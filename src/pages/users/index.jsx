import React from 'react';
import {Table, Space, Tooltip} from 'antd';

const Users=()=>{
  const data = [
    {
      id: '1',
      name: 'admin',
      role: 'Admin',
    },
    {
      id: '2',
      name: 'security1',
      role: 'Security',
    },
    {
      id: '3',
      name: 'security2',
      role: 'Security',
    },
    {
      id: '4',
      name: 'nurse1',
      role: 'Nurse',
    },
    {
      id: '5',
      name: 'nurse2',
      role: 'Nurse',
    },
  ];
  return <div>
    <h1 className="page-title">Users</h1>
    <Table dataSource={data} pagination={{
      size: 'small',
    }}>
      <Table.Column title="ID" dataIndex="id" key="id"/>
      <Table.Column title="Username" dataIndex="name" key="name"/>
      <Table.Column title="Role" dataIndex="role" key="Role"/>
      <Table.Column title="Action" key="action" render={ (text, record) => (
        <Space size="middle">
          <Tooltip title="This function is not available yet.">
            <a>Edit</a>
          </Tooltip>
          <Tooltip title="This function is not available yet.">
            <a>Delete</a>
          </Tooltip>
          <Tooltip title="This function is not available yet.">
            <a>Reset Password</a>
          </Tooltip>
        </Space>
      )}/>
    </Table>
  </div>;
};


export default Users;
