export const paths = {
  public: {
    home: "/",
    about: "/about",
    entrepreneurs: "/entrepreneurs",
    entrepreneurDetail: "/entrepreneurs/:slug",
    catalog: "/catalog",
    productDetail: "/catalog/:slug",
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
    newEntrepreneur: "/admin/entrepreneurs/new",
    editEntrepreneur: "/admin/entrepreneurs/:id/edit",

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
} as const;
