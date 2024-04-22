import { createSlice, PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";
import Config from "react-native-config";

import { getUserInfoThunk } from "../thunk/user.thunk";
import { TimelineClasses } from "../types/home.types";

import {
  getSpecialDestinationsThunk,
  getDynamicTimelineThunk,
  getFreeFeedsTimelineThunk,
  getPostComments,
  getCommentReplies,
  getHomepagePullToRefresh,
  getSponsershipPosts
} from "~/redux/thunk/home.thunk";
import { Comment } from "~/redux/types/comments.types";
import { HomeInterface, SLICE_NAME, TimelineTypes } from "~/redux/types/home.types";
import { Post } from "~/redux/types/posts.types";
import { Reply } from "~/redux/types/replies.types";
import { User } from "~/redux/types/users.types";

const postAdapter = createEntityAdapter<Post>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: post => post.pkey
});

const userAdapter = createEntityAdapter<User>({
  selectId: user => user.id
});

const commentsAdapter = createEntityAdapter<Comment>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: comment => comment.index
});

const repliesAdapter = createEntityAdapter<Reply>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: reply => reply.index
});

const INITIAL_HOME_STATE: HomeInterface = {
  hero: [],
  scrollOffsetValue: 0,
  specialDestinations: [],
  timeline: [],
  timelineData: [],
  isTimelineFinishedLoading: true,
  freeFeeds: { currentPage: 1, pageSize: 10, isLoading: false },
  isRefreshing: false,
  isFetchingRestOfTimelineData: true,
  homepagePartRefresh: false,
  authenticatedIndecies: [],
  users: userAdapter.getInitialState(),
  posts: postAdapter.getInitialState(),
  comments: commentsAdapter.getInitialState({
    isLoading: false,
    lastEvaluatedKey: undefined
  }),
  replies: repliesAdapter.getInitialState({
    isLoading: false,
    lastEvaluatedKey: undefined
  })
};

