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
      password: ''
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
  
  render() {
    const {
      handleUserRegistration,
      setInputValue,
      state: {
        inputValue,
      }
    } = this;
    
    return (
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
          buttonOnClick={ e => handleUserRegistration(e) }
          buttonContent='Register'
          buttonType='submit'
        />
      </Form>
    )
  }
}
 
export default RegistrationContainer;