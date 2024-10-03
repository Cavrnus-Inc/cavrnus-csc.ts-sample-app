<template>
    <div class="fill-height">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>
		<div v-if="!isLoading">
			<div>
				<v-row>
					<v-spacer/>
					<v-btn flat @click="showInputDialog = !showInputDialog">Configure Inputs</v-btn>
				</v-row>
				<v-row row wrap class="d-flex align-center fill-height">
					<v-col class="mb-4" cols="6" v-for="user of spaceUsers">
						<Partcipant class="mr-4" :user="user" />
					</v-col>
				</v-row>
			</div>
		</div>
    </div>
	<v-dialog v-model="showInputDialog" width="400">
		<v-card class="d-flex align-top justify-center dialog pt-4">
			<v-card-text>
				<v-row align="center">
					<v-col>
						Audio
					</v-col>
					<v-col cols="8">
						<v-select :items="audioDevices" v-model="audioDevice" @update:model-value="updateAudioDevice" item-value="id" return-object item-title="name" variant="solo" hide-details>
						</v-select>
					</v-col>
				</v-row>
				<v-row align="center">
					<v-col>
						Video
					</v-col>
					<v-col cols="8">
						<v-select :items="videoDevices" v-model="videoDevice" @update:model-value="updateVideoDevice" item-value="id" return-object item-title="name" variant="solo" hide-details>
						</v-select>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn flat @click="showInputDialog = !showInputDialog">Done</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useAppState, useConn } from '../state';
import { CavrnusUser, Hook } from '@cavrnus/csc';
import Partcipant from './Partcipant.vue';
import { InputDevice } from '@cavrnus/webrtc';

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
const spaceConnection = conn.get();
const showInputDialog = ref(false);

const hooks = ref<Hook[]>([]);
const audioDevices = ref<InputDevice[]>([]);
const videoDevices = ref<InputDevice[]>([]);

// TODO: bind audio/video devies
const audioDevice = ref<InputDevice>();
const videoDevice = ref<InputDevice>();

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
			hooks.value.push(state.csc!.bindAudioInputs(v => {audioDevices.value = v}));
			hooks.value.push(state.csc!.bindVideoInputs(v => {videoDevices.value = v}));
		}
	}
	catch (err)
	{
		console.log(err);
	}
}


function updateVideoDevice(device: InputDevice)
{
	if (device)
		state.csc?.updateVideoInput(device);
}

function updateAudioDevice(device: InputDevice)
{
	if (device)
		state.csc?.updateAudioInput(device);
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