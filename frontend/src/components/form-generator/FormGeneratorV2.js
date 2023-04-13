import React, { useEffect, useState } from "react";
// import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
// import { Combobox } from "@headlessui/react";
// import { selectTab } from "../../features/employees/EmployeesSlice";
// import { useSelector } from "react-redux";
// import ComboBoxComponent from "../combo-box/ComboBoxComponent";
// import Widget from "components/widget/Widget";
// import PrimaryButton from "ui/buttons/PrimaryButton";
// import { useDropzone } from "react-dropzone";
// import DatePickerMain from "components/date-picker-v2/DatePickerMain";
// import moment from "moment";
// import { Link } from "react-router-dom";


import { Combobox } from "@headlessui/react";
import ComboBoxComponent from "../combo-box/ComboBoxComponent";


import DateSelectField from "./FormFieldComponents/DateSelectField";
// import DropDownField from "./FormFieldComponents/DropDownField";
import DropDownField from "./FormFieldComponents/FormGeneratorV2Components/DropDownField";
import AutoCompleteField from "./FormFieldComponents/FormGeneratorV2Components/AutoCompleteField";
import TextField from "./FormFieldComponents/FormGeneratorV2Components/TextField";

import Widget from "components/widget/Widget";

import { v4 as uuidv4 } from 'uuid';
import { Formik, useFormikContext, useField, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import customAxios from "middlewares/axios-interceptor/customAxios";
import DatePickerMain from "components/date-picker-v2/DatePickerMain";
import moment from "moment";
import { fi } from "date-fns/locale";
import { FGV2Context } from "./FormFieldComponents/FormGeneratorV2Components/FGV2Context";


async function fetchDepartmentDesignations(departmentId) {
  const route = `/department/${departmentId}/designations`
  console.log(route)
  const designations = await customAxios
    .get(route)

  return designations;
}



const _fieldsReduce = (fields, fieldStyling) => {
  return fields.reduce(
    (accu, field, i) => {

      if (i !== 0) {
        if (!fieldStyling.isCellSkipAlternate || (fieldStyling.isCellSkipAlternate && i % 2 !== 0)) {
          const cellSkip = field.styling?.cellSkip ?? fieldStyling.cellSkip;
          accu.push(Array.from({ length: cellSkip }, () => <div></div>))
        }
      }



      if (field.type === "text") {
        accu.push(<TextField name={field.name} label={field.label} styling={fieldStyling} {...field.fieldProps} />)
      }
      else if (field.type === "dropdown") {
        accu.push(<DropDownField name={field.name} styling={fieldStyling} {...field.fieldProps} />)
      }
      else if (field.type === "autoComplete") {
        accu.push(<AutoCompleteField name={field.name} styling={fieldStyling} {...field.fieldProps} />)
      }
      else if (field.type === "dateSelect") {
        accu.push(<DateSelectField name={field.name} styling={fieldStyling} {...field.fieldProps} />)
      }
      else {
        accu.push(<TextField name={field.name} label={field.label} styling={fieldStyling} {...field.fieldProps} />)
      }

      return accu;
    },
    []
  )
}




function FormGeneratorV2({
  height = "h-full",
  isError,
  ErrorMsg,
  setSelectedValues,
  buttonSubmit,
  onSubmit,
  header,
  subHeader,
  fields,
  sections,
  styling,
  submitButtonText
}) {

  // INITIALIZING FORM PARAMS AND SETTING DEFAULTS
  fields ??= []
  sections ??= []
  submitButtonText ??= "Submit"
  styling ??=
  {
    // layout: "grid grid-cols-12 gap-2",
    field: {
      container: "col-span-12",
      cellSkip: 0,
      isCellSkipAlternate: true

      // label: "pl-1 font-bold",
      // input: "rounded-lg",
      // error: "text-red-500"
    }

  }

  // let [constructedValidationSchema, setConstructedValidationSchema] = useState();
  let [formDataSources, setFormDataSources] = useState({});

  const setFormFieldDataSources = (fieldName, value) =>
    setFormDataSources(prev => ({ ...prev, [fieldName]: value }))

  // let [formGeneratorContext, setFormGeneratorContext] = useState({
  //   formDataSources,
  //   setFormFieldDataSource
  // });


  // useEffect(() => {
  //   setConstructedInitialValues(fields.reduce((accu, next) => {
  //     accu[next.name] = next.initialValue ?? ""; return accu;
  //   }, {}))
  //   setConstructedValidationSchema(
  //     Yup.object(
  //       fields.reduce((accu, next) => { typeof (next.validation) === "function" && (accu[next.name] = next.validation(Yup)); return accu; }, {})
  //     )
  //   );
  //   // console.log("Form Values", formData);
  //   // console.log("Form Initial Values", initialValues);
  // }, []);






  // WOW REALLY NEED TO FIGURE HOW JS ASYNC WORKS AS WELL AS HOW THAT INTERACTS WITH REACT
  useEffect(() => {
    const fetchData = async () => {
      fields.forEach(
        async next => {
          typeof (next.initialDataSource) === "function" && setFormFieldDataSources(next.name, await next.initialDataSource());
        }
      )
    }
    // const fetchData = async () => {
    //   return fields.reduce(async (accu, next) => {
    //     typeof (next.initialDataSource) === "function" && (accu[next.name] = await next.initialDataSource()); return accu;
    //   }, {})
    // }

    const initialDataSoruces = fetchData()
    console.log("INITIAL DATASOURCES", initialDataSoruces)
  }, [])


  const constructedInitialValues =
    fields.reduce((accu, next) => {
      accu[next.name] = typeof (next.initialValue) === "function" ? next.initialValue() : ""; return accu;
    }, {})
  const constructedValidationSchema =
    Yup.object(
      fields.reduce((accu, next) => {
        typeof (next.validation) === "function" && (accu[next.name] = next.validation(Yup)); return accu;
      }, {})
    )

  // const initialDataSoruces = fields.reduce(async (accu, next) => {
  //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", next.name, next)
  //   typeof (next.initialDataSource) === "function" && (accu[next.name] = await next.initialDataSource()); return accu;
  // }, {})
  // console.log("INITIAL DATASOURCES", initialDataSoruces)


  // setFormDataSources()
  // console.log("FORM INITED DATASOURCES", formDataSources)

  return (
    // <V2_Context.Provider value={formGeneratorContext}>
    <FGV2Context.Provider value={{ formDataSources, setFormFieldDataSources }}>
      {/* // To rerender the Formik component when initalvalues  */}
      {/* <div key={uuidv4()}> */}
      <div>
        <div className="text-xl font-bold">{header}</div>
        <div className="text-sm text-gray-500">{subHeader}</div>
        <div className="mt-5">
          <Formik
            initialValues={constructedInitialValues}
            validationSchema={constructedValidationSchema}
            onSubmit={
              (values, { setSubmitting }) => {
                onSubmit
                  ? onSubmit(values, { setSubmitting })
                  : setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                  }, 400);
              }}
          >
            {
              (props) =>
                <Form>

                  {/* GENERATING FIELDS PROP */}
                  {/* <div className={`${styling.layout ?? "grid grid-cols-12 gap-2"}`}> */}
                  <div className={"grid grid-cols-12 gap-2"}>
                    <div className="col-span-12">
                      <div className={"grid grid-cols-12 gap-2"}>
                        {
                          _fieldsReduce(fields, styling.field)
                        }
                      </div>
                    </div>


                    {/* GENERATING SECTIONS PROP */}
                    {
                      sections.reduce(
                        (accu, section, i) => {

                          accu.push(
                            <section className="col-span-6">
                              <Widget
                                heading={section.header ?? "N/A"}
                                subHeading={section.subHeader ?? ""}
                              >
                                {/* <div className="text-lg font-bold">{}</div>
                              <div className="text-md font-semibold text-gray-500">{}</div> */}
                                {/* <div className={`${section.styling.layout ?? "grid grid-cols-12 gap-2"}`}> */}
                                <div className={"grid grid-cols-12 gap-2"}>
                                  {
                                    // GENERATING SECTION FIELDS
                                    _fieldsReduce(section.fields, section.styling.field ?? styling.field)
                                    // section.fields.reduce(

                                    //   (accu, field, i) => {
                                    //     const localStyling = section.styling ?? styling;

                                    //     if (i !== 0) {
                                    //       if (!localStyling.field.isCellSkipAlternate || (localStyling.field.isCellSkipAlternate && i % 2 !== 0)) {
                                    //         const cellSkip = field.styling?.cellSkip ?? localStyling.field.cellSkip;
                                    //         accu.push(Array.from({ length: cellSkip }, () => <div></div>))
                                    //       }
                                    //     }


                                    //     if (field.type === "text") {
                                    //       accu.push(<TextField name={field.name} label={field.label} styling={localStyling.field} {...field.fieldProps} />)
                                    //     }
                                    //     else if (field.type === "dropdown") {
                                    //       accu.push(<DropDownField name={field.name} styling={localStyling.field} {...field.fieldProps} />)
                                    //     }
                                    //     else if (field.type === "autoComplete") {
                                    //       accu.push(<AutoCompleteField name={field.name} styling={styling.field} {...field.fieldProps} />)
                                    //     }
                                    //     else if (field.type === "dateSelect") {
                                    //       accu.push(<DateSelectField name={field.name} styling={localStyling.field} {...field.fieldProps} />)
                                    //     }
                                    //     else {
                                    //       console.log("TX Dependents", field.fieldProps.dependents)
                                    //       accu.push(<TextField name={field.name} label={field.label} styling={localStyling.field} {...field.fieldProps} />)
                                    //     }

                                    //     return accu;
                                    //   },
                                    //   []
                                    // )
                                  }
                                </div>
                              </Widget>
                            </section>
                          )

                          return accu;

                        },
                        []
                      )
                    }
                  </div>


                  <div className="mt-5">
                    <button
                      type="submit"
                      className="rounded-2xl bg-orange-500 px-5 py-2 font-semibold text-white"
                    >
                      {submitButtonText}
                    </button>
                  </div>
                </Form >
            }
          </Formik>
        </div>
      </div>
      {/* </div> */}

    </FGV2Context.Provider>
  );

  // return (

  //   <section className="relative">
  //     <FormikProvider value={formik}>
  //       <div className="flex flex-col space-y-5">
  //         {/* {isError && (
  //           <div className="bg-red-50 w-full rounded-md p-5 items-center justify-center border border-red-600  flex flex-row space-x-8">
  //             <div>
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 viewBox="0 0 24 24"
  //                 fill="currentColor"
  //                 className="w-12 h-12 text-red-700"
  //               >
  //                 <path
  //                   fillRule="evenodd"
  //                   d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
  //                   clipRule="evenodd"
  //                 />
  //               </svg>
  //             </div>
  //             <div className="w-full flex flex-col  space-y-2 text-sm text-slate-700">
  //               <h1 className="text-base font-medium">{ErrorMsg.message}</h1>
  //               <div>
  //                 {ErrorMsg.payload?.policy?.length > 0 ? (
  //                   ErrorMsg.payload?.policy[0]?.map((policy, i) => (
  //                     <div
  //                       key={i}
  //                       className="flex  flex-row space-x-3 justify-start items-center"
  //                     >
  //                       <svg
  //                         xmlns="http://www.w3.org/2000/svg"
  //                         fill="none"
  //                         viewBox="0 0 24 24"
  //                         strokeWidth={1.5}
  //                         stroke="currentColor"
  //                         className="w-2 h-2"
  //                       >
  //                         <path
  //                           strokeLinecap="round"
  //                           strokeLinejoin="round"
  //                           d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  //                         />
  //                       </svg>

  //                       <p>{policy}</p>
  //                     </div>
  //                   ))
  //                 ) : (
  //                   <div></div>
  //                 )}
  //               </div>
  //             </div>
  //             <button
  //               onClick={() => {
  //                 isError = false;
  //               }}
  //               className="flex relative   justify-start items-start"
  //             >
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 fill="none"
  //                 viewBox="0 0 24 24"
  //                 strokeWidth={1.5}
  //                 stroke="currentColor"
  //                 className="w-4 h-4"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   d="M6 18L18 6M6 6l12 12"
  //                 />
  //               </svg>
  //             </button>
  //           </div>
  //         )} */}
  //         <Form className="">
  //           <div className={`${height}  flex flex-col space-y-3`}>
  //             {formData.array?.length >= 1 ? formData.arrayRender() : ""}

  //             {formData?.contents?.map((content, i) => (
  //               <div className="flex flex-col space-y-3 " key={i}>
  //                 <Widget
  //                   heading={content?.heading ?? "N/A"}
  //                   subHeading={content?.description ?? ""}
  //                 >
  //                   <div
  //                     className={`grid ${content.fields.length > 4
  //                       ? "grid-cols-2 "
  //                       : "grid-cols-1"
  //                       } gap-3 overflow-auto`}
  //                   >
  //                     {content?.fields?.map((field, i) => {
  //                       return (
  //                         <div
  //                           className="flex flex-row row-span-2 justify-center items-center    gap-3 text-sm"
  //                           key={i}
  //                         >
  //                           <label
  //                             className="col-span-3 text-xs w-1/2"
  //                             htmlFor={field.name}
  //                           >
  //                             {field.displayName}
  //                             {field.required ? (
  //                               <span className="text-red-700 ml-1">*</span>
  //                             ) : (
  //                               ""
  //                             )}
  //                           </label>
  //                           <div className="w-full flex flex-col space-y-1">
  //                             {field?.type == "field" && (
  //                               <Field
  //                                 // required={field.required}
  //                                 name={field.name}
  //                                 type={field.inputType}
  //                                 className="w-full rounded-md   py-1  px-2  text-sm border border-gray-200 focus:ring-orange-400 focus:outline-none"
  //                               />
  //                             )}

  //                             {/* {field?.type == "pictureUpload" && (
  //                               <div className="space-y-3 w-24 aspect-square group   relative justify-start items-center">
  //                                 <div
  //                                   style={{
  //                                     backgroundImage: field.value(formik)?.name
  //                                       ? `url(${URL.createObjectURL(
  //                                         field.value(formik)
  //                                       )}) `
  //                                       : `url('https://www.mydthpay.com/img/review.png')`,
  //                                   }}
  //                                   className="h-32 w-32 rounded-full bg-cover bg-center group-hover:opacity-50"
  //                                 />
  //                                 <div
  //                                   className="absolute top-10 left-10
  //                                "
  //                                 >
  //                                   <input
  //                                     className="bg-orange-100 sticky z-50 opacity-0 h-14 w-14 border-orange-300 text-orange-800 focus:ring-0 cursor-pointer"
  //                                     type="file"
  //                                     name="image"
  //                                     onChange={(event) =>
  //                                       formik.setFieldValue(
  //                                         `${field?.name}`,
  //                                         event.target.files[0]
  //                                       )
  //                                     }
  //                                   />
  //                                   <img
  //                                     className=" absolute transition-all z-10 top-0 left-2 group-hover:opacity-70 opacity-10"
  //                                     src="https://cdn-icons-png.flaticon.com/512/4687/4687428.png"
  //                                     alt="camera-icon"
  //                                     height={32}
  //                                     width={32}
  //                                   />
  //                                 </div>
  //                               </div>
  //                             )} */}
  //                             {field?.type == "dateSelect" && (
  //                               <DatePickerMain
  //                                 selectedDateChild={moment(field.value(formik) ?? field.default ?? new Date()).format(
  //                                   "DD/MM/yyyy"
  //                                 )}
  //                                 onDateChange={(e) =>
  //                                   formik.setFieldValue(`${field.name}`, e)
  //                                 }
  //                                 value={field.value(formik)}
  //                               />
  //                             )}
  //                             {field.type == "checkBox" && (
  //                               <input
  //                                 type={"checkbox"}
  //                                 className="bg-orange-100 border-orange-300 text-orange-800 focus:ring-0 "
  //                               />
  //                             )}
  //                             {field.type == "textArea" && (
  //                               <Field
  //                                 className="text-sm rounded-md p-1 focus:outline-none border border-gray-200"
  //                                 component="textarea"
  //                                 rows="4"
  //                                 name={field.name}
  //                               ></Field>
  //                             )}
  //                             {field.type == "checkbox" && (
  //                               <input
  //                                 className="bg-orange-100 border-orange-300 text-orange-800 focus:ring-0 cursor-pointer"
  //                                 type="checkbox"
  //                                 value={field.value(formik)}
  //                                 onChange={(e) =>
  //                                   formik.setFieldValue(
  //                                     `${field.name}`,
  //                                     e.target.value
  //                                   )
  //                                 }
  //                               />
  //                             )}
  //                             {/* {field.type == "comboBox" && (
  //                               <Combobox
  //                                 value={field.value(formik)}
  //                                 onChange={(e) => {
  //                                   formik.setFieldValue(`${field.name}`, e);
  //                                   if (field.name == "department") {
  //                                     setSelectedValues({
  //                                       department: e,
  //                                     });
  //                                   }
  //                                 }}
  //                               >
  //                                 <ComboBoxComponent
  //                                   options={field.options}
  //                                   values={field.values}
  //                                 />
  //                               </Combobox>
  //                             )} */}

  //                             {/* {field.type == "component" && (
  //                               <div className="flex flex-col justify-start text-start items-start text-sm space-y-2 w-full">
  //                                 {field.component(formik)}
  //                               </div>
  //                             )} */}

  //                             <ErrorMessage
  //                               name={field.name}
  //                               component="div"
  //                               className="text-red-700 text-xs pt-1"
  //                             />
  //                           </div>
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 </Widget>
  //               </div>
  //             ))}
  //           </div>

  //           <div className="my-2 drop-shadow-xl border border-slate-200 z-50 w-full bg-white p-2 mb-1 rounded-xl flex justify-end">
  //             <PrimaryButton
  //               type={"submit"}
  //               onClick={onSubmit}
  //               title={buttonSubmit?.title ?? `Submit`}
  //             />
  //           </div>
  //         </Form>
  //       </div>
  //     </FormikProvider>
  //   </section>
  // );
}

export default FormGeneratorV2;
