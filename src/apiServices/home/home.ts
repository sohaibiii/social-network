import {
  HashtagResponse,
  InfluencersResponse,
  IPuzzle,
  TimelineResponse,
  UserPostsResponse
} from "./home.types";

import { homeAPI } from "~/apis/";
import { HomeInterface } from "~/redux/types/home.types";
import { logError } from "~/utils/";

const getInfluencers: () => Promise<InfluencersResponse[]> = async () => {
  try {
    const { data } = await homeAPI.getInfluencers();
    const { ProcessInfo, recommendations } = data;
    const result: InfluencersResponse[] = Object.values(recommendations);

    return result;
  } catch (error) {
    logError(`Error: getInfluencers --home.ts-- ${error}`);
    throw error;
  }
};

const userFollowRequest: (_uuid: string) => Promise<any | undefined> = async uuid => {
  try {
    const { data } = await homeAPI.userFollowRequest(uuid);
    const { ProcessInfo, ...restProps } = data;

    return restProps;
  } catch (error) {
    logError(`Error: userFollowRequest --home.ts-- uuid=${uuid} ${error}`);
    throw error;
  }
};

const getSpecialDestinations: () => Promise<HomeInterface | undefined> = async () => {
  try {
    const { data } = await homeAPI.getSpecialDestinations();
    const { hero, special_destinations } = data;
    // this is a workaround till backend add type to special destionations
    const specialDestinationsWithTypes = special_destinations.map(destination => {
      if ("type" in destination) {
        return destination;
      }

      return { ...destination, type: "city" };
    });
    return { hero: hero, specialDestinations: specialDestinationsWithTypes };
  } catch (error) {
    logError(`Error: getSpecialDestinations --home.ts-- ${error}`);
    throw error;
  }
};

const getPuzzle: () => Promise<IPuzzle | number> = async () => {
  try {
    const { data } = await homeAPI.getPuzzle();

    if (data.time) {
      return data.time;
    }
    const puzzle: IPuzzle = {
      questions: data.questions.map((question: any, index: number) => ({
        pkey: String(question.pkey ?? index),
        correctAnswer: question.correct_answer,
        incorrectAnswers: question.incorrect_answers,
        image: {
          uuid: question.image.image_uuid,
          source: question.image.source ?? "",
          owner: question.image.owner ?? ""
        },
        text: question.text,
        country: question.country ?? "",
        region: question.region ?? "",
        city: question.city ?? "",
        property: question.property ?? ""
      })),
      pkey: data.pkey
    };

    return puzzle;
  } catch (error) {
    logError(`Error: getPuzzle --home.ts-- ${error}`);
    throw error;
  }
};

const puzzleResultRequest: (
  _pkey: string,
  _correctAnswer: number
) => Promise<number> = async (pkey, correctAnswer) => {
  try {
    const { data } = await homeAPI.puzzleResultRequest(pkey, correctAnswer);

    return data.score ?? -1;
  } catch (error) {
    logError(
      `Error: puzzleResultRequest --home.ts-- pkey=${pkey} correctAnswer=${correctAnswer} ${error}`
    );
    throw error;
  }
};

const getDynamicTimeline: () => Promise<TimelineResponse | undefined> = async () => {
  try {
    const { data } = await homeAPI.getDynamicTimeline();
    const { timeline } = data || {};

    return { timeline: timeline };
  } catch (error) {
    logError(`Error: getDynamicTimeline --home.ts-- ${error}`);
    throw error;
  }
};

const getHashtag: (
  _hashtag: string,
  _nextSocialIndex: number
) => Promise<HashtagResponse | undefined> = async (hashtag, nextSocialIndex) => {
  try {
    const { data } = await homeAPI.getHashtag(hashtag, nextSocialIndex);
    return data;
  } catch (error) {
    logError(
      `Error: getHashtag --home.ts-- hashtag=${hashtag} nextSocialIndex=${nextSocialIndex} ${error}`
    );
    throw error;
  }
};

const getMyPosts: (
  _nextSocialIndex: number
) => Promise<UserPostsResponse | undefined> = async nextSocialIndex => {
  try {
    const { data } = await homeAPI.getMyPosts(nextSocialIndex);
    const { ProcessInfo, ...restOfProps } = data;
    return restOfProps;
  } catch (error) {
    logError(`Error: getMyPosts --home.ts-- nextSocialIndex=${nextSocialIndex} ${error}`);
    throw error;
  }
};

const getUserPosts: (
  _user: string,
  _nextSocialIndex: number
) => Promise<HashtagResponse | undefined> = async (user, nextSocialIndex) => {
  try {
    const { data } = await homeAPI.getUserPosts(user, nextSocialIndex);
    const { feeds, nextIndex } = data;

    return { posts: feeds, nextIndex };
  } catch (error) {
    logError(
      `Error: getUserPosts --home.ts-- user=${user} nextSocialIndex=${nextSocialIndex} ${error}`
    );
    throw error;
  }
};

export default {
  getInfluencers,
  userFollowRequest,
  getSpecialDestinations,
  getPuzzle,
  puzzleResultRequest,
  getDynamicTimeline,
  getHashtag,
  getMyPosts,
  getUserPosts
};
