import { RouteRecordRaw } from "vue-router";
import App from "../App.vue";
import SigninPage from "../components/SigninPage.vue";
import Configurator from "../components/Configurator.vue";
import DisconnectedPage from "../components/DisconnectedPage.vue";

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
			},
			{
				name: "disconnected",
				path: "/error",
				component: DisconnectedPage
			}
		]
	}
]