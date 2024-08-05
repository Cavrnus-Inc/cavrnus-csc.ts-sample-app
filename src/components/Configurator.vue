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
					<v-col cols="7">
						CarColor
					</v-col>
					<v-col cols="5">
						<v-text-field v-model="carColor" hide-details @blur="updateString('Car', 'CarColor', carColor)"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						DriverDoorAnimation
					</v-col>
					<v-col cols="5">
						<v-switch v-model="driverDoorAnimation" @change="updateBoolean('Car', 'DriverDoorAnimation', driverDoorAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						HeadlightVis
					</v-col>
					<v-col cols="5">
						<v-switch v-model="headlightVis" @change="updateBoolean('Car', 'HeadlightVis', headlightVis)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						PassengerDoorAnimation
					</v-col>
					<v-col cols="5">
						<v-switch v-model="passengerDoorAnimation" @change="updateBoolean('Car', 'PassengerDoorAnimation', passengerDoorAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						ShadowStrength
					</v-col>
					<v-col cols="5">
						<v-text-field v-model="shadowStrength" @blur="updateScalar('Car', 'ShadowStrength', shadowStrength)" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						SunlightRotation
					</v-col>
					<v-col cols="5">
						<v-text-field v-model="sunlightRotation" @blur="updateScalar('Car', 'SunlightRotation', sunlightRotation)" hide-details type="number"></v-text-field>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						TrunkAnimation
					</v-col>
					<v-col cols="5">
						<v-switch v-model="trunkAnimation" @change="updateBoolean('Car', 'TrunkAnimation', trunkAnimation)" hide-details></v-switch>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						UnderGlowColor
					</v-col>
					<v-col cols="5">
						<v-menu>
							<template v-slot:activator="{ props }">
								<v-btn
									append-icon="mdi-eyedropper"
									:color="colorValAsHex"
									@click="updateColor('Car', 'UnderGlowColor')"
									:style="{'background-color': `rgba(${underglowColor.r},${underglowColor.g},${underglowColor.b},${underglowColor.a})`}"
									block
									v-bind="props"
									:ripple="false">
								</v-btn>
							</template>
						</v-menu>
					</v-col>
				</v-row>
				<v-row class="align-center">
					<v-col cols="7">
						UnderGlowVis
					</v-col>
					<v-col cols="5">
						<v-switch v-model="underglowVis" @change="updateBoolean('Car', 'UnderGlowVis', underglowVis)" hide-details></v-switch>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useAppState } from '../state';
import { SpaceConnectionManager } from '../services/space-connection';
import { useRouter } from 'vue-router';
import { Hook } from '@cavrnus/lib/V';
import { RgbaColor } from '@cavrnus/csc';

const state = useAppState();
const router = useRouter();
const isConnected = ref(state.session?.isConnected);
const isLoading = ref(true);

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
const spaceConnectionManager = new SpaceConnectionManager();

const colorValAsHex = computed(()=>{
	return `#${floatToColorComponent(underglowColor.value.r)}${floatToColorComponent(underglowColor.value.g)}${floatToColorComponent(underglowColor.value.b)}`;
});


onBeforeMount(async () => {
	if (state.session?.session)
	{
		await spaceConnectionManager.connect(state.session.session);
		state.spaceConnection = spaceConnectionManager.spaceConnection;

		await hookProperties();

		spaceConnectionManager.stringPropertyHasDefaultValue("Car", "CarColor");
	}
	else
	{
		router.push({name: "signin"});
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
		hooks.value.push(spaceConnectionManager.bindStringProperty("Car", "CarColor", v => {carColor.value = v;}));
		hooks.value.push(spaceConnectionManager.bindBooleanProperty("Car", "DriverDoorAnimation", v => {driverDoorAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.bindBooleanProperty("Car", "HeadlightVis", v => {headlightVis.value = v;}));
		hooks.value.push(spaceConnectionManager.bindBooleanProperty("Car", "PassengerDoorAnimation", v => {passengerDoorAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.bindScalarProperty("Car", "ShadowStrength", v => {shadowStrength.value = v;}));
		hooks.value.push(spaceConnectionManager.bindScalarProperty("Car", "SunlightRotation", v => {sunlightRotation.value = v;}));
		hooks.value.push(spaceConnectionManager.bindBooleanProperty("Car", "TrunkAnimation", v => {trunkAnimation.value = v;}));
		hooks.value.push(spaceConnectionManager.bindColorProperty("Car", "UnderGlowColor", v => {underglowColor.value = {r:v.r*255,g:v.g*255,b:v.b*255,a:v.a};}));
		hooks.value.push(spaceConnectionManager.bindBooleanProperty("Car", "UnderGlowVis", v => {underglowVis.value = v;}));
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

function updateColor(container: string, id: string)
{
	let o = Math.round, r = Math.random, s = 255;
	let randomizedColor = {
		r: o(r()*s),
		g: o(r()*s),
		b: o(r()*s),
		a: o(r()*s)
	};

	underglowColor.value = {
		r: randomizedColor.r / 255,
		g: randomizedColor.g / 255,
		b: randomizedColor.b / 255,
		a: randomizedColor.a
	}
	state.spaceConnection?.postColorPropertyUpdate(container, id, underglowColor.value);
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
	try
	{
		hooks.value.forEach(h => h.off());
		hooks.value = [];
	
		await stop();
	}
	catch (err)
	{
		console.error(err);
		throw err;
	}
});

watch(isConnected, () => {
	if (!isConnected.value)
		router.push({name: "signin"});
});

</script>

<style scoped>
.card {
	padding: 10px;
	width: 720px;
}
</style>