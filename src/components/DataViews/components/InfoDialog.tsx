import { ThemeProvider } from "@emotion/react";
import { Dialog } from "@mui/material";
import { useSelector } from "react-redux";
import { themes } from "../../../theme/themes";
import { InfoContent } from "./InfoContent";
import { DialogStyles } from "../../../plugins/settingsdialog/SettingsDialog";
export function InfoDialog({
    expr,
    idRef,
    labels,
    queryType,
    limit,
    total,
    onClose,
    open,
}: any) {
    const theme = useSelector((store: any) => store.theme);
    return (
        <ThemeProvider theme={(themes as any)[theme]}>
            <Dialog open={open} onClose={onClose} PaperProps={{
            classes: {
                root: DialogStyles
            }
          }}>
                <InfoContent
                    expr={expr}
                    idRef={idRef}
                    labels={labels}
                    queryType={queryType}
                    limit={limit}
                    total={total}
                />
            </Dialog>
        </ThemeProvider>
    );
}
