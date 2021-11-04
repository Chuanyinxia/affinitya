import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading, getMangerCounts, updateIsPay} from '@/store/actions';
import './style.css';
import {Button, Card, Col, Empty, message, Row, Space, Tabs, Tooltip} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get, post} from '@/utils/request';
import {EXPORTCVS, ISPAID, SAVESEARCHMESSAGE, SAVESEARCHMESSAGEBYGROUP, GETNOREADAUDIENCE, EXPORTCVS2} from '@/api';
// import {CopyToClipboard} from 'react-copy-to-clipboard';
// import ClipboardJS from 'clipboard';

import ReactClipboard from 'react-clipboardjs-copy';
import store from '@/store';
import {storage} from '@/utils/storage';
const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData, statusType, searchID, searchType, source,
  hideFirstButton, jobSave, jobName, hideTesting, hideCheckbox}) => {
  const [saveStatus, setSaveStatus] = useState(0);
  const [isPayUser, setIsPayUser] = useState(false);
  const [selectKeys, setSelectKeys] = useState([]);
  const [copyValue, setCopyValues] = useState('');
  const [groupId, setGroupId] = useState(null);
  const tableData = (tableData) => {
    const data = tableData.map((item, index) => {
      return {...item, index: index + 1};
    });
    return data;
  };
  const saveAudience = () => {
    if (groupId === 0 || groupId) {
      const data = {
        'searchId': searchID,
        'saveGroup': [{
          'groupId': groupId,
          'ids': selectKeys.join(','),
        }],
      };
      post(SAVESEARCHMESSAGEBYGROUP, data,
          {
            'Content-Type': 'application/json',
            'token': userInfo.token,
          }).then((res) => {
        message.success(res.msg);
        jobSave({
          'searchId': searchID,
          'groupId': groupId,
        });
        setSaveStatus(1);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(()=>{
        get(GETNOREADAUDIENCE, userInfo.token).then((res)=>{
          store.dispatch(getMangerCounts(res.data));
          storage.saveData('local', 'mangerCounts', res.data);
        }).catch((error)=>{
          console.log(error);
        });
      });
    } else {
      post(SAVESEARCHMESSAGE,
          {searchId: searchID},
          {
          // eslint-disable-next-line no-tabs
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': userInfo.token,
          }).then((res) => {
        setSaveStatus(1);
        jobSave({
          'searchId': searchID,
        });
        message.success(res.msg);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      }).finally(()=>{
        get(GETNOREADAUDIENCE, userInfo.token).then((res)=>{
          store.dispatch(getMangerCounts(res.data));
          storage.saveData('local', 'mangerCounts', res.data);
        }).catch((error)=>{
          console.log(error);
        });
      });
    }
  };

  const isPay=()=>{
    get(ISPAID, userInfo.token).then((res)=>{
      setIsPayUser(res.data===2);
      store.dispatch(updateIsPay(res.data));
    }).catch((error)=>{
      message.error({
        content: error.toString(), key: 'netError', duration: 2,
      });
    });
  };

  const downloadButton=()=>{
    const url=source===1?`${EXPORTCVS}${searchID}/${searchType}/1/${userInfo.token}`:
    source===2?`${EXPORTCVS2}${searchID}/${searchType}/${userInfo.token}`:
                `${EXPORTCVS}${searchID}/${searchType}/2/${userInfo.token}`
    ;
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
        target="_blank"
        href={url}
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

  const copyKeyword = () => {
    return (
      <ReactClipboard
        target={'#copy'}
        onSuccess={() => message.success('Copy success!')}
        onError={() => message.success('Copy error!')}>
        <Button size="md" className="btn-md" >
          Copy Keyword
        </Button>
      </ReactClipboard>


    // </CopyToClipboard>
    );
  };

  const onSelect = (key, value, groupId) => {
    // console.log(key, value, groupId);
    setSelectKeys(key);
    setGroupId(groupId);
  };

  useEffect(() => {
    console.log(searchData);
    isPay();
  }, []);
  useEffect(()=>{
    let str='';
    setCopyValues('');
    if (searchData.length>0) {
      console.log(searchData);
      str = `<table>
                      <thead>
                      <tr>
                          <th>Audience</th>
                          <th>ID</th>
                          <th>Keyword</th>
                          <th>Size</th>
                          <th>Path</th>
                      </tr>
                  </thead><tbody>`;
      searchData.forEach((item) => {
        item.searchDetails.forEach((data, index) => {
          str += `<tr>
                      <td>${item.groupId}</td>
                      <td>${index+1}</td>
                      <td>${data.keyword??''}</td>
                      <td>${data.size??''}</td>
                      <td>${data.path??''}</td>
                  </tr>`;
        });
      });
      str += `</tbody></table>`;
      setCopyValues(str);
    } else {
      setCopyValues('');
    }
  }, [searchData]);

  return (
    <div>
      <div id="copy" dangerouslySetInnerHTML={{__html: copyValue}}/>
      <Row>
        <Col span={6}>
          <h2 className="search-content">
            {jobName}
          </h2>
        </Col>
        <Col span={18} className="text-right marginB16 paddingR32">
          <Space>
            {(isPayUser&&!hideFirstButton&&!hideTesting)&&(
              <Tooltip
                placement="top"
                title={(saveStatus === 1|| parseInt(statusType)===1)?
                         'You have saved this result.':(
                           selectKeys.length>0?'': 'If you don\'t choose any keyword, we will save all for you.')
                }>
                <Button
                  type="primary"
                  className="btn-md"
                  disabled={(saveStatus === 1|| statusType===1||!searchID)?true:false}
                  onClick={saveAudience}
                >Save for Testing</Button>
              </Tooltip>)
            }
            {(!isPayUser&&!hideFirstButton)&& (<Tooltip title="Pls upgrade to use this function.">
              <Button
                disabled
                type="primary"
                className="btn-md"
              >Save for Testing
              </Button>
            </Tooltip>)}
            {copyKeyword()}
            {downloadButton()}
          </Space>
        </Col>
      </Row>
      <Card>
        {searchData.length>0?(<Tabs
          defaultActiveKey={searchID}
          destroyInactiveTabPane onChange={()=>{
            setGroupId(null);
            setSelectKeys([]);
          }}>
          {searchData.map((item)=>(
            <TabPane tab={`Audience ${item.groupId} (${item.searchDetails.length})`} key={item.id} >
              <ResultTable
                TableData={tableData(item.searchDetails ?? [])}
                onSelect={onSelect}
                groupId={item.groupId}
                hideCheckbox={hideCheckbox}
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
  statusType: PropTypes.string.isRequired,
  hideFirstButton: PropTypes.bool,
  jobSave: PropTypes.func.isRequired,
  jobName: PropTypes.string.isRequired,
  hideTesting: PropTypes.bool.isRequired,
  hideCheckbox: PropTypes.bool.isRequired,
  searchID: PropTypes.string.isRequired,
  searchType: PropTypes.string.isRequired,
  source: PropTypes.number.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KeyWordSearchDetails);

