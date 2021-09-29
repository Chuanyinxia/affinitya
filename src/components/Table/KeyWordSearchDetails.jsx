import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {httpLoading} from '@/store/actions';
import './style.css';
import {Button, Card, Col, Empty, message, Row, Space, Tabs, Tooltip} from 'antd';
import ResultTable from '@/components/Table/ResultTable';
import {get, post} from '@/utils/request';
import {EXPORTCVS, ISPAID, SAVESEARCHMESSAGE, SAVESEARCHMESSAGEBYGROUP} from '@/api';
// import {CopyToClipboard} from 'react-copy-to-clipboard';
// import ClipboardJS from 'clipboard';

import ReactClipboard from 'react-clipboardjs-copy';
const {TabPane} = Tabs;


const KeyWordSearchDetails = ({userInfo, searchData, statusType}) => {
  const [saveStatus, setSaveStatus] = useState(0);
  const [isPayUser, setIsPayUser] = useState(false);
  const [selectKeys, setSelectKeys] = useState([]);
  const [copyValue, setCopyValues] = useState('');
  const [groupId, setGroupId] = useState(null);
  const id = searchData ? searchData[0]?.searchId : '';
  const tableData = (tableData) => {
    const data = tableData.map((item, index) => {
      return {...item, index: index + 1};
    });
    return data;
  };
  const saveAudience = () => {
    if (groupId === 0 || groupId) {
      const data = {
        'searchId': id,
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
        setSaveStatus(1);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
      });
    } else {
      post(SAVESEARCHMESSAGE,
          {searchId: id},
          {
          // eslint-disable-next-line no-tabs
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': userInfo.token,
          }).then((res) => {
        setSaveStatus(1);
        console.log(saveStatus);
        message.success(res.msg);
      }).catch((error) => {
        message.error({
          content: error.toString(), key: 'netError', duration: 2,
        });
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
        target="_blank"
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
  // const onCopy=()=>{
  //   // const clipboard = new ClipboardJS('#copyBtn', {
  //   //   text: () => copyValue,
  //   // });
  //   // clipboard.on('success', function(e) {
  //   //   console.log('复制成功');
  //   //   clipboard.destroy();
  //   // });
  //   //
  //   // message.success('copy');
  //   // console.log(copyValue);
  //   // const copy=document.getElementById('copy');
  //   // // copy.innerHTML=str;
  //   // // console.log(copy);
  //   // // // window.clipboardData.clearData('text');
  //   // // if (window.clipboardData.setData('text', str)) {
  //   // //   message.success('copy');
  //   // // } else {
  //   // //   message.error('copy');
  //   // // }
  //   // const range=document.createRange();
  //   // range.selectNodeContents(copy);
  //   // window.getSelection().addRange(range);
  //   // document.execCommand('Copy');
  //   // const tag=document.execCommand('Copy');
  //   // if (tag) {
  //   //   message.success('copy');
  //   // }
  // };
  // const toCopy=()=>{
  //
  // };
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
    isPay();
  }, []);
  useEffect(()=>{
    let str='';
    setCopyValues('');
    if (searchData) {
      // str=`Audience&nbsp;Id&nbsp;Keyword&nbsp;Size&nbsp;Path<br/>`;
      // searchData.forEach((item)=>{
      //   item.searchDetails.forEach((data)=>{
      //     str+=`${item.groupId}&nbsp;&nbsp;
      //           ${data.id}&nbsp;&nbsp;
      //           ${data.keyword}&nbsp;&nbsp;
      //           ${data.size}&nbsp;&nbsp;
      //           ${data.path}<br/>`;
      //   });
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
                      <td>${data.keyword}</td>
                      <td>${data.size}</td>
                      <td>${data.path}</td>
                  </tr>`;
        });
      });
      str += `</tbody></table>`;
      // str=`Audience\r
      //           ID\r
      //           Keyword\r
      //           Size\r
      //           Path\n\t`;
      // searchData.forEach((item)=>{
      //   item.searchDetails.forEach((data)=>{
      //     str+=`${item.groupId}\t
      //           ${data.id}\t
      //           ${data.keyword}\t
      //           ${data.size}\t
      //           ${data.path}\r\t`;
      //   });
      // });
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
          Tennis
          </h2>
        </Col>
        <Col span={18} className="text-right marginB16 paddingR32">
          <Space>
            {isPayUser&&(
              <Tooltip
                placement="top"
                title={(saveStatus === 1|| parseInt(statusType)===1)?
                         'You have saved this result.':
              'If you don\'t choose any keyword, we will save all for you.'}>
                <Button
                  type="primary"
                  className="btn-md"
                  disabled={(saveStatus === 1|| statusType===1||!id)?true:false}
                  onClick={saveAudience}
                >Save for Testing</Button>
              </Tooltip>)
            }
            {!isPayUser&& (<Tooltip title="Pls upgrade to use this function.">
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
          defaultActiveKey={searchData[0]?.id}
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KeyWordSearchDetails);

