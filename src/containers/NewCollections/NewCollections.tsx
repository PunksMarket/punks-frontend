import React, {useCallback, useState} from 'react';
import {styled, withStyle} from 'baseui';
import Button from 'components/Button/Button';
import {Grid, Row as Rows, Col as Column} from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import {useQuery, gql} from '@apollo/client';
import {Header, Heading} from 'components/Wrapper.style';
import Fade from 'react-reveal/Fade';
import CollectionCard from 'components/CollectionCard/CollectionCard';
import NoResult from 'components/NoResult/NoResult';
import {CURRENCY} from 'settings/constants';
import Placeholder from 'components/Placeholder/Placeholder';
import {Plus} from "../../assets/icons/Plus";
import {useDrawerDispatch} from "../../context/DrawerContext";

export const ProductsRow = styled('div', ({$theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '25px',
    backgroundColor: $theme.colors.backgroundF7,
    position: 'relative',
    zIndex: '1',

    '@media only screen and (max-width: 767px)': {
        marginLeft: '-7.5px',
        marginRight: '-7.5px',
        marginTop: '15px',
    },
}));

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

export const ProductCardWrapper = styled('div', () => ({
    height: '100%',
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

const GET_PRODUCTS = gql`
  query getProducts(
    $type: String
    $sortByPrice: String
    $searchText: String
    $offset: Int
  ) {
    products(
      type: $type
      sortByPrice: $sortByPrice
      searchText: $searchText
      offset: $offset
    ) {
      items {
        id
        name
        description
        image
        type
        price
        unit
        salePrice
        discountInPercent
      }
      totalCount
      hasMore
    }
  }
`;

const mock_data = {
    "status": true,
    "data": {
        "total": 5,
        "result": [{
            "id": 11,
            "name": " Local 05 weuw ef wef wefywt efw ef weftiwe f twie f",
            "tokenCount": 0,
            "totalTokenPrice": "0.0000000000",
            "createdAt": "2020-10-13T19:54:19.000Z",
            "updatedAt": "2020-10-13T19:54:30.000Z",
            "userId": 2
        }, {
            "id": 10,
            "name": "Local 02",
            "tokenCount": 0,
            "totalTokenPrice": "0.0000000000",
            "createdAt": "2020-10-13T19:22:20.000Z",
            "updatedAt": "2020-10-13T19:22:20.000Z",
            "userId": 2
        }, {
            "id": 9,
            "name": "Local 03",
            "tokenCount": 0,
            "totalTokenPrice": "0.0000000000",
            "createdAt": "2020-10-13T18:11:29.000Z",
            "updatedAt": "2020-10-13T18:11:29.000Z",
            "userId": 2
        }, {
            "id": 8,
            "name": "Local 00",
            "tokenCount": 0,
            "totalTokenPrice": "0.0000000000",
            "createdAt": "2020-10-09T08:09:51.000Z",
            "updatedAt": "2020-10-09T08:31:30.000Z",
            "userId": 2
        }, {
            "id": 7,
            "name": "Local 01",
            "tokenCount": 0,
            "totalTokenPrice": "0.0000000000",
            "createdAt": "2020-10-09T07:54:30.000Z",
            "updatedAt": "2020-10-09T08:31:40.000Z",
            "userId": 2
        }]
    }
}

export default function NewCollections() {
    const {data} = mock_data;
    const [search, setSearch] = useState([]);

    const dispatch = useDrawerDispatch();
    const openDrawer = useCallback(
        () => dispatch({type: 'OPEN_DRAWER', drawerComponent: 'COLLECTION_FORM'}),
        [dispatch]
    );

    function handleSearch(event) {
        const value = event.currentTarget.value;
        setSearch(value);
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
                        {data ? (
                            data.result && data.result.length !== 0 ? (
                                data.result.map((item: any, index: number) => (
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
                                                data={item}
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
