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
import {API, COLLECTION_MODE, CURRENCY} from 'settings/constants';
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

export default function NewCollections() {
    const [collectionList, setCollectionList] = useState(null);
    const [collectionListFiltered, setCollectionListFiltered] = useState(null);
    const [search, setSearch] = useState('');
    const {address} = useContext(AuthContext);

    const dispatch = useDrawerDispatch();
    const openDrawer = useCallback(
        () => dispatch(
            {type: 'OPEN_DRAWER', drawerComponent: 'COLLECTION_FORM', data: {fetchCollections}}),
        [dispatch]);

    useEffect(() => {
        fetchCollections(address).then();
    }, [address]);

    async function fetchCollections(address) {
        setCollectionList(null);
        setCollectionListFiltered(null);
        try {
            if (address) {
                const res = await HTTP.GetRequest(API.MY_COLLECTIONS_get, {address});
                res.data.data.result.map(_ => _.mode = COLLECTION_MODE.ALL);
                setCollectionList(res.data.data.result);
                setCollectionListFiltered(res.data.data.result);
            }
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    function handleSearch(event) {
        const q = event.currentTarget.value;
        setSearch(q);
        setCollectionListFiltered(
            collectionList.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) ? c : ''));
    }

    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header style={{marginBottom: 8}}>
                        <Col md={2} xs={12}>
                            <Heading>New Collections</Heading>
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
                                        onClick={openDrawer}
                                        startEnhancer={() => <Plus/>}
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
                                        Create New Collection
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Header>

                    <Row>
                        {collectionListFiltered ? (
                            collectionListFiltered && collectionListFiltered.length !== 0 ? (
                                collectionListFiltered.map((item: any, index: number) => (
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
                                                data={{...item, fetchCollections}}
                                            />
                                        </Fade>
                                    </Col>
                                ))
                            ) : (
                                <NoResult/>
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
