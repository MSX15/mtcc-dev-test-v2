import FieldDependencyHandler from "./FieldDependencyHandler";
import { useField } from "formik";

// const DateSelectField = (
//   {
//     label,
//     optionValue,
//     optionDisplay,
//     styling,
//     dependents,
//     onDependentsChange,
//     ...props
//   }) => {

//   styling ??= {}
//   dependents ??= []
//   onDependentsChange ??= () => { }


//   const {
//     values,
//     setFieldValue,
//   } = useFormikContext();

//   // const values = {}

//   const [field, meta, helpers] = useField(props);
//   // const departmentId = values["departmentId"]

//   return (
//     <div className={styling.container ?? ""}>
//       <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} />
//       <div className="flex flex-col">
//         <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
//         {

//           <DatePickerMain
//             selectedDateChild={moment(field.value ?? meta.initialValue ?? new Date()).format(
//               "DD/MM/yyyy"
//             )}
//             onDateChange={(e) =>
//               helpers.setValue(e)
//             }
//             value={field.value}
//           />
//           // <select {...field} {...props} className="rounded-lg">
//           //   {/* <option value="" disabled selected>-- Select your option --</option> */}
//           //   {
//           //     Array.isArray(internalDataSource) &&
//           //     internalDataSource
//           //       .map(x =>
//           //         <option value={x[optionValue]}>
//           //           {typeof (optionDisplay) === "function" && optionDisplay(x)}
//           //         </option>
//           //       )}
//           // </select>

//         }

//         {meta.touched && meta.error ? (
//           <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
//         ) : null}
//       </div>
//     </div>
//   );
// }


const DateSelectField = (
    {
        label,
        styling,
        dependents,
        onDependentsChange,
        ...props
    }) => {

    console.log("DS Depenedents", dependents)
    const [field, meta] = useField(props);

    return (
        <div className={styling.container ?? ""}>
            <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} />
            <div className="flex flex-col">
                <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                <input type="date" {...field} {...props} className={styling.input ?? "rounded-lg"} />
                {meta.touched && meta.error ? (
                    <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
                ) : null}
            </div>
        </div>
    );
}

export default DateSelectField