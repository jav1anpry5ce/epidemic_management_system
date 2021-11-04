import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllBatch, clearState } from "../../store/mohSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Icon, IconButton, Table, Input } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function BatchManagement() {
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
    dispatch(setActiveKey("4"));
    dispatch(getAllBatch());
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!auth.is_moh_staff && !auth.is_auth) {
      history.push("/account/login");
    }
    // eslint-disable-next-line
  }, [auth.is_auth, auth.is_moh_staff]);

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
      // const data = {
      //   id: rowData[dataKey],
      // };
    }
    return (
      <Cell {...props}>
        <IconButton
          appearance="subtle"
          onClick={handleAction}
          icon={<Icon icon="eye" />}
        />
      </Cell>
    );
  };

  const getData = () => {
    var batches = data.batches;
    if (sortColumn && sortType) {
      batches = data.batches.slice().sort((a, b) => {
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
    return batches.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };

  const filteredData = () => {
    var batches = data.batches;
    batches = batches.filter((batch) => {
      return (
        batch.location.value.toLowerCase().includes(search.toLowerCase()) ||
        batch.batch_id.includes(search) ||
        batch.vaccine.value.toLowerCase().includes(search.toLowerCase())
      );
    });
    return batches;
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
      <Grid container spacing={2}>
        <Grid item sm={12} xs={12}>
          <Card>
            <CardHeader
              style={{ backgroundColor: "#383d42" }}
              title={
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#ffff" }}
                >
                  Batches
                </Typography>
              }
            />
            <CardContent>
              <div className="d-flex justify-content-between">
                <Input
                  size="sm"
                  placeholder="Search by batch id or location"
                  onChange={(e) => setSearch(e)}
                  style={{ width: "35%" }}
                />
                <IconButton
                  icon={<PlusIcon />}
                  onClick={() => history.push("/moh/batch-creation")}
                >
                  Add A New Location Batch
                </IconButton>
              </div>
              <Table
                virtualized
                hover
                loading={data.loading ? data.loading : loading}
                height={600}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                data={data.batches ? (search ? filtered() : getData()) : []}
              >
                <Column width={340} sortable>
                  <HeaderCell>Batch ID</HeaderCell>
                  <Cell dataKey={"batch_id"} />
                </Column>
                <Column flexGrow>
                  <HeaderCell>Location</HeaderCell>
                  <Cell>{(rowData) => rowData.location.value}</Cell>
                </Column>
                <Column flexGrow>
                  <HeaderCell>Vaccine</HeaderCell>
                  <Cell>{(rowData) => rowData.vaccine.value}</Cell>
                </Column>
                <Column flexGrow>
                  <HeaderCell>Number of Doses</HeaderCell>
                  <Cell dataKey={"number_of_dose"} />
                </Column>
                <Column flexGrow sortable>
                  <HeaderCell>Status</HeaderCell>
                  <Cell dataKey={"status"} />
                </Column>
                <Column align="center">
                  <HeaderCell>Action</HeaderCell>
                  <ActionCell dataKey={"id"} />
                </Column>
              </Table>
              <Pagination
                ellipsis
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
                  data.batches
                    ? search
                      ? filteredData().length
                      : data.batches.length
                    : null
                }
                onChangePage={handlePagechange}
                onChangeLength={handleLengthChange}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={1} xs={12}></Grid>
      </Grid>
    </Container>
  );
}
