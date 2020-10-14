import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Grid, Row, Col } from 'components/FlexBox/FlexBox';
import { Form } from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';

const options = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'turn-off', label: 'Down' },
];
type Props = {};
const NewCardForm: React.FC<Props> = () => {
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = (data) => console.log(data);
  const [category, setCategory] = useState([]);
  const [description, setDescription] = React.useState('');
  const handleMultiChange = ({ value }) => {
    setValue('reactSelect', value);
    setCategory(value);
  };
  const handleUploader = (files) => {
    setValue('reactDropzone', files);
  };
  React.useEffect(() => {
    register({ name: 'reactSelect' });
    register({ name: 'reactDropzone' });
  }, [register]);
  return (
    <Grid fluid={true}>
      <Form onSubmit={handleSubmit(onSubmit)} style={{ paddingBottom: 0 }}>
        <DrawerBox>
          <h3 style={{margin: '0 auto 30px 8px'}}>Upload your image</h3>
          <Uploader onChange={handleUploader} />
        </DrawerBox>

        <br/>
        <br/>
        <DrawerBox>
          <h3 style={{margin: '0 0 30px 0'}}>Enter your image information</h3>
          <Row>
            <Col md={4}>
              <FormFields>
                <FormLabel>DataLink</FormLabel>
                <Input
                    name="site_name"
                    inputRef={register({ required: true, maxLength: 20 })}
                />
              </FormFields>
            </Col>
            <Col md={4}>
              <FormFields>
                <FormLabel>Title</FormLabel>
                <Input
                    name="site_names"
                    inputRef={register({ required: true, maxLength: 20 })}
                />
              </FormFields>
            </Col>
            <Col md={4}>
              <FormFields>
                <FormLabel>Description</FormLabel>
                <Input
                    name="site_namee"
                    inputRef={register({ required: true, maxLength: 20 })}
                />
              </FormFields>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormFields>
                <FormLabel>TotalSupply</FormLabel>
                <Input
                    name="site_name"
                    inputRef={register({ required: true, maxLength: 20 })}
                />
              </FormFields>
            </Col>
            <Col md={4}>
              <FormFields>
                <FormLabel>Price (ETH)</FormLabel>
                <Input
                    name="site_names"
                    inputRef={register({ required: true, maxLength: 20 })}
                />
              </FormFields>
            </Col>
            <Col md={4}>
              <FormFields>
                <FormLabel>Collection</FormLabel>
                <Select
                    options={options}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Choose..."
                    value={category}
                    searchable={false}
                    onChange={handleMultiChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                                ? $theme.colors.textDark
                                : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
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
                              style: { zIndex: 5 },
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
                        style: ({ $theme }) => ({
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
                  Create card
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
