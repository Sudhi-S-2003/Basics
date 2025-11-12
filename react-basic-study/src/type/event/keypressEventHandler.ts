export interface IKeypressEventHandler {
    key: string,
    charCode:number
}

export interface IPromiseKeypressEventHandler {
    IKeypressEventHandler:Promise<void>
}