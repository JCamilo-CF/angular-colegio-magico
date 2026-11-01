import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HechizoDuelo {
  id: number;
  nombre: string;
  tipo: 'Ataque' | 'Defensa' | 'Sanacion';
  poder: number;
  costoEnergia: number;
  descripcion: string;
}

export interface RegistroTurno {
  turno: number;
  emisor: string;
  hechizo: string;
  efecto: string;
  tipo: 'damage' | 'shield' | 'heal';
}

  @Component({
  selector: 'app-artefacto-creativo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artefacto-creativo.component.html',
  styleUrl: './artefacto-creativo.component.css'
})
export class ArtefactoCreativoComponent implements OnInit, OnDestroy {
  // =========================================================================
  // 🎨 RETO 7: EL LIENZO CREATIVO (30% DE LA CALIFICACIÓN)
  // Tema: Combate de Supervivencia en Minecraft (Steve vs Zombi / Nether)
  // =========================================================================

  // 1. Estado Interactivo (Jugador vs Rival)
  nombreMago: string = 'Steve';
  saludMago: number = 100;
  energiaMago: number = 100; // Barra de Hambre / Estamina

  nombreRival: string = 'Zombi Blindado';
  saludRival: number = 100;
  energiaRival: number = 100;

  // Estado general del combate: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA'
  estadoDuelo: 'PREPARACION' | 'EN_CURSO' | 'VICTORIA' | 'DERROTA' = 'PREPARACION';

  numeroTurno: number = 1;
  arenaOscura: boolean = false; // Modo Cueva Oscura / Nether

  // Grimorio de habilidades / acciones disponibles
  hechizosDuelo: HechizoDuelo[] = [
    { id: 1, nombre: 'Espada de Diamante', tipo: 'Ataque', poder: 28, costoEnergia: 20, descripcion: 'Golpe crítico con filo de diamante directo al mob.' },
    { id: 2, nombre: 'Escudo de Roble', tipo: 'Defensa', poder: 30, costoEnergia: 15, descripcion: 'Bloquea el ataque frontal absorbiendo el impacto.' },
    { id: 3, nombre: 'Manzana Dorada', tipo: 'Sanacion', poder: 25, costoEnergia: 25, descripcion: 'Regeneración rápida de corazones de salud.' },
    { id: 4, nombre: 'Arco con Flechas', tipo: 'Ataque', poder: 35, costoEnergia: 30, descripcion: 'Disparo a distancia certero con alto daño.' }
  ];

  historialDuelo: RegistroTurno[] = [];
  private ambientMusicInterval: any = null;

  // 2. Lifecycle Hook: ngOnInit
  ngOnInit(): void {
    console.log('⛏️ Reto 7: Servidor de Supervivencia Minecraft iniciado.');
    // Temporizador ambiental sutil de regeneración de estamina (hambre)
    this.ambientMusicInterval = setInterval(() => {
      if (this.estadoDuelo === 'EN_CURSO') {
        this.energiaMago = Math.min(100, this.energiaMago + 2);
        this.energiaRival = Math.min(100, this.energiaRival + 2);
      }
    }, 2000);
  }

  // 3. Iniciar Combate
  iniciarDuelo(): void {
    this.estadoDuelo = 'EN_CURSO';
    this.saludMago = 100;
    this.energiaMago = 100;
    this.saludRival = 100;
    this.energiaRival = 100;
    this.numeroTurno = 1;
    this.historialDuelo = [
      {
        turno: 1,
        emisor: 'Sistema de Juego',
        hechizo: 'Aparición de Mobs',
        efecto: '¡La noche ha caído! Prepárate para sobrevivir en la arena.',
        tipo: 'shield'
      }
    ];
  }

  // 4. Ejecutar Acción del Jugador
  lanzarHechizo(hechizo: HechizoDuelo): void {
    if (this.estadoDuelo !== 'EN_CURSO') return;
    if (this.energiaMago < hechizo.costoEnergia) return;

    this.energiaMago -= hechizo.costoEnergia;

    if (hechizo.tipo === 'Ataque') {
      this.saludRival = Math.max(0, this.saludRival - hechizo.poder);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `¡Ataque exitoso! Causa ${hechizo.poder} de daño a ${this.nombreRival}.`,
        tipo: 'damage'
      });
    } else if (hechizo.tipo === 'Sanacion') {
      this.saludMago = Math.min(100, this.saludMago + hechizo.poder);
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Consumo de alimento: Restaura ${hechizo.poder} corazones de vida.`,
        tipo: 'heal'
      });
    } else {
      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreMago,
        hechizo: hechizo.nombre,
        efecto: `Defensa activa: ${hechizo.descripcion}`,
        tipo: 'shield'
      });
    }

    // Verificar si el rival fue derrotado
    if (this.saludRival <= 0) {
      this.estadoDuelo = 'VICTORIA';
      return;
    }

    // Respuesta del Rival (IA Simulada)
    this.turnoRival();
  }

  // 5. Turno de la IA Rival
  private turnoRival(): void {
    setTimeout(() => {
      if (this.estadoDuelo !== 'EN_CURSO') return;

      const opcionesRival = ['Mordisco Feroz', 'Zarpa de Zombi', 'Aplastamiento', 'Emboscada'];
      const elegido = opcionesRival[Math.floor(Math.random() * opcionesRival.length)];
      const danoRival = Math.floor(Math.random() * 20) + 10;

      this.saludMago = Math.max(0, this.saludMago - danoRival);
      this.numeroTurno++;

      this.historialDuelo.unshift({
        turno: this.numeroTurno,
        emisor: this.nombreRival,
        hechizo: elegido,
        efecto: `¡${this.nombreRival} usa ${elegido}! Te inflige ${danoRival} de daño.`,
        tipo: 'damage'
      });

      if (this.saludMago <= 0) {
        this.estadoDuelo = 'DERROTA';
      }
    }, 600);
  }

  // 6. Alternar ambientación de la arena (Modo Cueva / Nether)
  toggleArena(): void {
    this.arenaOscura = !this.arenaOscura;
  }

  // 7. Lifecycle Hook: ngOnDestroy
  ngOnDestroy(): void {
    if (this.ambientMusicInterval) {
      clearInterval(this.ambientMusicInterval);
    }
    console.log('⛏️ Reto 7: Servidor cerrado y recursos liberados.');
  }
}