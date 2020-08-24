import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";
import DataTablePagination from '../../../components/DatatablePagination';
import moment from 'moment';
import ReactTable from 'react-table';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { NotificationManager } from '../../../components/common/react-notifications';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import * as Api from "../../../utils/api";
import extractErrors from '../../../utils/error';

class TransactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchTransactions();
    this.setState({ loading: false })
  }

  fetchTransactions = async () => {
    const { address } = this.props;
    try {
      if (address) {
        const res = await Api.GetRequest('/transaction/retrieve', { address });
        this.setState({ transactions: res.data.data.result });
      }
    } catch (error) {
      const errorMsg = extractErrors(error);
    }
  }

  getCols = () => {
    return [
      {
        Header: 'Transaction Hash',
        accessor: 'txHash',
        Cell: ({ original }) =>
          <a href={`https://ropsten.etherscan.io/tx/${original.txHash}`} target="_blank" without="true" rel="noopener noreferrer" color="primary">
            {original.txHash}
          </a>,
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ original }) => <Badge color="primary">{`${original.type}`}</Badge>,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ original }) => <Badge>{`${original.status}`}</Badge>,
      },
      {
        Header: 'DATE/Time',
        accessor: 'createdAt',
        Cell: ({ original }) => <div>{moment(original.createdAt).format("MM/DD/YYYY hh:mm")}</div>,
      },
    ];
  };

  render() {
    if (this.state.loading) {
      return (<div className="loading" />);
    }

    const { transactions } = this.state;

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.transactions" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <ReactTable
                  data={transactions}
                  columns={this.getCols()}
                  defaultPageSize={10}
                  PaginationComponent={DataTablePagination}
                  NoDataComponent={() => <div className="rt-noData">
                    No rows found
                  </div>}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  return { address: authUser.address };
};

export default connect(mapStateToProps, null)(TransactionPage);
