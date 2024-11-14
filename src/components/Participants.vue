<template>
    <div class="fill-height pa-4">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>
		<div v-if="!isLoading">
			<div class="participants-container overflow-x-hidden">
				<v-row>
					<v-col 
						cols="12" 
						class="pa-2"
						v-for="user of spaceUsers" 
						:key="user.connectionId"
					>
						<div style="width: 400px;" class="mx-auto w-100">
							<Partcipant :user="user" />
						</div>
					</v-col>
				</v-row>
			</div>
		</div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useAppState, useConn } from '../state';
import { CavrnusUser, Hook } from '@cavrnus/csc';
import Partcipant from './Partcipant.vue';

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
const spaceConnection = conn.get();

const hooks = ref<Hook[]>([]);

const spaceUsers = ref<CavrnusUser[]>([]);

onBeforeMount(async () => {
	await hookProperties();

	isLoading.value = false;
});

async function hookProperties()
{
	try
	{
		if (spaceConnection && state.csc)
			hooks.value.push(state.csc!.bindSpaceUsers(spaceConnection, v => onSpaceUsersUpdated(v), v => {spaceUsers.value.splice(spaceUsers.value.indexOf(v), 1);}));
	}
	catch (err)
	{
		console.log(err);
	}
}

function onSpaceUsersUpdated(v: CavrnusUser)
{
	if (v.isLocalUser)
		spaceUsers.value.unshift(v);
	else
		spaceUsers.value.push(v);
}

onBeforeUnmount(() => {
	try
	{
		hooks.value.forEach(h => h.off());
		hooks.value = [];
	}
	catch (err)
	{
		console.error(err);
		throw err;
	}
});
</script>

<style scoped>
.card {
	padding: 10px;
	width: 720px;
}

.participants-container {
  height: calc(100vh - 96px);
  overflow-y: auto;
}

.participants-container::-webkit-scrollbar {
  width: 8px;
}

.participants-container::-webkit-scrollbar-track {
  background: transparent;
}

.participants-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>