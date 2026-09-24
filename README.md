<div align="center">

# `</>` KAFSHINO

### MODERN E-COMMERCE PLATFORM

**React · JavaScript · Tailwind CSS · Vite · REST API Ready**

<br>

<a href="https://github.com/yosuf-dev/shoesWebsite">
  <img src="https://img.shields.io/badge/GitHub-shoesWebsite-0D1117?style=flat-square&logo=github&logoColor=white" />
</a>

 

<a href="https://yosuf-dev.github.io/shoesWebsite/">
  <img src="https://img.shields.io/badge/Live-Demo-0D1117?style=flat-square&logo=googlechrome&logoColor=white" />
</a>

</div>

---

## `01` — PROJECT

**Kafshino** is a modern Persian e-commerce frontend focused on building a complete footwear shopping experience with a scalable React architecture.

The project is designed around:

```text
Product Discovery
      ↓
Shopping Experience
      ↓
Authentication
      ↓
Customer Dashboard
      ↓
Administration
      ↓
API Integration
```

The goal is not simply to create a product page.

The goal is to build the **frontend foundation of a real e-commerce platform**.

---

## `02` — ENGINEERING STACK

### Frontend

<p>
<img src="https://skillicons.dev/icons?i=react,js,vite,tailwind" />
</p>

**React · JavaScript · Vite · Tailwind CSS**

### Application

<p>
<img src="https://skillicons.dev/icons?i=react,redux" />
</p>

**React Router · Context API · React Hook Form · Lazy Loading**

### UI / Experience

**Framer Motion · Lucide React · Responsive UI · RTL**

### Data & API

<p>
<img src="https://skillicons.dev/icons?i=axios" />
</p>

**Axios · Mock API Layer · Local Storage · REST API Ready**

### Analytics

**Chart.js · Dashboard Statistics · Data Visualization**

### Deployment

<p>
<img src="https://skillicons.dev/icons?i=githubactions,github" />
</p>

**Git · GitHub · GitHub Actions · GitHub Pages**

---

## `03` — WHAT IT INCLUDES

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│  STOREFRONT                                        │
│  Product discovery, categories, brands and search  │
│                                                    │
│  SHOPPING                                          │
│  Cart, checkout, wishlist and product comparison  │
│                                                    │
│  CUSTOMER                                          │
│  Orders, tracking, invoices and account settings   │
│                                                    │
│  ADMIN                                             │
│  Products, orders, users, inventory and analytics  │
│                                                    │
│  EXPERIENCE                                        │
│  RTL, responsive layouts, animation and themes    │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## `04` — STOREFRONT

### Product Experience

The public storefront provides a complete product discovery experience.

```text
Home
 ↓
Categories
 ↓
Products
 ↓
Filters
 ↓
Product Details
 ↓
Cart
 ↓
Checkout
```

### Included

* Hero section
* Product categories
* Brands
* Featured products
* Best sellers
* Flash sale
* Product search
* Product filtering
* Product sorting
* Product details
* Product variants
* Wishlist
* Product comparison
* FAQ
* Contact
* Blog

---

## `05` — SHOPPING SYSTEM

The shopping flow is built around reusable React state and components.

```text
                PRODUCT
                   │
                   ▼
             PRODUCT DETAILS
                   │
                   ▼
              ADD TO CART
                   │
                   ▼
                  CART
                   │
                   ▼
               CHECKOUT
                   │
                   ▼
             ORDER SUCCESS
```

### Shopping Features

* Cart management
* Quantity management
* Product variants
* Wishlist
* Product comparison
* Coupon support
* Shipping calculation
* Order summary
* Checkout flow
* Persistent client-side state

---

## `06` — CUSTOMER PORTAL

Kafshino includes a dedicated customer dashboard.

```text
                    CUSTOMER
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
      ORDERS        PROFILE        WISHLIST
        │              │              │
        ▼              ▼              ▼
    TRACKING       SECURITY       ADDRESSES
        │
        ▼
     INVOICES
        │
        ▼
     SUPPORT
```

### Customer Features

* Dashboard
* Order history
* Order details
* Order tracking
* Invoices
* Addresses
* Wishlist
* Notifications
* Profile
* Security
* Settings
* Support tickets

