import AppLayout from "../../layout/AppLayout";
import { useQuery } from '@apollo/client';
import { GET_LOCATIONS } from "../../gql/queries";
import { gql } from "@apollo/client";

import CardBasic from "../../components/card-basic/card-basic";
import CardLoadingGeneric from "../../components/card-loading-generic/card-loading-generic";
import { useEffect, useState } from "react";

export default function Location() {

    // const { loading, error, data } = useQuery(GET_LOCATIONS);

    // let [loadingDelay, setLoadingDelay] = useState(true);

    // useEffect(() => { setTimeout(() => {
    //     setLoadingDelay(false)
    // }, 2000); }, [])

    const { loading, error, data } = useQuery(
        gql`
        query Locations
        { 
            locations {
            # locations(orderBy: "id") {
                id
                name,
                # createdById,
                # createdAt,
                # modifiedById,
                # modifiedAt
          }
        }
        `
    );
    return(
        <AppLayout>
            <div className="h-full w-full flex flex-col">
                <h2 className="font-bold py-5 pl-5 text-4xl"> Locations </h2>
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
                    {
                        data.locations.map((x:any, i: number) => 
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