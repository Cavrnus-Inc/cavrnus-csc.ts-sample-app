import { defineStore } from "pinia";
import { CavrnusSpatialConnector } from "src/services/csc";

export const useAppState = defineStore("appState", {
	state: () => ({
		csc: undefined as CavrnusSpatialConnector | undefined,
	})
})