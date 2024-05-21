import { Injectable } from '@angular/core';
import { IndicadorCharqueador } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/IndicadorCharqueador.interface';
import { IndicadorEmpaque } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/IndicadorEmpaque.interface';
import { IndicadorHuesero } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/IndicadorHuesero.interface';
import { LoteEntrada } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/LoteEntrada.interface';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  testGetHueseros(): IndicadorHuesero[] {
    return   [
      {
        linea: 1,
        idEstacion: 0,
        'nombreEstación': 'L1 Huesero 02',
        hueseroCod: '2985',
        huesero: 'ROMERO GERARDO',
        cuartos: 128,
        kgRecibidos: 7845,
        kgEnviados: 6092,
        rend: 77.7
      },
      {
        linea: 1,
        idEstacion: 0,
        'nombreEstación': 'L1 Huesero 04',
        hueseroCod: '3740',
        huesero: 'CEBALLO LUIS',
        cuartos: 126,
        kgRecibidos: 7819,
        kgEnviados: 6042,
        rend: 77.3
      },
      {
        linea: 1,
        idEstacion: 0,
        'nombreEstación': 'L1 Huesero 03',
        hueseroCod: '4418',
        huesero: 'SOLER HECTOR',
        cuartos: 121,
        kgRecibidos: 7466,
        kgEnviados: 5837,
        rend: 78.2
      },
      {
        linea: 1,
        idEstacion: 0,
        'nombreEstación': 'L1 Huesero 05',
        hueseroCod: '1454',
        huesero: 'SILVESTRE JESUS',
        cuartos: 91,
        kgRecibidos: 5709,
        kgEnviados: 4402,
        rend: 77.1
      },
      {
        linea: 2,
        idEstacion: 0,
        'nombreEstación': 'L2 Huesero 04',
        hueseroCod: '4766',
        huesero: 'CARBONELL FERNANDO',
        cuartos: 125,
        kgRecibidos: 7752,
        kgEnviados: 6034,
        rend: 77.8
      },
      {
        linea: 2,
        idEstacion: 0,
        'nombreEstación': 'L2 Huesero 05',
        hueseroCod: '2811',
        huesero: 'MIRANDA JAVIER',
        cuartos: 118,
        kgRecibidos: 7356,
        kgEnviados: 5673,
        rend: 77.1
      },
      {
        linea: 2,
        idEstacion: 0,
        'nombreEstación': 'L2 Huesero 02',
        hueseroCod: '6666',
        huesero: 'GONZALEZ LEONARDO.',
        cuartos: 115,
        kgRecibidos: 7028,
        kgEnviados: 5538,
        rend: 78.8
      },
      {
        linea: 2,
        idEstacion: 0,
        'nombreEstación': 'L2 Huesero 03',
        hueseroCod: '5280',
        huesero: 'GONZALEZ GUILLERMO',
        cuartos: 85,
        kgRecibidos: 5232,
        kgEnviados: 4175,
        rend: 79.8
      },
      {
        linea: 2,
        idEstacion: 0,
        'nombreEstación': 'L2 Huesero 01',
        hueseroCod: '6141',
        huesero: 'ESTEVEZ DIEGO',
        cuartos: 71,
        kgRecibidos: 4370,
        kgEnviados: 3384,
        rend: 77.4
      },
      {
        linea: 3,
        idEstacion: 0,
        'nombreEstación': 'L3 Huesero 03',
        hueseroCod: '3901',
        huesero: 'LARRAÑAGA DAMIAN',
        cuartos: 143,
        kgRecibidos: 8750,
        kgEnviados: 6738,
        rend: 77
      },
      {
        linea: 3,
        idEstacion: 0,
        'nombreEstación': 'L3 Huesero 04',
        hueseroCod: '5082',
        huesero: 'CARBONELL ROLANDO',
        cuartos: 140,
        kgRecibidos: 8635,
        kgEnviados: 6780,
        rend: 78.5
      },
      {
        linea: 3,
        idEstacion: 0,
        'nombreEstación': 'L3 Huesero 05',
        hueseroCod: '5046',
        huesero: 'DIEPPA JAVIER',
        cuartos: 89,
        kgRecibidos: 5597,
        kgEnviados: 4356,
        rend: 77.8
      },
      {
        linea: 3,
        idEstacion: 0,
        'nombreEstación': 'L3 Huesero 02',
        hueseroCod: '6953',
        huesero: 'GONZALEZ DONOVAN',
        cuartos: 75,
        kgRecibidos: 4597,
        kgEnviados: 3558,
        rend: 77.4
      },
      {
        linea: 4,
        idEstacion: 0,
        'nombreEstación': 'L4 Huesero 02',
        hueseroCod: '5834',
        huesero: 'MEDEROS NESTOR',
        cuartos: 123,
        kgRecibidos: 7625,
        kgEnviados: 5723,
        rend: 75
      },
      {
        linea: 4,
        idEstacion: 0,
        'nombreEstación': 'L4 Huesero 05',
        hueseroCod: '4342',
        huesero: 'RODRIGUEZ MARCEL',
        cuartos: 111,
        kgRecibidos: 6797,
        kgEnviados: 5202,
        rend: 76.5
      },
      {
        linea: 4,
        idEstacion: 0,
        'nombreEstación': 'L4 Huesero 04',
        hueseroCod: '2986',
        huesero: 'GARCIA DANIEL',
        cuartos: 102,
        kgRecibidos: 6362,
        kgEnviados: 4866,
        rend: 76.5
      },
      {
        linea: 4,
        idEstacion: 0,
        'nombreEstación': 'L4 Huesero 03',
        hueseroCod: '3534',
        huesero: 'MONTELONGO RICHARD',
        cuartos: 98,
        kgRecibidos: 6049,
        kgEnviados: 4717,
        rend: 78
      },
      {
        linea: 5,
        idEstacion: 0,
        'nombreEstación': 'L5 Huesero 02',
        hueseroCod: '5669',
        huesero: 'PERDOMO LUIS',
        cuartos: 136,
        kgRecibidos: 8229,
        kgEnviados: 6406,
        rend: 77.8
      },
      {
        linea: 5,
        idEstacion: 0,
        'nombreEstación': 'L5 Huesero 04',
        hueseroCod: '5462',
        huesero: 'CARBONELL JUAN',
        cuartos: 124,
        kgRecibidos: 7698,
        kgEnviados: 5944,
        rend: 77.2
      },
      {
        linea: 5,
        idEstacion: 0,
        'nombreEstación': 'L5 Huesero 05',
        hueseroCod: '3027',
        huesero: 'GOÑI ALEXIS',
        cuartos: 101,
        kgRecibidos: 6199,
        kgEnviados: 4874,
        rend: 78.6
      },
      {
        linea: 5,
        idEstacion: 0,
        'nombreEstación': 'L5 Huesero 03',
        hueseroCod: '6117',
        huesero: 'BACCINO DIEGO',
        cuartos: 81,
        kgRecibidos: 5078,
        kgEnviados: 3932,
        rend: 77.4
      },
      {
        linea: 5,
        idEstacion: 0,
        'nombreEstación': 'L5 Huesero 01',
        hueseroCod: '6949',
        huesero: 'ESPINDOLA EDUARDO',
        cuartos: 72,
        kgRecibidos: 4379,
        kgEnviados: 3388,
        rend: 77.4
      }
    ]
  }

  testGetCharqueadores(): IndicadorCharqueador[] {
    return   [
      {
        linea: 'null',
        nombreEstacion: 'null',
        idEstacion: '0',
        charqNum: '6369',
        charqueador: 'ALVAREZ GABRIEL',
        cortesRecibidos: 187,
        cortesEnviados: 345,
        kgRecibidos: 1209,
        kgEnviados: 907,
        porcRendimiento: 75.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'null',
        nombreEstacion: 'null',
        idEstacion: '0',
        charqNum: '5971',
        charqueador: 'TORENA LUIS',
        cortesRecibidos: 14,
        cortesEnviados: 18,
        kgRecibidos: 70,
        kgEnviados: 49,
        porcRendimiento: 70.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'null',
        nombreEstacion: 'null',
        idEstacion: '0',
        charqNum: '6688',
        charqueador: 'CANOBRA JUAN',
        cortesRecibidos: 11,
        cortesEnviados: 15,
        kgRecibidos: 66,
        kgEnviados: 49,
        porcRendimiento: 75.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'null',
        nombreEstacion: 'null',
        idEstacion: '0',
        charqNum: '5592',
        charqueador: 'GARCIA BRANDON',
        cortesRecibidos: 8,
        cortesEnviados: 12,
        kgRecibidos: 49,
        kgEnviados: 33,
        porcRendimiento: 67.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'null',
        nombreEstacion: 'null',
        idEstacion: '0',
        charqNum: 'bsem0649',
        charqueador: 'Copia de CHOCHO JUAN',
        cortesRecibidos: 15,
        cortesEnviados: 19,
        kgRecibidos: 82,
        kgEnviados: 52,
        porcRendimiento: 63,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 01',
        idEstacion: '8',
        charqNum: '3725',
        charqueador: 'SILVERA RAMIRO',
        cortesRecibidos: 262,
        cortesEnviados: 438,
        kgRecibidos: 1627,
        kgEnviados: 1207,
        porcRendimiento: 74.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 02',
        idEstacion: '9',
        charqNum: '5562',
        charqueador: 'BENVENUTO ALVARO',
        cortesRecibidos: 266,
        cortesEnviados: 484,
        kgRecibidos: 1699,
        kgEnviados: 1243,
        porcRendimiento: 73.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 03',
        idEstacion: '10',
        charqNum: '3220',
        charqueador: 'CAL SERGIO',
        cortesRecibidos: 211,
        cortesEnviados: 353,
        kgRecibidos: 1243,
        kgEnviados: 882,
        porcRendimiento: 70.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 04',
        idEstacion: '11',
        charqNum: '3448',
        charqueador: 'CARTAGENA DARIO',
        cortesRecibidos: 218,
        cortesEnviados: 387,
        kgRecibidos: 1383,
        kgEnviados: 1040,
        porcRendimiento: 75.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 05',
        idEstacion: '12',
        charqNum: '3606',
        charqueador: 'PEREZ MARCOS',
        cortesRecibidos: 181,
        cortesEnviados: 322,
        kgRecibidos: 1182,
        kgEnviados: 796,
        porcRendimiento: 67.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 06',
        idEstacion: '13',
        charqNum: '3212 ',
        charqueador: 'VIÑOLY JOSE',
        cortesRecibidos: 254,
        cortesEnviados: 469,
        kgRecibidos: 1632,
        kgEnviados: 1142,
        porcRendimiento: 70,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 07',
        idEstacion: '14',
        charqNum: '4092',
        charqueador: 'HERNANDEZ ADOLFO',
        cortesRecibidos: 4,
        cortesEnviados: 1,
        kgRecibidos: 21,
        kgEnviados: 2,
        porcRendimiento: 7.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 08',
        idEstacion: '15',
        charqNum: '3069',
        charqueador: 'FERRARI LEONARDO',
        cortesRecibidos: 314,
        cortesEnviados: 592,
        kgRecibidos: 1907,
        kgEnviados: 1332,
        porcRendimiento: 69.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 09',
        idEstacion: '16',
        charqNum: '5511',
        charqueador: 'CABANO GONZALO',
        cortesRecibidos: 192,
        cortesEnviados: 339,
        kgRecibidos: 1230,
        kgEnviados: 899,
        porcRendimiento: 73.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 10',
        idEstacion: '17',
        charqNum: '6210',
        charqueador: 'SILVESTRE SANDRA',
        cortesRecibidos: 240,
        cortesEnviados: 451,
        kgRecibidos: 1609,
        kgEnviados: 1222,
        porcRendimiento: 76,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 11',
        idEstacion: '18',
        charqNum: '5371',
        charqueador: 'RODRIGUEZ ANDRES',
        cortesRecibidos: 247,
        cortesEnviados: 444,
        kgRecibidos: 1569,
        kgEnviados: 1152,
        porcRendimiento: 73.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 12',
        idEstacion: '19',
        charqNum: '3198',
        charqueador: 'PIÑEYRUA WALTER',
        cortesRecibidos: 246,
        cortesEnviados: 431,
        kgRecibidos: 1543,
        kgEnviados: 1185,
        porcRendimiento: 76.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 13',
        idEstacion: '20',
        charqNum: '5404',
        charqueador: 'VELOZ CECIA',
        cortesRecibidos: 181,
        cortesEnviados: 316,
        kgRecibidos: 1184,
        kgEnviados: 843,
        porcRendimiento: 71.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 14',
        idEstacion: '21',
        charqNum: '4468',
        charqueador: 'ARENA DANIEL',
        cortesRecibidos: 217,
        cortesEnviados: 378,
        kgRecibidos: 1408,
        kgEnviados: 1027,
        porcRendimiento: 72.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 15',
        idEstacion: '22',
        charqNum: '5005',
        charqueador: 'GONZALEZ JHONATAN',
        cortesRecibidos: 306,
        cortesEnviados: 512,
        kgRecibidos: 1960,
        kgEnviados: 1475,
        porcRendimiento: 75.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L1 ',
        nombreEstacion: 'L1 Charqueo 16',
        idEstacion: '23',
        charqNum: '2539',
        charqueador: 'PEREYRA FABIO',
        cortesRecibidos: 219,
        cortesEnviados: 405,
        kgRecibidos: 1350,
        kgEnviados: 935,
        porcRendimiento: 69.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 01',
        idEstacion: '65',
        charqNum: '5136',
        charqueador: 'CUADRA MATHIAS',
        cortesRecibidos: 280,
        cortesEnviados: 483,
        kgRecibidos: 1778,
        kgEnviados: 1423,
        porcRendimiento: 80,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 02',
        idEstacion: '70',
        charqNum: '3352',
        charqueador: 'ROJAS ALBERTO',
        cortesRecibidos: 243,
        cortesEnviados: 415,
        kgRecibidos: 1552,
        kgEnviados: 1101,
        porcRendimiento: 70.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 03',
        idEstacion: '74',
        charqNum: '5741',
        charqueador: 'BURGOS ENZO',
        cortesRecibidos: 220,
        cortesEnviados: 386,
        kgRecibidos: 1408,
        kgEnviados: 1030,
        porcRendimiento: 73.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 04',
        idEstacion: '78',
        charqNum: '3566',
        charqueador: 'BOIDI NICOLAS',
        cortesRecibidos: 233,
        cortesEnviados: 360,
        kgRecibidos: 1483,
        kgEnviados: 1026,
        porcRendimiento: 69.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 05',
        idEstacion: '82',
        charqNum: '5016',
        charqueador: 'RIVERO DANIEL',
        cortesRecibidos: 216,
        cortesEnviados: 343,
        kgRecibidos: 1389,
        kgEnviados: 1036,
        porcRendimiento: 74.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 06',
        idEstacion: '86',
        charqNum: '5772',
        charqueador: 'BLANCO MARCELO',
        cortesRecibidos: 295,
        cortesEnviados: 481,
        kgRecibidos: 1905,
        kgEnviados: 1406,
        porcRendimiento: 73.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 07',
        idEstacion: '90',
        charqNum: '5289',
        charqueador: 'FOURMENT LUIS',
        cortesRecibidos: 224,
        cortesEnviados: 384,
        kgRecibidos: 1347,
        kgEnviados: 987,
        porcRendimiento: 73.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 08',
        idEstacion: '94',
        charqNum: '3760',
        charqueador: 'LADO HECTOR',
        cortesRecibidos: 235,
        cortesEnviados: 397,
        kgRecibidos: 1432,
        kgEnviados: 1056,
        porcRendimiento: 73.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 09',
        idEstacion: '98',
        charqNum: '2671',
        charqueador: 'RODRIGUEZ FABIO',
        cortesRecibidos: 235,
        cortesEnviados: 464,
        kgRecibidos: 1607,
        kgEnviados: 1217,
        porcRendimiento: 75.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 10',
        idEstacion: '102',
        charqNum: '4607',
        charqueador: 'NUÑEZ JULIO',
        cortesRecibidos: 233,
        cortesEnviados: 366,
        kgRecibidos: 1435,
        kgEnviados: 956,
        porcRendimiento: 66.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 11',
        idEstacion: '106',
        charqNum: '3327',
        charqueador: 'MACHIN SERGIO',
        cortesRecibidos: 306,
        cortesEnviados: 566,
        kgRecibidos: 1943,
        kgEnviados: 1437,
        porcRendimiento: 73.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 12',
        idEstacion: '110',
        charqNum: '4989',
        charqueador: 'SOSA ALBERTO',
        cortesRecibidos: 257,
        cortesEnviados: 447,
        kgRecibidos: 1746,
        kgEnviados: 1261,
        porcRendimiento: 72.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 13',
        idEstacion: '114',
        charqNum: '3174',
        charqueador: 'PACHECO MARITA',
        cortesRecibidos: 201,
        cortesEnviados: 336,
        kgRecibidos: 1182,
        kgEnviados: 915,
        porcRendimiento: 77.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 14',
        idEstacion: '118',
        charqNum: '5395',
        charqueador: 'DE LEON VICTOR',
        cortesRecibidos: 281,
        cortesEnviados: 481,
        kgRecibidos: 1720,
        kgEnviados: 1236,
        porcRendimiento: 71.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 15',
        idEstacion: '122',
        charqNum: '4856',
        charqueador: 'GIMENEZ JHONATAN',
        cortesRecibidos: 221,
        cortesEnviados: 409,
        kgRecibidos: 1428,
        kgEnviados: 1043,
        porcRendimiento: 73,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L2 ',
        nombreEstacion: 'L2 Charqueo 16',
        idEstacion: '126',
        charqNum: '2147',
        charqueador: 'RUIZ RICARDO',
        cortesRecibidos: 261,
        cortesEnviados: 464,
        kgRecibidos: 1658,
        kgEnviados: 1200,
        porcRendimiento: 72.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 01',
        idEstacion: '67',
        charqNum: '1772',
        charqueador: 'BRAVO ELADIO',
        cortesRecibidos: 128,
        cortesEnviados: 259,
        kgRecibidos: 853,
        kgEnviados: 733,
        porcRendimiento: 85.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 02',
        idEstacion: '71',
        charqNum: '6685',
        charqueador: 'VELEZ UBALDO',
        cortesRecibidos: 210,
        cortesEnviados: 349,
        kgRecibidos: 1257,
        kgEnviados: 923,
        porcRendimiento: 73.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 03',
        idEstacion: '75',
        charqNum: '3211',
        charqueador: 'NUÑEZ MARCOS',
        cortesRecibidos: 274,
        cortesEnviados: 480,
        kgRecibidos: 1757,
        kgEnviados: 1270,
        porcRendimiento: 72.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 04',
        idEstacion: '79',
        charqNum: '2931',
        charqueador: 'GONZALEZ FEDERICO',
        cortesRecibidos: 261,
        cortesEnviados: 475,
        kgRecibidos: 1620,
        kgEnviados: 1210,
        porcRendimiento: 74.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 05',
        idEstacion: '83',
        charqNum: '5830',
        charqueador: 'MOREIRA MAXIMILIANO',
        cortesRecibidos: 231,
        cortesEnviados: 376,
        kgRecibidos: 1456,
        kgEnviados: 1104,
        porcRendimiento: 75.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 06',
        idEstacion: '87',
        charqNum: '2930',
        charqueador: 'VALENTIN FREEDY',
        cortesRecibidos: 262,
        cortesEnviados: 460,
        kgRecibidos: 1667,
        kgEnviados: 1184,
        porcRendimiento: 71,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 08',
        idEstacion: '95',
        charqNum: '3053',
        charqueador: 'SILVA MAURICIO',
        cortesRecibidos: 280,
        cortesEnviados: 472,
        kgRecibidos: 1723,
        kgEnviados: 1292,
        porcRendimiento: 75,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 09',
        idEstacion: '99',
        charqNum: '4540',
        charqueador: 'BOUTON CARLOS',
        cortesRecibidos: 112,
        cortesEnviados: 179,
        kgRecibidos: 702,
        kgEnviados: 479,
        porcRendimiento: 68.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 10',
        idEstacion: '103',
        charqNum: '3050',
        charqueador: 'CARABALLO RUBEN',
        cortesRecibidos: 242,
        cortesEnviados: 477,
        kgRecibidos: 1628,
        kgEnviados: 1219,
        porcRendimiento: 74.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 11',
        idEstacion: '107',
        charqNum: '5108',
        charqueador: 'DE LEON DIEGO',
        cortesRecibidos: 335,
        cortesEnviados: 586,
        kgRecibidos: 2131,
        kgEnviados: 1519,
        porcRendimiento: 71.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 12',
        idEstacion: '111',
        charqNum: '6130',
        charqueador: 'CARRERA DARWIN',
        cortesRecibidos: 260,
        cortesEnviados: 445,
        kgRecibidos: 1588,
        kgEnviados: 1218,
        porcRendimiento: 76.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 13',
        idEstacion: '115',
        charqNum: '6582',
        charqueador: 'ITUARTE PABLO',
        cortesRecibidos: 218,
        cortesEnviados: 377,
        kgRecibidos: 1350,
        kgEnviados: 1001,
        porcRendimiento: 74.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 14',
        idEstacion: '119',
        charqNum: '5575',
        charqueador: 'GARCIA CRISTIAN',
        cortesRecibidos: 237,
        cortesEnviados: 439,
        kgRecibidos: 1450,
        kgEnviados: 1119,
        porcRendimiento: 77.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 15',
        idEstacion: '123',
        charqNum: '5848',
        charqueador: 'SASTRE DIEGO',
        cortesRecibidos: 299,
        cortesEnviados: 516,
        kgRecibidos: 1840,
        kgEnviados: 1379,
        porcRendimiento: 74.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L3 ',
        nombreEstacion: 'L3 Charqueo 16',
        idEstacion: '127',
        charqNum: '6710',
        charqueador: 'HERNANDEZ JAVIER',
        cortesRecibidos: 78,
        cortesEnviados: 121,
        kgRecibidos: 430,
        kgEnviados: 295,
        porcRendimiento: 68.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 01',
        idEstacion: '68',
        charqNum: '2908',
        charqueador: 'TOMEO NESTOR',
        cortesRecibidos: 16,
        cortesEnviados: 20,
        kgRecibidos: 89,
        kgEnviados: 50,
        porcRendimiento: 56.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 02',
        idEstacion: '72',
        charqNum: '3875',
        charqueador: 'SZEMETUCHA HECTOR',
        cortesRecibidos: 242,
        cortesEnviados: 444,
        kgRecibidos: 1472,
        kgEnviados: 1103,
        porcRendimiento: 74.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 03',
        idEstacion: '76',
        charqNum: '4551',
        charqueador: 'ALEMAN DARWIN',
        cortesRecibidos: 261,
        cortesEnviados: 442,
        kgRecibidos: 1498,
        kgEnviados: 1111,
        porcRendimiento: 74.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 04',
        idEstacion: '80',
        charqNum: '5441',
        charqueador: 'COUGETT NICOLAS',
        cortesRecibidos: 216,
        cortesEnviados: 379,
        kgRecibidos: 1362,
        kgEnviados: 1099,
        porcRendimiento: 80.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 05',
        idEstacion: '84',
        charqNum: '4055',
        charqueador: 'POCECCO ALDO',
        cortesRecibidos: 227,
        cortesEnviados: 465,
        kgRecibidos: 1518,
        kgEnviados: 1124,
        porcRendimiento: 74.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 06',
        idEstacion: '88',
        charqNum: '4284',
        charqueador: 'SILVEIRA NICOLAS',
        cortesRecibidos: 151,
        cortesEnviados: 294,
        kgRecibidos: 952,
        kgEnviados: 719,
        porcRendimiento: 75.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 07',
        idEstacion: '92',
        charqNum: '6598',
        charqueador: 'SASTRE FACUNDO',
        cortesRecibidos: 207,
        cortesEnviados: 334,
        kgRecibidos: 1165,
        kgEnviados: 897,
        porcRendimiento: 76.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 08',
        idEstacion: '96',
        charqNum: '5452',
        charqueador: 'PEREZ GABRIEL',
        cortesRecibidos: 231,
        cortesEnviados: 413,
        kgRecibidos: 1359,
        kgEnviados: 1044,
        porcRendimiento: 76.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 09',
        idEstacion: '100',
        charqNum: '4125',
        charqueador: 'CORNALINO FERNANDO',
        cortesRecibidos: 265,
        cortesEnviados: 495,
        kgRecibidos: 1691,
        kgEnviados: 1310,
        porcRendimiento: 77.5,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 10',
        idEstacion: '104',
        charqNum: '3022',
        charqueador: 'COLOMBO ALEJANDRO',
        cortesRecibidos: 259,
        cortesEnviados: 449,
        kgRecibidos: 1585,
        kgEnviados: 1178,
        porcRendimiento: 74.3,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 11',
        idEstacion: '108',
        charqNum: '5540',
        charqueador: 'MASNER EDUARDO',
        cortesRecibidos: 273,
        cortesEnviados: 508,
        kgRecibidos: 1739,
        kgEnviados: 1264,
        porcRendimiento: 72.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 12',
        idEstacion: '112',
        charqNum: '3607',
        charqueador: 'GULARTE MARTIN',
        cortesRecibidos: 196,
        cortesEnviados: 331,
        kgRecibidos: 1211,
        kgEnviados: 930,
        porcRendimiento: 76.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 13',
        idEstacion: '116',
        charqNum: '6032',
        charqueador: 'DA SILVA VICTOR',
        cortesRecibidos: 236,
        cortesEnviados: 429,
        kgRecibidos: 1483,
        kgEnviados: 1114,
        porcRendimiento: 75.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 14',
        idEstacion: '120',
        charqNum: '3190',
        charqueador: 'CERNADA GABRIEL',
        cortesRecibidos: 281,
        cortesEnviados: 509,
        kgRecibidos: 1629,
        kgEnviados: 1231,
        porcRendimiento: 75.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L4 ',
        nombreEstacion: 'L4 Charqueo 16',
        idEstacion: '128',
        charqNum: '4345',
        charqueador: 'LEMOS ALEJANDRO',
        cortesRecibidos: 260,
        cortesEnviados: 464,
        kgRecibidos: 1603,
        kgEnviados: 1171,
        porcRendimiento: 73.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 01',
        idEstacion: '69',
        charqNum: '6955',
        charqueador: 'GONZALEZ MICHAEL',
        cortesRecibidos: 205,
        cortesEnviados: 339,
        kgRecibidos: 1141,
        kgEnviados: 829,
        porcRendimiento: 72.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 02',
        idEstacion: '73',
        charqNum: '5295',
        charqueador: 'DIAZ MATIAS',
        cortesRecibidos: 247,
        cortesEnviados: 416,
        kgRecibidos: 1573,
        kgEnviados: 1164,
        porcRendimiento: 74,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 03',
        idEstacion: '77',
        charqNum: '2232',
        charqueador: 'PEISINO MARIO',
        cortesRecibidos: 323,
        cortesEnviados: 556,
        kgRecibidos: 2049,
        kgEnviados: 1519,
        porcRendimiento: 74.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 04',
        idEstacion: '81',
        charqNum: '2642',
        charqueador: 'RODRIGUEZ LEONARDO.',
        cortesRecibidos: 232,
        cortesEnviados: 398,
        kgRecibidos: 1446,
        kgEnviados: 1112,
        porcRendimiento: 76.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 05',
        idEstacion: '85',
        charqNum: '4390',
        charqueador: 'TORRES MAXIMILIANO',
        cortesRecibidos: 293,
        cortesEnviados: 523,
        kgRecibidos: 1899,
        kgEnviados: 1471,
        porcRendimiento: 77.5,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 06',
        idEstacion: '89',
        charqNum: '5358',
        charqueador: 'LEMOS EDWARD',
        cortesRecibidos: 282,
        cortesEnviados: 493,
        kgRecibidos: 1757,
        kgEnviados: 1246,
        porcRendimiento: 70.9,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 07',
        idEstacion: '93',
        charqNum: '5674',
        charqueador: 'RIVAS NARUEL',
        cortesRecibidos: 266,
        cortesEnviados: 463,
        kgRecibidos: 1712,
        kgEnviados: 1207,
        porcRendimiento: 70.5,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 08',
        idEstacion: '97',
        charqNum: '5361',
        charqueador: 'ACUÑA OSCAR',
        cortesRecibidos: 233,
        cortesEnviados: 415,
        kgRecibidos: 1464,
        kgEnviados: 1083,
        porcRendimiento: 74,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 09',
        idEstacion: '101',
        charqNum: '4475',
        charqueador: 'ROMERO PABLO',
        cortesRecibidos: 129,
        cortesEnviados: 219,
        kgRecibidos: 803,
        kgEnviados: 621,
        porcRendimiento: 77.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 10',
        idEstacion: '105',
        charqNum: '4098',
        charqueador: 'BERRUTI JOHNATAN',
        cortesRecibidos: 174,
        cortesEnviados: 322,
        kgRecibidos: 1118,
        kgEnviados: 879,
        porcRendimiento: 78.6,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 11',
        idEstacion: '109',
        charqNum: '5632',
        charqueador: 'ACCEDERO IGNACIO',
        cortesRecibidos: 247,
        cortesEnviados: 436,
        kgRecibidos: 1549,
        kgEnviados: 1142,
        porcRendimiento: 73.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 12',
        idEstacion: '113',
        charqNum: '6682',
        charqueador: 'SOUZA MAURIZIO',
        cortesRecibidos: 270,
        cortesEnviados: 441,
        kgRecibidos: 1694,
        kgEnviados: 1231,
        porcRendimiento: 72.7,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 13',
        idEstacion: '117',
        charqNum: '5609',
        charqueador: 'SOSA FABRICIO',
        cortesRecibidos: 213,
        cortesEnviados: 352,
        kgRecibidos: 1372,
        kgEnviados: 1034,
        porcRendimiento: 75.4,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 14',
        idEstacion: '121',
        charqNum: '5125',
        charqueador: 'MARTINEZ LUIS',
        cortesRecibidos: 289,
        cortesEnviados: 484,
        kgRecibidos: 1780,
        kgEnviados: 1284,
        porcRendimiento: 72.2,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 15',
        idEstacion: '125',
        charqNum: '6799',
        charqueador: 'LEDESMA HUGO',
        cortesRecibidos: 171,
        cortesEnviados: 283,
        kgRecibidos: 1047,
        kgEnviados: 783,
        porcRendimiento: 74.8,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      },
      {
        linea: 'L5 ',
        nombreEstacion: 'L5 Charqueo 16',
        idEstacion: '129',
        charqNum: '6614',
        charqueador: 'RODRIGUEZ NESTOR',
        cortesRecibidos: 231,
        cortesEnviados: 422,
        kgRecibidos: 1516,
        kgEnviados: 1094,
        porcRendimiento: 72.1,
        procRendPromedio: 73.9,
        promedioKilosSalidaCharqueador: 1009.5
      }
    ]
  }

  testGetEmpaque(): IndicadorEmpaque[] {
    return [
      { station: 25, puesto: 'L1 Primary Packing 02', cortes: 2, peso: 9 },
      {
        station: 26,
        puesto: 'L1 Primary Packing 03',
        cortes: 574,
        peso: 1283
      },
      {
        station: 27,
        puesto: 'L1 Primary Packing 04',
        cortes: 588,
        peso: 1305
      },
      { station: 28, puesto: 'L1 Primary Packing 05', cortes: 472, peso: 885 },
      {
        station: 29,
        puesto: 'L1 Primary Packing 06',
        cortes: 700,
        peso: 1612
      },
      {
        station: 30,
        puesto: 'L1 Primary Packing 07',
        cortes: 579,
        peso: 1238
      },
      { station: 31, puesto: 'L1 Primary Packing 08', cortes: 237, peso: 654 },
      {
        station: 32,
        puesto: 'L1 Primary Packing 09',
        cortes: 449,
        peso: 2099
      },
      { station: 33, puesto: 'L1 Primary Packing 10', cortes: 351, peso: 936 },
      {
        station: 34,
        puesto: 'L1 Primary Packing 11',
        cortes: 1029,
        peso: 2276
      },
      {
        station: 35,
        puesto: 'L1 Primary Packing 12',
        cortes: 474,
        peso: 1810
      },
      {
        station: 37,
        puesto: 'L1 Primary Packing 14',
        cortes: 509,
        peso: 1919
      },
      { station: 39, puesto: 'L1 Primary Packing 16', cortes: 213, peso: 224 },
      { station: 134, puesto: 'L2 Primary Packing 02', cortes: 8, peso: 28 },
      {
        station: 138,
        puesto: 'L2 Primary Packing 03',
        cortes: 630,
        peso: 1477
      },
      {
        station: 142,
        puesto: 'L2 Primary Packing 04',
        cortes: 742,
        peso: 1762
      },
      {
        station: 146,
        puesto: 'L2 Primary Packing 05',
        cortes: 521,
        peso: 950
      },
      {
        station: 150,
        puesto: 'L2 Primary Packing 06',
        cortes: 695,
        peso: 1713
      },
      {
        station: 154,
        puesto: 'L2 Primary Packing 07',
        cortes: 639,
        peso: 1428
      },
      {
        station: 158,
        puesto: 'L2 Primary Packing 08',
        cortes: 184,
        peso: 492
      },
      {
        station: 162,
        puesto: 'L2 Primary Packing 09',
        cortes: 483,
        peso: 2273
      },
      {
        station: 166,
        puesto: 'L2 Primary Packing 10',
        cortes: 391,
        peso: 1020
      },
      {
        station: 170,
        puesto: 'L2 Primary Packing 11',
        cortes: 1054,
        peso: 2722
      },
      {
        station: 174,
        puesto: 'L2 Primary Packing 12',
        cortes: 515,
        peso: 1983
      },
      {
        station: 182,
        puesto: 'L2 Primary Packing 14',
        cortes: 560,
        peso: 2130
      },
      {
        station: 190,
        puesto: 'L2 Primary Packing 16',
        cortes: 243,
        peso: 264
      },
      {
        station: 139,
        puesto: 'L3 Primary Packing 03',
        cortes: 523,
        peso: 1148
      },
      {
        station: 143,
        puesto: 'L3 Primary Packing 04',
        cortes: 670,
        peso: 1540
      },
      {
        station: 147,
        puesto: 'L3 Primary Packing 05',
        cortes: 477,
        peso: 921
      },
      {
        station: 151,
        puesto: 'L3 Primary Packing 06',
        cortes: 618,
        peso: 1459
      },
      {
        station: 155,
        puesto: 'L3 Primary Packing 07',
        cortes: 585,
        peso: 1310
      },
      {
        station: 159,
        puesto: 'L3 Primary Packing 08',
        cortes: 164,
        peso: 433
      },
      {
        station: 163,
        puesto: 'L3 Primary Packing 09',
        cortes: 438,
        peso: 2073
      },
      {
        station: 167,
        puesto: 'L3 Primary Packing 10',
        cortes: 305,
        peso: 786
      },
      {
        station: 171,
        puesto: 'L3 Primary Packing 11',
        cortes: 990,
        peso: 2364
      },
      {
        station: 175,
        puesto: 'L3 Primary Packing 12',
        cortes: 455,
        peso: 1774
      },
      {
        station: 183,
        puesto: 'L3 Primary Packing 14',
        cortes: 496,
        peso: 1891
      },
      {
        station: 191,
        puesto: 'L3 Primary Packing 16',
        cortes: 225,
        peso: 243
      },
      { station: 136, puesto: 'L4 Primary Packing 02', cortes: 5, peso: 20 },
      {
        station: 140,
        puesto: 'L4 Primary Packing 03',
        cortes: 533,
        peso: 1224
      },
      {
        station: 144,
        puesto: 'L4 Primary Packing 04',
        cortes: 611,
        peso: 1329
      },
      {
        station: 148,
        puesto: 'L4 Primary Packing 05',
        cortes: 448,
        peso: 870
      },
      {
        station: 152,
        puesto: 'L4 Primary Packing 06',
        cortes: 610,
        peso: 1396
      },
      {
        station: 156,
        puesto: 'L4 Primary Packing 07',
        cortes: 555,
        peso: 1184
      },
      {
        station: 160,
        puesto: 'L4 Primary Packing 08',
        cortes: 242,
        peso: 613
      },
      {
        station: 164,
        puesto: 'L4 Primary Packing 09',
        cortes: 423,
        peso: 1958
      },
      {
        station: 168,
        puesto: 'L4 Primary Packing 10',
        cortes: 342,
        peso: 921
      },
      {
        station: 172,
        puesto: 'L4 Primary Packing 11',
        cortes: 1041,
        peso: 2204
      },
      {
        station: 176,
        puesto: 'L4 Primary Packing 12',
        cortes: 430,
        peso: 1713
      },
      {
        station: 184,
        puesto: 'L4 Primary Packing 14',
        cortes: 458,
        peso: 1801
      },
      {
        station: 192,
        puesto: 'L4 Primary Packing 16',
        cortes: 245,
        peso: 265
      },
      { station: 137, puesto: 'L5 Primary Packing 02', cortes: 4, peso: 16 },
      {
        station: 141,
        puesto: 'L5 Primary Packing 03',
        cortes: 780,
        peso: 2220
      },
      {
        station: 145,
        puesto: 'L5 Primary Packing 04',
        cortes: 711,
        peso: 1576
      },
      {
        station: 149,
        puesto: 'L5 Primary Packing 05',
        cortes: 530,
        peso: 1041
      },
      {
        station: 153,
        puesto: 'L5 Primary Packing 06',
        cortes: 693,
        peso: 1618
      },
      {
        station: 157,
        puesto: 'L5 Primary Packing 07',
        cortes: 719,
        peso: 1781
      },
      {
        station: 161,
        puesto: 'L5 Primary Packing 08',
        cortes: 209,
        peso: 605
      },
      {
        station: 165,
        puesto: 'L5 Primary Packing 09',
        cortes: 223,
        peso: 1000
      },
      {
        station: 169,
        puesto: 'L5 Primary Packing 10',
        cortes: 373,
        peso: 1033
      },
      {
        station: 173,
        puesto: 'L5 Primary Packing 11',
        cortes: 1089,
        peso: 2871
      },
      {
        station: 177,
        puesto: 'L5 Primary Packing 12',
        cortes: 505,
        peso: 1952
      },
      {
        station: 185,
        puesto: 'L5 Primary Packing 14',
        cortes: 547,
        peso: 2076
      },
      {
        station: 193,
        puesto: 'L5 Primary Packing 16',
        cortes: 267,
        peso: 290
      }
    ]
  }

  testGetLotesEntrada(): LoteEntrada[] {
    return  [
      {
        tipoEntrada: 'TRASERO PREMIUM DESCOMPENSADO',
        codigo: '2750',
        producto: 'PISTOLA NOV ENF 3C PREMIUM',
        cuartos: 148,
        pesoCuartos: 8854,
        promedio: 59.82,
        horaPrimerCuarto: '10:44:57',
        horaUltimoCuarto: ''
      },
      {
        tipoEntrada: 'TRASERO PREMIUM DESCOMPENSADO',
        codigo: '1159',
        producto: 'PISTOLA NOV ENF 3C C/P PREMIUM',
        cuartos: 267,
        pesoCuartos: 16778.6,
        promedio: 62.84,
        horaPrimerCuarto: '10:43:34',
        horaUltimoCuarto: ''
      },
      {
        tipoEntrada: 'CUOTA ITALIA  ANGUS',
        codigo: '2250',
        producto: 'HERRADURA NOV 10 C PREMIUM ANG',
        cuartos: 500,
        pesoCuartos: 28621.8,
        promedio: 57.24,
        horaPrimerCuarto: '09:31:36',
        horaUltimoCuarto: ''
      },
      {
        tipoEntrada: 'CUOTA ITALIA  ANGUS',
        codigo: '2751',
        producto: 'PISTOLA NOV ENF 3C C/PUL PREMI',
        cuartos: 500,
        pesoCuartos: 32037.6,
        promedio: 64.08,
        horaPrimerCuarto: '08:00:45',
        horaUltimoCuarto: ''
      },
      {
        tipoEntrada: 'CUOTA DELANTERO THE BLACK',
        codigo: '2250',
        producto: 'HERRADURA NOV 10 C PREMIUM ANG',
        cuartos: 534,
        pesoCuartos: 31319.2,
        promedio: 58.65,
        horaPrimerCuarto: '07:00:46',
        horaUltimoCuarto: ''
      },
      {
        tipoEntrada: 'CUOTA TRASERO THE BLACK',
        codigo: '2751',
        producto: 'PISTOLA NOV ENF 3C C/PUL PREMI',
        cuartos: 534,
        pesoCuartos: 35270.8,
        promedio: 66.05,
        horaPrimerCuarto: '05:27:23',
        horaUltimoCuarto: ''
      }
    ]
  }
}
