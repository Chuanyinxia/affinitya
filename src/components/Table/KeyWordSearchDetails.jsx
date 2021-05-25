import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Tabs, Card, Space, Button, Modal, Input, message} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {post} from '@/utils/request';
import {EXPORTCVS, SAVESEARCHMESSAGE} from '@/api';

const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData}) => {
  const [saveModal, setSaveModal]=useState(false);
  const [audienceName, setAudienceName]=useState('');
  const [id]=useState(searchData[0].searchId??'');
  const tableData=(tableData)=>{
    const data=tableData.map((item, index)=>{
      return {...item, index: index+1};
    });
    return data;
  };
  const saveAudience=()=>{
    console.log(id);
    post(SAVESEARCHMESSAGE, {searchId: id, audienceName: audienceName}, {
      // eslint-disable-next-line no-tabs
      'Content-Type':	'application/x-www-form-urlencoded',
      'token': userInfo.token,
    }).then((res)=>{
      message.success(res.msg);
      setSaveModal(false);
      setAudienceName('');
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };

  return (
    <div>
      <h2 className="search-content">
        From your custom audiences, Affinity Analyst extends high correlation audiences, organized in high relation
        groups for optimal audience sets and ranked per affinity data.</h2>
      <div className="text-right">
        <Space>
          <Button onClick={()=>setSaveModal(true)}>Save Audience</Button>
          <Button
            download
            href={`${EXPORTCVS}${id}/${userInfo.token}`}>Export to CSV</Button>
        </Space>
      </div>
      <Card>
        <Tabs defaultActiveKey={searchData[0].id}>
          {searchData.map((item)=>(
            <TabPane tab={`group${item.groupId}`} key={item.id} >
              <ResultTable TableData={tableData(item.searchDetails)}/>
            </TabPane>))}
        </Tabs>
      </Card>
      <Modal
        title="Save Audience"
        visible={saveModal}
        onOk={saveAudience}
        onCancel={()=>{
          setSaveModal(false);
          setAudienceName('');
        }}>
        <Input maxLength={100} placeholder="Audience Name" onChange={(e)=>setAudienceName(e.target.value)}/>
      </Modal>
    </div>

  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.getUserInfo.info,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setHttpLoading: (f) => dispatch(httpLoading(f)),
  };
};

KeyWordSearchDetails.propTypes = {
  userInfo: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KeyWordSearchDetails);
