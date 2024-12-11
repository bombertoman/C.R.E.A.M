const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// Middleware
app.use(bodyParser.json())

// Data storage
let transactions = []

// Routes
app.get('/api/transactions', (req, res) => {
    res.json(transactions)
})

app.post('/api/transactions', (req, res) => {
    const { date, description, amount, source } = req.body

    if (!description || !amount || !source) {
        return res.status(400).json({ error: 'Description, amount, and source are required.' })
    }

    const newTransaction = {
        id: Date.now(),
        date: date || new Date().toISOString().split('T')[0],
        description,
        amount: parseFloat(amount),
        source,
    }

    transactions.push(newTransaction)
    res.status(201).json(newTransaction)
})

app.get('/api/totals', (req, res) => {
    const totals = transactions.reduce((acc, transaction) => {
        const monthYear = `${transaction.date.slice(0, 7)}`
        if (!acc[transaction.source]) {
            acc[transaction.source] = {}
        }

        if (!acc[transaction.source][monthYear]) {
            acc[transaction.source][monthYear] = 0
        }

        acc[transaction.source][monthYear] += transaction.amount
        return acc
    }, {})

    res.json(totals)
})

// Serve static files
app.use(express.static(path.join(__dirname, '../public')))

module.exports = app
module.exports.handler = serverless(app)
