<template>
	<v-app-bar :elevation="2">
		<v-app-bar-title>{{ roomName }}</v-app-bar-title>
		<template v-slot:append>
			<v-btn flat @click="showInputDialog = !showInputDialog">Configure Inputs</v-btn>
        </template>
	</v-app-bar>

	<v-dialog v-model="showInputDialog" width="400">
		<v-card class="d-flex align-top justify-center dialog pt-4">
			<v-card-text>
				<v-row align="center">
					<v-col>
						Audio
					</v-col>
					<v-col cols="8">
						<v-select 
							:items="audioDevices" 
							v-model="audioDevice" 
							@update:model-value="updateAudioDevice" 
							item-value="id" 
							return-object 
							item-title="name" 
							variant="solo" 
							hide-details>
						</v-select>
					</v-col>
				</v-row>
				<v-row align="center">
					<v-col>
						Video
					</v-col>
					<v-col cols="8">
						<v-select 
							:items="videoDevices" 
							v-model="videoDevice" 
							@update:model-value="updateVideoDevice" 
							item-value="id" 
							return-object 
							item-title="name" 
							variant="solo" 
							hide-details>
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
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useAppState, useConn } from "../state";
import { Hook } from "@cavrnus/csc/cavrnus-function-library";
import { InputDevice } from "@cavrnus/csc";

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
let spaceConnection = conn.get();
const roomName = ref("");
const showInputDialog = ref(false);
const hooks = ref<Hook[]>([])

const audioDevices = ref<InputDevice[]>([]);
const videoDevices = ref<InputDevice[]>([]);

const audioDevice = ref<InputDevice>();
const videoDevice = ref<InputDevice>();

onBeforeMount(async () => {
	await hookProperties();

	if (state.csc && conn.get() && spaceConnection)
	{
		if (spaceConnection.session && spaceConnection.session.roomMetadata.get())
			roomName.value = spaceConnection.session.roomMetadata.get().name;
	}

	isLoading.value = false;
});
async function hookProperties()
{
	try
	{
		if (spaceConnection && state.csc)
		{
			hooks.value.push(state.csc!.bindAudioInputs(v => {audioDevices.value = v}));
			hooks.value.push(state.csc!.bindVideoInputs(v => {videoDevices.value = v}));
			hooks.value.push(state.csc!.bindVideoInput(v => {videoDevice.value = v}));
			hooks.value.push(state.csc!.bindAudioInput(v => {audioDevice.value = v}));
		}
	}
	catch (err)
	{
		console.log(err);
	}
}

async function updateVideoDevice(device: InputDevice)
{
	if (device && state.csc)
	{
		await state.csc.updateVideoInput(device);
	}
}

function updateAudioDevice(device: InputDevice)
{
	if (device && state.csc)
	{
		state.csc.updateAudioInput(device);
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
	width: 720px;
}
</style>