import styled from "@emotion/styled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LinkIcon from "@mui/icons-material/Link";
import { createTheme } from "@mui/material";
import darkTheme from "../../../theme/dark";

const dTheme = darkTheme;
export const Tab = styled(TabUnstyled)`
    color: ${dTheme.buttonText};
    cursor: pointer;
    font-size: 13px;
    background-color: transparent;
    padding: 6px 10px;
    border: none;
    border-radius: 3px 3px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid transparent;
    transition: 0.2s all;

    &:hover {
        background-color: ${dTheme.buttonHover};
    }

    &:focus {
        color: #aaa;
        border-radius: 3px 3px 0px 0px;

        outline-offset: 2px;
    }

    &.${tabUnstyledClasses.selected} {
        border-bottom: 1px solid ${dTheme.primaryDark};
    }

    &.${buttonUnstyledClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
    @media screen and (max-width: 360px) {
        span {
            display: none;
        }
        padding: 5px 20px;
    }
`;

export const TabHistoryIcon = styled(HistoryIcon)`
    height: 16px;
    width: 16px;
    margin-right: 3px;
`;

export const TabHistoryStarIcon = styled(StarBorderIcon)`
    height: 16px;
    width: 16px;
    margin-right: 3px;
`;
export const TabHistorySettingIcon = styled(DisplaySettingsIcon)`
    height: 16px;
    width: 16px;
    margin-right: 3px;
`;

export const TabHistoryLinkIcon = styled(LinkIcon)`
    height: 16px;
    width: 16px;
    margin-right: 3px;
`;

export const TabHistorySearchIcon = styled(SearchIcon)`
    height: 21px;
    width: 16px;
    padding: 0px 3px;
    border-radius: 3px 0px 0px 3px;
    background: ${dTheme.inputBg};
`;

export const TabHeaderContainer = styled.div`
    padding: 0px 15px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${dTheme.buttonDefault};
    height: 37px;
`;
export const TabPanel = styled(TabPanelUnstyled)`
    width: 100%;
`;

export const TabsList = styled(TabsListUnstyled)`
    min-width: 320px;
    border-bottom: 4px solid ${dTheme.inputBg};
    display: flex;
    align-items: center;
    align-content: space-between;
`;

export const EmptyHistory = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${dTheme.buttonText};
    font-size: 14px;
    flex: 1;
    padding: 20px;
    height: 50%;
`;

export const QueryHistoryContainer = styled.div`
    height: 250px;
    overflow-y: auto;
    &.starredCont {
        height: 210px;
    }
    &::-webkit-scrollbar {
        width: 10px;
        background: black;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: ${dTheme.scrollbarThumb};
    }
`;

export const HistoryButton = styled.button`
    padding: 3px 6px;
    background: ${dTheme.buttonDefault};
    border-radius: 3px;
    border: none;
    color: ${dTheme.buttonText};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 6px;
    cursor: pointer;
    min-height: 20px;
`;

export const SettingItemContainer = styled.div`
    height: 100px;
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    background: ${dTheme.viewBg};
    margin: 10px;
    border-radius: 3px;
    & div {
        font-size: 15px;
        color: orange;
    }
    & small {
        font-size: 12px;
        color: ${dTheme.buttonText};
    }
`;
export const SubmitButton = styled(HistoryButton)`
    background: ${dTheme.primaryDark};
    color: ${dTheme.buttonText};
    white-space: nowrap;
    .open-icon {
        display: none;
    }
    .open-text {
        display: flex;
    }
    @media screen and (max-width: 864px) {
        .open-icon {
            display: flex;
        }
        .open-text {
            display: none;
        }
    }
`;

export const ClearHistoryButton = styled(HistoryButton)`
    font-weight: bold;
    padding: 10px 20px;
    background: ${dTheme.primaryDark};
    margin: 0;
    width: 100%;
    white-space: nowrap;
`;
export const StyledCloseButton = styled(HistoryButton)`
    background: none;
    color: ${dTheme.buttonText};
    position: absolute;
    right: 0;
`;

export const DialogCancelButton = styled(HistoryButton)`
    background: ${dTheme.buttonDefault};
    padding: 8px 16px;
`;
export const DialogConfirmButton = styled(HistoryButton)`
    background: ${dTheme.primaryDark};
    padding: 8px 16px;
`;

export const FilterInput = styled.input`
    color: ${dTheme.buttonText};
    background: ${dTheme.inputBg};
    border: none;
    height: 21px;
    margin: 0px 10px 0px 0px;
    padding: 0px;
    font-size: 13px;
    border-radius: 0px 3px 3px 0px;
    font-family: monospace;
    font-size: 12px;
    &:focus {
        outline: none;
        color: ${dTheme.inputTextFocus};
    }
`;
export const RowData = styled.span`
    flex: 1;
    font-family: "monospace";
    font-size: "13px";
    color: ${dTheme.buttonText};
    white-space: nowrap;
    padding: 4px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const LinkParams = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    .open-button {
        display: none;
    }
    .inline-params {
        align-items: center;
        display: ${(props) => (props.open ? "none" : "grid")};
        flex: 1;
        grid-template-columns: 1fr 0.25fr 0.25fr auto;
        margin-right: 5px;
    }

    .open-button {
        display: flex;
        color: ${dTheme.buttonText};
        background: none;
        border: none;
    }
    .block-params {
        display: ${(props) => (props.open ? "flex" : "none")};
        flex-direction: column;
        flex: 1;
        p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            border-bottom: 1px solid ${dTheme.buttonDefault};
            margin-bottom: 4px;
            padding-bottom: 2px;
            span {
                margin-left: 3px;
            }
        }
    }
    @media screen and (max-width: 864px) {
        .inline-params {
            display: none;
        }
    }
`;

export const HistoryRow = styled.div`
    padding: 5px 0px;
    padding-left: 10px;
    background: ${dTheme.buttonHover};
    margin: 5px;
    border-radius: 3px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //height: 30px;
`;
export const TimeSpan = styled.div`
    @media screen and (max-width: 1370px) {
        display: none;
    }
`;

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: dTheme.buttonText,
            background: dTheme.buttonHover,
        },
    },
});
