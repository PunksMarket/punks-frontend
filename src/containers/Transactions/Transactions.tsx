import React, {useCallback, useContext, useEffect, useState} from 'react';
import {withStyle} from 'baseui';
import {Grid, Row as Rows, Col as Column} from 'components/FlexBox/FlexBox';
import {useDrawerDispatch} from 'context/DrawerContext';
import Checkbox from 'components/CheckBox/CheckBox';
import {useQuery, gql} from '@apollo/client';
import {Wrapper, Header, Heading} from 'components/Wrapper.style';
import {
    TableWrapper,
    StyledTable,
    StyledHeadCell,
    StyledCell,
    ImageWrapper,
} from './Transactions.style';
import * as icons from 'assets/icons/category-icons';
import NoResult from 'components/NoResult/NoResult';
import {AuthContext} from "../../context/auth";
import * as HTTP from "../../utils/http";
import {API} from "../../settings/constants";
import extractErrors from "../../utils/error";
import Placeholder from "../../components/Placeholder/Placeholder";
import {LoaderItem, LoaderWrapper} from "../Collections/Collections";

const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 767px)': {
        marginBottom: '20px',

        ':last-child': {
            marginBottom: 0,
        },
    },
}));

const Row = withStyle(Rows, () => ({
    '@media only screen and (min-width: 768px)': {
        alignItems: 'center',
    },
}));

export default function Transactions() {

    const [transactionList, setTransactionList] = useState([]);
    const {address} = useContext(AuthContext);

    useEffect(() => {
        fetchCollections(address).then();
    }, [address]);

    async function fetchCollections(address) {
        setTransactionList([]);
        try {
            const res = await HTTP.GetRequest(API.TRANSACTIONS_get, {address});
            setTransactionList(res.data.data.result);
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header
                        style={{
                            marginBottom: 30,
                            boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
                        }}
                    >
                        <Col md={5}>
                            <Heading>Transactions</Heading>
                        </Col>
                    </Header>

                    {transactionList ? (
                        transactionList.length ? (
                            <Wrapper style={{boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)'}}>
                                <TableWrapper>
                                    <StyledTable $gridTemplateColumns="auto auto auto auto">
                                        <StyledHeadCell>Transaction Hash</StyledHeadCell>
                                        <StyledHeadCell>Type</StyledHeadCell>
                                        <StyledHeadCell>Status</StyledHeadCell>
                                        <StyledHeadCell>Date/Time</StyledHeadCell>
                                        {
                                            transactionList
                                                .map((item) => Object.values(item))
                                                .map((row, index) => (
                                                    <React.Fragment key={index}>
                                                        <StyledCell>{row[1]}</StyledCell>
                                                        <StyledCell>{row[2]}</StyledCell>
                                                        <StyledCell>{row[3]}</StyledCell>
                                                        <StyledCell>{row[4]}</StyledCell>
                                                    </React.Fragment>
                                                ))
                                        }
                                    </StyledTable>
                                </TableWrapper>
                            </Wrapper>
                        ) : (
                            <NoResult
                                msg={'No transaction found :('}
                                hideButton={false}
                                style={{
                                    height: '10vw'
                                }}
                            />
                        )
                    ) : (
                        <LoaderWrapper>
                            <LoaderItem>
                                <Placeholder/>
                            </LoaderItem>
                            <LoaderItem>
                                <Placeholder/>
                            </LoaderItem>
                            <LoaderItem>
                                <Placeholder/>
                            </LoaderItem>
                            <LoaderItem>
                                <Placeholder/>
                            </LoaderItem>
                        </LoaderWrapper>
                    )}
                </Col>
            </Row>
        </Grid>
    );
}
