import React, { Fragment, PureComponent } from "react";
import { Row } from "reactstrap";
// import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IconCard from "../../../components/cards/IconCard";
import { Link } from "react-router-dom";
import { URL_APP_PREFIX } from "../../../constants/defaultValues";
import { connect } from "react-redux";
// import { dashboard } from "../../../redux/actions";

class Start extends PureComponent {

    componentDidMount() {
        // this.props.dashboard();//{}, this.props.history);
    }

    render() {
        const { dashboard_data } = this.props;

        //   console.log('dashboard_data',dashboard_data.partner);

        // const data = [
        //     {
        //         title: 'dashboards.users',
        //         icon: "iconsminds-user", value: dashboard_data ? dashboard_data.user_count : 0,
        //         //    'link': `/${URL_APP_PREFIX}/manage/users`
        //     },
        //     {
        //         title: 'dashboards.cars',
        //         icon: "iconsminds-car",
        //         value: dashboard_data ? dashboard_data.car_count : 0,
        //         //   'link': `/${URL_APP_PREFIX}/manage/partner-requests`
        //     },
        //     {
        //         title: 'dashboards.today',
        //         icon: "iconsminds-basket-coins",
        //         value: dashboard_data ? dashboard_data.today_count : 0,
        //         //   'link': `/${URL_APP_PREFIX}/orders`
        //     },
        //     {
        //         title: 'dashboards.tomorrow',
        //         icon: "iconsminds-basket-coins",
        //         value: dashboard_data ? dashboard_data.tomorrow_count : 0,
        //         //   'link': `/${URL_APP_PREFIX}/manage/toursAll`
        //     },
        //     {
        //         title: 'dashboards.week',
        //         icon: "iconsminds-basket-coins",
        //         value: dashboard_data ? dashboard_data.week_count : 0,
        //         // 'link': `/${URL_APP_PREFIX}/manage/toursAll`
        //     },
        //     {
        //         title: 'dashboards.month',
        //         icon: "iconsminds-basket-coins",
        //         value: dashboard_data ? dashboard_data.month_count : 0,
        //         // 'link': `/${URL_APP_PREFIX}/manage/toursAll`
        //     },
        // ];
          const data = [];
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb
                            heading="menu.dashboard"
                            match={this.props.match}
                        />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx lg="12" xl="6" >
                        {/* <Colxx className="mb-4 icon-cards-row"> */}
                        <div className='d-flex flex-wrap mb-4 icon-cards-row'>
                            {
                                data && data.map((item, index) => {
                                    return (
                                        <div key={`icon_card_${index}`} style={{ width: '206px',padding : "6px" }}>
                                            {
                                                (item.link && item.link.length > 0) ?
                                                    <Link to={item.link}>

                                                        <IconCard {...item} />
                                                    </Link>
                                                    :
                                                    <IconCard {...item} />
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Row>
                            <Colxx md="12" className="mb-4">
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    // console.log("sttare in dashboard-=================", state.user);
    return {
        // loading: state.dashboard.loading,
        dashboard_data: state.user.dashboard_data,
    };
};

export default connect(
    mapStateToProps,
    {
        // dashboard
    },
)(Start);