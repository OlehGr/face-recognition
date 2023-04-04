import { useState } from "preact/hooks"

export const useControl = (defaultValue='', effect) => {
    const [value, setValue] = useState(defaultValue)

    const onChange = e => {
        setValue(e.target.value)
        if(!!effect) effect(e)
    }

    return [value, setValue, {value, onChange} ]
}