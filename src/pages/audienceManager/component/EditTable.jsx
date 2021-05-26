import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import {Form, InputNumber, message, Space, Table, Tooltip, Modal, Button} from 'antd';
import {
  AppstoreAddOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
  FormOutlined,
  RedoOutlined,
  SaveOutlined,
  SyncOutlined,
  FolderViewOutlined,
} from '@ant-design/icons';
import {post} from '@/utils/request';
import {SAVESEARCHRESULT, GETEXTENDBYAUDI, RESTARTJOB, EXPORTDETAIL} from '@/api/index';
import ResultTable from '@/components/Table/ResultTable';


const EditableCell = ({
  // eslint-disable-next-line react/prop-types
  editing, dataIndex, title, inputType, value, record, index, children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ?
    <InputNumber/> :
    <InputNumber/>;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const EditTable = ({userInfo, httpLoading, setHttpLoading, details, saveFunc, id}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState([]);
  const [viewDetails, setViewDetails] = useState([]);
  const [viewModal, setViewModal]= useState(false);
  const [lookID, setLookID]=useState(null);
  const [lookType, setLookType]=useState(null);
  const isEditing = (record) => record.id === editingKey;


  useEffect(() => {

  }, []);

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });

    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const valuesChange = (changedValues, allValues) => {
    if (Object.keys(changedValues).toString() === 'spend' ||
      Object.keys(changedValues).toString() === 'install' ||
      Object.keys(changedValues).toString() === 'cpi'
    ) {
      const Cpi = parseFloat(allValues.spend / allValues.install) ?? 0;
      form.setFieldsValue({cpi: Cpi});
    }
  };
  const saveSearchResult = (data) => {
    post(SAVESEARCHRESULT, {resultList: data}, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/json',
      'token': userInfo.token,
    }).then((res) => {
      console.log(res);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      saveFunc(id);
    });
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      console.log(key);
      const index = newData.findIndex((item) => key === item.key);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setData(newData);
        newData[0].id = editingKey;
        setHttpLoading(true);
        saveSearchResult(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        newData[0].id = editingKey;
        saveSearchResult(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const extend=(itemId)=>{
    post(GETEXTENDBYAUDI+itemId, {}, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      console.log(res);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      saveFunc(id);
    });
  };

  const running=(itemId)=>{
    post(RESTARTJOB+itemId, {}, {
      // eslint-disable-next-line no-tabs
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      console.log(res);
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    }).finally(() => {
      saveFunc(id);
    });
  };

  const columns = [
    {
      title: 'Group ID',
      width: '150px',
      dataIndex: 'groupId',
    },
    {
      title: 'Spend',
      dataIndex: 'spend',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Impression',
      dataIndex: 'impression',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Click',
      dataIndex: 'clickCount',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Install',
      dataIndex: 'install',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Purchase',
      dataIndex: 'purchase',
      inputType: 'number',
      editable: true,
    },
    {
      title: 'ROAS',
      dataIndex: 'roas',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'CPI(Spend/Install)',
      dataIndex: 'cpi',
      inputType: 'cpi',
      editable: true,
    },
    {
      title: 'Action',
      // eslint-disable-next-line react/display-name
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="large">
            <Tooltip title="Save">
              <a type="link" onClick={() => save(record.key)}>
                <SaveOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            <Tooltip title="Cancel">
              <a type="link" onClick={cancel}>
                <CloseCircleOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
          </Space>
        ) : (
          <Space size="large">
            <Tooltip title="Edit">
              <a type="link" onClick={() => edit(record)} disabled={editingKey !== ''}>
                <FormOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            <Tooltip title="View Details">
              <a type="link" onClick={()=>{
                setViewModal(true);
                setLookID(record.id);
                setLookType(1);
                setViewDetails(record.searchDetails??[]);
              }}>
                <FileSearchOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>
            {record.status===0&&(<Tooltip title="Extend">
              <a type="link" onClick={()=>extend(record.id)}>
                <AppstoreAddOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
            {record.status===1&&(<Tooltip title="Running">
              <RedoOutlined spin style={{fontSize: 16}}/>
            </Tooltip>)}
            {record.status===2&&(<Tooltip title="Extend Keyword">
              <a type="link" onClick={()=>{
                setViewModal(true);
                setLookID(record.id);
                setLookType(2);
                setViewDetails(record.extendDetail??[]);
              }}>
                <FolderViewOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
            {/* <Tooltip title="Restart the job">
              <a type="link">
                <SyncOutlined/>
              </a>
            </Tooltip>*/}
            {record.status>2&&(<Tooltip title="restart">
              <a type="link" onClick={()=>running(record.jobId)}>
                <SyncOutlined style={{fontSize: 16}}/>
              </a>
            </Tooltip>)}
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addIndex=(data)=>{
    const tableData=data.map((item, index)=>{
      return {...item, index: index+1};
    })??[];
    return tableData;
  };

  return (
    <div >
      <Modal
        title=""
        width={1200}
        visible={viewModal}
        footer={null}
        onOk={()=>{
          setViewDetails([]);
          setViewModal(false);
        }}
        onCancel={()=>{
          setViewDetails([]);
          setViewModal(false);
        }}>
        <div className="text-right marginB16 marginT16">
          <Space>
            <Button
              download
              href={`${EXPORTDETAIL}${lookID}/${lookType}/${userInfo.token}`}>Export to CSV</Button>
          </Space>
        </div>
        {<ResultTable TableData={addIndex(viewDetails)}/>}
      </Modal>
      <Form form={form} component={false} onValuesChange={valuesChange}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={details}
          rowKey={(record) => record.id}
          rowClassName="editable-row"
          pagination={false}
          className="marginT16"
          loading={httpLoading}
        />
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    httpLoading: state.toggleHttpLoading.loading,
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

EditTable.propTypes = {
  userInfo: PropTypes.object.isRequired,
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  details: PropTypes.arrayOf.isRequired,
  saveFunc: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTable);
