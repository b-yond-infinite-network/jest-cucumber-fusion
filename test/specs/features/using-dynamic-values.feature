Feature: Getting rich writing software

  Scenario: Depositing a paycheck
    Given my account balance is $10
    When I get paid $1000000 for writing some awesome code
    Then my account balance should be $1000010

  Scenario: Testing simple inception
    Given my account name is 'a'
    When I get an new account name 'name' with a type Test from my old account named 'a'
    Then my account name should be "name" and have a type Test

