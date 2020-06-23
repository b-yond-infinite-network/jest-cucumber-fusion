Feature: Rocket Launching

  Scenario: Launching a SpaceX rocket
    Given I am Elon Musk attempting to launch a rocket into space
    When I launch the rocket
    Then the rocket should end up in space
    And the booster(s) should land back on the launch pad
    But nobody should doubt me ever again

  Scenario: Launching my ASCII rocket
    Given I am Elon Musk attempting to launch a rocket into space
    When I launch the '<rocket>'
    Then the rocket should end up in space
    And the booster(s) should land back on the launch pad
    But nobody should doubt me ever again

  Scenario: Launching my personal ASCII rocket
    Given I am Elon Musk attempting to launch a rocket into space
    When I launch my personal rocket named '<space poney==>'
    Then the rocket should end up in space
    And the booster(s) should land back on the launch pad
    But nobody should doubt me ever again

  Scenario: Folding ourselves in 2D
    Given I am Elon Musk attempting to launch a rocket into space
    And  my position in 2D space is [ 0, 2 ]
    When I launch the rocket
    Then the rocket should end up in space
