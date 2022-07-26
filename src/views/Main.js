import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { themes } from "../theme/themes";
import Panel from "../components/Panel/Panel";
import { Notification } from "../qryn-ui/notifications";
import SettingsDialog from "../plugins/settingsdialog/SettingsDialog";
import { UpdateStateFromQueryParams } from "../helpers/UpdateStateFromQueryParams";
import StatusBar from "../components/StatusBar";

export const MainContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    flex: 1;

    background-color: ${(props) => props.theme.mainBgColor} !important;
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: ${(props) => props.theme.scrollbarThumb} !important;
    }
    .panels-container {
        display: flex;
        border-top: 1px solid ${({theme})=> theme.buttonBorder};
        padding-top:5px;
        margin-top:5px;
        background:${({theme})=> theme.shBgColor};
        height:calc(100vh - 45px);
        
    }
`;

export default function Main() {
    UpdateStateFromQueryParams();
    const isSplit = useSelector((store) => store.isSplit);
    const isEmbed = useSelector((store) => store.isEmbed);
    const settingsDialogOpen = useSelector((store) => store.settingsDialogOpen);

    const theme = useSelector((store) => store.theme);

    return (
        <ThemeProvider theme={themes[theme]}>
            <MainContainer>
                {!isEmbed && <StatusBar />}
                <div className="panels-container">
                    <Panel name="left" />
                    {isSplit && <Panel name="right" />}
                </div>
            </MainContainer>
            <Notification />
            <SettingsDialog open={settingsDialogOpen} />
        </ThemeProvider>
    );
}

// this one should include the two panels
