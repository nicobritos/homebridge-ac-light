export class Light {
    private _on: boolean;
    private _overrideButton: boolean;
    private _overrideWifi: boolean;

    public get on(): boolean {
        return this._on;
    }

    public set on(value: boolean) {
        this._on = value;
    }

    public get overrideButton(): boolean {
        return this._overrideButton;
    }

    public set overrideButton(value: boolean) {
        this._overrideButton = value;
    }

    public get overrideWifi(): boolean {
        return this._overrideWifi;
    }

    public set overrideWifi(value: boolean) {
        this._overrideWifi = value;
    }
}
