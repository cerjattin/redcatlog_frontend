export const paths = {
  public: {
    home: "/",
    about: "/about",
    entrepreneurs: "/entrepreneurs",
    catalog: "/catalog",
    gallery: "/gallery",
    contact: "/contact",
    login: "/login",
    register: "/register",
    unauthorized: "/unauthorized",
  },

  auth: {
    changePassword: "/change-password",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  admin: {
    dashboard: "/admin",
    users: "/admin/users",
    userDetail: "/admin/users/:id",

    entrepreneurs: "/admin/entrepreneurs",
    entrepreneurDetail: "/admin/entrepreneurs/:id",

    products: "/admin/products",
    productDetail: "/admin/products/:id",
    newProduct: "/admin/products/new",
    editProduct: "/admin/products/:id/edit",
    productImages: "/admin/products/:id/images",

    categories: "/admin/categories",
    newCategory: "/admin/categories/new",
    editCategory: "/admin/categories/:id/edit",

    approvals: "/admin/approvals",
  },

  editor: {
    dashboard: "/editor",
  },

  /**
   * Legacy temporal.
   * Se elimina cuando terminemos de refactorizar features/products viejos.
   */
  entrepreneur: {
    dashboard: "/dashboard",
    profile: "/dashboard/profile",
    editProfile: "/dashboard/profile/edit",
    businesses: "/dashboard/businesses",
    businessDetail: "/dashboard/businesses/:id",
    editBusiness: "/dashboard/businesses/:id/edit",
    newBusiness: "/dashboard/businesses/new",
    products: "/dashboard/products",
    productDetail: "/dashboard/products/:id",
    editProduct: "/dashboard/products/:id/edit",
    productImages: "/dashboard/products/:id/images",
    newProduct: "/dashboard/products/new",
  },
} as const;
