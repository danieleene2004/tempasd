/* 

! Simulazione Comunita Energetica
! Written by Ene Daniele, March - April 2024

*/

import * as THREE from 'three';
import { Building, BuildingType, Vector3D } from './models/map';
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointLight } from 'three';
import { graphics, GraphicsPresets, GraphicsSettings, Quality } from './models/graphics';

//! VITE IMAGE IMPORTS
//? Vite imports images like this, typescript will say its wrong but the vite compiler works
//@ts-ignore 
import bg from "../static/images/ground.jpg";
//@ts-ignore
import sk from "../static/images/sky.jpg";
//! VITE IMAGE IMPORTS

//! TODOS
//TODO: REWORK THE GRID TO HOLD ADDITIONAL INFORMATION ASWELL AS THE REFERENCE MESH INSTEAD OF ONLY THE MESH im gonna fucking kill myself
//! TODOS

//! GRAPHICS SETTINGS
//? Used throughout the project to decide graphical feqqqqatures
let graphicsSettings: GraphicsSettings;
//? Can be set to use different presets (High, Medium, Low)
graphicsSettings = graphics(GraphicsPresets.High);
//? Or use custom settings
graphicsSettings = {
	ground: false,
	lights: true,
	fog: false,
	antialiasing: true,
	quality: Quality.HighPerformance
} as GraphicsSettings; // Unnecessary but makes sure its clear
//! GRAPHICS SETTINGS

//? Defines the size of the grid, will later be take the information dynamically from a json
interface GridItem {
	reference: THREE.Mesh,
	father: THREE.Mesh,
	type: BuildingType;
	position: {
		x: number,
		z: number,
		y: number
	}
	size: {
		x: number,
		z: number,
		y: number
	}
}
const PLACEHOLDERMESH = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshBasicMaterial({color: 0x000000}));
interface Grid {
	mwps: number,
	size: {
		x: number,
		y: number
	},
	buildings: GridItem[][]
	panels: GridItem[][] //? 1: Type one, 2: Type two, 3: Type three
	tiles: GridItem[][]
	selection: THREE.Mesh,
	selectionBuilding: THREE.Mesh,
	removeBuilding: () => void,
	removePanel: () => void,
	mwhProduction: () => void,
	placeBuilding: () => void,
}
let grid: Grid = {
	mwps: 0,
	size: {
		x: 15,
		y: 15
	},
	buildings: [],
	panels: [],
	tiles: [],
	selection: PLACEHOLDERMESH,
	selectionBuilding: PLACEHOLDERMESH,
	placeBuilding: function (): void {
		placeBuilding({
			type: BuildingType.House,
			position: {
				x: this.selection.position.x - 0.5,
				y: 1,
				z: this.selection.position.z - 0.5
			},
			size: {
				x: +(document.getElementById("widthy") as HTMLInputElement).value,
				z: +(document.getElementById("depthy") as HTMLInputElement).value,
				y: +(document.getElementById("floory") as HTMLInputElement).value,
			}
		});
		
	},
	removeBuilding: function (): void {		
		if (this.selectionBuilding.children.length > 0) this.removePanel();
		this.buildings.forEach(element => {
			element.forEach(elementalShivCalamity => {
				if (elementalShivCalamity.reference == this.selectionBuilding) {
					scene.remove(this.selectionBuilding)
					elementalShivCalamity = {
						reference: PLACEHOLDERMESH,
						type: BuildingType.House,
						position: {
							x: -1,
							z: -1,
							y: -1
						},
						size: {
							x: 0,
							z: 0,
							y: 0
						},
						father: undefined
					};
				}
			});
		});
	},
	removePanel: function (): void {
		let s = this.selectionBuilding;
		let removee: GridItem;
		this.buildings.forEach((bui: any[]) => {
			bui.forEach((lding: GridItem) => {
				if (lding.reference == s) {
					removee = lding;
				}
				
			});
		});
		let panelee: number = -1;
		this.panels.forEach((pas: GridItem[]) => {
			pas.forEach((pa: GridItem) => {
				if (pa.father == removee.reference) {
					panelee = pas.indexOf(pa);
				}
			});
		});
		this.panels[1][panelee].father.children.pop();
		this.panels.forEach(pan => {
			pan.splice(panelee, 1);
		});
	},
	mwhProduction: function (): void {
		for (let panelsIndex = 1; panelsIndex < this.panels.length; panelsIndex++) {
			let panelsProd = 0;
			this.panels.forEach(pans => {
				pans.forEach(pan => {
					panelsProd += Math.round(pan.size.z * 25) * Math.round(pan.size.x * 25);
				});
			});
			this.mwps = Math.round((mwPerSecond * panelsProd) * 100) / 100;
		}
	}
}

