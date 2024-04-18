export enum Quality {
	HighPerformance = "high-performance",
	Default = "default",
	LowPower = "low-power",
}
interface Simulation {
    map: Map,
    graphics: Graphics,
    owner: string,
    creation: string

}
interface Graphics {
    ground: false,
    lights: true,
    fog: false,
    antialiasing: false,
    quality: Quality.LowPower
}
interface Building {
    id: number,
    position: {
        x: number,
        z: number,
    },
    size: {
        x: number,
        z: number,
        y: number
    }
}
interface Map {
    grid: {
        x: number,
        y: number
    }
    buildings: Building[],
    panels: number[] //? Id della casa a cui è assegnato
}

const SIMULATION_EXAMPLE: Simulation = {
    owner: "Dumperton Gobbler", //? Nome del creatore della simulazione
    creation: "17/04/2024", //? Data creazione della simulazione
    graphics: { //? Impostazioni grafiche della simulazione
        ground: false,
        lights: true,
        fog: false,
        antialiasing: false,
        quality: Quality.LowPower //? Enum che trovate all'inizio del file, (sono solo stringhe)
    },
    map: { //? Contiene le informazione della mappa
        grid: { //? Grandezza della griglia
            x: 20,
            y: 20
        },
        buildings: [ //? Array di case 
            {
                id: 0,
                position: {
                    x: 5,
                    z: 5
                },
                size: {
                    x: 2,
                    z: 3,
                    y: 3
                }
            }
        ],
        panels: [ //? Id delle case che hanno un pannello
            0
        ]
    }
}