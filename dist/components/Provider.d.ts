/// <reference types="react" />
import { ThemeColors } from "../helpers";
interface IProviderProps {
    name: string;
    logo: string;
    description: string;
    themeColors: ThemeColors;
    isFirst: boolean;
    isLast: boolean;
    onClick: () => void;
}
export declare function Provider(props: IProviderProps): JSX.Element;
export {};
//# sourceMappingURL=Provider.d.ts.map