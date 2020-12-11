import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Row, Col, Card, CardTitle, CardBody, Badge, Alert, Input, Button } from "reactstrap";
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
      collections: [],
      isMobile: false,
      loading: true,
      search: '',
    }
  }

  componentDidMount() {
    this.mobileAndTabletCheck();
    this.fetchAllCollections();
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fetchAllCollections = async () => {
    try {
      const { address } = this.props;
      const { search } = this.state;
      const res = await Api.GetRequest('/collection/all', { address, search });
      this.setState({
        collections: res.data.data.result,
        user: res.data.data.userId,
        loading: false
      },() => {
        console.log("Collection Cards Res => ",this.state.collections[1].cards);
      });
    } catch (error) {
      const errorMsg = extractErrors(error);
      console.log(errorMsg[0]);
      this.setState({
        loading: false
      });
    }
  }

  mobileAndTabletCheck = () => {
    let isMobile = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true; })(navigator.userAgent || navigator.vendor || window.opera);
    this.setState({ isMobile });
  };

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { collections, user, isMobile } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.collections" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {
          isMobile ?
            (<Row>
              <Colxx xxs="12">
                <Alert color="danger" className="rounded text-center">
                  <div className="text-center">
                    CypherPunks Mobile Version is coming soon
                  </div>
                </Alert>
              </Colxx>
            </Row>) : ""
        }
        <Row className="mb-4">
          <Colxx md="3">
            <Input
              placeholder="Search Name"
              onChange={e => this.setState({ search: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  this.fetchAllCollections();
                }
              }}
            />
          </Colxx>
          <Colxx md="1">
            <Button size="sm" color="primary" onClick={() => this.fetchAllCollections()}>Search</Button>
          </Colxx>
        </Row>
        <Row className="mb-4">
          {
            collections && collections.length > 0 ?
              (collections.map((item, index) => {
                if (item.cards.length > 0){
                  return (
                    <Colxx xxs="12" xs="6" md="4" lg="3" key={index} >
                      <Link to={`/app/collection/${item.id}/general`}>
                        <Card className="mb-2">
                          <CardBody style={{opacity: "0.4",backgroundImage:`url('https://ipfs.io/ipfs/${item.cards[0].dataLink}')`, backgroundSize:"cover",backgroundPosition: "center top",}}>
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
                }
              }))
                 :
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
