import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SocialInterface, SLICE_NAME } from "~/redux/types/social.types";

const INITIAL_SOCIAL_STATE: SocialInterface = {
  isEdit: false,
  editCommentText: "",
  isReplyOnComment: false,
  commentIndex: undefined,
  replyCommentText: "",
  originalCommentorName: "",
  isOriginalCommentInReplyDetails: false
};

export const socialSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_SOCIAL_STATE,
  reducers: {
    setEditComment: (state, action: PayloadAction<SocialInterface>) => ({
      ...state,
      editCommentText: action.payload.editCommentText,
      isEdit: true,
      commentIndex: action.payload.commentIndex,
      isOriginalCommentInReplyDetails: action.payload.isOriginalCommentInReplyDetails
    }),
    clearEditComment: (state, action: PayloadAction<SocialInterface>) => ({
      ...state,
      ...INITIAL_SOCIAL_STATE,
      commentIndex: undefined
    }),
    setReplyOnComment: (state, action: PayloadAction<SocialInterface>) => ({
      ...state,
      isReplyOnComment: true,
      ...action.payload
    }),
    clearReplyOnComment: (state, action: PayloadAction<SocialInterface>) => ({
      ...state,
      ...INITIAL_SOCIAL_STATE
    })
  }
});

export const {
  setEditComment,
  clearEditComment,
  setReplyOnComment,
  clearReplyOnComment
} = socialSlice.actions;

export default socialSlice.reducer;
