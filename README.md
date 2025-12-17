# Forge Froms Documentation

This guide provides comprehensive documentation for creating form schemas using the "Forge Froms" feature. The schema-based approach allows non-technical staff to create complex, interactive forms with validations, conditions, and various field types.

## Table of Contents

- [Introduction](#introduction)
- [Field References and Special Keywords](#field-references-and-special-keywords)
  - [Referencing Other Fields](#referencing-other-fields)
  - [Special Keywords](#special-keywords)
- [Date and DateTime Formats](#date-and-datetime-formats)
  - [Date Format](#date-format)
  - [DateTime Format](#datetime-format)
  - [Offset Units](#offset-units)
- [Form Structure](#form-structure)
- [Elements](#elements)
  - [Layout Elements](#layout-elements)
    - [Form](#form)
    - [Step](#step)
    - [Section](#section)
    - [Row](#row)
    - [Object List](#object-list)
  - [Field Elements](#field-elements)
    - [Text Input](#text-input)
    - [Textarea](#textarea)
    - [Select](#select)
    - [Radio](#radio)
    - [Radio Binary](#radio-binary)
    - [Checkbox](#checkbox)
    - [Date](#date)
    - [Time](#time)
    - [DateTime](#datetime)
    - [Switch](#switch)
    - [File Upload](#file-upload)
- [Validation](#validation)
  - [String Validations](#string-validations)
  - [Number Validations](#number-validations)
  - [Date Validations](#date-validations)
  - [DateTime Validations](#datetime-validations)
  - [File Validations](#file-validations)
  - [Selection Validations](#selection-validations)
  - [Conditional Validations](#conditional-validations)
  - [Custom Function Validations](#custom-function-validations)
- [Conditions](#conditions)
- [Operators](#operators)
- [Options](#options)
  - [Static Options](#static-options)
  - [Dynamic Options](#dynamic-options)
- [Best Practices](#best-practices)
- [Complete Form Example](#complete-form-example)

## Introduction

The "Forge Froms" feature enables the creation of complex forms through JSON schemas. These schemas define not just the fields and their layouts, but also validations, conditional logic, and dynamic behaviors.

## Field References and Special Keywords

The "Forge Froms" system supports several ways to reference other fields and special dynamic values.

### Referencing Other Fields

You can reference the value of another field using the double curly braces syntax:

```json
// In conditions
["password", "{{confirmPassword}}", "EQ"]  // Check if password equals confirmPassword

// In dynamic URLs for options
{
  "type": "dynamic",
  "url": "https://api.example.com/states?country={{country}}"  // Uses the value of the 'country' field
}

// In validation messages
{
  "type": "min",
  "val": 0,
  "message": "Value must be positive (greater than {{minValue}})"  // Displays the value from the minValue field
}
```

### Special Keywords

The system provides several special keywords that can be used in conditions, validations, and default values:

| Keyword | Description | Example Usage |
|---------|-------------|--------------|
| `__self__` | References the current field's value | `["{{__self__}}", "0", "GT"]` (value must be greater than 0) |
| `__context__` | References the values in context | `{{__context__.env.value}}` (env.value property from context object) |
| `__declaration__` | References declaration state in forms | Used for maintaining declarations state within dynamic forms |
| `__olCurrEntry__` | References current entry in object lists | `{{__olCurrEntry__.fieldName}}` (current object list item's field value) |
| `__olAnyEntry__` | References any entry in object lists | *Not implemented - reserved for future use* |
| `__today__` | Current date without time | `"max": "__today__"` (date must not be in the future) |
| `__now__` | Current date and time | `"max": "__now__"` (date-time must not be in the future) |

## Date and DateTime Formats

The "Forge Froms" system supports flexible date and time formats with special keywords and relative time expressions.

### Date Format

Standard format for dates: `YYYY-MM-DD` (e.g., `2023-04-15`)

Dates in the "Forge Froms" system follow the ISO 8601 format without the time component. They can be used in date fields, validations, and conditions.

#### Examples

```json
// Simple date value
"min": "2023-01-01"

// Using special keywords
"max": "__today__"

// Relative date (one year ago from today)
"min": {
  "init": "__today__",
  "offset": {
    "yrs": -1
  }
}

// Date validation example
"validations": [
  {
    "type": "dateRange",
    "min": "2023-01-01",
    "max": "__today__",
    "message": "Date must be between January 1, 2023 and today"
  }
]
```

### DateTime Format

Standard format for date-times: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., `2023-04-15T14:30:00.000Z`)

DateTimes in the "Forge Froms" system follow the ISO 8601 format with the time component and timezone information. They can be used in datetime fields, validations, and conditions.

#### Examples

```json
// Simple datetime value
"min": "2023-01-01T00:00:00.000Z"

// Using special keywords
"max": "__now__"

// Relative datetime (2 hours and 30 minutes from now)
"max": {
  "init": "__now__",
  "offset": {
    "hrs": 2,
    "mins": 30
  }
}

// DateTime validation example
"validations": [
  {
    "type": "dateTimeRange",
    "min": {
      "init": "__now__",
      "offset": {
        "hrs": -24
      }
    },
    "max": "__now__",
    "message": "Datetime must be within the last 24 hours"
  }
]
```

### Offset Units

You can use offset units to create relative dates and date-times. Positive values indicate future times, while negative values indicate past times.

| Unit | Property | Description | Example |
|------|----------|-------------|---------|
| Seconds | `secs` | Seconds offset | `"secs": 30` |
| Minutes | `mins` | Minutes offset | `"mins": -15` |
| Hours | `hrs` | Hours offset | `"hrs": 2` |
| Days | `dys` | Days offset | `"dys": -1` |
| Months | `mnts` | Months offset | `"mnts": 6` |
| Years | `yrs` | Years offset | `"yrs": 1` |

## Form Structure

A form is organized hierarchically:

1. **Form**: The top-level container
2. **Steps**: Logical groupings of form sections (single-step or multi-step)
3. **Sections**: Groups of related fields
4. **Rows**: Horizontal arrangements of fields
5. **Fields**: Individual input elements


## Elements

### Layout Elements

#### Form

The top-level container for all form elements.

```json
{
  "type": "form",
  "id": "customerInfoForm",
  "title": "Customer Information",
  "subtitle": "Please provide your details",
  "multistep": true,
  "steps": [
    // Step elements
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "form" |
| `id` | `string` | Yes | Unique identifier for the form |
| `title` | `string` | Yes | Main form title |
| `subtitle` | `string` | No | Optional subtitle or description |
| `multistep` | boolean | No | If true, enables multi-step form with navigation |
| `steps` | array | Yes | Array of step elements (at least 1 required) |

#### Step

A logical grouping of sections that represents a single page in a multi-step form.

```json
{
  "type": "layout",
  "layoutType": "step",
  "id": "personalInfoStep",
  "title": "Personal Information", 
  "sections": [
    // Section elements
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "layout" |
| `layoutType` | `string` | Yes | Must be "step" |
| `id` | `string` | Yes | Unique identifier for the step |
| `title` | `string` | No | Step title (shown in navigation) |
| `subtitle` | `string` | No | Optional subtitle or description |
| `sections` | array | Yes | Array of section elements (at least 1 required) |

#### Section

A group of related form elements, typically displayed with a title and optional subtitle.

```json
{
  "type": "layout",
  "layoutType": "section",
  "id": "contactSection",
  "title": "Contact Information",
  "subtitle": "How can we reach you?",
  "collapsable": true,
  "items": [
    // Row elements or ObjectList elements
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "layout" |
| `layoutType` | `string` | Yes | Must be "section" |
| `id` | `string` | Yes | Unique identifier for the section |
| `title` | `string` | No | Section title |
| `subtitle` | `string` | No | Optional subtitle or description |
| `collapsable` | boolean | No | If true, section can be collapsed/expanded |
| `items` | array | Yes | Array of row elements or object list elements |

#### Row

A horizontal arrangement of form fields, with optional width distribution.

```json
{
  "type": "layout",
  "layoutType": "row",
  "id": "nameRow",
  "widths": [50, 50],
  "items": [
    // Field elements
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "layout" |
| `layoutType` | `string` | Yes | Must be "row" |
| `id` | `string` | Yes | Unique identifier for the row |
| `widths` | array | No | Array of percentage widths for each item (must sum to 100) |
| `items` | array | Yes | Array of field elements |

#### Object List

A repeatable group of fields that allows users to add multiple entries of the same structure.

```json
{
  "type": "object-list",
  "id": "addressList",
  "title": "Addresses",
  "subtitle": "Add all your addresses",
  "propertyPath": "addresses",
  "items": [
    // Row or Section elements to be repeated
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "object-list" |
| `id` | `string` | Yes | Unique identifier for the object list |
| `title` | `string` | No | Title displayed for the list |
| `subtitle` | `string` | No | Optional subtitle or description |
| `propertyPath` | `string` | Yes | Path where the array of objects will be stored |
| `items` | array | Yes | Array of row or section elements to be repeated |

### Form Field Elements

#### Text Input

Single-line text input field.

```json
{
  "type": "field",
  "fieldType": "input",
  "inputType": "text",
  "id": "firstName",
  "title": "First Name",
  "propertyPath": "firstName",
  "placeholder": "Enter your first name",
  "helperText": "Your legal first name as it appears on your ID",
  "validations": [
    {
      "type": "minLen",
      "val": 2,
      "message": "First name must be at least 2 characters"
    }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "input" |
| `inputType` | `string` | Yes | One of: "text", "email", "password", "tel", "url", "number" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Field label |
| `propertyPath` | `string` | Yes | Path where the value will be stored |
| `placeholder` | `string` | No | Placeholder text |
| `helperText` | `string` | No | Help text displayed below the field |
| `multiline` | `number` | No | Number of lines for multiline text input (only for inputType "text") |
| `defaultValue` | `string/number` | No | Default value for the field |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | array | No | Array of [validation](#validation) rules |

#### Textarea

Multi-line text input field.

```json
{
  "type": "field",
  "fieldType": "textarea",
  "id": "description",
  "title": "Description",
  "propertyPath": "description",
  "placeholder": "Enter a detailed description...",
  "helperText": "Provide as much detail as possible"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "input" |
| `inputType` | `string` | Yes | One of: "text", "email", "password", "tel", "url", "number" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Field label |
| `propertyPath` | `string` | Yes | Path where the value will be stored |
| `placeholder` | `string` | No | Placeholder text |
| `helperText` | `string` | No | Help text displayed below the field |
| `multiline` | `number` | No | Number of lines for multiline text input (only for inputType "text") |
| `default` | `string` \| `number` | No | Default value for the field |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Textarea

Multi-line text input field.

```json
{
  "type": "field",
  "fieldType": "textarea",
  "id": "description",
  "title": "Description",
  "propertyPath": "description",
  "placeholder": "Enter a detailed description...",
  "helperText": "Provide as much detail as possible"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "textarea" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `placeholder` | `string` | No | Placeholder text |
| `helperText` | `string` | No | Help text displayed below the field |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | array | No | Array of [validation](#validation) rules |

#### Select

Dropdown selection field for choosing one option from a list.

```json
{
  "type": "field",
  "fieldType": "select",
  "id": "country",
  "title": "Country",
  "propertyPath": "country",
  "placeholder": "Select your country",
  "options": {
    "type": "static",
    "items": [
      { "label": "United States", "value": "us" },
      { "label": "Canada", "value": "ca" },
      { "label": "United Kingdom", "value": "uk" }
    ]
  },
  "defaultValue": "us"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "select" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `placeholder` | `string` | No | Placeholder text |
| `helperText` | `string` | No | Help text displayed below the field |
| `multiple` | `boolean` | No | When true, allows multiple selections |
| `options` | object | Yes | Configuration for select options |
| `options.type` | `string` | Yes | Type of options source (e.g., "static") |
| `options.items` | [Option Item](#option-item)[] | Yes | Array of option items with label and value |
| `default` | `string` | No | Default selected value |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Radio

Radio button group for selecting one option from a list.

```json
{
  "type": "field",
  "fieldType": "radio",
  "id": "gender",
  "title": "Gender",
  "propertyPath": "gender",
  "options": {
    "type": "static",
    "items": [
      { "label": "Male", "value": "male" },
      { "label": "Female", "value": "female" },
      { "label": "Non-binary", "value": "non-binary" },
      { "label": "Prefer not to say", "value": "not-specified" }
    ]
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "radio" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `options` | object | Yes | Configuration for radio options |
| `options.type` | `string` | Yes | Type of options source (e.g., "static") |
| `options.items` | [Option Item](#option-item)[] | Yes | Array of option items with label and value |
| `defaultValue` | `string` | No | Default selected value |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Checkbox

Multiple-selection checkbox group.

```json
{
  "type": "field",
  "fieldType": "checkbox",
  "id": "hobbies",
  "title": "Hobbies",
  "propertyPath": "hobbies",
  "options": {
    "type": "static",
    "items": [
      { "label": "Reading", "value": "reading" },
      { "label": "Sports", "value": "sports" },
      { "label": "Music", "value": "music" },
      { "label": "Travel", "value": "travel" }
    ]
  },
  "helperText": "Select all that apply"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "checkbox" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `options` | object | Yes | Configuration for checkbox options |
| `options.type` | `string` | Yes | Type of options source (e.g., "static") |
| `options.items` | [Option Item](#option-item)[] | Yes | Array of option items with label and value |
| `defaultValue` | string[] | No | Default selected values |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Date

Date picker field.

```json
{
  "type": "field",
  "fieldType": "date",
  "id": "birthDate",
  "title": "Date of Birth",
  "propertyPath": "birthDate",
  "validations": [
    // ...date validations
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "date" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `max` | `string` | No | Maximum date allowed |
| `min` | `string` | No | Minimum date allowed |
| `onlyFuture` | `boolean` | No | When true, only future dates are allowed |
| `onlyPast` | `boolean` | No | When true, only past dates are allowed |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Time

Time picker field for selecting time values only.

```json
{
  "type": "field",
  "fieldType": "time",
  "id": "appointmentTime",
  "title": "Appointment Time",
  "propertyPath": "appointmentTime",
  "helperText": "Select your preferred time"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "time" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### DateTime

Date and time picker field.

```json
{
  "type": "field",
  "fieldType": "datetime",
  "id": "appointmentDateTime",
  "title": "Appointment Date & Time",
  "propertyPath": "appointmentDateTime",
  "onlyFuture": true,
  "validations": [
    // ...date time validations
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "datetime" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `max` | `string` | No | Maximum date and time allowed (UTC) |
| `min` | `string` | No | Minimum date and time allowed (UTC) |
| `onlyFuture` | `boolean` | No | When true, only future date-times are allowed |
| `onlyPast` | `boolean` | No | When true, only past date-times are allowed |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Radio Binary

A binary radio field for simple yes/no questions with boolean values.

```json
{
  "type": "field",
  "fieldType": "radio-binary",
  "id": "isPep",
  "title": "Are you a Politically Exposed Person (PEP)?",
  "propertyPath": "isPep",
  "defaultValue": false
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "radio-binary" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `defaultValue` | `boolean` | No | Default boolean value |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### Switch

Toggle switch for boolean values.

```json
{
  "type": "field",
  "fieldType": "switch",
  "id": "newsletter",
  "title": "Subscribe to newsletter",
  "propertyPath": "newsletter",
  "options": {
    "type": "static",
    "items": [
      { "label": "Yes", "value": "true" },
      { "label": "No", "value": "false" }
    ]
  },
  "default": "true"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "switch" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `options` | object | Yes | Configuration for switch options |
| `options.type` | `string` | Yes | Type of options source (e.g., "static") |
| `options.items` | [Option Item](#option-item)[] | Yes | Array of option items with label and value |
| `defaultValue` | `string` | No | Default switch state value |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

#### File Upload

File upload field for document or image uploads.

```json
{
  "type": "field",
  "fieldType": "file-upload",
  "id": "idDocument",
  "title": "Identity Document",
  "propertyPath": "idDocument",
  "helperText": "Upload a scan of your ID",
  "accept": ["image/*", "application/pdf"],
  "maxSize": {
    "value": 5,
    "unit": "MB"
  },
  "multiple": true,
  "validations": [
    {
      "type": "file",
      "maxSize": 5242880,
      "acceptedFormats": ["image/jpeg", "image/png", "application/pdf"],
      "message": "Only JPG, PNG, or PDF files are accepted (max 5MB)"
    }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | Yes | Must be "field" |
| `fieldType` | `string` | Yes | Must be "file-upload" |
| `id` | `string` | Yes | Unique identifier for the field |
| `title` | `string` | Yes | Label displayed for the field |
| `propertyPath` | `string` | Yes | Path to the property in the form data |
| `helperText` | `string` | No | Help text displayed below the field |
| `accept` | array | No | Array of accepted MIME types or file extensions |
| `maxSize` | object | No | Maximum file size configuration |
| `maxSize.value` | `number` | Yes | Size value (if maxSize is provided) |
| `maxSize.unit` | `string` | Yes | Size unit: "B", "KB", "MB", or "GB" (if maxSize is provided) |
| `multiple` | `boolean` | No | When true, allows multiple file uploads |
| `required` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is required |
| `hide` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is hidden |
| `disable` | `boolean` \| [Condition](#conditions) | No | When true or condition is met, field is disabled |
| `validations` | [Validations](#validation)[] | No | Array of [validation](#validation) rules |

## Validation

Validations define rules that input values must satisfy. Different field types support different validation types.

### String Validations

```json
"validations": [
  {
    "type": "minLen",
    "val": 8,
    "message": "Password must be at least 8 characters"
  },
  {
    "type": "maxLen",
    "val": 100,
    "message": "Description cannot exceed 100 characters"
  },
  {
    "type": "pattern",
    "val": "^[A-Za-z0-9]+$",
    "message": "Only alphanumeric characters are allowed"
  }
]
```

### Number Validations

```json
"validations": [
  {
    "type": "min",
    "val": 18,
    "message": "Age must be at least 18"
  },
  {
    "type": "max",
    "val": 100,
    "message": "Age cannot exceed 100"
  }
]
```

### Date Validations

```json
"validations": [
  {
    "type": "dateRange",
    "min": "2023-01-01",
    "max": "__today__",
    "message": "Date must be between January 1, 2023 and today"
  },
  {
    "type": "dateRange",
    "min": "__today__",
    // max date is 1 year, 2 days, and -1 month from today
    "max": { "init": "__today__", "offset": { "yrs": 1, "dys": 2, "mnts": -1, } },
    "message": "Date must be between today and one year from now"
  },
]
```

### DateTime Validations

```json
"validations": [
  {
    "type": "dateTimeRange",
    // desc: min date is 35 seconds ago, 10 minutes ago, 1 hour ago, 2 days ago, 1 month ago, 1 year ago from now; max date is now
    "min": { 
      "init": "__now__", 
      "offset": {
        "secs": -35,
        "mins": 10,
        "hrs": 1,
        "dys": 2,
        "mnts": -1,
        "yrs": -1,
      } 
    },
    "max": "__now__",
    "message": "Date-time must be between January 1, 2023 and now"
  },
]
```

### File Validations

```json
"validations": [
  {
    "type": "file",
    "maxSize": 5242880,
    "acceptedFormats": ["image/jpeg", "image/png", "application/pdf"],
    "message": "Please upload a JPG, PNG, or PDF file under 5MB"
  }
]
```

### Selection Validations

```json
"validations": [
  {
    "type": "noOfOptions",
    "min": 2,
    "max": 5,
    "message": "Please select between 2 and 5 options"
  }
]
```

### Conditional Validations

```json
"validations": [
  {
    "type": "condition",
    "message": "Required when status is 'active'",
    "val": ["status", "active", "EQ"]
  }
]
```

### Custom Function Validations

```json
"validations": [
  {
    "type": "customFunc",
    "functionId": "checkUsernameAvailability",
    "message": "This username is already taken"
  },
  {
    "type": "customFunc",
    "functionId": "validatePasswordComplexity",
    "message": "Password must include uppercase, lowercase, number, and special character"
  }
]
```

## Conditions

Conditions allow you to create dynamic behaviors based on form values. They can be used to:

- Show/hide fields conditionally
- Make fields required or optional based on other field values
- Disable/enable fields dynamically
- Control form flow and validation logic

### Single Condition

A single condition can be either rule-based or function-based:

#### Rule-based Condition

Rule-based conditions use a tuple format: `[leftOperand, rightOperand, operator]`

- **Left Operand**: Can be a string, number, or boolean value (often a field reference like `"{{fieldName}}"`)
- **Right Operand**: Can be a string, number, boolean, or arrays of these types
- **Operator**: Comparison operator (see [Operators](#operators) section)

```json
// Basic condition: age greater than 18
["{{person.age}}", 18, "GT"]

// Reference another field's value
["{{firstName}}", "{{lastName}}", "EQ"]

// Check against multiple values (array)
["{{country}}", ["US", "CA", "UK"], "IN"]

// Self-reference condition (empty property path uses current field)
["", "active", "EQ"]

// Boolean comparison
[true, "{{isActive}}", "EQ"]
```

#### Function-based Condition

Function-based conditions allow for complex custom logic:

```json
{
  "functionId": "isUserLoggedIn"
}
```

```json
{
  "functionId": "validateComplexBusinessRule"
}
```

### Multiple Conditions (AND/OR Logic)

For complex scenarios, you can combine multiple conditions using logical operators:

```json
{
  "type": "AND",
  "conditions": [
    ["{{age}}", 18, "GT"],
    ["{{country}}", "USA", "EQ"]
  ]
}
```

```json
{
  "type": "OR",
  "conditions": [
    ["{{subscription}}", "premium", "EQ"],
    ["{{referralCode}}", "", "NEQ"]
  ]
}
```

#### Condition Combination Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `"AND"` \| `"OR"` | No | Logical operator (defaults to `"AND"`) |
| `conditions` | [Condition](#conditions)[] | Yes | Array of conditions to evaluate |

#### Complex Nested Example

```json
{
  "type": "OR",
  "conditions": [
    ["{{userType}}", "premium", "EQ"],
    {
      "functionId": "hasSpecialAccess"
    },
    ["{{isAdmin}}", true, "EQ"]
  ]
}
```

## Operators

Operators define the comparison logic used in conditions:

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equal to | `["{{status}}", "active", "EQ"]` |
| `N_EQ` | Not equal to | `["{{status}}", "inactive", "N_EQ"]` |
| `IN` | Value is in a list | `["{{country}}", ["US", "CA", "UK"], "IN"]` |
| `N_IN` | Value is not in a list | `["{{country}}", ["CN", "RU"], "N_IN"]` |
| `GT` | Greater than | `["{{age}}", 18, "GT"]` |
| `GTE` | Greater than or equal to | `["{{score}}", 60, "GTE"]` |
| `LT` | Less than | `["{{price}}", 100, "LT"]` |
| `LTE` | Less than or equal to | `["{{quantity}}", 10, "LTE"]` |
| `EMP` | Is empty | `["{{comments}}", "", "EMP"]` |
| `N_EMP` | Is not empty | `["{{email}}", "", "N_EMP"]` |
| `BTW` | Between (inclusive) | `["{{age}}", [18, 65], "BTW"]` |
| `HAS` | Contains (substring match) | `["{{description}}", "urgent", "HAS"]` |

## Options

Options provide the available choices for select, radio, and checkbox fields.

### Option Item

Each option item follows this structure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Display text shown to the user |
| `value` | `string` \| `number` \| `boolean` | Yes | Actual value stored when selected |

```json
{
  "label": "Display Text",
  "value": "stored_value"
}
```

### Static Options

Options defined directly in the schema:

```json
"options": {
  "type": "static",
  "items": [
    { "label": "Male", "value": "male" },
    { "label": "Female", "value": "female" },
    { "label": "Non-binary", "value": "non-binary" },
    { "label": "Prefer not to say", "value": "not-specified" }
  ],
  "defaultValue": "not-specified"
}
```

#### Static Options Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | "static" | Yes | Specifies that options are defined inline |
| `items` | [Option Item](#option-item)[] | Yes | Array of option items |
| `defaultValue` | string | No | Default selected value |

### Dynamic Options

Options loaded from an API endpoint:

```json
"options": {
  "type": "dynamic",
  "url": "https://api.example.com/countries",
  "processor": "options_countryFormatter"
}
```

For dependent dropdowns, you can reference other field values in the URL:

```json
"options": {
  "type": "dynamic",
  "url": "https://api.example.com/states?country=${country}"
}
```

#### Dynamic Options Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | "dynamic" | Yes | Specifies that options are loaded from API |
| `url` | string | Yes | API endpoint URL to fetch options |
| `processor` | string | No | Custom function ID to process API response into [Option Items](#option-item)[] |

> **Note**: The API response should return an array of [Option Items](#option-item)[], or if using a `processor`, the processor function should transform the response into the required format.

## Complete Form Example

Here's a complete example of a multi-step form for collecting customer information:

```json
{
  "id":"kyc-form",
  "type":"form",
  "multistep":true,
  "title":"KYC Registration Form",
  "subtitle":"Please provide your identification and verification details",
  "steps":[
    {
      "id":"personal-info-step",
      "type":"layout",
      "layoutType":"step",
      "title":"Personal Information",
      "subtitle":"Please provide your basic personal details",
      "sections":[
        {
          "id":"basic-details-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Basic Details",
          "subtitle":"Your identification information",
          "collapsable":true,
          "items":[
            {
              "id":"kyc-type-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                20,
                70
              ],
              "items":[
                {
                  "id":"kyc-type",
                  "type":"field",
                  "fieldType":"select",
                  "title":"KYC Type",
                  "propertyPath":"kycType",
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Full",
                        "value":"full"
                      },
                      {
                        "label":"Simplified",
                        "value":"simplified"
                      },
                      {
                        "label":"Enhanced",
                        "value":"enhanced"
                      }
                    ]
                  }
                },
                {
                  "id":"external-id",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"External ID",
                  "propertyPath":"externalId"
                }
              ]
            },
            {
              "id":"name-row",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "id":"first-name",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"First Name",
                  "propertyPath":"firstName",
                  "validations":[
                    {
                      "type":"maxLen",
                      "message":"First name should be at most 50 characters",
                      "val":5
                    }
                  ]
                },
                {
                  "id":"last-name",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Last Name",
                  "propertyPath":"lastName",
                  "validations":[
                    {
                      "type":"maxLen",
                      "message":"Last name should be at most 50 characters",
                      "val":50
                    }
                  ]
                }
              ]
            },
            {
              "id":"birth-details-row",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "id":"date-of-birth",
                  "type":"field",
                  "fieldType":"date",
                  "title":"Date of Birth",
                  "propertyPath":"dateOfBirth",
                  "required":true
                },
                {
                  "id":"birth-country",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Country of Birth",
                  "propertyPath":"birthCountry",
                  "required":true,
                  "options":{
                    "type":"dynamic",
                    "url":"https://nformify-service.qa.niumops.com/nformify-service/api/v1/clients/4e94fbc0-db3e-4adb-a455-c30596601746/constants?region=SG&customerType=CORPORATE&categories=countryName",
                    "processor":"options_extractCountryNames"
                  }
                }
              ]
            },
            {
              "id":"contact-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                60,
                40
              ],
              "items":[
                {
                  "id":"email",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"email",
                  "title":"Email Address",
                  "propertyPath":"email",
                  "required":true,
                  "validations":[
                    {
                      "type":"pattern",
                      "message":"Please enter a valid email address",
                      "val":"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                    }
                  ]
                },
                {
                  "id":"website",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"url",
                  "title":"Website",
                  "propertyPath":"website",
                  "validations":[
                    {
                      "type":"pattern",
                      "message":"Please enter a valid website URL",
                      "val":"^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\/[a-zA-Z0-9._%+-]*)*$"
                    }
                  ]
                }
              ]
            },
            {
              "id":"mobile-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                30,
                70
              ],
              "items":[
                {
                  "id":"mobile-country-code",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Country Code",
                  "propertyPath":"mobileCountryCode",
                  "required":true,
                  "validations":[
                    {
                      "type":"pattern",
                      "message":"Please enter a valid country code",
                      "val":"^[0-9]{1,4}$"
                    }
                  ]
                },
                {
                  "id":"mobile",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"tel",
                  "title":"Mobile Number",
                  "propertyPath":"mobile",
                  "required":true,
                  "validations":[
                    {
                      "type":"pattern",
                      "message":"Please enter digits only with length between 6 to 15",
                      "val":"^[0-9]{6,15}$"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id":"nationality-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Nationality & Region",
          "items":[
            {
              "id":"nationality-row",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "id":"nationality",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Nationality",
                  "propertyPath":"nationality",
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"French",
                        "value":"FR"
                      },
                      {
                        "label":"Danish",
                        "value":"DK"
                      },
                      {
                        "label":"German",
                        "value":"DE"
                      },
                      {
                        "label":"British",
                        "value":"GB"
                      }
                    ]
                  }
                },
                {
                  "id":"region",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Region",
                  "propertyPath":"region",
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"European Union",
                        "value":"EU"
                      },
                      {
                        "label":"Asia Pacific",
                        "value":"APAC"
                      },
                      {
                        "label":"North America",
                        "value":"NA"
                      },
                      {
                        "label":"Latin America",
                        "value":"LATAM"
                      }
                    ]
                  }
                }
              ]
            },
            {
              "id":"pep-row",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "id":"is-pep",
                  "type":"field",
                  "fieldType":"switch",
                  "title":"Politically Exposed Person (PEP)",
                  "propertyPath":"isPep",
                  "subtitle":"Are you a politically exposed person or related to one?",
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Yes",
                        "value":"true"
                      }
                    ]
                  }
                }
              ]
            },
            {
              "id":"files-upload",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "type":"field",
                  "fieldType":"file-upload",
                  "inputType":"upload",
                  "title":"Upload Document",
                  "required":true,
                  "multiple":true,
                  "propertyPath":"files",
                  "id":"files-upload",
                  "accept":[
                    ".pdf",
                    ".docx",
                    ".png",
                    ".jpg",
                    ".jpeg"
                  ],
                  "maxSize":{
                    "value":5,
                    "unit":"MB"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id":"tax-details-step",
      "type":"layout",
      "layoutType":"step",
      "title":"Tax & Business Information",
      "subtitle":"Please provide tax and business details",
      "sections":[
        {
          "id":"tax-details-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Tax Information",
          "subtitle":"Your tax registration details",
          "collapsable":true,
          "items":[
            {
              "id":"tax-details-list",
              "type":"object-list",
              "title":"Tax Details",
              "subtitle":"Add your tax registration information",
              "propertyPath":"taxDetails",
              "items":[
                {
                  "type":"layout",
                  "layoutType":"row",
                  "widths":[
                    50,
                    50
                  ],
                  "id":"tax-details-row",
                  "items":[
                    {
                      "id":"tax-country",
                      "type":"field",
                      "fieldType":"select",
                      "title":"Tax Country",
                      "propertyPath":"taxCountry",
                      "required":true,
                      "options":{
                        "type":"static",
                        "items":[
                          {
                            "label":"France",
                            "value":"FR"
                          },
                          {
                            "label":"Denmark",
                            "value":"DK"
                          },
                          {
                            "label":"Germany",
                            "value":"DE"
                          },
                          {
                            "label":"United Kingdom",
                            "value":"GB"
                          }
                        ]
                      }
                    },
                    {
                      "id":"tax-number",
                      "type":"field",
                      "fieldType":"input",
                      "inputType":"text",
                      "title":"Tax Number",
                      "propertyPath":"taxNumber",
                      "required":true,
                      "validations":[
                        {
                          "type":"minLen",
                          "message":"Tax number must be at least 5 characters",
                          "val":5
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id":"business-details-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Business Information",
          "subtitle":"Details about your business activities",
          "collapsable":true,
          "items":[
            {
              "id":"nature-of-business-row",
              "type":"layout",
              "layoutType":"row",
              "items":[
                {
                  "id":"industry-codes",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Industry Codes",
                  "propertyPath":"natureOfBusiness.industryCodes",
                  "multiple":true,
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Financial Services (IS134)",
                        "value":"IS134"
                      },
                      {
                        "label":"Information Technology (IS140)",
                        "value":"IS140"
                      },
                      {
                        "label":"Retail and Wholesale (IS220)",
                        "value":"IS220"
                      },
                      {
                        "label":"Manufacturing (IS310)",
                        "value":"IS310"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id":"address-details-step",
      "type":"layout",
      "layoutType":"step",
      "title":"Address Information",
      "subtitle":"Please provide your billing address details",
      "sections":[
        {
          "id":"billing-address-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Billing Address",
          "subtitle":"Your primary billing address",
          "collapsable":true,
          "items":[
            {
              "id":"address-line-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"address-line1",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Address Line 1",
                  "propertyPath":"billingAddress.addressLine1",
                  "required":true,
                  "validations":[
                    {
                      "type":"maxLen",
                      "message":"Address should be at most 100 characters",
                      "val":100
                    }
                  ]
                },
                {
                  "id":"address-line2",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Address Line 2",
                  "propertyPath":"billingAddress.addressLine2",
                  "validations":[
                    {
                      "type":"maxLen",
                      "message":"Address should be at most 100 characters",
                      "val":100
                    }
                  ]
                }
              ]
            },
            {
              "id":"city-state-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"city",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"City",
                  "propertyPath":"billingAddress.city",
                  "required":true
                },
                {
                  "id":"state",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"State/Province",
                  "propertyPath":"billingAddress.state",
                  "required":true
                }
              ]
            },
            {
              "id":"postcode-country-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"postcode",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Postal Code",
                  "propertyPath":"billingAddress.postcode",
                  "required":true,
                  "validations":[
                    {
                      "type":"pattern",
                      "message":"Please enter a valid postal code",
                      "val":"^[a-zA-Z0-9 -]{3,10}$"
                    }
                  ]
                },
                {
                  "id":"country",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Country",
                  "propertyPath":"billingAddress.country",
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Denmark",
                        "value":"DK"
                      },
                      {
                        "label":"France",
                        "value":"FR"
                      },
                      {
                        "label":"Germany",
                        "value":"DE"
                      },
                      {
                        "label":"United Kingdom",
                        "value":"GB"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id":"bank-account-step",
      "type":"layout",
      "layoutType":"step",
      "title":"Bank Account Details",
      "subtitle":"Please provide your banking information",
      "sections":[
        {
          "id":"bank-account-section",
          "type":"layout",
          "layoutType":"section",
          "title":"Bank Account Information",
          "subtitle":"Your primary bank account details",
          "collapsable":true,
          "items":[
            {
              "id":"bank-name-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"bank-name",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Bank Name",
                  "propertyPath":"bankAccountDetails.bankName",
                  "required":true
                },
                {
                  "id":"account-name",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Account Holder Name",
                  "propertyPath":"bankAccountDetails.accountName",
                  "required":true
                }
              ]
            },
            {
              "id":"account-details-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"account-number",
                  "type":"field",
                  "fieldType":"input",
                  "inputType":"text",
                  "title":"Account Number",
                  "propertyPath":"bankAccountDetails.accountNumber",
                  "required":true
                },
                {
                  "id":"account-type",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Account Type",
                  "propertyPath":"bankAccountDetails.bankAccountType",
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Savings",
                        "value":"saving"
                      },
                      {
                        "label":"Checking",
                        "value":"checking"
                      },
                      {
                        "label":"Current",
                        "value":"current"
                      }
                    ]
                  }
                }
              ]
            },
            {
              "id":"bank-country-currency-row",
              "type":"layout",
              "layoutType":"row",
              "widths":[
                50,
                50
              ],
              "items":[
                {
                  "id":"bank-country",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Bank Country",
                  "propertyPath":"bankAccountDetails.bankCountry",
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Hong Kong",
                        "value":"HK"
                      },
                      {
                        "label":"Denmark",
                        "value":"DK"
                      },
                      {
                        "label":"France",
                        "value":"FR"
                      },
                      {
                        "label":"United Kingdom",
                        "value":"GB"
                      }
                    ]
                  }
                },
                {
                  "id":"currency",
                  "type":"field",
                  "fieldType":"select",
                  "title":"Currency",
                  "propertyPath":"bankAccountDetails.currency",
                  "required":true,
                  "options":{
                    "type":"static",
                    "items":[
                      {
                        "label":"Hong Kong Dollar (HKD)",
                        "value":"HKD"
                      },
                      {
                        "label":"Euro (EUR)",
                        "value":"EUR"
                      },
                      {
                        "label":"US Dollar (USD)",
                        "value":"USD"
                      },
                      {
                        "label":"British Pound (GBP)",
                        "value":"GBP"
                      }
                    ]
                  }
                }
              ]
            },
            {
              "id":"routing-codes-list",
              "type":"object-list",
              "title":"Routing Codes",
              "subtitle":"Add your bank routing information",
              "propertyPath":"bankAccountDetails.routingCodes",
              "items":[
                {
                  "type":"layout",
                  "layoutType":"row",
                  "widths":[
                    40,
                    60
                  ],
                  "id":"routing-code-row",
                  "items":[
                    {
                      "id":"routing-type",
                      "type":"field",
                      "fieldType":"select",
                      "title":"Routing Code Type",
                      "propertyPath":"type",
                      "required":true,
                      "options":{
                        "type":"static",
                        "items":[
                          {
                            "label":"SWIFT",
                            "value":"swift"
                          },
                          {
                            "label":"IBAN",
                            "value":"iban"
                          },
                          {
                            "label":"Routing Number",
                            "value":"routing"
                          },
                          {
                            "label":"Sort Code",
                            "value":"sort"
                          }
                        ]
                      }
                    },
                    {
                      "id":"routing-value",
                      "type":"field",
                      "fieldType":"input",
                      "inputType":"text",
                      "title":"Routing Code Value",
                      "propertyPath":"value",
                      "required":true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

This documentation provides a comprehensive guide to creating form schemas for the **Forge Froms**. For specific implementations or more complex use cases, please contact the development team.
