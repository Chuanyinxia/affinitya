import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Button, Card, Empty, Input, message, Modal, Space, Tabs, Tooltip} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get, post} from '@/utils/request';
import {EXPORTCVS, ISPAID, SAVESEARCHMESSAGE} from '@/api';

const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData, saveName, saveStatus, setSaveStatus}) => {
  const [saveModal, setSaveModal]=useState(false);
  const [audienceName, setAudienceName]=useState(saveName);
  const [isPayUser, setIsPayUser] = useState(false);
  const id = searchData[0] ? searchData[0].searchId : '';
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
            <Button disabled>Save Audience</Button>
          </Tooltip>);
      }
      return (<Button
        onClick={()=>setSaveModal(true)}
      >Save Audience</Button>);
    }
    return (<Tooltip title="Pls upgrade to use this function.">
      <Button disabled>Save Audience</Button>
    </Tooltip>);
  };
  useEffect(()=>{
    isPay();
  }, [isPayUser]);
  return (
    <div>
      <h2 className="search-content">
        From your custom audiences, Affinity Analyst extends high correlation audiences, organized in high relation
        groups for optimal audience sets and ranked per affinity data.</h2>
      <div className="text-right marginB16">
        <Space>
          {saveAudienceButton()}
          {isPayUser?(<Button
            download
            href={`${EXPORTCVS}${id}/${userInfo.token}`}
            disabled={!isPayUser}>
            Export to CSV
          </Button>):
            (<Tooltip title="Pls upgrade to use this function.">
              <Button disabled>
              Export to CSV
              </Button>
            </Tooltip>)
          }

        </Space>
      </div>
      <Card>
        {searchData[0]?(<Tabs defaultActiveKey={searchData[0].id}>
          {searchData.map((item)=>(
            <TabPane tab={`group${item.groupId}`} key={item.id} >
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
