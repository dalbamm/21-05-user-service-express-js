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
import baseInfo from '../env/baseInfo'

//const endpoint = `${window.location.protocol}//${window.location.hostname}:5000`
const endpoint = baseInfo.endpoint
console.log(endpoint)
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
    color:"white",
    backgroundColor: "salmon"
  },
  text:{
    margin: theme.spacing(1, 2, 2),
    color:"darkslateblue",
  }
}));

function redirectDestination() {
  const cookieStr = document.cookie;
  let cookies = cookieStr.split("; ");
  let destination = "http://devportal.opsinno.cloud";

  cookies.forEach(elem => {
    if (elem.includes("throughme_redirection_url")) {
      destination = elem.substring(elem.indexOf("=") + 1);
    }
  })
  window.location.href = destination;

}

function Profile() {
  const [profile, setProfile] = useState({});
  if(document.cookie==""){
    alert('회원 정보가 없습니다. 로그인 화면으로 이동합니다.');
    window.location.href=`${window.location.origin}`
  }
  if(Object.keys(profile).length===0){
    axios.post(`${endpoint}/users/info`, {
      "token": document.cookie.split("; ").filter(e=>e.includes("token"))[0].split("=")[1]
    }, { withCredentials: true }).then((res) => {
      tok = res.data
    //  console.log(tok)
    //  console.log(res)
      //window.location.href="http://devportal.opsinno.cloud/"
      if(res.data.result && res.data.result==='success'){
        console.log(res.data.detail);
        setProfile(res.data.detail);
      }
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    });  
  }
  
  let handleClickChangePw = () => {
    window.location.href = `${window.location.href}pwChange`
  }
  let handleClick = () => {
    
    // console.log('hello')
    let email = document.getElementById("email").value
    let un = document.getElementById("userName").value;
    let ui = document.getElementById("userId").value;
    if(!un){
      alert('새로운 이름을 입력해주세요')
      return;
    }
    if(!ui){
      alert('새로운 사번을 입력해주세요')
      return;
    }
    // console.log(email)
    // console.log(pw)
    axios.put(`${endpoint}/users/update`, {
      email: email, userName: un, userId: ui
    }, { withCredentials: true }).then((res) => {
      tok = res.data
      console.log(tok)
      console.log(res)
      //window.location.href="http://devportal.opsinno.cloud/"
      if(res.data.result && res.data.result==='success'){
        //redirectDestination() 
        let oldToken=document.cookie.split("; ").filter(e=>e.includes("token"))[0];
        console.log(oldToken)
        console.log(document.cookie.replace(oldToken,""));
        alert('프로필 변경에 성공하였습니다.')
        // document.cookie=document.cookie.replace(oldToken,"token=invalid;");
        window.location.href=window.location.origin
      
      }
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert("업데이트에 실패하였습니다. 관리자에게 문의해주세요.(throughme.adm@gmail.com)")
    });
  }
  let handleEnter = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }

  }
  let handleClickSignUp = () => {
    window.location.href=`${window.location.href}signup`
  }
  let handleSignup = (event) => {
    // console.log('hello')
    let email = document.getElementById("email").value
    let pw = document.getElementById("password").value;
    // console.log(email)
    // console.log(pw)
    axios.post(`${endpoint}/users/signup`, {
      email: email, pw: pw
    }, { withCredentials: true }).then((res) => {
      tok = res.data
      console.log(tok)
      console.log(res)
      //      document.cookie=res.headers["Set-Cookie"]
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    })
  }
  const classes = useStyles();

  return (
    <div className="Home">

      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography>
            안녕하세요 {profile.userName}({profile.userId})님<br/><br/>
            이름 또는 사번을 변경하려면 아래 칸에 새로운 값을 입력 한후, 
            "프로필 변경" 버튼을 클릭해주세요.<br/>
            (이메일 주소는 변경할 수 없습니다.)
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              value={profile.email}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="userName"
              label="이름"
              name="userName"
              autoComplete="userName"
           />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="userId"
              label="사번"
              name="userId"
              autoComplete="userId"
            />
            {/*<FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />*/}
            <Button
              //type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleClick}
              onKeyPress={handleEnter}
            >
              프로필 변경
          </Button>
          </form>
        </div>
      </Container>

    </div>
  );
}

export default Profile;
