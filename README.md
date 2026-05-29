# Red Mujeres — Frontend Web Beta

Frontend de la plataforma **Red Mujeres**, una vitrina digital y sistema de gestión web orientado a visibilizar emprendimientos liderados por mujeres.  
La versión Beta incluye sitio público, autenticación, panel para emprendedoras y panel administrativo con módulos de aprobación, gestión de productos, emprendimientos, categorías, usuarios y seguridad.

---

## 1. Descripción del proyecto

**Red Mujeres** es una plataforma web tipo catálogo digital creada para apoyar, organizar y visibilizar emprendimientos de mujeres en categorías como:

- Artesanías
- Gastronomía
- Belleza
- Moda
- Hogar
- Otras categorías futuras

El frontend permite que visitantes exploren productos y perfiles públicos, mientras que usuarias autenticadas pueden gestionar información privada según su rol.

La aplicación está diseñada para funcionar con un backend Node.js + Express + Prisma + MySQL, compatible con despliegue en hosting Linux/cPanel.

---

## 2. Estado actual del frontend

La aplicación se encuentra en una etapa Beta funcional con las siguientes áreas implementadas o avanzadas:

### Autenticación

- Inicio de sesión.
- Registro de emprendedoras.
- Persistencia de sesión con Zustand y localStorage.
- Rutas protegidas.
- Control por roles.
- Cierre de sesión.
- Cambio de contraseña para usuario autenticado.
- Recuperación/restablecimiento de contraseña.
- Redirección obligatoria a cambio de contraseña cuando `forcePasswordChange` es verdadero.

### Panel de emprendedora

- Dashboard privado.
- Perfil de emprendedora.
- Visualización y edición limitada de perfil.
- Listado de emprendimientos propios.
- Detalle de emprendimiento.
- Edición de emprendimiento.
- Listado de productos propios.
- Creación de productos.
- Detalle de producto.
- Edición de producto.
- Gestión de imágenes de producto.
- Selección de categorías para productos.
- Menú de seguridad para cambio de contraseña.

### Panel administrador

- Dashboard administrativo.
- Gestión de productos.
- Detalle administrativo de producto.
- Aprobación, rechazo, archivo y cambio manual de estado de productos.
- Gestión de emprendimientos.
- Detalle administrativo de emprendimiento.
- Aprobación, rechazo, archivo y cambio manual de estado de emprendimientos.
- Gestión de emprendedoras.
- Detalle administrativo de emprendedora.
- Aprobación, rechazo, inactivación y cambio manual de estado de perfiles.
- Gestión de categorías.
- Creación y edición de categorías.
- Activación e inactivación de categorías.
- Centro de aprobaciones.
- Gestión de usuarios.
- Detalle administrativo de usuario.
- Activación, inactivación y bloqueo de usuarios.
- Restablecimiento de contraseña de usuarios desde administración.

### Sitio público

La fase pública fue iniciada conceptualmente y está preparada para incorporar:

- Home público.
- Catálogo público.
- Detalle público de productos.
- Perfil público de emprendimiento.
- Listado público de emprendedoras.
- Perfil público de emprendedora o emprendimiento.

---

## 3. Stack tecnológico

### Frontend

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Zustand**
- **Axios**
- **React Hook Form**
- **Zod**
- **Lucide React**

### Backend esperado

Este frontend consume una API backend con:

- Node.js
- Express
- Prisma
- MySQL
- JWT
- Multer para subida de imágenes
- Roles y permisos
- Rutas públicas y privadas

---

## 4. Roles del sistema

La plataforma contempla los siguientes roles principales:

### Visitante público

Puede navegar por el sitio público, consultar productos, emprendimientos y perfiles visibles.

### Emprendedora

Puede gestionar su perfil, emprendimientos, productos e imágenes asociadas.

### Admin

Puede revisar y administrar productos, emprendimientos, emprendedoras, categorías, usuarios y aprobaciones.

### Super admin

Rol administrativo superior preparado para ampliaciones futuras.

---

## 5. Estructura general del proyecto

Estructura recomendada y usada en el frontend:

