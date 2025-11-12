/**
 * ───────────────────────────────
 *  Field Type Definitions
 * ───────────────────────────────
 */

/** 
 * @typedef {"text"|"number"|"email"|"textarea"|"select"|"multi-select"|"checkbox"|"file"|"date"|"time"|"datetime-local"|"searchable-select"|"field-group"} FieldType
 */

/**
 * Base field common to all types
 * @typedef {Object} BaseField
 * @property {string} name - Unique field name (dot notation supported)
 * @property {string} head - Field label shown in UI
 * @property {FieldType} type
 * @property {boolean} [required]
 * @property {string} [placeholder]
 * @property {(value:any)=>boolean|string} [validate]
 * @property {any} [defaultValue]
 * @property {number} [minLength]
 * @property {number} [maxLength]
 */

/** ───────────────────────────────
 *  Specific Field Variants
 * ───────────────────────────────*/

/** @typedef {BaseField & {type:"text"|"number"|"email"}} TextField */
/** @typedef {BaseField & {type:"textarea", rows?: number}} TextareaField */
/** @typedef {BaseField & {
 *   type:"select",
 *   options: Array<{label:string,value:string|number}>,
 *   optionHead?: string
 * }} SelectField */
/** @typedef {BaseField & {
 *   type:"multi-select",
 *   options: Array<{label:string,value:string|number}>
 * }} MultiSelectField */
/** @typedef {BaseField & {type:"checkbox"}} CheckboxField */
/** @typedef {BaseField & {
 *   type:"file",
 *   multiple?: boolean,
 *   accept?: string,
 *   min?: number,
 *   max?: number
 * }} FileField */
/** @typedef {BaseField & {type:"date"|"time"|"datetime-local"}} DateTimeField */

/**
 * Searchable Select Field
 * Allows async option fetching and optional creation.
 */
/** @typedef {BaseField & {
 *   type: "searchable-select",
 *   allowCreate?: boolean,
 *   getOption: ({search:string})=>Promise<Array<{_id:string,label:string,value:string}>>,
 *   createOption?: ({value:string})=>Promise<{_id:string,label:string,value:string}>,
 * }} SearchableSelectField */

/**
 * Field Group (array of subfields)
 * Supports recursion and min/max items.
 */
/** @typedef {BaseField & {
 *   type: "field-group",
 *   itemLabel?: string,
 *   subFields: Field[],
 *   minItems?: number,
 *   maxItems?: number
 * }} FieldGroupField */

/** 
 * Complete Field type (union of all variants)
 * @typedef {TextField|TextareaField|SelectField|MultiSelectField|CheckboxField|FileField|DateTimeField|SearchableSelectField|FieldGroupField} Field
 */

/**
 * Example field definitions
 * @type {Field[]}
 */
export const defaultFields = [
  {
    type: "text",
    name: "title",
    head: "Title",
    required: true,
    minLength: 3,
  },
  {
    type: "field-group",
    name: "variants",
    head: "Product Variants",
    itemLabel: "Variant",
    minItems: 1,
    maxItems: 10,
    subFields: [
      { type: "text", name: "name", head: "Variant Name", required: true },
      { type: "number", name: "price", head: "Price", required: true },
    ],
  },
];
