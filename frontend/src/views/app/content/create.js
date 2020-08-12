import React, { Component, Fragment } from 'react';
import { FormGroup, Input, Label, Row } from 'reactstrap';
import {
    Colxx,
    Separator,
} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import IconCardTable from '../../../components/cards/IconCardTable';
import { Field, Form, Formik } from 'formik';
import { addEditcontent, categorylist , content} from '../../../redux/actions';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Select from "react-select";

import _ from "lodash";
class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            selectedFile: null,
            error : {},
            selectedOption : {},
            option : []
        };
    }

    componentDidMount() {
        const { match, history } = this.props;
        this.props.categorylist();
        if (match.params.id) {
            this.props.content({content_id : match.params.id}, history);
        }
    }

    update = values => {
        if (this.validate(values)) {
            console.log("values in update",values);
            values.action = 'post';
            const formData = new FormData();
            formData.append('content', values.content);
            formData.append('content_id', values.content_id);
            formData.append('category_id', this.state.selectedOption.value);
            if (this.state.selectedFile) {
                formData.append('images', this.state.selectedFile);
            }
            console.log("formdate=============>",formData,this.state.selectedFile);
            
            this.props.addEditcontent(formData, this.props.history);    
        }
        
    };

    isEmpty(obj) {
        // eslint-disable-next-line
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    componentWillReceiveProps(props){
        if(props.category_list && props.category_list.length  > 0){
            var opt  =[];
            props.category_list.map(e=>{
                opt.push({
                    label : e.name,
                    value : e.id
                })
            });
            this.setState({
                option : opt
            });
        }
        if(props.content_list && props.content_list.length > 0 && this.state.option.length > 0){
            var option = this.state.option;
            var index = option.find(e=> e.value === props.content_list[0].category_id);
            this.setState({selectedOption : index})
        }
    }

    validate(values) {
        let formIsValid = true;
        let errors = {};
        if (!values.content) {
            formIsValid = false;
            errors.content = 'Please enter Content';
        }
        if (_.isEmpty(this.state.selectedOption)) {
            formIsValid = false;
            errors.category = 'Please Select Category';
        }

        if (this.props.content_list && this.props.content_list.length === 0) {
            if (!this.state.selectedFile) {
                formIsValid = false;
                errors.content_image = 'Please select image';
            } else {
                let extension = this.state.selectedFile.type;

                if (
                    extension !== 'image/gif' &&
                    extension !== 'image/png' &&
                    extension !== 'image/bmp' &&
                    extension !== 'image/jpeg' &&
                    extension !== 'image/jpg'
                ) {
                    formIsValid = false;
                    errors.content_image =
                        'Only allows file types of GIF, PNG, JPG, JPEG and BMP.';
                }
            }
        } else {
            if (this.state.selectedFile !== null) {
                let extension = this.state.selectedFile.type;

                if (
                    extension !== 'image/gif' &&
                    extension !== 'image/png' &&
                    extension !== 'image/bmp' &&
                    extension !== 'image/jpeg' &&
                    extension !== 'image/jpg'
                ) {
                    formIsValid = false;
                    errors.content_image =
                        'Only allows file types of GIF, PNG, JPG, JPEG and BMP.';
                }
            }
        }
        this.setState({ error : errors });
        return formIsValid;
    };

    fileChangedHandler = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };
    handleChange = selectedOption => {
        this.setState(
        { selectedOption });
    };

    render() {
        const { content_list, loading } = this.props;
        const { error } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb
                            heading="menu.content"
                            match={this.props.match}
                        />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <IconCardTable
                            title={
                                content_list &&
                                content_list.content_id &&
                                this.props.match.params.id
                                    ? 'content.edit'
                                    : 'content.create'
                            }
                        >
                            {!loading ? (
                                <Formik
                                    // validate={this.validate}
                                    initialValues={{
                                        content_id:
                                            (content_list && content_list.length > 0 &&
                                                content_list[0].id &&
                                                this.props.match.params.id) ||
                                            null,
                                        content: this.props.match.params
                                            .id && content_list.length > 0 
                                            ? content_list[0].content
                                            : '',
                                        content_image: ''
                                    }}
                                    onSubmit={this.update}
                                >
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right">
                                            <FormGroup>
                                                <Label>Image</Label>
                                                <Row>
                                                    <Colxx
                                                        xxs="12"
                                                        sm="12"
                                                        md="12"
                                                        lg="12"
                                                    >
                                                        <Input
                                                            className="form-control w-100"
                                                            name="content_image"
                                                            type="file"
                                                            onChange={
                                                                this
                                                                    .fileChangedHandler
                                                            }
                                                        />
                                                    </Colxx>
                                                    {this.props.match.params
                                                        .id &&
                                                    content.content_image ? (
                                                        <Colxx
                                                            xxs="12"
                                                            sm="12"
                                                            md="12"
                                                            lg="12"
                                                        >
                                                            <img
                                                                alt="Thumbnail"
                                                                src={
                                                                    content.content_image
                                                                }
                                                                className="list-thumbnail list-imgs mt-3 responsive border-0"
                                                            />
                                                        </Colxx>
                                                    ) : null}
                                                </Row>
                                                {error.content_image  && (
                                                        <div className="invalid-feedback d-block">
                                                            {
                                                                error.content_image
                                                            }
                                                        </div>
                                                    )}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Name</Label>
                                                <Field
                                                    className="form-control"
                                                    name="content"
                                                    component = "textarea"
                                                />
                                                {error.content  && (
                                                        <div className="invalid-feedback d-block">
                                                            {
                                                                error.content
                                                            }
                                                        </div>
                                                    )}
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Select Category</Label>
                                                <Select
                                                  name="Category"
                                                  id="Category"
                                                  searchable={true}
                                                  onChange={this.handleChange}
                                                  options={this.state.option}
                                                  value={this.state.selectedOption}
                                                  placeholder="Select Category"
                                                  ref="Category"  
                                                />
                                                {error.category  && (
                                                        <div className="invalid-feedback d-block">
                                                            {
                                                                error.category
                                                            }
                                                        </div>
                                                    )}
                                            </FormGroup>

                                            <button
                                                className="btn btn-outline-primary"
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                            <NavLink
                                                to={`/app/content`}
                                            >
                                                <button
                                                    className="ml-2 btn btn-outline-primary"
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </NavLink>
                                        </Form>
                                    )}
                                </Formik>
                            ) : null}
                        </IconCardTable>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ content,category }) => {
    console.log("content_list",content)
    return {
        content_list: content.contentList,
        loading: content.loading,
        category_list: category.category_list
    };
};

export default connect(
    mapStateToProps,
    {
        addEditcontent,
        categorylist,
        content
    },
)(AddCategory);
