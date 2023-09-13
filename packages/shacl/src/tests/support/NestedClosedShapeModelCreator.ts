import {
    StructureModel,
    StructureModelClass,
    StructureModelComplexType,
    StructureModelProperty,
    StructureModelPrimitiveType,
    StructureModelSchemaRoot,
  } from "@dataspecer/core/structure-model/model";
  import { ArtefactGeneratorContext } from "@dataspecer/core/generator";
  import { DataSpecificationArtefact } from "@dataspecer/core/data-specification/model";
  import ModelCreator from "./ModelCreatorInterface";

class NestedClosedShapeModelCreator implements ModelCreator{

  createModel(): StructureModel{
    var model = new StructureModel();
  
      var zipType : StructureModelPrimitiveType;
      zipType = new StructureModelPrimitiveType();
      zipType.dataType = "http://www.w3.org/2001/XMLSchema#integer";
      zipType.example = null;
      zipType.regex = "^\d{3}(?:[-\s]\d{2}){1}$";

      var primitiveType1 : StructureModelPrimitiveType;
      primitiveType1 = new StructureModelPrimitiveType();
      primitiveType1.dataType = "http://www.w3.org/2001/XMLSchema#integer";
      primitiveType1.example = null;
      primitiveType1.regex = null;

      var dateType : StructureModelPrimitiveType;
      dateType = new StructureModelPrimitiveType();
      dateType.dataType = "http://www.w3.org/2001/XMLSchema#date";
      dateType.example = null;
      dateType.regex = null;

      var primitiveType8 : StructureModelPrimitiveType;
      primitiveType8 = new StructureModelPrimitiveType();
      primitiveType8.dataType = "http://www.w3.org/2001/XMLSchema#string";
      primitiveType8.example = null;
      primitiveType8.regex = null;

      var street : StructureModelProperty;
      street = new StructureModelProperty();
      street.cardinalityMax = 1;
      street.cimIri = "https://example.com/Ulice";
      street.dataTypes = [primitiveType8];
      street.dematerialize = false;
      street.humanDescription = {["cs"]: "Ulice bydliště"};
      street.humanLabel = {["cs"]: "ulice"};
      street.isReverse = false;
      street.pimIri = "https://example.com/mojePimIriUlice";
      street.psmIri = "https://example.com/mojePsmIriUlice";
      street.technicalLabel = "ulice-popisek";

      var bn : StructureModelProperty;
      bn = new StructureModelProperty();
      bn.cardinalityMax = 1;
      bn.cardinalityMin = 1;
      bn.cimIri = "https://example.com/CisloPopisne";
      bn.dataTypes = [primitiveType1];
      bn.dematerialize = false;
      bn.humanDescription = {["cs"]: "Číslo popisné dané budovy"};
      bn.humanLabel = {["cs"]: "Číslo popisné"};
      bn.isReverse = false;
      bn.pimIri = "https://example.com/mojePimIriCisloPopisne";
      bn.psmIri = "https://example.com/mojePsmIriCisloPopisne";
      bn.technicalLabel = "cislo-popisne-popisek";

      var city : StructureModelProperty;
      city = new StructureModelProperty();
      city.cardinalityMax = 1;
      city.cardinalityMin = 1;
      city.cimIri = "https://example.com/Mesto";
      city.dataTypes = [primitiveType8];
      city.dematerialize = false;
      city.humanDescription = {["cs"]: "Město, ve kterém se nachází budova"};
      city.humanLabel = {["cs"]: "Město"};
      city.isReverse = false;
      city.pimIri = "https://example.com/mojePimIriMesto";
      city.psmIri = "https://example.com/mojePsmIriMesto";
      city.technicalLabel = "mesto-popisek";

      var zipcode : StructureModelProperty;
      zipcode = new StructureModelProperty();
      zipcode.cardinalityMax = 1;
      zipcode.cardinalityMin = 1;
      zipcode.cimIri = "https://example.com/PSC";
      zipcode.dataTypes = [zipType];
      zipcode.dematerialize = false;
      zipcode.humanDescription = {["cs"]: "Poštovní směrovací číslo"};
      zipcode.humanLabel = {["cs"]: "PSČ"};
      zipcode.isReverse = false;
      zipcode.pimIri = "https://example.com/mojePimIriPSC";
      zipcode.psmIri = "https://example.com/mojePsmIriPSC";
      zipcode.technicalLabel = "psc-popisek";

      var country : StructureModelProperty;
      country = new StructureModelProperty();
      country.cardinalityMax = 1;
      country.cardinalityMin = 1;
      country.cimIri = "https://example.com/Stat";
      country.dataTypes = [primitiveType8];
      country.dematerialize = false;
      country.humanDescription = {["cs"]: "Stát - země, ve které se objekt nachází"};
      country.humanLabel = {["cs"]: "Stát"};
      country.isReverse = false;
      country.pimIri = "https://example.com/mojePimIriStat";
      country.psmIri = "https://example.com/mojePsmIriStat";
      country.technicalLabel = "stat-popisek";

      var class2 : StructureModelClass;
      class2 = new StructureModelClass();
      class2.cimIri = "https://example.com/class2/adresa";
      class2.codelistUrl = ["https://example.com/class1/codelistIri"];
      class2.example = null;
      class2.humanDescription = {["cs"]: "Adresa bydliště dané osoby"};
      class2.humanLabel = {["cs"]: "Adresa", ["pl"]: "Adres"};
      class2.pimIri = "https://example.com/class1/mojePimIriadresa";
      class2.properties = [street, bn, city, zipcode, country];
      class2.psmIri = "https://example.com/class1/mojePsmIriadresa";
      class2.regex = null;
      class2.specification = null;
      class2.structureSchema = null;
      class2.technicalLabel = "adresa";

      var complexType1 : StructureModelComplexType;
      complexType1 = new StructureModelComplexType();
      complexType1.dataType = class2;

      var property1 : StructureModelProperty;
      property1 = new StructureModelProperty();
      property1.cardinalityMax = 1;
      property1.cardinalityMin = 1;
      property1.cimIri = "https://example.com/Adresa";
      property1.dataTypes = [complexType1];
      property1.dematerialize = false;
      property1.humanDescription = {["cs"]: "Adresa bydliště dané osoby"};
      property1.humanLabel = {["cs"]: "Adresa"};
      property1.isReverse = false;
      property1.pimIri = "https://example.com/mojePimIriadresa";
      property1.psmIri = "https://example.com/mojePsmIriadresa";
      property1.technicalLabel = "adresa-popisek";

      var birthdate : StructureModelProperty;
      birthdate = new StructureModelProperty();
      birthdate.cardinalityMax = 1;
      birthdate.cardinalityMin = 1;
      birthdate.cimIri = "https://example.com/Narozeni";
      birthdate.dataTypes = [dateType];
      birthdate.dematerialize = false;
      birthdate.humanDescription = {["cs"]: "Datum narození dané osoby"};
      birthdate.humanLabel = {["cs"]: "Datum narození"};
      birthdate.isReverse = false;
      birthdate.pimIri = "https://example.com/mojePimIriPSC";
      birthdate.psmIri = "https://example.com/mojePsmIriPSC";
      birthdate.technicalLabel = "narozeni-popisek";

      var deathdate : StructureModelProperty;
      deathdate = new StructureModelProperty();
      deathdate.cardinalityMax = 1;
      deathdate.cardinalityMin = 0;
      deathdate.cimIri = "https://example.com/Umrti";
      deathdate.dataTypes = [dateType];
      deathdate.dematerialize = false;
      deathdate.humanDescription = {["cs"]: "Datum úmrtí osoby"};
      deathdate.humanLabel = {["cs"]: "Datum úmrtí"};
      deathdate.isReverse = false;
      deathdate.pimIri = "https://example.com/mojePimIriStat";
      deathdate.psmIri = "https://example.com/mojePsmIriStat";
      deathdate.technicalLabel = "umrti-popisek";

      var class4 : StructureModelClass;
      class4 = new StructureModelClass();
      class4.cimIri = "https://example.com/Narozeni_a_umrti_class";
      class4.codelistUrl = ["https://example.com/class1/codelistIri"];
      class4.example = null;
      class4.humanDescription = {["cs"]: "Datum narození a úmrtí dané osoby"};
      class4.humanLabel = {["cs"]: "Datum narození a úmrtí", ["en"]: "Date of birth and death"};
      class4.pimIri = "https://example.com/class1/mojePimIriadresa";
      class4.properties = [birthdate, deathdate];
      class4.psmIri = "https://example.com/class1/mojePsmIriadresa";
      class4.regex = null;
      class4.isClosed = true;
      class4.specification = null;
      class4.structureSchema = null;
      class4.technicalLabel = "narozeni-a-umrti";

      var complexType3 : StructureModelComplexType;
      complexType3 = new StructureModelComplexType();
      complexType3.dataType = class4;

      var property3 : StructureModelProperty;
      property3 = new StructureModelProperty();
      property3.cardinalityMax = 1;
      property3.cardinalityMin = 1;
      property3.cimIri = "https://example.com/Narozeni_a_umrti";
      property3.dataTypes = [complexType3];
      property3.dematerialize = false;
      property3.humanDescription = {["cs"]: "Datum narození a úmrtí dané osoby"};
      property3.humanLabel = {["cs"]: "Datum narození a úmrtí"};
      property3.isReverse = false;
      property3.pimIri = "https://example.com/mojePimIriadresa";
      property3.psmIri = "https://example.com/mojePsmIriadresa";
      property3.technicalLabel = "narozeni-a-umrti-popisek";

      var surname : StructureModelProperty;
      surname = new StructureModelProperty();
      surname.cardinalityMax = 2;
      surname.cardinalityMin = 1;
      surname.cimIri = "https://example.com/Prijmeni";
      surname.dataTypes = [primitiveType8];
      surname.dematerialize = false;
      surname.humanDescription = {["cs"]: "Příjmení"};
      surname.humanLabel = {["cs"]: "Příjmení"};
      surname.isReverse = false;
      surname.pimIri = "https://example.com/mojePimIriPSC";
      surname.psmIri = "https://example.com/mojePsmIriPSC";
      surname.technicalLabel = "prijmeni-popisek";

      var name : StructureModelProperty;
      name = new StructureModelProperty();
      name.cardinalityMax = 2;
      name.cardinalityMin = 1;
      name.cimIri = "https://example.com/Jmeno";
      name.dataTypes = [primitiveType8];
      name.dematerialize = false;
      name.humanDescription = {["cs"]: "Jméno osoby"};
      name.humanLabel = {["cs"]: "Jméno"};
      name.isReverse = false;
      name.pimIri = "https://example.com/mojePimIriStat";
      name.psmIri = "https://example.com/mojePsmIriStat";
      name.technicalLabel = "jmeno-popisek";

      var class3 : StructureModelClass;
      class3 = new StructureModelClass();
      class3.cimIri = "https://example.com/Jmeno_A_Prijmeni_class";
      class3.codelistUrl = ["https://example.com/class1/codelistIri"];
      class3.example = null;
      class3.humanDescription = {["cs"]: "Jméno a příjmení dané osoby"};
      class3.humanLabel = {["cs"]: "Jméno a příjmení", ["en"]: "First and last name"};
      class3.pimIri = "https://example.com/class1/mojePimIriadresa";
      class3.properties = [name, surname];
      class3.psmIri = "https://example.com/class1/mojePsmIriadresa";
      class3.regex = null;
      class3.isClosed = true;
      class3.specification = null;
      class3.structureSchema = null;
      class3.technicalLabel = "adresa";

      var complexType2 : StructureModelComplexType;
      complexType2 = new StructureModelComplexType();
      complexType2.dataType = class3;

      var property2 : StructureModelProperty;
      property2 = new StructureModelProperty();
      property2.cardinalityMax = 1;
      property2.cardinalityMin = 1;
      property2.cimIri = "https://example.com/Jmeno_A_Prijmeni";
      property2.dataTypes = [complexType2];
      property2.dematerialize = false;
      property2.humanDescription = {["cs"]: "Jméno a příjmení dané osoby"};
      property2.humanLabel = {["cs"]: "Jméno a příjmení"};
      property2.isReverse = false;
      property2.pimIri = "https://example.com/mojePimIriadresa";
      property2.psmIri = "https://example.com/mojePsmIriadresa";
      property2.technicalLabel = "jmeno-a-prijmeni-popisek";

      var class1 : StructureModelClass;
      class1 = new StructureModelClass();
      class1.cimIri = "https://example.com/class1/mojeCimIri";
      class1.codelistUrl = ["https://example.com/class1/codelistIri"];
      class1.example = null;
      //class1.extends = null;
      class1.humanDescription = {["cs"]: "Class 1 Popisek 1"};
      class1.humanLabel = {["cs"]: "Class 1 Label 1"};
      class1.pimIri = "https://example.com/class1/mojePimIri";
      class1.properties = [property1, property2, property3];
      class1.psmIri = "https://example.com/class1/mojePsmIri";
      class1.regex = null;
      class1.specification = null;
      class1.structureSchema = null;
      class1.technicalLabel = "osoba";
  
      var root1 : StructureModelSchemaRoot;
      root1 = new StructureModelSchemaRoot();
      root1.classes = [class1];
  
      model.roots = [root1];
  
    return model;
  }
}

export default NestedClosedShapeModelCreator;