import { useEffect, useState } from "react"
import FieldDependencyHandler from "./FieldDependencyHandler"
import { useField } from "formik"
import { Combobox, Transition, Listbox } from "@headlessui/react";
import { Fragment } from "react"
import {
    CheckIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/solid";


const ComboBoxComponent = ({ values, options }) => {
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
            <code>{JSON.stringify(options)}</code>
            <div className="relative w-full border rounded-md border-gray-200 px-1 flex justify-between cursor-default overflow-hidden  bg-white text-left  focus:outline-none  ">
                <Combobox.Input
                    className="w-full rounded-md border-none py-0.5 px-0.5  text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(value) => value?.name}
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
                                                {options(item)}
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
            const setDataSource = async () => { setInternalDataSource(await dataSource()); console.log("TRACER>>>>>>>>>>>>>>>>", internalDataSource) }
            setDataSource();
        },
        [])

    const [field, meta, helpers] = useField(props);

    return (
        <div className={styling.container ?? ""}>
            <FieldDependencyHandler name={props.name} dependents={dependents} onDependentsChange={onDependentsChange} dataSource={internalDataSource} setDataSource={setInternalDataSource} />
            <div className="flex flex-col">
                <label htmlFor={props.id || props.name} className={styling.label ?? "pl-1 font-bold"}>{label}</label>
                {


                    <Combobox className="rounded-lg"
                        {...field}
                        {...props}
                        value={internalDataSource.find(x => x.id === field.value)}
                        // value={field.value}
                        onChange={(e) => {
                            helpers.setValue(e[optionValue]);
                            // if (field.name === "department") {
                            //     setSelectedValues({
                            //         department: e,
                            //     });
                            // }
                        }}
                    >
                        <ComboBoxComponent
                            options={optionDisplay}
                            values={internalDataSource}
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