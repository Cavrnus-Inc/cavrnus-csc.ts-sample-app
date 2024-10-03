<template>
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
import { InputDevice } from '@cavrnus/webrtc/rtc';
import { ref } from 'vue';

interface IProps
{
	videoDevices: InputDevice[],
	audioDevices: InputDevice[],
	videoDevice: InputDevice,
	audioDevice: InputDevice 
}

const props = defineProps<IProps>();
const showInputDialog = ref(false);

function updateVideoDevice(device: InputDevice)
{

}

function updateAudioDevice(device: InputDevice)
{
	
}

</script>