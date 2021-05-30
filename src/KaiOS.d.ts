declare module '*.scss';


interface DOMRequset {
    onsuccess: (result: { target: any }) => void
    onerror: (error: any) => void
}

declare interface HttpProxyInfo {
    httpProxyHost: string | null;
    httpProxyPort: number | null;
}

declare interface Navigator {
    mozWifiManager: {
        getKnownNetworks: () => DOMRequset;
        setHttpProxy: (network: any, info: HttpProxyInfo) => DOMRequset;
    };
};