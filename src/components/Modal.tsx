import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
// @ts-ignore
import gradient from "../assets/gradient.svg";
// @ts-ignore
import close from "../assets/close.svg";

import { Provider } from "./Provider";
import {
  MODAL_LIGHTBOX_CLASSNAME,
  MODAL_CONTAINER_CLASSNAME,
  MODAL_HITBOX_CLASSNAME,
  MODAL_CARD_CLASSNAME,
  MODAL_MAIN_CLASSNAME,
  MODAL_PROVIDERS_CLASSNAME,
  MODAL_DOWNLOAD_CLASSNAME,
  MODAL_HEADER_CLASSNAME,
  MODAL_LINK_CLASSNAME,
  MODAL_CLOSE_CLASSNAME
} from "../constants";
import { SimpleFunction, IProviderUserOptions, ThemeColors } from "../helpers";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    BinanceChain: any;
    web3: any;
    celo: any;
    updateWeb3Modal: any;
  }
}

interface ILightboxStyleProps {
  show: boolean;
  offset: number;
  opacity?: number;
}
interface IStyedThemeColorOptions {
  themeColors: ThemeColors;
}
const SLightbox = styled.div<ILightboxStyleProps>`
  transition: opacity 0.1s ease-in-out;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  margin-left: -50vw;
  top: ${({ offset }) => 0};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({ opacity }) => {
    let alpha = 0.6;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;

  & * {
    box-sizing: border-box !important;
  }
`;

interface IModalContainerStyleProps {
  show: boolean;
}

const SModalContainer = styled.div<IModalContainerStyleProps>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  @media screen and (max-width: 480px) {
    align-items: end;
  }
`;

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IModalCardStyleProps {
  show: boolean;
  themeColors: ThemeColors;
  maxWidth?: number;
}

const SModalCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  background-color: ${({ themeColors }) => themeColors.background};
  border-radius: 12px;
  padding: 0;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};

  display: flex;
  flex-direction: column;
  max-width: ${({ maxWidth }) => "384px"};
  min-width: fit-content;
  max-height: 100%;

  @media screen and (max-width: 480px) {
    max-width: 100%;
    border-radius: 12px 12px 0 0;
  }
`;
const SModalMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 32px;
  gap: 24px;
  background-image: url(${gradient});
  background-repeat: no-repeat;
  background-position: top left;
  @media screen and (max-width: 480px) {
    padding: 32px 20px;
  }
`;
const SModalHeader = styled.h3<IStyedThemeColorOptions>`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${({ themeColors }) => themeColors.header};
  margin: 0;
`;
const SModalProviders = styled.div<IStyedThemeColorOptions>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: ${({ themeColors }) => `1px solid ${themeColors.border}`};
  background-color: ${({ themeColors }) => themeColors.background};
`;
const SModalDownload = styled.div<IStyedThemeColorOptions>`
  width: 100%;
  padding: 32px;
  margin: 0 auto;
  border-top: ${({ themeColors }) => `1px solid ${themeColors.border}`};
`;

const SModalText = styled.span<IStyedThemeColorOptions>`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #52525d;
  color: ${({ themeColors }) => themeColors.secondary};
`;
const SModalLink = styled(SModalText)<IStyedThemeColorOptions>`
  font-weight: 600;
  color: ${({ themeColors }) => themeColors.action};
`;

const SModalClose = styled.button`
  appearance: none;
  outline: none;
  background: none;
  border: none;
  padding: 0;
  position: absolute;
  right: 0;
  top: -36px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  & img {
    width: 24px;
    height: 24px;
  }
  @media screen and (max-width: 480px) {
    right: 20px;
  }
`;
interface IModalProps {
  themeColors: ThemeColors;
  userOptions: IProviderUserOptions[];
  onClose: SimpleFunction;
  resetState: SimpleFunction;
  lightboxOpacity: number;
}

interface IModalState {
  show: boolean;
  lightboxOffset: number;
}

const INITIAL_STATE: IModalState = {
  show: false,
  lightboxOffset: 0
};

export class Modal extends React.Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    window.updateWeb3Modal = async (state: IModalState) => {
      this.setState(state);
    };
  }
  public static propTypes = {
    userOptions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    lightboxOpacity: PropTypes.number.isRequired
  };

  public lightboxRef?: HTMLDivElement | null;
  public mainModalCard?: HTMLDivElement | null;

  public state: IModalState = {
    ...INITIAL_STATE
  };

  public componentDidUpdate(prevProps: IModalProps, prevState: IModalState) {
    if (prevState.show && !this.state.show) {
      this.props.resetState();
    }
    if (this.lightboxRef) {
      const lightboxRect = this.lightboxRef.getBoundingClientRect();
      const lightboxOffset = lightboxRect.top > 0 ? lightboxRect.top : 0;

      if (
        lightboxOffset !== INITIAL_STATE.lightboxOffset &&
        lightboxOffset !== this.state.lightboxOffset
      ) {
        this.setState({ lightboxOffset });
      }
    }
  }

  public render = () => {
    const { show, lightboxOffset } = this.state;

    const { onClose, lightboxOpacity, userOptions, themeColors } = this.props;

    return (
      <SLightbox
        className={MODAL_LIGHTBOX_CLASSNAME}
        offset={lightboxOffset}
        opacity={lightboxOpacity}
        ref={c => (this.lightboxRef = c)}
        show={show}
      >
        <SModalContainer className={MODAL_CONTAINER_CLASSNAME} show={show}>
          <SHitbox className={MODAL_HITBOX_CLASSNAME} onClick={onClose} />
          <SModalCard
            className={MODAL_CARD_CLASSNAME}
            show={show}
            themeColors={themeColors}
            maxWidth={userOptions.length < 3 ? 500 : 800}
          >
            <SModalClose onClick={onClose} className={MODAL_CLOSE_CLASSNAME}>
              <img src={close}></img>
            </SModalClose>
            <SModalMain className={MODAL_MAIN_CLASSNAME}>
              <SModalHeader
                themeColors={themeColors}
                className={MODAL_HEADER_CLASSNAME}
              >
                Login
              </SModalHeader>
              <SModalProviders
                className={MODAL_PROVIDERS_CLASSNAME}
                themeColors={themeColors}
                ref={c => (this.mainModalCard = c)}
              >
                {userOptions.map((provider, index, arr) =>
                  !!provider ? (
                    <Provider
                      name={provider.name}
                      logo={provider.logo}
                      description={provider.description}
                      themeColors={themeColors}
                      onClick={provider.onClick}
                      isFirst={index === 0}
                      isLast={index + 1 === arr.length}
                    />
                  ) : null
                )}
              </SModalProviders>
            </SModalMain>
            <SModalDownload
              className={MODAL_DOWNLOAD_CLASSNAME}
              themeColors={themeColors}
            >
              <SModalText themeColors={themeColors}>
                Don't have wallet?{" "}
                <SModalLink
                  themeColors={themeColors}
                  className={MODAL_LINK_CLASSNAME}
                  as="a"
                  href="https://metamask.io/download/"
                >
                  Download here
                </SModalLink>
              </SModalText>
            </SModalDownload>
          </SModalCard>
        </SModalContainer>
      </SLightbox>
    );
  };
}