for (let index = 0; index < grid.size.x; index++) {
	let temp: GridItem[] = [];
	for (let index = 0; index < grid.size.y; index++) {
		temp.push({
			reference: PLACEHOLDERMESH,
			type: BuildingType.House,
			position: {
				x: -1,
				z: -1,
				y: -1
			},
			size: {
				x: 0,
				z: 0,
				y: 0
			},
			father: undefined
		})
	}	
	
	grid.buildings.push(temp);
}

enum PanelType {
	One = 1,
	Two = 2,
	Three = 3
}
// PLACEHOLDER VALUE, PENDING CHANGES WHEN STUDER GETS THE ACTUAL VALUE
const mwPerSecond = 1;
interface PanelData {
	x: number,
	z: number,
	type: PanelType,
}
let solarPanels: PanelData[] = []

//! THREEjs SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//@ts-ignore
const renderer = new THREE.WebGLRenderer({canvas: artifactCanvas, antialias: graphicsSettings.antialiasing });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.powerPreference = graphicsSettings.quality;
document.body.appendChild( renderer.domElement );
//! THREEJS SETUP

//! SCENE SETUP
const light = new PointLight(0xffffff, 400); // Follows the camera for general lighting
const cursor = new PointLight(0xffff00, 5); // Light below the pointer
const cursorLighting = new PointLight(0xffff00, 2); // Light above the pointer
let pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.0, 0.8), new THREE.MeshStandardMaterial({color:0xff0000}))
pointer.position.y = 0.5;
cursorLighting.position.y = 2;
cursor.add(pointer, cursorLighting);
light.position.y = 10;
cursor.position.y = 1.5;
cursor.decay = 1;
const texture = new THREE.TextureLoader().load( bg );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 25 + grid.size.x, 25 + grid.size.x );
let gruond = new THREE.Mesh(new THREE.CircleGeometry(50 + Math.max(grid.size.x, grid.size.y), 32), new THREE.MeshStandardMaterial({map:texture}))
gruond.rotation.x = -1.566666; //? Horizontal rotation for some reason
gruond.position.y = 0;
const sky = new THREE.TextureLoader().load( sk );
sky.wrapS = THREE.RepeatWrapping;
sky.wrapT = THREE.RepeatWrapping;
let globeGeometry = new THREE.SphereGeometry(200, 100, 100)
let globe = new THREE.Mesh(globeGeometry, new THREE.MeshBasicMaterial({map:sky, side: THREE.DoubleSide, opacity: 0.5}))

let sun = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 20), new THREE.MeshBasicMaterial({color: 0xff0000}))
let pivot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({color: 0x000000}));
pivot.add(sun);
sun.lookAt(pivot.position)
pivot.position.y = 1;

scene.add(new THREE.AmbientLight(), cursor, globe, pivot)
scene.add(sun)

if (graphicsSettings.lights) scene.add(light); else light.intensity = 0;
if (graphicsSettings.ground) scene.add(gruond);
if (graphicsSettings.fog) scene.fog = new THREE.Fog( 0x444444, 0, 200 );
//! SCENE SETUP

//! CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 20;
controls.minDistance = 13;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.3;
controls.enableZoom = false;
//! CONTROLS

function buildEntity(building: Building, color: number): GridItem {
	const gridSpacer = building.type == BuildingType.GridTile ? 0.95 : 1;
	const geometry = new THREE.BoxGeometry(building.size.x * gridSpacer, building.size.y * gridSpacer, building.size.z * gridSpacer);
	const material = new THREE.MeshStandardMaterial( { color: color } );
	const cube = new THREE.Mesh( geometry, material );
	//? Everything is shifted by 0.5 in both x and z to center the pointer selection
	cube.position.z = building.position.z + 0.5;
	cube.position.x = building.position.x + 0.5;
	cube.position.y = building.position.y;
	if (building.type == BuildingType.GridTile) cube.name = "GridTile";
	if (building.type == BuildingType.SolarPanel) cube.name = "SolarPanel";
	if (building.type == BuildingType.House) cube.name = "House";
	scene.add( cube );

	return {
		reference: cube,
		father: undefined,
		type: building.type, 
		position: {
			x: cube.position.x,
			z: cube.position.z,
			y: cube.position.y
		}, 
		size: {
			x: geometry.parameters.width,
			z: geometry.parameters.depth,
			y: geometry.parameters.height
		}
	};
}

