import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions";

import { Formik, Form, Field } from "formik";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error : {}
    };
  }
  onUserRegister = values =>{
    this.props.registerUser(values,this.props.history);
  }
  validate = values =>{
    let error = {};
    if(!values.first_name){
      error.first_name = "Please enter first name";
    }
    if(!values.last_name){
      error.last_name = "Please enter last name";
    }
    if(!values.email){
      error.email = "Please enter email";
    }
    if(values.email){
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = "Invalid email address";
      }
    }
    if(!values.phone){
      error.phone = "Please enter phone";
    }
    if(!values.password){
      error.password = "Please enter password";
    }
    if(values.password){
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,30}$/i.test(values.password)) {
        error.password = "Password requires 1 uppercase, 1 lowercase, 1 symbol, 1 number, min 8 and max 30 characters";
      }
    }
    if(!values.confirm_password){
      error.confirm_password = "Please enter Confirm Password";
    }
    if(values.confirm_password && values.password && values.confirm_password !== values.password){
      error.confirm_password = "Confirm Password Does not match";
    }
    return error;
  }

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">Knowledge Base</p>
              <p className="white mb-0">
                Please use this form to register. <br />
                If you are a member, please{" "}
                <NavLink to={`/user/login`} className="white">
                  login
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>
              <Formik
                initialValues={{
                  email : "",
                  password: "",
                  first_name : "",
                  last_name : "",
                  confirm_password : "",
                  phone : ""
                }}
                onSubmit={this.onUserRegister}
                validate = {this.validate}
                >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                     <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.first_name" />
                      </Label>
                      <Field
                        className="form-control"
                        name="first_name"
                        
                      />
                      {errors.first_name && touched.first_name && (
                        <div className="invalid-feedback d-block">
                          {errors.first_name}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.last_name" />
                      </Label>
                      <Field
                        className="form-control"
                        name="last_name"
                        
                      />
                      {errors.last_name && touched.last_name && (
                        <div className="invalid-feedback d-block">
                          {errors.last_name}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.phone" />
                      </Label>
                      <Field
                        className="form-control"
                        name="phone"
                        
                      />
                      {errors.phone && touched.phone && (
                        <div className="invalid-feedback d-block">
                          {errors.phone}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.confirm_password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="confirm_password"
                      />
                      {errors.confirm_password && touched.confirm_password && (
                        <div className="invalid-feedback d-block">
                          {errors.confirm_password}
                        </div>
                      )}
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                      <NavLink to={`/user/login`}>
                        <IntlMessages id="user.account-question" />
                      </NavLink>
                      <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.props.loading ? "show-spinner" : ""}`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><IntlMessages id="user.register-button" /></span>
                      </Button>
                    </div>


                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    registerUser
  }
)(Register);
