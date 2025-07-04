document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('excel-file-input');
    const processButton = document.getElementById('process-button');
    const printButton = document.getElementById('print-button');
    const itemList = document.getElementById('item-list');
    const pickingSheet = document.getElementById('picking-sheet');

    processButton.addEventListener('click', handleFile);

    function handleFile() {
        const file = fileInput.files[0];
        if (!file) {
            alert("Per favore, seleziona un file Excel.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Prende il primo foglio del file Excel
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Converte il foglio in un formato JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            displayData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }

    function displayData(data) {
        // Pulisce la lista precedente
        itemList.innerHTML = ''; 

        if (data.length === 0) {
            itemList.innerHTML = '<p>Nessun dato trovato nel file.</p>';
            return;
        }
        
        // Imposta la data corrente
        const today = new Date();
        document.getElementById('current-date').innerText = `Data: ${today.toLocaleDateString('it-IT')}`;

        // Mostra il foglio di prelievo e il pulsante di stampa
        pickingSheet.style.display = 'block';
        printButton.style.display = 'inline-block';

        // Crea un elemento per ogni riga del file Excel
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('item');

            // Formatta la quantità con separatore delle migliaia e due decimali
            const formattedQuantity = parseFloat(item.Quantita || 0).toLocaleString('it-IT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            listItem.innerHTML = `
                <div class="item-info">
                    <div class="item-code">${item.Codice || 'N/D'}</div>
                    <div class="item-description">${item.Descrizione || 'N/D'}</div>
                </div>
                <div class="item-right-panel">
                    <div class="barcode-container">
                        <svg class="barcode" id="barcode-${item.Codice}"></svg>
                        <div class="barcode-text">*${item.Codice || 'N/D'}*</div>
                    </div>
                    <div class="item-quantity">
                        Quantità : PZ <span>${formattedQuantity}</span>
                    </div>
                </div>
            `;
            
            itemList.appendChild(listItem);

            // Genera il codice a barre
            if (item.Codice) {
                JsBarcode(`#barcode-${item.Codice}`, item.Codice, {
                    format: "CODE128",
                    displayValue: false,
                    width: 2,
                    height: 50,
                    margin: 0
                });
            }
        });

        // Aggiunge info sulla pagina
        document.getElementById('page-info').innerText = `Pagina 1 di 1`;
    }

    // Funzionalità del pulsante di stampa
    printButton.addEventListener('click', () => {
        window.print();
    });
});