//! BUILD GRID
function buildGrid(gridSize: { x: any; y: any; }): GridItem[][] {
	let tempGrid: GridItem[][] = []
	for (let index = 0; index < gridSize.x; index++) {
		let temp: GridItem[] = []
		for (let jndex = 0; jndex < gridSize.y; jndex++) {
			temp.push(buildEntity({
				type: BuildingType.GridTile,
				position: {x:index, y:0.99, z:jndex},
				size: {x:1, y:0.01, z:1}
			}, 0x999999))
		}
		tempGrid.push(temp);
		temp = [];
	}
	return tempGrid;
}
grid.tiles = buildGrid(grid.size)
//! BUILD GRID

let hovered = grid.tiles[Math.floor(cursor.position.x)][Math.floor(cursor.position.z)].reference.position;
let brodie = true;
function cursorPosition() {
	try {
		let under = grid.buildings[Math.floor(hovered.x)][Math.floor(hovered.z)].reference;
		
		if (under.name == "House" || brodie) {
			grid.selectionBuilding = under; 
			brodie = false; 
		}
		hovered = grid.tiles[Math.floor(cursor.position.x)][Math.floor(cursor.position.z)].position;
		grid.selection.material.color = new THREE.Color(0x999999);
	} catch (e) {
		// ignore
	}
	let col = grid.buildings[Math.floor(hovered.x)][Math.floor(hovered.z)].reference.geometry.parameters;
	let colombettiriccardostuart = grid.buildings[Math.floor(hovered.x)][Math.floor(hovered.z)].reference.material.color;
	grid.selectionBuilding.material.color = new THREE.Color(0x555555);
	
	if (col.height > 0.5 || colombettiriccardostuart.r + colombettiriccardostuart.g + colombettiriccardostuart.b > 2) {
		
		grid.selectionBuilding = grid.buildings[Math.floor(hovered.x)][Math.floor(hovered.z)].reference;
		grid.selectionBuilding.material.color = new THREE.Color(0xffff00);
	}
	grid.selection = grid.tiles[Math.floor(hovered.x)][Math.floor(hovered.z)].reference;
	grid.selection.material.color = new THREE.Color(0xffff00);

	
	if (cursor.position.y <= grid.selectionBuilding.geometry.parameters.height + 1.5) {
		cursor.position.y = grid.selectionBuilding.geometry.parameters.height + 1.5;
	} else if (cursor.position.y > 1.5) {
		cursor.position.y = 1.5;
	}
	
}

let halfX = Math.floor(grid.tiles.length / 2)
let halfY = Math.floor(grid.tiles[halfX].length / 2)

sun.position.x = halfX;
sun.position.z = halfY;
sun.position.y = 10;
pivot.position.x = halfX;
pivot.position.z = halfY;

gruond.position.x = grid.tiles[halfX][halfY].position.x;
gruond.position.z = grid.tiles[halfX][halfY].position.z;
controls.target.x = grid.tiles[halfX][halfY].position.x;
controls.target.z = grid.tiles[halfX][halfY].position.z;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;

globe.position.x = halfX;
globe.position.z = halfY;

