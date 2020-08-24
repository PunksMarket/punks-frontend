import React, { Component, Fragment } from "react";
import { CardText, CardSubtitle, Row, Card, CardBody, CardImg, Button } from "reactstrap";
import Switch from "rc-switch";
import { NotificationManager } from '../../components/common/react-notifications';
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import ReactImageAppear from 'react-image-appear';

const { punks } = require('../../modules/crypto');
const { punksContract } = require('../../modules/crypto/contracts');

export default class DiscoverPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      data: [],
      categorySwitch: true,
      txHash: '',
      loading: true,
    }
  }
  async componentDidMount() {
    try {
      await this.getAllTokenData();
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
  }
  getAllTokenData = async () => {
    try {
      const { total, data } = await punks.getAllTokenList();
      this.setState({
        total, data
      })
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { total, data, txHash } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.collections" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              {txHash && (<a href={txHash} target="_blank" without="true" rel="noopener noreferrer">Please click here to see transaction hash</a>)}
            </div>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Row>
              {
                total > 0 ?
                  (data.map((item, index) => {
                    return (<Colxx xxs="12" xs="6" md="4" lg="3" key={index}>
                      <Card className="mb-2">
                        <CardBody>
                          <div className="d-flex justify-content-center align-items-center mb-2" style={{ height: "250px", backgroundColor: "transparent" }}>
                            <ReactImageAppear
                              src={`https://ipfs.io/ipfs/${item.dataLink}`}
                              className="img-thumbnail mw-100 mh-100"
                            />
                          </div>
                          <div>Name: <strong>{item.title}</strong></div>
                          <div>Description: <strong>{item.description}</strong></div>
                          <div>Sold Out/Total: <strong>{item.soldOut}/{item.totalSupply}</strong></div>
                          <div>Price: <strong>{item.price}</strong></div>
                        </CardBody>
                      </Card>
                    </Colxx>)
                  })) :
                  "No data to show"
              }
            </Row>
          </Colxx>
        </Row>
      </Fragment>
    )
  }
}
