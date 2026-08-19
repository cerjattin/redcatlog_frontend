# Manual de usuario administrativo - RED MUEMMA

## 1. Objetivo del manual

Este manual explica el uso operativo del panel administrativo de RED MUEMMA. Esta guia esta orientada principalmente a administradores y editores que gestionan usuarios, emprendedoras, productos, categorias, imagenes y aprobaciones.

## 2. Roles de acceso

La plataforma maneja accesos segun el rol del usuario autenticado.

| Rol | Acceso principal | Alcance |
| --- | --- | --- |
| Administrador | `/admin` | Gestiona dashboard, usuarios, emprendedoras, productos, categorias y aprobaciones. |
| Editor | `/editor` | Gestiona contenido operativo: emprendedoras, productos, categorias y aprobaciones. |
| Emprendedora | Flujos propios de emprendedora | Acceso al flujo de perfil, emprendimientos y productos segun aprobacion. |

Si un usuario intenta entrar a una ruta no autorizada, el sistema lo redirige a la pagina de acceso no autorizado.

## 3. Ingreso al sistema

1. Entrar a la pagina publica.
2. Seleccionar `Iniciar sesion`.
3. Ingresar correo y contrasena.
4. Si el usuario debe cambiar contrasena, el sistema lo redirige a `Cambiar contrasena`.
5. Segun el rol, el sistema habilita el panel correspondiente.

Nota: el registro publico de usuarios no se usa en este flujo operativo. Las cuentas deben ser creadas desde el panel administrador.

## 4. Dashboard administrador

Ruta: `/admin`

El dashboard muestra una vista general del sistema:

- Total de usuarios registrados.
- Total de emprendedoras registradas.
- Total de productos creados.
- Total de categorias activas.
- Total de productos y emprendedoras pendientes de aprobacion.
- Productos recientes.
- Emprendedoras recientes.
- Accesos rapidos a modulos principales.

Uso recomendado:

1. Revisar el bloque `Aprobaciones pendientes`.
2. Entrar a `Centro de aprobaciones` si existen pendientes.
3. Verificar productos y emprendedoras recientes.
4. Usar `Actualizar datos` para refrescar la informacion del dashboard.

## 5. Gestion de usuarios

Ruta: `/admin/users`

Este modulo permite consultar usuarios registrados y controlar su acceso.

Tambien permite crear usuarios internos, especialmente cuentas con rol `Editor` para apoyar la administracion del contenido del sitio.

### 5.1 Filtros disponibles

- Busqueda por nombre, correo, ciudad o telefono.
- Estado:
  - Pendiente
  - Activo
  - Inactivo
  - Bloqueado
  - Eliminado
- Rol:
  - Administrador
  - Super administrador
  - Emprendedora

### 5.2 Acciones desde el listado

Para cada usuario se puede:

- Ver detalle.
- Activar.
- Inactivar.
- Bloquear.

Desde el encabezado del modulo se puede seleccionar `Nuevo usuario` para crear una cuenta desde administracion.

### 5.3 Crear usuario

Ruta: `/admin/users/new`

El administrador puede crear usuarios con los siguientes roles:

- Editor.
- Administrador.
- Emprendedora.

Campos principales:

- Nombres.
- Apellidos.
- Correo electronico.
- Contrasena temporal.
- Rol.
- Estado inicial.
- Telefono.
- WhatsApp.
- Ciudad.
- Departamento.
- Pais.

Configuracion recomendada:

1. Para apoyo administrativo, usar rol `Editor`.
2. Dejar estado inicial como `Activo` si la cuenta ya debe poder ingresar.
3. Mantener activa la opcion `Solicitar cambio de contrasena al iniciar sesion`.
4. Entregar la contrasena temporal por un canal seguro.
5. Pedir al usuario que cambie su contrasena en el primer ingreso.

### 5.4 Detalle de usuario

Ruta: `/admin/users/:id`

El detalle permite revisar:

- Informacion principal del usuario.
- Correo, telefono y WhatsApp.
- Ciudad, departamento y pais.
- Estado del correo.
- Biografia.
- Foto de perfil.
- Rol.
- Perfil de emprendedora asociado, si existe.
- Fechas de creacion, actualizacion y ultimo inicio de sesion.

Acciones disponibles:

- Volver al listado.
- Restablecer clave.
- Activar usuario.
- Inactivar usuario.
- Bloquear usuario.
- Cambiar estado manualmente.

