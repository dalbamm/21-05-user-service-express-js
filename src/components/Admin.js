import React, {forwardRef} from "react";
import MaterialTable from 'material-table'
import axios from "axios";
import baseInfo from "../env/baseInfo"

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const endpoint = baseInfo.endpoint


class Admin extends React.Component{
  constructor(props){
    super(props);
    this.state={
      accountLogs: [],
      userInfo: {},
      
    }
  }
  componentDidMount(){
    this.qualificate();
    this.initAccountLogData();
  }
  qualificate = async () => {
    const cookies = document.cookie.split(";");
    let token="";
    for(let cookie of cookies){
      console.log(cookie);
      if(cookie.includes("token=")){
        token=cookie.replace("token=","");
      }
    }
    if(token===""){
      alert('권한이 없습니다. 로그인 화면으로 이동합니다.')
      window.location.href=window.location.origin;
      return;
    }
    axios.post(`${endpoint}/users/info`, {token: token}).then((res)=>{
      console.log(res);
      if(res.data.result!=='success'){
        throw new Error(Object.toEntries(res.data));
      }
      this.setState( {userInfo: res.data.detail} )
    }).catch(e=>{
      console.log(e);
    })
  } 
  initAccountLogData = async ()=>{
    axios.get(`${endpoint}/admin/accountLogs`).then((res)=>{
      console.log(res);
      this.setState({accountLogs:res.data.result})
    }).catch(e=>{
      console.log(e);
    })
  }

  render() {
    return (
      <div style={{ padding: "20px",maxWidth: '100%', textAlign: "center" }}>

        <div style={{padding: "20px",fontSize:"1.5rem", textAlign: "left"}}>
          {Object.entries(this.state.userInfo).length>0? `${this.state.userInfo.userName} 관리자님 안녕하세요` : `사용자님의 정보를 확인중입니다.` }
          </div>
        <MaterialTable
          
          icons={tableIcons}
          columns={[
            { title: '이메일', field: 'email' },
            { title: '성명', field: 'userName' },
            { title: '가입일시', field: 'createdAt' },
            { title: '최근 로그인 일시', field: 'signedInAt', defaultSort:'desc'},
            { title: '비밀번호 변경 일시', field: 'pwUpdatedAt'  },
            { title: '프로필 변경일시', field: 'profileUpdatedAt'  }
          ]}
          data={this.state.accountLogs}
          
          title="회원별 가입/접속 이력"
        />
      </div>
    )
  }

  
}
export default Admin;

