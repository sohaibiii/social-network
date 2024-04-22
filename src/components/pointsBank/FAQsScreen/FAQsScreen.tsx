import React, { FC, useEffect, useState, memo } from "react";
import { ScrollView } from "react-native";

import { useTheme } from "react-native-paper";

import style from "./FAQsScreen.style";

import { getFAQsAPI } from "~/apis/pointsBank";
import {
  AccordionListGroup,
  AccordionListItem,
  CircularLoader,
  CText
} from "~/components/common";
import { IFAQs } from "~/redux/types/pointsBank.types";
import { logEvent, FAQ_QUESTION_PRESSED } from "~/services/analytics";
import { logError } from "~/utils/errorHandler";
import { useToggleState } from "~/utils/hooks";

const INITIAL_LOADER = "INITIAL_LOADER";

const FAQsScreen: FC = () => {
  const [getToggleState, setToggleState] = useToggleState([INITIAL_LOADER]);

  const [fqas, setFqas] = useState<IFAQs[]>([]);

  const theme = useTheme();

  const { root } = style(theme.colors);

  useEffect(() => {
    setToggleState(INITIAL_LOADER, true);
    getFAQsAPI()
      .then(response => {
        setFqas(response);
      })
      .catch(error => {
        logError(`Error: getFAQsAPI --FAQsScreen.tsx-- ${error}`);
      })
      .finally(() => {
        setToggleState(INITIAL_LOADER);
      });
  }, []);

  const onSelectCb = async (questionId: number) => {
    await logEvent(FAQ_QUESTION_PRESSED, {
      source: "points_bank_page",
      question: fqas[questionId]?.question
    });
  };

  return (
    <ScrollView contentContainerStyle={root} showsVerticalScrollIndicator={false}>
      {getToggleState(INITIAL_LOADER) ? (
        <CircularLoader />
      ) : (
        <AccordionListGroup defaultValue="0" onSelectCb={onSelectCb}>
          {fqas.map(({ answer, question }, index) => (
            <AccordionListItem key={index} title={question} id={index + ""}>
              <CText fontSize={12}>{answer}</CText>
            </AccordionListItem>
          ))}
        </AccordionListGroup>
      )}
    </ScrollView>
  );
};

export default memo(FAQsScreen);
