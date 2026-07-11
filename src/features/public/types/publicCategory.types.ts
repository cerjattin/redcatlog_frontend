export type PublicCategoryType = "entrepreneur" | "product" | "both";

export interface PublicCategory {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  type?: PublicCategoryType | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  productsCount?: number | null;
  productCount?: number | null;
}

export interface GetPublicCategoriesParams {
  search?: string;
  type?: PublicCategoryType;
  isActive?: "true" | "false";
  parentId?: string;
}
