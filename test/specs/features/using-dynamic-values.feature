Feature: Getting rich writing software

  Scenario: Depositing a paycheck
    Given I open new account with 'Cash' name
    Given my account#1 balance is $10
    When I get paid $1000000 for writing some awesome code from my account#1
    Then my account#1 balance should be $1000010

  Scenario: Testing simple inception
    Given I open new account with 'Cash' name
    Given my account#1 name is 'a'
    When I get an new account#1 name 'name' with a type Test from my old account named 'a'
    Then my account#1 name should be "name" and have a type Test

  Scenario Outline: Using examples in step RegExp and step Table at the same time. <Description>
    Given I open new account with 'Cash' name
    Given I open new account with 'Deposit' name

    Given my account#1 balance is $10000
    Given my account#2 balance is $1234

    Then I have <NAccounts> accounts

    # Use test step with parameter in step RegExp and paramter in step Table
    Then my account#<accN> should be:
      | field   | value     |
      | name    | <Type>    |
      | balance | <balance> |
      | type    | Account   |

    Examples:
      | NAccounts | accN | Type    | balance | Description     |
      | 2         | 1    | Cash    | 10000   | First Scenario  |
      | 2         | 2    | Deposit | 1234    | Second Scenario |