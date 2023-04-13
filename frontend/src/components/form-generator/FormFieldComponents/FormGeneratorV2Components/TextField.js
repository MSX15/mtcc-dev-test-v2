import { Field, ErrorMessage, useFormikContext, useField } from "formik"
import useFGV2Context from "./useFGV2Context";
// import { FGV2Context } from "./FGV2Context";



const MyTextInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

const TextField = (
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
    const { fieldValueOnFocus, setfieldValueOnFocus, values, setFieldValue, formDataSources, setFormFieldDataSources } = useFGV2Context();


    // console.log("DATA SOURCES", formDataSources)
    const [field, meta] = useField(props);

    return (
        <div className={styling.container ?? ""}>
            {/* <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} /> */}

            <div className="flex flex-col">
                <label htmlFor={props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                <input
                    {...field}
                    {...props}
                    onFocus={() => { setfieldValueOnFocus(field.value); console.log(field.value) }}
                    onBlur={() => onBlur
                        && onBlur({
                            fieldValueOnFocus,
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
            {meta.touched && meta.error ? (
                <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
            ) : null}
        </div>
    )
}

export default TextField