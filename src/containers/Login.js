/*import React from "react";
import { FormGroup, ControlLabel, FormControl, Button } from "react-bootstrap";
import { observable, decorate } from "mobx";
import { observer } from "mobx-react";
import { Auth } from "aws-amplify";


class LoginStore{
    email = "";
    password = "";
}

decorate(LoginStore,{
  email: observable,
  password: observable
})


export const Login = observer(class Login extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
            loginStore: new LoginStore()
        }
    }

    validateForm() {
        return this.state.loginStore.email.length > 0 && this.state.loginStore.password.length > 0;
    }

    async handleSubmit(event){
      event.preventDefault();

      try {
        await Auth.signIn(this.state.email, this.state.password);
        alert("Logged in");
      } catch (e) {
        alert(e.message);
      }
    }
    
    render() {
        return (
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.loginStore.email}
                  onChange={event => this.state.loginStore.email = event.target.value}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.loginStore.password}
                  onChange={event => this.state.loginStore.password = event.target.value}
                  type="password"
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
              >
                Login
              </Button>
            </form>
          </div>
        );
    }
})*/