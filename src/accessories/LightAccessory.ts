import {
    Service,
    CharacteristicValue,
    CharacteristicSetCallback,
    CharacteristicGetCallback, AccessoryConfig, API, Logging,
    CharacteristicEventTypes,
    HAP,
} from 'homebridge';
import {Light} from '../models/Light';
import {LightAPI} from '../api/LightAPI';
import {AccessoryPlugin} from 'homebridge/lib/api';
import {APIUtils} from '../api/APIUtils';

interface LightConfiguration extends AccessoryConfig {
    url: string | undefined
}

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class LightAccessory implements AccessoryPlugin {
    private informationService: Service;
    private service: Service;
    private light: Light = new Light();
    private log: Logging;
    private hap: HAP;
    private config: LightConfiguration;

    constructor(log: Logging, config: AccessoryConfig, api: API) {
        this.log = log;
        this.hap = api.hap;
        this.config = config as LightConfiguration;

        if (!this.config.url) {
            throw new Error("URL not supplied");
        }

        APIUtils.URL = this.config.url;

        this.service = new this.hap.Service.Lightbulb(config.name);

        // register handlers for the On/Off Characteristic
        this.service.getCharacteristic(this.hap.Characteristic.On)
            .on(CharacteristicEventTypes.SET, this.setOn.bind(this))
            .on(CharacteristicEventTypes.GET, this.getOn.bind(this));

        // set accessory information
        this.informationService = new this.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Nico')
            .setCharacteristic(this.hap.Characteristic.Model, 'ESP8266')
            .setCharacteristic(this.hap.Characteristic.SerialNumber, 'Nico-Light-With-Bug');
    }

    public getServices(): Service[] {
        return [
            this.informationService,
            this.service
        ];
    }

    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    private async setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        // implement your own code to turn your device on/off
        this.light.on = value as boolean;

        try {
            let response = await LightAPI.setPower(this.light.on);
            if (response.data.status != 0) {
                this.log.error("Error setting light status: Status is not zero: " + response.data.status);
                callback(new Error("Status is not zero"));
            } else {
                callback(null, this.light.on);
            }
        } catch (e) {
            this.log.error("Error setting light status: " + e);
            callback(e);
        }
    }

    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     *
     * GET requests should return as fast as possbile. A long delay here will result in
     * HomeKit being unresponsive and a bad user experience in general.
     *
     * If your device takes time to respond you should update the status of your device
     * asynchronously instead using the `updateCharacteristic` method instead.

     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    private getOn(callback: CharacteristicGetCallback) {
        this.refreshState();

        // the first argument should be null if there were no errors
        // the second argument should be the value to return
        callback(null, this.light.on);
    }

    /**
     * This function refreshes the device's state async
     * @private
     */
    private refreshState(): void {
        LightAPI.getState()
            .then(value => {
                this.light.on = !!value.data.setPower;
                this.light.overrideButton = !!value.data.overrideBut;
                this.light.overrideWifi = !!value.data.overrideWifi;

                this.service.updateCharacteristic(this.hap.Characteristic.On, this.light.on);
            })
            .catch(reason => {
                this.log.error("Error getting state for light bulb: " + reason);
            });
    }
}
