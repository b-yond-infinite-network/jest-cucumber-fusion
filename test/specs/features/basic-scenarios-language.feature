# language: nl

# basic
Functionaliteit: Raket lancering

    Scenario: Lanceer een SpaceX raket
        Gegeven ik ben Elon Musk die probeert een raket te lanceren in de ruimte
        Als ik een raket lanceer
        Dan zou de raket in de ruimte moeten belanden
        En de booster(s) zouden terug moeten landen op het lanceerplatform
        Maar niemand mag nog ooit in mij twijfelen

    Scenario: Lanceer mijn ASCII raket
        Gegeven ik ben Elon Musk die probeert een raket te lanceren in de ruimte
        Als ik de '<raket>' lanceer
        Dan zou de raket in de ruimte moeten belanden
        En de booster(s) zouden terug moeten landen op het lanceerplatform
        Maar niemand mag nog ooit in mij twijfelen

    Scenario: Lanceren van mijn persoonlijke ASCII raket
        Gegeven ik ben Elon Musk die probeert een raket te lanceren in de ruimte
        Als ik mijn persoonlijke raket benoemd '<space poney==>'
        Dan zou de raket in de ruimte moeten belanden
        En de booster(s) zouden terug moeten landen op het lanceerplatform
        Maar niemand mag nog ooit in mij twijfelen

    Scenario: Onszelf poisitioneren in 2D
        Gegeven ik ben Elon Musk die probeert een raket te lanceren in de ruimte
        En mijn positie in de ruimte is [ 0, 2 ]
        # "Wanneer" does not work somehow, "Als" is a synonym, fix this later.
        Als ik een raket lanceer
        Dan zou de raket in de ruimte moeten belanden
