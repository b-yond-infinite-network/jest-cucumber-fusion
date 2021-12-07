Feature: Scenario Outline verification

    Scenario Outline: Simple Scenario Outline. Buy item: <Item>
        This scenario use Before fusion hook (see scenario-outline2.steps.js)
        This hook is remove all items from list of onlineSales if number of items >=2.
        This scenario also demonstrate case dependancy in scenario outline:
        if you are using some global variable it is not clear between scenarious.

        Given I have <nItems> items for sale
        When I bought "<Item>"
        Then I have <aItems> items for sale

        Examples:
            | nItems | Item                         | aItems |
            | 0      | Mist written by Stephen King | 1      |
            | 1      | Metallica. ReLoad.           | 2      |

    Scenario Outline: Complex Scenario Outline. <nItems>
        Given I have <nItems> items for sale
        When I bought the following items:
            | Item                         |
            | Mist written by Stephen King |
            | Metallica. ReLoad.           |

        Then I have <aItems> items for sale

        Examples:
            | nItems | aItems |
            | 0      | 2      |

    Scenario: Complex Scenario
        This scenario is necessary to make sure that related steps are working without examples.

        Given I have 0 items for sale

        When I bought the following items:
            | Item                         |
            | Mist written by Stephen King |
            | Metallica. ReLoad.           |
            | Sabaton. Great War           |

        Then I have 3 items for sale

        Then I want to sell 2 items if they in list
            | Item                 |
            | Sabaton. Great War   |
            | Cucumber for dummies |

    Scenario Outline: Using examples in sentance and in table

        Given I have 0 items for sale

        When I bought the following items:
            | Item                         |
            | Mist written by Stephen King |
            | Metallica. ReLoad.           |
            | Sabaton. Great War           |

        Then I have 3 items for sale

        Then I want to sell <nSale> items if they in list
            | Item               |
            | Sabaton. Great War |
            | <SaleItemName>     |

        Then I have <NItems> items for sale

        Examples:
            | nSale | SaleItemName                 | NItems |
            | 2     | Cucumber for dummies         | 2      |
            | 3     | Mist written by Stephen King | 1      |
