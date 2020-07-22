Feature: Online sales

    Scenario Outline: Selling an <Item>
        Given I have a(n) <Item>
        When I sell the <Item>
        Then I should get $<Amount>

        Examples:

        | Item                                           | Amount |
        | Autographed Neil deGrasse Tyson book           | 100    |
        | Rick Astley t-shirt                            | 22     |
        | An idea to replace EVERYTHING with blockchains | 0      |


    Scenario Outline: Selling all of one
        Given I want to sell all my <Item>
        When I sell all my <Item> at the price of $<Amount> CAD
        Then I should still get $<Amount>

        Examples:

            | Item                                           | Amount |
            | Autographed Neil deGrasse Tyson book           | 100    |
            | Rick Astley t-shirt                            | 22     |
            | An idea to replace EVERYTHING with blockchains | 0      |


    Scenario: Selling a thing
        Given I have an Item named '<ThatCouldLookLikeAnOutlineVariable>'
        When I sell <ThatCouldLookLikeAnOutlineVariable With Spaces in it>
        Then I get $<Amount>


    Scenario Outline: Additional regexp in outline line
        Given I want to sell all my <Item>
        When I sell all my <Item> at the price of $100 CAD
        Then I should still get $<Amount>

        Examples:
            | Item                                           | Amount |
            | Autographed Neil deGrasse Tyson book           | 100    |
            | Rick Astley t-shirt                            | 100    |


    Scenario Outline: Additional regexp in outline line with non-string variables for <Item>
        Given I want to sell all my <Item>
        When I sell all my <Item> with a starting price of $<StartingPrice> at the rebate price of $100
        Then I should still get $<Amount>

        Examples:
            | Item                                           | StartingPrice    | Amount    |
            | Autographed Neil deGrasse Tyson book           | 100              | 100       |
            | Rick Astley t-shirt                            | 22               | 100       |
#
#
    Scenario Outline: Additional regexp in outline line with non-string variables and static one in the middle for <Item>
        Given I want to sell all my <Item>
        When I sell all my <Item> with a starting price of $100 at the rebate price of $<RebatePrice>
        Then I should still get $<Amount>

        Examples:
            | Item                                           | RebatePrice      | Amount    |
            | Autographed Neil deGrasse Tyson book           | 20               | 20        |
            | Rick Astley t-shirt                            | 50               | 50        |


    Scenario Outline: Additional regepx in outline line with non-string variable at the end for <Item>
        Given I want to sell all my <Item>
        When I sell all my <Item> with a starting price of $100 at the rebate price of $<RebatePrice>
        Then the 1st item 1st price has a price amount of <Amount> which is a 'Number'

        Examples:
            | Item                                           | RebatePrice      | Amount    |
            | Autographed Neil deGrasse Tyson book           | 20               | 20        |
            | Rick Astley t-shirt                            | 50               | 50        |
# Ability: this ones are not currently possible
##
#    Scenario Outline: Additional mix regexp and non-regexp in outline line with non-string variables and static one in the middle for <Item>
#        Given I want to sell all my <Item>
#        When I sell all my <Item> with a starting price <Description> price of <RebatePrice>$ <Currency> which is nice
#        Then I should still get $<Amount>
#
#        Examples:
#            | Item                                           | Description                  | RebatePrice   | Amount | Currency         |
#            | Autographed Neil deGrasse Tyson book           | of $100 at the fantastic     | 20            | 20     | USD              |
#            | Rick Astley t-shirt                            | of $100 at the fantastic     | 50            | 50     | CAD              |
#            | Rick Astley t-shirt                            | of $100 at the rebate        | 50            | 50     | CAD              |
