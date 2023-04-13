import { useEffect, useState } from "react"
import FieldDependencyHandler from "./FieldDependencyHandler"
import { useField } from "formik"


// const DropDownFieldV0 = (props) =>
// {
//   let [internalDataSource, setInternalDataSource] = useState(dataSource ?? []);
//   const [field, meta] = useField(props);
//   return(
//     <div className={styling.container ?? ""}>
//     <div className="flex flex-col">
//       <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
//       {
//         <select {...field} {...props} className="rounded-lg">
//           {/* <option value="" disabled selected>-- Select your option --</option> */}
//           {
//             Array.isArray(internalDataSource) &&
//             internalDataSource
//               .map(x =>
//                 <option value={x[optionValue]}>
//                   {typeof (optionDisplay) === "function" && optionDisplay(x)}
//                 </option>
//               )}
//         </select>
//       }

//       {meta.touched && meta.error ? (
//         <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
//       ) : null}
//     </div>
//   </div> 
//   )
// }


//   const DropDownFieldV2 = (
//     {
//       label,
//       dataSource,
//       fetchDataSource,
//       optionValue,
//       optionDisplay,
//       styling,
//       dependents,
//       onDependentsChange,
//       isSearchable,
//       ...props
//     }) => {

//     styling ??= {}
//     dependents ??= []
//     onDependentsChange ??= () => { }

//     let [internalDataSource, setInternalDataSource] = useState(dataSource ?? []);

//     const {
//       values,
//       setFieldValue,
//     } = useFormikContext();

//     // const values = {}

//     const [field, meta, helpers] = useField(props);
//     // const departmentId = values["departmentId"]

//     const fieldsToDependOn = dependents.reduce((accu, next) => { accu.push(values[next]); return accu; }, []);
//     React.useEffect(
//       () => {
//         let isCurrent = true;
//         onDependentsChange(props.name, values ?? [], setFieldValue, internalDataSource, setInternalDataSource, isCurrent)
//         // your business logic around when to fetch goes here.
//         return () => {
//           isCurrent = false;
//         };
//       },
//       [
//         setFieldValue,
//         props.name,
//         ...fieldsToDependOn
//       ]);

//     return (
//       <div className={styling.container ?? ""}>
//         <div className="flex flex-col">
//           <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
//           {
//             isSearchable
//               ?
//               (
//                 // <Combobox className="rounded-lg"
//                 //   {...field}
//                 //   {...props}
//                 //   value={internalDataSource.find(x => x.id === field.value)}
//                 //   // value={field.value}
//                 //   onChange={(e) => {
//                 //     helpers.setValue(e[optionValue]);
//                 //     if (field.name === "department") {
//                 //       setSelectedValues({
//                 //         department: e,
//                 //       });
//                 //     }
//                 //   }}
//                 // >
//                 //   <ComboBoxComponent
//                 //     options={optionDisplay}
//                 //     values={internalDataSource}
//                 //   />
//                 // </Combobox>
//                 <select {...field} {...props} className="">
//                   {/* <option value="" disabled selected>-- Select your option --</option> */}
//                   {
//                     Array.isArray(internalDataSource) &&
//                     internalDataSource
//                       .map(x =>
//                         <option value={x[optionValue]}>
//                           {typeof (optionDisplay) === "function" && optionDisplay(x)}
//                         </option>
//                       )}
//                 </select>
//               )
//               :
//               (
//                 <select {...field} {...props} className="rounded-lg">
//                   {/* <option value="" disabled selected>-- Select your option --</option> */}
//                   {
//                     Array.isArray(internalDataSource) &&
//                     internalDataSource
//                       .map(x =>
//                         <option value={x[optionValue]}>
//                           {typeof (optionDisplay) === "function" && optionDisplay(x)}
//                         </option>
//                       )}
//                 </select>
//               )
//           }

//           {meta.touched && meta.error ? (
//             <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
//           ) : null}
//         </div>
//       </div>
//     );
//   }




const DropDownField = (
    {
        label,
        dataSource,
        fetchDataSource,
        optionValue,
        optionDisplay,
        styling,
        dependents,
        onDependentsChange,
        isSearchable,
        dataSources,
        setDataSources,
        ...props
    }) => {

    console.log("DD Dependents", dependents)
    styling ??= {}
    dependents ??= []
    onDependentsChange ??= () => { }

    let [internalDataSource, setInternalDataSource] = useState([]);
    useEffect(
        () => {
            const setDataSource = async () => { setInternalDataSource(await dataSource()) }
            setDataSource();
        },
        [])

    const [field, meta] = useField(props);

    return (
        <div className={styling.container ?? ""}>
            <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} dataSource={internalDataSource} setDataSource={setInternalDataSource} />
            <div className="flex flex-col">
                <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                {
                    <select {...field} {...props} className="rounded-lg">
                        {/* <option value="" disabled selected>-- Select your option --</option> */}
                        {
                            Array.isArray(internalDataSource) &&
                            internalDataSource
                                .map(x =>
                                    <option value={x[optionValue]}>
                                        {typeof (optionDisplay) === "function" && optionDisplay(x)}
                                    </option>
                                )}
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