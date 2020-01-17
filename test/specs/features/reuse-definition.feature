Feature: Rocket reuse

Scenario: Reusing a SpaceX rocket
  Given I am Elon Musk and I launched a rocket in space already
  When I relaunch the rocket
  Then the rocket end up in space again
  And I drop my mic

  Scenario: Reading the critics
    Given I am Elon Musk and I launched a rocket in space already
    When I relaunch the rocket
    Then the mission was said to be 'a success'
    And the mission was said to be 'a wonder'
