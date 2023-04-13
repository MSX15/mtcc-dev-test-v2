import { Field, ErrorMessage, useFormikContext } from "formik"
import useFGV2Context from "./useFGV2Context";
import { useState } from "react";
// import { FGV2Context } from "./FGV2Context";


const TextFieldCP = (
    {
        label,
        styling,
        dependents,
        onBlur,
        ...props
    }) => {

    props.type = "text"
    label ??= props.name
    styling ??= {}
    const { values, setFieldValue, formDataSources, setFormFieldDataSources } = useFGV2Context();

    let [valueOnFocus, setValueOnFocus] = useState()

    console.log("DATA SOURCES", formDataSources)

    return (
        <div className={styling.container ?? ""}>
            {/* <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} /> */}

            <div className="flex flex-col">
                <label htmlFor={props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                <Field
                    {...props}
                    innerRef={(x) => x.onFocus = () => { console.log("FOOOOOOOOOCUS") }}
                    onBlur={() => onBlur
                        && onBlur({
                            fieldName: props.name,
                            formValues: values,
                            setFormFieldValue: setFieldValue,
                            formDataSources,
                            setFormFieldDataSources
                        })}
                    // className="w-full rounded-md   py-1  px-2  text-sm border border-gray-200 focus:ring-orange-400 focus:outline-none"
                    className={styling.input ?? "rounded-lg"}
                />
            </div>
            <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>
                <ErrorMessage name={props.name} />
            </div>
        </div>
    )
}

export default TextFieldCP