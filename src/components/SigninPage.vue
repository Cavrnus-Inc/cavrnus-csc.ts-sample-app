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
						<span class="header mb-4">Log into the Cavrnus Spatial Connector as an existing user:</span>
						<v-col>
							<v-text-field label="Api Endpoint" v-model="api"></v-text-field>
							<v-text-field label="Username" v-model="username"></v-text-field>
							<v-text-field label="Password" v-model="password" type="password"></v-text-field>
							<v-text-field label="Space ID" v-model="roomId"></v-text-field>
						</v-col>
						<v-row no-gutters>
							<v-spacer/>
							<v-btn @click="connectUser" :loading="isBusy" flat>Connect</v-btn>
						</v-row>
					</v-card-text>
				</v-tabs-window-item>
				<v-tabs-window-item value="guestUser">
					<v-card-text>
						<span class="header mb-4">Log into the Cavrnus Spatial Connector as a guest user:</span>
						<v-col>
							<v-text-field label="Screen Name" v-model="screenName"></v-text-field>
							<v-text-field label="Space ID" v-model="roomId"></v-text-field>
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
const isBusy = ref(true);
const tab = ref<string>("existingUser");

onMounted(async () => {
	loadConfig();
	isBusy.value = false;
});

async function connectGuest()
{
	isBusy.value = true;

	try
	{
		const options: CscOptions = {
			enableRtc: true
		};
		state.csc = await initializeCsc(options);
		await state.csc.authenticateAsGuest(config.apiEndpoint, screenName.value);
		conn.set(await state.csc.joinSpace(roomId.value));

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
		const options: CscOptions = {
			enableRtc: config.webRtcEnabled
		};
		state.csc = await initializeCsc(options);
		await state.csc.authenticateWithPassword(api.value, username.value, password.value);
		conn.set(await state.csc.joinSpace(roomId.value));
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
