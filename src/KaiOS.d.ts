declare module '*.scss';


interface DOMRequset {
    onsuccess: (result: { target: any }) => void
    onerror: (error: any) => void
}

declare interface Navigator {
    mozWifiManager: {
        getKnownNetworks: () => DOMRequset;
        setHttpProxy: (network: any, info: { httpProxyHost: string, httpProxyPort: number } | null) => DOMRequset;
    };
};