Nota operativa: el cambio de rol no esta disponible desde esta version del frontend/backend.

## 6. Gestion de emprendedoras

Ruta: `/admin/entrepreneurs`

Este modulo permite revisar, crear, editar y aprobar perfiles de emprendedoras.

### 6.1 Estados principales

| Estado | Significado |
| --- | --- |
| `draft` | Perfil en borrador. |
| `pending_review` | Perfil enviado para revision. |
| `approved` | Perfil aprobado. |
| `rejected` | Perfil rechazado. |
| `inactive` | Perfil inactivo. |

### 6.2 Filtros y busqueda

El listado permite buscar por:

- Nombre.
- Correo.
- Ciudad.
- Categoria.
- Documento.

Tambien permite filtrar por estado.

### 6.3 Acciones desde el listado

Para cada emprendedora se puede:

- Ver detalle.
- Aprobar.
- Rechazar.
- Inactivar.

### 6.4 Crear o editar emprendedora

Rutas:

- Crear: `/admin/entrepreneurs/new`
- Editar: `/admin/entrepreneurs/:id/edit`

El formulario permite gestionar:

- Informacion personal.
- Documento.
- Categoria.
- Datos de contacto.
- WhatsApp.
- Redes sociales.
- Foto de perfil.
- Banner.

Las imagenes permitidas son JPG, PNG o WEBP. El sistema valida formato y tamano antes de guardar.

Cuando se crea una emprendedora desde el panel, el estado inicial queda como `pending_review`, salvo que el backend indique otro estado.

### 6.5 Detalle de emprendedora

Ruta: `/admin/entrepreneurs/:id`

Desde el detalle se puede:

- Revisar informacion completa.
- Ver imagenes de perfil y banner.
- Aprobar.
- Rechazar.
- Inactivar.
- Editar.
- Cambiar estado manualmente.

Recomendacion: antes de aprobar, verificar datos personales, categoria, contacto, ciudad, descripcion, redes y que las imagenes esten cargadas correctamente.

## 7. Gestion de productos

Ruta: `/admin/products`

Este modulo permite crear, revisar, aprobar, rechazar y controlar productos.

### 7.1 Estados principales

| Estado | Significado |
| --- | --- |
| `draft` | Producto en borrador. |
| `pending_review` | Producto pendiente de revision. |
| `approved` | Producto aprobado. |
| `published` | Producto publicado y visible segun reglas del backend. |
| `rejected` | Producto rechazado. |
| `inactive` | Producto inactivo. |
| `archived` | Producto archivado. |

### 7.2 Crear producto

Ruta: `/admin/products/new`

El producto se registra asociado directamente a una emprendedora. El formulario permite:

- Seleccionar emprendedora.
- Seleccionar categoria.
- Definir nombre.
- Definir descripcion.
- Configurar precio, si aplica.
- Configurar inventario, si aplica.
- Cargar hasta tres imagenes durante la creacion.

Las imagenes se cargan junto con la creacion del producto. Si el producto se crea pero alguna imagen falla, el sistema permite reintentar la carga.

### 7.3 Editar producto

Ruta: `/admin/products/:id/edit`

Permite actualizar los datos principales del producto, manteniendo su asociacion operativa.

### 7.4 Imagenes de producto

Ruta: `/admin/products/:id/images`

Reglas actuales:

- Maximo 3 imagenes por producto.
- Formatos permitidos: JPG, PNG y WEBP.
- Tamano maximo por imagen: 3 MB.
- Se puede eliminar una imagen existente.
- El sistema pide confirmacion antes de eliminar.

### 7.5 Detalle de producto

Ruta: `/admin/products/:id`

Desde el detalle se puede:

- Revisar informacion completa.
- Ver categoria, emprendedora, precio, stock y estado.
- Ver imagenes asociadas.
- Editar.
- Administrar imagenes.
- Aprobar.
- Rechazar.
- Cambiar estado manualmente.

Recomendacion: antes de aprobar o publicar, verificar que el producto tenga imagenes, descripcion clara, categoria correcta y datos consistentes.

## 8. Gestion de categorias

Ruta: `/admin/categories`

Este modulo permite crear, editar, activar o inactivar categorias para productos y emprendedoras.

### 8.1 Tipos de categoria

- Emprendedora.
- Producto.
- Ambos.

