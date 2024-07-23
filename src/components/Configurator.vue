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
						<v-text-field v-model="carColor" hide-details @blur="updateString(carColor, 'Car/CarColor')"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						DriverDoorAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="driverDoorAnimation" @change="updateBoolean(driverDoorAnimation, 'Car/DriverDoorAnimation')" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						HeadlightVis
					</v-col>
					<v-col cols="4">
						<v-switch v-model="headlightVis" @change="updateBoolean(headlightVis, 'Car/HeadlightVis')" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						PassengerDoorAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="passengerDoorAnimation" @change="updateBoolean(passengerDoorAnimation, 'Car/PassengerDoorAnimation')" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						ShadowStrength
					</v-col>
					<v-col cols="4">
						<v-text-field v-model="shadowStrength" @blur="updateScalar(shadowStrength, 'Car/ShadowStrength')" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						SunlightRotation
					</v-col>
					<v-col cols="4">
						<v-text-field v-model="sunlightRotation" @blur="updateScalar(sunlightRotation, 'Car/SunlightRotation')" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						TrunkAnimation
					</v-col>
					<v-col cols="4">
						<v-switch v-model="trunkAnimation" @change="updateBoolean(trunkAnimation, 'Car/TrunkAnimation')" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="8">
						UnderGlowVis
					</v-col>
					<v-col cols="4">
						<v-switch v-model="underglowVis" @change="updateBoolean(underglowVis, 'Car/UnderGlowVis')" hide-details></v-switch>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useAppState } from '../state';
import { RoomSystemManager } from '../iam/room-system';
import { SessionConnection } from '@cavrnus/lib/conn';
import { useRouter } from 'vue-router';
import { Hook } from '@cavrnus/lib/V';
import { V } from '@cavrnus/lib';

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

onBeforeMount(async () => {
	if (state.session?.session)
	{
		state.roomSystem = new RoomSystemManager();
		await state.roomSystem.connect(state.session.session as unknown as SessionConnection);

		hookProperties();
	}
	else
	{
		router.push({name: "signin"});
	}

	isLoading.value = false;
});

function hookProperties()
{
	const properties = state.session!.session!.journal.properties;

	hooks.value.push(V.bind(properties.searchForStringProperty("Car/CarColor").current, v => {carColor.value = v;}));
	hooks.value.push(V.bind(properties.searchForBooleanProperty("Car/DriverDoorAnimation").current, v => {driverDoorAnimation.value = v;}));
	hooks.value.push(V.bind(properties.searchForBooleanProperty("Car/HeadlightVis").current, v => {headlightVis.value = v;}));
	hooks.value.push(V.bind(properties.searchForBooleanProperty("Car/PassengerDoorAnimation").current, v => {passengerDoorAnimation.value = v;}));
	hooks.value.push(V.bind(properties.searchForScalarProperty("Car/ShadowStrength").current, v => {shadowStrength.value = v;}));
	hooks.value.push(V.bind(properties.searchForScalarProperty("Car/SunlightRotation").current, v => {sunlightRotation.value = v;}));
	hooks.value.push(V.bind(properties.searchForBooleanProperty("Car/TrunkAnimation").current, v => {trunkAnimation.value = v;}));
	hooks.value.push(V.bind(properties.searchForBooleanProperty("Car/UnderGlowVis").current, v => {underglowVis.value = v;}));
}

async function stop()
{
	if (state.session)
	{
		await state.session.stop();
	}
}

function updateString(value: string, id: string)
{
	state.roomSystem?.updateString(value, id);
}

function updateScalar(value: number, id: string)
{
	state.roomSystem?.updateScalar(value, id);
}

function updateBoolean(value: boolean, id: string)
{
	state.roomSystem?.updateBoolean(value, id);
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