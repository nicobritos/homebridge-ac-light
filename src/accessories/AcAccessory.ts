// import {
//     Service,
//     PlatformAccessory,
//     CharacteristicValue,
//     CharacteristicSetCallback,
//     CharacteristicGetCallback,
// } from 'homebridge';
// import {ExampleHomebridgePlatform} from '../platform';
// import {Light} from '../models/Light';
// import {LightAPI} from '../api/LightAPI';
//
// /**
//  * Platform Accessory
//  * An instance of this class is created for each accessory your platform registers
//  * Each accessory may expose multiple services of different service types.
//  */
// export class LightAccessory {
//     private service: Service;
//     private light: Light = new Light();
//
//     constructor(
//         private readonly platform: ExampleHomebridgePlatform,
//         private readonly accessory: PlatformAccessory,
//     ) {
//         // set accessory information
//         this.accessory.getService(this.platform.Service.AccessoryInformation)!
//             .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Nico')
//             .setCharacteristic(this.platform.Characteristic.Model, 'ESP8266')
//             .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Nico-Light-With-Bug');
//
//         // get the LightBulb service if it exists, otherwise create a new LightBulb service
//         this.service = this.accessory.getService(this.platform.Service.Lightbulb)
//                        || this.accessory.addService(this.platform.Service.Lightbulb);
//
//         // set the service name, this is what is displayed as the default name on the Home app
//         // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
//         this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
//
//         // register handlers for the On/Off Characteristic
//         this.service.getCharacteristic(this.platform.Characteristic.On)
//             .on('set', this.setOn.bind(this))                // SET - bind to the `setOn` method below
//             .on('get', this.getOn.bind(this));               // GET - bind to the `getOn` method below
//     }
//
//     /**
//      * Handle "SET" requests from HomeKit
//      * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
//      */
//     async setOn(value: CharacteristicValue, callback: CharacteristicSetCallback) {
//         // implement your own code to turn your device on/off
//         this.light.on = value as boolean;
//
//         try {
//             let response = await LightAPI.setPower(this.light.on);
//             if (response.data.status !== 0) {
//                 this.platform.log.error("Error setting light status: Status is not zero: " + response.data.status);
//                 callback(new Error("Status is not zero"));
//             } else {
//                 callback(null, this.light.on);
//             }
//         } catch (e) {
//             this.platform.log.error("Error setting light status: " + e);
//             callback(e);
//         }
//     }
//
//     /**
//      * Handle the "GET" requests from HomeKit
//      * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
//      *
//      * GET requests should return as fast as possbile. A long delay here will result in
//      * HomeKit being unresponsive and a bad user experience in general.
//      *
//      * If your device takes time to respond you should update the status of your device
//      * asynchronously instead using the `updateCharacteristic` method instead.
//
//      * @example
//      * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
//      */
//     getOn(callback: CharacteristicGetCallback) {
//         this.refreshState();
//
//         // the first argument should be null if there were no errors
//         // the second argument should be the value to return
//         callback(null, this.light.on);
//     }
//
//     /**
//      * This function refreshes the device's state async
//      * @private
//      */
//     private refreshState(): void {
//         LightAPI.getState()
//             .then(value => {
//                 this.light.on = !!value.data.setPower;
//                 this.light.overrideButton = !!value.data.overrideBut;
//                 this.light.overrideWifi = !!value.data.overrideWifi;
//
//                 this.service.updateCharacteristic(this.platform.Characteristic.On, this.light.on);
//             })
//             .catch(reason => {
//                 this.platform.log.error("Error getting state for light bulb: " + reason);
//             });
//     }
// }
