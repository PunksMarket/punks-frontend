import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, gql } from '@apollo/client';
import { useDrawerDispatch } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';

const GET_CATEGORIES = gql`
  query getCategories($type: String, $searchBy: String) {
    categories(type: $type, searchBy: $searchBy) {
      id
      icon
      name
      slug
      type
    }
  }
`;
const CREATE_CATEGORY = gql`
  mutation createCategory($category: AddCategoryInput!) {
    createCategory(category: $category) {
      id
      name
      type
      icon
      # creation_date
      slug
      # number_of_product
    }
  }
`;

type Props = any;

const AddCollection: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit } = useForm();
  React.useEffect(() => {
    register({ name: 'parent' });
    register({ name: 'image' });
  }, [register]);
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    update(cache, { data: { createCategory } }) {
      const { categories } = cache.readQuery({
        query: GET_CATEGORIES,
      });

      cache.writeQuery({
        query: GET_CATEGORIES,
        data: { categories: categories.concat([createCategory]) },
      });
    },
  });

  const onSubmit = ({ name, slug, parent, image }) => {
    const newCategory = {
      id: uuidv4(),
      name: name,
      type: parent[0].value,
      slug: slug,
      icon: image,
      creation_date: new Date(),
    };
    createCategory({
      variables: { category: newCategory },
    }).then();
    closeDrawer();
    console.log(newCategory, 'newCategory');
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Enter new collection information</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
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
                    inputRef={register({ required: true, maxLength: 20 })}
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
                style: ({ $theme }) => ({
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
                style: ({ $theme }) => ({
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
