import qs from "qs";
import { ApiResponse, HTTPMethod, IApiStore, RequestParams, StatusHTTP } from "./types";

export default class ApiStore implements IApiStore {
    readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        // TODO: Примите из параметров конструктора 
        // и присвойте его в this.baseUrl
    }

    private getRequestData<ReqT>(params: RequestParams<ReqT>): [string, RequestInit] {
        const req: RequestInit = {
            method: params.method,
            headers: { ...params.headers },
        };

        let endpoint = `${this.baseUrl}${params.endpoint}`;


        if (params.method === HTTPMethod.GET) {
            endpoint = `${endpoint}?${qs.stringify(params.data)}`
        }

        if (params.method === HTTPMethod.POST) {
            req.body = JSON.stringify(params.data);
            req.headers = {
                ...req.headers,
                'Content-Type': 'application/json;charset=utf-8'
            }
        }


        return [endpoint, req];
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        // TODO: Напишите здесь код, который с помощью fetch будет делать запрос

        const [endpoint, req] = this.getRequestData(params);

        // fetch(endpoint, req); or simple
        // with spread operator
        try {
            const response = await fetch(...this.getRequestData(params));  // fetch(url, [options])

            if (response.ok) {
                return {
                    success: true,
                    data: await response.json(),
                    status: response.status
                }
            }
            return {
                success: false,
                data: await response.json(),
                status: response.status
            }
        }
        catch (e) { // если иы не смогли распарсить
            return {
                success: false,
                data: e, 
                status: StatusHTTP.UNEXPECTED_ERROR
            }
        }
    }
}