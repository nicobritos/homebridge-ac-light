import axios, {AxiosResponse} from 'axios';
import * as url from 'url';

export type NumericBoolean = 1 | 0;

export abstract class APIUtils {
    static URL: string;

    static get<T>(path: string): Promise<AxiosResponse<T>> {
        return axios.get(url.resolve(APIUtils.URL, path));
    }

    static post<T>(path: string, payload: Record<string, unknown>): Promise<AxiosResponse<T>> {
        return axios.post(
            url.resolve(APIUtils.URL, path),
            payload,
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        );
    }
}
