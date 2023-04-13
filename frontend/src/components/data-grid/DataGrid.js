import { useState, useEffect, useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useRowSelect,
  useMountedLayoutEffect,
} from "react-table";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideDrawer from "components/side-drawer/SideDrawer";
import { Dialog, Transition } from '@headlessui/react'
import FormGenerator from "components/form-generator/FormGenerator";
import FormGeneratorV2 from "components/form-generator/FormGeneratorV2";
import { v4 as uuidv4 } from 'uuid';
import * as Yup from "yup";
import customAxios from "middlewares/axios-interceptor/customAxios";


export const CONSTANTS =
{
  GRID_ACTION_ADD: "ADD",
  GRID_ACTION_BEGIN_EDIT: "BEGIN_EDIT",
  GRID_ACTION_SAVE: "SAVE",
  GRID_ACTION_DELETE: "DELETE",
  GRID_ACTION_CANCEL: "CANCEL",
  GRID_ACTION_ROWSINGLECLICK: "ROWSINGLECLICK",
  ACTION_ADD: "Add",
  ACTION_UPDATE: "Update",
  ACTION_DELETE: "Delete"
}



// TODO:: Grid currently implements CRUD on a remote data level, and does not necessarily reflect this in the local DATA object
// TODO:: CRUD for both remote and internal DATA obj

