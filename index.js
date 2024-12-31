// Webapp for tracking income and expenses
const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const path = require( 'path' )
const app = express()

// Middleware
app.use( bodyParser.json() )
app.use( express.static( path.join( __dirname, 'public' ) ) )

// Serve frontend (basic autocomplete & form handling)
app.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public/index.html' ) )
})

// 404 handler
app.use( ( req, res ) => {
    res.status( 404 ).sendFile( path.join( __dirname, 'public/404.html' ) )
})
