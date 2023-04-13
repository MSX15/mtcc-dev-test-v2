import { useEffect, useState } from "react"
import { useField } from "formik"
import { Combobox, Transition, Listbox } from "@headlessui/react";
import { Fragment } from "react"
import {
    CheckIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/solid";
import useFGV2Context from "./useFGV2Context";

const ComboBoxComponent = ({ values, fieldDisplay, optionDisplay, onFocus, onBlur }) => {
    const [query, setQuery] = useState("");

    let filteredData =
        query === ""
            ? values
            : values.filter((item) => {
                let selectedData = item?.name
                    ?.toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""));
                return selectedData;
            });

    return (
        <div className="relative mt-1 w-full">
            <code>{JSON.stringify(optionDisplay)}</code>
            <div className="relative w-full border rounded-md border-gray-200 px-1 flex justify-between cursor-default overflow-hidden  bg-white text-left  focus:outline-none  ">
                <Combobox.Input
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="w-full rounded-md border-none py-0.5 px-0.5  text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={
                        (value = {}) => typeof (fieldDisplay) === "function" ? fieldDisplay(value) : JSON.stringify(value)
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                />
                <Combobox.Button className=" inset-y-0 right-0 flex items-center  ">
                    <ChevronDoubleDownIcon
                        className="h-3 w-3 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>
            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
            >
                <Combobox.Options className="fixed rounded-md w shadow-md  z-50 mt-1 border border-gray-200 max-h-60 w-fit  overflow-auto  bg-white py-1 text-md ">
                    {filteredData.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        <>
                            {filteredData.map((item) => (
                                <Combobox.Option
                                    key={item?.id}
                                    className={({ active }) =>
                                        `relative cursor-pointer divide-y divide-gray-100  select-none px-1 ${active ? "bg-slate-200 text-black" : "text-gray-900"
                                        }`
                                    }
                                    value={item}
                                >
                                    {({ selected, active }) => (
                                        <div className="flex py-1 flex-row space-x-2 justify-start items-start">
                                            {selected ? (
                                                <span
                                                    className={`flex  justify-center items-center ${active ? "text-white" : "text-orange-800"
                                                        }`}
                                                >
                                                    <CheckIcon className="h-5 w-5 " aria-hidden="true" />
                                                </span>
                                            ) : (
                                                <div className="h-5 w-5"></div>
                                            )}

                                            <div
                                                className={`w-full divide-y text-sm divide-gray-100  ${selected ? "font-medium " : "font-normal "
                                                    }`}
                                            >
                                                {
                                                    typeof (optionDisplay) === "function"
                                                        ? optionDisplay(item)
                                                        : <div>{`${item.id} | ${item.name}`}</div>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </Combobox.Option>
                            ))}
                        </>
                    )}
                </Combobox.Options>
            </Transition>
        </div>
    );
}


const AutoCompleteField = (
    {
        label,
        dataSource,
        fetchDataSource,
        optionValue,
        optionDisplay,
        styling,
        isSearchable,
        onBlur,
        nullable,
        ...props
    }) => {

    styling ??= {}

    const [field, meta, helpers] = useField(props);
    const { fieldValueOnFocus, setfieldValueOnFocus, values, setFieldValue, formDataSources, setFormFieldDataSources } = useFGV2Context();


    console.log(">>>>>>>>>>>>>>>DFSDFDF", field.value)

    if (!nullable && field.value === "" && formDataSources[props.name]) {
        const fieldValue = formDataSources[props.name][0].id;
        helpers.setValue(fieldValue)
        onBlur && onBlur({
            fieldValueOnFocus,
            fieldName: props.name,
            // HAVE NO IDEA WHY I HAVE TO UPDATE VALUES MANUALLY, IS IT VALUES NOT A STATE OBJECT? WHICH SHOULD CHANGE WHEN SETFIELDVALUE IS CALLED?
            formValues: { ...values, [props.name]: fieldValue },
            setFormFieldValue: setFieldValue,
            formDataSources,
            setFormFieldDataSources
        })
    }

    // console.log("I HAVE RERENDERED!!!!!!!!!!!!!!")


    return (
        <div className={styling.container ?? ""}>
            {/* <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} dataSource={internalDataSource} setDataSource={setInternalDataSource} /> */}
            <div className="flex flex-col">
                <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                {


                    <Combobox className="rounded-lg"
                        {...field}
                        {...props}
                        // value={formDataSources[props.name]?.find(x => x.id === field.value)}
                        value={formDataSources[props.name]?.find(x => x.id === field.value)}
                        // value={field.value}
                        onFocus={() => { setfieldValueOnFocus(values[props.name]); console.log("FOCUS", field.value) }}
                        // onBlur={() => onBlur
                        //     && onBlur({
                        //         fieldValueOnFocus,
                        //         fieldName: props.name,
                        //         formValues: values,
                        //         setFormFieldValue: setFieldValue,
                        //         formDataSources,
                        //         setFormFieldDataSources
                        //     })}
                        onChange={async (e) => {
                            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", e)
                            await helpers.setValue(e[optionValue]);


                            // await setTimeout((vals) => {
                            onBlur && onBlur({
                                fieldValueOnFocus,
                                fieldName: props.name,
                                // HAVE NO IDEA WHY I HAVE TO UPDATE VALUES MANUALLY, IS IT VALUES NOT A STATE OBJECT? WHICH SHOULD CHANGE WHEN SETFIELDVALUE IS CALLED?
                                formValues: { ...values, [props.name]: e[optionValue] },
                                setFormFieldValue: setFieldValue,
                                formDataSources,
                                setFormFieldDataSources
                            })
                            // }
                            //     , 2000, values
                            // )

                            // AutoComplete model behaviour quirk:
                            // When a value is selected, onBlur is called first, then onChange is called, hence, the onBlur abouve always
                            // fires befor the onChange event. Maybe make an onSelect event? Or make in possible to pass onChanges? (not too
                            // adviced since text fields generally call onChange every keystroke, but then again, for dropdowns, combo, mutliselect, readio,
                            // dateSelect, I think it is fine, so TODO:: take onChange as param)

                            // if (field.name === "department") {
                            //     setSelectedValues({
                            //         department: e,
                            //     });
                            // }
                        }}
                    >
                        <ComboBoxComponent
                            optionDisplay={optionDisplay}
                            values={formDataSources[props.name] ?? []}
                        // values={[{ name: "Peter" }]}
                        />
                    </Combobox>


                    // <select {...field} {...props} className="rounded-lg">
                    //     {/* <option value="" disabled selected>-- Select your option --</option> */}
                    //     {
                    //         Array.isArray(internalDataSource) &&
                    //         internalDataSource
                    //             .map(x =>
                    //                 <option value={x[optionValue]}>
                    //                     {typeof (optionDisplay) === "function" && optionDisplay(x)}
                    //                 </option>
                    //             )}
                    // </select>
                }

                {meta.touched && meta.error ? (
                    <div className={styling.error ?? "ml-1 mt-1 text-red-500 text-sm font-semibold"}>{meta.error}</div>
                ) : null}
            </div>
        </div>
    );
}


export default AutoCompleteField