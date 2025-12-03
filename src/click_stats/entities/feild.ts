// const fieldTypes ={}
// const Cardinality = {
//     SINGLE: 0,
//     MULTIPLE: 1
// };

// fieldTypes.text = {
//     validate: field => {},
//     addColumn: (table, name) => table.string(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeText',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => value,
//     render: (field, value) => value
// };

// fieldTypes.website = {
//     validate: field => {},
//     addColumn: (table, name) => table.string(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeWebsite',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => value,
//     render: (field, value) => value
// };

// fieldTypes.longtext = {
//     validate: field => {},
//     addColumn: (table, name) => table.text(name),
//     indexed: false,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeLongtext',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => value,
//     render: (field, value) => value
// };

// fieldTypes.gpg = {
//     validate: field => {},
//     addColumn: (table, name) => table.text(name),
//     indexed: false,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeGpg',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => value,
//     render: (field, value) => value
// };

// fieldTypes.json = {
//     validate: field => {},
//     addColumn: (table, name) => table.text(name),
//     indexed: false,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeJson',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => value,
//     render: (field, value) => {
//         try {
//             if (value === null || value.trim() === '') {
//                 return '';
//             }

//             let parsed = JSON.parse(value);
//             if (Array.isArray(parsed)) {
//                 parsed = {
//                     values: parsed
//                 };
//             }
//             return render(field.settings.renderTemplate, parsed);
//         } catch (err) {
//             return err.message;
//         }
//     }
// };

// fieldTypes.number = {
//     validate: field => {},
//     addColumn: (table, name) => table.integer(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeNumber',
//     forHbs: (field, value) => value,
//     parsePostValue: (field, value) => Number(value),
//     render: (field, value) => value
// };

// fieldTypes['checkbox-grouped'] = {
//     validate: field => {},
//     indexed: true,
//     grouped: true,
//     enumerated: false,
//     cardinality: Cardinality.MULTIPLE,
//     getHbsType: field => 'typeCheckboxGrouped',
//     render: (field, value) => {
//         const subItems = (value || []).map(col => field.groupedOptions[col].name);

//         if (field.settings.groupTemplate) {
//             return render(field.settings.groupTemplate, {
//                 values: subItems
//             });
//         } else {
//             return subItems.join(', ');
//         }
//     }
// };

// fieldTypes['radio-grouped'] = {
//     validate: field => {},
//     indexed: true,
//     grouped: true,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeRadioGrouped',
//     render: (field, value) => {
//         const fld = field.groupedOptions[value];
//         return fld ? fld.name : '';
//     }
// };

// fieldTypes['dropdown-grouped'] = {
//     validate: field => {},
//     indexed: true,
//     grouped: true,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeDropdownGrouped',
//     render: (field, value) => {
//         const fld = field.groupedOptions[value];
//         return fld ? fld.name : '';
//     }
// };

// fieldTypes['radio-enum'] = {
//     validate: field => {
//         enforce(field.settings.options, 'Options missing in settings');
//         enforce(field.default_value === null || field.settings.options.find(x => x.key === field.default_value), 'Default value not present in options');
//     },
//     addColumn: (table, name) => table.string(name),
//     indexed: true,
//     grouped: false,
//     enumerated: true,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeRadioEnum',
//     render: (field, value) => {
//         const fld = field.settings.options.find(x => x.key === value);
//         return fld ? fld.label : '';
//     }
// };

// fieldTypes['dropdown-enum'] = {
//     validate: field => {
//         enforce(field.settings.options, 'Options missing in settings');
//         enforce(field.default_value === null || field.settings.options.find(x => x.key === field.default_value), 'Default value not present in options');
//     },
//     addColumn: (table, name) => table.string(name),
//     indexed: true,
//     grouped: false,
//     enumerated: true,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeDropdownEnum',
//     render: (field, value) => {
//         const fld = field.settings.options.find(x => x.key === value);
//         return fld ? fld.label : '';
//     }
// };

// fieldTypes.option = {
//     validate: field => {},
//     addColumn: (table, name) => table.boolean(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     parsePostValue: (field, value) => {
//         if (Array.isArray(value)) {
//             // HTML checkbox does not provide any value when not checked. To detect the presence of the checkbox, we add a hidden field with the same name (see subscription-custom-fields.hbs:130).
//             // When the checkbox is selected, two values are returned and "value" is an array instead of a string. We assume the hidden field always comes after the actual value and thus take
//             // the first value in the array
//             value = value[0]
//         }
//         return !(['false', 'no', '0', ''].indexOf((value || '').toString().trim().toLowerCase()) >= 0)
//     },
//     getHbsType: field => 'typeOption',
//     forHbs: (field, value) => value ? 1 : 0,
//     render: (field, value) => value ? field.settings.checkedLabel : field.settings.uncheckedLabel

// };

// fieldTypes['date'] = {
//     validate: field => {
//         enforce(['eur', 'us', 'intl'].includes(field.settings.dateFormat), 'Date format incorrect');
//     },
//     addColumn: (table, name) => table.dateTime(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeDate' + field.settings.dateFormat.charAt(0).toUpperCase() + field.settings.dateFormat.slice(1),
//     forHbs: (field, value) => formatDate(field.settings.dateFormat, value),
//     parsePostValue: (field, value) => parseDate(field.settings.dateFormat, value),
//     render: (field, value) => value !== null ? formatDate(field.settings.dateFormat, value) : ''
// };

// fieldTypes['birthday'] = {
//     validate: field => {
//         enforce(['eur', 'us'].includes(field.settings.dateFormat), 'Date format incorrect');
//     },
//     addColumn: (table, name) => table.dateTime(name),
//     indexed: true,
//     grouped: false,
//     enumerated: false,
//     cardinality: Cardinality.SINGLE,
//     getHbsType: field => 'typeBirthday' + field.settings.dateFormat.charAt(0).toUpperCase() + field.settings.dateFormat.slice(1),
//     forHbs: (field, value) => formatBirthday(field.settings.dateFormat, value),
//     parsePostValue: (field, value) => parseBirthday(field.settings.dateFormat, value),
//     render: (field, value) => value !== null ? formatBirthday(field.settings.dateFormat, value) : ''
// };

// const groupedTypes = Object.keys(fieldTypes).filter(key => fieldTypes[key].grouped);

// function getFieldType(type) {
//     return fieldTypes[type];
// }