namespace RushHour {
    export interface User {
        name: string,
        strategy: any,
        latestStep: number | undefined
    }

    export const loginOrSignUp = (user: User) => {
        if (!tryLogin(user.name)) {

            return signUp(user.name)
        }
        return true;
    }

    const baseURL = "https://rushhourgame.net";
    const globals = PropertiesService.getScriptProperties();

    interface Endpoint {
        path: string
        method: "GET" | "POST" | "DELETE"
    }

    const loginURL : Endpoint = { path: "/api/v1/login", method: "POST" };
    const signupURL : Endpoint = { path: "/api/v1/register", method: "POST" };

    const http = (end: Endpoint, opts: any) => {
        switch (end.method) {
            case "GET":
                let params = Object.keys(opts).map(key => `${key}=${opts[key]}`).join("&");
                var url = baseURL + end.path + "?" + params;
                Logger.log("access to " + url);
                return UrlFetchApp.fetch(url);
            default:
                var url = baseURL + end.path;
                Logger.log("access to " + url);
                return UrlFetchApp.fetch(url, {
                    method : end.method == "DELETE" ? "delete" : "post",
                    contentType: "application/json",
                    payload : JSON.stringify(opts)
                });
        }
    };

    interface RushHourResponse {
        status: boolean,
        results: string
    }

    const parse = (res: GoogleAppsScript.URL_Fetch.HTTPResponse) => {
        let code = res.getResponseCode();
        if (code !== 200) {
            throw Error(`response code is ${code}`);
        }
        return JSON.parse(res.getContentText()) as RushHourResponse;
    };

    const genPassword = (name: string) => {
        let key = "CreJTcfTkwKRmz2HzplOahFKrxFwn0SP";
        if (globals.getProperty("key") === null) {
            Logger.log("WARN script property 'key' is not set!");
        } else {
            key = globals.getProperty("key");
        }
        let bin = Utilities.computeHmacSha256Signature(name, key);
        return Utilities.base64Encode(bin);
    }

    const tryLogin = (id: string) => {
        Logger.log(`try login ${id}`);
        let payload = parse(http(loginURL, { id, password: genPassword(id) }));
        Logger.log(`login ${id}: ${payload.status}`);
        return payload.status
    };

    const signUp = (id: string) => {
        Logger.log(`try signUp ${id}`)
        let payload = parse(http(signupURL, { id, name: id, password: genPassword(id), hue: Math.floor(Math.random() * 360) }));
        Logger.log(`signUp ${id}: ${payload.status}`);
        return payload.status
    }
}