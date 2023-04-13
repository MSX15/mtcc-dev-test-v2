import { ErrorMessage } from "formik"
import { useField } from "formik"
import useFGV2Context from "./useFGV2Context";


const DropDownField = (
    {
        label,
        dataSource,
        fetchDataSource,
        optionValue,
        optionDisplay,
        styling,
        isSearchable,
        onBlur,
        ...props
    }) => {
    styling ??= {}
    const [field, meta] = useField(props);
    const { values, setFieldValue, formDataSources, setFormFieldDataSources } = useFGV2Context();



    return (
        <div className={styling.container ?? ""}>
            <div className="flex flex-col">
                <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                {
                    <select
                        {...field}
                        {...props}
                        onBlur={() => onBlur
                            && onBlur({
                                fieldName: props.name,
                                formValues: values,
                                setFormFieldValue: setFieldValue,
                                formDataSources,
                                setFormFieldDataSources
                            })}
                        className="rounded-lg"
                    >
                        {/* <option value="" disabled selected>-- Select your option --</option> */}
                        {
                            Array.isArray(formDataSources[props.name])
                                ? formDataSources[props.name]
                                    .map(x =>
                                        <option value={x[optionValue]}>
                                            {
                                                typeof (optionDisplay) === "function"
                                                    ? optionDisplay(x)
                                                    : `${x.id} | ${x.name}`
                                            }
                                        </option>
                                    )
                                : <option disabled>No items</option>
                        }
                    </select>
                }

                {meta.touched && meta.error ? (
                    <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
                ) : null}
            </div>
        </div>
    );
}


export default DropDownField