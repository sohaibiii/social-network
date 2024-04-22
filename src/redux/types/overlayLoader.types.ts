export const SLICE_NAME = "overlayLoader";

export interface OverlayLoaderInterface {
  visible?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  mode?: "color" | "image";
}
