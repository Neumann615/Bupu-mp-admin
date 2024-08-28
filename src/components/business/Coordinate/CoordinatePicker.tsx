import {Button, Popover} from "antd"
import {Coordinate} from "./Coordinate";
import {useState} from "react";

function CoordinatePicker() {
    const [open, setOpen] = useState(false)
    return <Popover open={open} overlayInnerStyle={{padding: 0}}
                    content={<Coordinate width={500} height={380} zoom={13} mapId={"what can i say"}></Coordinate>}>
        <Button onClick={() => {
            setOpen(true)
        }}>what can i say</Button>
    </Popover>
}

export {CoordinatePicker}