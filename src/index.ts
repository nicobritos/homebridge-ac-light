import {API, HAP} from 'homebridge';
import {LightAccessory} from './accessories/LightAccessory';

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
    hap = api.hap;
    api.registerAccessory("nico-esp8266-light", LightAccessory);
};
