fetch("if_docs.html")
    .then(stream => stream.text())
    .then(text => loadDocs(text));

function loadDocs(html) {
    class Docs extends HTMLElement {
        constructor() {
            super();
    
            //shadow root
            var shadow = this.attachShadow({mode: 'open'});

            //combine elements
            shadow.innerHTML = html;
        }
    }
    //define element
    customElements.define('if-docs', Docs);
}
