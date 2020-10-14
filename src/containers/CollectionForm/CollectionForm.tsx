import React, {useState, useCallback, useContext} from 'react';
import {useForm} from 'react-hook-form';
import {v4 as uuidv4} from 'uuid';
import {useDrawerDispatch, useDrawerState} from 'context/DrawerContext';
import {Scrollbars} from 'react-custom-scrollbars';
import Input from 'components/Input/Input';
import Button, {KIND} from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import {Row, Col} from 'components/FlexBox/FlexBox';
import {
    Form,
    DrawerTitleWrapper,
    DrawerTitle,
    ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import {FormFields, FormLabel} from 'components/FormFields/FormFields';
import extractErrors from "../../utils/error";
import {AuthContext} from "../../context/auth";
import * as HTTP from "../../utils/http";
import {API} from "../../settings/constants";

type Props = any;

const AddCollection: React.FC<Props> = (props) => {
    const {address} = useContext(AuthContext);
    const dispatch = useDrawerDispatch();
    const data = useDrawerState('data');
    const closeDrawer = useCallback(
        () => dispatch({type: 'CLOSE_DRAWER'}),
        [dispatch]);
    const {register, handleSubmit} = useForm();

    const onSubmit = ({name}) => {
        createCollection({name, address}).then(()=>{
            data.fetchCollections(address);
        });
        closeDrawer();
    };

    async function createCollection(newCollection) {
        try {
            if (newCollection.address) {
                await HTTP.PostRequest(API.NEW_COLLECTION_post, newCollection);
                console.log("You created collection name successfully");
            }
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    return (
        <>
            <DrawerTitleWrapper>
                <DrawerTitle>Enter new collection information</DrawerTitle>
            </DrawerTitleWrapper>

            <Form onSubmit={handleSubmit(onSubmit)} style={{height: '100%'}}>
                <Scrollbars
                    autoHide
                    renderView={(props) => (
                        <div {...props} style={{...props.style, overflowX: 'hidden'}}/>
                    )}
                    renderTrackHorizontal={(props) => (
                        <div
                            {...props}
                            style={{display: 'none'}}
                            className="track-horizontal"
                        />
                    )}
                >

                    <Row>
                        <Col lg={12}>
                            <DrawerBox>
                                <FormFields>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        inputRef={register({required: true, maxLength: 20})}
                                        name="name"
                                    />
                                </FormFields>
                            </DrawerBox>
                        </Col>
                    </Row>
                </Scrollbars>

                <ButtonGroup>
                    <Button
                        kind={KIND.minimal}
                        onClick={closeDrawer}
                        overrides={{
                            BaseButton: {
                                style: ({$theme}) => ({
                                    width: '50%',
                                    borderTopLeftRadius: '3px',
                                    borderTopRightRadius: '3px',
                                    borderBottomRightRadius: '3px',
                                    borderBottomLeftRadius: '3px',
                                    marginRight: '15px',
                                    color: $theme.colors.red400,
                                }),
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        overrides={{
                            BaseButton: {
                                style: ({$theme}) => ({
                                    width: '50%',
                                    borderTopLeftRadius: '3px',
                                    borderTopRightRadius: '3px',
                                    borderBottomRightRadius: '3px',
                                    borderBottomLeftRadius: '3px',
                                }),
                            },
                        }}
                    >
                        Create
                    </Button>
                </ButtonGroup>
            </Form>
        </>
    );
};

export default AddCollection;
