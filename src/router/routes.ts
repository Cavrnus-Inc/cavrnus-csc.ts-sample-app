import { RouteRecordRaw } from "vue-router";
import App from "../App.vue";
import SigninPage from "../components/SigninPage.vue";
import Configurator from "../components/Configurator.vue";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: App,
		children: [
			{
				name: "signin",
				path: "/signin",
				component: SigninPage
			},
			{
				name: "configurator",
				path: "/configurator",
				component: Configurator
			}
		]
	}
]