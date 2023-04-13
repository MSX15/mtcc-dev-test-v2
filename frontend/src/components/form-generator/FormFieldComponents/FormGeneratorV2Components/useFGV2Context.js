import { useState, useContext } from "react";
import { FGV2Context } from "./FGV2Context";
import { useFormikContext } from "formik";


export default function useFGV2Context() {

    let [fieldValueOnFocus, setfieldValueOnFocus] = useState();


    return (
        {
            fieldValueOnFocus,
            setfieldValueOnFocus,
            ...useFormikContext(),
            ...useContext(FGV2Context)
        }
    )
}


