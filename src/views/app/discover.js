import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { CardText, CardSubtitle, Row, Card, CardBody, CardImg, Button, Badge } from "reactstrap";
import Switch from "rc-switch";
import { NotificationManager } from '../../components/common/react-notifications';
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import ReactImageAppear from 'react-image-appear';
import * as Api from '../../utils/api';

const { punks } = require('../../modules/crypto');
const { punksContract } = require('../../modules/crypto/contracts');

class DiscoverPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      data: [],
      txHash: '',
      user: -1,
      loading: true,
    }
  }
  async componentDidMount() {
    try {
      const { address } = this.props;
      const { id, mode } = this.props.match.params;

      if (!id) return;
      const res = await Api.GetRequest('/card/collectionId', { id, mode, address });
      if (res) {
        this.setState({
          data: res.data.data.result,
          user: res.data.data.userId
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
  }
  checkEthereum = () => {
    if (typeof window.ethereum === 'undefined') {
      NotificationManager.warning('Please install metamask.', 'warning', 3000, null, null, '');
      return false;
    }
    if (window.ethereum.networkVersion !== '3') {
      NotificationManager.warning('Please select ropsten testnet to proceed.', 'warning', 3000, null, null, '');
      return false;
    }
    const { address } = this.props;
    if (!address) {
      NotificationManager.warning('Please connect to your metamask account.', 'warning', 3000, null, null, '');
      return false;
    }
    return true;
  }
  handleBuy = async (index) => {
    if (!this.checkEthereum()) {
      return;
    }
    const { address } = this.props;

    const { data } = this.state;
    const web3 = window.web3;
    if (web3 && address) {
      window.ethereum.enable()
        .then(async (res) => {
          const encodedABI = punksContract.contract.methods["buy"](data[index].tokenId, 1).encodeABI();
          const gasPrice = await web3.eth.getGasPrice();

          const wei = web3.utils.toWei(data[index].price.toString(), 'ether');

          const tx = {
            to: punksContract.address,
            value: wei,
            gas: 4000000,
            gasPrice: gasPrice,
            chainId: 3,
            from: address,
            data: encodedABI,
          };
          web3.eth.sendTransaction(tx)
            .once('transactionHash', async (hash) => {
              console.log('hash :>> ', hash);
              await Api.PostRequest('/transaction/create', { address, txHash: hash, type: 'Buy' });
              NotificationManager.success('You requested to buy card', "Success", 3000, null, null, '');
            })
            .once('receipt', receipt => { })
            .catch((err) => { });
        })
        .catch(error => {
        });
    }
  }
  handleCardEdit = async (tokenId, cardId) => {
    console.log('tokenId :>> ', tokenId);
  }
  handleCardRemove = async (tokenId, cardId) => {
    if (!this.checkEthereum()) {
      return;
    }
    const { address } = this.props;

    const { data } = this.state;
    const web3 = window.web3;
    if (web3 && address) {
      window.ethereum.enable()
        .then(async (res) => {
          const encodedABI = punksContract.contract.methods["burn"](address, tokenId).encodeABI();
          const gasPrice = await web3.eth.getGasPrice();
          const tx = {
            to: punksContract.address,
            value: 0,
            gas: 4000000,
            gasPrice: gasPrice,
            chainId: 3,
            from: address,
            data: encodedABI,
          };
          web3.eth.sendTransaction(tx)
            .once('transactionHash', async (hash) => {
              console.log('hash :>> ', hash);
              await Api.PostRequest('/transaction/create', { address, txHash: hash, type: 'Burn' });
              NotificationManager.success('You requested to delete card', "Success", 3000, null, null, '');
            })
            .once('receipt', receipt => { console.log('receipt :>> ', receipt); })
            .catch((err) => { });
        })
        .catch(error => {
          console.log('error :>> ', error);
        });
    }
  }

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { mode } = this.props.match.params;
    const { total, data, txHash, user } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.collection" match={this.props.match} />
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
                data && data.length > 0 ?
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
                          {
                            user && user === item.userId ?
                              (<Button color="primary" size="sm" onClick={() => this.handleCardRemove(item.tokenId, item.cardId)}>Remove</Button>) :
                              mode === 'general' ?
                                (<Button color="primary" size='sm' onClick={() => { this.handleBuy(index) }}>Buy</Button>) :
                                (<Badge>{item.status}</Badge>)
                            // (<Badge>My Own Card</Badge>)                              
                          }
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

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(DiscoverPage);
