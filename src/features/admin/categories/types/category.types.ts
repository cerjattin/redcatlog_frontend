export type CategoryType = "business" | "product" | "both";

export type Category = {
  id: string;
  parentId: string | null;

  name: string;
  slug: string;

  description: string | null;
  iconUrl: string | null;

  type: CategoryType;

  sortOrder: number;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  parent: {
    id: string;
    name: string;
    slug: string;
  } | null;

  children: {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
    isActive: boolean;
  }[];
};

export type CategoryFilters = {
  search?: string;
  type?: CategoryType;
  isActive?: "true" | "false";
  parentId?: string;
};

export type CreateCategoryRequest = {
  parentId?: string | null;

  name: string;
  slug: string;

  description?: string | null;
  iconUrl?: string | null;

  type?: CategoryType;

  sortOrder?: number;

  isActive?: boolean;
};

export type UpdateCategoryStatusRequest = {
  isActive: boolean;
};