---

## `07` — ADMINISTRATION

The project also contains a complete administration interface.

```text
                         ADMIN
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
   PRODUCTS             ORDERS             CUSTOMERS
       │                   │                   │
       ▼                   ▼                   ▼
  INVENTORY            REPORTS              USERS
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                       ANALYTICS
```

### Admin Modules

* Dashboard
* Analytics
* Products
* Create product
* Edit product
* Orders
* Customers
* Users
* Roles
* Coupons
* Reviews
* Inventory
* Reports
* Notifications
* Activity
* Logs
* Settings

---

## `08` — ARCHITECTURE

The project uses a modular structure designed to separate responsibilities.

```text
src/
│
├── components/
│   ├── admin/
│   ├── customer/
│   ├── home/
│   ├── product/
│   └── ui/
│
├── contexts/
│   ├── AuthContext
│   ├── CartContext
│   ├── ThemeContext
│   ├── ToastContext
│   └── WishlistContext
│
├── data/
│   └── mockData
│
├── hooks/
│
├── layouts/
│   ├── PublicLayout
│   ├── CustomerLayout
│   └── AdminLayout
│
├── pages/
│   ├── public/
│   ├── customer/
│   └── admin/
│
├── services/
│   ├── api
│   ├── authService
│   └── productService
│
├── utils/
│
├── App
└── main
```

---

## `09` — DATA FLOW

```text
                         REACT
                           │
                           ▼
                      COMPONENTS
                           │
                           ▼
                       CONTEXTS
                           │
                           ▼
                       SERVICES
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          MOCK DATA                 REAL API
              │                         │
              └────────────┬────────────┘
                           ▼
                         USER
```

The service layer makes it possible to replace the current mock implementation with a real backend without redesigning the entire frontend.

---

## `10` — AUTHENTICATION

Authentication is currently implemented through a development-oriented mock service.

Supported flows include:

```text
REGISTER
   ↓
LOGIN
   ↓
SESSION
   ↓
PROTECTED ROUTES
   ↓
CUSTOMER / ADMIN
   ↓
LOGOUT
```

### Authentication Features

* Login
* Registration
* Logout
* Session persistence
* Protected routes
* Profile management
* Password management
* Customer access
* Admin access

> The current authentication system is intended for development and demonstration. Production authentication should be handled by a secure backend.

---

## `11` — USER EXPERIENCE

The visual direction focuses on a modern premium shopping experience.

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│  RTL                                               │
│  Persian-first interface and layouts              │
│                                                    │
│  RESPONSIVE                                        │
│  Mobile → Tablet → Desktop                        │
│                                                    │
│  MOTION                                            │
│  Subtle transitions and interactions              │
│                                                    │
│  THEMING                                           │
│  Light / Dark experience                           │
│                                                    │
│  TYPOGRAPHY                                        │
│  Local Persian fonts and visual hierarchy          │
│                                                    │
└────────────────────────────────────────────────────┘
```

The interface is designed to feel like a **real product**, rather than a simple frontend exercise.

---

## `12` — PERFORMANCE

The application includes several frontend performance techniques.

```text
Lazy Loading
     ↓
Code Splitting
     ↓
Chunk Optimization
     ↓
Debounced Search
     ↓
Reusable Components
     ↓
Local State Persistence
```

### Included

* Route-level lazy loading
* React Suspense
* Vite production builds
* Dependency chunking
* Debounced search
* Infinite scroll utilities
* Local storage persistence
* Reusable components

---

## `13` — DEPLOYMENT

Kafshino is deployed through **GitHub Pages**.

```text
                    PUSH
                      │
                      ▼
                GITHUB ACTIONS
                      │
                      ▼
                 NPM INSTALL
                      │
                      ▼
                  NPM BUILD
                      │
                      ▼
                BUILD ARTIFACT
                      │
                      ▼
                GITHUB PAGES
