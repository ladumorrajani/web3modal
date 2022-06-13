import * as React from "react";
import styled from "styled-components";
// @ts-ignore
import chevronRight from "../assets/chevron-right.svg";

import { ThemeColors } from "../helpers";
import {
  PROVIDER_WRAPPER_CLASSNAME,
  PROVIDER_CONTAINER_CLASSNAME,
  PROVIDER_ICON_CLASSNAME,
  PROVIDER_NAME_CLASSNAME,
  PROVIDER_DESCRIPTION_CLASSNAME,
  PROVIDER_CONTENT_CLASSNAME,
  PROVIDER_ARROW_CLASSNAME
} from "../constants";

const SIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  border-radius: 50%;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;
  & img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: contain;
  }
`;

interface IStyedThemeColorOptions {
  themeColors: ThemeColors;
}

const SName = styled.div<IStyedThemeColorOptions>`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${({ themeColors }) => themeColors.main};
`;

const SDescription = styled.div<IStyedThemeColorOptions>`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ themeColors }) => themeColors.secondary};
`;

const SProviderContainer = styled.div`
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  border-radius: 12px;
`;
interface IProviderWrapperStyleProps {
  themeColors: ThemeColors;
  isFirst: boolean;
  isLast: boolean;
}
const SProviderWrapper = styled.div<IProviderWrapperStyleProps>`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: ${({ isFirst, isLast }) =>
    isFirst ? "8px 8px 0 0" : isLast ? "0 0 8px 8px" : 0};
  border-bottom: ${({ themeColors, isLast }) =>
    isLast ? "none" : `1px solid ${themeColors.border}`};
  @media (hover: hover) {
    &:hover {
      background-color: ${({ themeColors }) => themeColors.hover};
    }
  }
`;
const SProviderArrow = styled.img`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SProviderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
`;

interface IProviderProps {
  name: string;
  logo: string;
  description: string;
  themeColors: ThemeColors;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
}

export function Provider(props: IProviderProps) {
  const {
    name,
    logo,
    description,
    themeColors,
    onClick,
    isFirst,
    isLast,
    ...otherProps
  } = props;
  return (
    <SProviderWrapper
      themeColors={themeColors}
      className={PROVIDER_WRAPPER_CLASSNAME}
      onClick={onClick}
      isFirst={isFirst}
      isLast={isLast}
      {...otherProps}
    >
      <SProviderContainer className={PROVIDER_CONTAINER_CLASSNAME}>
        <SIcon className={PROVIDER_ICON_CLASSNAME}>
          <img src={logo} alt={name} />
        </SIcon>
        <SProviderContent className={PROVIDER_CONTENT_CLASSNAME}>
          <SName themeColors={themeColors} className={PROVIDER_NAME_CLASSNAME}>
            {name}
          </SName>
          <SDescription
            themeColors={themeColors}
            className={PROVIDER_DESCRIPTION_CLASSNAME}
          >
            {description}
          </SDescription>
        </SProviderContent>
      </SProviderContainer>
      <SProviderArrow src={chevronRight} className={PROVIDER_ARROW_CLASSNAME} />
    </SProviderWrapper>
  );
}
