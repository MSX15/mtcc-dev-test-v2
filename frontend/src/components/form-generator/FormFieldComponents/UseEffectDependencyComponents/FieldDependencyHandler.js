import React, { useEffect } from "react";
import { useFormikContext } from 'formik';

// const FieldDependencyWrapper = ({ dependents, onDependentsChange, dataSource, setDataSource, children, ...props }) => {
//   dataSource ??= []
//   setDataSource ??= () => { }
//   const { values, setFieldValue } = useFormikContext();

//   const fieldsToDependOn = dependents.reduce((accu, next) => { accu.push(values[next]); return accu; }, []);
//   React.useEffect(
//     () => {
//       let isCurrent = true;
//       onDependentsChange(props.name, values ?? [], setFieldValue, dataSource, setDataSource, isCurrent)
//       return () => {
//         isCurrent = false;
//       };
//     },
//     [
//       setFieldValue,
//       props.name,
//       ...fieldsToDependOn
//     ]);

//   return (
//     <div>
//       {children(...props)}
//     </div>
//   );
// }


// const MyField = ({ label, styling, ...props }) => {
//   styling ??= {}

//   let [dropDownDesignations, setDropDownDesignations] = useState([]);

//   const {
//     values: { departmentId },
//     setFieldValue,
//   } = useFormikContext();
//   const [field, meta] = useField(props);

//   React.useEffect(() => {
//     let isCurrent = true;
//     // your business logic around when to fetch goes here.
//     if (departmentId != null) {
//       fetchDepartmentDesignations(departmentId).then((res) => {
//         if (isCurrent) {
//           // prevent setting old values
//           setDropDownDesignations(res);
//           setFieldValue(props.name, 0)
//           console.log(res)
//         }
//       });
//     }
//     return () => {
//       isCurrent = false;
//     };
//   }, [departmentId, setFieldValue, props.name]);

//   return (
//     <div className={styling.container ?? ""}>
//       <div className="flex flex-col">
//         <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
//         <select {...field} {...props} className="rounded-lg">
//           {Array.isArray(dropDownDesignations) && dropDownDesignations.map(x => <option value={x.id}>{`${x.id} | ${x.name}`}</option>)}
//         </select>
//         {meta.touched && meta.error ? (
//           <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

const FieldDependencyHandler = ({ name, dependents, onDependentsChange, dataSource, setDataSource }) => {
    dependents ??= []
    onDependentsChange ??= () => { }
    dataSource ??= []
    setDataSource ??= () => { }
    const { values, setFieldValue } = useFormikContext();

    const fieldsToDependOn = dependents.reduce((accu, next) => { accu.push(values[next]); return accu; }, []);
    React.useEffect(
        () => {
            let isCurrent = true;
            onDependentsChange(name, values ?? [], setFieldValue, dataSource, setDataSource, isCurrent)
            return () => {
                isCurrent = false;
            };
        },
        [
            setFieldValue,
            name,
            ...fieldsToDependOn
        ]);

    return null;
};

export default FieldDependencyHandler