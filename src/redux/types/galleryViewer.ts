export const SLICE_NAME = "galleryViewer";

export interface GalleryViewerProps {
  data?: any[];
  isVisible?: boolean;
  disableThumbnailPreview?: boolean;
  currentIndex?: number;
  hideSource?: boolean;
  sourceType: string;
  sourceIdentifier: string;
  isReview: boolean;
  reviewID: string;
}
