import React, {Component} from 'react'; 
import Joi from '@hapi/joi';

class SignupParent extends Component{
  inputTemplate = {
    firstname:'', 
    lastname: '',
    email:    '', 
    username: '',
    password: '', 
    repassword:''
  }
  validateInputs(){
    // Setup Group Joi Schema
    const schema    = Joi.object().keys(this.schema);
    const {error}   = schema.validate(this.state.account, { abortEarly: false });
    let isValidated = false;
    let errors      = {...this.inputTemplate};
    if(error !== undefined){
      error.details.forEach(function({context:{key}, message: msg}){
        errors[key] = msg; });
    } else isValidated = true;
    this.setState({errors})
    return isValidated;
  }
  handleChange = ({currentTarget: input}) => {
    const account = {...this.state.account};  // Good practice to clone state first!!
    account[input.name] = input.value;  // set state = live input
    this.setState({account});
  }
}
export default SignupParent;