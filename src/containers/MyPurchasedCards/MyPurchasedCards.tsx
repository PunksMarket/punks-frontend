import React, {useCallback, useContext, useEffect, useState} from 'react';
import {styled, withStyle} from 'baseui';
import Button from 'components/Button/Button';
import {Grid, Row as Rows, Col as Column} from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import {useQuery, gql} from '@apollo/client';
import {Header, Heading} from 'components/Wrapper.style';
import Fade from 'react-reveal/Fade';
import CollectionCard from 'components/CollectionCard/CollectionCard';
import NoResult from 'components/NoResult/NoResult';
import {API, CURRENCY} from 'settings/constants';
import Placeholder from 'components/Placeholder/Placeholder';
import {Plus} from "../../assets/icons/Plus";
import {useDrawerDispatch, useDrawerState} from "../../context/DrawerContext";
import extractErrors from '../../utils/error';
import * as HTTP from "../../utils/http";
import {AuthContext} from "../../context/auth";

export const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 767px)': {
        marginBottom: '20px',

        ':last-child': {
            marginBottom: 0,
        },
    },
}));

const Row = withStyle(Rows, () => ({
    '@media only screen and (min-width: 768px) and (max-width: 991px)': {
        alignItems: 'center',
    },
}));

export const LoaderWrapper = styled('div', () => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexWrap: 'wrap',
}));

export const LoaderItem = styled('div', () => ({
    width: '25%',
    padding: '0 15px',
    marginBottom: '30px',
}));

export default function MyPurchasedCards() {
    const [cardList, setCardList] = useState([]);
    const {address} = useContext(AuthContext);

    useEffect(() => {
        fetchCards(address).then();
    }, [address]);

    async function fetchCards(address) {
        setCardList([]);
        try {
            if (address) {
                const res = await HTTP.GetRequest(API.MY_CARDS_get, {address});
                setCardList(res.data.data.result);
            }
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header style={{marginBottom: 8}}>
                        <Col md={4} xs={12}>
                            <Heading>My Purchased Cards</Heading>
                        </Col>
                    </Header>

                    <Row>
                        {cardList ? (
                            cardList && cardList.length !== 0 ? (
                                cardList.map((item: any, index: number) => (
                                    <Col
                                        md={4}
                                        lg={3}
                                        sm={6}
                                        xs={12}
                                        key={index}
                                        style={{margin: '8px 0'}}
                                    >
                                        <Fade bottom duration={800} delay={index * 10}>
                                            <CollectionCard
                                                title={item.name}
                                                dateTime={item.createdAt}
                                                tokenCount={item.tokenCount}
                                                data={{item}}
                                            />
                                        </Fade>
                                    </Col>
                                ))
                            ) : (
                                <NoResult
                                    msg={'No card found :('}
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
                    </Row>
                </Col>
            </Row>
        </Grid>
    );
}
