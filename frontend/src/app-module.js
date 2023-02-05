import {createStore} from 'vuex';
import ProgressBar from '@/shared/progress-bar/progress-bar';
import {createRouter, createWebHistory} from 'vue-router';
import shared from '@/shared/shared-module';
import auth from '@/modules/auth/auth-module';
import layout from '@/modules/layout/layout-module';
import home from '@/modules/home/home-module';
import iam from '@/modules/iam/iam-module';
import settings from '@/modules/settings/settings-module';
import auditLog from '@/modules/audit-log/audit-log-module';
import loan from '@/modules/loan/loan-module';
import book from '@/modules/book/book-module';
import PermissionChecker from '@/modules/iam/permission-checker';

const modules = {
  shared,
  home,
  settings,
  auth,
  iam,
  auditLog,
  layout,
  loan,
  book,
};

// start - boilerplate code

const exists = (el) => !!el;

function setupComponentsFiltersDirectivesAndMixins(app) {
  Object.keys(modules)
    .map((key) => modules[key].components)
    .filter(exists)
    .forEach((components) => {
      components.forEach((component) => {
        app.component(component.name, component);
      });
    });


  Object.keys(modules)
    .map((key) => modules[key].directives)
    .filter(exists)
    .forEach((directives) => {
      directives.forEach((directive) => {
        app.directive(
          directive.name,
          directive.implementation,
        );
      });
    });

  Object.keys(modules)
    .map((key) => modules[key].mixins)
    .filter(exists)
    .forEach((mixins) => {
      mixins.forEach((mixin) => {
        app.mixin(mixin);
      });
    });
}
const buildStores = () => {
  const output = {};

  Object.keys(modules)
    .filter((key) => !!modules[key].store)
    .forEach((key) => {
      output[key] = modules[key].store;
    });

  return output;
};

let store = null;

const storeAsync = () => {
  if (!store) {
    store = createStore({ modules: buildStores() });
  }

  return store;
};
const routes = [
  ...Object.keys(modules)
    .filter((key) => !!modules[key].routes)
    .map((key) => modules[key].routes)
    .reduce((a, b) => a.concat(b), []),
  { path: '/:pathMatch(.*)', redirect: '/404' },
];
    const router = createRouter({
      history: createWebHistory(),
      routes,
      scrollBehavior() {
        return { x: 0, y: 0 };
      },
    });

    router.beforeEach(async(to, from, next) => {
      if (!to.meta) {
        next();
        return;
      }
      const store = storeAsync();
      
      await store.dispatch('auth/doWaitUntilInit');
      if (to.meta.auth){
      if (!store.getters['auth/signedIn']) {
        next({ path: '/auth/signin' });
        return;
      }
  
      if (
        to.path !== '/auth/email-unverified' &&
        !store.getters['auth/currentUser'].emailVerified
      ) {
        next({ path: '/auth/email-unverified' });
        return;
      }
  
      if (
        to.path !== '/auth/empty-permissions' &&
        store.getters['auth/currentUser'].emailVerified &&
        !store.getters['auth/roles'].length
      ) {
        next({ path: '/auth/empty-permissions' });
        return;
      }
      }
      if (to.meta.unauth){
      if (store.getters['auth/signedIn']) {
        next('/');
      }
    }
    if (to.meta.emailAlreadyVerified){
      if (
        store.getters['auth/signedIn'] &&
        store.getters['auth/currentUser'].emailVerified
      ) {
        next('/');
        return
      }
    }
    if (to.meta.notEmptyPermissions ){
      if (
        store.getters['auth/signedIn'] &&
        store.getters['auth/roles'].length
      ) {
        next('/');
      }
    }
    if(to.meta.permission){
      if (
        !new PermissionChecker(
          storeAsync().getters['auth/currentUser'],
        ).match(to.meta.permission)
      ) {
        next('/403');
      }
    }
      if (to.name) {
        ProgressBar.start();
      }

      next();
    });

    router.afterEach(() => {
      ProgressBar.done();
    });


export {
  setupComponentsFiltersDirectivesAndMixins,
  router,
  storeAsync,
};

// end - boilerplate code
