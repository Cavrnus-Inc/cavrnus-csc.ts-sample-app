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
						<v-text-field v-model="roomId" hide-details readOnly></v-text-field>
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
import { SessionManager } from '../iam/session';
import { useAppState } from '../state';
import { useRouter } from 'vue-router';

const state = useAppState();
const router = useRouter();

const roomId = ref("");
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
		state.session = new SessionManager();
		await state.session.start(roomId.value);

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
		roomId.value = config.roomId;
}

</script>

<style scoped>
.card {
	padding: 10px;
	width: 680px;
}
</style>
