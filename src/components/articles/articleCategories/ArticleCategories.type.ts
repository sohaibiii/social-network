import { ArticlesCetegory } from "~/apiServices/article/article.types";

export interface ArticleCategories {
  articleCategories: ArticlesCetegory[];
  setSelectedArticles: (selectedArticles: ArticlesCetegory[]) => void;
  selectedCategories: ArticlesCetegory[];
}
