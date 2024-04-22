import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GalleryViewerProps, SLICE_NAME } from "~/redux/types/galleryViewer";

const INITIAL_BOTTOM_SHEET_LOADER_STATE: GalleryViewerProps = {
  data: [],
  isVisible: false,
  disableThumbnailPreview: false,
  currentIndex: 0,
  hideSource: false,
  sourceType: "",
  sourceIdentifier: "",
  isReview: false,
  reviewID: ""
};

export const galleryViewer = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_BOTTOM_SHEET_LOADER_STATE,
  reducers: {
    showGalleryViewer: (state, action: PayloadAction<GalleryViewerProps>) => ({
      ...state,
      ...action.payload
    }),
    hideGalleryViewer: (state, action: PayloadAction<GalleryViewerProps>) => ({
      ...state,
      ...INITIAL_BOTTOM_SHEET_LOADER_STATE
    })
  }
});

// Action creators are generated for each case reducer function
export const { showGalleryViewer, hideGalleryViewer } = galleryViewer.actions;

export default galleryViewer.reducer;
