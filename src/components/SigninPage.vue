<template>
	<div class="d-flex align-center justify-center fill-height">
		<v-card class="card">
			<v-card-title>
				<span>Car Configurator</span>
			</v-card-title>
			<v-card-text>
				<v-row class="align-center">
					<v-col>
						<span>Connect to begin configurating</span>
					</v-col>
					<v-col>
						<v-text-field v-model="api"></v-text-field>
						<v-text-field v-model="username"></v-text-field>
						<v-text-field v-model="password" type="password"></v-text-field>
						<v-text-field v-model="roomId"></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn @click="connect" :loading="isBusy">Connect</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as config from "../../configs/app.config.json";
import { Session } from '../services/session';
import { useAppState } from '../state';
import { useRouter } from 'vue-router';
import { CavrnusSession } from '@cavrnus/csc';

const state = useAppState();
const router = useRouter();

const roomId = ref("");
const api = ref("");
const username = ref("");
const password = ref("");
const isBusy = ref(true);

onMounted(() => {
	loadConfig();

	isBusy.value = false;
});

async function connect()
{
	isBusy.value = true;

	try
	{
		const session = new Session();
		
		await session.authenticateWithPassword(api.value, username.value, password.value);
		await session.joinSpace(roomId.value);

		state.session = session.session;

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
	if (config.roomId)
	{
		roomId.value = config.roomId;
		username.value = config.email;
		password.value = config.password;	
		api.value = config.apiEndpoint;
	}
}

</script>

<style scoped>
.card {
	padding: 10px;
	width: 680px;
}
</style>