### 8.2 Crear o editar categoria

Rutas:

- Crear: `/admin/categories/new`
- Editar: `/admin/categories/:id/edit`

Campos principales:

- Categoria padre, si aplica.
- Nombre.
- Slug.
- Tipo.
- Orden.
- Estado activo/inactivo.
- Icono o imagen.
- Descripcion.

El formulario permite cargar imagen de categoria. Esta imagen se usa cuando la categoria se muestra publicamente.

### 8.3 Activar o inactivar

Desde el listado se puede activar o inactivar una categoria. Una categoria inactiva no deberia usarse para nuevas asociaciones publicas.

## 9. Centro de aprobaciones

Ruta: `/admin/approvals`

El centro de aprobaciones concentra:

- Productos pendientes.
- Emprendedoras pendientes.

Cada tarjeta permite entrar al detalle correspondiente para revisar y tomar decision.

Flujo recomendado:

1. Entrar al centro de aprobaciones.
2. Revisar productos pendientes.
3. Revisar emprendedoras pendientes.
4. Abrir cada registro.
5. Validar informacion, imagenes y coherencia de datos.
6. Aprobar o rechazar.

## 10. Flujo operativo recomendado

### 10.1 Para una nueva emprendedora

1. Confirmar que el usuario exista y este activo.
2. Revisar si tiene perfil de emprendedora.
3. Crear o completar el perfil de emprendedora.
4. Cargar foto y banner.
5. Revisar datos de contacto y categoria.
6. Aprobar el perfil.

### 10.2 Para un nuevo producto

1. Verificar que la emprendedora exista y este aprobada.
2. Crear producto asociado a la emprendedora.
3. Asignar categoria.
4. Cargar imagenes.
5. Revisar descripcion, precio e inventario.
6. Aprobar o publicar segun corresponda.

### 10.3 Para categorias

1. Crear categoria antes de crear productos que dependan de ella.
2. Usar nombres claros.
3. Mantener slug corto y legible.
4. Definir si aplica a producto, emprendedora o ambos.
5. Cargar imagen/icono si se usara en paginas publicas.

## 11. Buenas practicas de administracion

- No aprobar perfiles incompletos.
- No aprobar productos sin imagenes.
- Revisar ortografia antes de publicar contenido.
- Usar categorias consistentes.
- Bloquear usuarios solo cuando sea necesario.
- Inactivar registros que no deban aparecer o ser usados temporalmente.
- Mantener imagenes optimizadas en JPG, PNG o WEBP.
- Evitar imagenes pesadas mayores a 3 MB.

## 12. Errores comunes y solucion

| Situacion | Causa posible | Accion recomendada |
| --- | --- | --- |
| No carga un listado | Error de conexion o backend no disponible | Recargar la pagina o verificar backend. |
| No se puede subir imagen | Formato o peso no permitido | Usar JPG, PNG o WEBP menor a 3 MB. |
| No aparece un producto publico | Estado no aprobado/publicado o faltan reglas del backend | Revisar estado del producto y de la emprendedora. |
| Una emprendedora no puede crear productos | Perfil no aprobado | Aprobar perfil si cumple requisitos. |
| Usuario no puede entrar | Estado inactivo/bloqueado o rol incorrecto | Revisar modulo Usuarios. |

## 13. Rutas administrativas principales

| Modulo | Ruta |
| --- | --- |
| Dashboard administrador | `/admin` |
| Usuarios | `/admin/users` |
| Detalle usuario | `/admin/users/:id` |
| Emprendedoras | `/admin/entrepreneurs` |
| Crear emprendedora | `/admin/entrepreneurs/new` |
| Editar emprendedora | `/admin/entrepreneurs/:id/edit` |
| Productos | `/admin/products` |
| Crear producto | `/admin/products/new` |
| Editar producto | `/admin/products/:id/edit` |
| Imagenes de producto | `/admin/products/:id/images` |
| Categorias | `/admin/categories` |
| Crear categoria | `/admin/categories/new` |
| Editar categoria | `/admin/categories/:id/edit` |
| Aprobaciones | `/admin/approvals` |

## 14. Observaciones finales

Este manual describe el comportamiento visible actualmente en el frontend. Si el backend cambia contratos, estados, permisos o reglas de publicacion, este documento debe actualizarse para mantener coherencia con la operacion real de RED MUEMMA.