```

### Live

→ https://yosuf-dev.github.io/shoesWebsite/

---

## `14` — DEVELOPMENT

### Install

```bash
git clone https://github.com/yosuf-dev/shoesWebsite.git
```

```bash
cd shoesWebsite
```

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## `15` — MAIN ROUTES

### Public

```text
/
/shop
/product/:slug
/cart
/checkout
/order-success
/wishlist
/compare
/login
/register
/forgot-password
/faq
/contact
/blog
```

### Customer

```text
/panel
/panel/orders
/panel/orders/:id
/panel/wishlist
/panel/addresses
/panel/invoices
/panel/tickets
/panel/notifications
/panel/profile
/panel/security
/panel/settings
/panel/track
```

### Admin

```text
/admin
/admin/analytics
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/orders
/admin/orders/:id
/admin/customers
/admin/users
/admin/roles
/admin/coupons
/admin/reviews
/admin/inventory
/admin/reports
/admin/notifications
/admin/activity
/admin/logs
/admin/settings
```

---

## `16` — BACKEND ROADMAP

The frontend architecture is prepared for a future full-stack implementation.

```text
                  KAFSHINO
                     │
          ┌──────────┴──────────┐
          │                     │
       FRONTEND              BACKEND
          │                     │
        React              Laravel API
          │                     │
      Tailwind                  │
          │                     │
          └──────────┬──────────┘
                     │
                   MySQL
                     │
                     ▼
                PRODUCTION
```

### Planned

* [ ] Laravel API
* [ ] MySQL database
* [ ] Real authentication
* [ ] Server-side authorization
* [ ] Real product API
* [ ] Real order API
* [ ] Payment integration
* [ ] Production image storage
* [ ] Automated testing
* [ ] Production deployment

---

## `17` — PROJECT PIPELINE

```text
                    IDEA
                     │
                     ▼
                REQUIREMENTS
                     │
                     ▼
                   DESIGN
                     │
                     ▼
                  FRONTEND
                     │
                     ▼
                    API
                     │
                     ▼
                  BACKEND
                     │
                     ▼
                  DATABASE
                     │
                     ▼
                  TESTING
                     │
                     ▼
                 DEPLOYMENT
```

---

## `18` — PROJECT STATUS

```text
┌──────────────────────────────────────────────┐
│                                              │
│  FRONTEND              ████████████████ 100% │
│  UI / UX               ████████████████ 100% │
│  SHOPPING FLOW         ███████████████░  90% │
│  CUSTOMER PANEL        ███████████████░  90% │
│  ADMIN PANEL           ███████████████░  90% │
│  MOCK SERVICES         ████████████████ 100% │
│  REAL BACKEND          ███░░░░░░░░░░░░░  20% │
│                                              │
└──────────────────────────────────────────────┘
```

---

## `19` — REPOSITORY

<div align="center">

<a href="https://github.com/yosuf-dev/shoesWebsite">
<img src="https://img.shields.io/badge/VIEW%20SOURCE-0D1117?style=for-the-badge&logo=github&logoColor=white" />
</a>

 

<a href="https://yosuf-dev.github.io/shoesWebsite/">
<img src="https://img.shields.io/badge/LIVE%20DEMO-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" />
</a>

</div>

---

## `20` — BUILT WITH

<div align="center">

```text
React
   +
Vite
   +
Tailwind CSS
   +
React Router
   +
Framer Motion
   +
Axios
   +
Chart.js
   +
Modern Component Architecture
```

</div>

---

## `21` — AUTHOR

<div align="center">

### `</>` YOSUF

**Full-Stack Web Developer**

<br>

<a href="https://github.com/yosuf-dev">
  <img src="https://img.shields.io/badge/GitHub-yosuf--dev-0D1117?style=for-the-badge&logo=github&logoColor=white"/>
</a>

 

<a href="https://www.linkedin.com/in/yosuf-saleh-zadeh-2a0b34421/">
  <img src="https://img.shields.io/badge/LinkedIn-Profile-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

</div>

---

<div align="center">

```text
╭──────────────────────────────────────────────╮
│                                              │
│       DESIGN  ·  BUILD  ·  SHIP  ·  SCALE   │
│                                              │
╰──────────────────────────────────────────────╯
```

### `</>` KAFSHINO

**Modern E-Commerce Platform**

<br>

<img
src="https://capsule-render.vercel.app/api?type=waving&color=0:020617,50:0F172A,100:38BDF8&height=120&section=footer"
width="100%"
/>

</div>
