
import  { createApp } from 'vue';
import {
  setupComponentsFiltersDirectivesAndMixins,
  storeAsync,
  router,
} from '@/app-module';
import App from '@/app.vue';
import { SettingsService } from '@/modules/settings/settings-service';
import ProgressBar from '@/shared/progress-bar/progress-bar';
import { i18n } from '@/i18n';
import Element from 'element-plus';
import 'element-plus/dist/index.css'
import { getElementUILanguage } from '@/i18n';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

(async function() {
  document.title = i18n('app.title');
  ProgressBar.start();
  await SettingsService.fetchAndApply();
  
})();
const app = createApp (App)
  setupComponentsFiltersDirectivesAndMixins(app);
  app.use(Element, { locale: getElementUILanguage() });
  app.use(storeAsync())
  app.use(router)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.mount ('#app')
