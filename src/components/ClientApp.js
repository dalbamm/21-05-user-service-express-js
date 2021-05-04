import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import baseInfo from '../env/baseInfo';


//const endpoint = `${window.location.protocol}//${window.location.hostname}:5000`
//const endpoint = `http://a565531e3c60a44f58abd9bcd7738e7b-179731210.ap-northeast-2.elb.amazonaws.com:9999`
const endpoint = baseInfo.endpoint

let tok = null;

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Jua',
      'Do Hyeon',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        CloudNativeLab
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function redirectDestination() {
  const cookieStr = document.cookie;
  let cookies = cookieStr.split("; ");
  let destination = window.location.origin;

  cookies.forEach(elem => {
    if (elem.includes("throughme_redirection_url")) {
      destination = elem.substring(elem.indexOf("=") + 1);
    }
  })
  window.location.href = destination;

}
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "darkcyan",
  },
  check: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "slategray"
  },
  disabledCheck: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "grey"
  },
  checkComplete: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "springgreen"
  },
  text: {
    color: "darkslateblue",

  },
  validate: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
    backgroundColor: "darksalmon"
  }
}));

function ClientApp() {
  let classes = useStyles();
  const [flagUnique, setFlagUnique] = useState(false);
  const [flagWait, setFlagWait] = useState(false);
  const [flagValid, setFlagValid] = useState(false);
  const [clientAppList, setClientAppList] = useState({});

  {
    axios.get(`${endpoint}/appusers/list`)
    .then((res)=>{
      console.log(res.data);
      setClientAppList()
    }).catch(err=>{
      console.log(err)
      return;
    })
  }

  let handleCheckReplicated = () => {
    let email = document.getElementById("email").value
    if (!email) {
      alert("중복 확인할 이메일 주소를 입력해주세요.")
      return;
    }
    axios.post(`${endpoint}/users/signup/checkReplicated`, {
      "email": email
    }).then((res) => {
      console.log(res)
      if (res.data.result === 'success') {
        setFlagUnique(true)
        alert('사용 가능한 이메일입니다.')
      } else if (res.data.result === 'fail' && res.data.detail === 'exists') {
        alert('이미 가입되어 있는 이메일입니다. 다른 이메일을 사용하세요.')
      } else {
        alert('중복 확인 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')
      }

    }).catch((err) => {
      console.log(err)
      alert('중복 확인 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')
    })
  }
  let handleSendValidateMail = () => {
    let email = document.getElementById("email").value
    if (!email) {
      alert("인증 번호를 수신할 이메일 주소를 입력해주세요.")
      return;
    }
    axios.post(`${endpoint}/users/signup/validateMail`, {
      "email": email
    }).then((res) => {
      console.log(res)
      if (res.data.result === 'success') {
        setFlagWait(true)
        alert('인증번호가 발송되었습니다. \r\n수신한 인증번호를 아래 칸에 입력해주세요.')
      } else {
        alert('인증번호 발송 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  let handleValidateAddress = () => {
    let email = document.getElementById("email").value
    let magicNumber = document.getElementById("magicNumber").value
    if (!email) {
      alert("이메일 값이 잘못되었습니다. 새로고침 후 다시 한번 시도해주세요.")
      return;
    }
    if (!magicNumber) {
      alert("인증 번호를 입력해주세요.")
      return;
    }
    axios.post(`${endpoint}/users/signup/checkValidity`, {
      "email": email,
      "magicNumber": magicNumber
    }).then((res) => {
      console.log(res)
      if (res.data.result === 'success') {
        alert('인증번호 검증이 완료되었습니다.')
        setFlagValid(true);
        setFlagWait(false);
      } else {
        alert('인증번호 검증에 실패하였습니다.')
      }
    }).catch((err) => {
      console.log(err)
      alert('인증번호 검증 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')

    })
  }
  let handleClick = () => {
    // console.log('hello')
    if (!flagValid || !flagUnique || flagWait) {
      alert('위 가입 절차를 모두 완료해주세요.')
      return;
    }
    let email = document.getElementById("email").value
    let pw = document.getElementById("password").value
    let pwRpt = document.getElementById("passwordRepeat").value
    if (!email) {
      alert("이메일 값이 잘못되었습니다. 새로고침 후 다시 한번 시도해주세요.")
      return;
    } else if (!pw) {
      alert("비밀번호를 입력해주세요.")
      return;
    } else if (!pwRpt) {
      alert("비밀번호 확인을 입력해주세요.")
      return;
    } else if (pwRpt !== pw) {
      alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.")
      return;
    }

    handleSignup();
  }
  let handleEnter = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }

  }
  let handleSignup = (event) => {
    let email = document.getElementById("email").value
    let pw = document.getElementById("password").value;
    axios.post(`${endpoint}/users/signup`, {
      email: email, pw: pw
    }, { withCredentials: true }).then((res) => {
      if (!res.data || !res.data.result) {
        throw new Error("empty response")
      } else if (res.data.result === "ok") {
        alert("회원가입이 완료되었습니다. 메인 화면으로 이동합니다.")
        window.location.href = "/"
      } else {
        alert('회원가입 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')
      }
      //      document.cookie=res.headers["Set-Cookie"]
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert('회원가입 중 문제가 발생하였습니다. 관리자에게 문의하세요.(throughme.adm@gmail.com)')
    })
  }

  return (


    < div className="App" >
      {/* <header className="App-header">
	  <div>Auth</div>
	  <div>Email<input id="email"/></div>
          <div>Password<input type="password" id="password"/></div>
          <div><button onClick={handleClick}>signin</button><button onClick={handleSignup} disabled  >signup</button></div>
          <div>{tok}</div>
      </header> */}
      < ThemeProvider theme={theme} >
        <React.Fragment>
          <CssBaseline />
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar} >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
              </Typography>
              <form className={classes.form} noValidate>
                <table style={{ borderBlock: "solid 0.25px" }}>
                  <thead>
                    <tr>
                      <th>App ID</th>
                      <th>App Key</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      <tr>
                        <td>Aengmu</td>
                        <td>1q2w3e4r</td>
                        <td>Aengmu App</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </form>
            </div>
          </Container>
        </React.Fragment>
      </ThemeProvider >
    </div >
  )
};


export default ClientApp;
