import { writable } from 'svelte/store';

export const windowWidth = writable(1000)
export const containerWidth = writable(600)
export const headerImage = writable("")
export const touch = writable(true)
export const desktop = writable(true)
export const mobile = writable(false)


    