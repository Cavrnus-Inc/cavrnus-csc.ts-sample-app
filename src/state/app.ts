import { defineStore } from "pinia";
import { CavrnusFunctionLibrary } from "@cavrnus/csc";

export const useAppState = defineStore("appState", {
	state: () => ({
		csc: undefined as CavrnusFunctionLibrary | undefined,
		webRtcEnabled: false
	})
})