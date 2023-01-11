import axios, { AxiosError, AxiosResponse } from "axios";
import setDataSources from "../DataSources/store/setDataSources";
import { setShowDataSourceSetting } from "./setShowDataSourceSetting";


// updateDataSources:

export function updateDataSourcesWithUrl(
    dispatch: any,
    url: any,
    cookies: any,
    haveUrl: any,
    haveCookies: any,
    dataSources: any
) {
    let apiUrl = "";
    let basicAuth = false;
    let urlApi = false;
    let cookieAuth: any = {};

    if (haveUrl) {
        urlApi = true;
    }

    if (haveCookies) {
        let [auth, dsData] = cookies.split("@");
        let cookieDsData = "";
        if (dsData && dsData !== "") {
            try {
                cookieDsData = atob(dsData);
                cookieDsData = JSON.parse(cookieDsData);
                if (typeof cookieDsData === "object" && cookieDsData["url"]) {
                    apiUrl = cookieDsData["url"];
                    haveUrl = true;
                    urlApi = true;
                }
            } catch (e) {
                console.log(e);
            }
        }

        let [user, pass] = auth.split(":");

        if (user !== "" && pass !== "") {
            cookieAuth = { user, password: pass };
            basicAuth = true;
        }
    }

    if (!haveUrl && basicAuth) {
        apiUrl = window.location.protocol + "//" + window.location.host;
        urlApi = true;
    }

    if (apiUrl === "") {
        urlApi = true;
        apiUrl = url;
    }

    const dsCP = [...dataSources];
    const prevDs = JSON.parse(JSON.stringify(dsCP));

    const newDs = prevDs?.map((m: any) => ({
        ...m,
        url: urlApi ? apiUrl : m.url,
        auth: {
            ...m.auth,
            basicAuth: { ...m.auth.basicAuth, value: basicAuth },
            fields: {
                ...m.auth.fields,
                basicAuth: basicAuth
                    ? [...m.auth.fields.basicAuth]?.map((ba) => {
                          if (ba.name === "user") {
                              return { ...ba, value: cookieAuth.user };
                          }
                          if (ba.name === "password") {
                              return { ...ba, value: cookieAuth.password };
                          }
                          return ba;
                      })
                    : [...m.auth.fields.basicAuth],
            },
        },
    }));

    if (cookies && cookieAuth) {
        dispatch(setShowDataSourceSetting(false));
    }

    localStorage.setItem("dataSources", JSON.stringify(newDs));
    dispatch(setDataSources(newDs));
}

export const getAxiosConf = () => {
    let conf: any = {};

    conf.validateStatus = (status: number) => {
        return (
            (status >= 200 && status < 300) || status === 404 || status === 500
        );
    };
    return conf;
};

export const getReadyResponse = async (url: string, conf: any, response: any) =>
    await axios
        .get(`${url}/ready`, conf)
        .then((res: AxiosResponse) => {
            if (res) {
                response = res.status;
                return response;
            }
        })
        .catch((e: AxiosError) => {
           return e
        })
        .finally(() => {
            return response;
        });

export async function checkLocalAPI(url: string) {
    let response: any = {};
    let conf = getAxiosConf();
    let isReady = false;
    try {
        let res = await getReadyResponse(url, conf, response);
        response = res;
    } catch (e: any) {
        isReady = false;
    } finally {
        if (!response || response === 404 || response === 500) {
            isReady = false;
        } else {
            isReady = true;
        }
    }
    return isReady;
}

export async function updateDataSourcesFromLocalUrl(
    dataSources: any,
    dispatch: Function,
    navigate: Function
) {
    const location = window.location.origin;
    const logsDs = dataSources.find((f: any) => f.type === "logs");
    let isLocalReady = false;

    const dsReady = await checkLocalAPI(logsDs.url);
    if (!dsReady) {
        isLocalReady = await checkLocalAPI(location);
    }

    if (isLocalReady && !dsReady) {
        const dsCP = [...dataSources];
        const prevDs = JSON.parse(JSON.stringify(dsCP));

        const newDs = prevDs?.map((m: any) => ({
            ...m,
            url: location,
        }));
        localStorage.setItem("dataSources", JSON.stringify(newDs));
        dispatch(setDataSources(newDs));
    } else if (!dsReady && !isLocalReady) {
        navigate("datasources");
    }
}