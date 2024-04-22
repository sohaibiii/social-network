import { Article, SimpleArticle, Articles, ArticlesCetegory } from "./article.types";

import { articleAPI } from "~/apis/";
import { logError } from "~/utils/";

const getArticles: (
  _from?: number,
  _size?: number,
  _categories?: number[],
  _countryId?: string,
  _regionId?: string,
  _cityId?: string
) => Promise<Articles | undefined> = async (
  from,
  size,
  categories,
  countryId,
  regionId,
  cityId
) => {
  try {
    const response = await articleAPI.getArticles(
      from,
      size,
      categories,
      countryId,
      regionId,
      cityId
    );

    const articles: SimpleArticle[] = response.data.items.map(article => {
      return {
        featuredImageUUID: article.featured_image?.image_uuid ?? "",
        slug: article.slug,
        title: article.title,
        summary: article.summary ?? "",
        viewsCount: article.views_count ?? 0,
        traverCategories: article.travel_categories
      };
    });

    return { articles, totalArticles: response.data.total.value };
  } catch (error) {
    logError(
      `Error: getArticles --article.ts-- cityId=${cityId} countryId=${countryId} regionId=${regionId} ${error}`
    );
  }
};

const getCategories: () => Promise<ArticlesCetegory[]> = async () => {
  try {
    const { data } = await articleAPI.getCategories();
    return data;
  } catch (error) {
    logError(`Error: getCategories --article.ts-- ${error}`);
  }
};

const getArticle: (_slug: string) => Promise<Article | undefined> = async slug => {
  try {
    const { data } = await articleAPI.getArticleBySlug(slug);
    // TODO: article travel categories
    return {
      featuredImageUUID: data.featured_image?.image_uuid ?? "",
      gallery:
        data.gallery?.map((item: any) =>
          "image_uuid" in item
            ? {
                owner: item.owner ?? "",
                source: item.source ?? "",
                uuid: item.image_uuid
              }
            : undefined
        ) ?? [],
      summary: data.summary ?? "",
      travelCategories: data.travel_categories,
      title: data.title.ar,
      slug: data.slug,
      pkey: data.pkey,
      body: data.body
        .replace(
          'Powered by [Froala Editor](https://www.froala.com/wysiwyg-editor?pb=1 "Froala Editor")',
          ""
        )
        .replace(new RegExp(" +\\n\\*\\*", "gm"), "**")
        .replace(new RegExp("[  ]*\\*\\*[  ]*", "gm"), "**"),
      timestamp: data.timestamp,
      isFollow: data.isFollow ?? false,
      isMine: false,
      viewsCount: data.views_count ?? 0,
      createdBy: {
        roles: data.created_by.roles ?? [],
        profileImage: data.created_by.profile ?? "",
        name: data.created_by.name,
        uuid: data.created_by.id,
        verified: data.created_by.verified ?? false
      }
    };
  } catch (error) {
    logError(`Error: getArticle --article.ts-- slug=${slug} ${error}`);
  }
};

export default {
  getArticles,
  getArticle,
  getCategories
};
