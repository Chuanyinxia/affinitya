import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Col, Layout, Row, Collapse} from 'antd';
import {
  RightCircleOutlined,
  UpCircleFilled,
} from '@ant-design/icons';
import {httpLoading} from '@/store/actions';
import './style.css';
// import {post} from '@/utils/request';
// import {CONTACTUS} from '@/api';
import Headers from '@/components/Headers';
import Footers from '@/components/Footers';


const {Content} = Layout;
const {Panel} = Collapse;

const Faq = () => {
  const title1=`
  1. How are keywords expanded?
`;
  const text1 = `
  Affinity Analyst AI Engine expands from the user linkage between labels rather than based on 
  the semantic correlation of the labels. This method of expansion focuses on the actual 
  depiction of users. Users have multiple tags at any given time, for example, Tag A and Tag B – 
  the AA AI Engine processes and discovers the underlying inferred relations between Tag A and 
  Tag B, helping advertisers expand their user base from this data.
  `;
  const title2=`
  2. How to evaluate the results?
`;
  const text2 = `
  Our AA product is built to help advertisers scale their business by expanding to new audience 
  groups. It is not built to improve the ROI of a specific KPI metric directly but rather to discover 
  new audiences with similar ROI potential, facilitating the realization of stable growth of 
  performance goals and business scaling. For example, AA will build on stable retention, CPI, and 
  ROI to help drive spend, installs, and paying users, increasing overall revenue.
  `;
  const title3=`
  3. What measures are taken for the security of user tokens?
`;
  const text3 = `
  To provide customized results and reports, we require users to provide their access tokens and 
  associated IDs, especially for tag analysis for Lookalike Audiences. User tokens will be encrypted 
  when stored and only accessible for the owner’s account – the token can only be viewed and 
  used by the owner and can be deleted and changed by the owner.
  `;
  const title4=`
  4. What are the differences between Keyword expansion and Lookalike Audience expansion?
`;
  const text4 = `
  Keyword expansion expands from keywords provided by the users, which we recommend 
  providing keywords with past success. Via our AA AI Engine, we find new related tags from the 
  audience associated with the input keywords, resulting in highly user-relevant tags.

  Lookalike Audience expansion uses the core LAL audience provided by users as the seed  - the 
  more accurate the LAL, the better the results (we recommend 1% Value-Based LAL). Our 
  proprietary player-meta modeling engine deconstructs the user labels within the provided LAL 
  audience and expands them similarly to our Keyword expansion feature.
  
  `;
  const title5=`
  5. What role does AA play in the campaign performance optimization process?
`;
  const text5 = `
  Campaign performance on Facebook is affected by many factors other than just audiences, 
  such as optimization goals, campaign structure, budget, bidding, and creatives. AA’s mission & 
  product is to provide advertisers best in class audience scaling tool for business performance. 
  We also offer Facebook Campaign optimization recommendations to utilize the audiences fully 
  and achieve advertiser goals.
  `;
  // const submit = (values)=>{
  //   setHttpLoading(true);
  //   post(CONTACTUS, values, {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   }).then((res)=>{
  //     message.success('Send success，thank you for your inquiry!');
  //   }).catch((error)=>{
  //     message.error({
  //       content: error.toString(), key: 'netError', duration: 2,
  //     });
  //   }).finally(()=>setHttpLoading(false));
  // };
  const [activeKey, setactiveKey] = useState('1');
  return (
    <Layout className="layout Home">
      <Headers/>
      <Content>
        <div className="login-content fandq" style={{
          minHeight: 'calc(100vh - 180px)',
          paddingTop: 130,
          paddingBottom: 80,
        }}>
          <Row style={{marginTop: 18}}>
            <Col span={24}>
              <Row style={{marginTop: 18}}>
                <Col span={24}>
                  <div style={{textAlign: 'center', fontSize: 24, fontWeight: 600}}>FAQ</div>
                  <div style={{textAlign: 'center', fontSize: 14, color: '#6E7191', marginTop: 8}}>
                  If you have additional questions, please contact us.</div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{marginTop: 40}}>
              <Collapse
                bordered={false}
                activeKey={activeKey}
                expandIcon={({isActive}) => (
                  <div></div>
                )}
                onChange={(e)=>{
                  setactiveKey(e);
                }}>
                <Panel header={title1} key="1" extra={
                  activeKey.includes('1')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>
                }>
                  <p>{text1}</p>
                </Panel>
                <Panel header={title2} key="2" extra={activeKey.includes('2')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>}>
                  <p>{text2}</p>
                </Panel>
                <Panel header={title3} key="3" extra={activeKey.includes('3')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>}>
                  <p>{text3}</p>
                </Panel>
                <Panel header={title4} key="4" extra={activeKey.includes('4')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>}>
                  <p>{text4}</p>
                </Panel>
                <Panel header={title5} key="5" extra={activeKey.includes('5')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>}>
                  <p>{text5}</p>
                </Panel>
              </Collapse>
              {/* <Collapse
                bordered={false}
                activeKey={activeKey}
                expandIcon={({isActive}) => (
                  <div></div>
                )}
                onChange={(e)=>{
                  setactiveKey(e);
                }}>
                <Panel header={title1} key="1" extra={
                  activeKey.includes('1')?<UpCircleFilled style={{fontSize: 24}}/>:
                  <RightCircleOutlined style={{fontSize: 24}}/>
                }>
                  <p>{text1}</p>
                </Panel>
              </Collapse> */}
            </Col>
          </Row>
        </div>
      </Content>
      <Footers/>
    </Layout>
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

Faq.propTypes = {
  httpLoading: PropTypes.bool.isRequired,
  setHttpLoading: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Faq);
