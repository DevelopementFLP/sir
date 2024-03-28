
export interface IMenuItem  {
    id: number,
    icon: string,
    label: string,
    accion(): void
}