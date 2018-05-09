# ebi

## install

1. download repo
2. `npm install`
3. `npm run start`

## functions

- create, edit customers
- create, edit dossiers (invoices, offers)
- print dossiers to pdf's

## configuration

The config file is located in the main directory. (`config.js`)

### basics

| key             | type : default  | meaning                                                                                                             |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| port            | int : 8000      | port on which the web interface will be reachable                                                                   |
| public          | bool : false    | false means only via localhost reachable, true means public                                                         |
| currency        | String : "€"    | currency symbol                                                                                                     |
| tax             | func :          | computes the tax value default 19%                                                                                  |
| print           | obj :           | obj for the print configuration see ![node-html-pdf](https://github.com/marcbachmann/node-html-pdf)                 |
| custom_data     | obj :           | use this object to store data you want to use in the dossier.mst                                                    |
| lang            | obj :           | translation for the interface                                                                                       |

### printing

See [basics](###basics) and there `custom_data` and `print`.

If you want to change the layout edit `public/mst/dossier.mst`.
