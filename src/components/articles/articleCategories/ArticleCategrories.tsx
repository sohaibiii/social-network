import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import styles from "./ArticleCategories.styles";
import { ArticleCategories } from "./ArticleCategories.type";

import { ArticlesCetegory } from "~/apiServices/article/article.types";
import { Button, modalizeRef } from "~/components/common";
import { logEvent, ARTICLE_LIST_APPLY_FILTER } from "~/services/analytics";

const ArticleCategrories = (props: ArticleCategories): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    articleCategories = [],
    setSelectedArticles = () => null,
    selectedCategories = []
  } = props;

  const [selectedArticleCategories, setSelectedArticleCategories] =
    useState<ArticlesCetegory[]>(selectedCategories);

  const handleApplyFilter = async () => {
    await logEvent(ARTICLE_LIST_APPLY_FILTER, {
      source: "articles_list_page",
      filters_category_ids: selectedArticleCategories.map(category => category.id),
      filters_category_title: selectedArticleCategories.map(category => category.title)
    });
    setSelectedArticles(selectedArticleCategories);
    modalizeRef.current?.close();
  };
  const handleArticleCategoryPressed = (isActive: boolean, title: string, id: number) => {
    setSelectedArticleCategories(
      isActive
        ? selectedArticleCategories.filter(category => category.id !== id)
        : selectedArticleCategories.concat([{ id, title }])
    );
  };

  const {
    containerStyle,
    applyFilterButtonStyle,
    categoryWrapperStyle,
    categoryTextStyle,
    categoriesWrapperStyle,
    activeCategoryWrapperStyle,
    activeCategoryTextStyle,
    subtitleTextStyle,
    filterBtnLabelStyle
  } = styles(theme);

  return (
    <View style={containerStyle}>
      <Text style={subtitleTextStyle}>{t("pick_article_categories")}</Text>
      <View style={categoriesWrapperStyle}>
        {articleCategories?.map(({ title, id }, index) => {
          const isActive = !!selectedArticleCategories.find(
            category => category.id === id
          );

          const categoryWrapperStyles = [
            categoryWrapperStyle,
            isActive ? activeCategoryWrapperStyle : {}
          ];
          const categoryTextStyles = [
            categoryTextStyle,
            isActive ? activeCategoryTextStyle : {}
          ];

          return (
            <TouchableOpacity
              key={`${id}-${index}`}
              style={categoryWrapperStyles}
              onPress={() => handleArticleCategoryPressed(isActive, title, id)}
            >
              <Text style={categoryTextStyles}>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Button
        mode="contained"
        title={t("apply")}
        labelStyle={filterBtnLabelStyle}
        onPress={handleApplyFilter}
        style={applyFilterButtonStyle}
      />
    </View>
  );
};

export default ArticleCategrories;
