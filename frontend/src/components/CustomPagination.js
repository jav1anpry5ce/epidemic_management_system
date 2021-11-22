import React from "react";
import { Pagination } from "rsuite";

export default function CustomPagination({ pages, activePage, paginate }) {
  function handelSelect(e) {
    paginate(e);
  }
  return (
    <Pagination
      first
      last
      prev
      next
      ellipsis
      boundaryLinks
      pages={pages}
      maxButtons={5}
      activePage={activePage}
      onSelect={handelSelect}
    />
  );
}
