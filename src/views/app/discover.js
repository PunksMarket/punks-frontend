import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, Row, Card, CardBody, Button, Badge, Input } from "reactstrap";
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
      isModal: false,
      dataIndex: -1,
      search: '',
    }
  }
  async componentDidMount() {
    await this.fetchAllCards();
    this.setState({ loading: false });
  }
  fetchAllCards = async () => {
    try {
      const { address } = this.props;
      const { id, mode } = this.props.match.params;
      const { search } = this.state;

      if (!id) return;
      const res = await Api.GetRequest('/card/collectionId', { id, mode, address, search });
      if (res) {
        this.setState({
          data: res.data.data.result,
          user: res.data.data.userId
        });
      }
    } catch (error) {
      console.log(error);
    }
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
    // console.log('tokenId :>> ', tokenId);
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
    const { total, data, txHash, user, isModal, dataIndex } = this.state;
    let dataItem = null;
    if (dataIndex >= 0) {
      dataItem = data[dataIndex];
    }
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.collection" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx md="3">
            <Input
              placeholder="Search..."
              onChange={e => this.setState({ search: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  this.fetchAllCards();
                }
              }}
            />
          </Colxx>
          <Colxx md="1">
            <Button size="sm" color="primary" onClick={() => this.fetchAllCards()}>Search</Button>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Row>
              {
                data && data.length > 0 ?
                  (data.map((item, index) => {
                    return (<Colxx xxs="12" xs="6" md="4" lg="3" key={index}>
                      <Card className="mb-2 card-media">
                        <CardBody>
                          <div
                            className="d-flex justify-content-center align-items-center mb-2 cursor-pointer card-media-content"
                            style={{ height: "250px", backgroundColor: "transparent" }}
                            onClick={() => this.setState({ dataIndex: index, isModal: true })}
                          >
                            {
                              item.ext === 0 ?
                                (<ReactImageAppear
                                  src={`https://ipfs.io/ipfs/${item.dataLink}`}
                                  className="img-thumbnail mw-100 mh-100"
                                />) :
                                (<video src={`https://ipfs.io/ipfs/${item.dataLink}`} loop autoPlay className=" mw-100 mh-100" />)
                            }
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

        <Modal isOpen={isModal} size="md">
          <ModalHeader toggle={() => this.setState({ isModal: false })}>Card Detail</ModalHeader>
          <ModalBody>
            <Card className="mb-2">
              <CardBody>
                <div
                  className="d-flex justify-content-center align-items-center mb-2"
                  style={{ height: "500px", backgroundColor: "transparent" }}
                >
                  {
                    dataItem ? dataItem.ext === 0 ?
                      (<ReactImageAppear
                        src={`https://ipfs.io/ipfs/${dataItem.dataLink}`}
                        className="img-thumbnail mw-100 mh-100"
                      />) :
                      (<video src={`https://ipfs.io/ipfs/${dataItem.dataLink}`} loop autoPlay className=" mw-100 mh-100" />)
                      : ""
                  }
                </div>
                <h4>Name: <strong>{dataItem && dataItem.title}</strong></h4>
                <h4>Description: <strong>{dataItem && dataItem.description}</strong></h4>
                <h4>Sold Out/Total: <strong>{dataItem && dataItem.soldOut}/{dataItem && dataItem.totalSupply}</strong></h4>
                <h4>Price: <strong>{dataItem && dataItem.price}</strong></h4>
                {
                  dataItem ?
                    (user && user === dataItem.userId ?
                      (<Button color="primary" size="lg" onClick={() => this.handleCardRemove(dataItem.tokenId, dataItem.cardId)}>Remove</Button>) :
                      mode === 'general' ?
                        (<Button color="primary" size='lg' onClick={() => { this.handleBuy(dataIndex) }}>Buy</Button>) :
                        (<Badge>{dataItem.status}</Badge>)) : ""
                  // (<Badge>My Own Card</Badge>)                              
                }
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(DiscoverPage);
