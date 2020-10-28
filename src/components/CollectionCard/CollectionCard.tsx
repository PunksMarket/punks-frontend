import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

import {
  ProductCardWrapper,
  ProductInfo,
  ProductTitle,
  ProductWeight,
  ProductMeta,
  ProductPriceWrapper,
  ProductPrice, MenuDropdownItem, MenuOption, EllipsisIconWrapper,
} from './CollectionCard.style';
import { useDrawerDispatch } from 'context/DrawerContext';
import moment from 'moment';
import {PencilIcon} from "../../assets/icons/PencilIcon";
import Popover, { PLACEMENT } from 'components/Popover/Popover';
import {EllipsisIcon} from "../../assets/icons/EllipsisIcon";
import {COLLECTION, COLLECTION_MODE} from "../../settings/constants";

type ProductCardProps = {
  title: string;
  dateTime: string;
  tokenCount: number;
  data: any;
};

const CollectionCard: React.FC<ProductCardProps> = ({
  title,
  dateTime,
  tokenCount,
  data,
  ...props
}) => {

  const history = useHistory();
  const dispatch = useDrawerDispatch();
  const openDrawer = React.useCallback(
    () =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'COLLECTION_UPDATE_FORM',
        data: data,
      }),
    [dispatch, data]
  );

  function onCollectionClick() {
    const url = COLLECTION.split('/')[1] + '/' + data.id + '/' + data.mode;
    history.push(url);
  }

  return (
    <ProductCardWrapper
      {...props}
      className="product-card"
    >
      <ProductInfo>

        <Popover
          content={({ close }) => (
              <MenuDropdownItem>
                <MenuOption onClick={()=>{openDrawer();close();}}> Rename </MenuOption>
              </MenuDropdownItem>
          )}
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: '220px',
                zIndex: 2,
              }),
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <EllipsisIconWrapper>
            <EllipsisIcon />
          </EllipsisIconWrapper>
        </Popover>

        <ProductTitle onClick={onCollectionClick}>{title}</ProductTitle>
        <ProductWeight>{moment(dateTime).format("MM/DD/YYYY hh:mm")}</ProductWeight>
        <ProductMeta>
          <ProductPriceWrapper>
            <ProductPrice> {tokenCount} tokens</ProductPrice>
          </ProductPriceWrapper>
        </ProductMeta>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

export default CollectionCard;
