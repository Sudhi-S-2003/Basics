import { useEffect, useState } from "react"
import keypressEventHandler from "../../util/event/keypressEventHandler"


const EventApp = () => {
    const includingKeys=[" "]
    const [input, setInput] = useState("")
    const keypressEventHandlerFn = (e: KeyboardEvent) => {
        keypressEventHandler(e, (data) => {
            console.log("data", { data })
            if ((data.charCode >= 65 && data.charCode <= 90)||(data.charCode >= 97 && data.charCode <= 122)||includingKeys.includes(data.key)) {
                setInput((prev) => { return prev.concat(data.key) })
            }
        })
    }

    useEffect(() => {
        document.addEventListener("keypress", keypressEventHandlerFn)
        return () => {
            document.removeEventListener("keypress", keypressEventHandlerFn)
        }
    })

    return <>
        <h1 >Event Handling Study!...</h1>
        <input
            value={input}
            readOnly={true}
            onChange={e => { setInput(e.target.value) }}
        />
    </>

}
export default EventApp