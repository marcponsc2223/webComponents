
/** La comanda (segon component) rebrà la informació dels plats seleccionats a través de l'event anterior. [X]
 *  Quan detecti que s'ha fet clic al botó per afegir un plat, haurà de recuperar la seva informació i afegir-lo a la comanda. [X]
 * Els plats de dins la comanda seran el nostre tercer component, que no és una altra cosa que la versió reduïda del component del plat. []
 * Addicionalment, s'haurà d'incloure un selector de quantitat de tipus + / -. La comanda, a banda dels plats, haurá de mostrar l'import total. []
 */

/** PLATS */
class PlatsComponent extends HTMLElement {
    constructor() {
        super();
        this.plats = []
        this.total = []
        this.originalPrice = []
        this.repetit = false
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            .imgs {
                width: 428px;
                height: 324px; 
            } 
            #total {
                top: 1136px;
                right: 1010px;
                position: absolute;
                font-weight: 900;
                font-size: 30px;
            }
            .comandes {
                display: flex; 
                flex-wrap: wrap; 
                height: 100vh;
              }
              
            .comandes > div {
                place-content: center;
                display: grid;
                height: 576px;
                padding: 7px;
                border-radius: 14px;
                border: 2px solid #a19e9e;
                flex-basis: calc(25% - 38px);
                margin: 10px;
            }
            .quantitatP {
                font-size: 2.17em;
                font-weight: 900;
                left: 359px;
                margin: 0;
                position: relative;
                bottom: 499px;
            }
            .button-container {
                left: 76%;
                position: relative;
                bottom: 30px;
            }
            .btn-Icons {
                transition: 0.2s;
            }
            .btn-Icons:hover{
                transform: scale(1.03);
            }
            .icons {
                width: 28px;
            }
            </style>
                <div id="comandes" class="comandes"></div>
                <p id="total">Preu total: </p>
            </div>
        `;
    }
    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('crear-component-plat', (event) => {
                this.repetit = false
                let menu = event.detail

                this.agregarMenu(menu);
                this.afegirQuantitat(menu)
                // if (!this.repetit) 
                this.afegir_els_plats_a_la_comanda()
            });   

        });
    }
    agregarMenu(menu) {
        this.plats.forEach(plat => {
            if (plat.nom === menu.nom) {
                this.repetit = true
                plat.quantitat++
            } 
        })
        if (!this.repetit) this.plats.push(menu)
        this.guardarPreuTotal(menu, false)
    }
    afegirQuantitat(platNou) {
        if (!this.repetit) platNou.quantitat = 1
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
            <p class="quantitatP" id="${plat.nom}">X${plat.quantitat}</p>
           
        `;
        const divAdd = document.createElement('div')
        divAdd.classList.add('button-container','divAddAndDelete')
        // id="add_${plat.nom}"
        divAdd.id = 'add_' + plat.nom
        divAdd.innerHTML = `
            <button class="btn btn-Icons delete"><img src="../img/lessIcon.png" alt="LessIcon.png" class="icons"></button>
            <button class="btn btn-Icons add"><img src="../img/addIcon.png" alt="AddIcon.png" class="icons"></button>
        `
        platElement.appendChild(divAdd)
        comandesDiv.appendChild(platElement);
        
        let quantitatP = this.shadowRoot.getElementById(plat.nom)

        divAdd.querySelector('.add').addEventListener('click', (event) =>{
            let target = event.target.parentElement.parentElement
            if (target.id === divAdd.id) plat.quantitat++; 
            quantitatP.textContent = 'X' + plat.quantitat 
            this.guardarPreuTotal(plat, false)
        })
        divAdd.querySelector('.delete').addEventListener('click', (event) =>{
            let target = event.target.parentElement.parentElement
            if (target.id === divAdd.id && plat.quantitat > 0) plat.quantitat--; 
            quantitatP.textContent = 'X' + plat.quantitat
            this.guardarPreuTotal(plat, true) 
        })
        if (!this.repetit) this.originalPrice.push({nom: plat.nom, price: parseFloat(plat.preu.replace('€', ''))})
        
        })  
    }
    guardarPreuTotal(plat, esborrar) {
        this.total.push(plat.preu)
        let diners = 0
        let div = this.shadowRoot.getElementById('total')
        console.log(this.originalPrice);
        if (esborrar) {
            diners = div.textContent.match(/\d+/)[0]
                this.originalPrice.forEach(price => {
                    if (price.nom === plat.nom) {
                        diners -= price.price
                        console.log(this.total);
                        this.total.pop(plat.preu)
                        this.total.pop(plat.preu)
                        console.log(this.total);
                    }
            })
        } else {
            this.total.forEach(tot => {
                diners += parseFloat(tot.replace('€', ''))
            }) 
        }
        console.log(diners);

        div.textContent = 'Preu total: ' + diners + '€'
    }
    afegir_o_quitar_plats(afegir, plat) {
        afegir ? plat.quantitat++ : plat.quantitat--
    }
    
}

/** COMANDA */
class ComandaComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            .container {
                padding-left: 20px;
            }
            </style>
            <div class="container" id="container">
                <h1>Comandas</h1>
                <plats-component></plats-component>
            </div>
        `;
       
    }
    // Utilizo función flechita para a la hora de hacer el this, hacer  al componente actual.
    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {
                document.addEventListener('afegir-plat', (event) => {
                    // this.afegirQuantitat(event.detail)
                    this.afegirPlats(event.detail)
              });
              
        });
    }
    // afegirQuantitat(plats) {
    //     plats.forEach(plat => {
    //         plat.quantitat = 0
    //     })
    // }

    afegirPlats(plat) {
        const event = new CustomEvent('crear-component-plat', {
            bubbles: true,
            composed: true,
            detail: {nom: plat.nom, img: plat.img, preu: plat.preu, alergen: plat.alergen, quantitat: plat.quantitat},
        }) 
        this.dispatchEvent(event)
    }
    
}

customElements.define('comanda-component', ComandaComponent);
customElements.define('plats-component', PlatsComponent);

// if (document.querySelectorAll('.add')) {
//     var addButton = document.querySelectorAll('.add')
// }
