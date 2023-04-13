import AppLayout from "../../layout/AppLayout";
import { useQuery } from '@apollo/client';
import { GET_LOCATIONS } from "../../gql/queries";
import { gql } from "@apollo/client";

import CardBasic from "../../components/card-basic/card-basic";
import CardLoadingGeneric from "../../components/card-loading-generic/card-loading-generic";
import { useEffect, useState } from "react";
import SideDrawer from "../../components/side-drawer/SideDrawer";
import ButtonAddBasic from "../../components/button-basic/button-add-basic";
import TextField from "../../components/form-generator/FormFieldComponents/FormGeneratorV2Components/TextField";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';





const TripForm = () => {
    return (
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '' }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" type="text" />
          <ErrorMessage name="firstName" />
  
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" type="text" />
          <ErrorMessage name="lastName" />
  
          <label htmlFor="email">Email Address</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" />
  
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );
  };

export default function Trip() {

    // const { loading, error, data } = useQuery(GET_LOCATIONS);

    // let [loadingDelay, setLoadingDelay] = useState(true);

    // useEffect(() => { setTimeout(() => {
    //     setLoadingDelay(false)
    // }, 2000); }, [])

    let [argLatestDepartureTime, setArgLatestDepartureTime] = useState("2023-04-08")

    let [ isAddSideDrawerOpen, setIsAddSideDrawerOpen ] = useState(false)
    const { loading, error, data } = useQuery(
        gql`
        query Trips($args: TripFilter)
        { 
            trips(tripFilter: $args) {
            id,
            tripRequestId,
            fromLocationId,
            toLocationId,
            departureTime,
            arrivalTime,
            peopleCapacity,
            peopleCapacityRemaining,
            cargoWeightCapacity,
            cargoWeightCapacityRemaining,
            statusId
            tripStatus : status{ name }
            createdById,
            createdAt,
            modifiedById,
            modifiedAt,
            # tripRequest{
            #   id,
            #   createdBy{
            #     name
            #   }
            # }
            # tripTickets{
            #   person{
            #     name
            #   }
            #   cargo{
            #     cargoWeight
            #   }
            # }
            # status{
            #   id,
            #   name
            # }
            # createdBy{
            #   id,
            #   name,
            # }
            # modifiedBy{
            #   id,
            #   name
            # }
          }
        }
        `,
        {
            variables:
            {
                "args": {
                    "statusId": null,
                    "latestDeparture": "2023-04-08",
                    "earliestDeparture": null,
                    "earliestArrival": null,
                    "latestArrival": null,
                    "fromLocationId": 2,
                    "toLocationId": 4,
                    "fromLocationAtoLocationB":
                    {
                        "fromLocationId": 1,
                        "toLocationId": 4
                    }
                }
            }
        }
    );


    console.log(data)
    return(
        <AppLayout>
            <div className="h-full w-full flex flex-col">
                <SideDrawer
                    isOpen={isAddSideDrawerOpen}
                    isOpenChanged={setIsAddSideDrawerOpen}
                >
                    <div className="h-full w-full p-3">
                        <h3 className="text-lg font-bold"> Add New Trip</h3>
                        <TripForm />
                    </div>
                </SideDrawer>
                <h2 className="font-bold py-5 pl-5 text-4xl"> Trips </h2>
                <div className="flex-grow min-h-0 overflow-auto whitespace-pre">
                {
                    // (loading || loadingDelay)
                    (loading)
                    ? 
                    <div className="flex flex-col gap-3 px-4">
                        <CardLoadingGeneric />
                        <CardLoadingGeneric />
                        <CardLoadingGeneric />
                        <CardLoadingGeneric />
                    </div>
                    // : JSON.stringify(data, null, 2)
                    :
                    <div className="flex flex-col gap-3 px-4 my-4">
                        <ButtonAddBasic label="Add Trip"
                            onClick={() => { setIsAddSideDrawerOpen(true) }}
                        />
                        {
                            data.trips.map((x:any, i: number) => 
                                <CardBasic key={i} header="name" entity={x} />    
                            )
                        }
                    </div>
                }
                    
                    {/* {JSON.stringify(error)}
                    {JSON.stringify(loading)} */}
                </div>
            </div>
        </AppLayout>
  ) 
}