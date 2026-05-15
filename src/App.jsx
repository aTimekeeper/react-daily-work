import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-reminder.tasks'

const initialTasks = [
  {
    id: crypto.randomUUID(),
    title: '整理今天最重要的三件事',
    note: '给自己一个清晰的起点。',
    dueAt: '',
    priority: 'medium',
    completed: false,
    reminded: false,
    createdAt: new Date().toISOString(),
  },
]

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
}

const filterLabels = {
  all: '全部',
  active: '待完成',
  today: '今天',
  overdue: '已逾期',
  completed: '已完成',
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialTasks
  } catch {
    return initialTasks
  }
}

function formatDateTime(value) {
  if (!value) return '未设置提醒'

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

function getTaskStatus(task) {
  if (task.completed) return 'completed'
  if (!task.dueAt) return 'open'

  const now = new Date()
  const due = new Date(task.dueAt)

  if (due < now) return 'overdue'
  if (isSameDay(due, now)) return 'today'
  return 'scheduled'
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    title: '',
    note: '',
    dueAt: '',
    priority: 'medium',
  })
  const [notificationStatus, setNotificationStatus] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          const shouldRemind =
            task.dueAt &&
            !task.completed &&
            !task.reminded &&
            new Date(task.dueAt).getTime() <= Date.now()

          if (!shouldRemind) return task

          if (Notification.permission === 'granted') {
            new Notification(`待办提醒：${task.title}`, {
              body: task.note || '该处理这项任务了。',
            })
          }

          return { ...task, reminded: true }
        }),
      )
    }, 15000)

    return () => window.clearInterval(timer)
  }, [])

  const stats = useMemo(() => {
    const active = tasks.filter((task) => !task.completed).length
    const overdue = tasks.filter((task) => getTaskStatus(task) === 'overdue').length
    const today = tasks.filter((task) => getTaskStatus(task) === 'today').length

    return { active, overdue, today, total: tasks.length }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const status = getTaskStatus(task)
        if (filter === 'all') return true
        if (filter === 'active') return !task.completed
        if (filter === 'today') return status === 'today'
        if (filter === 'overdue') return status === 'overdue'
        return status === filter
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
        if (!a.dueAt && !b.dueAt) return 0
        if (!a.dueAt) return 1
        if (!b.dueAt) return -1
        return new Date(a.dueAt) - new Date(b.dueAt)
      })
  }, [filter, tasks])

  function updateForm(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function addTask(event) {
    event.preventDefault()
    const title = form.title.trim()

    if (!title) return

    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        note: form.note.trim(),
        dueAt: form.dueAt,
        priority: form.priority,
        completed: false,
        reminded: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ])
    setForm({ title: '', note: '', dueAt: '', priority: 'medium' })
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function removeTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  async function requestNotifications() {
    if (typeof Notification === 'undefined') {
      setNotificationStatus('unsupported')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationStatus(permission)
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="待办概览">
        <div>
          <p className="eyebrow">Todo Reminder</p>
          <h1>待办事项提醒工具</h1>
        </div>
        <button className="ghost-button" type="button" onClick={requestNotifications}>
          {notificationStatus === 'granted' ? '提醒已开启' : '开启桌面提醒'}
        </button>
      </section>

      <section className="summary-grid" aria-label="任务统计">
        <div>
          <span>{stats.active}</span>
          <p>待完成</p>
        </div>
        <div>
          <span>{stats.today}</span>
          <p>今天提醒</p>
        </div>
        <div>
          <span>{stats.overdue}</span>
          <p>已逾期</p>
        </div>
        <div>
          <span>{stats.total}</span>
          <p>全部任务</p>
        </div>
      </section>

      <section className="workspace">
        <form className="task-form" onSubmit={addTask}>
          <h2>新增待办</h2>
          <label>
            事项
            <input
              value={form.title}
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="例如：16:00 前提交周报"
            />
          </label>
          <label>
            备注
            <textarea
              value={form.note}
              onChange={(event) => updateForm('note', event.target.value)}
              placeholder="补充地点、链接或注意事项"
              rows="4"
            />
          </label>
          <div className="form-row">
            <label>
              提醒时间
              <input
                type="datetime-local"
                value={form.dueAt}
                onChange={(event) => updateForm('dueAt', event.target.value)}
              />
            </label>
            <label>
              优先级
              <select
                value={form.priority}
                onChange={(event) => updateForm('priority', event.target.value)}
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </label>
          </div>
          <button className="primary-button" type="submit">
            添加任务
          </button>
        </form>

        <section className="task-panel" aria-label="任务列表">
          <div className="panel-head">
            <h2>任务列表</h2>
            <div className="filters" aria-label="筛选任务">
              {Object.entries(filterLabels).map(([key, label]) => (
                <button
                  className={filter === key ? 'active' : ''}
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <h3>这里暂时很安静</h3>
                <p>添加一个带提醒时间的待办，它会自动保存到本地浏览器。</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const status = getTaskStatus(task)

                return (
                  <article className={`task-card ${status}`} key={task.id}>
                    <button
                      aria-label={task.completed ? '标记为未完成' : '标记为完成'}
                      className="check-button"
                      type="button"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? '✓' : ''}
                    </button>
                    <div className="task-content">
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <span className={`priority ${task.priority}`}>
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                      {task.note && <p>{task.note}</p>}
                      <div className="task-meta">
                        <span>{formatDateTime(task.dueAt)}</span>
                        {status === 'overdue' && <strong>已逾期</strong>}
                        {status === 'today' && <strong>今天</strong>}
                        {task.reminded && !task.completed && <strong>已提醒</strong>}
                      </div>
                    </div>
                    <button
                      aria-label="删除任务"
                      className="delete-button"
                      type="button"
                      onClick={() => removeTask(task.id)}
                    >
                      ×
                    </button>
                  </article>
                )
              })
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
