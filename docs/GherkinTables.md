# Gherkin tables

```gherkin
Feature: Todo List

Scenario: Adding an item to my todo list
  Given my todo list currently looks as follows:
  | TaskName            | Priority |
  | Fix bugs in my code | medium   |
  | Document my hours   | medium   |
  When I add the following task:
  | TaskName                              | Priority |
  | Watch cat videos on YouTube all day   | high     |
  Then I should see the following todo list:
  | TaskName                              | Priority |  
  | Watch cat videos on YouTube all day   | high     |
  | Sign up for unemployment              | high     |
```

```javascript
const { Before, After, Given, When, Then, Fusion } = require( 'jest-cucumber-fusion' )

const { TodoList } = require( '../../src/todo-list' )
let todoList


Before( () => { todoList = new TodoList(); } )

Given( 'my todo list currently looks as follows:', table => {
    table.forEach(row => {
        todoList.add( {
            name: row.TaskName,
            priority: row.Priority
        } )
    } )
} )

When( 'I add the following task:', table => {
    todoList.add({
        name: table[0].TaskName,
        priority: table[0].Priority
    })
})

Then( 'I should see the following todo list:', table => {
    expect(todoList.items.length).toBe(table.length)

    table.forEach((row, index) => {
        expect(todoList.items[index].name).toBe(table[index].TaskName)
        expect(todoList.items[index].priority).toBe(table[index].Priority)
    } )
} )

After( () => {
    const emptyTodo = new TodoList()
    emptyTodo.add( { name: 'Empty on purpose', priority: 'so low' } )
} )


Fusion( '../features/using-gherkin-tables.feature' )
```
