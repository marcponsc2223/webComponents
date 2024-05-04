
class CartaComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid black;
                    padding: 20px;
                }
                .imgs {
                    width: 380px;
                    height: 324px; 
                }
                .agregarBtn {
                    transition: 0.5s;
                }
                .agregarBtn:hover {
                    transform: scale(1.01);
                    cursor: pointer;
                }
                .container {
                    display: flex;
                    flex-wrap: wrap; 
                }
                
                .column {
                    padding-right: 85px;
                    flex: 1 0 25%;
                }
            </style>
            <!-- Estructura encapsulada -->
            <div class="container">
                
                <div id="primers"><h2>Primers</h2></div>

               
                <div id="segons"> <h2>Segons</h2></div>

                
                <div id="postres"><h2>Postres</h2></div>

                
                <div id="begudes"><h2>Begudes</h2></div>
            </div>
        `;
        this.plats = {
            primers: [
                { nom: 'Ensalada César', img: '../img/cesar.jpg', preu: '10€', alergen: 'Gluten, Lactosa' },
                { nom: 'Bistec', img: '../img/bistec.jpg', preu: '15€', alergen: 'Gluten' },
            ],
            segons: [
                { nom: 'Pasta Carbonara', img: '../img/pasta.jpg', preu: '12€', alergen: 'Gluten, Huevo, Lactosa' },
                { nom: 'Arroz', img: '../img/arroz.jpg', preu: '13€', alergen: 'Gluten' },
            ],
            postres: [
                { nom: 'Tarta de Chocolate', img: '../img/tarta.jpg', preu: '6€', alergen: 'Gluten, Huevo, Lactosa' },
                { nom: 'Brownie de chocolate', img: '../img/brownie.jpg', preu: '8€', alergen: 'Gluten, Lactosa' },
            ],
            begudes: [
                { nom: 'Cerveza', img: '../img/crv.jpg', preu: '3€', alergen: 'Alcohol' },
                { nom: 'Agua', img: '../img/agua.jpg', preu: '1.5€', alergen: 'nada' },
            ]
        };
    }

    connectedCallback() {
        // Mostrar los platos en cada sección
        this.mostrarPlats('primers', this.plats.primers);
        this.mostrarPlats('segons', this.plats.segons);
        this.mostrarPlats('postres', this.plats.postres);
        this.mostrarPlats('begudes', this.plats.begudes);
    }

    mostrarPlats(categoria, plats) {
        const contenedor = this.shadowRoot.getElementById(categoria);
        plats.forEach(plat => {
            const platoElement = document.createElement('div');
            platoElement.classList.add('column')
            platoElement.innerHTML = `
                <h3>${plat.nom}</h3>
                <img src="${plat.img}" alt="${plat.nom}" class="imgs">
                <p>Preu: ${plat.preu}</p>
                <p>Alèrgens: ${plat.alergen}</p>
                <button type="button" class="btn btn-primary agregarBtn">Afegir a la comanda</button>
            `;
            contenedor.appendChild(platoElement);
        
            // Utilizo la función de flecha, para acceder al this del componente y no del evento.
            platoElement.querySelector('.agregarBtn').addEventListener('click', () => {
                this.agregarAComanda(plat);
            });
        });
    }
    // El bubbles es para que se propágue hacia arriba, para que lo capturen los padres y el composed es para que pueda ser utilizado fuera del componente actual.
    agregarAComanda(plat) {
        const event = new CustomEvent('afegir-plat', {
            bubbles: true,
            composed: true,
            detail: {nom: plat.nom, img: plat.img, preu: plat.preu, alergen: plat.alergen},
        })
        this.dispatchEvent(event)
    }

}
customElements.define('carta-component', CartaComponent)