export const homeSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_HOME_STATE,
  reducers: {
    setScrollOffsetValue: (state, action) => {
      state.scrollOffsetValue = action.payload;
    },
    userAdded: (state, user) => {
      state.users = userAdapter.addOne(state.users, user);
    },
    postAdded: (state, post) => {
      state.posts = postAdapter.addOne(state.posts, post);
    },
    commentAdded: (state, comment) => {
      state.comments = commentsAdapter.addOne(state.comments, comment);
    },
    replyAdded: (state, reply) => {
      state.replies = repliesAdapter.addOne(state.replies, reply);
    },
    userUpserted: (state, action) => {
      state.users = userAdapter.upsertOne(state.users, action.payload);
    },
    postUpserted: (state, action) => {
      state.posts = postAdapter.upsertOne(state.posts, action.payload);
    },
    postDeleted: (state, action) => {
      state.posts = postAdapter.removeOne(state.posts, action.payload);
    },
    replyUpserted: (state, action) => {
      state.replies = repliesAdapter.upsertOne(state.replies, action.payload);
    },
    commentUpserted: (state, action) => {
      state.comments = commentsAdapter.upsertOne(state.comments, action.payload);
    },
    commentDeleted: (state, action) => {
      state.comments = commentsAdapter.removeOne(state.comments, action.payload);
    },
    replyDeleted: (state, action) => {
      state.replies = repliesAdapter.removeOne(state.replies, action.payload);
    },
    clearTimelineData: state => {
      state.timelineData = [];
    },
    clearTimeline: state => {
      state.isTimelineFinishedLoading = false;
      state.timeline = [];
    },
    setTimelineData: (state, action: PayloadAction<HomeInterface>) => {
      state.timelineData = [...action.payload, ...state.timelineData];
      action.payload?.map(res => {
        if (res.type === TimelineTypes.SPONSORSHIP) {
          const sponsorshipUsers = res.data.map(sponsorship => {
            return {
              ...sponsorship.advertiser,
              id: sponsorship.advertiser.profile_image,
              uuid: sponsorship.advertiser.profile_image,
              isFollow: false
            };
          });
          const sponsorshipData = res.data.map(sponsorship => {
            const { advertiser, ...restOfProps } = sponsorship;
            return { ...restOfProps, created_by: advertiser.profile_image };
          });

          state.users = userAdapter.upsertMany(state.users, sponsorshipUsers);
          state.posts = postAdapter.upsertMany(state.posts, sponsorshipData);
        }

        if (res.type === TimelineTypes.FEED) {
          const postUsers = res.data.map(post => {
            return { ...post.created_by, isFollow: post.isFollow };
          });
          const postData = res.data.map(post => {
            const { created_by, isFollow, ...restOfProps } = post;
            return { ...restOfProps, created_by: created_by.id };
          });

          state.users = userAdapter.upsertMany(state.users, postUsers);
          state.posts = postAdapter.upsertMany(state.posts, postData);
        }
      });
      state.isRefreshing = false;
    },
    updateTimelineData: (state, action: PayloadAction<HomeInterface>) => {
      state.timelineData = [...state.timelineData, ...action.payload];
      action.payload?.map(res => {
        if (res.type === TimelineTypes.SPONSORSHIP) {
          const sponsorshipUsers = res.data.map(sponsorship => {
            return {
              ...sponsorship.advertiser,
              id: sponsorship.advertiser.profile_image,
              uuid: sponsorship.advertiser.profile_image,
              isFollow: false
            };
          });
          const sponsorshipData = res.data.map(sponsorship => {
            const { advertiser, ...restOfProps } = sponsorship;
            return { ...restOfProps, created_by: advertiser.profile_image };
          });

          state.users = userAdapter.upsertMany(state.users, sponsorshipUsers);
          state.posts = postAdapter.upsertMany(state.posts, sponsorshipData);
        }

        if (res.type === TimelineTypes.FEED) {
          const postUsers = res.data.map(post => {
            return { ...post.created_by, isFollow: post.isFollow };
          });
          const postData = res.data.map(post => {
            const { created_by, isFollow, ...restOfProps } = post;
            return { ...restOfProps, created_by: created_by.id };
          });

          state.users = userAdapter.upsertMany(state.users, postUsers);
          state.posts = postAdapter.upsertMany(state.posts, postData);
        }
      });
      state.isFetchingRestOfTimelineData = false;
    },
    setFreeFeeds: (state, action: PayloadAction<HomeInterface>) => {
      state.freeFeeds = action.payload;
    },
    setAuthenticateIndecies: (state, action: PayloadAction<HomeInterface>) => {
      state.authenticatedIndecies = action.payload;
    },
    setIsRefreshing: (state, action: PayloadAction<HomeInterface>) => {
      state.isRefreshing = true;
      state.timeline = [];
      state.timelineData = [];
      state.freeFeeds = {};
      state.users = userAdapter.removeAll(state.users);
      state.posts = postAdapter.removeAll(state.posts);
      state.comments = commentsAdapter.removeAll(state.comments);
      state.replies = repliesAdapter.removeAll(state.replies);
    },
    setHomepagePullToRefresh: (state, action: PayloadAction<HomeInterface>) => {
      state.homepagePartRefresh = true;
    },
    loadNewPosts: (state, action: PayloadAction<HomeInterface>) => {
      const postUsers = action.payload.map(post => {
        return {
          ...post.created_by,
          isFollow: post.isFollow
        };
      });
      const postData = action.payload.map(post => {
        const { created_by, isFollow, ...restOfProps } = post;
        return { ...restOfProps, created_by: created_by.id };
      });

      const uniquePostUsers = postUsers.filter(
        (
          s => o =>
            (k => !s.has(k) && s.add(k))(["id", "uuid"].map(k => o[k]).join("|"))
        )(new Set())
      );

      state.users = userAdapter.upsertMany(state.users, uniquePostUsers);
      state.posts = postAdapter.upsertMany(state.posts, postData);
    },
    upsertNewPosts: (state, action: PayloadAction<HomeInterface>) => {
      const postUsers = action.payload.map(post => {
        return {
          ...post.created_by,
          isFollow: post.isFollow
        };
      });
      const postData = action.payload.map(post => {
        const { created_by, isFollow, ...restOfProps } = post;
        return { ...restOfProps, created_by: created_by.id };
      });

      const uniquePostUsers = postUsers.filter(
        (
          s => o =>
            (k => !s.has(k) && s.add(k))(["id", "uuid"].map(k => o[k]).join("|"))
        )(new Set())
      );

      state.users = userAdapter.upsertMany(state.users, uniquePostUsers);
      state.posts = postAdapter.upsertMany(state.posts, postData);
    },
    loadNewUsers: (state, action: PayloadAction<HomeInterface>) => {
      state.users = userAdapter.upsertMany(state.users, action.payload);
    },
    updateLatestReviews: (state, action: PayloadAction<HomeInterface>) => {
      // 1000 represent Id of reviews
      const reviewsTimelineDataIndex = state.timelineData.findIndex(
        timelineItem => timelineItem.id === 1000
      );
      if (reviewsTimelineDataIndex > -1) {
        state.timelineData[reviewsTimelineDataIndex].data = action.payload;
      }
    },
    updateLatestPosts: (state, action: PayloadAction<HomeInterface>) => {
      const timelineFeedIndex = state.timelineData.findIndex(
        timelineItem => timelineItem.type === "feed"
      );

      state.timelineData[timelineFeedIndex].data = state.timelineData[
        timelineFeedIndex
      ].data.filter(item => !item.is_new_post);

      const newPosts = action.payload.filter(
        x =>
          !state.posts.ids.includes(x.pkey) || state.posts?.entities[x.pkey]?.is_new_post
      );

      if (timelineFeedIndex > -1 && newPosts.length > 0) {
        const index = action.payload.indexOf(newPosts[0]);
        state.timelineData[timelineFeedIndex].data = [
          ...state.timelineData[timelineFeedIndex].data.slice(0, index),
          ...newPosts,
          ...state.timelineData[timelineFeedIndex].data.slice(index)
        ];
      }
    },
    addPostToTimelineHead: (state, action: PayloadAction<HomeInterface>) => {
      const reviewsTimelineDataIndex = state.timelineData.findIndex(
        timelineItem => timelineItem.type === "feed"
      );

      if (reviewsTimelineDataIndex > -1) {
        const newPost = action.payload;
        state.timelineData[reviewsTimelineDataIndex].data = [newPost].concat(
          state.timelineData[reviewsTimelineDataIndex].data
        );
      }
    },
    upsertSponsorshipPost: (state, action: PayloadAction<HomeInterface>) => {
      const sponserships = action.payload;
      const sponsorshipUsers = sponserships.map(sponsorship => {
        return {
          ...sponsorship.advertiser,
          id: sponsorship.advertiser.profile_image,
          uuid: sponsorship.advertiser.profile_image,
          isFollow: false
        };
      });
      const sponsorshipData = sponserships.map(sponsorship => {
        const { advertiser, ...restOfProps } = sponsorship;
        return { ...restOfProps, created_by: advertiser.profile_image };
      });

      state.users = userAdapter.upsertMany(state.users, sponsorshipUsers);
      state.posts = postAdapter.upsertMany(state.posts, sponsorshipData);
    }
  },
  extraReducers: builder => {
    builder.addCase(getSpecialDestinationsThunk.fulfilled, (state, { payload }) => {
      state.hero = payload?.hero ?? [];
      state.specialDestinations = payload?.specialDestinations ?? [];
    });

    builder.addCase(getDynamicTimelineThunk.pending, (state, { payload }) => {
      state.isTimelineFinishedLoading = false;
    });
    builder.addCase(getDynamicTimelineThunk.rejected, (state, { payload }) => {
      state.isTimelineFinishedLoading = true;
    });
    builder.addCase(getDynamicTimelineThunk.fulfilled, (state, { payload }) => {
      state.isTimelineFinishedLoading = true;
      state.timeline = payload?.timeline ?? [];
    });
    builder.addCase(getHomepagePullToRefresh.fulfilled, (state, { payload }) => {
      state.homepagePartRefresh = false;
    });

    builder.addCase(getHomepagePullToRefresh.rejected, (state, { payload }) => {
      state.homepagePartRefresh = false;
    });

    builder.addCase(getFreeFeedsTimelineThunk.pending, (state, { payload }) => {
      state.freeFeeds.isLoading = true;
    });
    builder.addCase(getFreeFeedsTimelineThunk.rejected, (state, { payload }) => {
      state.freeFeeds.isLoading = false;
    });
    builder.addCase(getFreeFeedsTimelineThunk.fulfilled, (state, { payload }) => {
      state.freeFeeds.currentPage =
        +state.freeFeeds.currentPage + state.freeFeeds.pageSize || 0;

      state.freeFeeds.isLoading = false;

      const postUsers = payload.map(post => {
        // const userId = state.users.ids.find(id => post.created_by.id === id);
        // const oldUserPostIds = userId ? state.users.entities[userId]?.postIds : [];
        // return { ...post.created_by, postIds: oldUserPostIds.concat([post.pkey]) };

        return { ...post.created_by, isFollow: post.isFollow };
      });

      const postData = payload.map(post => {
        const { created_by, isFollow, ...restOfProps } = post;
        return { ...restOfProps, created_by: created_by.id };
      });

      state.users = userAdapter.upsertMany(state.users, postUsers);
      state.posts = postAdapter.upsertMany(state.posts, postData);
      state.timelineData.push({ type: "free-feeds", data: payload });
    });
    builder.addCase(getPostComments.fulfilled, (state, { payload }) => {
      const comments = payload?.Items?.map(comment => {
        const { created_by, pkey, ...restOfComment } = comment;
        return {
          ...restOfComment,
          created_by: created_by.id,
          post_pkey: pkey
        };
      });
      const commentUsers = payload?.Items?.map(post => {
        const { created_by, isFollow } = post;
        if (typeof isFollow === "boolean") {
          return { ...created_by, isFollow: isFollow };
        }
        return { ...created_by };
      });

      state.users = userAdapter.upsertMany(state.users, commentUsers);
      state.comments = commentsAdapter.upsertMany(state.comments, comments);
      state.comments.isLoading = false;
      state.comments.lastEvaluatedKey = payload.LastEvaluatedKey || undefined;
    });
    builder.addCase(getPostComments.pending, (state, { payload }) => {
      state.comments.isLoading = true;
    });
    builder.addCase(getPostComments.rejected, (state, { payload }) => {
      state.comments.isLoading = false;
    });
    builder.addCase(getCommentReplies.fulfilled, (state, { payload }) => {
      const replies = payload?.Items?.map(comment => {
        const { created_by, pkey, timestamp, ...restOfComment } = comment;
        return {
          ...restOfComment,
          created_by: created_by.id,
          commentIndex: timestamp
        };
      });
      const commentRepliesUsers = payload?.Items?.map(post => {
        const { created_by, isFollow } = post;
        if (typeof isFollow === "boolean") {
          return { ...created_by, isFollow: isFollow };
        }
        return { ...created_by };
      });

      state.users = userAdapter.upsertMany(state.users, commentRepliesUsers);
      state.replies = repliesAdapter.upsertMany(state.replies, replies);

      state.replies.isLoading = false;
      state.replies.lastEvaluatedKey = payload.LastEvaluatedKey || undefined;
    });
    builder.addCase(getCommentReplies.pending, (state, { payload }) => {
      state.replies.isLoading = true;
    });
    builder.addCase(getCommentReplies.rejected, (state, { payload }) => {
      state.replies.isLoading = false;
    });
    builder.addCase(getUserInfoThunk.fulfilled, (state, { payload }) => {
      const { id, name, country, gender, profile, profile_image, roles, verified } =
        payload?.userInfo ?? {};

      // workaround
      // this is because backend most API return profile_image as id but in this case full url why i dont know
      // what i do is split the string and get the id as needed later on
      let profileImageId = "";
      try {
        profileImageId = profile_image
          .split(`${Config.AVATAR_MEDIA_PREFIX}/`)[1]
          .split("_")[0];
      } catch (error) {
        const profileImageId = profile_image;
      }
      state.users = userAdapter.addOne(state.users, {
        id,
        name,
        gender,
        uuid: id,
        country_code: country?.id,
        country: country?.name,
        profile_image: profileImageId,
        profile,
        roles,
        verified
      });
    });
    builder.addCase(getSponsershipPosts.fulfilled, (state, { payload }) => {
      const sponsorshipTimelineDataIndex = state.timelineData.findIndex(
        timelineItem => timelineItem.type === "sponsorship"
      );

      if (sponsorshipTimelineDataIndex > -1) {
        state.timelineData[sponsorshipTimelineDataIndex].data = payload;
      }
    });
  }
});
export const postsSelectors = postAdapter.getSelectors(state => state.home.posts);
export const usersSelectors = userAdapter.getSelectors(state => state.home.users);
export const commentsSelectors = commentsAdapter.getSelectors(
  state => state.home.comments
);

// Action creators are generated for each case reducer function
export const {
  setTimelineData,
  setFreeFeeds,
  setAuthenticateIndecies,
  userAdded,
  clearTimelineData,
  clearTimeline,
  postAdded,
  replyAdded,
  userUpserted,
  postUpserted,
  postDeleted,
  commentAdded,
  commentUpserted,
  commentDeleted,
  replyUpserted,
  replyDeleted,
  setIsRefreshing,
  loadNewPosts,
  loadNewUsers,
  setHomepagePullToRefresh,
  updateLatestReviews,
  updateLatestPosts,
  updateTimelineData,
  addPostToTimelineHead,
  upsertNewPosts,
  setScrollOffsetValue,
  upsertSponsorshipPost
} = homeSlice.actions;

export default homeSlice.reducer;
