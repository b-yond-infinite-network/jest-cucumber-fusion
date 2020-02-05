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
        When I sell all my <Item> at the price of $<Amount>
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
