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
import {API, COLLECTIONS, CURRENCY, MY_COLLECTIONS} from 'settings/constants';
import Placeholder from 'components/Placeholder/Placeholder';
import {Plus} from "../../assets/icons/Plus";
import {useDrawerDispatch, useDrawerState} from "../../context/DrawerContext";
import extractErrors from '../../utils/error';
import * as HTTP from "../../utils/http";
import {AuthContext} from "../../context/auth";
import {SearchIcon} from "../../assets/icons/SearchIcon";
import {useParams, useHistory} from "react-router-dom";

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

export default function Collection() {

    let params: any = useParams();
    let history = useHistory();

    if (!(params && params.id && params.mode)) {
        history.push(MY_COLLECTIONS);
    }

    const {id, mode} = params;

    const [collectionList, setCollectionList] = useState([]);
    const [search, setSearch] = useState('');
    const {address} = useContext(AuthContext);

    useEffect(() => {
        fetchCollection({address, search: '', id, mode}).then();
    }, [address, id, mode]);

    async function fetchCollection({address, search, id, mode}) {
        setCollectionList([]);
        try {
            const res = await HTTP.GetRequest(API.COLLECTION, {search, id, mode, address});
            setCollectionList(res.data.data.result);
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    function handleSearch(event) {
        const q = event.currentTarget.value;
        setSearch(q);
    }

    function onSearchBtnClick(event) {
        fetchCollection({address, search, id, mode}).then();
    }

    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header style={{marginBottom: 8}}>
                        <Col md={2} xs={12}>
                            <Heading>Collection</Heading>
                        </Col>

                        <Col md={10}>
                            <Row>
                                <Col md={7} lg={7} sm={12}>
                                    <Input
                                        value={search}
                                        placeholder="Search By Collection Name"
                                        onChange={handleSearch}
                                        clearable
                                        disabled={!(collectionList && collectionList.length)}
                                    />
                                </Col>

                                <Col md={5} lg={5} sm={12}>
                                    <Button
                                        onClick={onSearchBtnClick}
                                        startEnhancer={() => <SearchIcon/>}
                                        disabled={!(collectionList && collectionList.length)}
                                        overrides={{
                                            BaseButton: {
                                                style: () => ({
                                                    width: '100%',
                                                    borderTopLeftRadius: '3px',
                                                    borderTopRightRadius: '3px',
                                                    borderBottomLeftRadius: '3px',
                                                    borderBottomRightRadius: '3px',
                                                }),
                                            },
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Header>

                    <Row>
                        {collectionList ? (
                            collectionList && collectionList.length !== 0 ? (
                                collectionList.map((item: any, index: number) => (
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
                                                data={{...item, fetchCollection}}
                                            />
                                        </Fade>
                                    </Col>
                                ))
                            ) : (
                                <NoResult
                                    msg={'No collection found :('}
                                    hideButton={false}
                                    style={{
                                        gridColumnStart: '1',
                                        gridColumnEnd: 'one',
                                        height: '10vw'
                                    }}/>
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
