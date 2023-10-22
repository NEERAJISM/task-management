import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";
import { UserTask } from "../common/task";
import TaskModal from "../components/TaskModal";
import { getDateString } from "../common/utils";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const isDesktop = window.innerWidth > 768;
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState<UserTask | undefined>();

  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [displayTasks, setDisplayTasks] = useState<UserTask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterCriteria, setFilterCriteria] = useState("All");
  const [sortingCriteria, setSortingCriteria] = useState("Due Date (Near)");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const token = await localStorage.getItem("token");

    axios
      .get("http://localhost:3001/api/fetch/test_user", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setTasks(response.data);
        reArrangeTasks(
          response.data,
          searchTerm,
          filterCriteria,
          sortingCriteria
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  async function signout() {
    const token = await localStorage.removeItem("token");
    navigate("/");
  }

  const handleSave = async (
    title: string,
    radioValue: string,
    description: string,
    selectedDate: Date
  ) => {
    try {
      const token = await localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/api/new",
        {
          userid: "test_user",
          title: title,
          status: radioValue,
          desc: description,
          duedate: selectedDate,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      fetchTasks();
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await localStorage.getItem("token");

      await axios.delete("http://localhost:3001/api/delete/" + id, {
        headers: {
          Authorization: token,
        },
      });
      fetchTasks();
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  function reArrangeTasks(
    reArrangeTasks: UserTask[],
    searchTerm: string,
    filterCriteria: string,
    sortingCriteria: string
  ) {
    // search + type filter
    var d = reArrangeTasks.filter((task) => {
      if (
        searchTerm.trim() != "" &&
        task.title.toUpperCase().indexOf(searchTerm.trim().toUpperCase()) === -1
      ) {
        return;
      }

      if (filterCriteria === "All" || task.status === filterCriteria) {
        return task;
      }
    });

    // sort
    d.sort((a, b) => {
      if (sortingCriteria === "Due Date (Near)") {
        if (a.due_date > b.due_date) {
          return 1;
        }
        return -1;
      } else if (sortingCriteria === "Due Date (Far)") {
        if (a.due_date > b.due_date) {
          return -1;
        }
        return 1;
      } else if (sortingCriteria === "Title (A-Z)") {
        if (a.title > b.title) {
          return 1;
        }
        return -1;
      } else {
        if (a.title > b.title) {
          return -1;
        }
        return 1;
      }
    });

    return setDisplayTasks(d);
  }

  return (
    <Container
      style={{
        backgroundColor: "#ebedeb",
        width: isDesktop ? "60%" : "100%",
        height: "100vh",
      }}
    >
      <Row className="py-4">
        <Col xs={0} md={3} />
        <Col xs={8} md={6}>
          <h1 style={{ display: "block", margin: "auto", textAlign: "center" }}>
            Task Management
          </h1>
        </Col>
        <Col xs={4} md={3} className={isDesktop ? "mt-2" : ""}>
          <Button
            style={{ display: "block", margin: "auto" }}
            variant="danger"
            aria-label="signout"
            onClick={() => {
              signout();
            }}
          >
            Signout
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={3} />
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                reArrangeTasks(
                  tasks,
                  e.target.value,
                  filterCriteria,
                  sortingCriteria
                );
              }}
            />
          </Form.Group>
        </Col>
        <Col md={3} />
      </Row>

      <Row className="mt-3">
        <Col xs={0} md={3} />
        <Col xs={6} md={3}>
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              Status : {filterCriteria}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setFilterCriteria("All");
                  reArrangeTasks(tasks, searchTerm, "All", sortingCriteria);
                }}
              >
                All
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilterCriteria("To Do");
                  reArrangeTasks(tasks, searchTerm, "To Do", sortingCriteria);
                }}
              >
                To Do
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilterCriteria("In Progress");
                  reArrangeTasks(
                    tasks,
                    searchTerm,
                    "In Progress",
                    sortingCriteria
                  );
                }}
              >
                In Progress
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setFilterCriteria("Done");
                  reArrangeTasks(tasks, searchTerm, "Done", sortingCriteria);
                }}
              >
                Done
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={6} md={3}>
          <Dropdown style={{ float: "right" }}>
            <Dropdown.Toggle variant="success">
              Sort by: {sortingCriteria}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setSortingCriteria("Due Date (Near)");
                  reArrangeTasks(
                    tasks,
                    searchTerm,
                    filterCriteria,
                    "Due Date (Near)"
                  );
                }}
              >
                Due Date (Near)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortingCriteria("Due Date (Far)");
                  reArrangeTasks(
                    tasks,
                    searchTerm,
                    filterCriteria,
                    "Due Date (Far)"
                  );
                }}
              >
                Due Date (Far)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortingCriteria("Title (A-Z)");
                  reArrangeTasks(
                    tasks,
                    searchTerm,
                    filterCriteria,
                    "Title (A-Z)"
                  );
                }}
              >
                Title (A-Z)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSortingCriteria("Title (Z-A)");
                  reArrangeTasks(
                    tasks,
                    searchTerm,
                    filterCriteria,
                    "Title (Z-A)"
                  );
                }}
              >
                Title (Z-A)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3} />
      </Row>
      <Row className="mt-5">
        <Col md={3} />
        <Col md={6}>
          <div style={{ height: "70vh", overflowY: "scroll", padding: "10" }}>
            {displayTasks.length === 0 ? (
              <h3 style={{ textAlign: "center" }}>No Tasks Found</h3>
            ) : (
              displayTasks.map((task, index) => (
                <Card
                  key={index}
                  className="mb-3"
                  onClick={() => {
                    setSelectedTask(task);
                    setModalShow(true);
                  }}
                >
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.desc}</Card.Text>
                    <Badge
                      bg={
                        task.status === "To Do"
                          ? "secondary"
                          : task.status === "In Progress"
                          ? "warning"
                          : "success"
                      }
                    >
                      {task.status}
                    </Badge>

                    <Badge
                      bg="primary"
                      style={{ marginLeft: "10px", float: "right" }}
                    >
                      {getDateString(task.due_date)}
                    </Badge>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
        <Col md={3} />
      </Row>
      <Button
        variant="success"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 30,
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => {
          setSelectedTask(undefined);
          setModalShow(true);
        }}
      >
        <AddIcon />
        &nbsp; Create New Task
      </Button>

      {modalShow && (
        <TaskModal
          task={selectedTask}
          show={modalShow}
          onHide={() => setModalShow(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
};

export default Home;
