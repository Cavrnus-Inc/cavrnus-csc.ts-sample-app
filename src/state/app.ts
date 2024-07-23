import { defineStore } from "pinia";
import { SessionManager } from "../iam/session";
import { RoomSystemManager } from "../iam/room-system";

export const useAppState = defineStore("appState", {
	state: () => ({
		session: null as SessionManager | null,
		roomSystem: null as RoomSystemManager | null
	})
})