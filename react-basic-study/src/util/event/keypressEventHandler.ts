import type {  IKeypressEventHandler } from "../../type/event/keypressEventHandler";

const keypressEventHandler = (e: KeyboardEvent, cb: (arg: IKeypressEventHandler) => void) => {

    const key = e.key;
    console.log({ e })
    //a-97 z-122 A-65 90
    cb({
        key,
        charCode:e.keyCode
    })
}
export default keypressEventHandler