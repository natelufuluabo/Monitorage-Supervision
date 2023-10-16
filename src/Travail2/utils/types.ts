export type lift = {
    id: number,
    level: number
}

export type liftDetail = {
    id: number,
    level: number,
    direction: string,
    destinations: number[],
    action?: string
}