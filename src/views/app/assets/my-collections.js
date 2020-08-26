import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Row, Col, Card, CardTitle, CardBody, FormGroup, Label, Button, ModalHeader, Modal, ModalBody, ModalFooter } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from 'moment';

import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { NotificationManager } from '../../../components/common/react-notifications';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import * as Api from "../../../utils/api";
import extractErrors from '../../../utils/error';

const items = ['name'];

const collectionSchema = Yup.object().shape({
  name: Yup.string().required("Please enter the collection name").max(100, "Max length exceeded"),
});

class NewCollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      isModal: false,
      collectionId: 0,
      name: '',
      loading: true
    }
  }

  componentDidMount() {
    this.fetchCollections();
    this.setState({ loading: false })
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

  handleSubmit = async (values) => {
    const { collectionId } = this.state;
    try {
      if (this.props.address) {
        values.address = this.props.address;
        if (collectionId === 0) {
          await Api.PostRequest('/collection/create', values);
        } else {
          values.id = collectionId;
          await Api.PostRequest('/collection/rename', values);
        }
        this.fetchCollections();
        NotificationManager.success("You rename colleciton name successfully", "success", 3000, null, null, '');
      }
    } catch (error) {
      const errorMsg = extractErrors(error);
      NotificationManager.error(errorMsg[0], "error", 3000, null, null, '');
    }
    this.setState({ isModal: false });
  }

  handleCardUpdate = (id) => {
    this.setState({ isModal: true });
  }

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { collections, isModal, collectionId } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.my-collections" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <div align="right">
              <Button color="primary" size="sm" onClick={() => {
                this.setState({
                  name: '',
                  collectionId: 0,
                  isModal: true
                })
              }
              }>
                Create new collection
              </Button>
            </div>
          </Colxx>
        </Row>
        <Row className="mb-4">
          {
            collections && collections.length > 0 ?
              (collections.map((item, index) => {
                return (
                  <Colxx xxs="12" xs="6" md="4" lg="3" key={index}>
                    <Card className="mb-2">
                      <CardBody>
                        <div onClick={() => { this.props.history.push(`/app/collection/${item.id}/all`) }} className="cursor-pointer my-collection">
                          <div><h5>{item.name}</h5></div>
                          <div>{moment(item.createdAt).format("MM/DD/YYYY hh:mm")}</div>
                          <div>{item.tokenCount} tokens</div>
                        </div>
                        <hr />
                        <Button onClick={() => this.setState({ isModal: true, name: item.name, collectionId: item.id })} color="primary" size="sm">Rename</Button>
                      </CardBody>
                    </Card>
                  </Colxx>)
              })) :
              ""
          }
        </Row>

        <Modal isOpen={isModal} size="md">
          <ModalHeader toggle={() => this.setState({ isModal: false })}>Enter new collection information</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                name: this.state.name
              }}
              enableReinitialize={true}
              validationSchema={collectionSchema}
              onSubmit={this.handleSubmit}>
              {({
                errors,
                touched,
              }) => (
                  <Form className="av-tooltip tooltip-label-right">
                    <Row>
                      {
                        items.map((item, index) => {
                          return (
                            <Col xs="12" key={index}>
                              <FormGroup className="error-l-75">
                                <Label>{this.Capitalize(item)}</Label>
                                <Field
                                  className="form-control"
                                  name={item}
                                  type="text"
                                />
                                {errors[item] && touched[item] ? (<div className="invalid-feedback d-block">{errors[item]}</div>) : null}
                              </FormGroup>
                            </Col>
                          )
                        })
                      }
                    </Row>
                    <div align="right">
                      <Button color="primary" type="submit" size="sm"
                        className={`btn-shadow btn-multiple-state ${
                          false ? "show-spinner" : ""
                          }`}>
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">
                          {
                            collectionId === 0 ? "Create" : "Update"
                          }
                        </span>
                      </Button>
                    &nbsp;
                    <Button color="primary" size="sm" onClick={() => this.setState({ isModal: false })}>Close</Button>
                    </div>
                  </Form>
                )}
            </Formik>
          </ModalBody>
        </Modal>
      </Fragment >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(NewCollectionPage);