```txt
src/
  components/
    feedback/
      EmptyState.tsx
      Loader.tsx

    layout/
      DashboardLayout.tsx
      PageHeader.tsx
      Sidebar.tsx
      Topbar.tsx
      PublicLayout.tsx

    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      Input.tsx
      Textarea.tsx

  features/
    admin/
      approvals/
        pages/
          AdminApprovalsPage.tsx

      businesses/
        api/
          adminBusiness.service.ts
        constants/
          businessStatus.constants.ts
        pages/
          AdminBusinessesPage.tsx
          AdminBusinessDetailPage.tsx
        types/
          adminBusiness.types.ts

      categories/
        api/
          category.service.ts
        pages/
          AdminCategoriesPage.tsx
          CategoryFormPage.tsx
        schemas/
          category.schema.ts
        types/
          category.types.ts

      entrepreneurs/
        api/
          adminEntrepreneur.service.ts
        constants/
          entrepreneurStatus.constants.ts
        pages/
          AdminEntrepreneursPage.tsx
          AdminEntrepreneurDetailPage.tsx
        types/
          adminEntrepreneur.types.ts

      products/
        api/
          adminProduct.service.ts
        pages/
          AdminProductsPage.tsx
          AdminProductDetailPage.tsx
        types/
          adminProduct.types.ts

      users/
        api/
          adminUser.service.ts
        components/
          AdminResetPasswordModal.tsx
        constants/
          userStatus.constants.ts
        pages/
          AdminUsersPage.tsx
          AdminUserDetailPage.tsx
        types/
          adminUser.types.ts

    auth/
      api/
        auth.service.ts
        password.service.ts
      mocks/
        auth.mock.ts
      pages/
        LoginPage.tsx
        RegisterPage.tsx
        ChangePasswordPage.tsx
        ForgotPasswordPage.tsx
        ResetPasswordPage.tsx
      schemas/
        password.schema.ts
      types/
        password.types.ts

    businesses/
      api/
        business.service.ts
      pages/
        MyBusinessesPage.tsx
        MyBusinessDetailPage.tsx
        EditMyBusinessPage.tsx
      schemas/
        business.schema.ts
      types/
        business.types.ts

    products/
      api/
        product.service.ts
      constants/
        productStatus.constants.ts
      pages/
        MyProductsPage.tsx
        MyProductDetailPage.tsx
        EditMyProductPage.tsx
        ProductImagesPage.tsx
        NewProductPage.tsx
      schemas/
        createProduct.schema.ts
        product.schema.ts
      types/
        product.types.ts

    public/
      pages/
        HomePage.tsx

  lib/
    axios.ts
    env.ts

  routes/
    AppRouter.tsx
    paths.ts
    ProtectedRoute.tsx
    RoleRoute.tsx

  store/
    auth.store.ts

  types/
    user.types.ts

  utils/
    image.ts
    roles.ts
    slug.ts
```

---

## 6. Variables de entorno

El proyecto utiliza variables de entorno de Vite.

### Desarrollo

Crear archivo:

```txt
.env.development
```

Contenido recomendado:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_UPLOADS_BASE_URL=http://localhost:4000
```

### Producción

Crear archivo:

```txt
.env.production
```

Contenido base sugerido:

```env
VITE_API_BASE_URL=https://api.redmujeres.com/api
VITE_UPLOADS_BASE_URL=https://api.redmujeres.com
```

> Ajustar los dominios según la configuración final del hosting.

---

## 7. Instalación local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd redcatlog_frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear `.env.development` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_UPLOADS_BASE_URL=http://localhost:4000
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación quedará disponible normalmente en:

```txt
http://localhost:5173
```

---

## 8. Scripts disponibles

```bash
npm run dev
```

Ejecuta el servidor local de desarrollo.

```bash
npm run build
```

Compila la aplicación para producción.

```bash
npm run preview
```

Ejecuta una vista previa local del build de producción.

```bash
npm run lint
```

Ejecuta validaciones de lint si el proyecto tiene ESLint configurado.

---

## 9. Arquitectura de rutas

### Rutas públicas

```txt
/
 /login
 /register
 /forgot-password
 /reset-password
 /unauthorized
```

Rutas públicas proyectadas para la siguiente fase:

```txt
/catalog
/products/:slug
/entrepreneurs
/entrepreneurs/:slug
/businesses/:slug
```

### Rutas protegidas comunes

```txt
/change-password
```

### Rutas de emprendedora

```txt
/dashboard
/dashboard/profile
/dashboard/profile/edit
/dashboard/businesses
/dashboard/businesses/:id
/dashboard/businesses/:id/edit
/dashboard/products
/dashboard/products/new
/dashboard/products/:id
/dashboard/products/:id/edit
/dashboard/products/:id/images
```

### Rutas administrativas

```txt
/admin
/admin/users
/admin/users/:id
/admin/entrepreneurs
/admin/entrepreneurs/:id
/admin/businesses
/admin/businesses/:id
/admin/products
/admin/products/:id
/admin/categories
/admin/categories/new
/admin/categories/:id/edit
/admin/approvals
```

---

## 10. Gestión de autenticación y seguridad

El frontend utiliza:

- JWT access token.
- Refresh token.
- Persistencia con Zustand.
- `ProtectedRoute` para validar sesión.
- `RoleRoute` para controlar acceso por rol.
- Redirección automática a `/change-password` si el usuario tiene `forcePasswordChange = true`.
- Limpieza de sesión después de cambiar contraseña.
- Recuperación de contraseña mediante token.

### Flujos de contraseña

#### Admin restablece clave de usuario

Desde:

```txt
/admin/users/:id
```

El admin puede abrir un modal de restablecimiento de clave. El endpoint usado es:

```http
PATCH /api/users/:id/password
```

#### Usuario cambia su clave

Desde el menú:

```txt
Seguridad
```

o directamente:

```txt
/change-password
```

El endpoint usado es:

```http
PATCH /api/auth/change-password
```

#### Recuperación de clave olvidada

Desde login:

```txt
¿Olvidaste tu contraseña?
```

Endpoints:

```http
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## 11. Módulos implementados

