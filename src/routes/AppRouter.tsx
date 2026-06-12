import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { UnauthorizedPage } from "@/features/auth/pages/UnauthorizedPage";
import { EntrepreneurDashboardPage } from "@/features/dashboard/pages/EntrepreneurDashboardPage";
import { paths } from "@/routes/paths";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { EntrepreneurProfilePage } from "@/features/entrepreneurs/pages/EntrepreneurProfilePage";
import { EditEntrepreneurProfilePage } from "@/features/entrepreneurs/pages/EditEntrepreneurProfilePage";
import { MyBusinessesPage } from "@/features/businesses/pages/MyBusinessesPage";
import { MyBusinessDetailPage } from "@/features/businesses/pages/MyBusinessDetailPage";
import { EditMyBusinessPage } from "@/features/businesses/pages/EditMyBusinessPage";
import { MyProductsPage } from "@/features/products/pages/MyProductsPage";
import { MyProductDetailPage } from "@/features/products/pages/MyProductDetailPage";
import { EditMyProductPage } from "@/features/products/pages/EditMyProductPage";
import { ProductImagesPage } from "@/features/products/pages/ProductImagesPage";
import { NewProductPage } from "@/features/products/pages/NewProductPage";
import { AdminProductsPage } from "@/features/admin/products/pages/AdminProductsPage";
import { AdminProductDetailPage } from "@/features/admin/products/pages/AdminProductDetailPage";
import { AdminCategoriesPage } from "@/features/admin/categories/pages/AdminCategoriesPage";
import { CategoryFormPage } from "@/features/admin/categories/pages/CategoryFormPage";
import { AdminBusinessesPage } from "@/features/admin/businesses/pages/AdminBusinessesPage";
import { AdminBusinessDetailPage } from "@/features/admin/businesses/pages/AdminBusinessDetailPage";
import { AdminEntrepreneursPage } from "@/features/admin/entrepreneurs/pages/AdminEntrepreneursPage";
import { AdminEntrepreneurDetailPage } from "@/features/admin/entrepreneurs/pages/AdminEntrepreneurDetailPage";
import { AdminApprovalsPage } from "@/features/admin/approvals/pages/AdminApprovalsPage";
import { AdminUsersPage } from "@/features/admin/users/pages/AdminUsersPage";
import { AdminUserDetailPage } from "@/features/admin/users/pages/AdminUserDetailPage";
import { ChangePasswordPage } from "@/features/auth/pages/ChangePasswordPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { HomePage } from "@/features/public/pages/HomePage";
import { CatalogPage } from "@/features/public/pages/CatalogPage";
import { EntrepreneursPage } from "@/features/public/pages/EntrepreneursPage";
import { GalleryPage } from "@/features/public/pages/GalleryPage";

const adminRoles = ["admin", "super_admin"] as const;

const entrepreneurRoles = ["entrepreneur", "emprendedora"] as const;

const router = createBrowserRouter([
  {
    path: paths.public.home,
    element: <HomePage />,
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
            element: <RoleRoute allowedRoles={[...entrepreneurRoles]} />,
            children: [
              {
                path: paths.entrepreneur.dashboard,
                element: <EntrepreneurDashboardPage />,
              },
              {
                path: paths.entrepreneur.profile,
                element: <EntrepreneurProfilePage />,
              },
              {
                path: paths.entrepreneur.editProfile,
                element: <EditEntrepreneurProfilePage />,
              },
              {
                path: paths.entrepreneur.businesses,
                element: <MyBusinessesPage />,
              },
              {
                path: paths.entrepreneur.businessDetail,
                element: <MyBusinessDetailPage />,
              },
              {
                path: paths.entrepreneur.editBusiness,
                element: <EditMyBusinessPage />,
              },
              {
                path: paths.entrepreneur.editProfile,
                element: <EditEntrepreneurProfilePage />,
              },
              {
                path: paths.entrepreneur.products,
                element: <MyProductsPage />,
              },
              {
                path: paths.entrepreneur.productDetail,
                element: <MyProductDetailPage />,
              },
              {
                path: paths.entrepreneur.editProduct,
                element: <EditMyProductPage />,
              },
              {
                path: paths.entrepreneur.productImages,
                element: <ProductImagesPage />,
              },
              {
                path: paths.entrepreneur.newProduct,
                element: <NewProductPage />,
              },
            ],
          },

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
              {
                path: paths.admin.entrepreneurs,
                element: <AdminEntrepreneursPage />,
              },
              {
                path: paths.admin.entrepreneurDetail,
                element: <AdminEntrepreneurDetailPage />,
              },
              {
                path: paths.admin.businesses,
                element: <AdminBusinessesPage />,
              },
              {
                path: paths.admin.businessDetail,
                element: <AdminBusinessDetailPage />,
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
