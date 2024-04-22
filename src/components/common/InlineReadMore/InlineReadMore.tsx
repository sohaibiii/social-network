import React, { useState, useRef } from "react";
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View
} from "react-native";

import inlineReadMoreStyles from "./InlineReadMore.styles";
import { InlineReadMoreProps, InlineReadMoreMode } from "./InlineReadMore.types";

import { CText, AutoLink } from "~/components/";
import { isRTL } from "~/constants/";
import { logEvent, TOGGLE_INLINE_READ_MORE } from "~/services/";
import { translate } from "~/translations/";
import { isArabic } from "~/utils/stringUtil";

export const InlineReadMore = (props: InlineReadMoreProps): JSX.Element => {
  const {
    style = {},
    maxNumberOfLinesToShow = 4.5,
    isAutoLink = false,
    textProps,
    hasReadLess = false,
    slug,
    type,
    pkey,
    index,
    mode = InlineReadMoreMode.FULL_HEIGHT_WIDTH,
    onLongPress = () => undefined,
    children,
    analyticsSource,
    isInitiallyExpanded = false,
    onExpanded = () => undefined
  } = props;

  const description = children?.toString() || "";
  const [textNumberOfLines, setTextNumberOfLines] = useState(0);
  const [maxParagraphHeight, setMaxParagraphHeight] = useState(0);
  const [minParagraphHeight, setMinParagraphHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [shortenedText, setShortenedText] = useState("");
  const isFirstTimeRender = useRef(false);

  const toggleExpanded = async () => {
    !!analyticsSource &&
      (await logEvent(TOGGLE_INLINE_READ_MORE, {
        source: analyticsSource,
        slug,
        type,
        pkey,
        index,
        showing_expanded: !isExpanded
      }));
    setIsExpanded(!isExpanded);
    onExpanded(!isExpanded);
  };
  const handleOnTextLayout = ({
    nativeEvent: { lines }
  }: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (lines.length <= maxNumberOfLinesToShow) {
      const heightOfParagraph = lines.reduce((prev, current) => prev + current.height, 0);
      // this should be maxNumberOfLinesToShow * lineHeight but since lines[0]?.height is always different than ines[1]?.height
      // we did the following calculation
      if (
        !isFirstTimeRender.current &&
        heightOfParagraph <=
          (maxNumberOfLinesToShow - 1) * lines[1]?.height + lines[0]?.height
      ) {
        setMaxParagraphHeight(heightOfParagraph);
        setMinParagraphHeight(heightOfParagraph);
      }

      return;
    }
    setTextNumberOfLines(lines.length);
    if (maxParagraphHeight === 0) {
      setMaxParagraphHeight(lines.reduce((prev, current) => prev + current.height, 0));
    }
    if (lines.length > maxNumberOfLinesToShow && shortenedText === "") {
      let tempShortText = "";
      let height = 0;

      const currentLineText = lines[maxNumberOfLinesToShow - 1].text;
      const indexToCutString =
        currentLineText.indexOf(" ") !== -1
          ? currentLineText.indexOf(" ", currentLineText.length / 2)
          : currentLineText.lastIndexOf("\n");

      for (let i = 0; i < maxNumberOfLinesToShow; i++) {
        height += lines[i].height;
        if (i === maxNumberOfLinesToShow - 1) {
          tempShortText += lines[maxNumberOfLinesToShow - 1].text.substr(
            0,
            indexToCutString
          );
        } else {
          tempShortText += lines[i].text;
        }
      }

      setMinParagraphHeight(height);
      setShortenedText(tempShortText);
      isFirstTimeRender.current = true;
    }
  };

  const isTextShortened = textNumberOfLines > maxNumberOfLinesToShow && !isExpanded;
  const lineToRender = isTextShortened ? shortenedText : description;
  const { containerFlex, containerFullHeight, inlineText, inlineTextNoAutoLink } =
    inlineReadMoreStyles;

  const containerStyles = [
    mode === InlineReadMoreMode.FLEX ? containerFlex : containerFullHeight,
    style,
    {
      height:
        minParagraphHeight === 0
          ? "100%"
          : isExpanded
          ? maxParagraphHeight
          : minParagraphHeight
    }
  ];

  const startingTextFixer = isArabic(lineToRender) ? (
    <CText>&rlm;</CText>
  ) : (
    <CText>&lrm;</CText>
  );

  return (
    <View style={containerStyles}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleExpanded}
        onLongPress={onLongPress}
      >
        <CText
          fontSize={13}
          style={inlineText}
          onTextLayout={handleOnTextLayout}
          {...textProps}
        >
          {startingTextFixer}
          {isAutoLink ? (
            <AutoLink
              text={lineToRender}
              textProps={textProps}
              analyticsSource={analyticsSource}
              pkey={pkey}
            />
          ) : (
            <CText fontSize={13} style={inlineTextNoAutoLink} {...textProps}>
              {lineToRender}
            </CText>
          )}
          {maxParagraphHeight !== minParagraphHeight && (
            <CText fontSize={13} {...textProps} color={"primary"}>
              {isTextShortened
                ? ` ...${translate("more")}`
                : hasReadLess && ` ...${translate("less")}`}
            </CText>
          )}
        </CText>
      </TouchableOpacity>
    </View>
  );
};
