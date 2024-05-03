
/** La comanda (segon component) rebrà la informació dels plats seleccionats a través de l'event anterior. [X]
 *  Quan detecti que s'ha fet clic al botó per afegir un plat, haurà de recuperar la seva informació i afegir-lo a la comanda. [X]
 * Els plats de dins la comanda seran el nostre tercer component, que no és una altra cosa que la versió reduïda del component del plat. []
 * Addicionalment, s'haurà d'incloure un selector de quantitat de tipus + / -. La comanda, a banda dels plats, haurá de mostrar l'import total. []
 */

class ComandaComponent extends HTMLElement {
    constructor() {
        super();
        this.plats = []
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            .imgs {
                width: 380px;
                height: 324px; 
            } 
            </style>
            <div class="container" id="container">
                <h1>Comandas</h1>
                <div id="comandes"></div>
            </div>
        `;
       
    }
    // Utilizo función flechita para a la hora de hacer el this, hacer  al componente actual.
    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {
                document.addEventListener('afegir-plat', (event) => {
                    this.agregarMenu(event.detail); 
                   this.afegir_els_plats_a_la_comanda()
                   
              });
              
        });
    }
    agregarMenu(menu) {
        this.plats.push(menu); // Agregar el menú al array
    }
    afegir_els_plats_a_la_comanda() {
        let comandesDiv = this.shadowRoot.getElementById('comandes')
        comandesDiv.innerHTML = ''
        this.plats.forEach(plat => {
            const platElement = document.createElement('div');
            platElement.innerHTML = `
            <h3>${plat.nom}</h3>
            <img src="${plat.img}" alt="${plat.nom}" class="imgs">
            <p>Preu: ${plat.preu}</p>
            <p>Alèrgens: ${plat.alergen}</p>
        `;
        comandesDiv.appendChild(platElement);
        })
       // console.log(plat);
    }
}

customElements.define('comanda-component', ComandaComponent);