### Auth

- Login.
- Registro.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Cambio de contraseña autenticado.
- Protección de rutas.
- Redirección por rol.

### Emprendedora

- Perfil.
- Emprendimientos.
- Productos.
- Imágenes de productos.
- Categorías de producto.
- Seguridad.

### Admin

- Usuarios.
- Emprendedoras.
- Emprendimientos.
- Productos.
- Categorías.
- Aprobaciones.
- Seguridad.

### Público

- Base preparada para home, catálogo y perfiles públicos.

---

## 12. Integración con backend

El frontend espera que el backend esté disponible en:

```txt
http://localhost:4000/api
```

y que sirva archivos estáticos desde:

```txt
http://localhost:4000/uploads
```

El helper de imágenes transforma rutas relativas como:

```txt
/uploads/products/image.jpg
```

en rutas absolutas según `VITE_UPLOADS_BASE_URL`.

---

## 13. Estados principales

### Productos y emprendimientos

```txt
draft
pending_review
approved
published
rejected
inactive
archived
```

### Emprendedoras

```txt
draft
pending_review
approved
rejected
inactive
```

### Usuarios

```txt
pending
active
inactive
blocked
deleted
```

---

## 14. Buenas prácticas aplicadas

- Separación por features.
- Servicios API centralizados.
- Tipado TypeScript por módulo.
- Validación con Zod.
- Formularios con React Hook Form.
- Componentes UI reutilizables.
- Rutas protegidas.
- Control por roles.
- Uso de variables de entorno.
- Manejo centralizado de URLs de imágenes.
- Evitar hardcode de dominio backend.
- Preparación para despliegue en hosting/cPanel.

---

## 15. Pendientes recomendados

### Sitio público

- Home público definitivo.
- Catálogo público.
- Filtros de catálogo.
- Detalle público de producto.
- Perfil público de emprendimiento.
- Perfil público de emprendedora.
- Sección institucional.

### Experiencia de usuario

- Sustituir `window.prompt` por modales profesionales.
- Agregar notificaciones globales tipo toast.
- Mejorar estados de carga por acción.
- Confirmaciones antes de bloquear, archivar o rechazar.

### Admin

- Cambio de rol cuando el backend lo permita.
- Crear usuario desde admin cuando el backend lo permita.
- Editar usuario desde admin cuando el backend lo permita.
- Auditoría visual de acciones administrativas.
- Exportación de reportes.

### Emprendedora

- Mejoras visuales en gestión de imágenes.
- Reordenamiento de imágenes.
- Selección de imagen principal.
- Publicación o envío a revisión desde frontend si el backend lo permite.

### Producción

- Configurar dominios definitivos.
- Configurar SSL.
- Configurar variables `.env.production`.
- Validar CORS backend.
- Probar build en ambiente similar a hosting.
- Verificar rutas SPA en cPanel.

---

## 16. Consideraciones para despliegue

Al desplegar en cPanel o hosting compatible con Node.js/SPA:

1. Compilar el frontend:

```bash
npm run build
```

2. Subir el contenido de `dist/` al hosting público o configurar el pipeline desde GitHub.

3. Verificar que el servidor permita fallback a `index.html` para rutas SPA.

4. Configurar variables de producción:

```env
VITE_API_BASE_URL=https://api.redmujeres.com/api
VITE_UPLOADS_BASE_URL=https://api.redmujeres.com
```

5. Validar CORS en backend para el dominio del frontend.

---

## 17. Licencia

Proyecto privado en etapa Beta.  
Uso, distribución o modificación sujeto a autorización del propietario del proyecto.

---

## 18. Equipo / Proyecto

**Proyecto:** Red Mujeres  
**Tipo:** Plataforma web / vitrina digital / catálogo de emprendimientos  
**Estado:** Beta en desarrollo  
**Frontend:** React + Vite + TypeScript  
**Backend esperado:** Node.js + Express + Prisma + MySQL
