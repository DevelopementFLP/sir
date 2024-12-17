import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { DashboardFichaTecnicaService } from './services/dashboard-ficha-tecnica.service';
import { FtImagenesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';
import { FtImagenesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';
import { ProductoActivo } from './interfaces/ProductoActivo.interface';
import { ProductoImagen } from './types/ProductoImagen.type';
import * as ProgressBar from './helpers/progressbar.helper';
import { ScreenService } from 'src/app/shared/services/screen.service';
import { FtFichaTecnicaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';
import { FtFichaTecnicaDTO } from '../../../11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';

@Component({
  selector: 'app-dashboard-ficha-tecnica',
  templateUrl: './dashboard-ficha-tecnica.component.html',
  styleUrls: [
    './dashboard-ficha-tecnica.component.css',
    './css/min_width_768px.css',
    './css/min_width_2100px.css',
  ],
})
export class DashboardFichaTecnicaComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  currentScreenWidht: number = 0;
  currentFt: FtFichaTecnicaDTO | null = null;
  fichaTecnicaSeleccionada: string | undefined;
  hoy: Date = new Date();
  imagenAreaCorte: string | undefined = undefined;
  imagenAreaEnvase: string | undefined = undefined;
  imagenAreaEnvaseSecundario: string | undefined = undefined;
  imagenAreaEnvaseSecundario2: string | undefined = undefined;
  imagenAreaLogo: string | undefined = undefined;
  imagenesFullScreen: ProductoImagen = {};
  indiceActual: number = 0;
  intervaloActualizacion: any;
  intervaloCarrusel: any;
  mensajeNoData: string = 'No hay información para mostrar en este momento';
  minScreenWidth: number = 1800;
  mustShowFichaTecnica: boolean = true;
  navBar!: HTMLElement;
  nombreProducto: string | undefined;
  playingSound: boolean = false;
  productosActivosFicha: ProductoActivo[] = [];
  productosEnOrdenes: ProductoActivo[] = [];
  showPlayingSound: boolean = false;
  tiempoActualizacion: number = 300000;
  tiempoProductoActivo: number = 0;

  mustRefreshData: boolean = false;

  @ViewChild('notificacion', { static: false }) notificacionRef!: ElementRef;

  constructor(
    private dftService: DashboardFichaTecnicaService,
    private ftImagenService: FtImagenesService,
    private ftService: FtFichaTecnicaService,
    private screenService: ScreenService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentScreenWidht = this.screenService.getScreenWidth();
    if (this.currentScreenWidht >= this.minScreenWidth) {
      this.startFullScreenPresentation();
    } else {
      this.mustRefreshData = true;
      await this.setData();
      this.clearTimeInterval(this.intervaloActualizacion);
      this.clearTimeInterval(this.intervaloCarrusel);
      this.showFichaTecnica();
    }
  }

  ngAfterViewInit(): void {
    this.navBar = document.querySelector('#main-page')!;
    this.navBar.style.display = this.currentScreenWidht >= this.minScreenWidth ? 'none' : 'block';
  }

  protected async setData(): Promise<void> {
    await this.getActiveProductsData();
    await this.setImagenesFichaTecnica();

    this.productosActivosFicha = this.filterActiveProductosByFT();
  }

  ngAfterViewChecked(): void {
    this.hideHeadersFT();
    if (this.currentScreenWidht >= this.minScreenWidth) {
      this.scrollToActiveElement();
    }
  }

  private async getActiveProductsData(): Promise<void> {
    const [productosActivos, tiempoActivo, tiempoActualizacion] =
      await Promise.all([
        lastValueFrom(this.dftService.getActiveProducts()),
        lastValueFrom(this.dftService.getActiveProductTime()),
        lastValueFrom(this.dftService.getUpdateDashboardTime()),
      ]);

    this.productosEnOrdenes = productosActivos.filter(
      (p) => p.code.length >= 4
    );
    this.tiempoProductoActivo = tiempoActivo;
    this.tiempoActualizacion = tiempoActualizacion;
  }

  private filterActiveProductosByFT(): ProductoActivo[] {
    const productosEnFicha: string[] = Object.keys(this.imagenesFullScreen);
    return this.productosEnOrdenes.filter((producto) =>
      productosEnFicha.includes(producto.code)
    );
  }

  private showInfo(): void {
    this.nombreProducto = this.productosActivosFicha[this.indiceActual].name;
    this.imagenAreaCorte = this.getPicturesProductSection(
      this.productosActivosFicha[this.indiceActual].code,
      2
    )?.contenidoImagen;
    this.imagenAreaEnvase = this.getPicturesProductSection(
      this.productosActivosFicha[this.indiceActual].code,
      3
    )?.contenidoImagen;
  }

  private async showFichaTecnica(): Promise<void> {
    if (this.currentScreenWidht < this.minScreenWidth) {
      this.fichaTecnicaSeleccionada = this.productosActivosFicha[this.indiceActual].name;
      await lastValueFrom(this.ftService.BuscarFichaTecnica(this.productosActivosFicha[this.indiceActual].code))
        .then((ftResponse: ApiResponse) => {
          this.currentFt = ftResponse.esCorrecto ? ftResponse.resultado[0] as FtFichaTecnicaDTO : null;
        })
        .catch((error) => {
          console.error((error));
        });
    }
    else {
      this.fichaTecnicaSeleccionada = undefined;
      this.currentFt = null;
    }
  }

  protected onProductoClick(index: number): void {
    this.indiceActual = index;
    if (this.currentScreenWidht < this.minScreenWidth) this.showFichaTecnica();
    else this.showInfo();
  }

  private startCarousel(): void {
    this.clearTimeInterval(this.intervaloActualizacion);
    this.clearTimeInterval(this.intervaloCarrusel);
    this.showInfo();
    this.intervaloCarrusel = setInterval(() => {
      if (this.currentScreenWidht >= this.minScreenWidth) {
         if(this.productosActivosFicha.length > 1) 
          this.resetPicturesAnimations();
        this.indiceActual = (this.indiceActual + 1) % this.productosActivosFicha.length;
        this.showInfo();
      }
    }, this.tiempoProductoActivo);
  }

  private stopCarousel() {
    this.clearTimeInterval(this.intervaloCarrusel);
  }

  private scrollToActiveElement() {
    const activeElement = document.querySelector('.productos__producto.activo');

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  async onResize(event: any) {
    this.currentScreenWidht = this.screenService.getScreenWidth();

    if (this.currentScreenWidht < this.minScreenWidth) {
      this.mustRefreshData = true;
      this.navBar.style.display = 'block';
      this.stopCarousel();
      this.indiceActual = 0;
      this.showFichaTecnica();
      this.clearTimeInterval(this.intervaloActualizacion);

    } else {
      if(this.mustRefreshData) {
        this.mustRefreshData = false;
        await this.setImagenesFichaTecnica();
        this.productosActivosFicha = this.filterActiveProductosByFT();
        this.startFullScreenPresentation();
      }
    }
  }

  ngOnDestroy() {
    this.stopCarousel();
    this.clearTimeInterval(this.intervaloActualizacion);
  }

  private hideHeadersFT(): void {
    const header = document.querySelector('.grid-container-encabezados');
    if (header && header instanceof HTMLDivElement) {
      header.style.display = 'none';
    }
  }

  private async setImagenesFichaTecnica(): Promise<void> {
    this.imagenesFullScreen = {};

    for (const producto of this.productosEnOrdenes) {
      try {
        const response: ApiResponse = await lastValueFrom(
          this.ftImagenService.BuscarImagenPorProducto(producto.code)
        );
        if (response.esCorrecto) {
          this.imagenesFullScreen[producto.code] =
            response.resultado as FtImagenesPlantillaDTO[];
        }
      } catch (error) {
        console.error(
          `Error al obtener la imagen para el producto ${producto.code}:`,
          error
        );
      }
    }
  }

  protected getPicturesProductSection(
    codigo: string,
    seccion: number
  ): FtImagenesPlantillaDTO | undefined {
    return this.imagenesFullScreen[codigo].find(
      (i) => i.seccionDeImagen === seccion
    );
  }

  private async startFullScreenPresentation(): Promise<void> {
    this.mustRefreshData = false;
    const mainContent = document.querySelector('#mainContent');

    if (mainContent instanceof HTMLElement) {
      mainContent.style.height = '100dvh';
      mainContent.focus();
    }

    //this.navBar.style.display = 'none';
    await this.updateData();
  }

  async updateData(): Promise<void> {
    await this.setData();
    this.startCarousel();
    if (this.productosActivosFicha.length > 1)
      ProgressBar.setProgressBarAnimation(this.tiempoProductoActivo, this.minScreenWidth);
    if (this.playingSound) this.onAudioPlay();

    this.intervaloActualizacion = setInterval(async () => {
      if (this.productosActivosFicha.length > 1)
        ProgressBar.setProgressBarAnimation(this.tiempoProductoActivo, this.minScreenWidth);
      if (this.playingSound) this.onAudioPlay();
      await this.setData();
    }, this.tiempoActualizacion);
  }


  private clearTimeInterval(interval: any): void {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  private onAudioPlay() {
    const container = document.querySelector('.contenedor');
    if (container instanceof HTMLElement) {
      container.focus();
    }

    this.notificacionRef.nativeElement.play();
  }

  private resetPicturesAnimations(): void {
    const imgCut = document.querySelector('#imgCut') as HTMLElement;
    const imgPP = document.querySelector('#imgPrimaryPacking') as HTMLElement;

    if(imgCut) {
      imgCut.classList.remove('animacion__slideright');
      void imgCut.offsetParent;
      imgCut.classList.add('animacion__slideright');
    }

    if(imgPP){
      imgPP.classList.remove('animacion__slideleft');
      void imgPP.offsetWidth
      imgPP.classList.add('animacion__slideleft');
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {    
    if (e.code === 'KeyP') {
      this.playingSound = !this.playingSound;
      
      this.showPlayingSound = true;
      setTimeout(() => {
        this.showPlayingSound = false;
      }, 1500);
    }
  }
}
