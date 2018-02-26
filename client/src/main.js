const XmlReader = require('xml-reader');
const reader = XmlReader.create();

// require.extensions['.ejs'] = (module, filename) => {module.exports = fs.readFileSync(filename, 'utf8');};

const tmpl = _.template(
`<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2" srcLang="en_GB" trgLang="">
    <file id="<%=data.attributes.id%>">
        <body>
        <% data.children.forEach(function(item) { %>
            <trans-unit id="<%=item.attributes.id%>">
                <source><%=item.children[0].children[0].children[0].value%></source>
                <target/>
            </trans-unit>
        <% }); %>
        </body>
    </file>
</xliff>`
);


// let left = document.querySelector('#left pre code');
// left.addEventListener('input', (event) => {
//     hljs.highlightBlock(left);
// })


let convertButton = document.querySelector('button');
convertButton.addEventListener('click', () => {
    let pasteArea = document.querySelector('#left pre code');
    let xml = '<?xml version="1.0"?>' + pasteArea.textContent;

    hljs.highlightBlock(pasteArea);
    reader.parse(xml);
})

reader.on('done', data => {

    while(data.children[0].name != 'unit') {
        data = data.children[0];
    }

    console.log(data)
    // let convertedArea = document.getElementById('right');
    // convertedArea.textContent = tmpl({data});

    let a = document.querySelector('#right pre code');
    a.textContent = tmpl({data});
    hljs.highlightBlock(a);
});