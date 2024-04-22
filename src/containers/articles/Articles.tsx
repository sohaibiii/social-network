import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { View, FlatList, SafeAreaView, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { Badge, Text, useTheme, Card, Paragraph } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Articles.styles";

import { RootState } from "~/redux/store";

import articleService from "~/apiServices/article";
import {
  Articles,
  ArticlesCetegory,
  SimpleArticle,
  Category
} from "~/apiServices/article/article.types";
import IMAGES from "~/assets/images";
import ArticleCategrories from "~/components/articles/articleCategories";
import ArticleListSkeleton from "~/components/articles/articleListSkeleton";
import { Icon, IconTypes, modalizeRef } from "~/components/common";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { AppStackRoutesArticlesProps } from "~/router/Router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  GET_ARTICLE_LIST,
  GET_ARTICLE_LIST_FAILED,
  GET_ARTICLE_LIST_SUCCESS,
  ARTICLE_VISITED,
  ARTICLE_LIST_RESET_FILTER,
  ARTICLE_LIST_APPLY_FILTER_NO_RESULT
} from "~/services/analytics";
import { logError, generalErrorHandler, errorLogFormatter } from "~/utils/";

const ArticlesComp = (props: AppStackRoutesArticlesProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { navigation } = props;
  const dispatch = useDispatch();

  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const PAGE_SIZE = 10;
  const [articles, setArticles] = useState<SimpleArticle[]>([]);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [from, setFrom] = useState(0);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [articleCategories, setArticleCategories] = useState<ArticlesCetegory[]>([]);
  const [selectedArticleCategories, setSelectedArticleCategories] = useState<
    ArticlesCetegory[]
  >([]);

  const bottomSheetContent = useCallback(() => {
    return (
      <ArticleCategrories
        articleCategories={articleCategories}
        setSelectedArticles={setSelectedArticleCategories}
        selectedCategories={selectedArticleCategories}
      />
    );
  }, [articleCategories, selectedArticleCategories, setSelectedArticleCategories]);

  const getArticlesCategory = () => {
    articleService
      .getCategories()
      .then(categoriesData => setArticleCategories(categoriesData))
      .catch(error => {
        logError(`getArticlesCategory ${error}`);
      });
  };

  const getArticles = useCallback(
    async (from = 0, pageSize = PAGE_SIZE, categorizes = []) => {
      if (totalArticles > 0 && from >= totalArticles) {
        return;
      }
      setisLoading(true);
      await logEvent(GET_ARTICLE_LIST, {
        source: "articles_list_page",
        from,
        pageSize,
        categorizes
      });
      articleService
        .getArticles(from, pageSize, categorizes)
        .then((data: Articles | undefined) => {
          setArticles(
            from === 0
              ? data?.articles ?? []
              : prevState => prevState.concat(data?.articles ?? [])
          );

          setTotalArticles(data?.totalArticles ?? 0);
          if (data?.totalArticles === 0) {
            return logEvent(ARTICLE_LIST_APPLY_FILTER_NO_RESULT, {
              source: "articles_list_page",
              from,
              pageSize,
              categorizes: categorizes?.join(",")
            });
          }
          return logEvent(GET_ARTICLE_LIST_SUCCESS, {
            source: "articles_list_page",
            from,
            pageSize,
            categorizes
          });
        })
        .catch(error => {
          generalErrorHandler(
            `Error: getArticles --Articles.tsx-- categorizes=${errorLogFormatter(
              categorizes
            )} from=${from} ${error}`
          );
          return logEvent(GET_ARTICLE_LIST_FAILED, {
            source: "articles_list_page",
            from,
            pageSize,
            categorizes
          });
        })
        .finally(() => {
          setisLoading(false);
        });
    },
    [totalArticles]
  );

  const handleLoadMoreArticles = () => {
    if (articles.length >= totalArticles) {
      return;
    }
    const newFrom = from + PAGE_SIZE;

    setFrom(newFrom);
    getArticles(newFrom);
  };

  const handleArticlePressed = async (item: SimpleArticle) => {
    await logEvent(ARTICLE_VISITED, {
      title: item.title.en,
      slug: item.slug,
      source: "articles_list_page_page"
    });

    navigation.navigate("ArticleDetails", { title: item.title, slug: item.slug });
  };

  const handleRenderArticle = ({ item }: { item: SimpleArticle }) => {
    const { title, traverCategories, featuredImageUUID, summary } = item || {};
    const coverSource =
      featuredImageUUID !== ""
        ? {
            uri: `${Config.CONTENT_MEDIA_PREFIX}/${featuredImageUUID}_sm.jpg`
          }
        : IMAGES.placeholder;

    return (
      <View style={cardWrapperStyle}>
        <Card style={cardStyle} elevation={3} onPress={() => handleArticlePressed(item)}>
          <Card.Cover source={coverSource} style={cardCoverStyle} />
          <View style={badgeWrapperStyle}>
            {traverCategories?.slice(0, 4).map((category: Category, index) => {
              const { id, name } = category;
              return (
                <Badge key={`${id}-${index}`} style={badgeStyle}>
                  {name}
                </Badge>
              );
            })}
          </View>

          <Card.Content>
            <Text style={articleTitleStyle}>{title[language]}</Text>
            <Paragraph numberOfLines={3} style={articleParagrapghStyle}>
              {summary}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const handleKeyExtractor = (item: SimpleArticle, index: number) =>
    `${item.pkey}-${index}`;

  const handleFooterComponent = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <View>
        <View style={skeletonContainerStyle}>
          <View style={rightSkeletonWrapperStyle}>
            <ArticleListSkeleton />
          </View>
        </View>
        <View style={skeletonContainerStyle}>
          <View style={rightSkeletonWrapperStyle}>
            <ArticleListSkeleton />
          </View>
        </View>
        <View style={skeletonContainerStyle}>
          <View style={rightSkeletonWrapperStyle}>
            <ArticleListSkeleton />
          </View>
        </View>
      </View>
    );
  };
  const handleResetCategoriesSearch = async () => {
    await logEvent(ARTICLE_LIST_RESET_FILTER, { source: "articles_list_page" });
    setSelectedArticleCategories([]);
  };

  const handleEmptyComponent = () => {
    if (isLoading) {
      return null;
    }

    return (
      <View>
        <View style={badgeWrapperStyle}>
          <Text>{`${t("result_0")}`}</Text>
          {selectedArticleCategories.map((cat, index) => {
            return (
              <Badge key={`${cat.title}-${index}`} style={badgeStyle}>
                {cat.title}
              </Badge>
            );
          })}
        </View>
        <TouchableOpacity onPress={handleResetCategoriesSearch}>
          <Text style={resetFilterTextStyle}>{t("reset_filter")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleHeaderComponent = () => {
    const artLength = articles.length;
    if (selectedArticleCategories.length === 0 || artLength === 0 || isLoading) {
      return null;
    }
    return (
      <View>
        <View style={badgeWrapperStyle}>
          <Text>{`${t("there_are")} ${t("result", { count: artLength })}`}</Text>
          {selectedArticleCategories.map((cat, index) => {
            return (
              <Badge key={`${cat.title}-${index}`} style={badgeStyle}>
                {cat.title}
              </Badge>
            );
          })}
        </View>
        <TouchableOpacity onPress={handleResetCategoriesSearch}>
          <Text style={resetFilterTextStyle}>{t("reset_filter")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    getArticlesCategory();
    getArticles();
  }, []);

  useEffect(() => {
    getArticles(
      0,
      PAGE_SIZE,
      selectedArticleCategories.map(category => category.id)
    );
  }, [selectedArticleCategories, getArticles]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            dispatch(
              showBottomSheet({
                Content: bottomSheetContent,
                props: {
                  modalHeight: APP_SCREEN_HEIGHT / 2
                }
              })
            );
          }}
        >
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={"control"}
            width={20}
            height={20}
            color={
              selectedArticleCategories.length > 0
                ? theme.colors.primary
                : theme.colors.gray
            }
            disabled
          />
        </TouchableOpacity>
      )
    });
  }, [
    navigation,
    articleCategories,
    selectedArticleCategories,
    bottomSheetContent,
    dispatch,
    theme
  ]);

  const {
    safeareviewStyle,
    containerStyle,
    badgeStyle,
    badgeWrapperStyle,
    cardCoverStyle,
    cardStyle,
    cardWrapperStyle,
    skeletonContainerStyle,
    rightSkeletonWrapperStyle,
    articleTitleStyle,
    articleParagrapghStyle,
    resetFilterTextStyle
  } = styles(theme);

  return (
    <SafeAreaView style={safeareviewStyle}>
      <View style={containerStyle}>
        <FlatList
          data={articles}
          keyExtractor={handleKeyExtractor}
          renderItem={handleRenderArticle}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMoreArticles}
          ListHeaderComponent={handleHeaderComponent}
          ListFooterComponent={handleFooterComponent}
          ListEmptyComponent={handleEmptyComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default ArticlesComp;
