import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Row } from 'reactstrap';
import {
    Colxx,
    Separator,
} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { changeUserStatus, usersList } from '../../../redux/actions';
import IntlMessages from '../../../helpers/IntlMessages';
import { defaultPageSize } from '../../../constants/defaultValues';
import DataTablePagination from '../../../components/DatatablePagination';
import Auth from '../../../helpers/auth';
import { NotificationManager } from "../../../components/common/react-notifications";

function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined
        ? String(row[id].toLowerCase()).indexOf(filter.value.toLowerCase()) >= 0
        : true;
}

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalBack: false,
            userloading: false,
            backdrop: true,
            id: '',
            row: '',
        };
    }

    dataTableColumns = [
        // {
        //     Header: <IntlMessages id="table.header-id" />,
        //     accessor: 'user_id',
        //     Cell: props => <p className="list-item-heading">{props.value}</p>,
        //     filterable: false,
        // },
        // {
        //     Header: 'Profile Picture',
        //     accessor: 'profile_pic',
        //     Cell: props =>
        //         props.value ? (
        //             <img
        //                 alt="Thumbnail"
        //                 src={props.value}
        //                 className="list-thumbnail list-imgs responsive border-0"
        //             />
        //         ) : null,
        //     filterable: false,
        //     sortable: false,
        // },
        {
         //   Header: 'First Name',
          //  accessor: 'full_name',
          //  Cell: props => <p className="list-item-heading">{props.value}</p>,
          columns: [
            {
              id: "fullname",
              Header: "Full Name",
              accessor: row => `${row.first_name} ${row.last_name}`,
              filterMethod: (filter, row) =>
                row._original.first_name.startsWith(filter.value) ||
                row._original.last_name.startsWith(filter.value),
                width: 200  
            }
          ],    
        },
        // {
        //     Header: 'Last Name',
        //     accessor: 'last_name',
        //     Cell: props => <p className="list-item-heading">{props.value}</p>,
        // },
        {
            Header: 'Email',
            accessor: 'email',          
            Cell: props => <p className="list-item-heading">{props.value}</p>,
        },
        {
            Header: 'Phone',
            accessor: 'mobile_number',          
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
            Header: 'Verified',
            accessor: 'is_verified',
            Cell: props => (
                <p className="list-item-heading">
                    {props.value === 1 ? (
                        <b className="text-success">Verified</b>
                    ) : (
                        <b className="text-danger">Not Verified</b>
                    )}
                </p>
            ),
            filterable: false,
        },
        {
            Header: <div style={{ textAlign: 'right' }}>Actions</div>,
            accessor: 'status', width:150,
            Cell: row => (
                <div style={{ textAlign: 'right' }}>
                    
                    {row.original.user_type === 1 ? "":<div> <i
                        title="Active"
                        onClick={() => this.handleStatus(row,1)}
                        className="simple-icon-check active-icon  btn-sm btn-primary" style={{padding: "0.35rem", fontSize:"20px",margin : "5px"}}
                    /><i
                        title="Inactive"
                        onClick={() => this.handleStatus(row,0)}
                        className="simple-icon-close inactive-icon btn-sm btn-primary" style={{padding: "0.35rem", fontSize:"20px",margin : "5px"}}
                    /><i
                        title="Delete"
                        onClick={() => this.handleStatus(row,2)}
                        className="simple-icon-trash delete-icon btn-sm btn-primary" style={{padding: "0.35rem" , fontSize:"20px",margin : "5px"}}
                    /></div>}
                   
                </div>
            ),
            filterable: false,
            sortable: false
        },
    ];

    componentDidMount() {
        this.props.usersList({ user_id: Auth().UserId() });
    }

    handleStatus(row,indec) {
        this.setState(prevState=>({
            userloading: !prevState.userloading,
        }))
        // console.log("row original status",row.original.status)
        let status = indec;
        this.props.users_list[row.index]['status'] = Number(status);
        this.props.changeUserStatus(
            { id: row.original.id, status: Number(status) },
            this.props.history,
        );
        setTimeout(() => {
            this.props.usersList({ user_id: Auth().UserId() });
        }, 1000);

        setTimeout(() => {
            this.setState(prevState=>({
                userloading: !prevState.userloading,
            }))
        }, 3000);
    }
    getTrProps = (state, rowInfo, instance) => {
        if (rowInfo) {
            if(rowInfo.row.status === 0){
          return {
            
            style: {
              background: 'lightgray' ,
              //color: 'white'
            }
          }
        }
        }
        return {};
      }

      componentDidUpdate(prevProps, prevState) {
        if (this.props.error && prevProps.user_msg.message !== this.props.error) {
          NotificationManager.warning(
            this.props.error,
            "User Error",
            3000,
            null,
            null,
            ''
          );
        }
        if(this.props.user_msg.message && prevProps.user_msg.message !==this.props.user_msg.message){
            NotificationManager.success(
                this.props.user_msg.message,
                "User Status",
                3000,
                null,
                null,
                ''
              );
        }
      }
    render() {
        const { match, users_list } = this.props;
        // console.log("user listttttt",users_list)
        return (
            <Fragment>
                {this.props.loading && this.state.userloading === false ? (
                    <div className="loader-block">
                        <div className="loader" />
                    </div>
                ): null }
                {this.state.userloading ? (
                    <div className="loader-block">
                        <div className="loader" />
                    </div>
                ): null }
                
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.user" match={match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="users.list" />
                                </CardTitle>
                                <ReactTable
                                    minRows={0}
                                    noDataText="No records found"
                                    data={users_list}
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
        );
    }
}

const mapStateToProps = state => {
    console.log("state usersa",state.user)
    return {
        users_list: state.user.usersList,
        loading: state.user.loading,
        user_msg : state.user.user
    };
};
export default connect(
    mapStateToProps,
    {
        usersList,
        changeUserStatus,
    },
)(Users);
