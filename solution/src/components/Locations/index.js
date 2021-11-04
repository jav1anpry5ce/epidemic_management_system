import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { locationDetails, clearState } from "../../store/mohSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { IconButton, Table, Input } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Locations() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState("asc");
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.is_moh_staff) {
      history.push("/moh/home");
    }
    dispatch(setActiveKey("5"));
    dispatch(locationDetails());
    return () => clearState();
    // eslint-disable-next-line
  }, [auth.is_moh_staff]);

  const getData = () => {
    var locations = data.locationDetails;
    if (sortColumn && sortType) {
      locations = data.locationDetails.slice().sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return locations.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };

  const filteredData = () => {
    var locations = data.locationDetails;
    locations = locations.filter((location) => {
      return (
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.parish.includes(search)
      );
    });
    return locations;
  };

  const filtered = () => {
    var f = filteredData();
    return f.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setSortColumn(sortColumn);
      setSortType(sortType);
      setLoading(false);
    }, 500);
  };

  const handlePagechange = (dataKey) => {
    setPage(dataKey);
  };

  const handleLengthChange = (dataKey) => {
    setPage(1);
    setDisplayLength(dataKey);
  };

  return (
    <Container maxWidth="lg">
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42" }}
          title={
            <Typography variant="h5" align="center" style={{ color: "#ffff" }}>
              Locations
            </Typography>
          }
        />
        <CardContent>
          <div className="d-flex justify-content-between">
            <Input
              size="sm"
              placeholder="Search by location or parish"
              onChange={(e) => setSearch(e)}
              style={{ width: "35%" }}
            />
            {auth.is_moh_admin ? (
              <IconButton
                icon={<PlusIcon />}
                onClick={() => history.push("/moh/add-location")}
              >
                Add A New Location
              </IconButton>
            ) : null}
          </div>
          <Table
            virtualized
            fluid
            hover
            height={600}
            loading={data.loading ? data.loading : loading}
            data={data.locationDetails ? (search ? filtered() : getData()) : []}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
          >
            <Column flexGrow sortable>
              <HeaderCell>Location</HeaderCell>
              <Cell dataKey={"name"} />
            </Column>
            <Column align="center" flexGrow sortable>
              <HeaderCell>Pending Appointments</HeaderCell>
              <Cell dataKey={"pending_appointments"} />
            </Column>
            <Column align="center" flexGrow>
              <HeaderCell>Vaccines In Stock</HeaderCell>
              <Cell dataKey={"number_of_vaccine"} />
            </Column>
            <Column align="center" flexGrow>
              <HeaderCell>Test Administer</HeaderCell>
              <Cell dataKey={"tests_administer"} />
            </Column>
            <Column align="center" flexGrow>
              <HeaderCell>Vaccine Administer</HeaderCell>
              <Cell dataKey={"vaccines_administer"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>City</HeaderCell>
              <Cell dataKey={"city"} />
            </Column>
            <Column flexGrow sortable>
              <HeaderCell>Parish</HeaderCell>
              <Cell dataKey={"parish"} />
            </Column>
          </Table>
          <Pagination
            style={{ height: 10 }}
            lengthMenu={[
              {
                value: 15,
                label: 15,
              },
              {
                value: 30,
                label: 30,
              },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={
              data.locationDetails
                ? search
                  ? filteredData().length
                  : data.locationDetails.length
                : null
            }
            onChangePage={handlePagechange}
            onChangeLength={handleLengthChange}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
