Feature: Getting rich writing software

  # Scenario: Depositing a paycheck
  #   Given I open new account with 'Cash' name
  #   Given my account#1 balance is $10
  #   When I get paid $1000000 for writing some awesome code from my account#1
  #   Then my account#1 balance should be $1000010

  # Scenario: Testing simple inception
  #   Given I open new account with 'Cash' name
  #   Given my account#1 name is 'a'
  #   When I get an new account#1 name 'name' with a type Test from my old account named 'a'
  #   Then my account#1 name should be "name" and have a type Test

  Scenario Outline: Testing mix examples and tables
    Given I open new account with 'Cash' name
    Given I open new account with 'Deposit' name

    Given my account#1 balance is $<balance1>
    Given my account#2 balance is $<balance2>

    Then I have <NAccounts> accounts

    Then my account#1 should be:
    | field   | value      |
    | name    | Cash       |
    | balance | <balance1> |
    | type    | Account    |

  Examples:
      | NAccounts | balance1 | balance2 |
      | 2         | 10000    | 1234     |