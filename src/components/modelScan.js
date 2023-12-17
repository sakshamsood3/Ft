import React,{useEffect, useState} from 'react'
import { createTransaction } from "API";
import {
    Badge,
    Modal,
    Button,
    Card,
    Form,
    ProgressBar,
    Container,
    Row,
    Col,
  } from "react-bootstrap";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import DatePicker from "react-datepicker";

export default function modelScan(props) {
  const [newName, setNewName] = useState(props.apiResp.org);
  const [newCategory, setNewCategory] = useState(props.apiResp.category);
  const [newAmount, setNewAmount] = useState(props.amount);
  const history=useHistory()
  const [newDate, setNewDate] = useState(new Date());
  const [newPaymentMode, setNewPaymentMode] = useState("Cash");
  const transactionData = {
    name: newName, category: newCategory, amount: props.amount, date: newDate, paymentMode: newPaymentMode
  }
  const newTransaction = (e) => {
    e.preventDefault()
    createTransaction(transactionData).then(async res => {
      props.closeModel()
      history.push("/admin/dashboard")
    }).catch(e => console.log(e.message))
  }


  var curr = new Date();
  curr.setDate(curr.getDate());
  var date = new Date().toISOString().substring(0,10);
  
    return (
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
          <span className="h3 b2">Add New Transaction</span>
      </Modal.Header>
      <Modal.Body>
        <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Row>
                  <Col>
                    <Form.Control placeholder="Name of the Transaction"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridNum">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter the Amount"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridCat">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="Entertainment" >Entertainment</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Transport">Transport</option>
                    <option value="Home utility">Home utility</option>
                    <option value="Miscellaneous" >Miscellaneous</option>
                  </Form.Control>
                </Form.Group>
                {/* <Form.Group as={Col}>
                  <Form.Label>Mode of Payment</Form.Label>
                  <Form.Control as="select"
                    onChange={(e) => setNewPaymentMode(e.target.value)}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="credit card">Credit Card</option>
                    <option value="debit card">Debit Card</option>
                    <option value="cash">Cash</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="UPI">UPI</option>
                    <option value="net banking">Net Banking</option>
                    <option value="others">Others</option>
                  </Form.Control>
                </Form.Group> */}
                <Form.Group>
                  <label>Date</label>
                  <Form.Control
                    placeholder="Date"
                    type="date"
                    defaultValue={date}
                    onChange={e => {
                      console.log(e.target.valueAsDate)
                      debugger
                      setNewDate(e.target.valueAsDate)}}
                  ></Form.Control>
                </Form.Group>
              </Form.Row>

              <Button  className="btn-fill pull-right" variant="success" 
              onClick={newTransaction}
              >
                Add
              </Button>
              <Button  className="btn-fill pull-right ml-2" variant="info" 
              onClick={props.closeModel}
              >
                Close
              </Button>

              <br />
        </Form>
      </Modal.Body>
    </Modal>
    )
}
