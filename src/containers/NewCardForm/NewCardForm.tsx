import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import {Grid, Row, Col} from 'components/FlexBox/FlexBox';
import {Form} from '../DrawerItems/DrawerItems.style';
import {FormFields, FormLabel} from 'components/FormFields/FormFields';
import * as HTTP from "../../utils/http";
import {API} from "../../settings/constants";
import extractErrors from "../../utils/error";
import {AuthContext} from "../../context/auth";
import {UploadIcon} from "../../assets/icons/UploadIcon";
import {ipfs} from "../../utils/ipfs";
import {sendTransaction} from "../../utils/metamask";
import {punksContract} from "../../utils/crypto/contracts";
import config from "../../utils/default";
import BigNumber from "bignumber.js";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from "yup";

const items = ['dataLink', 'title', 'description', 'totalSupply', 'price'];
const extensionImage = ["image/pjp", "image/jpg", "image/pjpeg", "image/jfif", "image/png", "image/jpg", "image/jpeg", "image/gif"];
const extensionVideo = ["video/ogv", "video/ogm", "video/ogg", "video/webm", "video/mp4"];

const RegisterSchema = Yup.object().shape({
    dataLink: Yup.string().required("Please upload the file"),
    title: Yup.string().required("Please enter the Name").max(100, "Max length exceeded"),
    description: Yup.string().required("Please enter the description").max(1000, "Max length exceeded"),
    totalSupply: Yup.number().positive().required("Please enter the totalSupply").moreThan(0).integer().lessThan(100000),
    price: Yup.number().test('is-decimal', 'Price format is invalid', value => (value + "").match(/\d+(\.\d+)?$/)).moreThan(0.01).lessThan(99999),
    // collection: Yup.object().nullable().required("Collection is required"),
});

