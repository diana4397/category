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
import { content } from '../../../redux/actions';
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

class contentList extends Component{
    constructor(props){
        super(props);
        this.state = {
            error : {}
        } 
    }

    componentDidMount(){
        this.props.content();
    }
    dataTableColumns = [
        {
            Header: 'Document',
            accessor: 'document',
            Cell: props => <img className="list-item-heading" src={props.value} style={{
            width: "100px",
            height: "100px"}}/>,
        },
        {
            Header: 'Content',
            accessor: 'content',
            Cell: props => <p className="list-item-heading">{props.value}</p>,
        },
        {
            Header: 'Category Name',
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

                    {row.original.user_type === 1 ? "" : <div>
                        <i
                            title="Edit"
                            onClick={() => this.handleEdit(row)}
                            className="simple-icon-pencil edit-icon btn-sm btn-primary" style={{ padding: "0.20rem", fontSize: "20px",margin : "5px" }}
                        />
                        </div>
                        }

                </div>
            ),
            filterable: false,
            sortable: false
        },
    ];
    handleEdit = row =>{
        this.props.history.push('/app/content/edit/'+row.original.id);
    }
    handleStatus(row, indec) {
        this.setState({
            userloading: true
        })
        // console.log("row original status",row.original.status)
        let status = indec;
        this.props.content_list[row.index]['status'] = Number(status);
        this.props.changecontentStatus(
            { id: row.original.id, status: Number(status) },
            this.props.history,
        );
        setTimeout(() => {
            this.props.content();
        }, 1000);

        setTimeout(() => {
            this.setState({
                userloading: false
            })
        }, 3000);
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
        const { match, content_list } = this.props;
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
                        <Breadcrumb heading="menu.content" match={match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="content.list" />
                                    <Link to={`${match.path}create`}>
                                        <button className="btn-sm float-right btn btn-outline-primary">
                                            <IntlMessages id="form.add" />
                                        </button>
                                    </Link>
                                </CardTitle>
                                <ReactTable
                                    minRows={0}
                                    noDataText="No records found"
                                    data={content_list}
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
    console.log("state content", state.content)
    return {
        content_list: state.content.contentList,
        loading: state.content.loading,
        car_type_status_msg : state.content.car_type_status_msg
    };
};
export default connect(
    mapStateToProps,  
    {
        content
    },
)(contentList);
