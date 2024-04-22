import { Asset } from "react-native-image-picker";

export interface AddReviewModalProps {
  name: string;
  inputPlaceholder?: string;
  withStars?: boolean;
  initialRate?: number;
  initialText?: string;
  initialGallery?: any[];
  onSubmit: (values: {
    text?: string;
    images?: Asset[];
    rating: number;
    uploadedImageIds?: string[];
  }) => void;
}
