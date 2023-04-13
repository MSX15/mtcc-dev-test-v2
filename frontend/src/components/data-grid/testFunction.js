import React from "react";

export default function testFunction(cell) {
  if (cell.column.id == "name") {
    return (
      <div className="flex flex-row space-x-3 items-center">
        <img
          className="h-8 w-8 rounded-full"
          src={"https://www.mydthpay.com/img/review.png"}
        />
        <Link
          to={`/employees/view/${cell.row.values.id}`}
          className="text-orange-800 hover:cursor-pointer hover:underline"
        >
          {cell.value}
        </Link>
      </div>
    );
  } else {
    return cell.render("Cell");
  }
}
