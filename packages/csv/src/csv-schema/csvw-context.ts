/**
 * Holds CSV on the Web JSON-LD metadata context from https://www.w3.org/ns/csvw.jsonld
 */
export const csvwContext = {
  "@context": {
    "as": "https://www.w3.org/ns/activitystreams#",
    "cc": "http://creativecommons.org/ns#",
    "csvw": "http://www.w3.org/ns/csvw#",
    "ctag": "http://commontag.org/ns#",
    "dc": "http://purl.org/dc/terms/",
    "dc11": "http://purl.org/dc/elements/1.1/",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "dctypes": "http://purl.org/dc/dcmitype/",
    "dqv": "http://www.w3.org/ns/dqv#",
    "duv": "https://www.w3.org/TR/vocab-duv#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "gr": "http://purl.org/goodrelations/v1#",
    "grddl": "http://www.w3.org/2003/g/data-view#",
    "ical": "http://www.w3.org/2002/12/cal/icaltzd#",
    "ldp": "http://www.w3.org/ns/ldp#",
    "ma": "http://www.w3.org/ns/ma-ont#",
    "oa": "http://www.w3.org/ns/oa#",
    "og": "http://ogp.me/ns#",
    "org": "http://www.w3.org/ns/org#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "prov": "http://www.w3.org/ns/prov#",
    "qb": "http://purl.org/linked-data/cube#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "rev": "http://purl.org/stuff/rev#",
    "rif": "http://www.w3.org/2007/rif#",
    "rr": "http://www.w3.org/ns/r2rml#",
    "schema": "http://schema.org/",
    "sd": "http://www.w3.org/ns/sparql-service-description#",
    "sioc": "http://rdfs.org/sioc/ns#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "skosxl": "http://www.w3.org/2008/05/skos-xl#",
    "v": "http://rdf.data-vocabulary.org/#",
    "vcard": "http://www.w3.org/2006/vcard/ns#",
    "void": "http://rdfs.org/ns/void#",
    "wdr": "http://www.w3.org/2007/05/powder#",
    "wrds": "http://www.w3.org/2007/05/powder-s#",
    "xhv": "http://www.w3.org/1999/xhtml/vocab#",
    "xml": "rdf:XMLLiteral",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "json": "csvw:JSON",
    "any": "xsd:anyAtomicType",
    "anyAtomicType": "xsd:anyAtomicType",
    "binary": "xsd:base64Binary",
    "datetime": "xsd:dateTime",
    "describedby": "wrds:describedby",
    "html": "rdf:HTML",
    "license": "xhv:license",
    "maximum": "csvw:maxInclusive",
    "minimum": "csvw:minInclusive",
    "number": "xsd:double",
    "role": "xhv:role",
    "anyURI": "xsd:anyURI",
    "base64Binary": "xsd:base64Binary",
    "boolean": "xsd:boolean",
    "byte": "xsd:byte",
    "date": "xsd:date",
    "dateTime": "xsd:dateTime",
    "dayTimeDuration": "xsd:dayTimeDuration",
    "dateTimeStamp": "xsd:dateTimeStamp",
    "decimal": "xsd:decimal",
    "double": "xsd:double",
    "duration": "xsd:duration",
    "float": "xsd:float",
    "gDay": "xsd:gDay",
    "gMonth": "xsd:gMonth",
    "gMonthDay": "xsd:gMonthDay",
    "gYear": "xsd:gYear",
    "gYearMonth": "xsd:gYearMonth",
    "hexBinary": "xsd:hexBinary",
    "int": "xsd:int",
    "integer": "xsd:integer",
    "language": "xsd:language",
    "long": "xsd:long",
    "Name": "xsd:Name",
    "NCName": "xsd:NCName",
    "NMTOKEN": "xsd:NMTOKEN",
    "negativeInteger": "xsd:negativeInteger",
    "nonNegativeInteger": "xsd:nonNegativeInteger",
    "nonPositiveInteger": "xsd:nonPositiveInteger",
    "normalizedString": "xsd:normalizedString",
    "positiveInteger": "xsd:positiveInteger",
    "QName": "xsd:QName",
    "short": "xsd:short",
    "string": "xsd:string",
    "time": "xsd:time",
    "token": "xsd:token",
    "unsignedByte": "xsd:unsignedByte",
    "unsignedInt": "xsd:unsignedInt",
    "unsignedLong": "xsd:unsignedLong",
    "unsignedShort": "xsd:unsignedShort",
    "yearMonthDuration": "xsd:yearMonthDuration",
    "Cell": "csvw:Cell",
    "Column": "csvw:Column",
    "Datatype": "csvw:Datatype",
    "Dialect": "csvw:Dialect",
    "Direction": "csvw:Direction",
    "ForeignKey": "csvw:ForeignKey",
    "NumericFormat": "csvw:NumericFormat",
    "Row": "csvw:Row",
    "Schema": "csvw:Schema",
    "Table": "csvw:Table",
    "TableGroup": "csvw:TableGroup",
    "TableReference": "csvw:TableReference",
    "Transformation": "csvw:Transformation",
    "aboutUrl": {
      "@id": "csvw:aboutUrl",
      "@type": "csvw:uriTemplate"
    },
    "base": {
      "@id": "csvw:base",
      "@language": null
    },
    "columnReference": {
      "@id": "csvw:columnReference",
      "@language": null,
      "@container": "@list"
    },
    "columns": {
      "@id": "csvw:column",
      "@type": "@id",
      "@container": "@list"
    },
    "commentPrefix": {
      "@id": "csvw:commentPrefix",
      "@language": null
    },
    "datatype": {
      "@id": "csvw:datatype",
      "@type": "@vocab"
    },
    "decimalChar": {
      "@id": "csvw:decimalChar",
      "@language": null
    },
    "default": {
      "@id": "csvw:default",
      "@language": null
    },
    "describes": {
      "@id": "csvw:describes"
    },
    "delimiter": {
      "@id": "csvw:delimiter",
      "@language": null
    },
    "dialect": {
      "@id": "csvw:dialect",
      "@type": "@id"
    },
    "doubleQuote": {
      "@id": "csvw:doubleQuote",
      "@type": "xsd:boolean"
    },
    "encoding": {
      "@id": "csvw:encoding",
      "@language": null
    },
    "foreignKeys": {
      "@id": "csvw:foreignKey",
      "@type": "@id"
    },
    "format": {
      "@id": "csvw:format",
      "@language": null
    },
    "groupChar": {
      "@id": "csvw:groupChar",
      "@type": "NumericFormat,xsd:string"
    },
    "header": {
      "@id": "csvw:header",
      "@type": "xsd:boolean"
    },
    "headerRowCount": {
      "@id": "csvw:headerRowCount",
      "@type": "xsd:nonNegativeInteger"
    },
    "lang": {
      "@id": "csvw:lang",
      "@language": null
    },
    "length": {
      "@id": "csvw:length",
      "@type": "xsd:nonNegativeInteger"
    },
    "lineTerminators": {
      "@id": "csvw:lineTerminators",
      "@language": null
    },
    "maxExclusive": {
      "@id": "csvw:maxExclusive",
      "@type": "xsd:integer"
    },
    "maxInclusive": {
      "@id": "csvw:maxInclusive",
      "@type": "xsd:integer"
    },
    "maxLength": {
      "@id": "csvw:maxLength",
      "@type": "xsd:nonNegativeInteger"
    },
    "minExclusive": {
      "@id": "csvw:minExclusive",
      "@type": "xsd:integer"
    },
    "minInclusive": {
      "@id": "csvw:minInclusive",
      "@type": "xsd:integer"
    },
    "minLength": {
      "@id": "csvw:minLength",
      "@type": "xsd:nonNegativeInteger"
    },
    "name": {
      "@id": "csvw:name",
      "@language": null
    },
    "notes": {
      "@id": "csvw:note"
    },
    "null": {
      "@id": "csvw:null",
      "@language": null
    },
    "ordered": {
      "@id": "csvw:ordered",
      "@type": "xsd:boolean"
    },
    "pattern": {
      "@id": "csvw:pattern",
      "@language": null
    },
    "primaryKey": {
      "@id": "csvw:primaryKey",
      "@language": null
    },
    "propertyUrl": {
      "@id": "csvw:propertyUrl",
      "@type": "csvw:uriTemplate"
    },
    "quoteChar": {
      "@id": "csvw:quoteChar",
      "@language": null
    },
    "reference": {
      "@id": "csvw:reference",
      "@type": "@id"
    },
    "referencedRows": {
      "@id": "csvw:referencedRow"
    },
    "required": {
      "@id": "csvw:required",
      "@type": "xsd:boolean"
    },
    "resource": {
      "@id": "csvw:resource",
      "@type": "xsd:anyURI"
    },
    "row": {
      "@id": "csvw:row",
      "@type": "@id",
      "@container": "@set"
    },
    "rowTitles": {
      "@id": "csvw:rowTitle",
      "@language": null
    },
    "rownum": {
      "@id": "csvw:rownum",
      "@type": "xsd:integer"
    },
    "scriptFormat": {
      "@id": "csvw:scriptFormat",
      "@type": "xsd:anyURI"
    },
    "schemaReference": {
      "@id": "csvw:schemaReference",
      "@type": "xsd:anyURI"
    },
    "separator": {
      "@id": "csvw:separator",
      "@language": null
    },
    "skipBlankRows": {
      "@id": "csvw:skipBlankRows",
      "@type": "xsd:boolean"
    },
    "skipColumns": {
      "@id": "csvw:skipColumns",
      "@type": "xsd:nonNegativeInteger"
    },
    "skipInitialSpace": {
      "@id": "csvw:skipInitialSpace",
      "@type": "xsd:boolean"
    },
    "skipRows": {
      "@id": "csvw:skipRows",
      "@type": "xsd:nonNegativeInteger"
    },
    "source": {
      "@id": "csvw:source",
      "@language": null
    },
    "suppressOutput": {
      "@id": "csvw:suppressOutput",
      "@type": "xsd:boolean"
    },
    "tables": {
      "@id": "csvw:table",
      "@type": "@id",
      "@container": "@set"
    },
    "tableDirection": {
      "@id": "csvw:tableDirection",
      "@type": "@vocab"
    },
    "tableSchema": {
      "@id": "csvw:tableSchema",
      "@type": "@id"
    },
    "targetFormat": {
      "@id": "csvw:targetFormat",
      "@type": "xsd:anyURI"
    },
    "transformations": {
      "@id": "csvw:transformations",
      "@type": "@id"
    },
    "textDirection": {
      "@id": "csvw:textDirection",
      "@type": "@vocab"
    },
    "titles": {
      "@id": "csvw:title",
      "@container": "@language"
    },
    "trim": {
      "@id": "csvw:trim",
      "@type": "xsd:boolean"
    },
    "url": {
      "@id": "csvw:url",
      "@type": "xsd:anyURI"
    },
    "valueUrl": {
      "@id": "csvw:valueUrl",
      "@type": "csvw:uriTemplate"
    },
    "virtual": {
      "@id": "csvw:virtual",
      "@type": "xsd:boolean"
    },
    "JSON": "csvw:JSON",
    "uriTemplate": "csvw:uriTemplate"
  },
  "@graph": {
    "@context": {
      "id": "@id",
      "type": "@type",
      "dc:title": {
        "@container": "@language"
      },
      "dc:description": {
        "@container": "@language"
      },
      "dc:date": {
        "@type": "xsd:date"
      },
      "rdfs:comment": {
        "@container": "@language"
      },
      "rdfs:domain": {
        "@type": "@id"
      },
      "rdfs:label": {
        "@container": "@language"
      },
      "rdfs:range": {
        "@type": "@id"
      },
      "rdfs:seeAlso": {
        "@type": "@id"
      },
      "rdfs:subClassOf": {
        "@type": "@id"
      },
      "rdfs:subPropertyOf": {
        "@type": "@id"
      },
      "owl:equivalentClass": {
        "@type": "@vocab"
      },
      "owl:equivalentProperty": {
        "@type": "@vocab"
      },
      "owl:oneOf": {
        "@container": "@list",
        "@type": "@vocab"
      },
      "owl:imports": {
        "@type": "@id"
      },
      "owl:versionInfo": {
        "@type": "@id"
      },
      "owl:inverseOf": {
        "@type": "@vocab"
      },
      "owl:unionOf": {
        "@type": "@vocab",
        "@container": "@list"
      },
      "rdfs_classes": {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
      },
      "rdfs_properties": {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
      },
      "rdfs_datatypes": {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
      },
      "rdfs_instances": {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
      }
    },
    "@id": "http://www.w3.org/ns/csvw#",
    "@type": "owl:Ontology",
    "dc:title": {
      "en": "CSVW Namespace Vocabulary Terms"
    },
    "dc:description": {
      "en": "This document describes the RDFS vocabulary description used in the Metadata Vocabulary for Tabular Data [[tabular-metadata]] along with the default JSON-LD Context."
    },
    "dc:date": "2017-06-06",
    "owl:imports": [
      "http://www.w3.org/ns/prov"
    ],
    "owl:versionInfo": "https://github.com/w3c/csvw/commit/fcc9db20ba4de10e41e964eee1b5d01defa4c664",
    "rdfs:seeAlso": [
      "http://www.w3.org/TR/tabular-metadata"
    ],
    "rdfs_classes": [
      {
        "@id": "csvw:Cell",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Cell"
        },
        "rdfs:comment": {
          "en": "A Cell represents a cell at the intersection of a Row and a Column within a Table."
        }
      },
      {
        "@id": "csvw:Column",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Column Description"
        },
        "rdfs:comment": {
          "en": "A Column represents a vertical arrangement of Cells within a Table."
        }
      },
      {
        "@id": "csvw:Datatype",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Datatype"
        },
        "rdfs:comment": {
          "en": "Describes facets of a datatype."
        }
      },
      {
        "@id": "csvw:Dialect",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Dialect Description"
        },
        "rdfs:comment": {
          "en": "A Dialect Description provides hints to parsers about how to parse a linked file."
        }
      },
      {
        "@id": "csvw:Direction",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Direction"
        },
        "rdfs:comment": {
          "en": "The class of table/text directions."
        }
      },
      {
        "@id": "csvw:ForeignKey",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Foreign Key Definition"
        },
        "rdfs:comment": {
          "en": "Describes relationships between Columns in one or more Tables."
        }
      },
      {
        "@id": "csvw:NumericFormat",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Numeric Format"
        },
        "rdfs:comment": {
          "en": "If the datatype is a numeric type, the format property indicates the expected format for that number. Its value must be either a single string or an object with one or more properties."
        }
      },
      {
        "@id": "csvw:Row",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Row"
        },
        "rdfs:comment": {
          "en": "A Row represents a horizontal arrangement of cells within a Table."
        }
      },
      {
        "@id": "csvw:Schema",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Schema"
        },
        "rdfs:comment": {
          "en": "A Schema is a definition of a tabular format that may be common to multiple tables."
        }
      },
      {
        "@id": "csvw:Table",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Annotated Table"
        },
        "rdfs:comment": {
          "en": "An annotated table is a table that is annotated with additional metadata."
        }
      },
      {
        "@id": "csvw:TableGroup",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Group of Tables"
        },
        "rdfs:comment": {
          "en": "A Group of Tables comprises a set of Annotated Tables and a set of annotations that relate to those Tables."
        }
      },
      {
        "@id": "csvw:TableReference",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Table Reference"
        },
        "rdfs:comment": {
          "en": "An object property that identifies a referenced table and a set of referenced columns within that table."
        }
      },
      {
        "@id": "csvw:Transformation",
        "@type": "rdfs:Class",
        "rdfs:label": {
          "en": "Transformation Definition"
        },
        "rdfs:comment": {
          "en": "A Transformation Definition is a definition of how tabular data can be transformed into another format."
        }
      }
    ],
    "rdfs_properties": [
      {
        "@id": "csvw:aboutUrl",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "about URL"
        },
        "rdfs:comment": {
          "en": "A URI template property that MAY be used to indicate what a cell contains information about."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "csvw:uriTemplate"
      },
      {
        "@id": "csvw:base",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "base"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single string: a term defined in the default context representing a built-in datatype URL, as listed above."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:columnReference",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "column reference"
        },
        "rdfs:comment": {
          "en": "A column reference property that holds either a single reference to a column description object within this schema, or an array of references. These form the referencing columns for the foreign key definition."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:ForeignKey",
            "csvw:TableReference"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:column",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "column"
        },
        "rdfs:comment": {
          "en": "An array property of column descriptions as described in section 5.6 Columns."
        },
        "rdfs:domain": "csvw:Schema",
        "rdfs:range": "csvw:Column"
      },
      {
        "@id": "csvw:commentPrefix",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "comment prefix"
        },
        "rdfs:comment": {
          "en": "An atomic property that sets the comment prefix flag to the single provided value, which MUST be a string."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:datatype",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "datatype"
        },
        "rdfs:comment": {
          "en": "An object property that contains either a single string that is the main datatype of the values of the cell or a datatype description object. If the value of this property is a string, it MUST be one of the built-in datatypes defined in section 5.11.1 Built-in Datatypes or an absolute URL; if it is an object then it describes a more specialised datatype."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": {
          "owl:unionOf": [
            "csvw:Datatype",
            "xsd:string"
          ]
        }
      },
      {
        "@id": "csvw:decimalChar",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "decimal character"
        },
        "rdfs:comment": {
          "en": "A string whose value is used to represent a decimal point within the number."
        },
        "rdfs:domain": "csvw:NumericFormat",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:default",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "default"
        },
        "rdfs:comment": {
          "en": "An atomic property holding a single string that is used to create a default value for the cell in cases where the original string value is an empty string."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:describes",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "describes"
        },
        "rdfs:comment": {
          "en": "From IANA describes: The relationship A 'describes' B asserts that resource A provides a description of resource B. There are no constraints on the format or representation of either A or B, neither are there any further constraints on either resource."
        },
        "rdfs:domain": "csvw:Row"
      },
      {
        "@id": "csvw:delimiter",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "delimiter"
        },
        "rdfs:comment": {
          "en": "An atomic property that sets the delimiter flag to the single provided value, which MUST be a string."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:dialect",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "dialect"
        },
        "rdfs:comment": {
          "en": "An object property that provides a single dialect description. If provided, dialect provides hints to processors about how to parse the referenced files to create tabular data models for the tables in the group."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table"
          ]
        },
        "rdfs:range": "csvw:Dialect"
      },
      {
        "@id": "csvw:doubleQuote",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "double quote"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property that, if `true`, sets the escape character flag to `\"`."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:encoding",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "encoding"
        },
        "rdfs:comment": {
          "en": "An atomic property that sets the encoding flag to the single provided string value, which MUST be a defined in [[encoding]]. The default is \"utf-8\"."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:foreignKey",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "foreign key"
        },
        "rdfs:comment": {
          "en": "For a Table: a list of foreign keys on the table.\n\nFor a Schema: an array property of foreign key definitions that define how the values from specified columns within this table link to rows within this table or other tables."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:Table",
            "csvw:Schema"
          ]
        },
        "rdfs:range": "csvw:ForeignKey"
      },
      {
        "@id": "csvw:format",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "format"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains either a single string or an object that defines the format of a value of this type, used when parsing a string value as described in Parsing Cells in [[tabular-data-model]]."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:groupChar",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "group character"
        },
        "rdfs:comment": {
          "en": "A string whose value is used to group digits within the number."
        },
        "rdfs:domain": "csvw:NumericFormat",
        "rdfs:range": {
          "owl:unionOf": [
            "csvw:NumericFormat",
            "xsd:string"
          ]
        }
      },
      {
        "@id": "csvw:header",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "header"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property that, if `true`, sets the header row count flag to `1`, and if `false` to `0`, unless headerRowCount is provided, in which case the value provided for the header property is ignored."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:headerRowCount",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "header row count"
        },
        "rdfs:comment": {
          "en": "An numeric atomic property that sets the header row count flag to the single provided value, which must be a non-negative integer."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:lang",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "language"
        },
        "rdfs:comment": {
          "en": "An atomic property giving a single string language code as defined by [[BCP47]]."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:length",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "length"
        },
        "rdfs:comment": {
          "en": "The exact length of the value of the cell."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:lineTerminators",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "line terminators"
        },
        "rdfs:comment": {
          "en": "An atomic property that sets the line terminators flag to either an array containing the single provided string value, or the provided array."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:maxExclusive",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "max exclusive"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single number that is the maximum valid value (exclusive)."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:integer"
      },
      {
        "@id": "csvw:maxInclusive",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "max inclusive"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single number that is the maximum valid value (inclusive)."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:integer"
      },
      {
        "@id": "csvw:maxLength",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "max length"
        },
        "rdfs:comment": {
          "en": "A numeric atomic property that contains a single integer that is the maximum length of the value."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:minExclusive",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "min exclusive"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single number that is the minimum valid value (exclusive)."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:integer"
      },
      {
        "@id": "csvw:minInclusive",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "min inclusive"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single number that is the minimum valid value (inclusive)."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:integer"
      },
      {
        "@id": "csvw:minLength",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "min length"
        },
        "rdfs:comment": {
          "en": "An atomic property that contains a single integer that is the minimum length of the value."
        },
        "rdfs:domain": "csvw:Datatype",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:name",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "name"
        },
        "rdfs:comment": {
          "en": "An atomic property that gives a single canonical name for the column. The value of this property becomes the name annotation for the described column."
        },
        "rdfs:domain": "csvw:Column",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:note",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "note"
        },
        "rdfs:comment": {
          "en": "An array property that provides an array of objects representing arbitrary annotations on the annotated tabular data model."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table"
          ]
        }
      },
      {
        "@id": "csvw:null",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "null"
        },
        "rdfs:comment": {
          "en": "An atomic property giving the string or strings used for null values within the data. If the string value of the cell is equal to any one of these values, the cell value is `null`."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:ordered",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "ordered"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property taking a single value which indicates whether a list that is the value of the cell is ordered (if `true`) or unordered (if `false`)."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:pattern",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "pattern"
        },
        "rdfs:comment": {
          "en": "A regular expression string, in the syntax and interpreted as defined by [[ECMASCRIPT]]."
        },
        "rdfs:domain": "csvw:NumericFormat",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:primaryKey",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "primary key"
        },
        "rdfs:comment": {
          "en": "For Schema: A column reference property that holds either a single reference to a column description object or an array of references.\n\nFor Row: a possibly empty list of cells whose values together provide a unique identifier for this row. This is similar to the name of a column."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:Schema",
            "csvw:Row"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:propertyUrl",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "property URL"
        },
        "rdfs:comment": {
          "en": "An URI template property that MAY be used to create a URI for a property if the table is mapped to another format. "
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "csvw:uriTemplate"
      },
      {
        "@id": "csvw:quoteChar",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "quote char"
        },
        "rdfs:comment": {
          "en": "An atomic property that sets the quote character flag to the single provided value, which must be a string or `null`."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:reference",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "reference"
        },
        "rdfs:comment": {
          "en": "An object property that identifies a **referenced table** and a set of **referenced columns** within that table."
        },
        "rdfs:domain": "csvw:ForeignKey",
        "rdfs:range": "csvw:TableReference"
      },
      {
        "@id": "csvw:referencedRow",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "referenced rows"
        },
        "rdfs:comment": {
          "en": "A possibly empty list of pairs of a foreign key and a row in a table within the same group of tables."
        },
        "rdfs:domain": "csvw:Row"
      },
      {
        "@id": "csvw:required",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "required"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property taking a single value which indicates whether the cell must have a non-null value. The default is `false`. "
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:resource",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "resource"
        },
        "rdfs:comment": {
          "en": "A link property holding a URL that is the identifier for a specific table that is being referenced."
        },
        "rdfs:domain": "csvw:TableReference",
        "rdfs:range": "xsd:anyURI"
      },
      {
        "@id": "csvw:row",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "row"
        },
        "rdfs:comment": {
          "en": "Relates a Table to each Row output."
        },
        "rdfs:subPropertyOf": "rdfs:member",
        "rdfs:domain": "csvw:Table",
        "rdfs:range": "csvw:Row"
      },
      {
        "@id": "csvw:rowTitle",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "row titles"
        },
        "rdfs:comment": {
          "en": "A column reference property that holds either a single reference to a column description object or an array of references."
        },
        "rdfs:domain": "csvw:Schema",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:rownum",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "row number"
        },
        "rdfs:comment": {
          "en": "The position of the row amongst the rows of the Annotated Tabl, starting from 1"
        },
        "rdfs:range": "xsd:integer"
      },
      {
        "@id": "csvw:scriptFormat",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "script format"
        },
        "rdfs:comment": {
          "en": "A link property giving the single URL for the format that is used by the script or template."
        },
        "rdfs:domain": "csvw:Transformation",
        "rdfs:range": "xsd:anyURI"
      },
      {
        "@id": "csvw:schemaReference",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "schema reference"
        },
        "rdfs:comment": {
          "en": "A link property holding a URL that is the identifier for a schema that is being referenced."
        },
        "rdfs:domain": "csvw:TableReference",
        "rdfs:range": "xsd:anyURI"
      },
      {
        "@id": "csvw:separator",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "separator"
        },
        "rdfs:comment": {
          "en": "An atomic property that MUST have a single string value that is the character used to separate items in the string value of the cell."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:skipBlankRows",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "skip blank rows"
        },
        "rdfs:comment": {
          "en": "An boolean atomic property that sets the `skip blank rows` flag to the single provided boolean value."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:skipColumns",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "skip columns"
        },
        "rdfs:comment": {
          "en": "An numeric atomic property that sets the `skip columns` flag to the single provided numeric value, which MUST be a non-negative integer."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:skipInitialSpace",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "skip initial space"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property that, if `true`, sets the trim flag to \"start\". If `false`, to `false`."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:skipRows",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "skip rows"
        },
        "rdfs:comment": {
          "en": "An numeric atomic property that sets the `skip rows` flag to the single provided numeric value, which MUST be a non-negative integer."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:nonNegativeInteger"
      },
      {
        "@id": "csvw:source",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "source"
        },
        "rdfs:comment": {
          "en": "A single string atomic property that provides, if specified, the format to which the tabular data should be transformed prior to the transformation using the script or template."
        },
        "rdfs:domain": "csvw:Transformation",
        "rdfs:range": "xsd:string"
      },
      {
        "@id": "csvw:suppressOutput",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "suppress output"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property. If `true`, suppresses any output that would be generated when converting a table or cells within a column."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:Table",
            "csvw:Column"
          ]
        },
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:table",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "table"
        },
        "rdfs:comment": {
          "en": "Relates an Table group to annotated tables."
        },
        "rdfs:subPropertyOf": "rdfs:member",
        "rdfs:domain": "csvw:TableGroup",
        "rdfs:range": "csvw:Table"
      },
      {
        "@id": "csvw:tableDirection",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "table direction"
        },
        "rdfs:comment": {
          "en": "One of `rtl`, `ltr` or `auto`. Indicates whether the tables in the group should be displayed with the first column on the right, on the left, or based on the first character in the table that has a specific direction."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table"
          ]
        },
        "rdfs:range": "csvw:Direction"
      },
      {
        "@id": "csvw:tableSchema",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "table schema"
        },
        "rdfs:comment": {
          "en": "An object property that provides a single schema description as described in section 5.5 Schemas, used as the default for all the tables in the group"
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table"
          ]
        },
        "rdfs:range": "csvw:Schema"
      },
      {
        "@id": "csvw:targetFormat",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "target format"
        },
        "rdfs:comment": {
          "en": "A link property giving the single URL for the format that will be created through the transformation."
        },
        "rdfs:domain": "csvw:Transformation",
        "rdfs:range": "xsd:anyURI"
      },
      {
        "@id": "csvw:transformations",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "transformations"
        },
        "rdfs:comment": {
          "en": "An array property of transformation definitions that provide mechanisms to transform the tabular data into other formats."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "csvw:Transformation"
      },
      {
        "@id": "csvw:textDirection",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "text direction"
        },
        "rdfs:comment": {
          "en": "An atomic property that must have a single value that is one of `rtl` or `ltr` (the default)."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "csvw:Direction"
      },
      {
        "@id": "csvw:title",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "title"
        },
        "rdfs:comment": {
          "en": "For a Transformation A natural language property that describes the format that will be generated from the transformation.\n\nFor a Column: A natural language property that provides possible alternative names for the column."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:Transformation",
            "csvw:Column",
            "csvw:Row"
          ]
        }
      },
      {
        "@id": "csvw:trim",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "trim"
        },
        "rdfs:comment": {
          "en": "An atomic property that, if the boolean `true`, sets the trim flag to `true` and if the boolean `false` to `false`. If the value provided is a string, sets the trim flag to the provided value, which must be one of \"true\", \"false\", \"start\" or \"end\"."
        },
        "rdfs:domain": "csvw:Dialect",
        "rdfs:range": "xsd:boolean"
      },
      {
        "@id": "csvw:url",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "url"
        },
        "rdfs:comment": {
          "en": "For a Table: This link property gives the single URL of the CSV file that the table is held in, relative to the location of the metadata document.\n\nFor a Transformation: A link property giving the single URL of the file that the script or template is held in, relative to the location of the metadata document."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:Table",
            "csvw:Transformation"
          ]
        },
        "rdfs:range": "xsd:anyURI"
      },
      {
        "@id": "csvw:valueUrl",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "valueUrl"
        },
        "rdfs:comment": {
          "en": "An URI template property that is used to map the values of cells into URLs."
        },
        "rdfs:domain": {
          "owl:unionOf": [
            "csvw:TableGroup",
            "csvw:Table",
            "csvw:Schema",
            "csvw:Column"
          ]
        },
        "rdfs:range": "csvw:uriTemplate"
      },
      {
        "@id": "csvw:virtual",
        "@type": "rdf:Property",
        "rdfs:label": {
          "en": "virtual"
        },
        "rdfs:comment": {
          "en": "A boolean atomic property taking a single value which indicates whether the column is a virtual column not present in the original source"
        },
        "rdfs:domain": "csvw:Column",
        "rdfs:range": "xsd:boolean"
      }
    ],
    "rdfs_datatypes": [
      {
        "@id": "csvw:JSON",
        "@type": "rdfs:Datatype",
        "rdfs:label": {
          "en": "JSON"
        },
        "rdfs:comment": {
          "en": "A literal containing JSON."
        },
        "rdfs:subClassOf": "xsd:string"
      },
      {
        "@id": "csvw:uriTemplate",
        "@type": "rdfs:Datatype",
        "rdfs:label": {
          "en": "uri template"
        },
        "rdfs:comment": {
          "en": ""
        },
        "rdfs:subClassOf": "xsd:string"
      }
    ],
    "rdfs_instances": [
      {
        "@id": "csvw:auto",
        "@type": "Direction",
        "rdfs:label": {
          "en": "auto"
        },
        "rdfs:comment": {
          "en": "Indicates whether the tables in the group should be displayed based on the first character in the table that has a specific direction."
        }
      },
      {
        "@id": "csvw:inherit",
        "@type": "Direction",
        "rdfs:label": {
          "en": "inherit"
        },
        "rdfs:comment": {
          "en": "For `textDirection`, indicates that the direction is inherited from the `tableDirection` annotation of the `table`."
        }
      },
      {
        "@id": "csvw:ltr",
        "@type": "Direction",
        "rdfs:label": {
          "en": "left to right"
        },
        "rdfs:comment": {
          "en": "Indicates whether the tables in the group should be displayed with the first column on the right."
        }
      },
      {
        "@id": "csvw:rtl",
        "@type": "Direction",
        "rdfs:label": {
          "en": "right to left"
        },
        "rdfs:comment": {
          "en": "Indicates whether the tables in the group should be displayed with the first column on the left."
        }
      },
      {
        "@id": "csvw:csvEncodedTabularData",
        "@type": "prov:Role",
        "rdfs:label": {
          "en": "CSV Encoded Tabular Data"
        },
        "rdfs:comment": {
          "en": "Describes the role of a CSV file in the tabular data mapping."
        }
      },
      {
        "@id": "csvw:tabularMetadata",
        "@type": "prov:Role",
        "rdfs:label": {
          "en": "Tabular Metadata"
        },
        "rdfs:comment": {
          "en": "Describes the role of a Metadata file in the tabular data mapping."
        }
      }
    ]
  }
} as const;
