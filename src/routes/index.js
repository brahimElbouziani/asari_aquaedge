// Vue 3 Migration - Router
import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import Login from "@/pages/UserProfile/Login.vue";
import Verif from "@/pages/UserProfile/verification.vue";
import Add from "@/pages/Add.vue";
import Infos from "@/pages/Nodeinfos.vue";
import Analytics from "@/pages/Analytics.vue";
import Settings from "@/pages/Settings.vue";
import Support from "@/pages/Support.vue";
import Contact from "@/pages/Contact.vue";
import Documentation from "@/pages/Documentation.vue";
import SensorDetail from "@/pages/SensorDetail.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Sensors Data Information",
        component: Dashboard,
        meta: {
          requiresAuth: true,
          title: "Dash",
        },
      },
      {
        path: "add",
        name: "Add New Node",
        component: Add,
        meta: {
          requiresAuth: true,
          title: "Dash",
        },
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
        meta: {
          requiresAuth: true,
          title: "Dash",
        },
      },
      {
        path: "table",
        name: "Nodes Table",
        component: TableList,
        meta: {
          requiresAuth: true,
          title: "Dash",
        },
      },
      {
        path: "maps",
        name: "Nodes Maps",
        meta: {
          hideFooter: true,
          requiresAuth: true,
          title: "Dash",
        },
        component: Maps,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
        meta: {
          requiresAuth: true,
          title: "Alertes",
        },
      },
      {
        path: "analytics",
        name: "Analytics",
        component: Analytics,
        meta: {
          requiresAuth: true,
          title: "Analyses",
        },
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings,
        meta: {
          requiresAuth: true,
          title: "Paramètres",
        },
      },
      {
        path: "support",
        name: "Support",
        component: Support,
        meta: {
          requiresAuth: true,
          title: "Support",
        },
      },
      {
        path: "contact",
        name: "Contact",
        component: Contact,
        meta: {
          requiresAuth: true,
          title: "Contact",
        },
      },
      {
        path: "docs",
        name: "Documentation",
        component: Documentation,
        meta: {
          requiresAuth: true,
          title: "Documentation",
        },
      },
      {
        path: "infos",
        name: "Node infos",
        component: Infos,
        meta: {
          requiresAuth: true,
          title: "Dash",
        },
      },
      {
        path: "sensor-detail",
        name: "Sensor Detail",
        component: SensorDetail,
        meta: {
          requiresAuth: true,
          title: "Détails du Capteur",
        },
      },
      {
        path: "sensor-detail/:id",
        name: "Sensor Detail With ID",
        component: SensorDetail,
        meta: {
          requiresAuth: true,
          title: "Détails du Capteur",
        },
        props: true, // Pass route params as props
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: "nav-item active",
});

router.beforeEach(async (to, from, next) => {
  const { useMainStore } = await import('@/store');
  const store = useMainStore();
  
  // If accessing login page and already authenticated, redirect to home
  if (to.path === '/login' || to.name === 'Login') {
    const token = localStorage.getItem('authToken');
    if (token && store.isAuthenticated) {
      // Verify token is still valid
      const isValid = await store.checktoken(token);
      if (isValid) {
        next({ path: '/' });
        return;
      }
    }
    next();
    return;
  }
  
  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // No token, redirect to login
      next({ path: '/login' });
      return;
    }
    
    // Verify token is valid
    if (!store.isAuthenticated) {
      const isValid = await store.checktoken(token);
      if (!isValid) {
        next({ path: '/login' });
        return;
      }
    }
    
    next();
  } else {
    next();
  }
});

export default router;

