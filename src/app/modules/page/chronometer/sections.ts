import { signal } from '@angular/core';

export interface Section {
  text: string;
  time: string; // Format: HH:MM:SS
}

export const sectionsSignal = signal<Section[]>([
  { text: "Compañerismo y Pastoreo", time: "00:05:00" },
  { text: "Minutos Misioneros", time: "00:10:00" },
  { text: "Mayordomía", time: "00:05:00" },
  { text: "Repaso de la Lección Escuela Sabática", time: "00:35:00" }
]);
