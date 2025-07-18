import { useState, useEffect } from 'react'
import { supabase, Todo, TodoPriority } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function TodoList({ session }: { session: Session }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDeadline, setNewDeadline] = useState('')
  const [newPriority, setNewPriority] = useState<TodoPriority>('medium')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title: newTodo, 
          description: newDescription.trim() || null,
          deadline: newDeadline || null,
          priority: newPriority,
          user_id: session.user.id 
        }])
        .select()
        .single()

      if (error) throw error
      setTodos([data, ...todos])
      setNewTodo('')
      setNewDescription('')
      setNewDeadline('')
      setNewPriority('medium')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="todo-container">
      <div className="header">
        <h1>My Todos</h1>
        <button onClick={signOut} className="sign-out">Sign Out</button>
      </div>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Deadline (optional)"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TodoPriority)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <div>
                <span>{todo.title}</span>
                <span className={`todo-priority priority-${todo.priority}`}>
                  {todo.priority.toUpperCase()}
                </span>
                {todo.description && (
                  <p className="todo-description">{todo.description}</p>
                )}
                {todo.deadline && (
                  <p className="todo-deadline">Due: {new Date(todo.deadline).toLocaleDateString()}</p>
                )}
              </div>
            </label>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}