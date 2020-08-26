import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, FormGroup, Label, Button } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { NotificationManager } from '../../../components/common/react-notifications';
import { FormikReactSelect } from "../../../containers/form-validations/FormikFields";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as Api from "../../../utils/api";
import extractErrors from '../../../utils/error';

const config = require('../../../config');
const BigNumber = require('bignumber.js');
const { punks } = require('../../../modules/crypto');
const { punksContract } = require('../../../modules/crypto/contracts');
const { ipfs } = require('../../../modules/ipfs');

const RegisterSchema = Yup.object().shape({
  dataLink: Yup.string().required("Please upload the file"),
  title: Yup.string().required("Please enter the Name").max(100, "Max length exceeded"),
  description: Yup.string().required("Please enter the description").max(1000, "Max length exceeded"),
  totalSupply: Yup.number().positive().required("Please enter the totalSupply").moreThan(0).integer().lessThan(100000),
  price: Yup.number().test('is-decimal', 'Price format is invalid', value => (value + "").match(/\d+(\.\d+)?$/)).moreThan(0.01).lessThan(99999),
  collection: Yup.object().nullable().required("Collection is required"),
});

const items = ['dataLink', 'title', 'description', 'totalSupply', 'price'];
const extesionImage = ["image/pjp", "image/jpg", "image/pjpeg", "image/jfif", "image/png", "image/jpg", "image/jpeg", "image/gif"];
const extesionVideo = ["video/ogv", "video/ogm", "video/ogg", "video/webm", "video/mp4"];
class NewCardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txHash: '',
      uploading: false,
      submitting: false,
      collections: [],
      fileData: null,
      fileExt: 0,
      ipfsHash: '',
      ipfsExt: 0,
      loading: true,
    }
  }
  componentDidMount() {
    this.fetchCollections();
    this.setState({ loading: false });
  }

  fetchCollections = async () => {
    const { address } = this.props;
    try {
      if (address) {
        const res = await Api.GetRequest('/collection/read', { address });
        this.setState({ collections: res.data.data.result });
      }
    } catch (error) {
      const errorMsg = extractErrors(error);
      console.log(errorMsg[0]);
    }
  }
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  handleFileUpload = () => {
    const { fileData, fileExt, uploading } = this.state;
    if (!fileData) {
      NotificationManager.warning("Please upload file", "Warning", 3000, null, null, '');
      return;
    }
    if (!uploading && fileData) {
      this.setState(
        { uploading: true },
        async () => {
          try {
            const result = await ipfs.add(fileData);
            this.setState({ ipfsHash: result.path, ipfsExt: fileExt, uploading: false });
          } catch (error) {
            this.setState({ uploading: false });
            NotificationManager.error("Failed to upload to ipfs", "error", 3000, null, null, '');
          }
        });
    }
  }
  handleFileChange = (event) => {
    event.stopPropagation()
    event.preventDefault()
    if (!this.state.submitting) {
      const file = event.target.files[0];
      let fileExt = 999;
      if (extesionImage.includes(file.type)) {
        fileExt = 0;
      } else if (extesionVideo.includes(file.type)) {
        fileExt = 1;
      }
      if (fileExt === 999) {
        NotificationManager.warn("Please upload image or video files", "Warning", 3000, null, null, '');
        return;
      }
      if (file) {
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader, fileExt);
      }
    }
  };
  convertToBuffer = async (reader, ext) => {
    const data = await Buffer.from(reader.result);
    this.setState({ fileData: data, fileExt: ext });
  };
  handleRegister = (values) => {
    const { submitting, ipfsExt } = this.state;
    if (this.state.submitting) {
      return;
    }

    const { address } = this.props;

    this.setState(
      { submitting: true },
      async () => {
        try {
          const web3 = window.web3;
          if (web3 && address) {
            window.ethereum.enable()
              .then(async (res) => {
                const { dataLink, title, description, totalSupply, price } = values;
                const decimalBN = new BigNumber(10).pow(config.decimals);
                const priceBN = new BigNumber(price).multipliedBy(decimalBN);

                const encodedABI = punksContract.contract.methods['safeMint'](
                  address, dataLink, title, description, totalSupply, `0x${priceBN.toString(16)}`, values.collection.id, ipfsExt
                ).encodeABI();
                const gasPrice = await web3.eth.getGasPrice();

                const tx = {
                  to: punksContract.address,
                  gas: 4000000,
                  gasPrice: gasPrice,
                  chainId: 3,
                  from: address,
                  data: encodedABI,
                };
                web3.eth.sendTransaction(tx)
                  .on('error', (err) => {
                    console.log('reject err : ', err);
                  })
                  .once('transactionHash', async (hash) => {
                    try {
                      await Api.PostRequest('/transaction/create', { address, txHash: hash, type: 'Register' });
                      NotificationManager.success("Transaction is created to register new card", "success", 3000, null, null, '');
                    } catch (err) {
                      console.log(err);
                    }
                    this.setState({ submitting: false });
                  })
                  .once('receipt', receipt => { // eslint-disable-line
                    // console.log('reciept', receipt);
                  });
              })
              .catch(error => {
                console.log('error :>> ', error);
                this.setState({ submitting: false });
              });
          }
        } catch (error) {
          console.log('error :>> ', error);
          this.setState({ submitting: false });
        }
      });
  };

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { ipfsHash, uploading, submitting, txHash, collections } = this.state;

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.new-card" match={this.props.match} />
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
          <Colxx xxs="12" className="mb-4">
            <Card>
              <CardBody>
                <h6 className="mb-4">Upload your image</h6>
                <input
                  type="file"
                  className="form-group"
                  accept="image/png,image/jpg,image/jpeg,image/gif,video/ogg,video/webm,video/mp4"
                  onChange={this.handleFileChange}
                />
                <Button color="primary" size="sm" onClick={this.handleFileUpload}
                  className={`btn-shadow btn-multiple-state ${
                    uploading ? "show-spinner" : ""
                    }`}>
                  <span className="spinner d-inline-block">
                    <span className="bounce1" />
                    <span className="bounce2" />
                    <span className="bounce3" />
                  </span>
                  <span className="label">Upload</span>
                </Button>
                {
                  ipfsHash &&
                  (<a href={`https://gateway.ipfs.io/ipfs/${ipfsHash}`} target="_blank" without="true" rel="noopener noreferrer" className="ml-2">
                    See Image
                  </a>)
                }
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <h6 className="mb-4">Enter your image information</h6>
                <Formik
                  initialValues={{
                    dataLink: ipfsHash, title: '', description: '', totalSupply: 0, price: 0, collection: null
                  }}
                  enableReinitialize={true}
                  validationSchema={RegisterSchema}
                  onSubmit={this.handleRegister}>
                  {({
                    setFieldValue, setFieldTouched, errors, touched,
                  }) => (
                      <Form className="av-tooltip tooltip-label-right">
                        <Row>
                          {
                            items.map((item, index) => {
                              return (
                                <Col xs="12" sm="6" md="4" key={index}>
                                  <FormGroup className="error-l-75">
                                    <Label>{this.Capitalize(item)}{item === "price" && " (ETH)"}</Label>
                                    <Field
                                      className="form-control"
                                      name={item}
                                      type={(item === "totalSupply" || item === "price") ? "number" : "text"}
                                      readOnly={item === "Image" ? true : false}
                                    />
                                    {errors[item] && touched[item] ? (<div className="invalid-feedback d-block">{errors[item]}</div>) : null}
                                  </FormGroup>
                                </Col>
                              )
                            })
                          }
                          <Col xs="12" sm="6" md="4">
                            <FormGroup className="error-l-75">
                              <Label>Collection</Label>
                              <FormikReactSelect
                                name="collection"
                                id="collection"
                                options={collections}
                                labelKey="name"
                                valueKey="id"
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                              />
                              {errors.collection && touched.collection ? (<div className="invalid-feedback d-block">{errors.collection}</div>) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button color="primary" type="submit"
                          className={`btn-shadow btn-multiple-state ${
                            submitting ? "show-spinner" : ""
                            }`}>
                          <span className="spinner d-inline-block">
                            <span className="bounce1" />
                            <span className="bounce2" />
                            <span className="bounce3" />
                          </span>
                          <span className="label">Submit</span>
                        </Button>
                      </Form>
                    )}
                </Formik>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(NewCardPage);