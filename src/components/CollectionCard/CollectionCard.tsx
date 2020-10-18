import React, {useState} from 'react';
import {
  ProductCardWrapper,
  ProductInfo,
  ProductTitle,
  ProductWeight,
  ProductMeta,
  ProductPriceWrapper,
  ProductPrice, MenuDropdownItem, MenuOption,
} from './CollectionCard.style';
import { useDrawerDispatch } from 'context/DrawerContext';
import moment from 'moment';
import {PencilIcon} from "../../assets/icons/PencilIcon";
import Popover, { PLACEMENT } from 'components/Popover/Popover';
import {EllipsisIcon} from "../../assets/icons/EllipsisIcon";

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
          <span style={{float: 'right', opacity: 0.5}}>
            <EllipsisIcon />
          </span>
        </Popover>

        <ProductTitle>{title}</ProductTitle>
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
