import { defineStore } from "pinia";
import { CavrnusFunctionLibrary } from "@cavrnus/csc/cavrnus-function-library";

export const useAppState = defineStore("appState", {
	state: () => ({
		csc: undefined as CavrnusFunctionLibrary | undefined
	})
})