import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Button, Card, Col, Empty, message, Row, Space, Tabs, Tooltip} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get, post} from '@/utils/request';
import {EXPORTCVS, ISPAID, SAVESEARCHMESSAGE, SAVESEARCHMESSAGEBYGROUP} from '@/api';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData}) => {
  const [saveStatus, setSaveStatus] = useState(false);
  const [isPayUser, setIsPayUser] = useState(false);
  const [selectKeys, setSelectKeys]= useState([]);
  const [copyValue, setCopyValues] = useState('');
  const [groupId, setGroupId]=useState(null);
  const id = searchData ? searchData[0].searchId : '';
  const tableData = (tableData) => {
    const data = tableData.map((item, index) => {
      return {...item, index: index + 1};
    });
    return data;
  };
  const saveAudience = () => {
    setSaveStatus(true);
    if (groupId) {
      const data={
        searchId: id,
        saveGroup: [{
          groupId,
          ids: selectKeys.join(','),
        }]};
      console.log(data);
      post(SAVESEARCHMESSAGEBYGROUP, data,
          {
          // eslint-disable-next-line no-tabs
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': userInfo.token,
          }).then((res) => {
        message.success(res.msg);
        setSaveStatus(1);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(() => {
        setSaveStatus(false);
      });
    } else {
      post(SAVESEARCHMESSAGE,
          {searchId: id},
          {
          // eslint-disable-next-line no-tabs
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': userInfo.token,
          }).then((res) => {
        message.success(res.msg);
        setSaveStatus(1);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(() => {
        setSaveStatus(false);
      });
    }
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

      return (
        <Tooltip placement="top" title="If you don't choose any keyword, we will save all for you.">
          <Button
            type="primary"
            className="btn-md"
            onClick={saveAudience}
          >Save for Testing</Button>
        </Tooltip>);
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
  const onCopy=()=>{
    message.success('copy');
  };
  const copyKeyword = () => {
    return (
      <CopyToClipboard text={copyValue} onCopy={onCopy}>
        <Button size="md" className="btn-md" >
            Copy Keyword
        </Button>
      </CopyToClipboard>
    );
  };

  const onSelect = (key, value, groupId) => {
    setSelectKeys(key);
    setGroupId(groupId);
  };

  useEffect(() => {
    isPay();
  }, []);
  useEffect(()=>{
    if (searchData) {
      let str='Group\tId\tKeyword\tSize\tpath\n';
      searchData.forEach((item)=>{
        item.searchDetails.forEach((data)=>{
          str+=`${item.groupId}\t${data.id}\t${data.keyword}\t${data.size}\t${data.path}\n`;
        });
      });
      setCopyValues(str);
    }
    console.log(copyValue);
  }, [searchData]);
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
        {searchData?(<Tabs defaultActiveKey={searchData[0].id} destroyInactiveTabPane onChange={()=>{
          setGroupId(null);
          setSelectKeys([]);
        }}>
          {searchData.map((item)=>(
            <TabPane tab={`Group ${item.groupId} (${item.searchDetails.length})`} key={item.id} >
              <ResultTable
                TableData={tableData(item.searchDetails ?? [])}
                onSelect={onSelect} groupId={item.groupId}
              />
            </TabPane>))}
        </Tabs>):(<Empty />)
        }
      </Card>

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
