<template>
    <div class="d-flex align-center fill-height">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>
		<div v-if="!isLoading">
			<v-row row wrap>
				<v-col class="mb-4" cols="12" v-for="user of spaceUsers">
					<Partcipant class="mr-4" :user="user" />
				</v-col>
			</v-row>
		</div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useAppState, useConn } from '../state';
import { CavrnusUser, Hook } from '@cavrnus/csc/types';
import Partcipant from './Partcipant.vue';

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
let spaceConnection = conn.get();

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
		{
			hooks.value.push(state.csc!.bindSpaceUsers(spaceConnection, v => {spaceUsers.value.push(v);}, v => {spaceUsers.value.splice(spaceUsers.value.indexOf(v), 1);}));
		}

		console.log(spaceUsers.value.length)
		console.log(spaceUsers.value)
	}
	catch (err)
	{
		console.log(err);
	}
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
</style>