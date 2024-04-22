import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface Title {
  ar: string;
  en: string;
}

export type RootStackParamList = {
  HomeTabs: undefined;
  LoginByEmail: undefined;
  ProfileFollows: undefined;
  ChangeLanguage: undefined;
  Articles: undefined;
  ArticleDetails: { title: Title; slug: string };
};

export type AuthStackRoutesArticleDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  "ArticleDetails"
>;
