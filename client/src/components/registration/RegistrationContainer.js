import React, { Component } from 'react';
import axios from 'axios';

import Form from '../misc/Form';
import TextField from '../misc/TextField';
import Button from '../misc/Button';

class RegistrationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      registering: true,
      registerHeaderText: 'Register for a new account with Lambda Notes',
      registerButtonText: 'Register for a new account',
      loginHeaderText: 'Log in to Lambda Notes with an existing account',
      loginButtonText: 'Log in with an existing account'
    };
  }
  
  // setInputValue
  setInputValue = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  // handleUserRegistration
  handleUserRegistration = e => {
    e.preventDefault();
    
    const { history } = this.props;
    const { username, password } = this.state;
    const method = 'post';
    const url = `http://localhost:5000/registration`;
    const headers = { 'Content-Type': 'application/json' };
    const data = { username, password };
    const request = { method, url, headers, data };

    axios(request)
      .then(({ data: { token } }) => {
        localStorage.setItem('token', token);
        history.push('/note');
      })
      .catch(err => console.log(err));
  }

  // handleUserLogin
  handleUserLogin = async e => {
    e.preventDefault();

    const { username, password } = this.state;
    const request = {
      method  : 'post',
      url     : 'http://localhost:5000/registration/login',
      data    : { username, password }
    };

    try {
      const { history } = this.props;
      const { data: { token } } = await axios(request);
      
      localStorage.setItem('token', token)
      history.push('/note');
    }
    catch (err) {
      console.log(err);
    }
  }

  // sendUserSubmittedForm
  sendUserSubmittedForm = async e => {
    const { registering } = this.state;
    const { handleUserRegistration, handleUserLogin } = this;

    (registering) ? handleUserRegistration(e) : handleUserLogin(e);
  }

  // swapRegisteringValue
  swapRegisteringValue = () => {
    const { registering } = this.state;

    this.setState({
      registering: !registering
    });
  }

  headerText = () => {
    const { registering, registerHeaderText, loginHeaderText } = this.state;
    return (registering) ? registerHeaderText : loginHeaderText;
  }

  setRegisterOrLoginButtonText = () => {
    const { registering, registerButtonText, loginButtonText  } = this.state;
    return (registering) ? loginButtonText : registerButtonText;
  }

  componentDidMount() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    const request = {
      method: 'get',
      url: `http://localhost:5000/api/users/${ token }`
    }
    
    axios(request)
      .then(({ data }) => {
        if (data.user) history.push('/note');
      })
      .catch(err => {
        return;
      });
  }
  
  render() {
    const {
      sendUserSubmittedForm,
      setInputValue,
      swapRegisteringValue,
      headerText,
      setRegisterOrLoginButtonText,
      state: {
        inputValue,
      }
    } = this;
    
    return (
      <React.Fragment>
        <h1>{ headerText() }</h1>

        <Form formAutoComplete='off'>
          <TextField
            inputName='username'
            inputOnChange={ setInputValue }
            inputPlaceholder='Username'
            inputType='text'
            inputValue={ inputValue }
            variant='input'
          />

          <TextField
            inputName='password'
            inputOnChange={ setInputValue }
            inputPlaceholder='Password'
            inputType='password'
            inputValue={ inputValue }
            variant='input'
          />

          <Button
            buttonClassName='button'
            buttonOnClick={ sendUserSubmittedForm }
            buttonContent='Register'
            buttonType='submit'
          />
        </Form>

        <Button
          buttonClassName='button'
          buttonOnClick={ swapRegisteringValue }
          buttonContent={ setRegisterOrLoginButtonText() }
          buttonType='button'
        />
      </React.Fragment>
    )
  }
}
 
export default RegistrationContainer;