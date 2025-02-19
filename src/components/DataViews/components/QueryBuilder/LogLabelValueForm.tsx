import { useMemo, useRef, useState } from "react";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { OPERATOR_OPTIONS } from "./consts";
import {  LabelValueContStyles, FlexCenter, IconStyle } from "./styles";
import { cx } from "@emotion/css";
import { useTheme } from "./hooks";
import { InputSelect } from "./InputSelect";
import useLogLabelValues from "./hooks/useLogLabelValues";


export const LogLabelValueForm = (props: any) => {
    const {
        keyVal,
        labelOpts,
        labelAdd,
        labelRemove,
        onChange,
        labelValuesLength,
        id,
        dataSourceId,
    } = props;


    const optRef = useRef<any>(null);
    const operatorRef = useRef<any>(null);
    const valueRef = useRef<any>(null);

    const mainTheme = useTheme()

   
    const [localKeyVal, setLocalKeyVal] = useState(keyVal);

    const [labelValue, setLabelValue] = useState(
        labelOpts[0] || { label: "Select Option", value: "" }
    );
    
    const {logsResponse:valueSelectOpts} = useLogLabelValues(dataSourceId,labelValue.value)

    const [operatorValue, setOperatorValue] = useState({
        label: "=",
        value: "equals",
    });

    const onLabelChange = (e: any) => {
        const { value, id } = e;

        setLabelValue((_: any) => ({
            value: value?.value,
            label: value?.value,
        }));
        const prevKeyVal = JSON.parse(JSON.stringify(localKeyVal));
        const newKeyVal = {
            ...prevKeyVal,
            label: value?.label,
            value: value.value,
            id,
        };
        onChange(newKeyVal);
        setLocalKeyVal((prev: any) => {
            return { ...prev, label: value?.value };
        });
    };

    const onValueChange = (e: any) => {
        const { value, id } = e;
        let values: any = [];
        let next = value !== null ? value : { label: "", value: "" };
        if (isMulti && Array.isArray(next)) {
            values = next?.map((e: any) => e.value);
        } else {
            values = [next.value];
        }

        const prevKeyVal = JSON.parse(JSON.stringify(localKeyVal));
        const newKeyVal = { ...prevKeyVal, values, id };
        onChange(newKeyVal);
        setLocalKeyVal((prev: any) => ({ ...prev, values }));
    };

    const onOperatorChange = (e: any) => {
        const { value, id } = e;
        const prevKeyVal = JSON.parse(JSON.stringify(localKeyVal));
        const newKeyVal = { ...prevKeyVal, operator: value?.value, id };
        onChange(newKeyVal);
        setOperatorValue((_: any) => {
            return { ...value };
        });
        setLocalKeyVal((prev: any) => ({ ...prev, operator: value?.value }));
    };

    const cleanAndRemove = (e: any) => {
        if (optRef?.current && operatorRef?.current && valueRef?.current) {
            labelRemove(keyVal.id);
        }
    };

    const isMulti = useMemo(() => {
        if (
            operatorValue.value === "regexequals" ||
            operatorValue.value === "regexexclude"
        ) {
            return true;
        }
        return false;
    }, [operatorValue.value]);


    if(labelValuesLength > 0) {
       return (
            <div id={id} className={cx(LabelValueContStyles)}>
                <InputSelect
                    ref={optRef}
                    type={"label"}
                    isMulti={false}
                    defaultValue={keyVal.label}
                    selectOpts={labelOpts}
                    mainTheme={mainTheme}
                    onChange={onLabelChange}
                    keyVal={keyVal}
                    objId={id}
                    minWidth={100}
                    labelsLength={labelValuesLength}
                />

                <InputSelect
                    ref={operatorRef}
                    type={"operator"}
                    isMulti={false}
                    defaultValue={keyVal.operator}
                    selectOpts={OPERATOR_OPTIONS}
                    keyVal={keyVal}
                    mainTheme={mainTheme}
                    onChange={onOperatorChange}
                    objId={id}
                    minWidth={60}
                    labelsLength={labelValuesLength}
                />
                <div className={cx(FlexCenter)}>
                    <InputSelect
                        ref={valueRef}
                        type={"value"}
                        isMulti={isMulti}
                        defaultValue={keyVal.values}
                        selectOpts={valueSelectOpts}
                        keyVal={keyVal}
                        mainTheme={mainTheme}
                        onChange={onValueChange}
                        objId={id}
                        minWidth={250}
                        labelsLength={labelValuesLength}
                    />
                    <RemoveOutlinedIcon
                        className={cx(IconStyle(mainTheme))}
                        style={{height:'14px', width:'14px'}}
                        onClick={cleanAndRemove}
                    />
                    <AddOutlinedIcon
                        className={cx(IconStyle(mainTheme))}
                        style={{height:'14px', width:'14px'}}
                        onClick={labelAdd}
                    />
                </div>
            </div>
        );
    }

    return null
};


