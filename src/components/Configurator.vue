<template>
    <div class="d-flex align-center justify-center fill-height">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>

		<v-card class="card" v-if="!isLoading">
			<v-card-title>
				Properties
			</v-card-title>
			<v-card-text>
				<v-row class="align-center">
					<v-col cols="8">
						CarColor
					</v-col>
					<v-col cols="4">
						<v-text-field v-model="carColor" hide-details @blur="updateString('Car', 'CarColor', carColor)"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						DriverDoorAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="driverDoorAnimation" @change="updateBoolean('Car', 'DriverDoorAnimation', driverDoorAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						HeadlightVis
					</v-col>
					<v-col cols="4">
						<v-switch v-model="headlightVis" @change="updateBoolean('Car', 'HeadlightVis', headlightVis)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						PassengerDoorAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="passengerDoorAnimation" @change="updateBoolean('Car', 'PassengerDoorAnimation', passengerDoorAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						ShadowStrength
					</v-col>
					<v-col cols="4">
						<v-text-field v-model="shadowStrength" @blur="updateScalar('Car', 'ShadowStrength', shadowStrength)" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						SunlightRotation
					</v-col>
					<v-col cols="4">
						<v-text-field v-model="sunlightRotation" @blur="updateScalar('Car', 'SunlightRotation', sunlightRotation)" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						TrunkAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="trunkAnimation" @change="updateBoolean('Car', 'TrunkAnimation', trunkAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						UnderGlowVis
					</v-col>
					<v-col cols="4">
						<v-switch v-model="underglowVis" @change="updateBoolean('Car', 'UnderGlowVis', underglowVis)" hide-details></v-switch>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useAppState } from '../state';
import { SpaceConnectionManager } from '../services/space-connection';
import { useRouter } from 'vue-router';
import { Hook } from '@cavrnus/lib/V';

const state = useAppState();
const router = useRouter();
const isConnected = ref(state.session?.isConnected);
const isLoading = ref(true);

const hooks = ref<Hook[]>([]);

const carColor = ref("");
const driverDoorAnimation = ref(false);
const headlightVis = ref(false);
const passengerDoorAnimation = ref(false);
const shadowStrength = ref(0);
const sunlightRotation = ref(0);
const trunkAnimation = ref(false);
const underglowVis = ref(false);
const spaceConnectionManager = new SpaceConnectionManager();

onBeforeMount(async () => {
	if (state.session?.session)
	{
		await spaceConnectionManager.connect(state.session.session);
		state.spaceConnection = spaceConnectionManager.spaceConnection;

		await hookProperties();
	}
	else
	{
		router.push({name: "signin"});
	}

	isLoading.value = false;
});

async function hookProperties()
{
	try
	{
		hooks.value.push(spaceConnectionManager.bindStringProperty("Car", "CarColor", v => {carColor.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindBooleanPropertyValue("Car", "DriverDoorAnimation", v => {driverDoorAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindBooleanPropertyValue("Car", "HeadlightVis", v => {headlightVis.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindBooleanPropertyValue("Car", "PassengerDoorAnimation", v => {passengerDoorAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindScalarPropertyValue("Car", "ShadowStrength", v => {shadowStrength.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindScalarPropertyValue("Car", "SunlightRotation", v => {sunlightRotation.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindBooleanPropertyValue("Car", "TrunkAnimation", v => {trunkAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.spaceConnection.bindBooleanPropertyValue("Car", "UnderGlowVis", v => {underglowVis.value = v;}));
	}
	catch (err)
	{
		console.log(err);
	}
}

async function stop()
{
	if (state.session)
	{
		await state.session.stop();
	}
}

function updateString(container: string, id: string, value: string)
{
	state.spaceConnection?.postStringPropertyUpdate(container, id, value);
}

function updateScalar(container: string, id: string, value: number)
{
	state.spaceConnection?.postScalarPropertyUpdate(container, id, value);
}

function updateBoolean(container: string, id: string, value: boolean)
{
	state.spaceConnection?.postBooleanPropertyUpdate(container, id, value);
}

onBeforeUnmount(async () => {
	hooks.value.forEach(h => h.off());
	hooks.value = [];

	await stop();
});

watch(isConnected, () => {
	if (!isConnected.value)
		router.push({name: "signin"});
})

</script>

<style scoped>
.card {
	padding: 10px;
	width: 580px;
}
</style>