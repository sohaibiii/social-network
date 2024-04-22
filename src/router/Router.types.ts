import { Theme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

interface Props {
  theme: Theme;
  reinitializeAppCb: () => void;
}

export type RouterProps = Props;

type RootStackParamList = {
  HomeTabs: undefined;
  PointsBank: undefined;
  AwardsList: undefined;
  Login: undefined;
  TopUsersList: undefined;
  PointsTerms: undefined;
  FAQsScreen: undefined;
};

export type AppStackProps = StackScreenProps<RootStackParamList>;
