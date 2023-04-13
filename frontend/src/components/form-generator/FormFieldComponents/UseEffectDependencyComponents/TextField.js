import { Field, ErrorMessage } from "formik"
import FieldDependencyHandler from "./FieldDependencyHandler"

const TextField = (
    {
        label,
        dependents,
        onDependentsChange,
        styling,
        ...props
    }) => {
    props.type = "text"
    label ??= props.name
    styling ??= {}

    console.log("DEPENDENTS:", dependents)
    return (
        <div className={styling.container ?? ""}>
            <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} />

            <div className="flex flex-col">
                <label htmlFor={props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                <Field {...props} onBlur={() => { console.log("OKK") }}
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

export default TextField