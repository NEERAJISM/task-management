import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserTask } from "../common/task";

interface TaskModalInterface {
  task: UserTask | undefined;
  show: boolean;
  onHide: () => void;
  onSave: (
    title: string,
    radioValue: string,
    description: string,
    selectedDate: Date
  ) => void;
  onDelete: (id: number) => void;
}

const TaskModal: React.FC<TaskModalInterface> = ({
  task,
  show,
  onHide,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState<string>(task ? task.title : "");
  const [description, setDescription] = useState<string>(task ? task.desc : "");
  const [selectedDate, setSelectedDate] = useState<Date>(
    task ? new Date(task.due_date) : new Date()
  );
  const [radioValue, setRadioValue] = useState(task ? task.status : "To Do");
  const [error, setError] = useState<string>("");

  const radios = [
    { name: "To Do", value: "To Do" },
    { name: "In Progress", value: "In Progress" },
    { name: "Done", value: "Done" },
  ];

  useEffect(() => {}, []);

  const handleSave = async () => {
    if (!title || !description) {
      setError("Please fill out all fields.");
    } else {
      setError("");

      if (task) {
        onDelete(task.task_id);
      }

      onSave(title, radioValue, description, selectedDate);

      resetAndHide();
    }
  };

  function resetAndHide() {
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setRadioValue("To Do");
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title> {task ? "Update " : "Create New "} Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Form>
          <Form.Group className="mt-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter description"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mt-3" controlId="dueDate">
                <Form.Label className="mr-3">Due Date &nbsp; &nbsp;</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  minDate={new Date()}
                  dateFormat="dd/MMM/yyyy"
                  onChange={(date) => setSelectedDate(date as Date)}
                  className="form-control ml-3"
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3" controlId="dueDate">
                <Form.Label className="mr-3">Status &nbsp; &nbsp;</Form.Label>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={
                        idx === 0
                          ? "outline-secondary"
                          : idx === 1
                          ? "outline-warning"
                          : "outline-success"
                      }
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetAndHide}>
          Close
        </Button>
        {task && (
          <Button
            variant="danger"
            onClick={() => {
              onDelete(task.task_id);
              resetAndHide();
            }}
          >
            Delete Task
          </Button>
        )}
        <Button variant="primary" onClick={handleSave}>
          {task ? "Update " : "Create New "} Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
