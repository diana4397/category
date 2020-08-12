import React, { Component, Fragment } from 'react';
import { Button, FormGroup, Label, Row } from 'reactstrap';
import {
    Colxx,
    Separator,
} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import IconCardTable from '../../../components/cards/IconCardTable';
import { Form, Formik, Field } from 'formik';
import { categorylist,addUpdatecategory } from '../../../redux/actions';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from "../../../components/common/react-notifications";

class Addcategory extends Component{
    constructor(props){
        super(props);
        this.state = {
            error : {}
        }
    }
    componentDidMount() {
        const { match } = this.props;
        console.log("match====>",match.params)
        if (match && match.params.id) {
            this.props.categorylist({ category_id: match.params.id });
        }
    }
    update = values => {
        if (this.validate(values)) {
            this.props.addUpdatecategory(values, this.props.history);
        }
    }

    validate = values => {
        let formIsValid = true, error = {};
        if (!values.name) {
            formIsValid = false;
            error.name = "Please Enter Name";
        }
        this.setState({
            error: error
        });
        return formIsValid;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.error && prevProps.error !== this.props.error) {
            NotificationManager.warning(
                this.props.error,
                "Category Error",
                3000,
                null,
                null,
                ''
            );
        }
    }

    render(){
        const { loading, category_list } = this.props;
        const { error} = this.state;
        console.log("category_list",this.props.error)
        return(
            <Fragment>
            <Row>
                <Colxx xxs="12">
                    <Breadcrumb
                        heading="menu.category"
                        match={this.props.match}
                    />
                    <Separator className="mb-5" />
                </Colxx>
            </Row>
            <Row>
                <Colxx xxs="12" className="mb-4">
                    <IconCardTable
                        title={
                            this.props.match.params.id && category_list && category_list.length > 0
                                ? 'category.edit'
                                : 'category.create'
                        }
                    >
                        {!loading ? (
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    category_id: this.props.match.params.id && category_list && category_list.length > 0 ? category_list[0].id : 0,
                                    name: this.props.match.params.id && category_list && category_list.length > 0 ? category_list[0].name : "",

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
                                        <Button
                                            color="outline-primary"
                                            className=""
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                        <NavLink to={`/app/category`}>
                                            <Button
                                                color="outline-primary"
                                                className="ml-2"
                                                type="button"
                                            >
                                                Cancel
                                            </Button>
                                        </NavLink>
                                    </Form>
                                )}
                            </Formik>
                        ) : null}
                    </IconCardTable>
                </Colxx>
            </Row>
        </Fragment>
        )
    }

} 

const mapStateToProps = ({ category }) => {
    console.log("category====>",category)
    return {
        category_list: category.category_list,
        loading: category.loading,
        error : category.error
    };
};

export default connect(
    mapStateToProps,
    {
       categorylist,
       addUpdatecategory
    },
)(Addcategory);
