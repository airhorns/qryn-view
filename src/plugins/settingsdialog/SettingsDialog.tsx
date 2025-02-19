import { Dialog, Switch, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    setTheme,
    setAutoTheme
} from "../../actions";

import setSettingsDialogOpen from "../../actions/setSettingsDialogOpen";

import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info"
import {
    InputGroup,
    SettingCont,
    SettingHeader,
    SettingCloseBtn,
    SettingsInputContainer,
    SettingLabel,
    EmbedArea,
} from "./styled";

import setDebugMode from "../../actions/setDebugMode";
import { css } from "@emotion/css";

export const DialogStyles = css`
    background-color: transparent !important;
`
export default function SettingsDialog({ open, onClose }: any) {
    const dispatch = useDispatch();
    const theme = useSelector((store: any) => store.theme);
    const autoTheme = useSelector((store: any) => store.autoTheme)
    const debugMode = useSelector((store: any) => store.debugMode);

    const [embedEdited, setEmbedEdited] = useState(
        getEmbed(window.location.href)
    );

    const [themeSet, setThemeSet] = useState(theme);
    const [autoThemeLocal, setLocalAutoTheme] = useState(autoTheme);
    useEffect(() => {
        setLocalAutoTheme(autoTheme)
    }, [autoTheme, setLocalAutoTheme])
    function getEmbed(url: string) {
        return url + "&isEmbed=true";
    }

    useEffect(() => {
        setEmbedEdited(getEmbed(window.location.href));
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);

    useEffect(() => {
        setThemeSet(theme);
    }, [theme, setThemeSet]);


    function handleThemeSwitch() {
        const switchedTheme = themeSet === "light" ? "dark" : "light"
        dispatch(setTheme(switchedTheme));
        setThemeSet(switchedTheme);
        localStorage.setItem("theme", JSON.stringify({ theme: switchedTheme, auto: autoThemeLocal }));
    }

    const handleAutoTheme = (val: any) => {
        const switchedAutoTheme = !autoThemeLocal
        dispatch(setAutoTheme(switchedAutoTheme))
        setLocalAutoTheme(switchedAutoTheme);
        localStorage.setItem("theme", JSON.stringify({ theme: theme, auto: switchedAutoTheme }));
    }

    function handleClose() {
        dispatch(setSettingsDialogOpen(false));
    }

    function handleEmbedChange(e: any) {
        setEmbedEdited(e.target.value);
    }
    
    function handleDebugSwitch() {
        dispatch(setDebugMode(debugMode ? false : true));
        localStorage.setItem(
            "isDebug",
            JSON.stringify({ isActive: debugMode ? false : true })
        );
    }

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{
            classes: {
                root: DialogStyles
            }
          }}>
            <SettingCont>
                <SettingHeader>
                    <h3>Settings</h3>
                    <SettingCloseBtn onClick={handleClose}>
                        {" "}
                        <CloseIcon />{" "}
                    </SettingCloseBtn>
                </SettingHeader>

                <SettingsInputContainer>
                    <InputGroup>
                        <SettingLabel>Theme: {theme}</SettingLabel>
                        <Switch
                            size={'small'}
                            checked={themeSet === "dark"}
                            onChange={handleThemeSwitch}
                            disabled={autoThemeLocal}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                        <Tooltip title="Theme determined by your system preferenes">
                            <SettingLabel>Automatic theme detection <InfoIcon fontSize={'inherit'}/> </SettingLabel>
                        </Tooltip>
                        <Switch
                            size={'small'}
                            checked={autoThemeLocal}
                            onChange={handleAutoTheme}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    </InputGroup>

                    <InputGroup>
                        <SettingLabel>Set Debug Mode</SettingLabel>
                        <Switch
                        size={'small'}
                            checked={debugMode}
                            onChange={handleDebugSwitch}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    </InputGroup>
                    <InputGroup>
                        <SettingLabel>Embed View</SettingLabel>
                        <EmbedArea
                            rows="8"
                            value={embedEdited}
                            onChange={handleEmbedChange}
                        ></EmbedArea>
                    </InputGroup>
                </SettingsInputContainer>
            </SettingCont>
        </Dialog>
    );
}
