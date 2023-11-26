import './bootstrap';
import {createApp} from 'vue';

import App from './fronts/App.vue';
import Router from './fronts/routes/Router';

const app = createApp(App).use(Router);
app.mount("#app");

window.app = app;
// optionally:
window.app.config.productionTip = false;
window.app.config.devtools = true;