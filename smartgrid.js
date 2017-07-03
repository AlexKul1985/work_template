const smartgrid = require('smart-grid');

const settings = {
    columns: 24,
    offset: '20px',
    container: {
        maxWidth: '1200px',
        fields: '10px'
    },
    breakPoints: {
        md: {
            width: "992px",
            fields: "10px"
        },
        sm: {
            width: "720px",
            fields: "10px"
        },
        xs: {
            width: "576px",
            fields: "10px"
        },
        xxs: {
            width: "380px",
            fields: "10px"
        }
    },
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ]
};

smartgrid('./src/less/lib', settings);