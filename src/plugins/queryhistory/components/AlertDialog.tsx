import { useState } from "react";
import {
    ClearHistoryButton,
    DialogCancelButton,
    DialogConfirmButton,
} from "../styled";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { useSelector } from "react-redux";
import { themes } from "../../../theme/themes";
import styled from "@emotion/styled";
import { DialogStyles } from "../../settingsdialog/SettingsDialog";
const AlertCont = styled.div`
    background: ${({theme}: any) => theme.widgetContainer};
    #alert-dialog-title {
        color: ${({theme}: any) => theme.textColor};
    }
    #alert-dialog-description {
        color: ${({theme}: any) => theme.textOff};
        font-weight: normal;
    }
`;
export default function AlertDialog({ clearHistory, dialogType }: any) {
    const [open, setOpen] = useState(false);
    const theme = useSelector((store: any) => store.theme);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function handleClearHistory() {
        clearHistory();
        setOpen(false);
    }
    const _themes: any = themes;
    return (
        <ThemeProvider theme={_themes[theme]}>
            <div>
                <Tooltip title={"Clear Query History"}>
                    <ClearHistoryButton onClick={handleClickOpen}>
                        {"Clear History"}
                    </ClearHistoryButton>
                </Tooltip>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        classes: {
                            root: DialogStyles
                        }
                      }}
                >
                    <AlertCont>
                        <DialogTitle id="alert-dialog-title">
                            Are you sure you want to clear the {dialogType}{" "}
                            History?
                        </DialogTitle>

                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Click ‘Clear History’ to delete your{" "}
                                {dialogType} history permanently
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <DialogCancelButton onClick={handleClose}>
                                Cancel
                            </DialogCancelButton>
                            <DialogConfirmButton
                                onClick={handleClearHistory}
                                autoFocus
                            >
                                Clear History
                            </DialogConfirmButton>
                        </DialogActions>
                    </AlertCont>
                </Dialog>
            </div>
        </ThemeProvider>
    );
}
