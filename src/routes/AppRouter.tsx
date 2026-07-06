import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminApprovalsPage } from "@/features/admin/approvals/pages/AdminApprovalsPage";
import { AdminCategoriesPage } from "@/features/admin/categories/pages/AdminCategoriesPage";
import { CategoryFormPage } from "@/features/admin/categories/pages/CategoryFormPage";
import { AdminEntrepreneurDetailPage } from "@/features/admin/entrepreneurs/pages/AdminEntrepreneurDetailPage";
import { EntrepreneurFormPage } from "@/features/admin/entrepreneurs/pages/EntrepreneurFormPage";
import { AdminEntrepreneursPage } from "@/features/admin/entrepreneurs/pages/AdminEntrepreneursPage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminProductDetailPage } from "@/features/admin/products/pages/AdminProductDetailPage";
import { AdminProductsPage } from "@/features/admin/products/pages/AdminProductsPage";
import { AdminUserDetailPage } from "@/features/admin/users/pages/AdminUserDetailPage";
import { AdminUsersPage } from "@/features/admin/users/pages/AdminUsersPage";
import { ChangePasswordPage } from "@/features/auth/pages/ChangePasswordPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { UnauthorizedPage } from "@/features/auth/pages/UnauthorizedPage";
import { EditorDashboardPage } from "@/features/editor/pages/EditorDashboardPage";
import { EditMyProductPage } from "@/features/products/pages/EditMyProductPage";
import { NewProductPage } from "@/features/products/pages/NewProductPage";
import { ProductImagesPage } from "@/features/products/pages/ProductImagesPage";
import { AboutPage } from "@/features/public/pages/AboutPage";
import { CatalogPage } from "@/features/public/pages/CatalogPage";
import { ContactPage } from "@/features/public/pages/ContactPage";
import { EntrepreneursPage } from "@/features/public/pages/EntrepreneursPage";
import { GalleryPage } from "@/features/public/pages/GalleryPage";
import { HomePage } from "@/features/public/pages/HomePage";
import { paths } from "@/routes/paths";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";

const adminRoles = ["admin"] as const;
const editorRoles = ["editor"] as const;
const adminOrEditorRoles = ["admin", "editor"] as const;

const router = createBrowserRouter([
  {
    path: paths.public.home,
    element: <HomePage />,
  },
  {
    path: paths.public.about,
    element: <AboutPage />,
  },
  {
    path: paths.public.entrepreneurs,
    element: <EntrepreneursPage />,
  },
  {
    path: paths.public.gallery,
    element: <GalleryPage />,
  },
  {
    path: paths.public.catalog,
    element: <CatalogPage />,
  },
  {
    path: paths.public.contact,
    element: <ContactPage />,
  },
  {
    path: paths.public.login,
    element: <LoginPage />,
  },
  {
    path: paths.public.register,
    element: <RegisterPage />,
  },
  {
    path: paths.auth.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: paths.auth.resetPassword,
    element: <ResetPasswordPage />,
  },
  {
    path: paths.public.unauthorized,
    element: <UnauthorizedPage />,
  },

  /**
   * Redirects legacy temporales.
   * Sirven para que URLs viejas no rompan después del cambio de lógica.
   */
  {
    path: "/dashboard",
    element: <Navigate to={paths.editor.dashboard} replace />,
  },
  {
    path: "/dashboard/*",
    element: <Navigate to={paths.editor.dashboard} replace />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.auth.changePassword,
        element: <ChangePasswordPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RoleRoute allowedRoles={[...adminRoles]} />,
            children: [
              {
                path: paths.admin.dashboard,
                element: <AdminDashboardPage />,
              },
              {
                path: paths.admin.users,
                element: <AdminUsersPage />,
              },
              {
                path: paths.admin.userDetail,
                element: <AdminUserDetailPage />,
              },
            ],
          },

          {
            element: <RoleRoute allowedRoles={[...editorRoles]} />,
            children: [
              {
                path: paths.editor.dashboard,
                element: <EditorDashboardPage />,
              },
            ],
          },

          {
            element: <RoleRoute allowedRoles={[...adminOrEditorRoles]} />,
            children: [
              {
                path: paths.admin.entrepreneurs,
                element: <AdminEntrepreneursPage />,
              },
              {
                path: paths.admin.entrepreneurDetail,
                element: <AdminEntrepreneurDetailPage />,
              },
              {
                path: paths.admin.newEntrepreneur,
                element: <EntrepreneurFormPage />,
              },
              {
                path: paths.admin.editEntrepreneur,
                element: <EntrepreneurFormPage />,
              },
              {
                path: paths.admin.products,
                element: <AdminProductsPage />,
              },
              {
                path: paths.admin.productDetail,
                element: <AdminProductDetailPage />,
              },
              {
                path: paths.admin.newProduct,
                element: <NewProductPage />,
              },
              {
                path: paths.admin.editProduct,
                element: <EditMyProductPage />,
              },
              {
                path: paths.admin.productImages,
                element: <ProductImagesPage />,
              },
              {
                path: paths.admin.categories,
                element: <AdminCategoriesPage />,
              },
              {
                path: paths.admin.newCategory,
                element: <CategoryFormPage />,
              },
              {
                path: paths.admin.editCategory,
                element: <CategoryFormPage />,
              },
              {
                path: paths.admin.approvals,
                element: <AdminApprovalsPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to={paths.public.home} replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