//? Simple function that moves the pointer up and down
let animationCondition = false;
function pointerAnimation() {
	let p = pointer.position.y;
	if (p >= 0.5) animationCondition = true;
	if (p <= 0) animationCondition = false;
	if (animationCondition) pointer.position.y -= 0.01;		
	else pointer.position.y += 0.01;
}
function updateCameraPosition() {
	light.position.z = camera.position.z;
	light.position.x = camera.position.x;
	cursor.position.z = controls.target.z;
	cursor.position.x = controls.target.x;
	camera.position.y = 10;
	controls.target.y = 0;
}
function placeBuilding(building: Building) {
	let position = building.position;
	let size = building.size;
	if (size.x > position.x || size.z > position.z) alert("ERROR: TRIED ADDING BUILDING OUTSIDE OF GRID\nREDUCE SIZE OR CHANGE POSITION"); else {

		let placedBuilding = buildEntity({
			type: building.type,
			position: {
			x: position.x - size.x / 2 + 0.5, 
			z: position.z - size.z / 2 + 0.5, 
			y: 1 + size.y / 2
			},
			size: {
				x: size.x - 0.2, 
				z: size.z - 0.2,
				y: size.y
			} 	
		}, 0x555555)
		if (building.size.x + building.size.z == 2) {
			grid.buildings[position.x][position.z] = placedBuilding;
		} else {
			
			for (let hex = 0; hex < building.size.x; hex++) {
				
				for (let zed = 0; zed < building.size.z; zed++) {
					grid.buildings[position.x - hex][position.z - zed] = placedBuilding;
				}	
			}
		}
	}
}
grid.panels.push([]); //? Empty
grid.panels.push([]); //? Type one 
grid.panels.push([]); //? Type two
grid.panels.push([]); //? Type three
function placeSolarPanel(building: THREE.Mesh) {
	if (building.name == "House" && building.children.length == 0 && building.parent != null) {
		let parameters = building.geometry.parameters;
		let size = {x: parameters.width, y: parameters.height, z: parameters.depth};
		
		let placedBuilding: GridItem = buildEntity({
			type: BuildingType.SolarPanel,
			position: {
				x: -0.5, 
				z: -0.5, 
				y: (size.y / 1.8),
			},
			size: {
				x: size.x - 0.3, 
				z: size.z - 0.3,
				y: 0.1,
			}
		}, 0x00ffff);
		
		if (parameters.width > parameters.depth) placedBuilding.reference.rotation.x = -0.5; else placedBuilding.reference.rotation.z = 0.5;
		building.add(placedBuilding.reference)	
		grid.panels[1].push({
			reference: placedBuilding.reference,
			father: building,
			type: BuildingType.SolarPanel,
			position: {
				x: placedBuilding.position.x,
				z: placedBuilding.position.z,
				y: placedBuilding.position.y
			},
			size: {
				x: size.x,
				z: size.z,
				y: size.y
			}
		});
	}
}

/*
[
	{type: BuildingType.House, position: {x: 6, z: 8, y: 0}, size: {x: 1, z:1, y: 1}},
	{type: BuildingType.House, position: {x: 7, z: 8, y: 0}, size: {x: 1, z:1, y: 2}},
	{type: BuildingType.House, position: {x: 8, z: 8, y: 0}, size: {x: 1, z:1, y: 3}},
	{type: BuildingType.House, position: {x: 2, z: 3, y: 0}, size: {x: 2, z:3, y: 4}},
].forEach(building => placeBuilding(building));
*/

//! ANIMATION LOOP
function animate() {
	requestAnimationFrame( animate );

	//! UPDATE FUNCTIONS
	cursorPosition();
	pointerAnimation();

	pivot.rotateX(0.01);
	
	//* Must be done last!
	updateCameraPosition(); //? Updates the camera and all its related variables
	//! UPDATE FUNCTIONS
	
	controls.update();
	renderer.render( scene, camera );
}
animate();
//! ANIMATION LOOP

//! KEYBOARD COMMANDS
//* [SPACE]: Auto rotate
//* [?]: Enable debug information in the console
//* [R]: Reset the cursor to the initial position
document.addEventListener("keyup", e => {
	if (e.key == " ") controls.autoRotate = !controls.autoRotate; 
	else if (e.key == "r") {controls.target.x = halfX; controls.target.z = halfY;} 
	else if (e.key == "s") placeSolarPanel(grid.selectionBuilding);
})
//! KEYBOARD COMMANDS

//! BUTTON EVENTS
document.getElementById("solarPanel")?.addEventListener("click", () => placeSolarPanel(grid.selectionBuilding))
document.getElementById("solarPanelRemove")?.addEventListener("click", () => grid.removePanel())
document.getElementById("buildingConfirm")?.addEventListener("click", () => grid.placeBuilding())
document.getElementById("buildingRemove")?.addEventListener("click", () => grid.removeBuilding())
//! BUTTON EVENTS

let stats = {
	name: document.getElementById("simname"),
	owner: document.getElementById("owner"),
	created: document.getElementById("creation"),
	time: document.getElementById("time"),
	power: document.getElementById("power"),
	weather: document.getElementById("weather"),
}

setInterval(() => {
	grid.mwhProduction();
	//@ts-ignore
	stats.power.innerHTML = grid.mwps;
}, 100)

