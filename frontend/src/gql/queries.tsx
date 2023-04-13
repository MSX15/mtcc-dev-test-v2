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
`;