type Props = {};
const NewCardForm: React.FC<Props> = () => {


    const [collectionOptions, setCollectionOptions] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [fileExt, setFileExt] = useState(0);
    const [fileUploading, setFileUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState('');
    const [ipfsExt, setIpfsExt] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const {address} = useContext(AuthContext);

    const {register, handleSubmit, setValue} = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues: {
            dataLink: '',
            title: '',
            description: '',
            totalSupply: 0,
            price: 0
        }
    });

    useEffect(() => {
        fetchCollections(address).then();
    }, [selectedCollection, fileData, fileExt, fileUploading, ipfsHash, ipfsExt, submitting, address]);

    function onCollectionChange({value}) {
        setSelectedCollection(value);
    }

    function onFileChosen(files) {
        const file = files[0];
        let fileExt = 999;

        if (extensionImage.includes(file.type)) {
            fileExt = 0;
        } else if (extensionVideo.includes(file.type)) {
            fileExt = 1;
        }

        if (fileExt === 999) {
            console.log("Please upload image or video files", "Warning", 3000, null, null, '');
            return;
        }
        if (file) {
            let reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => convertToBuffer(reader, fileExt);
        }

    }

    function handleUploader(files) {
        // setValue('reactDropzone', files);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function fetchCollections(address) {
        setCollectionOptions([]);
        try {
            if (address) {
                const res = await HTTP.GetRequest(API.MY_COLLECTIONS_get, {address});
                res.data.data.result.map(_ => {
                    _.value = _.id;
                    _.label = _.name;
                    return _;
                });
                setCollectionOptions(res.data.data.result);
            }
        } catch (error) {
            const errorMsg = extractErrors(error);
            console.log(errorMsg[0]);
        }
    }

    async function convertToBuffer(reader, ext) {
        const data = await Buffer.from(reader.result);
        setFileData(data);
        setFileExt(ext);
    }

    async function onFileUploadBtnClick() {
        if (!fileData) {
            console.log("Please upload only image or video file", "Warning", 3000, null, null, '');
            return;
        }
        if (!fileUploading && fileData) {
            setFileUploading(() => true);
            try {
                const result = await ipfs.add(fileData);
                setIpfsHash(() => result.path);
                setIpfsExt(() => fileExt);
                setValue('dataLink', result.path);
            } catch (error) {
                console.log("Failed to upload to ipfs", "error", 3000, null, null, '');
            }
            setFileUploading(() => false);
        }
    }

    async function onSubmit(values) {
        console.log(selectedCollection, values);

        if (submitting) {
            return;
        }

        if (!selectedCollection) {
            return;
        }

        setSubmitting(true);

        const web3 = window['web3'];
        if (web3 && address) {
            const {dataLink, title, description, totalSupply, price} = values;
            const decimalBN = new BigNumber(10).pow(config.decimals);
            const priceBN = new BigNumber(price).multipliedBy(decimalBN);

            const encodedABI = punksContract.contract.methods['safeMint'](
                address, dataLink, title, description, totalSupply, `0x${priceBN.toString(16)}`, selectedCollection[0].id, ipfsExt
            ).encodeABI();

            const hash = await sendTransaction(address, punksContract.address, encodedABI);

            if (hash) {
                await HTTP.PostRequest(API.TRANSACTIONS_CREATE_post, {address, txHash: hash, type: 'Register'});
                console.log("Transaction is created to register new card", "success", 3000, null, null, '');
            }
            setSubmitting(false);
        }
    }

    return (
        <Grid fluid={true}>
            <DrawerBox>
                <h3 style={{margin: '0 auto 30px 8px'}}>Upload your image</h3>
                <Row>
                    <Col md={9}>
                        <Uploader onChange={onFileChosen}/>
                    </Col>
                    <Col md={3}>
                        <Button
                            onClick={onFileUploadBtnClick}
                            style={{marginTop: 40, float: 'right'}}
                            startEnhancer={() => <UploadIcon/>}
                            isLoading={fileUploading}
                        >
                            Upload Image
                        </Button>
                    </Col>
                </Row>
            </DrawerBox>

            <br/>
            <br/>

            <Form onSubmit={handleSubmit(onSubmit)} style={{paddingBottom: 0}}>
                <DrawerBox>
                    <h3 style={{margin: '0 0 30px 0'}}>Enter your image information</h3>
                    <Row>

                        {items.map((item, index) => {
                            return (
                                <Col xs={12} sm={6} md={4} key={index} style={{marginBottom: '20px'}}>
                                    <FormFields>
                                        <FormLabel>{capitalize(item)}{item === "price" && " (ETH)"}</FormLabel>
                                        <Input
                                            name={item}
                                            inputRef={register}
                                            readOnly={item === "Image"}
                                            type="text"
                                        />
                                    </FormFields>
                                </Col>
                            )
                        })}

                        <Col xs={12} sm={6} md={4} style={{marginBottom: '20px'}}>
                            <FormFields>
                                <FormLabel>Collection</FormLabel>
                                <Select
                                    inputRef={register}
                                    options={collectionOptions}
                                    labelKey="label"
                                    valueKey="value"
                                    placeholder="Choose..."
                                    value={selectedCollection}
                                    searchable={false}
                                    onChange={onCollectionChange}
                                    overrides={{
                                        Placeholder: {
                                            style: ({$theme}) => {
                                                return {
                                                    ...$theme.typography.fontBold14,
                                                    color: $theme.colors.textNormal,
                                                };
                                            },
                                        },
                                        DropdownListItem: {
                                            style: ({$theme}) => {
                                                return {
                                                    ...$theme.typography.fontBold14,
                                                    color: $theme.colors.textNormal,
                                                };
                                            },
                                        },
                                        OptionContent: {
                                            style: ({$theme, $selected}) => {
                                                return {
                                                    ...$theme.typography.fontBold14,
                                                    color: $selected
                                                        ? $theme.colors.textDark
                                                        : $theme.colors.textNormal,
                                                };
                                            },
                                        },
                                        SingleValue: {
                                            style: ({$theme}) => {
                                                return {
                                                    ...$theme.typography.fontBold14,
                                                    color: $theme.colors.textNormal,
                                                };
                                            },
                                        },
                                        Popover: {
                                            props: {
                                                overrides: {
                                                    Body: {
                                                        style: {zIndex: 5},
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </FormFields>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}> </Col>
                        <Col md={4}> </Col>
                        <Col md={4}>
                            <FormFields>
                                <Button
                                    type="submit"
                                    overrides={{
                                        BaseButton: {
                                            style: ({$theme}) => ({
                                                width: '100%',
                                                marginLeft: 'auto',
                                                borderTopLeftRadius: '3px',
                                                borderTopRightRadius: '3px',
                                                borderBottomLeftRadius: '3px',
                                                borderBottomRightRadius: '3px',
                                            }),
                                        },
                                    }}
                                >
                                    Submit
                                </Button>
                            </FormFields>
                        </Col>
                    </Row>
                </DrawerBox>
            </Form>

        </Grid>
    );
};

export default NewCardForm;
