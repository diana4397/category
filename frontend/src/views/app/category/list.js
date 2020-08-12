import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';
import {
    Colxx,
    Separator,
} from '../../../components/common/CustomBootstrap';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { categorylist } from '../../../redux/actions';
import IntlMessages from '../../../helpers/IntlMessages';
import { defaultPageSize } from '../../../constants/defaultValues';
import DataTablePagination from '../../../components/DatatablePagination';
import { NotificationManager } from "../../../components/common/react-notifications";

function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined
        ? String(row[id].toLowerCase()).indexOf(filter.value.toLowerCase()) >= 0
        : true;
}

class categoryList extends Component{
    constructor(props){
        super(props);
        this.state = {
            error : {}
        } 
    }

    componentDidMount(){
        this.props.categorylist();
    }
    dataTableColumns = [
        {
            Header: 'Name',
            accessor: 'name',
            Cell: props => <p className="list-item-heading">{props.value}</p>,
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: props => (
                <p className="list-item-heading">
                    {props.value ? (
                        <b className="text-success">Active</b>
                    ) : (
                            <b className="text-danger">Inactive</b>
                        )}
                </p>
            ),
            filterable: false,
        },
        {
            Header: <div style={{ textAlign: 'right' }}>Actions</div>,
            accessor: 'status', width: 200,
            Cell: row => (
                <div style={{ textAlign: 'right' }}>
                    {/* <NavLink to={`/app/role/edit/` + row.value}>
                        <i
                            title="Edit"
                            className="simple-icon-pencil edit-icon btn-sm btn-primary" style={{padding: "0.35rem" , fontSize:"20px"}}
                        />
                    </NavLink> */}

                    {row.original.user_type === 1 ? "" : <div>
                        <i
                            title="Edit"
                            onClick={() => this.handleEdit(row)}
                            className="simple-icon-pencil edit-icon btn-sm btn-primary" style={{ padding: "0.20rem", fontSize: "20px",margin : "5px" }}
                        />
                        {/* <i
                            title="Active"
                            onClick={() => this.handleStatus(row, 1)}
                            className="simple-icon-check active-icon  btn-sm btn-primary" style={{ padding: "0.20rem", fontSize: "20px",margin : "5px" }}
                        />
                        <i
                            title="Inactive"
                            onClick={() => this.handleStatus(row, 0)}
                            className="simple-icon-close inactive-icon btn-sm btn-primary" style={{ padding: "0.20rem", fontSize: "20px",margin : "5px" }}
                        /><i
                            title="Delete"
                            onClick={() => this.handleStatus(row, 2)}
                            className="simple-icon-trash delete-icon btn-sm btn-primary" style={{ padding: "0.20rem", fontSize: "20px",margin : "5px" }}
                        /> */}
                        </div>
                        }

                </div>
            ),
            filterable: false,
            sortable: false
        },
    ];
    handleEdit = row =>{
        this.props.history.push('/app/category/edit/'+row.original.id);
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
        if (this.props.car_type_status_msg && prevProps.car_type_status_msg !== this.props.car_type_status_msg) {
            NotificationManager.success(
                this.props.car_type_status_msg,
                "Category Status",
                3000,
                null,
                null,
                ''
            );
        }
    }

    render(){
        const { match, category_list } = this.props;
        return (
            <Fragment>
                {this.props.loading && this.state.userloading === false ? (
                    <div className="loader-block">
                        <div className="loader" />
                    </div>
                ) : null}
                {this.state.userloading ? (
                    <div className="loader-block">
                        <div className="loader" />
                    </div>
                ) : null}

                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.category" match={match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="category.list" />
                                    <Link to={`${match.path}create`}>
                                        <button className="btn-sm float-right btn btn-outline-primary">
                                            <IntlMessages id="form.add" />
                                        </button>
                                    </Link>
                                </CardTitle>
                                <ReactTable
                                    minRows={0}
                                    noDataText="No records found"
                                    data={category_list}
                                    columns={this.dataTableColumns}
                                    defaultPageSize={defaultPageSize}
                                    filterable={true}
                                    defaultFilterMethod={
                                        filterCaseInsensitive
                                    }
                                    showPageJump={true}
                                    PaginationComponent={
                                        DataTablePagination
                                    }
                                    showPageSizeOptions={true}
                                    getTrProps={this.getTrProps}
                                />
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>
        )
    }

}
const mapStateToProps = state => {
    console.log("state category", state.category)
    return {
        category_list: state.category.category_list,
        loading: state.category.loading,
        car_type_status_msg : state.category.car_type_status_msg
    };
};
export default connect(
    mapStateToProps,  
    {
        categorylist
    },
)(categoryList);
