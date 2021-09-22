import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Button, Card, Empty, Input, message, Modal, Space, Tabs, Tooltip, Row, Col} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get, post} from '@/utils/request';
import {EXPORTCVS, ISPAID, SAVESEARCHMESSAGE} from '@/api';

const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData, saveName, saveStatus, setSaveStatus}) => {
  const [saveModal, setSaveModal]=useState(false);
  const [audienceName, setAudienceName]=useState(saveName);
  const [isPayUser, setIsPayUser] = useState(false);
  console.log(searchData);
  const id = searchData ? searchData[0].searchId : '';
  const tableData = (tableData) => {
    const data = tableData.map((item, index) => {
      return {...item, index: index + 1};
    });
    return data;
  };
  const saveAudience=()=> {
    if (searchData.length<1) {
      message.warn('The search result is empty and cannot be saved.');
      return false;
    }
    post(SAVESEARCHMESSAGE,
        {searchId: id, audienceName: audienceName !== '' ? audienceName : saveName},
        {
          // eslint-disable-next-line no-tabs
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': userInfo.token,
        }).then((res) => {
      message.success(res.msg);
      setSaveStatus(1);
      setSaveModal(false);
      setAudienceName('');
    }).catch((error) => {
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };
  const saveAudienceButton=()=>{
    if (isPayUser) {
      if (parseInt(saveStatus)===1) {
        return (
          <Tooltip title="You have saved this result.">
            <Button
              disabled
              type="primary"
              className="btn-md"
            >
              Save for Testing
            </Button>
          </Tooltip>);
      }
      return (<Button
        type="primary"
        className="btn-md"
        onClick={()=>setSaveModal(true)}
      >Save for Testing</Button>);
    }
    return (<Tooltip title="Pls upgrade to use this function.">
      <Button
        disabled
        type="primary"
        className="btn-md"
      >Save for Testing
      </Button>
    </Tooltip>);
  };

  const downloadButton=()=>{
    if (isPayUser) {
      if (searchData.length<1) {
        return ( <Tooltip title="The search result is empty and cannot be exported.">
          <Button disabled className="btn-md">
            Export to CSV
          </Button>
        </Tooltip>);
      }
      return (<Button
        className="btn-md"
        download
        href={`${EXPORTCVS}${id}/${userInfo.token}`}
        disabled={!isPayUser}>
        Export to CSV
      </Button>);
    }
    return (
      <Tooltip title="Pls upgrade to use this function.">
        <Button disabled className="btn-md">
          Export to CSV
        </Button>
      </Tooltip>);
  };

  const copyKeyword = ()=>{
    return (
      <Button disabled className="btn-md">
        Copy Keyword
      </Button>);
  };
  useEffect(()=>{
    isPay();
  }, [isPayUser]);
  return (
    <div>
      <Row>
        <Col span={6}><h2 className="search-content">
          Tennis</h2></Col>
        <Col span={18} className="text-right marginB16 paddingR32">
          <Space>
            {saveAudienceButton()}
            {copyKeyword()}
            {downloadButton()}
          </Space>
        </Col>
      </Row>
      <Card>
        {searchData?(<Tabs defaultActiveKey={searchData[0].id} >
          {searchData.map((item)=>(
            <TabPane tab={`Group ${item.groupId} (${item.searchDetails.length})`} key={item.id} >
              <ResultTable TableData={tableData(item.searchDetails??[])}/>
            </TabPane>))}
        </Tabs>):(<Empty />)
        }
      </Card>
      <Modal
        title="Save Audience"
        visible={saveModal}
        onOk={saveAudience}
        onCancel={()=>{
          setSaveModal(false);
          setAudienceName('');
        }}>
        <Input
          maxLength={100}
          defaultValue={saveName}
          placeholder="Audience Name"
          onChange={(e)=>setAudienceName(e.target.value)}/>
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
  saveName: PropTypes.string.isRequired,
  saveStatus: PropTypes.string.isRequired,
  setSaveStatus: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KeyWordSearchDetails);
