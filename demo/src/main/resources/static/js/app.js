document.addEventListener('DOMContentLoaded', () => {
    // URL di base per la nostra API dei prodotti
    const API_URL = '/api/prodotti';

    // Riferimenti agli elementi DOM
    const prodottiTableBody = document.querySelector('#prodottiTable tbody');
    const prodottoForm = document.getElementById('prodottoForm');
    const submitBtn = document.getElementById('submitBtn');
    const prodottoIdInput = document.getElementById('prodottoId');
    const nomeInput = document.getElementById('nome');
    const prezzoInput = document.getElementById('prezzo');

    // Funzione principale per caricare e renderizzare tutti i prodotti
    async function fetchProdotti() {
        try {
            const response = await fetch(API_URL);
            const prodotti = await response.json();
            
            // Pulisce la tabella prima di inserire i nuovi dati
            prodottiTableBody.innerHTML = ''; 

            if (prodotti.length === 0) {
                prodottiTableBody.innerHTML = '<tr><td colspan="4">Nessun prodotto trovato.</td></tr>';
            } else {
                prodotti.forEach(prodotto => {
                    prodottiTableBody.appendChild(createProdottoRow(prodotto));
                });
            }
        } catch (error) {
            console.error('Errore durante il recupero dei prodotti:', error);
            prodottiTableBody.innerHTML = '<tr><td colspan="4" style="color: red;">Errore di connessione all\'API.</td></tr>';
        }
    }

    // Crea la riga HTML per un singolo prodotto
    function createProdottoRow(prodotto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prodotto.id}</td>
            <td>${prodotto.nome}</td>
            <td>€ ${prodotto.prezzo.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${prodotto.id}">Modifica</button>
                <button class="action-btn delete-btn" data-id="${prodotto.id}">Elimina</button>
            </td>
        `;
        return row;
    }

    // Gestisce l'invio del form (CREATE o UPDATE)
    prodottoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = prodottoIdInput.value;
        const nome = nomeInput.value;
        const prezzo = parseFloat(prezzoInput.value);

        if (isNaN(prezzo)) {
            alert('Inserisci un prezzo valido.');
            return;
        }

        const prodottoData = { nome, prezzo };
        let url = API_URL;
        let method = 'POST';

        // Se l'ID è presente, è un'operazione di UPDATE
        if (id) {
            url = `${API_URL}/${id}`;
            method = 'PUT';
            prodottoData.id = id; // Includiamo l'ID nel corpo della PUT
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prodottoData),
            });

            if (response.ok) {
                // Ricarica la lista per vedere il nuovo/modificato prodotto
                fetchProdotti(); 
                resetForm();
            } else {
                alert(`Errore ${response.status}: Impossibile completare l'operazione.`);
            }
        } catch (error) {
            console.error('Errore di rete/server:', error);
            alert('Errore di comunicazione con il server.');
        }
    });

    // Gestisce i click sui pulsanti (Modifica/Elimina)
    prodottiTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (!id) return;

        if (target.classList.contains('delete-btn')) {
            if (confirm(`Sei sicuro di voler eliminare il prodotto con ID ${id}?`)) {
                deleteProdotto(id);
            }
        } else if (target.classList.contains('edit-btn')) {
            // Popola il form con i dati del prodotto da modificare
            fillFormForEdit(id, target.closest('tr'));
        }
    });

    // Funzione per eliminare un prodotto (DELETE)
    async function deleteProdotto(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 204) { // HTTP 204 No Content (Successo)
                fetchProdotti();
            } else if (response.status === 404) {
                 alert('Prodotto non trovato.');
            } else {
                alert(`Errore ${response.status} durante l'eliminazione.`);
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
        }
    }

    // Funzione per popolare il form quando si clicca 'Modifica'
    function fillFormForEdit(id, row) {
        // Recupera i dati dalla riga della tabella
        const nome = row.children[1].textContent;
        // Rimuove la valuta "€ " e converte in numero
        const prezzoText = row.children[2].textContent.replace('€ ', '').replace(',', '.'); 
        const prezzo = parseFloat(prezzoText); 
        
        prodottoIdInput.value = id;
        nomeInput.value = nome;
        prezzoInput.value = prezzo;
        
        submitBtn.textContent = 'Aggiorna Prodotto';
        
        // Scorri alla vista del form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Funzione per ripulire il form e resettare il pulsante
    function resetForm() {
        prodottoForm.reset();
        prodottoIdInput.value = ''; // Pulisce l'ID nascosto
        submitBtn.textContent = 'Aggiungi Prodotto';
    }

    // Avvia il recupero dei prodotti all'apertura della pagina
    fetchProdotti();
});