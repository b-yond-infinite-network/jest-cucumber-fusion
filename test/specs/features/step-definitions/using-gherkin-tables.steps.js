const { Before, After, Given, When, Then, Fusion } = require( '../../../../src' )

const { TodoList } = require( '../../../src/todo-list' )

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
    });
});

Then( /^I should see the following (\d) todos in my list:$/, (nbre, table) => {
    expect(todoList.items.length).toBe(parseInt(nbre))
    expect(todoList.items.length).toBe(table.length)

    table.forEach((row, index) => {
        expect(todoList.items[index].name).toBe(table[index].TaskName);
        expect(todoList.items[index].priority).toBe(table[index].Priority);
    } )
} )

After( () => {
    const emptyTodo = new TodoList()
    emptyTodo.add( { name: 'Empty on purpose', priority: 'so low' } )
} )

Fusion( '../using-gherkin-tables.feature' )
