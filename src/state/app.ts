import { defineStore } from "pinia";
import { CavrnusSpaceConnection, CavrnusSession } from "@cavrnus/csc";

export const useAppState = defineStore("appState", {
	state: () => ({
		session: null as CavrnusSession | null,
		spaceConnection: null as CavrnusSpaceConnection | null
	})
})