'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">client-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-a365bda5a8b53d50d0dc11d7473168f2cbd793e88f3ccf841d0a63313ed0e7f4bb43fc4b9b4e4805c27a0899634fd4599b59ce230c572385532ac5e21b6cb729"' : 'data-target="#xs-components-links-module-AppModule-a365bda5a8b53d50d0dc11d7473168f2cbd793e88f3ccf841d0a63313ed0e7f4bb43fc4b9b4e4805c27a0899634fd4599b59ce230c572385532ac5e21b6cb729"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-a365bda5a8b53d50d0dc11d7473168f2cbd793e88f3ccf841d0a63313ed0e7f4bb43fc4b9b4e4805c27a0899634fd4599b59ce230c572385532ac5e21b6cb729"' :
                                            'id="xs-components-links-module-AppModule-a365bda5a8b53d50d0dc11d7473168f2cbd793e88f3ccf841d0a63313ed0e7f4bb43fc4b9b4e4805c27a0899634fd4599b59ce230c572385532ac5e21b6cb729"' }>
                                            <li class="link">
                                                <a href="components/BestuurderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BestuurderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteConfirmationSheetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteConfirmationSheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Home.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Home</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavigationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TankkaartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TankkaartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TankkaartDetailDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TankkaartDetailDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TankkaartListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TankkaartListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VoertuigComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoertuigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VoertuigDetailDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoertuigDetailDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VoertuigListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoertuigListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Tankkaart.html" data-type="entity-link" >Tankkaart</a>
                            </li>
                            <li class="link">
                                <a href="classes/Voertuig.html" data-type="entity-link" >Voertuig</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DataExchangeService.html" data-type="entity-link" >DataExchangeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatastreamService.html" data-type="entity-link" >DatastreamService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ITankkaart.html" data-type="entity-link" >ITankkaart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IVoertuig.html" data-type="entity-link" >IVoertuig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});