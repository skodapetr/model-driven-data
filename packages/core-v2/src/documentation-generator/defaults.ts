import { DocumentationGeneratorConfiguration } from "./generator";

export const defaultConfiguration: DocumentationGeneratorConfiguration = {
  template: `<!DOCTYPE html>
  {{#def "class"}}<a href="{{href id}}">{{#translate name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}</a>{{/def}}
  <html>
    <head>
      <meta charset="utf-8" />
      <title>{{translate package.userMetadata.label}}</title>
      <meta name="color-scheme" content="light dark">
      <script
        src="https://www.w3.org/Tools/respec/respec-w3c"
        class="remove"
        defer
      ></script>
      <script class="remove">
        // All config options at https://respec.org/docs/
        var respecConfig = {
          specStatus: "ED",
          editors: [{ name: "Dataspecer", url: "https://dataspecer.com" }]
          //github: "some-org/mySpec",
          //shortName: "dahut",
          //xref: "web-platform",
          //group: "my-working-group",
        };
      </script>
          <style>
      .figure img, .sidefigure img, figure img, .figure object, .sidefigure object, figure object, img, .img {
      max-width: 100%;
      margin: auto;
      height: auto;
      }
    </style>
    </head>
    <body>
      <section id="abstract">
        <p>
          {{#iflng "cs"}}Tento soubor dokumentuje{{lng}}This file documents{{/iflng}}
          {{#translate package.userMetadata.label}}<strong>{{translation}}</strong>{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}.</p>
      </section>
      <section id="sotd">
        <p>todo.</p>
      </section>

      {{#each semanticModels}}
        <section>
          <h1>{{#iflng "cs"}}Slovník{{lng}}Vocabulary Overview{{/iflng}}</h1>
          <h2>{{#iflng "cs"}}Třídy{{lng}}Classes{{/iflng}}</h2>
          {{#iflng "cs"}}Tato sekce popisuje všechny třídy v tomto slovníku.
          {{lng}}This section lists the classes matching the base namespace of this vocabulary.
          {{/iflng}}
          

          {{#each this}}
        
            {{#ifEquals type.[0] "class"}}
                <section id="{{anchor}}">
                <h4>{{#translate name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}</h4>

                <table class="def">
                  <tr>
                    <td>IRI</td>
                    <td><a href="{{iri}}">{{iri}}</a></td>
                  </tr>
                  {{#translate description}}
                  <tr>
                    <td>{{#iflng "cs"}}Popis{{lng}}Description{{/iflng}}</td>
                    <td>{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}</td>
                  </tr>
                  {{/translate}}
                  {{#if (parentClasses id)}}
                  <tr>
                    <td>{{#iflng "cs"}}Rodičovské třídy{{lng}}Parent classes{{/iflng}}</td>
                    <td>{{#each (parentClasses id)}}{{class}}{{#unless @last}}, {{/unless}}{{/each}}</td>
                  </tr>
                  {{/if}}
                  {{#if (subClasses id)}}
                  <tr>
                    <td>{{#iflng "cs"}}Podtřídy z tohoto slovníku{{lng}}Sub-classes{{/iflng}}</td>
                    <td>{{#each (subClasses id)}}{{class}}{{#unless @last}}, {{/unless}}{{/each}}</td>
                  </tr>
                  {{/if}}
                </table>
              </section>
            {{/ifEquals}}    
          {{/each}}
  
          {{#each this}}
            {{#ifEquals type.[0] "class-usage"}}
              <section id="{{anchor}}">
                <h4>{{#translate name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}</h4>

                <table class="def">
                  <tr>
                    <td>Internal ID</td>
                    <td><a href="{{href id}}">{{id}}</a></td>
                  </tr>
                  <tr>
                    <td>Public IRI</td>
                    <td><a href="{{iri}}">{{iri}}</a></td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{{translate description}}</td>
                  </tr>
                  <tr>
                    <td>Usage Note</td>
                    <td>{{translate usageNote}}</td>
                  </tr>
                </table>
              </section>
            {{/ifEquals}}
          {{/each}}

          <h2>{{#iflng "cs"}}Vlastnosti (atributy a asociace){{lng}}Properties (attributes and associations){{/iflng}}</h2>
          {{#each this}}
            {{#ifEquals type.[0] "relationship"}}
              <section id="{{anchor}}">

                <h4>{{#translate ends.1.name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}</h4>

                <table class="def">
                  <tr>
                    <td>IRI</td>
                    <td><a href="{{ends.1.iri}}">{{ends.1.iri}}</a></td>
                  </tr>
                  {{#translate ends.1.description}}
                  <tr>
                    <td>{{#iflng "cs"}}Popis{{lng}}Description{{/iflng}}</td>
                    <td>{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}</td>
                  </tr>
                  {{/translate}}
                  <tr>
                    <td>{{#iflng "cs"}}Doména{{lng}}Domain{{/iflng}}</td>
                    <td><a href="{{href ends.0.concept}}">{{#semanticEntity ends.0.concept}}{{#translate name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}{{/semanticEntity}}</a></td>
                  </tr>
                  <tr>
                    <td>{{#iflng "cs"}}Rozsah{{lng}}Range{{/iflng}}</td>
                    <td><a href="{{href ends.1.concept}}">{{#semanticEntity ends.1.concept}}{{#translate name}}{{translation}}{{#if otherLang}} (@{{otherLang}}){{/if}}{{else}}<i>{{#iflng "cs"}}beze jména{{lng}}without assigned name{{/iflng}}</i>{{/translate}}{{/semanticEntity}}</a></td>
                  </tr>
                </table>
              </section>
            {{/ifEquals}}
          {{/each}}


        </section>
      {{/each}}

    </body>
  </html>`,
  language: "en"
};