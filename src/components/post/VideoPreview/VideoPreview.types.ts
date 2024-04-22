import { LoadError } from "react-native-video";

export interface VideoPreviewProps {
  uri: string;
  thumbnail: string;
  onError: (_error: LoadError) => void;
  resizeMode: "stretch" | "cover" | "contain" | "none" | undefined;
}
