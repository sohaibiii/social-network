interface OverlayLoaderInterface {
  title?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  mode?: "color" | "image";
}

export enum OverlayLoaderBackground {
  COLOR = "color",
  IMAGE = "image"
}
export type OverlayLoaderTypes = OverlayLoaderInterface;
