async function fetchTransactions() {
    const response = await fetch( '/api/transactions' )
    if ( !response.ok ) {
        document.getElementById('error-message').textContent = 'Error: Unable to fetch transactions.'
        return []
    }
    return response.json()
}

async function updateDatalists() {
    const transactions = await fetchTransactions()
    const descriptionList = document.getElementById('description-list')
    const sourceList = document.getElementById('source-list')

    // Popola le opzioni uniche per Descrizione e Sorgente
    const descriptions = [...new Set(transactions.map(t => t.description))]
    const sources = [...new Set(transactions.map(t => t.source))]

    descriptionList.innerHTML = ''
    sourceList.innerHTML = ''

    descriptions.forEach(desc => {
        const option = document.createElement('option')
        option.value = desc
        descriptionList.appendChild(option)
    })

    sources.forEach(source => {
        const option = document.createElement('option')
        option.value = source
        sourceList.appendChild(option)
    })
}

async function addTransaction( event ) {
    event.preventDefault()
    const formData = new FormData( event.target )
    const transaction = {
        date: formData.get( 'date' ) || null,
        description: formData.get( 'description' ),
        amount: formData.get( 'amount' ),
        source: formData.get( 'source' )
    }

    const response = await fetch( '/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( transaction )
    })

    if ( !response.ok ) {
        document.getElementById('error-message').textContent = 'Error: Unable to add transaction.'
        return
    }

    event.target.reset()
    displayTransactions()
    updateDatalists()
}

async function displayTransactions() {
    const transactions = await fetchTransactions()
    const list = document.getElementById( 'transaction-list' )
    list.innerHTML = ''

    transactions.forEach( t => {
        const item = document.createElement( 'li' )
        item.innerHTML = `<i class='fas fa-money-bill-wave'></i> ${t.date} - ${t.description}: €${t.amount} <i class='fas fa-wallet'></i> (${t.source})`
        list.appendChild( item )
    })
}

window.onload = () => {
    displayTransactions()
    updateDatalists()
}

document.getElementById( 'description-input' ).addEventListener( 'input', async ( event ) => {
    const description = event.target.value
    const response = await fetch( `/api/last-transaction?description=${encodeURIComponent(description)}` )

    if ( response.ok ) {
        const lastTransaction = await response.json()
        document.getElementById( 'amount-input' ).value = lastTransaction.amount
        document.getElementById( 'source-input' ).value = lastTransaction.source
    }
})
