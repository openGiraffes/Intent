declare module '*.scss';


interface DOMRequset {
    onsuccess: (result: { target: any }) => void
    onerror: (error: any) => void
}

declare interface HttpProxyInfo {
    httpProxyHost: string | null;
    httpProxyPort: number | null;
}

declare interface SettingsManager {
    createLock: () => SettingsLock;
}

declare interface SettingsLock {
    get: (name: string) => {
        onsuccess: () => void;
        result: { [key: string]: any };
    };
    set: (data: { [key: string]: any }) => void;
}

declare interface Navigator {
    mozWifiManager: {
        getKnownNetworks: () => DOMRequset;
        setHttpProxy: (network: any, info: HttpProxyInfo) => DOMRequset;
    };
    mozApps: {
        mgmt: {
            getAll: () => DOMRequset
        }
    };
    mozSettings: SettingsManager;
};

declare interface Window {
    KaiAd: any;
    MozActivity: any;
    Kaipay: any;
};
