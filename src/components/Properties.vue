<template class="pa-4">
    <div class="fill-height pa-4">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>
		<div v-if="!isLoading">
			<v-row class="align-center">
				<v-col cols="7">
					Shadow Strength
				</v-col>
				<v-col cols="5">
					<v-text-field v-model="shadowStrength" @change="updateScalar('Car', 'ShadowStrength', shadowStrength)" hide-details type="number" step="0.1" min="0" max="1"></v-text-field>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Sunlight Rotation
				</v-col>
				<v-col cols="5">
					<v-text-field v-model="sunlightRotation" @change="updateScalar('Car', 'SunRotation', sunlightRotation)" hide-details type="number" min="0" max="360"></v-text-field>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Driver Door Animation
				</v-col>
				<v-col cols="5">
					<v-switch v-model="driverDoorAnimation" @change="updateBoolean('Car', 'DriverDoorAnimation', driverDoorAnimation)" hide-details></v-switch>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Passenger Door Animation
				</v-col>
				<v-col cols="5">
					<v-switch v-model="passengerDoorAnimation" @change="updateBoolean('Car', 'PassengerDoorAnimation', passengerDoorAnimation)" hide-details></v-switch>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Trunk Animation
				</v-col>
				<v-col cols="5">
					<v-switch v-model="trunkAnimation" @change="updateBoolean('Car', 'TrunkAnimation', trunkAnimation)" hide-details></v-switch>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Car Color
				</v-col>
				<v-col cols="5">
					<v-text-field v-model="carColor" hide-details @update:model-value="updateString('Car', 'CarColor', carColor)"></v-text-field>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Headlights Visibility
				</v-col>
				<v-col cols="5">
					<v-switch v-model="headlightVis" @change="updateBoolean('Car', 'HeadlightsVis', headlightVis)" hide-details></v-switch>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Underglow Visibility
				</v-col>
				<v-col cols="5">
					<v-switch v-model="underglowVis" @change="updateBoolean('Car', 'UnderGlowVis', underglowVis)" hide-details></v-switch>
				</v-col>
			</v-row>
			<v-row class="align-center">
				<v-col cols="7">
					Underglow Color
				</v-col>
				<v-col cols="5">
					<v-color-picker
						:swatches="swatches"
						show-swatches
						hide-canvas
						hide-sliders
						hide-inputs
						:mode="'hexa'"
						v-model="selectedColor"
						class="custom-color-picker"
						@update:model-value="color => updateColor('Car', 'UnderGlowColor', color)"
						width="250"
					>
					</v-color-picker>
				</v-col>
			</v-row>
		</div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useAppState, useConn } from '../state';
import { Hook } from '@cavrnus/lib/V';

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
let spaceConnection = conn.get();

const hooks = ref<Hook[]>([]);

const carColor = ref("");
const driverDoorAnimation = ref(false);
const headlightVis = ref(false);
const passengerDoorAnimation = ref(false);
const underglowColor = ref({r: 0, g: 0, b: 0, a: 0});
const shadowStrength = ref(0);
const sunlightRotation = ref(0);
const trunkAnimation = ref(false);
const underglowVis = ref(false);
const selectedColor = ref("");

const colorValAsHex = computed(()=>{
	return `#${floatToColorComponent(underglowColor.value.r)}${floatToColorComponent(underglowColor.value.g)}${floatToColorComponent(underglowColor.value.b)}`;
});

const swatches = [
	["#60FF60"],
	["#FF5450"],
	["#418EFF"],
	["DC44DC"]
]

onBeforeMount(async () => {
	if (state.csc && conn.get())
	{
		await hookProperties();
	}

	isLoading.value = false;
});

function floatToColorComponent(cc : number) : string
{
	let r = cc.toString(16);
	if (r.length === 1)
		return "0"+r;
	if (r.length === 2)
		return r;
	if (r.length > 2)
		return r.substring(0, 2);
	return "00";
}

async function hookProperties()
{
	try
	{
		if (spaceConnection)
		{
			hooks.value.push(state.csc!.bindStringPropertyValue(spaceConnection, "Car", "CarColor", v => {carColor.value = v;}));
			hooks.value.push(state.csc!.bindBooleanPropertyValue(spaceConnection, "Car", "DriverDoorAnimation", v => {driverDoorAnimation.value = v;}));
			hooks.value.push(state.csc!.bindBooleanPropertyValue(spaceConnection, "Car", "HeadlightsVis", v => {headlightVis.value = v;}));
			hooks.value.push(state.csc!.bindBooleanPropertyValue(spaceConnection, "Car", "PassengerDoorAnimation", v => {passengerDoorAnimation.value = v;}));
			hooks.value.push(state.csc!.bindScalarPropertyValue(spaceConnection, "Car", "ShadowStrength", v => {shadowStrength.value = v;}));
			hooks.value.push(state.csc!.bindScalarPropertyValue(spaceConnection, "Car", "SunRotation", v => {sunlightRotation.value = v;}));
			hooks.value.push(state.csc!.bindBooleanPropertyValue(spaceConnection, "Car", "TrunkAnimation", v => {trunkAnimation.value = v;}));
			hooks.value.push(state.csc!.bindColorPropertyValue(spaceConnection, "Car", "UnderGlowColor", v => {underglowColor.value = {r:v.r*255,g:v.g*255,b:v.b*255,a:v.a};}));
			hooks.value.push(state.csc!.bindBooleanPropertyValue(spaceConnection, "Car", "UnderGlowVis", v => {underglowVis.value = v;}));
		}
	}
	catch (err)
	{
		// console.log(err);
	}
}

function hexToRgb(hex: string) {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    return { r, g, b, a };
}

function updateColor(container: string, id: string, hexColor: string) {
    const rgbColor = hexToRgb(hexColor);
    
    underglowColor.value = {
        r: rgbColor.r / 255,
        g: rgbColor.g / 255,
        b: rgbColor.b / 255,
        a: rgbColor.a
    };

    state.csc?.postColorPropertyUpdate(spaceConnection!, container, id, underglowColor.value);
}

function updateString(container: string, id: string, value: string)
{
	state.csc?.postStringPropertyUpdate(spaceConnection!, container, id, value);
}

function updateScalar(container: string, id: string, value: number)
{
	state.csc?.postScalarPropertyUpdate(spaceConnection!, container, id, value);
}

function updateBoolean(container: string, id: string, value: boolean)
{
	state.csc?.postBooleanPropertyUpdate(spaceConnection!, container, id, value);
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

watch(shadowStrength, (newValue) => {
	const value = Number(newValue);
	if (!isNaN(value))
		shadowStrength.value = Math.min(Math.max(value, 0), 1);
});

watch(sunlightRotation, (newValue) => {
	const value = Number(newValue);
	if (!isNaN(value))
		sunlightRotation.value = Math.min(Math.max(value, 0), 360)
});

</script>

<style scoped>
.card {
	padding: 10px;
	width: 720px;
}

.color-selector {
  display: flex;
  gap: 8px;
}

.color-swatch {
  cursor: pointer;
}
</style>