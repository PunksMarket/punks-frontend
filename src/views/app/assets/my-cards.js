import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";
import moment from 'moment';
import ReactImageAppear from 'react-image-appear';

import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { NotificationManager } from '../../../components/common/react-notifications';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import * as Api from "../../../utils/api";
import extractErrors from '../../../utils/error';

class MyCardsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchMyCards();
    this.setState({ loading: false })
  }

  fetchMyCards = async () => {
    const { address } = this.props;
    try {
      if (address) {
        const res = await Api.GetRequest('/card/my-cards', { address });
        this.setState({ cards: res.data.data.result });
      }
    } catch (error) {
      const errorMsg = extractErrors(error);
    }
  }

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { cards } = this.state;

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.my-cards" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-4">
          {
            cards && cards.length > 0 ?
              (cards.map((item, index) => {
                return item.card && (<Colxx xxs="12" xs="6" md="4" lg="3" key={index}>
                  <Card className="mb-2">
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center mb-2" style={{ height: "250px", backgroundColor: "transparent" }}>
                        {item.card.ext === 0 ?
                          (<ReactImageAppear
                            src={`https://ipfs.io/ipfs/${item.card.dataLink}`}
                            className="img-thumbnail mw-100 mh-100"
                          />) :
                          (<video src={`https://ipfs.io/ipfs/${item.card.dataLink}`} loop autoPlay className=" mw-100 mh-100" />)
                        }
                      </div>
                      <div>Name: <strong>{item.card.title}</strong></div>
                      <div>Description: <strong>{item.card.description}</strong></div>
                      <div>Price: <strong>{item.card.price}</strong></div>
                      <div>Amount: <strong>{item.amount}</strong></div>
                      <div>Date: <strong>{moment(item.createdAt).format("MM/DD/YYYY hh:mm")}</strong></div>
                      {
                        item.card.deletedAt ? (<Badge>Card Deleted</Badge>) : ""
                      }
                    </CardBody>
                  </Card>
                </Colxx>)
              })) :
              "No data to show"
          }
        </Row>
      </Fragment >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(MyCardsPage);
