import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Row, Col, Card, CardTitle, CardBody, Badge } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from 'moment';

import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import { NotificationManager } from '../../components/common/react-notifications';
import Breadcrumb from "../../containers/navs/Breadcrumb";
import * as Api from "../../utils/api";
import extractErrors from '../../utils/error';

class CollectionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: []
    }
  }

  componentDidMount() {
    this.fetchAllCollections();
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fetchAllCollections = async () => {
    try {
      const { address } = this.props;
      const res = await Api.GetRequest('/collection/all', { address });
      this.setState({
        collections: res.data.data.result,
        user: res.data.data.userId
      });
    } catch (error) {
      const errorMsg = extractErrors(error);
      console.log(errorMsg[0]);
    }
  }

  render() {
    const { collections, user } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.my-collections" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <CardTitle className="mb-4 ml-4">
            All Collections
          </CardTitle>
        </Row>
        <Row className="mb-4">
          {
            collections && collections.length > 0 ?
              (collections.map((item, index) => {
                return (
                  <Colxx xxs="12" xs="6" md="4" lg="3" key={index}>
                    <Link to={`/app/collection/${item.id}/general`}>
                      <Card className="mb-2">
                        <CardBody>
                          <div>
                            <h5>{item.name}</h5>
                          </div>
                          <div>{moment(item.createdAt).format("MM/DD/YYYY hh:mm")}</div>
                          <div>{item.tokenCount} tokens</div>
                          {user && user === item.userId ? (<Badge>My collection</Badge>) : ""}
                        </CardBody>
                      </Card>
                    </Link>
                  </Colxx>)
              })) :
              ""
          }
        </Row>
      </Fragment >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(CollectionsPage);
