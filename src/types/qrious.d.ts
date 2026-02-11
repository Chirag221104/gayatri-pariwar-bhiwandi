declare module 'qrious' {
    interface QRiousOptions {
        element?: HTMLCanvasElement;
        background?: string;
        backgroundAlpha?: number;
        foreground?: string;
        foregroundAlpha?: number;
        level?: 'L' | 'M' | 'Q' | 'H';
        mime?: string;
        padding?: number;
        size?: number;
        value?: string;
    }

    export default class QRious {
        constructor(options?: QRiousOptions);
        toDataURL(mime?: string): string;
    }
}
