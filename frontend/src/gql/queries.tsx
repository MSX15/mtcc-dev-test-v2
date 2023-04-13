import { gql } from "@apollo/client";

export const GET_LOCATIONS = gql`
query Locations
{ 
	locations {
	# locations(orderBy: "id") {
        id
        name,
        createdById,
        createdAt,
        modifiedById,
        modifiedAt
  }
}
`
export const GET_LOCATION_BY_ID = gql`
query Location($id:Int!)
{ 
	location(id: $id) {
        id
        name,
        isDeleted,
        createdById,
        createdAt,
        modifiedById,
        modifiedAt
  }
}
`