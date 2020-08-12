import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Label, Row } from 'reactstrap';
import {
    Colxx,
    Separator,
} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import IconCardTable from '../../../components/cards/IconCardTable';
import { Form, Formik, Field } from 'formik';
import { adminProfile, addUpdateAdminProfile } from '../../../redux/actions';
import { connect } from 'react-redux';

class AddSubadmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {},
        }
    }

    componentDidMount() {
        var user_id = localStorage.getItem('user_id');
        console.log("user_id", user_id)
        this.props.adminProfile({ id: user_id });

    }

    validateEmail = (value) => {
        let error = {};
        if (!value) {
            error.email = "Please enter your email address";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error.email = "Invalid email address";
        }
        this.setState({
            error: error
        })
    }

    update = values => {
        if (this.validate(values)) {
            console.log("valeus", values)
            this.props.addUpdateAdminProfile(values, this.props.history)
            setTimeout(()=>{
                var user_id = localStorage.getItem('user_id');
                console.log("user_id", user_id)
                this.props.adminProfile({ id: user_id });
            },1000);
        }
    }

    validate = values => {
        let formIsValid = true, error = {};
        if (!values.name) {
            formIsValid = false;
            error.name = "Please Enter Name";
        }
        if (!values.last_name) {
            formIsValid = false;
            error.last_name = "Please Enter Last Name";
        }
        if (!values.email) {
            formIsValid = false;
            error.email = "Please Enter Email"
        }
        if (!values.phone) {
            formIsValid = false;
            error.phone = "Please Enter Mobile Number"
        }
        // if(values.phone){
        //     var number = Number.isInteger(values.phone);
        //     if(number === false){
        //         formIsValid = false;
        //         error.phone = "Please Enter Valid Mobile Number";
        //     }
        // }
        this.setState({
            error: error
        });
        return formIsValid;
    }

    render() {
        const { loading, profile } = this.props;
        const { error } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb
                            heading="menu.profile"
                            match={this.props.match}
                        />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <IconCardTable
                            title={'profile.edit'}
                        >
                            {!loading ? (
                                <Formik
                                    initialValues={{
                                        id: profile ? profile._id : "",
                                        name: profile ? profile.first_name : "",
                                        email: profile ? profile.email : "",
                                        phone: profile ? profile.phone : "",
                                        last_name: profile ? profile.last_name : ""
                                    }}
                                    onSubmit={this.update}
                                >
                                    {({ errors, touched, values }) => (
                                        <Form className="av-tooltip tooltip-label-right location-form">
                                            <FormGroup>
                                                <Label>
                                                    Name
                                                </Label>
                                                <Field
                                                    className="form-control"
                                                    name="name"
                                                />
                                                {error.name &&
                                                    touched.name && (
                                                        <div className="invalid-feedback d-block">
                                                            {error.name}
                                                        </div>
                                                    )}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>
                                                    Last Name
                                                </Label>
                                                <Field
                                                    className="form-control"
                                                    name="last_name"
                                                />
                                                {error.last_name &&
                                                    touched.last_name && (
                                                        <div className="invalid-feedback d-block">
                                                            {error.last_name}
                                                        </div>
                                                    )}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>
                                                    Email
                                                </Label>
                                                <Field
                                                    className="form-control"
                                                    name="email"
                                                    validate={this.validateEmail}
                                                    disabled
                                                />
                                                {error.email &&
                                                    touched.email && (
                                                        <div className="invalid-feedback d-block">
                                                            {error.email}
                                                        </div>
                                                    )}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>
                                                    Mobile
                                                </Label>
                                                <Field
                                                    className="form-control"
                                                    name="phone"
                                                    type="number"
                                                />
                                                {error.phone &&
                                                    touched.phone && (
                                                        <div className="invalid-feedback d-block">
                                                            {error.phone}
                                                        </div>
                                                    )}
                                            </FormGroup>


                                            <Button
                                                color="outline-primary"
                                                className=""
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                            {/* <NavLink to={`/app/profile`}>
                                                <Button
                                                    color="outline-primary"
                                                    className="ml-2"
                                                    type="button"
                                                >
                                                    Cancel
                                                </Button>
                                            </NavLink> */}
                                        </Form>
                                    )}
                                </Formik>
                            ) : null}
                        </IconCardTable>
                    </Colxx>
                </Row>
            </Fragment>
        )
    };

};

const mapStateToProps = ({ user }) => {
    return {
        loading: user.loading,
        profile: user.profile
    };
};

export default connect(
    mapStateToProps,
    {
        adminProfile,
        addUpdateAdminProfile
    },
)(AddSubadmin);