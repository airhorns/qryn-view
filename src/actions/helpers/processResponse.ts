import getTimeParams from "./getTimeParams";
import { QueryResult } from "../types";
import store from "../../store/store";
import setIsEmptyView from "../setIsEmptyView";
import { parseResponse } from "./parseResponse";
import { resetNoData } from "./resetNoData";
import setResponseType from "../setResponseType";

export async function processResponse(response: any, dispatch: Function, panel:string,id:string) {
    const { time } = getTimeParams();
      const { queryType, debugMode } = store.getState();
    if (response?.data?.streams?.length === 0) {
        if (debugMode)
            console.log("🚧 loadLogs / getting no data from streams");
        dispatch(setIsEmptyView(true));
    }
    
    if (response?.data?.data) {
        const result = response?.data?.data?.result;
        const type = response?.data?.data?.resultType;

        dispatch(setResponseType(type))
        
        const resultQuery: QueryResult = {
            result,
            time,
            debugMode,
            queryType,
            dispatch,
            type,
            panel,
            id
        };

        parseResponse(resultQuery);
    } else {
        resetNoData(dispatch);
    }
}