const Styles = styled.div`
  padding: 2rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 2rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          className="bg-orange-100 border-orange-300 text-orange-500 focus:ring-0 cursor-pointer"
          type="checkbox"
          ref={resolvedRef}
          {...rest}
        />
      </>
    );
  }
);

//TODO:: Does not close on ESC
const confirmOnDeleteDialogRenderProp = (isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen, row, onActionBegin) => {
  return (
    <Transition appear show={isDeleteConfirmationDialogOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={() => { console.log("DIALOG ON CLOSE"); setIsDeleteConfirmationDialogOpen(false); }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirmation
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the following record?
                  </p>
                </div>
                <div className="mt-2 max-h-36 bg-slate-100 rounded-lg p-2 overflow-auto">
                  <p className="font-mono text-sm text-gray-500 whitespace-pre-wrap">
                    {JSON.stringify(row, null, 2)}
                  </p>
                </div>

                <div className="flex mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => { onActionBegin({ requestType: CONSTANTS.GRID_ACTION_SAVE, action: CONSTANTS.ACTION_DELETE, entity: row }); setIsDeleteConfirmationDialogOpen(false); }}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                    onClick={() => { setIsDeleteConfirmationDialogOpen(false); }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}


const CreateUpdateRenederPropTemplate = ({ data, onActionBegin, setIsSideDrawerOpen }) => {
  let [errorMsg, setErrorMsg] = useState("");
  let [hasError, setHasError] = useState(false);

  let [remoteData, setRemoteData] = useState({});

  // console.log(remoteData)

  // ONLY ON INITIAL LOAD
  useEffect(
    () => {
      async function fetchData() {
        data.columns.forEach(
          async col => {
            if (col.formFieldProps?.values) {
              const res = await col.formFieldProps.values(customAxios);
              setRemoteData(prev => { let newState = { ...prev }; newState[col.accessor] = res; return newState; })
            }
          }
        )
      }
      fetchData()
    }
    , []
  )

  const formTemplate =
  {
    contents:
      [
        {
          heading: data.header ?? "Header Not Set",
          description: `Complete the follwing information`,
          fields: data.columns.map
            (
              x => {
                let formFieldProps = { ...x.formFieldProps };

                formFieldProps.name = x.accessor;
                formFieldProps.displayName ??= x.Header;
                formFieldProps.type ??= "field"
                formFieldProps.inputType ??= "text"
                formFieldProps.values && (formFieldProps.values = remoteData[x.accessor] ?? [])

                // Wait should'nt the follwing "x.accessor" not be in a string? It works somehow
                // formFieldProps.value = (formik) => formik.values["x.accessor"]
                // formFieldProps.value = (formik) => formik.values[x.accessor]
                formFieldProps.value ??= (formik) => formik.values[x.accessor]

                return ({
                  ...formFieldProps,
                })
              }
            )
        }
      ],
    initialValues:
      data.previousEntity
        ? { ...data.previousEntity }
        : data.columns.reduce((accu, next) => { accu[next.accessor] = next.formFieldProps?.initialValue ? next.formFieldProps.initialValue(customAxios) : ""; return accu; }, {}),
    // initialValues: {},
    validationSchema: Yup.object().shape(data.columns.reduce((accu, next) => { next.formFieldProps?.validation && (accu[next.accessor] = next.formFieldProps.validation(Yup)); return accu; }, {})),
    // validationSchema:
    //   Yup.object().shape
    //     (
    //       data.columns
    //         .filter(x => x.required)
    //         .reduce((accu, next) => { accu[next.accessor] = Yup.string().required(`${next.displayName} is required`); return accu; }, {})
    //     ),
    onSubmit: async (
      values,
      { setSubmitting, setErrors, setStatus, resetForm, handleSubmit }
    ) => {
      console.log("GRID INTERNAL AUT FORM SUBMIT", values);
      onActionBegin(values)
      setIsSideDrawerOpen(false)
    }
  }

  let STATIC_errorMsg = "TEST";
  let STATIC_hasError = false;


  // const addFormDataTemplate =
  // {
  //   contents:
  //     [
  //       {
  //         heading: data.header ?? "Header Not Set",
  //         description: `Complete the follwing information`,
  //         fields: data.columns.map
  //           (
  //             x => {
  //               let formFieldProps = { ...x.formFieldProps };
  //               formFieldProps.name = x.accessor;
  //               formFieldProps.displayName ??= x.Header;
  //               formFieldProps.type ??= "field"
  //               formFieldProps.type = formFieldProps.type === "comboBox" ? "field" : formFieldProps.type;
  //               formFieldProps.inputType ??= "text"
  //               formFieldProps.value = (formik) => formik.values["x.accessor"]

  //               return ({
  //                 ...formFieldProps,
  //                 // type: x.type ?? "field",
  //                 // inputType: x.inputType ?? "text",
  //                 // required: x.required,
  //                 // Wait should'nt the follwing "x.accessor" not be in a string? It works somehow
  //               })
  //             }
  //           )
  //       }
  //     ],
  //   initialValues:
  //     data.previousEntity
  //       ? { ...data.previousEntity }
  //       : data.columns.reduce((accu, next) => { accu[next.accessor] = ""; return accu; }, {}),
  //   // initialValues: {},
  //   validationSchema: Yup.object().shape(data.columns.reduce((accu, next) => { next.formFieldProps?.validation && (accu[next.accessor] = next.formFieldProps.validation(Yup)); return accu; }, {})),
  //   // validationSchema:
  //   //   Yup.object().shape
  //   //     (
  //   //       data.columns
  //   //         .filter(x => x.required)
  //   //         .reduce((accu, next) => { accu[next.accessor] = Yup.string().required(`${next.displayName} is required`); return accu; }, {})
  //   //     ),
  //   onSubmit: async (
  //     values,
  //     { setSubmitting, setErrors, setStatus, resetForm, handleSubmit }
  //   ) => {
  //     console.log("GRID INTERNAL SAVE ADD EDIT", values);
  //     console.log("HEREHEREHERE")
  //     onActionBegin(values)
  //     setIsSideDrawerOpen(false)
  //   }
  // }

  return (
    <div key={uuidv4()}>
      <FormGenerator
        ErrorMsg={STATIC_errorMsg}
        isError={STATIC_hasError}
        height={""}
        buttonSubmit={{ title: `Submit` }}
        formData={formTemplate}
      />
    </div>
  );
}


const CreateUpdateRenederPropTemplateV2 = ({ data, onActionBegin, setIsSideDrawerOpen }) => {
  let [errorMsg, setErrorMsg] = useState("");
  let [hasError, setHasError] = useState(false);

  let [remoteData, setRemoteData] = useState({});

  // console.log(remoteData)

  // ONLY ON INITIAL LOAD
  useEffect(
    () => {
      async function fetchData() {
        data.columns.forEach(
          async col => {
            if (col.formFieldProps?.values) {
              const res = await col.formFieldProps.values(customAxios);
              setRemoteData(prev => { let newState = { ...prev }; newState[col.accessor] = res; return newState; })
            }
          }
        )
      }
      fetchData()
    }
    , []
  )

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> Grid Form Data Columns", data.columns)
  const formTemplateV2 =
  {
    //Need to fix where to look for the label in FormGeneratorV2
    fields: data.columns.map(x => {
      const formFieldProps = x.formFieldProps ?? {};
      formFieldProps.name ??= x.accessor;
      formFieldProps.label ??= x.Header;
      formFieldProps.fieldProps ??= {};
      formFieldProps.fieldProps.label ??= x.Header;


      data.previousEntity && (formFieldProps.initialValue = () => data.previousEntity[formFieldProps.name])
      // initialValues:
      // data.previousEntity
      //   ? { ...data.previousEntity }
      //   : data.columns.reduce((accu, next) => { accu[next.accessor] = next.formFieldProps?.initialValue ? next.formFieldProps.initialValue(customAxios) : ""; return accu; }, {})


      return formFieldProps;
    }
    ),
    onSubmit: async (
      values,
      { setSubmitting, setErrors, setStatus, resetForm, handleSubmit }
    ) => {
      const valuesPayload = { ...(data.previousEntity ?? {}), ...values }
      console.log("GRID INTERNAL AUT FORM SUBMIT", valuesPayload);
      onActionBegin(valuesPayload)
      setIsSideDrawerOpen(false)
    }
  }

  // const formTemplate =
  // {
  //   contents:
  //     [
  //       {
  //         heading: data.header ?? "Header Not Set",
  //         description: `Complete the follwing information`,
  //         fields: data.columns.map
  //           (
  //             x => {
  //               let formFieldProps = { ...x.formFieldProps };

  //               formFieldProps.name = x.accessor;
  //               formFieldProps.displayName ??= x.Header;
  //               formFieldProps.type ??= "field"
  //               formFieldProps.inputType ??= "text"
  //               formFieldProps.values && (formFieldProps.values = remoteData[x.accessor] ?? [])

  //               // Wait should'nt the follwing "x.accessor" not be in a string? It works somehow
  //               // formFieldProps.value = (formik) => formik.values["x.accessor"]
  //               // formFieldProps.value = (formik) => formik.values[x.accessor]
  //               formFieldProps.value ??= (formik) => formik.values[x.accessor]

  //               return ({
  //                 ...formFieldProps,
  //               })
  //             }
  //           )
  //       }
  //     ],
  //   initialValues:
  //     data.previousEntity
  //       ? { ...data.previousEntity }
  //       : data.columns.reduce((accu, next) => { accu[next.accessor] = next.formFieldProps?.initialValue ? next.formFieldProps.initialValue(customAxios) : ""; return accu; }, {}),
  //   // initialValues: {},
  //   validationSchema: Yup.object().shape(data.columns.reduce((accu, next) => { next.formFieldProps?.validation && (accu[next.accessor] = next.formFieldProps.validation(Yup)); return accu; }, {})),
  //   // validationSchema:
  //   //   Yup.object().shape
  //   //     (
  //   //       data.columns
  //   //         .filter(x => x.required)
  //   //         .reduce((accu, next) => { accu[next.accessor] = Yup.string().required(`${next.displayName} is required`); return accu; }, {})
  //   //     ),
  //   onSubmit: async (
  //     values,
  //     { setSubmitting, setErrors, setStatus, resetForm, handleSubmit }
  //   ) => {
  //     console.log("GRID INTERNAL AUT FORM SUBMIT", values);
  //     onActionBegin(values)
  //     setIsSideDrawerOpen(false)
  //   }
  // }

  let STATIC_errorMsg = "TEST";
  let STATIC_hasError = false;


  // const addFormDataTemplate =
  // {
  //   contents:
  //     [
  //       {
  //         heading: data.header ?? "Header Not Set",
  //         description: `Complete the follwing information`,
  //         fields: data.columns.map
  //           (
  //             x => {
  //               let formFieldProps = { ...x.formFieldProps };
  //               formFieldProps.name = x.accessor;
  //               formFieldProps.displayName ??= x.Header;
  //               formFieldProps.type ??= "field"
  //               formFieldProps.type = formFieldProps.type === "comboBox" ? "field" : formFieldProps.type;
  //               formFieldProps.inputType ??= "text"
  //               formFieldProps.value = (formik) => formik.values["x.accessor"]

  //               return ({
  //                 ...formFieldProps,
  //                 // type: x.type ?? "field",
  //                 // inputType: x.inputType ?? "text",
  //                 // required: x.required,
  //                 // Wait should'nt the follwing "x.accessor" not be in a string? It works somehow
  //               })
  //             }
  //           )
  //       }
  //     ],
  //   initialValues:
  //     data.previousEntity
  //       ? { ...data.previousEntity }
  //       : data.columns.reduce((accu, next) => { accu[next.accessor] = ""; return accu; }, {}),
  //   // initialValues: {},
  //   validationSchema: Yup.object().shape(data.columns.reduce((accu, next) => { next.formFieldProps?.validation && (accu[next.accessor] = next.formFieldProps.validation(Yup)); return accu; }, {})),
  //   // validationSchema:
  //   //   Yup.object().shape
  //   //     (
  //   //       data.columns
  //   //         .filter(x => x.required)
  //   //         .reduce((accu, next) => { accu[next.accessor] = Yup.string().required(`${next.displayName} is required`); return accu; }, {})
  //   //     ),
  //   onSubmit: async (
  //     values,
  //     { setSubmitting, setErrors, setStatus, resetForm, handleSubmit }
  //   ) => {
  //     console.log("GRID INTERNAL SAVE ADD EDIT", values);
  //     console.log("HEREHEREHERE")
  //     onActionBegin(values)
  //     setIsSideDrawerOpen(false)
  //   }
  // }

  return (
    // <div key={uuidv4()}>
    //   <FormGenerator
    //     ErrorMsg={STATIC_errorMsg}
    //     isError={STATIC_hasError}
    //     height={""}
    //     buttonSubmit={{ title: `Submit` }}
    //     formData={formTemplate}
    //   />
    // </div>
    <div key={uuidv4()}>
      <FormGeneratorV2
        header={data.header}
        subHeader={"Complete the following info"}
        fields={formTemplateV2.fields}
        onSubmit={formTemplateV2.onSubmit}
      />
    </div>
  );
}
export default function DataGrid({
  header,
  cellFunction,
  columns,
  gridEditColumns,
  testData,
  setData,
  setSelectedRow,
  setSelectedRows,
  selectedRow,
  onRowDoubleClick,
  selected,
  setIsOpen,
  height,
  showVerticalDividers,
  path,
  selectable,
  search,
  showHeader,
  preSelectedItems,
  alignRow,
  alignHeader,
  allowAdd,
  // addRenderProp = (setIsSideDrawerOpen) => (<div>ADD RENDER PROP NOT SET</div>),
  addRenderProp,
  allowEdit,
  // editRenderProp = (setIsSideDrawerOpen, editRow) => (<div className="flex flex-col overflow-auto"><div>EDIT RENDER PROP NOT SET</div><div>ROW DATA</div><div className="whitespace-pre font-mono">{JSON.stringify(editRow, null, 2)}</div></div>),
  editRenderProp,
  allowEditRowOnDoubleClick,
  allowDelete,
  confirmOnDelete = true,
  onActionBegin = () => { },
  onActionComplete
}) {

  let [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  let [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  let [isDrawerAddNotEdit, setIsDrawerAddNotEdit] = useState(false);
  let [editRow, setEditRow] = useState({});

  // const templateFromFields =
  //   [
  //     {
  //       name: "name",
  //       displayName: "Name",
  //       type: "field",
  //       inputType: "text",
  //       required: true,
  //       value: (formik) => {
  //         // setSelectedEmployee(formik.values.employee);
  //         return formik.values.name;
  //       }
  //     },
  //     {
  //       name: "description",
  //       displayName: "Description",
  //       type: "field",
  //       inputType: "text",
  //       required: true,
  //       value: (formik) => {
  //         // setSelectedEmployee(formik.values.employee);
  //         return formik.values.description;
  //       }
  //     }
  //   ];

  // const mappedFormFields =
  //   createUpdateColumns.map
  //     (
  //       x =>
  //       ({
  //         name: x.accessor,
  //         displayName: x.Header,
  //         type: "field",
  //         inputType: "text",
  //         required: true,
  //         value: (formik) => formik.values["x.accessor"]
  //       })
  //     );





  // console.log("TEMPLATE FIELDS", templateFromFields)
  // console.log("MAPPED FORM FIELDS", mappedFormFields)



  const onRowDoubleClickEdit = (row, e) => {
    console.log("ROW DOUBLE CLICK EDIT", row);
    setEditRow(row);
    setIsDrawerAddNotEdit(false);
    // Put this to a new variable?
    setIsSideDrawerOpen(true);
  }

  const onClickGridCommandAdd = (e) => {
    console.log("GRID ADD");
    // Put this to a new variable?
    setIsDrawerAddNotEdit(true);
    setIsSideDrawerOpen(true);
  }

  const onClickRowCommandEdit = (row, e) => {
    console.log("GRID ROW EDIT", row);
    setEditRow(row);
    // Put this to a new variable?
    setIsDrawerAddNotEdit(false);
    setIsSideDrawerOpen(true);
  }

  const onClikcRowCommandDelete = (row, e) => {
    setEditRow(row)
    console.log("GRID ROW DELETE", row);
    confirmOnDelete ? setIsDeleteConfirmationDialogOpen(true) : onActionBegin({ requestType: CONSTANTS.GRID_ACTION_SAVE, action: CONSTANTS.ACTION_DELETE, entity: row });
  }


  const handleSelectedRows = () => {
    return preSelectedItems ?? {};
  };

  let navigate = useNavigate();
  let data = testData;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data: testData,
      initialState: {
        pageIndex: 0,
        pageSize: 200,
        selectedRowIds: handleSelectedRows(),
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useRowSelect,
    (hooks) => {
      if (selectable) {
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",

            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox

            Header: ({ getToggleAllRowsSelectedProps }) => {
              if (selectable) {
                return (
                  <div>
                    <IndeterminateCheckbox
                      {...getToggleAllRowsSelectedProps()}
                    />
                  </div>
                );
              }
            },

            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  const spring = React.useMemo(
    () => ({
      type: "spring",
      damping: 50,
      stiffness: 100,
    }),
    []
  );

  const { globalFilter } = state;

  async function rowSelectHandler(row) {
    if (selectable) {
      navigate(path + row.original.id);
    }
    setSelectedRow && setSelectedRow(row.original);
    setSelectedRows && await setSelectedRows(selectedFlatRows);
  }

  return (
    <div className={"flex flex-col h-full"}>
      {
        (allowAdd || allowEdit) &&
        <SideDrawer SideDrawer
          isOpen={isSideDrawerOpen}
          isOpenChanged={setIsSideDrawerOpen}
          onOpen={() => { console.log("I OPEN INTERNAL") }}
          onClose={() => { console.log("I CLOSE INTERNAL") }}
        >
          {
            isDrawerAddNotEdit
              ? addRenderProp
                ? addRenderProp(setIsSideDrawerOpen)
                // : CreateUpdateRenederPropTemplate({ header: header, columns: createUpdateColumns }, onActionBegin, setIsSideDrawerOpen)
                : <CreateUpdateRenederPropTemplateV2
                  data={
                    {
                      header: `Add ${header ?? "Entity"}`,
                      columns: columns.filter(x => !x.hideOnAdd)
                    }
                  }
                  onActionBegin={
                    (entityValues) => onActionBegin(
                      {
                        requestType: CONSTANTS.GRID_ACTION_SAVE,
                        action: CONSTANTS.ACTION_ADD,
                        entity: entityValues,
                        previousEntity: {}
                      }
                    )
                  }
                  setIsSideDrawerOpen={setIsSideDrawerOpen}
                />
              : editRenderProp
                ? editRenderProp(setIsSideDrawerOpen, editRow)
                : <CreateUpdateRenederPropTemplateV2
                  data={
                    {
                      header: `Update ${header ?? "Entity"}`,
                      columns: columns.filter(x => !x.hideOnEdit),
                      previousEntity: editRow
                    }
                  }
                  onActionBegin={
                    (entityValues) => onActionBegin(
                      {
                        requestType: CONSTANTS.GRID_ACTION_SAVE,
                        action: CONSTANTS.ACTION_UPDATE,
                        entity: entityValues,
                      }
                    )
                  }
                  setIsSideDrawerOpen={setIsSideDrawerOpen}
                />
          }
        </SideDrawer>
      }

      {
        allowDelete && confirmOnDelete &&
        confirmOnDeleteDialogRenderProp(isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen, editRow, onActionBegin)
        // <Transition show={isDeleteConfirmationDialogOpen} as={Fragment}>
        //   <Dialog onClose={() => setIsDeleteConfirmationDialogOpen(false)}>
        //     {/*
        //       Use one Transition.Child to apply one transition to the backdrop...
        //     */}
        //     <Transition.Child
        //       as={Fragment}
        //       enter="ease-out duration-300"
        //       enterFrom="opacity-0"
        //       enterTo="opacity-100"
        //       leave="ease-in duration-200"
        //       leaveFrom="opacity-100"
        //       leaveTo="opacity-0"
        //     >
        //       <div className="fixed inset-0 bg-black/30" />
        //     </Transition.Child>

        //     {/*
        //       ...and another Transition.Child to apply a separate transition
        //       to the contents.
        //     */}
        //     <Transition.Child
        //       as={Fragment}
        //       enter="ease-out duration-300"
        //       enterFrom="opacity-0 scale-95"
        //       enterTo="opacity-100 scale-100"
        //       leave="ease-in duration-200"
        //       leaveFrom="opacity-100 scale-100"
        //       leaveTo="opacity-0 scale-95"
        //     >
        //       <Dialog.Panel>
        //         <Dialog.Title>Deactivate account</Dialog.Title>

        //         {/* ... */}
        //       </Dialog.Panel>
        //     </Transition.Child>
        //   </Dialog>
        // </Transition>
        // <Dialog
        //   open={isDeleteConfirmationDialogOpen}
        //   onClose={() => setIsDeleteConfirmationDialogOpen(false)}
        //   className="relative z-[1000]"
        // >
        //   {/* The backdrop, rendered as a fixed sibling to the panel container */}
        //   <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        //   {/* Full-screen container to center the panel */}
        //   <div className="fixed inset-0 flex items-center justify-center p-4">
        //     {/* The actual dialog panel  */}
        //     <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
        //       <Dialog.Title>Complete your order</Dialog.Title>

        //       {/* ... */}
        //     </Dialog.Panel>
        //   </div>
        // </Dialog>
      }

      <div className="flex items-center">

        <div className="flex gap-2">
          {allowAdd &&
            <div
              className="flex items-center bg-slate-100 hover:bg-slate-200 hover:cursor-pointer border-2 border-slate-200 hover:border-slate-300 rounded-lg p-2"
              onClick={(e) => { console.log("GRID INTERNAL ADD"); onClickGridCommandAdd(e); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="ml-2 text-xs font-semibold">Add Record</span>
            </div>
          }
        </div>


        {search && (
          <div className="search-container ml-auto">
            <input
              className="w-96 p-1 my-2 rounded-xl  focus:outline-none focus:ring-orange-500 pl-2 text-sm border border-slate-300"
              type="text"
              placeholder="Search"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        )}
      </div>




      <div className={"flex-grow h-min-0 overflow-auto"}>
        <table className={""} {...getTableProps()}>
          {showHeader && (
            <thead className="">
              {headerGroups.map((headerGroup) => (
                <tr className={`${showVerticalDividers && "divide-x"} `} {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.filter(x => !x.hideOnGrid).map((column) => (
                      <th
                        className={`text-xs whitespace-nowrap p-0 pl-1 pt-3 bg-white z-[1] font-bold sticky top-0 ${alignHeader == "center" ? "text-center " : "text-left"
                          } w-fit`}
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        <span
                          className={`py-2 ${alignHeader == "center" ? "text-center " : "text-left"
                            }`}
                        >
                          {column.render("Header")}
                        </span>
                        <div className="border-b-2 border-gray-300 pt-1"></div>
                      </th>
                    ))
                  }
                  {
                    (allowEdit || allowDelete) &&
                    <th
                      className={`text-xs whitespace-nowrap p-0 pr-1 pt-3 bg-white z-[1] font-bold sticky top-0 text-right w-fit`}
                    >
                      Commands
                      <div className="border-b-2 border-gray-300 pt-1"></div>
                    </th>
                  }
                </tr>
              ))}
            </thead>
          )}

          <tbody className="divide-y" {...getTableBodyProps()}>
            <AnimatePresence>
              {rows.filter(x => !x.hideOnGrid).map((row, i) => {
                prepareRow(row);
                return (
                  <motion.tr
                    key={row.id ?? i}
                    onClick={() => {
                      onActionBegin({ requestType: CONSTANTS.GRID_ACTION_ROWSINGLECLICK, entity: row.original });
                      rowSelectHandler(row);
                    }}
                    className={`
                    ${showVerticalDividers && "divide-x"}  
                    ${selectedRow == row.original ? "bg-slate-100" : ""}
                    ${selectedFlatRows.includes(row.values) ? "bg-orange-100" : ""}
                    pb-1 hover:bg-slate-50 cursor-pointer
                  `}
                    {...row.getRowProps({
                      layouttransition: spring,
                      // layoutTransition: spring,
                      exit: { opacity: 0, maxHeight: 0 },
                      enter: { opacity: 0, maxHeight: 0 },
                    })}
                    // Currently double click is most functionally reserved for editing items in grid
                    onDoubleClick={(e) => { console.log("ROW DBL CLICK", row); allowEditRowOnDoubleClick ? onRowDoubleClickEdit(row.original, e) : onRowDoubleClick && onRowDoubleClick(row.original, e) }}
                  >
                    {
                      row.cells.map((cell) => {
                        return (
                          <td
                            className={`${alignRow == "center" ? "text-center" : ""
                              }`}
                            {...cell.getCellProps()}
                          >
                            {cellFunction(cell)}
                          </td>
                        );
                      })
                    }
                    {
                      (allowEdit || allowDelete) &&
                      (
                        <td
                          className="flex justify-end gap-1"
                        >
                          {allowEdit &&
                            <div
                              className="flex items-center hover:bg-slate-200 hover:cursor-pointer rounded-lg p-2"
                              onClick={(e) => { console.log("GRID INTERNAL EDIT"); onClickRowCommandEdit(row.original); e.stopPropagation(); }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </div>
                          }
                          {allowDelete &&
                            <div
                              className="flex items-center hover:bg-slate-200 hover:cursor-pointer rounded-lg p-2"
                              onClick={(e) => { console.log("GRID INTERNAL DELETE"); onClikcRowCommandDelete(row.original); e.stopPropagation(); }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#d00" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>

                            </div>
                          }
                        </td>
                      )
                    }
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {/* <p>Selected Rows: {Object.keys(selectedRowIds).length}</p> */}
        {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre> */}
      </div>
    </div >
  );
}
