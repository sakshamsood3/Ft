import React, { useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Form,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
var moment = require('moment');

export default function TransactionRow(props) {
    const [SNo, setSNo] = useState(props.sNo)
    const [name, setName] = useState(props.name)
    const [amount, setAmount] = useState(props.amount)
    const [category, setCategory] = useState(props.category)
    const [paymentMode, setpaymentMode] = useState(props.paymentMode)
    const [date, setDate] = useState(props.date)
    const id = props._id

    return (
        <tr>
            <td>{SNo}</td>
            <td>{name}</td>
            <td>{amount}</td>
            <td>{category}</td>
            <td>{paymentMode}</td>
            <td>{moment(date).format("DD/MM/YY  HH:mm")}</td>
            
        </tr>
    )
}
