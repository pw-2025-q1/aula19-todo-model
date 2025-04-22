import { TodoItem, TodoRepository } from "./model";
import { Database } from "./database";
import config from "./config";

const database: Database = new Database(config);
const todoRepository: TodoRepository = new TodoRepository(database);

/**
 * Demonstrates inserting new TodoItems into the database.
 */
async function demoInsert() {
    const newTodos = [
        {
            id: 0, // ID will be auto-generated
            description: "Learn TypeScript",
            tags: ["programming", "typescript"],
            deadline: "2023-12-31",
        },
        {
            id: 0,
            description: "Build a Todo App",
            tags: ["project", "practice"],
            deadline: "2024-01-15",
        },
        {
            id: 0,
            description: "Write Unit Tests",
            tags: ["testing", "quality"],
            deadline: "2024-02-01",
        },
    ];

    for (const todo of newTodos) {
        const result = await todoRepository.insert(todo);
        console.log("Insert Result:", result);
    }
}

/**
 * Demonstrates listing all TodoItems from the database.
 * @returns A promise that resolves to an array of TodoItems.
 */
async function demoList() {
    const todos = await todoRepository.listAll();
    console.log("All Todos:", todos);
    return todos;
}

/**
 * Demonstrates finding a TodoItem by its ID.
 * @param id - The ID of the TodoItem to find.
 * @returns A promise that resolves to the found TodoItem.
 */
async function demoFindById(id: number) {
    const todo = await todoRepository.findById(id);
    console.log("Found Todo by ID:", todo);
    return todo;
}

/**
 * Demonstrates updating a TodoItem in the database.
 * @param todo - The TodoItem to update.
 */
async function demoUpdate(todo: TodoItem) {
    const updatedTodo = { ...todo, description: "Learn Advanced TypeScript" };
    const result = await todoRepository.update(updatedTodo);
    console.log("Update Result:", result);
}

/**
 * Demonstrates removing a TodoItem from the database by its ID.
 * @param id - The ID of the TodoItem to remove.
 */
async function demoRemoveById(id: number) {
    const result = await todoRepository.removeById(id);
    console.log("Remove Result:", result);
}

/**
 * Main demonstration function showcasing various TodoRepository methods.
 */
async function demo() {
    try {        
        // Connect to the database
        await database.connect();
        console.log("=== Demonstration of TodoRepository Methods ===");

        // Insert new TodoItems
        await demoInsert();

        // List all TodoItems
        const todos = await demoList();

        // Find a TodoItem by ID
        if (todos.length > 0) {
            const todoId = todos[0].id;
            await demoFindById(todoId);

            // Update a TodoItem
            await demoUpdate(todos[0]);

            // Remove a TodoItem by ID
            await demoRemoveById(todoId);
        }
    } catch (error) {
        console.error("Error during demonstration:", error);
    } finally {
        // Disconnect from the database
        await database.disconnect();
    }
}

demo().catch((error: unknown) => {
    console.error("Error in demo function:", error);
})
