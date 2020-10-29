import {APIUtils, NumericBoolean} from './APIUtils';
import {AxiosResponse} from 'axios';

interface LightOptions {
    "setPower": NumericBoolean,
    "overrideBut": NumericBoolean,
    "overrideWifi": NumericBoolean
}

/**
 * status is zero if the request was executed successfully
 */
interface PostLightResponse {
    "status": number
}

export abstract class LightAPI {
    static lightEndpoint: string;

    static getState(): Promise<AxiosResponse<LightOptions>> {
        return APIUtils.get(this.lightEndpoint);
    }

    static setPower(on: boolean): Promise<AxiosResponse<PostLightResponse>> {
        return APIUtils.post(
            this.lightEndpoint,
            {
                setPower: on ? 1 : 0
            } as Partial<LightOptions>
        );
    }
}
