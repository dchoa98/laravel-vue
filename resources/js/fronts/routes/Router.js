import { createRouter, createWebHistory } from "vue-router";

import index from '../index/index.vue';
import main from '../layout/main.vue';

const routes = [
	{
		path: '/',
		name: 'main',
		component: main,
		children: [
			{
				path: '/test',
				name: 'test',
				component: index
			}
		]
	}
]
export default createRouter({
	history: createWebHistory(),
	routes
})