import { UriProps } from "react-native-svg/src/xml";

interface SvgUriWithFallbackInterface extends UriProps {
  fallbackIcon: JSX.Element;
}

export type SvgUriWithFallbackType = SvgUriWithFallbackInterface;
