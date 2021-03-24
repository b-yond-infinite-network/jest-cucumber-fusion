# language: nl

Functionaliteit: Online verkopen

    Scenario: t-shirt verkopen
        Gegeven ik heb een t-shirt
        Als ik een t-shirt wil verkopen
        Dan ontvang ik €22
        En ben ik blij
        Maar heb ik geen t-shirts over

    Abstract Scenario: <Object> verkopen
        Gegeven ik heb een: <Object>
        Als ik <Object> verkoop
        Dan zou ik er €<Bedrag> voor moeten krijgen

        Voorbeelden:

            | Object                                         | Bedrag |
            | Autographed Neil deGrasse Tyson book           | 100    |
            | Rick Astley t-shirt                            | 22     |
            | An idea to replace EVERYTHING with blockchains | 0      |

    Scenario: Boek kopen
        Gegeven 'Autographed Neil deGrasse Tyson book' is te koop
        Als ik 'Autographed Neil deGrasse Tyson book' koop
        Dan heb ik €100 uitgegeven

    Scenario: voorraad bijvullen
        Gegeven mijn voorraad bevat:
            | Object                               |
            | Autographed Neil deGrasse Tyson book |
            | Rick Astley t-shirt                  |
        Als ik de volgende producten toevoeg:
            | Object            |
            | Smurfen stripboek |
        Dan zitten er 3 objecten in mijn voorraad, bestaant uit:
            | Object                               |
            | Autographed Neil deGrasse Tyson book |
            | Rick Astley t-shirt                  |
            | Smurfen stripboek                    |