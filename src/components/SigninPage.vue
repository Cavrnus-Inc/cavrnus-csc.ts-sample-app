<template>
	<div class="d-flex align-center justify-center fill-height">
		<v-card class="card">
			<v-tabs v-model="tab">
				<v-tab value="guestUser">Guest User</v-tab>
				<v-tab value="existingUser">Existing User</v-tab>
			</v-tabs>
			<v-tabs-window v-model="tab">
				<v-tabs-window-item value="existingUser">
					<v-card-text>
						<span class="header mb-4">Join the Cavrnus Car Configurator Demo as an existing user:</span>
						<v-col>
							<v-text-field label="Api Endpoint" v-model="api" hint="Example: https://cav.dev.cavrn.us"></v-text-field>
							<v-text-field label="Username" v-model="username"></v-text-field>
							<v-text-field label="Password" v-model="password" type="password"></v-text-field>
							<v-text-field label="Space ID" v-model="roomId"></v-text-field>
							<v-switch v-model="enableRtc" :label="enableRtc ? 'WebRTC Enabled' : 'WebRTC Disabled'"></v-switch>
						</v-col>
						<v-row no-gutters>
							<v-spacer/>
							<v-btn @click="connectUser" :loading="isBusy" flat>Connect</v-btn>
						</v-row>
					</v-card-text>
				</v-tabs-window-item>
				<v-tabs-window-item value="guestUser">
					<v-card-text>
						<span class="header mb-4">Join the Cavrnus Car Configurator Demo as a guest user:</span>
						<v-col>
							<v-text-field label="Api Endpoint" v-model="api" hint="Example: https://cav.dev.cavrn.us"></v-text-field>
							<v-text-field label="Screen Name" v-model="screenName"></v-text-field>
							<v-text-field label="Space ID" v-model="roomId"></v-text-field>
							<v-switch v-model="enableRtc" :label="enableRtc ? 'WebRTC Enabled' : 'WebRTC Disabled'" color="primary"></v-switch>
						</v-col>
						<v-row no-gutters>
							<v-spacer/>
							<v-btn @click="connectGuest" :loading="isBusy" flat>Connect</v-btn>
						</v-row>
					</v-card-text>
				</v-tabs-window-item>
			</v-tabs-window>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import * as config from "../../configs/app.config.json";
import { useAppState, useConn } from "../state";
import { useRouter } from "vue-router";
import { CscOptions, initializeCsc } from "@cavrnus/csc";

const state = useAppState();
const router = useRouter();
const conn = useConn();

const roomId = ref("");
const api = ref("");
const username = ref("");
const password = ref("");
const screenName = ref("");
const enableRtc = ref(config.webRtcEnabled);
const isBusy = ref(true);
const tab = ref<string>("guestUser");

onMounted(async () => {
	loadConfig();
	isBusy.value = false;
});

async function connectGuest()
{
	isBusy.value = true;

	try
	{
		console.log("WebRTC enabled is: ", enableRtc.value)
		const options: CscOptions = {
			enableRtc: enableRtc.value
		};
		
		state.webRtcEnabled = enableRtc.value;
		state.csc = await initializeCsc(options);

		await state.csc.authenticateAsGuest(config.apiEndpoint, screenName.value);
		const spaceConnection = await state.csc.joinSpace(roomId.value);

        const handleDisconnect = (roomId: string, error?: Error) => {
            console.log(`Disconnected from room ${roomId}`, error);
            conn.set(undefined);
            
			state.csc.offDisconnect(handleDisconnect);
            state.csc = undefined;
            
            router.push({name: "disconnected"});
        };

        state.csc.onDisconnect(handleDisconnect);

		conn.set(spaceConnection);

		if (config.webRtcEnabled)
			state.csc.setLocalUserStreamingState(spaceConnection, true, false);

		router.push({name: "configurator"});
	}
	catch (err)
	{
		throw err;
	}
	finally
	{
		isBusy.value = false;
	}
}

async function connectUser()
{
	isBusy.value = true;

	try
	{
		console.log("WebRTC enabled is: ", enableRtc.value)
		const options: CscOptions = {
			enableRtc: enableRtc.value
		};

		state.webRtcEnabled = enableRtc.value;
		state.csc = await initializeCsc(options);

		await state.csc.authenticateWithPassword(api.value, username.value, password.value);
		const spaceConnection = await state.csc.joinSpace(roomId.value);
		conn.set(spaceConnection);

		router.push({name: "configurator"});
	}
	catch (err)
	{
		throw err;
	}
	finally
	{
		isBusy.value = false;
	}
}

function loadConfig()
{
	api.value = config.apiEndpoint;
	roomId.value = config.roomId;

	// for local testing
	if (config.roomId)
	{
		username.value = config.email;
		password.value = config.password;
	}
}

watch(tab, () => {
	loadConfig();
	screenName.value = "";
});
</script>

<style scoped>
.card {
	padding: 10px;
	width: 680px;

	.header {
		font-weight: bold;
		font-size: 18px;
	}
}
</style>
